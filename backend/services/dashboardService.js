/**
 * RxCompare Multi-Role Dashboard Service
 *
 * Implements dedicated functions and powers for:
 * 1. Admin:
 *    - Global KPIs (Kendras, pending approvals, catalog, orders, network savings)
 *    - Review, approve, or reject Kendra owner applications
 *    - System-wide orders and inventory audit
 *
 * 2. Kendra Owner:
 *    - Kendra registration submission
 *    - Product & stock inventory management (units in stock, batch, inStock status)
 *    - Order fulfillment workflow (Placed -> Confirmed -> Ready -> Completed)
 *    - View stock alerts and restock triggers
 *
 * 3. Customer:
 *    - Real-time in-stock checking
 *    - Online medicine ordering (with delivery/pickup and Kendra assignment)
 *    - Out-of-stock alert notifications ("Notify Me when back in stock")
 *    - Order tracking history
 */

const uhiGatewayService = require("./uhiGatewayService");

// -----------------------------------------------------------------------------
// Seeded Demo Users
// -----------------------------------------------------------------------------
const INITIAL_USERS = [
  {
    id: "usr-admin-1",
    name: "Dr. Rajesh Varma",
    email: "admin@rxcompare.gov.in",
    role: "admin",
    designation: "Chief PMBJP Network Administrator",
    phone: "+91 11 2338 5642",
    status: "active",
  },
  {
    id: "usr-kendra-1",
    name: "Sunil Deshmukh",
    email: "parel.kendra@pmbjp.in",
    role: "kendra_owner",
    kendraId: "PMBJK02001",
    kendraName: "Jan Aushadhi Kendra - KEM Hospital Parel",
    phone: "+91 98201 44552",
    status: "approved",
  },
  {
    id: "usr-kendra-2",
    name: "Anita Saxena",
    email: "anita.kendra@pmbjp.in",
    role: "kendra_owner",
    kendraId: "PMBJK-APP-99",
    kendraName: "Jan Aushadhi Kendra - Rohini Sector 7",
    phone: "+91 98112 33445",
    status: "pending", // Pending approval demo!
  },
  {
    id: "usr-customer-1",
    name: "Ramesh Sharma",
    email: "ramesh.sharma@gmail.com",
    role: "customer",
    phone: "+91 98765 43210",
    address: "B-402, Green Glen Residences, Bellandur, Bengaluru, Karnataka - 560103",
    status: "active",
  },
];

// -----------------------------------------------------------------------------
// Seeded Kendra Applications (for Admin review)
// -----------------------------------------------------------------------------
const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    kendraCode: "PMBJK09101",
    name: "Jan Aushadhi Kendra - Rohini Sector 7",
    ownerName: "Anita Saxena",
    email: "anita.kendra@pmbjp.in",
    phone: "+91 98112 33445",
    address: "Shop No. 12, DDA Community Centre, Sector 7, Rohini",
    city: "New Delhi",
    district: "North West Delhi",
    state: "Delhi",
    pincode: "110085",
    licenseNumber: "DL-PMBJP-2026-90412",
    operatingHours: "08:30 AM - 09:30 PM",
    location: { lat: 28.7159, lng: 77.1147 },
    status: "pending",
    submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    initialProductsCount: 15,
  },
  {
    id: "app-102",
    kendraCode: "PMBJK09102",
    name: "Jan Aushadhi Kendra - Salt Lake Sector V",
    ownerName: "Debashis Mukherjee",
    email: "debashis.pharma@gmail.com",
    phone: "+91 98300 77112",
    address: "Block EP & GP, Sector V, Bidhannagar, Salt Lake",
    city: "Kolkata",
    district: "North 24 Parganas",
    state: "West Bengal",
    pincode: "700091",
    licenseNumber: "WB-PMBJP-2026-44120",
    operatingHours: "09:00 AM - 09:00 PM",
    location: { lat: 22.5804, lng: 88.4378 },
    status: "pending",
    submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    initialProductsCount: 12,
  },
];

