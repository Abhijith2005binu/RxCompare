const mongoose = require("mongoose");

/**
 * Per-Kendra stock for one medicine. Kept in its own collection so the
 * 227-medicine catalog x N Kendras matrix stays queryable and updatable.
 */
const inventorySchema = new mongoose.Schema(
  {
    kendraCode: { type: String, required: true, index: true },
    medicineId: { type: String, required: true, index: true },
    inStock: { type: Boolean, default: false },
    units: { type: Number, default: 0, min: 0 },
    // Optional Kendra-specific selling price. When absent the catalog
    // genericMrp is used, which keeps old inventory rows working.
    price: { type: Number, default: null, min: 0 },
    batchNumber: { type: String, default: "BAT-2026" },
    expiryDate: { type: String, default: "12/2027" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

inventorySchema.index({ kendraCode: 1, medicineId: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);
