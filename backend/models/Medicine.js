const mongoose = require("mongoose");

/**
 * One document = one generic (Jan Aushadhi) formulation, with an array of
 * known branded equivalents sold in the open market.
 *
 * This shape mirrors how the actual data.gov.in / PMBJP price list works:
 * the government list only publishes GENERIC drugs + MRP (drugCode, name,
 * composition, unitSize, mrp). Branded equivalents + their prices are not
 * in that dataset, so in a production build you'd enrich this collection
 * with a second source (e.g. scraped/curated 1mg or NPPA branded MRP data).
 * For now `brandedEquivalents` is seeded manually/approximately — see
 * backend/data/medicines.seed.js for notes on every figure's source.
 */
const brandedEquivalentSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true, trim: true },
    manufacturer: { type: String, trim: true },
    mrp: { type: Number, required: true }, // INR, for the same pack size as the generic
  },
  { _id: false }
);

const medicineSchema = new mongoose.Schema(
  {
    drugCode: { type: String, required: true, unique: true, index: true }, // PMBJP drug code
    genericName: { type: String, required: true, trim: true, index: true },
    composition: { type: String, trim: true },
    category: { type: String, trim: true, index: true }, // e.g. "Cardiac", "Diabetes", "Antibiotic"
    packSize: { type: String, required: true }, // e.g. "10 tablets", "30ml bottle"
    genericMrp: { type: Number, required: true }, // Jan Aushadhi MRP, INR
    brandedEquivalents: [brandedEquivalentSchema],
    searchKeywords: [{ type: String, index: true }], // brand names + common misspellings, lowercased
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
