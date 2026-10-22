const express = require("express");
const router = express.Router();
const uhiGatewayService = require("../services/uhiGatewayService");
const Medicine = require("../models/Medicine");
const { getDbStatus } = require("../config/db");
const {
  validateCreateMedicine,
  validateUpdateMedicine,
} = require("../middleware/validate");

/**
 * GET /api/medicines/search?q=crocin
 * Case-insensitive query using ABDM / UHI Jan Aushadhi Gateway protocol (JANAUSHADHI_MEDICINE intent).
 * Allows users to type branded names ("Crocin", "Storvas", "Glycomet") or generic molecules
 * to receive complete purchase information, pack sizes, and branded savings.
 */
router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    // Query live ABDM / UHI Jan Aushadhi Gateway Service
    let results = await uhiGatewayService.searchMedicines(q);

    // If local DB is connected and returned nothing from UHI, check local DB as well
    if (results.length === 0 && getDbStatus()) {
      try {
        const regex = new RegExp(q, "i");
        const dbResults = await Medicine.find({
          $or: [
            { genericName: regex },
            { searchKeywords: regex },
            { composition: regex },
            { "brandedEquivalents.brandName": regex },
          ],
        }).limit(20);

        if (dbResults && dbResults.length > 0) {
          results = dbResults;
        }
      } catch (dbErr) {
        // Continue with UHI results
      }
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines
 * Complete Jan Aushadhi generic catalog with purchase info
 */
router.get("/", async (_req, res, next) => {
  try {
    const results = uhiGatewayService.getAllMedicines();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines/:id/kendras?lat=19.0&lng=72.8&inStockOnly=true&limit=10
 * Official ABDM UHI JANAUSHADHI_KENDRA flow:
 * Discovers all Jan Aushadhi Kendras stocking this specific medicine,
 * with real-time in-stock flags, units available, distance, phone, and navigation.
 */
router.get("/:id/kendras", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, lng, inStockOnly, limit, city } = req.query;

    const kendras = uhiGatewayService.getKendrasForMedicine(id, {
      lat,
      lng,
      inStockOnly,
      limit,
      city,
    });

    const medicine = uhiGatewayService.getMedicineById(id);

    res.json({
      success: true,
      medicineId: id,
      medicineName: medicine ? medicine.genericName : null,
      genericMrp: medicine ? medicine.genericMrp : null,
      packSize: medicine ? medicine.packSize : null,
      totalKendrasFound: kendras.length,
      kendras,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines/:id
 * Single medicine details with full purchase breakdown and branded comparison
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check UHI Service first
    const med = uhiGatewayService.getMedicineById(id);
    if (med) {
      return res.json(med);
    }

    // Fallback to DB if ID is a valid MongoDB ObjectId
    if (getDbStatus() && id.match(/^[0-9a-fA-F]{24}$/)) {
      const dbMed = await Medicine.findById(id);
      if (dbMed) return res.json(dbMed);
    }

    return res.status(404).json({ success: false, error: "Medicine not found" });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/medicines
 * Add custom medicine formulation
 */
router.post("/", validateCreateMedicine, async (req, res, next) => {
  try {
    if (!getDbStatus()) {
      return res.status(503).json({
        success: false,
        error: "Database offline. Application running in Live ABDM UHI API mode.",
      });
    }

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

module.exports = router;
