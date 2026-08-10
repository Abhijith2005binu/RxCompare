const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

/**
 * GET /api/medicines/search?q=crocin
 * Case-insensitive partial match across genericName, searchKeywords (brand
 * names), and composition — this is what lets a user type a BRANDED name
 * ("Crocin") and land on its generic equivalent.
 */
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const results = await Medicine.find({
      $or: [{ genericName: regex }, { searchKeywords: regex }, { composition: regex }, { "brandedEquivalents.brandName": regex }],
    })
      .limit(20)
      .lean({ virtuals: true });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

// GET /api/medicines  -> full catalog (for browsing / demo without search)
router.get("/", async (_req, res) => {
  try {
    const all = await Medicine.find().sort({ genericName: 1 }).lean({ virtuals: true });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medicines", details: err.message });
  }
});

// GET /api/medicines/:id -> single medicine with full brand comparison
router.get("/:id", async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id).lean({ virtuals: true });
    if (!med) return res.status(404).json({ error: "Medicine not found" });
    res.json(med);
  } catch (err) {
    res.status(400).json({ error: "Invalid medicine id" });
  }
});

module.exports = router;
