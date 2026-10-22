const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const { generateToken, verifyToken } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");

/**
 * Helper to ensure demo accounts exist
 */
async function ensureDemoAccounts() {
  const adminEmail = "admin@rxcompare.org";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Dr. A. Verma (Admin)",
      email: adminEmail,
      password: "Admin@123",
      role: "admin",
    });
  }

  const patientEmail = "patient@rxcompare.org";
  let patient = await User.findOne({ email: patientEmail });
  if (!patient) {
    // Optionally seed a couple of saved medicines for patient
    const sampleMeds = await Medicine.find().limit(2).select("_id");
    patient = await User.create({
      name: "Ramesh Sharma",
      email: patientEmail,
      password: "Patient@123",
      role: "user",
      savedMedicines: sampleMeds.map((m) => m._id),
    });
  }

  return { admin, patient };
}

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists",
      });
    }

    const userRole = role === "admin" ? "admin" : "user";
    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: userRole,
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedMedicines: user.savedMedicines,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Log in with email and password
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Both email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedMedicines: user.savedMedicines,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/quick-demo
 * Instant 1-click login for demoing (admin or patient)
 */
router.post("/quick-demo", async (req, res, next) => {
  try {
    const { role } = req.body;
    const { admin, patient } = await ensureDemoAccounts();
    const targetUser = role === "admin" ? admin : patient;

    const token = generateToken(targetUser);

    res.json({
      success: true,
      message: `Signed in as Demo ${targetUser.role === "admin" ? "Admin" : "Patient"}`,
      token,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        savedMedicines: targetUser.savedMedicines,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Get currently authenticated user profile
 */
router.get("/me", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedMedicines",
      select: "genericName drugCode composition category packSize genericMrp brandedEquivalents searchKeywords",
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedMedicines: user.savedMedicines,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/saved-medicines
 * Get user's saved prescription list
 */
router.get("/saved-medicines", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("savedMedicines");
    res.json(user.savedMedicines || []);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/saved-medicines/:id
 * Toggle / Add a medicine to saved prescriptions
 */
router.post("/saved-medicines/:id", verifyToken, validateObjectId("id"), async (req, res, next) => {
  try {
    const medId = req.params.id;
    const medicine = await Medicine.findById(medId);
    if (!medicine) {
      return res.status(404).json({ success: false, error: "Medicine not found" });
    }

    const user = await User.findById(req.user._id);
    const index = user.savedMedicines.indexOf(medId);

    let saved = false;
    if (index > -1) {
      user.savedMedicines.splice(index, 1);
      saved = false;
    } else {
      user.savedMedicines.push(medId);
      saved = true;
    }

    await user.save();
    const populated = await User.findById(user._id).populate("savedMedicines");

    res.json({
      success: true,
      saved,
      message: saved ? "Added to your prescription cabinet" : "Removed from prescription cabinet",
      savedMedicines: populated.savedMedicines,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/auth/saved-medicines/:id
 * Remove a medicine from saved prescriptions
 */
router.delete("/saved-medicines/:id", verifyToken, validateObjectId("id"), async (req, res, next) => {
  try {
    const medId = req.params.id;
    const user = await User.findById(req.user._id);
    user.savedMedicines = user.savedMedicines.filter(
      (id) => id.toString() !== medId.toString()
    );
    await user.save();
    const populated = await User.findById(user._id).populate("savedMedicines");

    res.json({
      success: true,
      message: "Removed from prescription cabinet",
      savedMedicines: populated.savedMedicines,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
