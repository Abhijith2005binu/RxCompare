const express = require("express");
const router = express.Router();
const dashboardService = require("../services/dashboardService");

// -----------------------------------------------------------------------------
// Auth & Demo Switcher
// -----------------------------------------------------------------------------
router.get("/auth/demo-users", (_req, res) => {
  res.json({ success: true, users: dashboardService.getDemoUsers() });
});

router.post("/auth/register", (req, res, next) => {
  try {
    const { name, email, role, phone, address, kendraId, kendraName } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required" });
    }
    const result = dashboardService.registerUser({ name, email, role, phone, address, kendraId, kendraName });
    res.json({ success: true, user: result.user, alreadyExisted: result.alreadyExisted });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", (req, res, next) => {
  try {
    const { email } = req.body;
    const user = dashboardService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// Admin Endpoints
// -----------------------------------------------------------------------------
router.get("/admin/stats", (_req, res) => {
  res.json({ success: true, stats: dashboardService.getAdminStats() });
});

router.get("/admin/applications", (req, res) => {
  const { status } = req.query;
  const applications = dashboardService.listKendraApplications(status);
  res.json({ success: true, applications });
});

router.post("/admin/applications/:id/approve", (req, res, next) => {
  try {
    const result = dashboardService.approveKendraApplication(req.params.id);
    res.json({
      success: true,
      message: `Kendra "${result.application.name}" (${result.application.kendraCode}) approved and added to active network!`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/admin/applications/:id/reject", (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = dashboardService.rejectKendraApplication(req.params.id, reason);
    res.json({
      success: true,
      message: `Application rejected for "${result.name}"`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/orders", (_req, res) => {
  res.json({ success: true, orders: dashboardService.getAllOrders() });
});

// -----------------------------------------------------------------------------
// Kendra Owner Endpoints
// -----------------------------------------------------------------------------
router.post("/kendra/register", (req, res, next) => {
  try {
    const { kendraName, ownerName, email, phone, address, city, state } = req.body;
    if (!kendraName || !ownerName || !email || !phone || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required Kendra fields (name, owner, email, phone, address, city, state)",
      });
    }
    const app = dashboardService.submitKendraRegistration(req.body);
    res.status(201).json({
      success: true,
      message: "Kendra registration submitted successfully. Awaiting Admin verification.",
      application: app,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/kendra/inventory/:kendraId", (req, res, next) => {
  try {
    const inventory = dashboardService.getKendraInventory(req.params.kendraId);
    res.json({ success: true, ...inventory });
  } catch (err) {
    next(err);
  }
});

router.put("/kendra/inventory/:kendraId/:medicineId", (req, res, next) => {
  try {
    const { kendraId, medicineId } = req.params;
    const { units, inStock, batchNumber, expiryDate } = req.body;
    const result = dashboardService.updateKendraStock(kendraId, medicineId, {
      units,
      inStock,
      batchNumber,
      expiryDate,
    });
    res.json({
      success: true,
      message: "Stock updated successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/kendra/inventory/:kendraId", (req, res, next) => {
  try {
    const { kendraId } = req.params;
    const result = dashboardService.addMedicineToKendra(kendraId, req.body);
    res.status(201).json({
      success: true,
      message: "New formulation added to Kendra inventory",
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/kendra/orders/:kendraId", (req, res, next) => {
  try {
    const orders = dashboardService.getKendraOrders(req.params.kendraId);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

router.put("/kendra/orders/:orderId/status", (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updated = dashboardService.updateOrderStatus(orderId, status);
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// Customer Endpoints (Order Online & Stock Alerts)
// -----------------------------------------------------------------------------
router.post("/orders", (req, res, next) => {
  try {
    const order = dashboardService.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: `Order #${order.id} placed successfully with ${order.kendraName}!`,
      order,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/orders/my", (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email query param required" });
    }
    const orders = dashboardService.getCustomerOrders(email);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

router.post("/stock-alerts", (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, medicineId, kendraId } = req.body;
    if (!customerEmail || !medicineId) {
      return res.status(400).json({ success: false, error: "Email and medicineId are required" });
    }
    const alert = dashboardService.createStockAlert({
      customerName,
      customerEmail,
      customerPhone,
      medicineId,
      kendraId,
    });
    res.status(201).json({
      success: true,
      message: `Alert subscribed! We will notify you as soon as "${alert.medicineName}" is restocked.`,
      alert,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/stock-alerts/my", (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email query param required" });
    }
    const alerts = dashboardService.getCustomerStockAlerts(email);
    res.json({ success: true, alerts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
