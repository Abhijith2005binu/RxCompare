const mongoose = require("mongoose");

const stockAlertSchema = new mongoose.Schema(
  {
    customerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, trim: true, default: "Customer" },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, trim: true, default: "" },
    medicineId: { type: String, required: true, index: true },
    medicineName: { type: String, required: true },
    drugCode: { type: String, default: "" },
    kendraCode: { type: String, default: null, index: true },
    kendraName: { type: String, default: "Any Nearby Kendra" },
    status: {
      type: String,
      enum: ["pending", "notified"],
      default: "pending",
      index: true,
    },
    notificationMessage: { type: String, default: null },
    notifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

stockAlertSchema.virtual("id").get(function () {
  return String(this._id);
});

stockAlertSchema.set("toJSON", { virtuals: true });
stockAlertSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("StockAlert", stockAlertSchema);
