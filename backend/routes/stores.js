const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const { distanceKm } = require("../utils/geo");

// GET /api/stores -> full static list
router.get("/", async (_req, res) => {
  try {
    const stores = await Store.find().lean();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stores", details: err.message });
  }
});

/**
 * GET /api/stores/nearby?lat=8.5&lng=76.9&limit=5
 * Computes distance in-app (Haversine) against the static seeded list —
 * no external maps API needed, which matches "static seeded list" in the
 * project brief. Falls back to sorting by city name if no coords given.
 */
router.get("/nearby", async (req, res) => {
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
    res.status(500).json({ error: "Failed to compute nearby stores", details: err.message });
  }
});

module.exports = router;
