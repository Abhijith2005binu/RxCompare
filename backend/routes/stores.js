const express = require("express");
const router = express.Router();
const uhiGatewayService = require("../services/uhiGatewayService");
const Store = require("../models/Store");
const { getDbStatus } = require("../config/db");
const { distanceKm } = require("../utils/geo");
const {
  validateCreateStore,
} = require("../middleware/validate");

/**
 * GET /api/stores -> full list of Jan Aushadhi Kendras
 */
router.get("/", async (_req, res, next) => {
  try {
    const stores = uhiGatewayService.getNearbyKendras({ limit: 50 });
    res.json(stores);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stores/nearby?lat=8.5&lng=76.9&limit=5&medicineId=med-001&inStockOnly=true
 * Computes distance in-app (Haversine) against the ABDM / PMBJP Kendra registry.
 * Optionally filters by medicine stock availability.
 */
router.get("/nearby", async (req, res, next) => {
  try {
    const { lat, lng, limit, medicineId, inStockOnly, city } = req.query;

    const withDistance = uhiGatewayService.getNearbyKendras({
      lat,
      lng,
      limit,
      medicineId,
      inStockOnly,
      city,
    });

    res.json(withDistance);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stores/:id -> single store details
 */
router.get("/:id", async (req, res, next) => {
  try {
    const store = uhiGatewayService.stores.find((s) => s.id === req.params.id);
    if (store) {
      return res.json(store);
    }

    if (getDbStatus() && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const dbStore = await Store.findById(req.params.id).lean();
      if (dbStore) return res.json(dbStore);
    }

    return res.status(404).json({ success: false, error: "Store not found" });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/stores -> create a new Kendra store
 */
router.post("/", validateCreateStore, async (req, res, next) => {
  try {
    if (!getDbStatus()) {
      return res.status(503).json({
        success: false,
        error: "Database offline. Operating in Live ABDM UHI API mode.",
      });
    }

    const { name, address, city, state, pincode, phone, location } = req.body;

    const store = new Store({
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode ? pincode.trim() : "",
      phone: phone ? phone.trim() : "",
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });

    const saved = await store.save();
    res.status(201).json({
      success: true,
      message: "Jan Aushadhi Kendra store created successfully",
      data: saved.toJSON(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
