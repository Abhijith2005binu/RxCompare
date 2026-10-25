require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const medicineRoutes = require("./routes/medicines");
const storeRoutes = require("./routes/stores");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const uhiGatewayService = require("./services/uhiGatewayService");
const { getDbStatus } = require("./config/db");

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    mode: "Live ABDM / UHI Medicine & Kendra API",
    dbConnected: getDbStatus(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ABDM / UHI Network Status
app.get("/api/uhi/status", (_req, res) => {
  res.json({
    ...uhiGatewayService.getStatus(),
    dbConnected: getDbStatus(),
  });
});

// Resource Routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api", dashboardRoutes);

// Fallback & Error Handling Middleware (must be registered after routes)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`[server] RxCompare API running at http://localhost:${PORT}`)
  );
}); 
