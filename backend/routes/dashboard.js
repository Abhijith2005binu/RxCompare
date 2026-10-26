const express = require("express");
const router = express.Router();

const dashboardService = require("../services/dashboardService");
const { requireDb } = require("../config/db");
const { authenticate, requireRole, requireKendraAccess } = require("../middleware/auth");

// Every dashboard endpoint requires a signed-in account.
router.use(requireDb, authenticate);

// -----------------------------------------------------------------------------
// Admin endpoints (hardcoded administrator session only)
// -----------------------------------------------------------------------------
router.get("/admin/stats", requireRole("admin"), async (_req, res, next) => {
  try {
    res.json({ success: true, stats: await dashboardService.getAdminStats() });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/applications", requireRole("admin"), async (req, res, next) => {
  try {
    const applications = await dashboardService.listKendraApplications(req.query.status || "all");
    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/admin/applications/:id/approve",
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const result = await dashboardService.approveKendraApplication(req.params.id);
      res.json({
        success: true,
        message: `Kendra "${result.application.name}" (${result.application.kendraCode}) approved and added to the active network.`,
        data: result,
      });
    } catch (err) {
      if (/not found/i.test(err.message)) err.status = 404;
      else if (/already|rejected|verified/i.test(err.message)) err.status = 400;
      next(err);
    }
  }
);

router.post(
  "/admin/applications/:id/reject",
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const { reason } = req.body || {};
      const application = await dashboardService.rejectKendraApplication(req.params.id, reason);
      res.json({
        success: true,
        message: `Application rejected for "${application.name}"`,
        data: application,
      });
    } catch (err) {
      if (/not found/i.test(err.message)) err.status = 404;
      else if (/already|approved/i.test(err.message)) err.status = 400;
      next(err);
    }
  }
);

router.get("/admin/orders", requireRole("admin"), async (_req, res, next) => {
  try {
    res.json({ success: true, orders: await dashboardService.getAllOrders() });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/users", requireRole("admin"), async (req, res, next) => {
  try {
    const users = await dashboardService.listUsers(req.query.role || "all");
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
});

router.patch("/admin/users/:id/status", requireRole("admin"), async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const user = await dashboardService.setUserStatus(req.params.id, status);
    res.json({
      success: true,
      message: `${user.role === "kendra_owner" ? "Kendra owner" : "Customer"} "${user.name}" is now ${user.status}.`,
      user,
    });
  } catch (err) {
    if (/not found/i.test(err.message)) err.status = 404;
    else if (/invalid|only|must be/i.test(err.message)) err.status = 400;
    else if (err.name === "CastError") err.status = 400;
    next(err);
  }
});

router.get("/admin/kendras", requireRole("admin"), async (_req, res, next) => {
  try {
    res.json({ success: true, kendras: await dashboardService.listKendrasForAdmin() });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/admin/kendras/:kendraCode/status",
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const { status } = req.body || {};
      const kendra = await dashboardService.setKendraStatus(req.params.kendraCode, status);
      res.json({
        success: true,
        message: `Kendra "${kendra.name}" is now ${kendra.status}.`,
        kendra,
      });
    } catch (err) {
      if (/not found/i.test(err.message)) err.status = 404;
      else if (/invalid/i.test(err.message)) err.status = 400;
      next(err);
    }
  }
);

router.delete("/admin/users/:id", requireRole("admin"), async (req, res, next) => {
  try {
    const user = await dashboardService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: `${user.role === "kendra_owner" ? "Kendra owner" : "Customer"} "${user.name}" deleted permanently.`,
      user,
    });
  } catch (err) {
    if (/not found/i.test(err.message)) err.status = 404;
    if (err.name === "CastError") err.status = 400;
    next(err);
  }
});

