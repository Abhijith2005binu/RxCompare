/**
 * ABDM / UHI (Ayushman Bharat Digital Mission - Unified Health Interface)
 * Jan Aushadhi Gateway Service
 *
 * Implements the JANAUSHADHI_MEDICINE and JANAUSHADHI_KENDRA intents on top of
 * MongoDB. Medicines, Kendra stores and per-store stock are now persisted and
 * queried from the database rather than held in memory.
 */

const Medicine = require("../models/Medicine");
const Kendra = require("../models/Kendra");
const Inventory = require("../models/Inventory");
const { distanceKm } = require("../utils/geo");

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Adds the derived fields the UI relies on (cheapest branded price, savings).
 */
function enrichMedicine(medicine) {
  if (!medicine) return null;

  const equivalents = medicine.brandedEquivalents || [];
  const cheapestBranded =
    equivalents.length > 0 ? Math.min(...equivalents.map((b) => b.mrp)) : null;
  const savingsAmount =
    cheapestBranded !== null ? Math.max(0, cheapestBranded - medicine.genericMrp) : null;
  const savingsPct =
    cheapestBranded && savingsAmount !== null
      ? Math.round((savingsAmount / cheapestBranded) * 100)
      : null;

  return {
    ...medicine,
    id: medicine.id || String(medicine._id),
    cheapestBrandedMrp: cheapestBranded,
    purchaseInfo: {
      ...(medicine.purchaseInfo || {}),
      savingsVsBranded: {
        savingsAmount: savingsAmount !== null ? Number(savingsAmount.toFixed(2)) : null,
        savingsPercentage: savingsPct,
        cheapestBrandedMrp: cheapestBranded,
      },
    },
  };
}

const LOW_STOCK_THRESHOLD = 20;

function stockStatusFor(stock) {
  if (!stock || !stock.inStock || stock.units <= 0) return "Out of Stock";
  return stock.units > LOW_STOCK_THRESHOLD ? "In Stock" : "Low Stock";
}

function resolveStockPrice(stock, medicine) {
  const stockPrice = Number(stock && stock.price);
  if (Number.isFinite(stockPrice) && stockPrice > 0) {
    return Number(stockPrice.toFixed(2));
  }
  const catalogPrice = Number(medicine && medicine.genericMrp);
  return Number.isFinite(catalogPrice) ? Number(catalogPrice.toFixed(2)) : null;
}

