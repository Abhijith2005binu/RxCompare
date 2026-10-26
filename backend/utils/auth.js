const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const COOKIE_NAME = "rx_token";
const TOKEN_TTL = "7d";

function getJwtSecret() {
  return process.env.JWT_SECRET || "rxcompare-insecure-development-secret";
}

function signUserToken(user) {
  return jwt.sign(
    {
      sub: String(user._id || user.id),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: TOKEN_TTL }
  );
}

function signAdminToken() {
  return jwt.sign(
    {
      sub: "admin",
      role: "admin",
      email: (process.env.ADMIN_EMAIL || "admin@rxcompare.gov.in").toLowerCase(),
      name: process.env.ADMIN_NAME || "Administrator",
    },
    getJwtSecret(),
    { expiresIn: TOKEN_TTL }
  );
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/**
 * Shape returned to the browser. Never includes password or token fields.
 */
function publicUser(user) {
  return {
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    address: user.address || "",
    status: user.status,
    emailVerified: Boolean(user.emailVerified),
    kendraCode: user.kendraCode || null,
    kendraName: user.kendraName || null,
    designation: user.designation || null,
  };
}

function adminPublicUser() {
  return {
    id: "admin",
    name: process.env.ADMIN_NAME || "Administrator",
    email: (process.env.ADMIN_EMAIL || "admin@rxcompare.gov.in").toLowerCase(),
    role: "admin",
    phone: "",
    address: "",
    status: "active",
    emailVerified: true,
    kendraCode: null,
    kendraName: null,
    designation: process.env.ADMIN_DESIGNATION || "Chief PMBJP Network Administrator",
  };
}

/**
 * Constant-time string comparison for the hardcoded admin credentials.
 */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a || ""));
  const bufB = Buffer.from(String(b || ""));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  COOKIE_NAME,
  signUserToken,
  signAdminToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
  publicUser,
  adminPublicUser,
  safeEqual,
};
