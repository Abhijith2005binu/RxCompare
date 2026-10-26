const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Registered platform account. Administrators are NOT stored here — the admin
 * account is hardcoded through environment variables and can only sign in
 * through the dedicated /admin-login URL.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["customer", "kendra_owner"],
      required: true,
      index: true,
    },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },

    // customers -> active / suspended; owners -> pending / approved / rejected / suspended
    status: {
      type: String,
      enum: ["active", "pending", "approved", "rejected", "suspended"],
      default: "active",
    },

    // Email verification (6-digit one-time password, hashed at rest)
    emailVerified: { type: Boolean, default: false, index: true },
    verificationOtpHash: { type: String, select: false },
    verificationOtpExpiresAt: { type: Date, select: false },
    verificationOtpAttempts: { type: Number, default: 0, select: false },
    verificationOtpSentAt: { type: Date, select: false },
    verifiedAt: { type: Date },

    // Kendra owner link (set once the admin approves the application)
    kendraCode: { type: String, default: null, index: true },
    kendraName: { type: String, default: null },
    rejectionReason: { type: String, default: "" },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

userSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.verificationOtpHash;
    delete ret.verificationOtpExpiresAt;
    delete ret.verificationOtpAttempts;
    delete ret.verificationOtpSentAt;
    delete ret.__v;
    ret.id = String(ret._id);
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
