/**
 * 404 Handler for undefined API endpoints.
 */
function notFoundHandler(req, res, _next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Centralized Global Error Handling Middleware.
 * Catches unhandled errors, Mongoose validation errors, and CastErrors.
 */
function errorHandler(err, _req, res, _next) {
  console.error("[error]", err);

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: messages,
    });
  }

  // MongoDB Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      success: false,
      error: `Duplicate value entered for unique field: '${field}'`,
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
