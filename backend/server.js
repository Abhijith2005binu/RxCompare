require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const medicineRoutes = require("./routes/medicines");
const storeRoutes = require("./routes/stores");

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Resource Routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/stores", storeRoutes);

// Fallback & Error Handling Middleware (must be registered after routes)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`[server] RxCompare API running at http://localhost:${PORT}`)
  );
});
