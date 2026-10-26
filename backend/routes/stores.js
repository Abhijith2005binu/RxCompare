const express = require("express");
const router = express.Router();

const uhiGatewayService = require("../services/uhiGatewayService");
const Kendra = require("../models/Kendra");
const { requireDb } = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");
const { validateCreateStore } = require("../middleware/validate");

/**
 * GET /api/stores -> active Jan Aushadhi Kendras
 */
router.get("/", requireDb, async (_req, res, next) => {
  try {
    const stores = await uhiGatewayService.getNearbyKendras({ limit: 100 });
    res.json(stores);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stores/nearby?lat=&lng=&limit=&medicineId=&inStockOnly=&city=
 */
router.get("/nearby", requireDb, async (req, res, next) => {
  try {
    const { lat, lng, limit, medicineId, inStockOnly, city } = req.query;
    const stores = await uhiGatewayService.getNearbyKendras({
      lat,
      lng,
      limit,
      medicineId,
      inStockOnly,
      city,
    });
    res.json(stores);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stores/:id -> single store by Kendra code
 */
router.get("/:id", requireDb, async (req, res, next) => {
  try {
    const store = await uhiGatewayService.getKendraByCode(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }
    res.json(store);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/stores -> administrator-only manual Kendra creation.
 * Shop owners register through /api/auth/register/kendra.
 */
router.post(
  "/",
  requireDb,
  authenticate,
  requireRole("admin"),
  validateCreateStore,
  async (req, res, next) => {
    try {
      const { name, address, city, state, pincode, phone, location } = req.body;

      const kendraCode = `PMBJK${Math.floor(10000 + Math.random() * 89999)}`;
      const store = await Kendra.create({
        kendraCode,
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode ? String(pincode).trim() : "",
        phone: phone ? String(phone).trim() : "",
        location: { lat: location.lat, lng: location.lng },
        status: "active",
      });

      res.status(201).json({
        success: true,
        message: "Jan Aushadhi Kendra store created successfully",
        data: store.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
