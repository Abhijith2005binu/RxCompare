const mongoose = require("mongoose");

/**
 * A Jan Aushadhi Kendra (medical shop) registered on the network.
 * `kendraCode` is the stable public identifier used across the API.
 */
const kendraSchema = new mongoose.Schema(
  {
    kendraCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerName: { type: String, trim: true, default: "" },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true, default: "" },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    licenseNumber: { type: String, trim: true, default: "" },
    operatingHours: { type: String, trim: true, default: "08:30 AM - 09:00 PM" },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["active", "pending", "rejected", "suspended"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

kendraSchema.virtual("id").get(function () {
  return this.kendraCode;
});

kendraSchema.set("toJSON", { virtuals: true });
kendraSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Kendra", kendraSchema);
