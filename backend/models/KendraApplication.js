const mongoose = require("mongoose");

/**
 * Shop-owner application. Created during registration, moves to `pending`
 * once the owner verifies their email, and is approved or rejected by the
 * hardcoded administrator.
 */
const kendraApplicationSchema = new mongoose.Schema(
  {
    kendraCode: { type: String, required: true, unique: true, index: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, trim: true, default: "" },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true, default: "" },
    licenseNumber: { type: String, trim: true, default: "" },
    operatingHours: { type: String, trim: true, default: "08:30 AM - 09:00 PM" },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["awaiting_verification", "pending", "approved", "rejected"],
      default: "awaiting_verification",
      index: true,
    },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

kendraApplicationSchema.virtual("id").get(function () {
  return String(this._id);
});

kendraApplicationSchema.set("toJSON", { virtuals: true });
kendraApplicationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("KendraApplication", kendraApplicationSchema);
