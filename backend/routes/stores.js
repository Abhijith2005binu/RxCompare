const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const { distanceKm } = require("../utils/geo");
const {
  validateObjectId,
  validateCreateStore,
  validateUpdateStore,
  validateNearbyStoreQuery,
} = require("../middleware/validate");

/**
 * GET /api/stores -> full static list
 */
router.get("/", async (_req, res, next) => {
  try {
    const stores = await Store.find().sort({ name: 1 }).lean();
    res.json(stores);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stores/nearby?lat=8.5&lng=76.9&limit=5
 * Computes distance in-app (Haversine) against the static seeded list.
 * Falls back to sorting by city name if no coords given.
 */
router.get("/nearby", validateNearbyStoreQuery, async (req, res, next) => {
  try {
    const { lat, lng, limit } = req.query;
    const stores = await Store.find().lean();

    if (!lat || !lng) {
      return res.json(stores.sort((a, b) => a.city.localeCompare(b.city)));
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const withDistance = stores
      .map((s) => ({
        ...s,
        distanceKm: Math.round(distanceKm(userLat, userLng, s.location.lat, s.location.lng) * 10) / 10,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, parseInt(limit, 10) || 5);

    res.json(withDistance);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stores/:id -> single store details
 */
router.get("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).lean();
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }
    res.json(store);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/stores -> create a new Kendra store
 */
router.post("/", validateCreateStore, async (req, res, next) => {
  try {
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

/**
 * PUT /api/stores/:id -> update store details
 */
router.put("/:id", validateObjectId("id"), validateUpdateStore, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates._id;

    const updated = await Store.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }

    res.json({
      success: true,
      message: "Store updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/stores/:id -> delete store
 */
router.delete("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }

    res.json({
      success: true,
      message: `Store '${deleted.name}' deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
