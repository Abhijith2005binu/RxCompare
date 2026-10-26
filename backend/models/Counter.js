const mongoose = require("mongoose");

/**
 * Atomic counter used to generate human-friendly order numbers (ORD-9403...).
 */
const counterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", counterSchema);
