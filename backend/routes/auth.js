const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Kendra = require("../models/Kendra");
const KendraApplication = require("../models/KendraApplication");
const { requireDb } = require("../config/db");
const { authenticate } = require("../middleware/auth");
const {
  signUserToken,
  signAdminToken,
  setAuthCookie,
  clearAuthCookie,
  publicUser,
  adminPublicUser,
  safeEqual,
} = require("../utils/auth");
const { createVerificationToken, hashToken } = require("../utils/verification");
const { sendVerificationEmail } = require("../services/emailService");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_RULES = [
  { pattern: /[A-Z]/, label: "one uppercase letter" },
  { pattern: /[a-z]/, label: "one lowercase letter" },
  { pattern: /[0-9]/, label: "one number" },
  { pattern: /[^A-Za-z0-9\s]/, label: "one special character" },
];
const KENDRA_ROLE = "kendra_owner";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isAdminEmail(email) {
  return normalizeEmail(email) === normalizeEmail(process.env.ADMIN_EMAIL || "admin@rxcompare.gov.in");
}

function appBaseUrl() {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
}

function verificationLink(token) {
  return `${appBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
}

function validatePassword(password, errors) {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
    return false;
  }

  const missing = PASSWORD_RULES.filter((rule) => !rule.pattern.test(password)).map(
    (rule) => rule.label
  );
  if (missing.length > 0) {
    errors.push(`password must contain at least ${missing.join(", ")}`);
    return false;
  }

  return true;
}

function validateEmail(email, errors) {
  if (!EMAIL_RE.test(normalizeEmail(email))) {
    errors.push("a valid email address is required");
    return false;
  }
  return true;
}

async function generateKendraCode() {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const code = `PMBJK${Math.floor(10000 + Math.random() * 89999)}`;
    const [existingStore, existingApplication] = await Promise.all([
      Kendra.exists({ kendraCode: code }),
      KendraApplication.exists({ kendraCode: code }),
    ]);
    if (!existingStore && !existingApplication) return code;
  }
  // Extremely unlikely fallback: include a timestamp fragment.
  return `PMBJK${Date.now().toString().slice(-6)}`;
}

async function issueVerification(user, role) {
  const { token, tokenHash, expiresAt } = createVerificationToken();
  user.verificationTokenHash = tokenHash;
  user.verificationTokenExpiresAt = expiresAt;
  await user.save();

  const link = verificationLink(token);
  let emailSent = true;
  let emailPreviewUrl = null;

  try {
    const info = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      role,
      link,
    });
    emailPreviewUrl = info.previewUrl || null;
  } catch (err) {
    emailSent = false;
    console.error("[auth] verification email failed:", err.message);
  }

  // Always log the link so development works even without an email inbox.
  console.log(`[auth] verification link for ${user.email}: ${link}`);

  return {
    emailSent,
    emailPreviewUrl,
    // Exposed only outside production to make manual testing easy.
    devVerificationUrl: process.env.NODE_ENV === "production" ? undefined : link,
  };
}

// ---------------------------------------------------------------------------
// Customer registration
// ---------------------------------------------------------------------------
router.post("/register/customer", requireDb, async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body || {};
    const errors = [];

    if (!name || !String(name).trim()) errors.push("full name is required");
    if (!validateEmail(email, errors)) {
      // message already pushed
    }
    validatePassword(password, errors);
    if (isAdminEmail(email)) errors.push("this email address is reserved");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: "Validation failed", details: errors });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      if (!existing.emailVerified) {
        const issued = await issueVerification(existing, existing.role);
        return res.status(409).json({
          success: false,
          code: "EMAIL_EXISTS_UNVERIFIED",
          error: "An account with this email already exists but is not verified. A new verification link has been sent.",
          ...issued,
        });
      }
      return res.status(409).json({
        success: false,
        code: "EMAIL_EXISTS",
        error: "An account with this email already exists. Please sign in instead.",
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: "customer",
      phone: phone ? String(phone).trim() : "",
      address: address ? String(address).trim() : "",
      status: "active",
      emailVerified: false,
    });

    const issued = await issueVerification(user, "customer");

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account before signing in.",
      user: publicUser(user),
      ...issued,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Kendra (medical shop) owner registration
// ---------------------------------------------------------------------------
router.post("/register/kendra", requireDb, async (req, res, next) => {
  try {
    const {
      kendraName,
      ownerName,
      email,
      password,
      phone,
      address,
      city,
      district,
      state,
      pincode,
      licenseNumber,
      operatingHours,
      lat,
      lng,
    } = req.body || {};

    const errors = [];
    if (!kendraName || !String(kendraName).trim()) errors.push("Kendra name is required");
    if (!ownerName || !String(ownerName).trim()) errors.push("owner name is required");
    if (!validateEmail(email, errors)) {
      // message already pushed
    }
    validatePassword(password, errors);
    if (isAdminEmail(email)) errors.push("this email address is reserved");
    if (!phone || !String(phone).trim()) errors.push("phone number is required");
    if (!address || !String(address).trim()) errors.push("shop address is required");
    if (!city || !String(city).trim()) errors.push("city is required");
    if (!state || !String(state).trim()) errors.push("state is required");
    if (!licenseNumber || !String(licenseNumber).trim()) errors.push("drug license number is required");

    const numLat = Number(lat);
    const numLng = Number(lng);
    if (!Number.isFinite(numLat) || numLat < -90 || numLat > 90) {
      errors.push("a valid shop latitude is required (-90 to 90)");
    }
    if (!Number.isFinite(numLng) || numLng < -180 || numLng > 180) {
      errors.push("a valid shop longitude is required (-180 to 180)");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: "Validation failed", details: errors });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      if (!existing.emailVerified) {
        const issued = await issueVerification(existing, existing.role);
        return res.status(409).json({
          success: false,
          code: "EMAIL_EXISTS_UNVERIFIED",
          error: "An account with this email already exists but is not verified. A new verification link has been sent.",
          ...issued,
        });
      }
      return res.status(409).json({
        success: false,
        code: "EMAIL_EXISTS",
        error: "An account with this email already exists. Please sign in instead.",
      });
    }

    const passwordHash = await User.hashPassword(password);
    const kendraCode = await generateKendraCode();

    const user = await User.create({
      name: String(ownerName).trim(),
      email: normalizedEmail,
      passwordHash,
      role: KENDRA_ROLE,
      phone: String(phone).trim(),
      address: String(address).trim(),
      status: "pending",
      emailVerified: false,
    });

    await KendraApplication.create({
      kendraCode,
      ownerUserId: user._id,
      name: String(kendraName).trim(),
      ownerName: String(ownerName).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      address: String(address).trim(),
      city: String(city).trim(),
      district: district ? String(district).trim() : String(city).trim(),
      state: String(state).trim(),
      pincode: pincode ? String(pincode).trim() : "",
      licenseNumber: String(licenseNumber).trim(),
      operatingHours: operatingHours
        ? String(operatingHours).trim()
        : "08:30 AM - 09:00 PM (All 7 Days)",
      location: { lat: numLat, lng: numLng },
      status: "awaiting_verification",
      submittedAt: new Date(),
    });

    const issued = await issueVerification(user, KENDRA_ROLE);

    return res.status(201).json({
      success: true,
      message:
        "Kendra registration submitted. Verify your email, then the PMBJP administrator will review your shop.",
      kendraCode,
      user: publicUser(user),
      ...issued,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Email verification
// ---------------------------------------------------------------------------
router.post("/verify-email", requireDb, async (req, res, next) => {
  try {
    const token = String((req.body && req.body.token) || "").trim();
    if (!token) {
      return res.status(400).json({
        success: false,
        code: "TOKEN_MISSING",
        error: "Verification token is missing.",
      });
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      verificationTokenHash: tokenHash,
      verificationTokenExpiresAt: { $gt: new Date() },
    }).select("+verificationTokenHash +verificationTokenExpiresAt");

    if (!user) {
      return res.status(400).json({
        success: false,
        code: "TOKEN_INVALID",
        error: "This verification link is invalid or has expired. Please request a new one.",
      });
    }

    user.emailVerified = true;
    user.verifiedAt = new Date();
    user.verificationTokenHash = undefined;
    user.verificationTokenExpiresAt = undefined;

    if (user.role === KENDRA_ROLE) {
      // Application becomes visible to the admin only after email verification.
      const application = await KendraApplication.findOne({
        ownerUserId: user._id,
        status: "awaiting_verification",
      });
      if (application) {
        application.status = "pending";
        application.submittedAt = new Date();
        await application.save();
      }
    }

    await user.save();

    return res.json({
      success: true,
      verified: true,
      role: user.role,
      email: user.email,
      message:
        user.role === KENDRA_ROLE
          ? "Email verified. Your Kendra application is now queued for administrator approval."
          : "Email verified successfully. You can now sign in.",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/resend-verification", requireDb, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: "A valid email address is required." });
    }

    const user = await User.findOne({ email });
    if (user && !user.emailVerified) {
      const issued = await issueVerification(user, user.role);
      return res.json({
        success: true,
        message: "If the account exists and is unverified, a new verification link has been sent.",
        ...issued,
      });
    }

    return res.json({
      success: true,
      message: "If the account exists and is unverified, a new verification link has been sent.",
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Sign in / out
// ---------------------------------------------------------------------------
router.post("/login", requireDb, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_RE.test(normalizedEmail) || typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        error: "A valid email address and password are required.",
      });
    }

    if (isAdminEmail(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        code: "ADMIN_URL_REQUIRED",
        error: "Administrator access is available only through the dedicated admin sign-in URL.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const matches = await user.comparePassword(password);
    if (!matches) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        error: "Please verify your email address before signing in. Check your inbox or request a new verification link.",
        email: user.email,
      });
    }

    if (user.role === KENDRA_ROLE && user.status === "rejected") {
      return res.status(403).json({
        success: false,
        code: "KENDRA_REJECTED",
        error:
          "Your Kendra application was not approved. Please contact the PMBJP administrator for assistance.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signUserToken(user);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Signed in successfully.",
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/admin-login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "admin@rxcompare.gov.in");
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    const emailMatches = safeEqual(normalizeEmail(email), adminEmail);
    const passwordMatches = safeEqual(password, adminPassword);

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({ success: false, error: "Invalid administrator credentials." });
    }

    const token = signAdminToken();
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Administrator signed in.",
      user: adminPublicUser(),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Signed out successfully." });
});

router.get("/me", authenticate, (req, res) => {
  const { _document, isAdminSession, ...user } = req.user;
  res.json({ success: true, user });
});

module.exports = router;
