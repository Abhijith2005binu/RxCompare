const crypto = require("crypto");

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 5;

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

/**
 * Creates a numeric one-time password and its hashed form. Only the hash is
 * persisted; the plain OTP exists only long enough to be emailed.
 */
function createOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH;
  const otp = String(crypto.randomInt(min, max));
  return {
    otp,
    otpHash: hashToken(otp),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  };
}

/**
 * Constant-time comparison of two SHA-256 hex digests.
 */
function hashesMatch(a, b) {
  const left = Buffer.from(String(a || ""), "hex");
  const right = Buffer.from(String(b || ""), "hex");
  return left.length > 0 && left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = {
  createOtp,
  hashToken,
  hashesMatch,
  OTP_TTL_MS,
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
};
