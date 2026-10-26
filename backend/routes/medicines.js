const express = require("express");
const router = express.Router();

const uhiGatewayService = require("../services/uhiGatewayService");
const Medicine = require("../models/Medicine");
const { requireDb } = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");
const {
  validateCreateMedicine,
} = require("../middleware/validate");

/**
 * GET /api/medicines/search?q=crocin
 * Case-insensitive search across generic names, brands, composition and
 * keywords, served from the MongoDB medicine catalog.
 */
router.get("/search", requireDb, async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const results = await uhiGatewayService.searchMedicines(q);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines
 * Complete Jan Aushadhi generic catalog with purchase information.
 */
router.get("/", requireDb, async (_req, res, next) => {
  try {
    const results = await uhiGatewayService.getAllMedicines();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines/:id/kendras?lat=19.0&lng=72.8&inStockOnly=true&limit=10
 * Kendras stocking this medicine, with live stock, distance and directions.
 */
router.get("/:id/kendras", requireDb, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, lng, inStockOnly, limit, city } = req.query;

    const [kendras, medicine] = await Promise.all([
      uhiGatewayService.getKendrasForMedicine(id, { lat, lng, inStockOnly, limit, city }),
      uhiGatewayService.getMedicineById(id),
    ]);

    const best = kendras.find((store) => store.isBestPrice) || null;

    res.json({
      success: true,
      medicineId: id,
      medicineName: medicine ? medicine.genericName : null,
      genericMrp: medicine ? medicine.genericMrp : null,
      packSize: medicine ? medicine.packSize : null,
      totalKendrasFound: kendras.length,
      bestPrice: best ? best.price : null,
      bestKendraCode: best ? best.kendraCode : null,
      bestKendraName: best ? best.name : null,
      kendras,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/medicines/:id
 */
router.get("/:id", requireDb, async (req, res, next) => {
  try {
    const med = await uhiGatewayService.getMedicineById(req.params.id);
    if (!med) {
      return res.status(404).json({ success: false, error: "Medicine not found" });
    }
    res.json(med);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/medicines — administrator-only catalog entry.
 * Kendra owners add stock through /api/kendra/inventory/:kendraCode instead.
 */
router.post(
  "/",
  requireDb,
  authenticate,
  requireRole("admin"),
  validateCreateMedicine,
  async (req, res, next) => {
    try {
      const {
        drugCode,
        genericName,
        composition,
        category,
        packSize,
        genericMrp,
        prescriptionRequired,
        dosageForm,
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

      const medicine = await Medicine.create({
        id: `med-${Date.now()}`,
        drugCode: drugCode.trim(),
        genericName: genericName.trim(),
        composition: composition ? composition.trim() : "",
        category: category ? category.trim() : "General",
        dosageForm: dosageForm ? String(dosageForm).trim() : "",
        packSize: packSize.trim(),
        genericMrp,
        prescriptionRequired: Boolean(prescriptionRequired),
        brandedEquivalents,
        searchKeywords: searchKeywords.map((keyword) => String(keyword).toLowerCase().trim()),
      });

      res.status(201).json({
        success: true,
        message: "Medicine created successfully",
        data: medicine.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
