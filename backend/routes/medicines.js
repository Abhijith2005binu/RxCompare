const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const {
  validateObjectId,
  validateCreateMedicine,
  validateUpdateMedicine,
} = require("../middleware/validate");

/**
 * GET /api/medicines/search?q=crocin
 * Case-insensitive partial match across genericName, searchKeywords (brand
 * names), and composition — this is what lets a user type a BRANDED name
 * ("Crocin") and land on its generic equivalent.
 */
router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const results = await Medicine.find({
      $or: [
        { genericName: regex },
        { searchKeywords: regex },
        { composition: regex },
        { "brandedEquivalents.brandName": regex },
      ],
    }).limit(20);

    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines
 * Full catalog (for browsing / demo without search)
 */
router.get("/", async (_req, res, next) => {
  try {
    const all = await Medicine.find().sort({ genericName: 1 });
    res.json(all);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines/:id
 * Single medicine with full brand comparison and virtual fields
 */
router.get("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) {
      return res.status(404).json({ success: false, error: "Medicine not found" });
    }
    res.json(med);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/medicines
 * Create a new medicine entry
 */
router.post("/", validateCreateMedicine, async (req, res, next) => {
  try {
    const {
      drugCode,
      genericName,
      composition,
      category,
      packSize,
      genericMrp,
      brandedEquivalents = [],
      searchKeywords = [],
    } = req.body;

    // Check if drugCode already exists
    const existing = await Medicine.findOne({ drugCode: drugCode.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `A medicine with drugCode '${drugCode}' already exists`,
      });
    }

    const medicine = new Medicine({
      drugCode: drugCode.trim(),
      genericName: genericName.trim(),
      composition: composition ? composition.trim() : "",
      category: category ? category.trim() : "General",
      packSize: packSize.trim(),
      genericMrp,
      brandedEquivalents,
      searchKeywords: searchKeywords.map((k) => k.toLowerCase().trim()),
    });

    const saved = await medicine.save();
    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: saved.toJSON(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/medicines/:id
 * Update an existing medicine entry
 */
router.put("/:id", validateObjectId("id"), validateUpdateMedicine, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates._id; // prevent overriding MongoDB primary key

    if (updates.searchKeywords && Array.isArray(updates.searchKeywords)) {
      updates.searchKeywords = updates.searchKeywords.map((k) => k.toLowerCase().trim());
    }

    const updated = await Medicine.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Medicine not found" });
    }

    res.json({
      success: true,
      message: "Medicine updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/medicines/:id
 * Delete a medicine entry
 */
router.delete("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Medicine not found" });
    }

    res.json({
      success: true,
      message: `Medicine '${deleted.genericName}' (${deleted.drugCode}) deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
