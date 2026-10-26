const mongoose = require("mongoose");

/**
 * One document = one generic (Jan Aushadhi) formulation, with an array of
 * known branded equivalents sold in the open market.
 *
 * `id` is the stable public identifier (e.g. "med-001") used by the frontend,
 * inventory rows and orders, while `_id` remains the Mongo identifier.
 */
const brandedEquivalentSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true, trim: true },
    manufacturer: { type: String, trim: true },
    mrp: { type: Number, required: true }, // INR, for the same pack size as the generic
  },
  { _id: false }
);

const purchaseInfoSchema = new mongoose.Schema(
  {
    unitPrice: { type: Number },
    packMrp: { type: Number },
    packSize: { type: String },
    currency: { type: String, default: "INR" },
    subsidyScheme: { type: String },
    prescriptionRequired: { type: Boolean },
    regulatoryAuthority: { type: String },
    purchaseAvailability: { type: String },
    qualityStandard: { type: String },
  },
  { _id: false, strict: false }
);

const medicineSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true }, // stable public id
    drugCode: { type: String, required: true, unique: true, index: true }, // PMBJP drug code
    genericName: { type: String, required: true, trim: true, index: true },
    composition: { type: String, trim: true },
    category: { type: String, trim: true, index: true },
    dosageForm: { type: String, trim: true, default: "" },
    packSize: { type: String, required: true },
    genericMrp: { type: Number, required: true },
    prescriptionRequired: { type: Boolean, default: false },
    storageInstructions: { type: String, default: "" },
    uses: { type: String, default: "" },
    purchaseInfo: { type: purchaseInfoSchema, default: {} },
    brandedEquivalents: [brandedEquivalentSchema],
    searchKeywords: [{ type: String, index: true }],
  },
  { timestamps: true }
);

medicineSchema.index({ genericName: "text", searchKeywords: "text", composition: "text" });

// Virtual: cheapest branded price on file, used for the headline "you save ₹X" figure
medicineSchema.virtual("cheapestBrandedMrp").get(function () {
  if (!this.brandedEquivalents || this.brandedEquivalents.length === 0) return null;
  return Math.min(...this.brandedEquivalents.map((b) => b.mrp));
});

medicineSchema.set("toJSON", { virtuals: true });
medicineSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Medicine", medicineSchema);
