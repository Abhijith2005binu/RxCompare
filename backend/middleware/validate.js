const mongoose = require("mongoose");

/**
 * Validates that an ID in route parameters is a valid MongoDB ObjectId.
 */
function validateObjectId(paramName = "id") {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName} format: must be a 24-character hexadecimal ObjectId`,
      });
    }
    next();
  };
}

/**
 * Validates body payload for POST /api/medicines
 */
function validateCreateMedicine(req, res, next) {
  const { drugCode, genericName, packSize, genericMrp, brandedEquivalents } = req.body;
  const errors = [];

  if (!drugCode || typeof drugCode !== "string" || !drugCode.trim()) {
    errors.push("drugCode is required and must be a non-empty string");
  }

  if (!genericName || typeof genericName !== "string" || !genericName.trim()) {
    errors.push("genericName is required and must be a non-empty string");
  }

  if (!packSize || typeof packSize !== "string" || !packSize.trim()) {
    errors.push("packSize is required and must be a non-empty string (e.g., '10 tablets')");
  }

  if (genericMrp === undefined || typeof genericMrp !== "number" || genericMrp <= 0) {
    errors.push("genericMrp is required and must be a positive number");
  }

  if (brandedEquivalents !== undefined) {
    if (!Array.isArray(brandedEquivalents)) {
      errors.push("brandedEquivalents must be an array");
    } else {
      brandedEquivalents.forEach((item, index) => {
        if (!item.brandName || typeof item.brandName !== "string" || !item.brandName.trim()) {
          errors.push(`brandedEquivalents[${index}].brandName is required`);
        }
        if (item.mrp === undefined || typeof item.mrp !== "number" || item.mrp <= 0) {
          errors.push(`brandedEquivalents[${index}].mrp must be a positive number`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}

/**
 * Validates body payload for PUT /api/medicines/:id
 */
function validateUpdateMedicine(req, res, next) {
  const { genericMrp, brandedEquivalents } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: "Request body cannot be empty for update",
    });
  }

  if (genericMrp !== undefined && (typeof genericMrp !== "number" || genericMrp <= 0)) {
    errors.push("genericMrp must be a positive number");
  }

  if (brandedEquivalents !== undefined) {
    if (!Array.isArray(brandedEquivalents)) {
      errors.push("brandedEquivalents must be an array");
    } else {
      brandedEquivalents.forEach((item, index) => {
        if (!item.brandName || typeof item.brandName !== "string" || !item.brandName.trim()) {
          errors.push(`brandedEquivalents[${index}].brandName is required`);
        }
        if (item.mrp === undefined || typeof item.mrp !== "number" || item.mrp <= 0) {
          errors.push(`brandedEquivalents[${index}].mrp must be a positive number`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}

/**
 * Validates body payload for POST /api/stores
 */
function validateCreateStore(req, res, next) {
  const { name, address, city, state, location } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("name is required and must be a non-empty string");
  }
  if (!address || typeof address !== "string" || !address.trim()) {
    errors.push("address is required and must be a non-empty string");
  }
  if (!city || typeof city !== "string" || !city.trim()) {
    errors.push("city is required and must be a non-empty string");
  }
  if (!state || typeof state !== "string" || !state.trim()) {
    errors.push("state is required and must be a non-empty string");
  }

  if (
    !location ||
    typeof location !== "object" ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number" ||
    location.lat < -90 ||
    location.lat > 90 ||
    location.lng < -180 ||
    location.lng > 180
  ) {
    errors.push("location is required with valid lat (-90 to 90) and lng (-180 to 180) numbers");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}

/**
 * Validates body payload for PUT /api/stores/:id
 */
function validateUpdateStore(req, res, next) {
  const { location } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: "Request body cannot be empty for update",
    });
  }

  if (location !== undefined) {
    if (
      typeof location !== "object" ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number" ||
      location.lat < -90 ||
      location.lat > 90 ||
      location.lng < -180 ||
      location.lng > 180
    ) {
      errors.push("location must contain valid lat (-90 to 90) and lng (-180 to 180) numbers");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}

/**
 * Validates query parameters for GET /api/stores/nearby
 */
function validateNearbyStoreQuery(req, res, next) {
  const { lat, lng, limit } = req.query;

  // If neither lat nor lng provided, it returns all stores sorted by city (allowed fallback)
  if (!lat && !lng) {
    return next();
  }

  // If one is provided, both must be provided
  if ((lat && !lng) || (!lat && lng)) {
    return res.status(400).json({
      success: false,
      error: "Both 'lat' and 'lng' query parameters must be provided together",
    });
  }

  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);

  if (isNaN(numLat) || numLat < -90 || numLat > 90) {
    return res.status(400).json({
      success: false,
      error: "'lat' must be a valid number between -90 and 90",
    });
  }

  if (isNaN(numLng) || numLng < -180 || numLng > 180) {
    return res.status(400).json({
      success: false,
      error: "'lng' must be a valid number between -180 and 180",
    });
  }

  if (limit !== undefined) {
    const numLimit = parseInt(limit, 10);
    if (isNaN(numLimit) || numLimit <= 0 || numLimit > 100) {
      return res.status(400).json({
        success: false,
        error: "'limit' must be a positive integer between 1 and 100",
      });
    }
  }

  next();
}

module.exports = {
  validateObjectId,
  validateCreateMedicine,
  validateUpdateMedicine,
  validateCreateStore,
  validateUpdateStore,
  validateNearbyStoreQuery,
};