// -----------------------------------------------------------------------------
// Seeded Orders
// -----------------------------------------------------------------------------
const INITIAL_ORDERS = [
  {
    id: "ORD-9401",
    customerName: "Ramesh Sharma",
    customerEmail: "ramesh.sharma@gmail.com",
    customerPhone: "+91 98765 43210",
    deliveryAddress: "B-402, Green Glen Residences, Bellandur, Bengaluru, Karnataka - 560103",
    deliveryType: "delivery",
    kendraId: "PMBJK03001",
    kendraName: "Jan Aushadhi Kendra - Victoria Hospital Campus",
    items: [
      {
        medicineId: "med-001",
        genericName: "Paracetamol 650mg Tablets",
        packSize: "10 Tablets",
        genericMrp: 11.50,
        quantity: 3,
        totalPrice: 34.50,
      },
      {
        medicineId: "med-005",
        genericName: "Pantoprazole 40mg Gastro-Resistant Tablets",
        packSize: "10 Tablets",
        genericMrp: 14.50,
        quantity: 2,
        totalPrice: 29.00,
      },
    ],
    totalAmount: 63.50,
    status: "confirmed", // placed -> confirmed -> ready -> completed
    paymentMethod: "Cash / UPI on Delivery",
    notes: "Please call upon arrival at gate.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    statusHistory: [
      { status: "placed", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
      { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
    ],
  },
  {
    id: "ORD-9402",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@example.com",
    customerPhone: "+91 98230 99881",
    deliveryAddress: "Counter Pickup at Kendra",
    deliveryType: "pickup",
    kendraId: "PMBJK02001",
    kendraName: "Jan Aushadhi Kendra - KEM Hospital Parel",
    items: [
      {
        medicineId: "med-002",
        genericName: "Atorvastatin 10mg Tablets",
        packSize: "10 Tablets",
        genericMrp: 9.80,
        quantity: 4,
        totalPrice: 39.20,
      },
    ],
    totalAmount: 39.20,
    status: "ready",
    paymentMethod: "UPI at Kendra Counter",
    notes: "Prescription copy will be shown at counter.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    statusHistory: [
      { status: "placed", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { status: "ready", timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString() },
    ],
  },
];

// -----------------------------------------------------------------------------
// Seeded Stock Alert Requests
// -----------------------------------------------------------------------------
const INITIAL_STOCK_ALERTS = [
  {
    id: "alt-801",
    customerName: "Ramesh Sharma",
    customerEmail: "ramesh.sharma@gmail.com",
    customerPhone: "+91 98765 43210",
    medicineId: "med-004",
    medicineName: "Azithromycin 500mg Tablets",
    kendraId: "PMBJK01002",
    kendraName: "Jan Aushadhi Kendra - Connaught Place",
    status: "pending", // pending -> notified
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    notificationMessage: null,
    notifiedAt: null,
  },
];

class DashboardService {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.applications = [...INITIAL_APPLICATIONS];
    this.orders = [...INITIAL_ORDERS];
    this.stockAlerts = [...INITIAL_STOCK_ALERTS];
    this.orderCounter = 9403;
  }

  // =========================================================================
  // Auth & Roles
  // =========================================================================

  getDemoUsers() {
    return this.users.map(({ id, name, email, role, kendraId, kendraName, designation, phone, address, status }) => ({
      id,
      name,
      email,
      role,
      kendraId,
      kendraName,
      designation,
      phone,
      address,
      status,
    }));
  }

  getUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === (email || "").trim().toLowerCase());
  }

  registerUser(userData) {
    const { name, email, role = "customer", phone, address, kendraId, kendraName } = userData;
    const existing = this.getUserByEmail(email);
    if (existing) {
      return { user: existing, alreadyExisted: true };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      phone: phone ? phone.trim() : "",
      address: address ? address.trim() : "",
      kendraId: kendraId || null,
      kendraName: kendraName || null,
      status: role === "kendra_owner" ? "pending" : "active",
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return { user: newUser, alreadyExisted: false };
  }

  // =========================================================================
  // Admin Operations
  // =========================================================================

  getAdminStats() {
    const totalKendras = uhiGatewayService.stores.length;
    const pendingApplications = this.applications.filter((a) => a.status === "pending").length;
    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter((o) => o.status === "completed").length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalMedicines = uhiGatewayService.medicines.length;

    // Estimate network citizen savings
    const estimatedSavings = this.orders.reduce((sum, o) => {
      const orderSavings = o.items.reduce((iSum, item) => {
        const med = uhiGatewayService.getMedicineById(item.medicineId);
        if (med && med.cheapestBrandedMrp) {
          return iSum + (med.cheapestBrandedMrp - item.genericMrp) * item.quantity;
        }
        return iSum + item.genericMrp * item.quantity * 2; // ~65% savings default
      }, 0);
      return sum + orderSavings;
    }, 0);

    return {
      totalKendras,
      pendingApplications,
      totalOrders,
      completedOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      estimatedSavings: Number(estimatedSavings.toFixed(2)),
      totalMedicines,
      activeStockAlerts: this.stockAlerts.filter((a) => a.status === "pending").length,
    };
  }

  listKendraApplications(statusFilter) {
    if (statusFilter && statusFilter !== "all") {
      return this.applications.filter((a) => a.status === statusFilter);
    }
    return this.applications;
  }

  approveKendraApplication(appId) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) throw new Error("Application not found");
    if (app.status === "approved") throw new Error("Application is already approved");

    app.status = "approved";
    app.approvedAt = new Date().toISOString();

    // Register into live ABDM Kendra Stores registry so customers can immediately find it!
    const newStore = {
      id: app.kendraCode || `PMBJK${Math.floor(10000 + Math.random() * 90000)}`,
      name: app.name,
      address: app.address,
      city: app.city,
      district: app.district,
      state: app.state,
      pincode: app.pincode,
      phone: app.phone,
      email: app.email,
      operatingHours: app.operatingHours || "08:30 AM - 09:00 PM",
      location: app.location || { lat: 28.6139, lng: 77.2090 },
      // Initialize full medicine catalog in stock for this newly approved Kendra
      inventory: {},
    };

    uhiGatewayService.medicines.forEach((m) => {
      newStore.inventory[m.id] = {
        inStock: true,
        units: 50, // Initial approved stock
      };
    });

    // Check if store already in list
    const existingIdx = uhiGatewayService.stores.findIndex((s) => s.id === newStore.id);
    if (existingIdx >= 0) {
      uhiGatewayService.stores[existingIdx] = newStore;
    } else {
      uhiGatewayService.stores.unshift(newStore);
    }

    // Update user record if exists
    const user = this.users.find((u) => u.email.toLowerCase() === app.email.toLowerCase());
    if (user) {
      user.status = "approved";
      user.kendraId = newStore.id;
      user.kendraName = newStore.name;
    }

    return { application: app, store: newStore };
  }

  rejectKendraApplication(appId, reason = "Incomplete license documentation") {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) throw new Error("Application not found");
    app.status = "rejected";
    app.rejectionReason = reason;
    app.rejectedAt = new Date().toISOString();

    const user = this.users.find((u) => u.email.toLowerCase() === app.email.toLowerCase());
    if (user) {
      user.status = "rejected";
    }

    return app;
  }

  // =========================================================================
  // Kendra Owner Operations
  // =========================================================================

  submitKendraRegistration(formData) {
    const {
      kendraName,
      ownerName,
      email,
      phone,
      address,
      city,
      district,
      state,
      pincode,
      licenseNumber,
      operatingHours,
      lat,
      lng,
      initialProducts,
    } = formData;

    const kendraCode = `PMBJK${Math.floor(10000 + Math.random() * 89999)}`;
    const newApp = {
      id: `app-${Date.now()}`,
      kendraCode,
      name: kendraName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      district: district ? district.trim() : city.trim(),
      state: state.trim(),
      pincode: pincode ? pincode.trim() : "",
      licenseNumber: licenseNumber ? licenseNumber.trim() : `LIC-${Date.now()}`,
      operatingHours: operatingHours || "08:30 AM - 09:00 PM (All 7 Days)",
      location: {
        lat: lat ? parseFloat(lat) : 28.6139,
        lng: lng ? parseFloat(lng) : 77.2090,
      },
      status: "pending",
      submittedAt: new Date().toISOString(),
      initialProductsCount: Array.isArray(initialProducts) ? initialProducts.length : uhiGatewayService.medicines.length,
    };

    this.applications.unshift(newApp);

    // Also register or update user profile
    this.registerUser({
      name: ownerName,
      email,
      role: "kendra_owner",
      phone,
      address,
      kendraId: kendraCode,
      kendraName,
    });

    return newApp;
  }

  getKendraInventory(kendraId) {
    const store = uhiGatewayService.stores.find((s) => s.id === kendraId);
    if (!store) {
      // Return empty inventory placeholder if store not yet approved
      return { store: null, items: [] };
    }

    const items = uhiGatewayService.medicines.map((med) => {
      const stock = store.inventory[med.id] || { inStock: false, units: 0 };
      return {
        medicineId: med.id,
        drugCode: med.drugCode,
        genericName: med.genericName,
        composition: med.composition,
        category: med.category,
        packSize: med.packSize,
        genericMrp: med.genericMrp,
        prescriptionRequired: med.prescriptionRequired,
        inStock: stock.inStock,
        units: stock.units,
        batchNumber: stock.batchNumber || `BAT-${med.drugCode.slice(-3)}-2026`,
        expiryDate: stock.expiryDate || "12/2027",
      };
    });

    return { store, items };
  }

  updateKendraStock(kendraId, medicineId, { units, inStock, batchNumber, expiryDate }) {
    const store = uhiGatewayService.stores.find((s) => s.id === kendraId);
    if (!store) throw new Error("Kendra store not found");

    if (!store.inventory) store.inventory = {};

    const numUnits = parseInt(units, 10);
    const wasOutOfStock = !store.inventory[medicineId] || !store.inventory[medicineId].inStock || store.inventory[medicineId].units === 0;

    store.inventory[medicineId] = {
      inStock: inStock !== undefined ? inStock : numUnits > 0,
      units: isNaN(numUnits) ? 0 : Math.max(0, numUnits),
      batchNumber: batchNumber || store.inventory[medicineId]?.batchNumber || "BAT-2026",
      expiryDate: expiryDate || store.inventory[medicineId]?.expiryDate || "12/2027",
      lastUpdated: new Date().toISOString(),
    };

    const isNowInStock = store.inventory[medicineId].inStock && store.inventory[medicineId].units > 0;

    // Trigger stock alert notifications if it transitioned to in-stock!
    let triggeredAlerts = 0;
    if (wasOutOfStock && isNowInStock) {
      triggeredAlerts = this.notifyWaitingCustomers(kendraId, medicineId, store.name, store.inventory[medicineId].units);
    }

    return {
      kendraId,
      medicineId,
      stock: store.inventory[medicineId],
      triggeredAlerts,
    };
  }

  addMedicineToKendra(kendraId, medicineData) {
    const store = uhiGatewayService.stores.find((s) => s.id === kendraId);
    if (!store) throw new Error("Kendra store not found");

    const {
      genericName,
      composition,
      category,
      packSize,
      genericMrp,
      units = 50,
      brandedEquivalents = [],
    } = medicineData;

    const drugCode = `PMBJP-${Math.floor(100 + Math.random() * 900)}`;
    const newMedId = `med-${Date.now()}`;

    const newMed = {
      id: newMedId,
      drugCode,
      genericName: genericName.trim(),
      composition: composition ? composition.trim() : genericName.trim(),
      category: category ? category.trim() : "General",
      packSize: packSize ? packSize.trim() : "10 Tablets",
      genericMrp: parseFloat(genericMrp) || 15.00,
      prescriptionRequired: false,
      brandedEquivalents: brandedEquivalents || [],
      purchaseInfo: {
        unitPrice: (parseFloat(genericMrp) || 15.00) / 10,
        packMrp: parseFloat(genericMrp) || 15.00,
        packSize: packSize || "10 Tablets",
        currency: "INR",
        subsidyScheme: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
        purchaseAvailability: "Available at PMBJP Kendras",
      },
      searchKeywords: [genericName.toLowerCase(), drugCode.toLowerCase()],
    };

    // Add to global catalog
    uhiGatewayService.medicines.unshift(newMed);

    // Add to this Kendra's inventory
    store.inventory[newMedId] = {
      inStock: true,
      units: parseInt(units, 10) || 50,
      batchNumber: `BAT-${drugCode}`,
      expiryDate: "12/2027",
    };

    return { medicine: newMed, stock: store.inventory[newMedId] };
  }

  // =========================================================================
  // Order Online Workflow (Customer & Kendra Owner)
  // =========================================================================

  createOrder(orderData) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryType = "delivery",
      kendraId,
      items = [],
      paymentMethod = "Cash / UPI on Delivery",
      notes = "",
    } = orderData;

    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one medicine item");
    }

    const store = uhiGatewayService.stores.find((s) => s.id === kendraId);
    if (!store) throw new Error("Selected Jan Aushadhi Kendra not found");

    // Validate and deduct stock
    const processedItems = items.map((item) => {
      const med = uhiGatewayService.getMedicineById(item.medicineId);
      if (!med) throw new Error(`Medicine ${item.medicineId} not found in catalog`);

      const qty = parseInt(item.quantity, 10) || 1;
      const stock = store.inventory[med.id];

      if (!stock || !stock.inStock || stock.units < qty) {
        throw new Error(
          `Insufficient stock for "${med.genericName}" at ${store.name}. Available: ${stock ? stock.units : 0} units.`
        );
      }

      // Deduct stock
      stock.units -= qty;
      if (stock.units <= 0) {
        stock.inStock = false;
        stock.units = 0;
      }

      return {
        medicineId: med.id,
        drugCode: med.drugCode,
        genericName: med.genericName,
        packSize: med.packSize,
        genericMrp: med.genericMrp,
        quantity: qty,
        totalPrice: Number((med.genericMrp * qty).toFixed(2)),
      };
    });

    const totalAmount = Number(
      processedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
    );

    const orderId = `ORD-${++this.orderCounter}`;
    const newOrder = {
      id: orderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone ? customerPhone.trim() : "",
      deliveryAddress: deliveryAddress ? deliveryAddress.trim() : "Counter Pickup",
      deliveryType,
      kendraId: store.id,
      kendraName: store.name,
      kendraPhone: store.phone,
      kendraAddress: store.address,
      items: processedItems,
      totalAmount,
      status: "placed", // placed -> confirmed -> ready -> completed -> cancelled
      paymentMethod,
      paymentStatus: orderData.paymentStatus || (paymentMethod.includes("Delivery") ? "pending_on_delivery" : "simulated_paid"),
      transactionId: orderData.transactionId || (paymentMethod.includes("Delivery") ? null : `TXN-PMBJP-${Date.now().toString().slice(-6)}`),
      paymentSimulationMethod: orderData.paymentSimulationMethod || "UPI",
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: "placed", timestamp: new Date().toISOString() }],
    };

    this.orders.unshift(newOrder);

    // Auto register or update customer info
    this.registerUser({
      name: customerName,
      email: customerEmail,
      role: "customer",
      phone: customerPhone,
      address: deliveryAddress,
    });

    return newOrder;
  }

  getCustomerOrders(customerEmail) {
    const email = (customerEmail || "").trim().toLowerCase();
    return this.orders.filter((o) => o.customerEmail === email);
  }

  getKendraOrders(kendraId) {
    return this.orders.filter((o) => o.kendraId === kendraId);
  }

  getAllOrders() {
    return this.orders;
  }

  updateOrderStatus(orderId, newStatus) {
    const validStatuses = ["placed", "confirmed", "ready", "completed", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    order.status = newStatus;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({ status: newStatus, timestamp: new Date().toISOString() });

    // If cancelled, restore stock
    if (newStatus === "cancelled") {
      const store = uhiGatewayService.stores.find((s) => s.id === order.kendraId);
      if (store) {
        order.items.forEach((item) => {
          if (store.inventory[item.medicineId]) {
            store.inventory[item.medicineId].units += item.quantity;
            store.inventory[item.medicineId].inStock = true;
          }
        });
      }
    }

    return order;
  }

  // =========================================================================
  // Stock Alerts ("Notify Me when back in stock")
  // =========================================================================

  createStockAlert({ customerName, customerEmail, customerPhone, medicineId, kendraId }) {
    const med = uhiGatewayService.getMedicineById(medicineId);
    if (!med) throw new Error("Medicine not found");

    let kendraName = "Any Nearby Kendra";
    if (kendraId) {
      const store = uhiGatewayService.stores.find((s) => s.id === kendraId);
      if (store) kendraName = store.name;
    }

    const alertId = `alt-${Date.now()}`;
    const newAlert = {
      id: alertId,
      customerName: (customerName || "Customer").trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone ? customerPhone.trim() : "",
      medicineId: med.id,
      medicineName: med.genericName,
      drugCode: med.drugCode,
      kendraId: kendraId || null,
      kendraName,
      status: "pending",
      createdAt: new Date().toISOString(),
      notificationMessage: null,
      notifiedAt: null,
    };

    this.stockAlerts.unshift(newAlert);
    return newAlert;
  }

  getCustomerStockAlerts(customerEmail) {
    const email = (customerEmail || "").trim().toLowerCase();
    return this.stockAlerts.filter((a) => a.customerEmail === email);
  }

  notifyWaitingCustomers(kendraId, medicineId, kendraName, unitsAvailable) {
    const matchingAlerts = this.stockAlerts.filter(
      (a) =>
        a.medicineId === medicineId &&
        a.status === "pending" &&
        (!a.kendraId || a.kendraId === kendraId)
    );

    const now = new Date().toISOString();
    matchingAlerts.forEach((alert) => {
      alert.status = "notified";
      alert.notifiedAt = now;
      alert.notificationMessage = `Good news! "${alert.medicineName}" is now back in stock at ${kendraName} (${unitsAvailable} units available). You can now place your order online!`;
    });

    return matchingAlerts.length;
  }
}

module.exports = new DashboardService();
