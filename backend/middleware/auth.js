const User = require("../models/User");
const { COOKIE_NAME, verifyToken, adminPublicUser } = require("../utils/auth");

function readToken(req) {
  const cookieToken = req.cookies ? req.cookies[COOKIE_NAME] : null;
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return null;
}

/**
 * Resolves the current session. Admin sessions come from the hardcoded
 * environment credentials; everyone else is loaded fresh from MongoDB so
 * approval/Kendra status changes take effect immediately.
 */
async function resolveUser(req) {
  const token = readToken(req);
  if (!token) return null;

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }

  if (payload.role === "admin" && payload.sub === "admin") {
    return { ...adminPublicUser(), isAdminSession: true };
  }

  const user = await User.findById(payload.sub);
  if (!user) return null;

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    status: user.status,
    emailVerified: user.emailVerified,
    kendraCode: user.kendraCode,
    kendraName: user.kendraName,
    designation: null,
    _document: user,
  };
}

async function authenticate(req, res, next) {
  try {
    const user = await resolveUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: "Please sign in to continue." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_SUSPENDED",
        error: "Your account has been suspended. Please contact the PMBJP administrator.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function optionalAuth(req, _res, next) {
  try {
    req.user = await resolveUser(req);
  } catch {
    req.user = null;
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Please sign in to continue." });
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Please sign in to continue." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to access this resource.",
      });
    }
    next();
  };
}

/**
 * Owners may only touch their own Kendra; admins may touch any.
 */
function requireKendraAccess(paramName = "kendraCode") {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Please sign in to continue." });
    }
    if (req.user.role === "admin") return next();

    const requested = req.params[paramName];
    if (req.user.role === "kendra_owner" && requested && req.user.kendraCode === requested) {
      return next();
    }
    return res.status(403).json({
      success: false,
      error: "This Kendra portal is restricted to its approved owner.",
    });
  };
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAuth,
  requireRole,
  requireKendraAccess,
};