function shapeKendra(store, { distance = null, stock = null, medicine = null, isBestPrice = false } = {}) {
  const kendraCode = store.kendraCode || store.id;
  const price = resolveStockPrice(stock, medicine);
  return {
    id: kendraCode,
    kendraCode,
    name: store.name,
    address: store.address,
    city: store.city,
    district: store.district || "",
    state: store.state,
    pincode: store.pincode || "",
    phone: store.phone || "",
    email: store.email || "",
    operatingHours: store.operatingHours || "08:30 AM - 09:00 PM",
    location: store.location,
    distanceKm: distance,
    inStock: Boolean(stock && stock.inStock && stock.units > 0),
    unitsAvailable: stock && stock.units ? stock.units : 0,
    stockStatus: stockStatusFor(stock),
    isLowStock: stockStatusFor(stock) === "Low Stock",
    price,
    basePrice: medicine ? Number(medicine.genericMrp) : null,
    isBestPrice: Boolean(isBestPrice),
    medicineInfo: medicine
      ? {
          id: medicine.id,
          genericName: medicine.genericName,
          genericMrp: medicine.genericMrp,
          price,
          packSize: medicine.packSize,
          drugCode: medicine.drugCode,
        }
      : null,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`,
  };
}

class UhiGatewayService {
  constructor() {
    this.gatewayUrl = process.env.UHI_GATEWAY_URL || null;
    this.consumerId = process.env.UHI_CONSUMER_ID || "nha.eua";
    this.authToken = process.env.UHI_AUTH_TOKEN || null;
  }

  /**
   * Status of the ABDM / UHI network connection backed by MongoDB.
   */
  async getStatus() {
    const [totalMedicines, totalKendras] = await Promise.all([
      Medicine.countDocuments(),
      Kendra.countDocuments({ status: "active" }),
    ]);

    return {
      protocol: "ABDM / UHI Beckn Protocol v2.0.2",
      gatewayUrl: this.gatewayUrl || "Local MongoDB ABDM UHI Gateway",
      mode: "MongoDB-backed ABDM / PMBJP Gateway Engine",
      totalMedicines,
      totalKendras,
      timestamp: new Date().toISOString(),
      supportedIntents: ["JANAUSHADHI_MEDICINE", "JANAUSHADHI_KENDRA"],
      qualityStandard: "WHO-GMP & IP Certified Indian Generics",
    };
  }

  /**
   * Search medicines by branded name, generic molecule, composition, category,
   * drug code or keyword.
   */
  async searchMedicines(term) {
    const q = String(term || "").trim();
    if (!q) return this.getAllMedicines();

    const regex = new RegExp(escapeRegex(q), "i");
    const medicines = await Medicine.find({
      $or: [
        { genericName: regex },
        { composition: regex },
        { category: regex },
        { drugCode: regex },
        { searchKeywords: regex },
        { "brandedEquivalents.brandName": regex },
        { "brandedEquivalents.manufacturer": regex },
      ],
    })
      .sort({ id: 1 })
      .limit(60)
      .lean();

    return medicines.map(enrichMedicine);
  }

  async getAllMedicines() {
    const medicines = await Medicine.find({}).sort({ id: 1 }).lean();
    return medicines.map(enrichMedicine);
  }

  /**
   * Retrieve a medicine by stable id, PMBJP drug code, or exact generic name.
   */
  async getMedicineById(idOrCode) {
    const target = String(idOrCode || "").trim();
    if (!target) return null;

    let medicine = await Medicine.findOne({ id: target }).lean();

    // Legacy catalog rows may only have Mongo's `_id`.
    if (!medicine && /^[a-f0-9]{24}$/i.test(target)) {
      medicine = await Medicine.findById(target).lean();
    }
    if (!medicine) {
      medicine = await Medicine.findOne({
        drugCode: new RegExp(`^${escapeRegex(target)}$`, "i"),
      }).lean();
    }
    if (!medicine) {
      medicine = await Medicine.findOne({
        genericName: new RegExp(`^${escapeRegex(target)}$`, "i"),
      }).lean();
    }

    return enrichMedicine(medicine);
  }

  /**
   * JANAUSHADHI_KENDRA intent: all active Kendras that stock a medicine,
   * with live units, distance and directions.
   */
  async getKendrasForMedicine(medicineIdOrCode, options = {}) {
    const { lat, lng, inStockOnly = false, limit = 10, city } = options;
    const medicine = await this.getMedicineById(medicineIdOrCode);

    const userLat = lat !== undefined && lat !== null && lat !== "" ? parseFloat(lat) : null;
    const userLng = lng !== undefined && lng !== null && lng !== "" ? parseFloat(lng) : null;
    const hasCoords =
      userLat !== null && userLng !== null && !Number.isNaN(userLat) && !Number.isNaN(userLng);

    const stores = await Kendra.find({ status: "active" }).lean();
    const storeCodes = stores.map((s) => s.kendraCode);

    const stockRows = medicine
      ? await Inventory.find({
          medicineId: medicine.id,
          kendraCode: { $in: storeCodes },
        }).lean()
      : [];
    const stockByKendra = new Map(stockRows.map((row) => [row.kendraCode, row]));

    let results = stores.map((store) => {
      const distance = hasCoords
        ? Math.round(distanceKm(userLat, userLng, store.location.lat, store.location.lng) * 10) / 10
        : null;
      return shapeKendra(store, {
        distance,
        stock: stockByKendra.get(store.kendraCode) || null,
        medicine,
      });
    });

    if (inStockOnly === true || inStockOnly === "true") {
      results = results.filter((store) => store.inStock);
    }

    if (city && String(city).trim()) {
      const needle = String(city).trim().toLowerCase();
      results = results.filter(
        (store) =>
          store.city.toLowerCase() === needle || store.district.toLowerCase() === needle
      );
    }

    // Mark the cheapest in-stock Kendra before applying the result limit so
    // the customer always sees the genuine "best price" option.
    const inStockResults = results.filter((store) => store.inStock && Number.isFinite(store.price));
    const bestPrice = inStockResults.reduce(
      (best, store) => (best === null || store.price < best.price ? store : best),
      null
    );
    const bestKendraCode = bestPrice ? bestPrice.kendraCode : null;
    if (bestKendraCode) {
      results = results.map((store) => ({
        ...store,
        isBestPrice: store.kendraCode === bestKendraCode,
      }));
    }

    if (hasCoords) {
      results.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    } else {
      results.sort((a, b) => a.city.localeCompare(b.city));
    }

    const limited = results.slice(0, parseInt(limit, 10) || 10);
    if (bestKendraCode && !limited.some((store) => store.kendraCode === bestKendraCode)) {
      const bestStore = results.find((store) => store.kendraCode === bestKendraCode);
      if (bestStore) limited[limited.length - 1] = bestStore;
    }
    return limited;
  }

  /**
   * General Kendra locator (optionally medicine-aware).
   */
  async getNearbyKendras(options = {}) {
    const { lat, lng, limit = 10, medicineId, inStockOnly, city } = options;
    if (medicineId) {
      return this.getKendrasForMedicine(medicineId, { lat, lng, limit, inStockOnly, city });
    }

    const userLat = lat !== undefined && lat !== null && lat !== "" ? parseFloat(lat) : null;
    const userLng = lng !== undefined && lng !== null && lng !== "" ? parseFloat(lng) : null;
    const hasCoords =
      userLat !== null && userLng !== null && !Number.isNaN(userLat) && !Number.isNaN(userLng);

    let stores = await Kendra.find({ status: "active" }).lean();
    let list = stores.map((store) => {
      const distance = hasCoords
        ? Math.round(distanceKm(userLat, userLng, store.location.lat, store.location.lng) * 10) / 10
        : null;
      return shapeKendra(store, { distance });
    });

    if (city && String(city).trim()) {
      const needle = String(city).trim().toLowerCase();
      list = list.filter(
        (store) =>
          store.city.toLowerCase() === needle || store.district.toLowerCase() === needle
      );
    }

    if (hasCoords) {
      list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    } else {
      list.sort((a, b) => a.city.localeCompare(b.city));
    }

    return list.slice(0, parseInt(limit, 10) || 10);
  }

  async getKendraByCode(kendraCode) {
    const store = await Kendra.findOne({ kendraCode }).lean();
    return store ? shapeKendra(store) : null;
  }
}

module.exports = new UhiGatewayService();
module.exports.enrichMedicine = enrichMedicine;
module.exports.shapeKendra = shapeKendra;
