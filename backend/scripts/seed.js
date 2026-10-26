/**
 * Seed the RxCompare MongoDB database with the medicine catalog, Jan Aushadhi
 * Kendras, per-store inventory, demo accounts, orders and stock alerts.
 *
 * Usage: npm run seed
 */

const path = require("path");
// Load backend/.env if present, then fall back to the repository-root .env.
require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = require("../config/db");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Kendra = require("../models/Kendra");
const Inventory = require("../models/Inventory");
const KendraApplication = require("../models/KendraApplication");
const Order = require("../models/Order");
const StockAlert = require("../models/StockAlert");
const Counter = require("../models/Counter");

const medicines = require("../data/medicines.catalog");
const kendras = require("../data/kendras.seed");

const DEMO_PASSWORD_CUSTOMER = "Customer@123";
const DEMO_PASSWORD_OWNER = "Owner@123";

function deterministicStock(kendraCode, medicineId) {
  const hash = `${kendraCode}:${medicineId}`
    .split("")
    .reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 100000, 7);
  const inStock = hash % 11 !== 0; // ~91% of rows in stock
  return {
    inStock,
    units: inStock ? 15 + (hash % 130) : 0,
  };
}

function buildInventoryRows(medicinesList, kendra) {
  return medicinesList.map((med) => {
    const seeded = (kendra.inventory || {})[med.id];
    const stock = seeded || deterministicStock(kendra.kendraCode, med.id);
    return {
      kendraCode: kendra.kendraCode,
      medicineId: med.id,
      inStock: Boolean(stock.inStock && stock.units > 0),
      units: stock.units || 0,
      price:
        Number.isFinite(Number(stock.price)) && Number(stock.price) > 0
          ? Number(stock.price)
          : med.genericMrp,
      batchNumber: `BAT-${med.drugCode.replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase()}-2026`,
      expiryDate: "12/2027",
      lastUpdated: new Date(),
    };
  });
}