// -----------------------------------------------------------------------------
// Kendra owner endpoints
// -----------------------------------------------------------------------------
router.get(
  "/kendra/inventory/:kendraCode",
  requireRole("kendra_owner", "admin"),
  requireKendraAccess(),
  async (req, res, next) => {
    try {
      const inventory = await dashboardService.getKendraInventory(req.params.kendraCode);
      res.json({ success: true, ...inventory });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/kendra/inventory/:kendraCode/:medicineId",
  requireRole("kendra_owner", "admin"),
  requireKendraAccess(),
  async (req, res, next) => {
    try {
      const { units, inStock, batchNumber, expiryDate, price, genericMrp } = req.body || {};
      const result = await dashboardService.updateKendraStock(
        req.params.kendraCode,
        req.params.medicineId,
        { units, inStock, batchNumber, expiryDate, price, genericMrp }
      );
      res.json({ success: true, message: "Stock and price updated successfully", ...result });
    } catch (err) {
      if (/not found/i.test(err.message)) err.status = 404;
      else if (/valid|required|greater than zero/i.test(err.message)) err.status = 400;
      next(err);
    }
  }
);

router.post(
  "/kendra/inventory/:kendraCode",
  requireRole("kendra_owner", "admin"),
  requireKendraAccess(),
  async (req, res, next) => {
    try {
      const result = await dashboardService.addMedicineToKendra(
        req.params.kendraCode,
        req.body || {}
      );
      res.status(201).json({
        success: true,
        message: "New formulation added to Kendra inventory",
        ...result,
      });
    } catch (err) {
      if (/not found/i.test(err.message)) err.status = 404;
      else if (/valid|required|greater than zero|identifier/i.test(err.message)) {
        err.status = 400;
      }
      next(err);
    }
  }
);

router.get(
  "/kendra/orders/:kendraCode",
  requireRole("kendra_owner", "admin"),
  requireKendraAccess(),
  async (req, res, next) => {
    try {
      const orders = await dashboardService.getKendraOrders(req.params.kendraCode);
      res.json({ success: true, orders });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/kendra/orders/:orderId/status",
  requireRole("kendra_owner", "admin"),
  async (req, res, next) => {
    try {
      const { status } = req.body || {};
      const order = await dashboardService.updateOrderStatus(req.params.orderId, status, {
        enforceKendraCode: req.user.role === "admin" ? null : req.user.kendraCode,
      });

      res.json({
        success: true,
        message: `Order status updated to ${status}`,
        order,
      });
    } catch (err) {
      if (/not found/i.test(err.message)) err.status = 404;
      else if (/invalid status/i.test(err.message)) err.status = 400;
      next(err);
    }
  }
);

// -----------------------------------------------------------------------------
// Customer endpoints (orders + stock alerts)
// -----------------------------------------------------------------------------
router.post("/orders/quote", requireRole("customer", "admin"), async (req, res, next) => {
  try {
    const { kendraCode, kendraId, items } = req.body || {};
    const quote = await dashboardService.quoteOrder({
      kendraCode: kendraCode || kendraId || null,
      items,
    });
    res.json({ success: true, ...quote });
  } catch (err) {
    if (/not found|empty|valid|required|available/i.test(err.message)) err.status = 400;
    next(err);
  }
});

router.post("/orders", requireRole("customer", "admin"), async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    const body = req.body || {};

    const customerEmail = isAdmin ? body.customerEmail || req.user.email : req.user.email;
    const customerName = isAdmin ? body.customerName || req.user.name : req.user.name;
    const customerPhone = body.customerPhone || req.user.phone || "";

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        error: "Customer email is required to place an order.",
      });
    }

    const order = await dashboardService.createOrder({
      ...body,
      customerEmail,
      customerName,
      customerPhone,
      customerUserId: isAdmin ? null : req.user.id,
    });

    res.status(201).json({
      success: true,
      message: `Order #${order.orderNumber} placed successfully with ${order.kendraName}.`,
      order,
    });
  } catch (err) {
    if (/not found|must contain|required|out of stock|available/i.test(err.message)) {
      err.status = 400;
    }
    next(err);
  }
});

router.get("/orders/my", requireRole("customer", "admin"), async (req, res, next) => {
  try {
    const email =
      req.user.role === "admin" ? req.query.email || req.user.email : req.user.email;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    const orders = await dashboardService.getCustomerOrders(email);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

router.post("/stock-alerts", requireRole("customer", "admin"), async (req, res, next) => {
  try {
    const body = req.body || {};
    const customerEmail =
      req.user.role === "admin" ? body.customerEmail || req.user.email : req.user.email;

    if (!customerEmail || !body.medicineId) {
      return res.status(400).json({
        success: false,
        error: "Email and medicineId are required.",
      });
    }

    const alert = await dashboardService.createStockAlert({
      ...body,
      customerEmail,
      customerName: body.customerName || req.user.name,
      customerPhone: body.customerPhone || req.user.phone,
      customerUserId: req.user.role === "admin" ? null : req.user.id,
    });

    res.status(201).json({
      success: true,
      message: `Alert subscribed. We will notify you as soon as "${alert.medicineName}" is restocked.`,
      alert,
    });
  } catch (err) {
    if (/not found|required/i.test(err.message)) err.status = 400;
    next(err);
  }
});

router.get(
  "/stock-alerts/my",
  requireRole("customer", "admin"),
  async (req, res, next) => {
    try {
      const email =
        req.user.role === "admin" ? req.query.email || req.user.email : req.user.email;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email is required." });
      }
      const alerts = await dashboardService.getCustomerStockAlerts(email);
      res.json({ success: true, alerts });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
