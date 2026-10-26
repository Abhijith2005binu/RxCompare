const path = require("path");
// Load backend/.env if present, then fall back to the repository-root .env.
require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const { getDbStatus } = require("./config/db");
const requestLogger = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const medicineRoutes = require("./routes/medicines");
const storeRoutes = require("./routes/stores");
const dashboardRoutes = require("./routes/dashboard");
const uhiGatewayService = require("./services/uhiGatewayService");

const app = express();

// ---------------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(requestLogger);

const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

// ---------------------------------------------------------------------------
// Health / network status
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    mode: "MongoDB-backed ABDM / UHI Medicine & Kendra API",
    dbConnected: getDbStatus(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/uhi/status", async (_req, res, next) => {
  try {
    res.json({
      ...(await uhiGatewayService.getStatus()),
      dbConnected: getDbStatus(),
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api", dashboardRoutes);

// ---------------------------------------------------------------------------
// SPA fallback for non-API routes (/login, /register, /admin-login, ...)
// ---------------------------------------------------------------------------
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

async function start() {
  await connectDB({ required: true });
  app.listen(PORT, HOST, () => {
    console.log(`[server] RxCompare API running at http://${HOST}:${PORT}`);
    console.log(
      `[server] Admin sign-in is available only at http://localhost:${PORT}/admin-login`
    );
  });
}

start().catch((err) => {
  console.error("[server] Failed to start — MongoDB is required.");
  console.error(`[server] ${err.message}`);
  process.exit(1);
});