async function run() {
  await connectDB({ required: true });
  console.log("[seed] clearing existing collections…");

  await Promise.all([
    Medicine.deleteMany({}),
    User.deleteMany({}),
    Kendra.deleteMany({}),
    Inventory.deleteMany({}),
    KendraApplication.deleteMany({}),
    Order.deleteMany({}),
    StockAlert.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  // -------------------------------------------------------------------------
  // Medicines
  // -------------------------------------------------------------------------
  console.log(`[seed] inserting ${medicines.length} medicines…`);
  await Medicine.insertMany(
    medicines.map((med) => ({
      id: med.id,
      drugCode: med.drugCode,
      genericName: med.genericName,
      composition: med.composition || med.genericName,
      category: med.category || "General",
      dosageForm: med.dosageForm || "",
      packSize: med.packSize,
      genericMrp: med.genericMrp,
      prescriptionRequired: Boolean(med.prescriptionRequired),
      storageInstructions: med.storageInstructions || "",
      uses: med.uses || "",
      purchaseInfo: med.purchaseInfo || {},
      brandedEquivalents: med.brandedEquivalents || [],
      searchKeywords: med.searchKeywords || [],
    })),
    { ordered: false }
  );

  // -------------------------------------------------------------------------
  // Demo accounts
  // -------------------------------------------------------------------------
  console.log("[seed] creating demo accounts…");
  const customerPasswordHash = await User.hashPassword(DEMO_PASSWORD_CUSTOMER);
  const ownerPasswordHash = await User.hashPassword(DEMO_PASSWORD_OWNER);

  const [customer, owner, pendingOwner, secondPendingOwner, priya] = await User.create([
    {
      name: "Ramesh Sharma",
      email: "ramesh.sharma@gmail.com",
      passwordHash: customerPasswordHash,
      role: "customer",
      phone: "+91 98765 43210",
      address: "B-402, Green Glen Residences, Bellandur, Bengaluru, Karnataka - 560103",
      status: "active",
      emailVerified: true,
      verifiedAt: new Date(),
    },
    {
      name: "Sunil Deshmukh",
      email: "parel.kendra@pmbjp.in",
      passwordHash: ownerPasswordHash,
      role: "kendra_owner",
      phone: "+91 98201 44552",
      address: "Opp. Gate No. 3, KEM Hospital, Parel, Mumbai",
      status: "approved",
      emailVerified: true,
      verifiedAt: new Date(),
      kendraCode: "PMBJK02001",
      kendraName: "Jan Aushadhi Kendra - KEM Hospital Parel",
    },
    {
      name: "Anita Saxena",
      email: "anita.kendra@pmbjp.in",
      passwordHash: ownerPasswordHash,
      role: "kendra_owner",
      phone: "+91 98112 33445",
      address: "Shop No. 12, DDA Community Centre, Sector 7, Rohini, New Delhi",
      status: "pending",
      emailVerified: true,
      verifiedAt: new Date(),
    },
    {
      name: "Debashis Mukherjee",
      email: "debashis.pharma@gmail.com",
      passwordHash: ownerPasswordHash,
      role: "kendra_owner",
      phone: "+91 98300 77112",
      address: "Block EP & GP, Sector V, Bidhannagar, Salt Lake, Kolkata",
      status: "pending",
      emailVerified: true,
      verifiedAt: new Date(),
    },
    {
      name: "Priya Nair",
      email: "priya.nair@example.com",
      passwordHash: customerPasswordHash,
      role: "customer",
      phone: "+91 98230 99881",
      address: "12, Marine Drive, Kochi, Kerala - 682011",
      status: "active",
      emailVerified: true,
      verifiedAt: new Date(),
    },
  ]);

  // -------------------------------------------------------------------------
  // Kendras
  // -------------------------------------------------------------------------
  console.log(`[seed] inserting ${kendras.length} Jan Aushadhi Kendras…`);
  const kendraDocs = await Kendra.insertMany(
    kendras.map((kendra) => ({
      kendraCode: kendra.kendraCode,
      name: kendra.name,
      ownerUserId: kendra.kendraCode === "PMBJK02001" ? owner._id : null,
      ownerName: kendra.kendraCode === "PMBJK02001" ? owner.name : "",
      address: kendra.address,
      city: kendra.city,
      district: kendra.district || kendra.city,
      state: kendra.state,
      pincode: kendra.pincode || "",
      phone: kendra.phone || "",
      email: kendra.email || "",
      licenseNumber: `PMBJP-LIC-${kendra.kendraCode.slice(-5)}`,
      operatingHours: kendra.operatingHours,
      location: kendra.location,
      status: "active",
    }))
  );

  // -------------------------------------------------------------------------
  // Inventory for every Kendra x every medicine
  // -------------------------------------------------------------------------
  console.log("[seed] generating inventory rows…");
  let inventoryCount = 0;
  for (const kendra of kendras) {
    const rows = buildInventoryRows(medicines, kendra);
    await Inventory.insertMany(rows, { ordered: false });
    inventoryCount += rows.length;
  }
  console.log(`[seed] inserted ${inventoryCount} inventory rows.`);

  // -------------------------------------------------------------------------
  // Kendra applications (pending admin review)
  // -------------------------------------------------------------------------
  console.log("[seed] creating pending Kendra applications…");
  await KendraApplication.create([
    {
      kendraCode: "PMBJK09101",
      ownerUserId: pendingOwner._id,
      name: "Jan Aushadhi Kendra - Rohini Sector 7",
      ownerName: pendingOwner.name,
      email: pendingOwner.email,
      phone: pendingOwner.phone,
      address: "Shop No. 12, DDA Community Centre, Sector 7, Rohini",
      city: "New Delhi",
      district: "North West Delhi",
      state: "Delhi",
      pincode: "110085",
      licenseNumber: "DL-PMBJP-2026-90412",
      operatingHours: "08:30 AM - 09:30 PM",
      location: { lat: 28.7159, lng: 77.1147 },
      status: "pending",
      submittedAt: new Date(Date.now() - 3600000 * 18),
    },
    {
      kendraCode: "PMBJK09102",
      ownerUserId: secondPendingOwner._id,
      name: "Jan Aushadhi Kendra - Salt Lake Sector V",
      ownerName: secondPendingOwner.name,
      email: secondPendingOwner.email,
      phone: secondPendingOwner.phone,
      address: "Block EP & GP, Sector V, Bidhannagar, Salt Lake",
      city: "Kolkata",
      district: "North 24 Parganas",
      state: "West Bengal",
      pincode: "700091",
      licenseNumber: "WB-PMBJP-2026-44120",
      operatingHours: "09:00 AM - 09:00 PM",
      location: { lat: 22.5804, lng: 88.4378 },
      status: "pending",
      submittedAt: new Date(Date.now() - 3600000 * 36),
    },
  ]);

  // -------------------------------------------------------------------------
  // Demo orders
  // -------------------------------------------------------------------------
  console.log("[seed] creating demo orders…");
  const paracetamol = medicines.find((med) => med.id === "med-001");
  const pantoprazole = medicines.find((med) => med.id === "med-005");
  const atorvastatin = medicines.find((med) => med.id === "med-002");

  const orderOneItems = [
    {
      medicineId: paracetamol.id,
      drugCode: paracetamol.drugCode,
      genericName: paracetamol.genericName,
      packSize: paracetamol.packSize,
      genericMrp: paracetamol.genericMrp,
      quantity: 3,
      totalPrice: Number((paracetamol.genericMrp * 3).toFixed(2)),
    },
    {
      medicineId: pantoprazole.id,
      drugCode: pantoprazole.drugCode,
      genericName: pantoprazole.genericName,
      packSize: pantoprazole.packSize,
      genericMrp: pantoprazole.genericMrp,
      quantity: 2,
      totalPrice: Number((pantoprazole.genericMrp * 2).toFixed(2)),
    },
  ];
  const orderTwoItems = [
    {
      medicineId: atorvastatin.id,
      drugCode: atorvastatin.drugCode,
      genericName: atorvastatin.genericName,
      packSize: atorvastatin.packSize,
      genericMrp: atorvastatin.genericMrp,
      quantity: 4,
      totalPrice: Number((atorvastatin.genericMrp * 4).toFixed(2)),
    },
  ];

  await Order.create([
    {
      orderNumber: "ORD-9401",
      customerUserId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      deliveryAddress: customer.address,
      deliveryType: "delivery",
      kendraCode: "PMBJK03001",
      kendraName: "Jan Aushadhi Kendra - Victoria Hospital Campus",
      kendraPhone: "+91 80 2670 1150",
      kendraAddress: "Beside Blood Bank, Victoria Hospital Premise, Fort, Bengaluru",
      items: orderOneItems,
      totalAmount: Number(
        orderOneItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
      ),
      status: "confirmed",
      paymentMethod: "Cash / UPI on Delivery",
      paymentStatus: "pending_on_delivery",
      transactionId: null,
      paymentSimulationMethod: "Cash",
      notes: "Please call upon arrival at gate.",
      statusHistory: [
        { status: "placed", timestamp: new Date(Date.now() - 3600000 * 5) },
        { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 4) },
      ],
      createdAt: new Date(Date.now() - 3600000 * 5),
      updatedAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      orderNumber: "ORD-9402",
      customerUserId: priya._id,
      customerName: priya.name,
      customerEmail: priya.email,
      customerPhone: priya.phone,
      deliveryAddress: "Counter Pickup at Kendra",
      deliveryType: "pickup",
      kendraCode: "PMBJK02001",
      kendraName: "Jan Aushadhi Kendra - KEM Hospital Parel",
      kendraPhone: "+91 22 2410 7000",
      kendraAddress: "Opp. Gate No. 3, KEM Hospital, Parel, Mumbai",
      items: orderTwoItems,
      totalAmount: Number(
        orderTwoItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
      ),
      status: "ready",
      paymentMethod: "UPI at Kendra Counter",
      paymentStatus: "simulated_paid",
      transactionId: `TXN-PMBJP-${Date.now().toString().slice(-6)}`,
      paymentSimulationMethod: "UPI",
      notes: "Prescription copy will be shown at counter.",
      statusHistory: [
        { status: "placed", timestamp: new Date(Date.now() - 3600000 * 2) },
        { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 1.5) },
        { status: "ready", timestamp: new Date(Date.now() - 3600000 * 0.5) },
      ],
      createdAt: new Date(Date.now() - 3600000 * 2),
      updatedAt: new Date(Date.now() - 3600000 * 0.5),
    },
  ]);

  // -------------------------------------------------------------------------
  // Demo stock alert
  // -------------------------------------------------------------------------
  const azithromycin = medicines.find((med) => med.id === "med-004");
  await StockAlert.create({
    customerUserId: customer._id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    medicineId: azithromycin.id,
    medicineName: azithromycin.genericName,
    drugCode: azithromycin.drugCode,
    kendraCode: "PMBJK01002",
    kendraName: "Jan Aushadhi Kendra - Connaught Place",
    status: "pending",
  });

  // -------------------------------------------------------------------------
  // Order sequence
  // -------------------------------------------------------------------------
  await Counter.create({ key: "order", seq: 9402 });

  console.log("[seed] done.");
  console.log("");
  console.log("  Demo customer : ramesh.sharma@gmail.com / Customer@123");
  console.log("  Demo owner    : parel.kendra@pmbjp.in / Owner@123");
  console.log("  Pending owner : anita.kendra@pmbjp.in / Owner@123");
  console.log("  Second owner  : debashis.pharma@gmail.com / Owner@123");
  console.log("  Admin URL     : http://localhost:3000/admin-login");
  console.log(
    `  Admin login   : ${process.env.ADMIN_EMAIL || "admin@rxcompare.gov.in"} / ${
      process.env.ADMIN_PASSWORD || "Admin@12345"
    }`
  );
  console.log("");

  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
