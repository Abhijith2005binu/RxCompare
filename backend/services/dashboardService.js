/**
 * RxCompare Multi-Role Dashboard Service (MongoDB backed)
 *
 * Admin:
 *   - Global KPIs, Kendra approvals, network order audit
 * Kendra Owner:
 *   - Inventory / stock management, order fulfilment
 * Customer:
 *   - Online ordering, order history, out-of-stock alerts
 */

const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Kendra = require("../models/Kendra");
const Inventory = require("../models/Inventory");
const KendraApplication = require("../models/KendraApplication");
const Order = require("../models/Order");
const StockAlert = require("../models/StockAlert");
const Counter = require("../models/Counter");
const uhiGatewayService = require("./uhiGatewayService");
const { sendKendraDecisionEmail } = require("./emailService");

const ORDER_STATUSES = ["placed", "confirmed", "ready", "completed", "cancelled"];

function asPlain(doc) {
  if (!doc) return null;
  if (typeof doc.toJSON === "function") return doc.toJSON();
  return { ...doc, id: doc._id ? String(doc._id) : doc.id };
}

function mapApplication(doc) {
  const app = asPlain(doc);
  return { ...app, id: String(app._id || app.id) };
}

function mapOrder(doc) {
  const order = asPlain(doc);
  return { ...order, id: order.orderNumber || order.id };
}

class DashboardService {
  // =========================================================================
  // Admin operations
  // =========================================================================

  async getAdminStats() {
    const [
      totalKendras,
      pendingApplications,
      orders,
      totalMedicines,
      activeStockAlerts,
      totalCustomers,
      totalOwners,
      pendingOwners,
      approvedOwners,
    ] = await Promise.all([
      Kendra.countDocuments({ status: "active" }),
      KendraApplication.countDocuments({ status: "pending" }),
      Order.find({}).lean(),
      Medicine.countDocuments(),
      StockAlert.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "kendra_owner" }),
      User.countDocuments({ role: "kendra_owner", status: "pending" }),
      User.countDocuments({ role: "kendra_owner", status: "approved" }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const completedOrders = orders.filter((order) => order.status === "completed").length;

    const medicines = await Medicine.find(
      {},
      { id: 1, genericMrp: 1, brandedEquivalents: 1 }
    ).lean();
    const medicineById = new Map(medicines.map((med) => [med.id, med]));

    const estimatedSavings = orders.reduce((sum, order) => {
      const orderSavings = (order.items || []).reduce((itemSum, item) => {
        const med = medicineById.get(item.medicineId);
        const cheapestBranded =
          med && med.brandedEquivalents && med.brandedEquivalents.length > 0
            ? Math.min(...med.brandedEquivalents.map((brand) => brand.mrp))
            : null;
        if (cheapestBranded) {
          return itemSum + Math.max(0, cheapestBranded - item.genericMrp) * item.quantity;
        }
        return itemSum + item.genericMrp * item.quantity * 2;
      }, 0);
      return sum + orderSavings;
    }, 0);

    return {
      totalKendras,
      pendingApplications,
      totalOrders: orders.length,
      completedOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      estimatedSavings: Number(estimatedSavings.toFixed(2)),
      totalMedicines,
      activeStockAlerts,
      totalCustomers,
      totalOwners,
      pendingOwners,
      approvedOwners,
    };
  }

  async listUsers(role = "all") {
    const query = ["customer", "kendra_owner"].includes(role) ? { role } : {};
    const users = await User.find(query).sort({ role: 1, createdAt: -1 }).lean();
    return users.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || "",
      address: user.address || "",
      emailVerified: Boolean(user.emailVerified),
      kendraCode: user.kendraCode || null,
      kendraName: user.kendraName || null,
      rejectionReason: user.rejectionReason || "",
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || null,
    }));
  }

  /**
   * Permanently removes an account. For Kendra owners this also removes the
   * approved/pending shop, its inventory and its application records so the
   * Kendra disappears from the customer-facing network immediately.
   */
  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const kendraCodes = new Set();
    if (user.kendraCode) kendraCodes.add(user.kendraCode);

    const applications = await KendraApplication.find({
      $or: [{ ownerUserId: user._id }, { email: user.email }],
    }).lean();
    applications.forEach((application) => kendraCodes.add(application.kendraCode));

    const ownedKendras = await Kendra.find({
      $or: [{ ownerUserId: user._id }, { kendraCode: { $in: [...kendraCodes] } }],
    })
      .select("kendraCode")
      .lean();
    ownedKendras.forEach((kendra) => kendraCodes.add(kendra.kendraCode));

    const codes = [...kendraCodes];

    await Promise.all([
      KendraApplication.deleteMany({
        $or: [{ ownerUserId: user._id }, { email: user.email }],
      }),
      Kendra.deleteMany({
        $or: [{ ownerUserId: user._id }, { kendraCode: { $in: codes } }],
      }),
      codes.length > 0 ? Inventory.deleteMany({ kendraCode: { $in: codes } }) : null,
      codes.length > 0 ? StockAlert.deleteMany({ kendraCode: { $in: codes } }) : null,
      StockAlert.deleteMany({ customerUserId: user._id }),
    ]);

    await User.deleteOne({ _id: user._id });

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      removedKendraCodes: codes,
    };
  }

  async listKendraApplications(statusFilter) {
    const query = {};
    if (statusFilter && statusFilter !== "all" && statusFilter !== "awaiting_verification") {
      query.status = statusFilter;
    } else if (!statusFilter || statusFilter === "all") {
      // Hide unverified applications from the admin queue by default.
      query.status = { $ne: "awaiting_verification" };
    }

    const applications = await KendraApplication.find(query)
      .sort({ submittedAt: -1, createdAt: -1 })
      .lean();

    return applications.map(mapApplication);
  }

  async approveKendraApplication(appId) {
    const application = await KendraApplication.findById(appId);
    if (!application) throw new Error("Application not found");
    if (application.status === "approved") throw new Error("Application is already approved");
    if (application.status === "rejected") {
      throw new Error("This application was already rejected");
    }
    if (application.status === "awaiting_verification") {
      throw new Error("The owner has not verified their email address yet");
    }

    const kendraPayload = {
      kendraCode: application.kendraCode,
      name: application.name,
      ownerUserId: application.ownerUserId,
      ownerName: application.ownerName,
      address: application.address,
      city: application.city,
      district: application.district,
      state: application.state,
      pincode: application.pincode,
      phone: application.phone,
      email: application.email,
      licenseNumber: application.licenseNumber,
      operatingHours: application.operatingHours,
      location: application.location,
      status: "active",
    };

    const store = await Kendra.findOneAndUpdate(
      { kendraCode: application.kendraCode },
      { $set: kendraPayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Commit the decision first. Optional work (inventory seed / email) must
    // never leave the admin button stuck if it fails.
    application.status = "approved";
    application.reviewedAt = new Date();
    application.rejectionReason = "";
    await application.save();

    try {
      if (application.ownerUserId) {
        await updateOwnerById(application, "approved", store);
      } else {
        await updateOwnerByEmail(application, "approved", store);
      }
    } catch (err) {
      console.warn("[approval] owner account update failed:", err.message);
    }

    try {
      await this.seedKendraInventory(application.kendraCode);
    } catch (err) {
      console.warn("[approval] inventory seed failed:", err.message);
    }

    queueDecisionEmail({
      to: application.email,
      name: application.ownerName,
      kendraName: application.name,
      approved: true,
    });

    return { application: mapApplication(application), store: asPlain(store) };
  }

  async rejectKendraApplication(appId, reason = "Incomplete license documentation") {
    const application = await KendraApplication.findById(appId);
    if (!application) throw new Error("Application not found");
    if (application.status === "approved") {
      throw new Error("An approved Kendra cannot be rejected. Delete the owner account instead.");
    }

    const rejectionReason = String(reason || "").trim() || "Incomplete license documentation";
    application.status = "rejected";
    application.rejectionReason = rejectionReason;
    application.reviewedAt = new Date();
    await application.save();

    try {
      if (application.ownerUserId) {
        await updateOwnerById(application, "rejected", null, rejectionReason);
      } else {
        await updateOwnerByEmail(application, "rejected", null, rejectionReason);
      }
    } catch (err) {
      console.warn("[rejection] owner account update failed:", err.message);
    }

    queueDecisionEmail({
      to: application.email,
      name: application.ownerName,
      kendraName: application.name,
      approved: false,
      reason: rejectionReason,
    });

    return mapApplication(application);
  }

  /**
   * Creates an inventory row for every catalog medicine for a newly approved
   * Kendra. Uses the stable public medicine id and tolerates legacy catalog
   * documents that were created without an `id` field.
   */
  async seedKendraInventory(kendraCode) {
    const medicines = await Medicine.find({}).lean();
    if (medicines.length === 0) return 0;

    const operations = medicines
      .map((med) => {
        const medicineId = publicMedicineId(med);
        if (!medicineId) return null;
        return {
          updateOne: {
            filter: { kendraCode, medicineId },
            update: {
              $setOnInsert: {
                kendraCode,
                medicineId,
                inStock: true,
                units: 50,
                price: Number.isFinite(Number(med.genericMrp)) ? Number(med.genericMrp) : null,
                batchNumber: `BAT-${medicineId.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}-2026`,
                expiryDate: "12/2027",
              },
            },
            upsert: true,
          },
        };
      })
      .filter(Boolean);

    if (operations.length === 0) return 0;
    await Inventory.bulkWrite(operations, { ordered: false });
    return operations.length;
  }

  async getAllOrders() {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return orders.map(mapOrder);
  }

  // =========================================================================
  // Kendra owner operations
  // =========================================================================

  async getKendraInventory(kendraCode) {
    const store = await Kendra.findOne({ kendraCode }).lean();
    if (!store) return { store: null, items: [], categories: [] };

    const [medicines, stockRows, categories] = await Promise.all([
      Medicine.find({}).sort({ genericName: 1 }).lean(),
      Inventory.find({ kendraCode }).lean(),
      Medicine.distinct("category"),
    ]);
    const stockByMedicine = new Map(stockRows.map((row) => [row.medicineId, row]));

    const items = medicines.map((med) => {
      const medicineId = publicMedicineId(med);
      const stock = stockByMedicine.get(medicineId) || {};
      const basePrice = Number(med.genericMrp) || 0;
      const price =
        Number.isFinite(Number(stock.price)) && Number(stock.price) > 0
          ? Number(stock.price)
          : basePrice;
      const units = Number(stock.units) || 0;
      const inStock = Boolean(stock.inStock && units > 0);
      return {
        medicineId,
        drugCode: med.drugCode,
        genericName: med.genericName,
        composition: med.composition,
        category: med.category || "General",
        packSize: med.packSize,
        basePrice,
        price,
        genericMrp: price,
        prescriptionRequired: Boolean(med.prescriptionRequired),
        inStock,
        stockStatus: !inStock ? "Out of Stock" : units <= 20 ? "Low Stock" : "In Stock",
        isLowStock: inStock && units <= 20,
        units,
        batchNumber: stock.batchNumber || `BAT-${String(med.drugCode || "").slice(-3)}-2026`,
        expiryDate: stock.expiryDate || "12/2027",
      };
    });

    return {
      store: asPlain(store),
      items,
      categories: categories.filter(Boolean).sort((a, b) => a.localeCompare(b)),
    };
  }

  async updateKendraStock(
    kendraCode,
    medicineId,
    { units, inStock, batchNumber, expiryDate, price, genericMrp }
  ) {
    const store = await Kendra.findOne({ kendraCode }).lean();
    if (!store) throw new Error("Kendra store not found");

    const medicine = await uhiGatewayService.getMedicineById(medicineId);
    if (!medicine) throw new Error("Medicine not found");

    const existing = await Inventory.findOne({ kendraCode, medicineId });
    const wasOutOfStock =
      !existing || !existing.inStock || !existing.units || existing.units === 0;

    const numUnits = parseInt(units, 10);
    const nextUnits = Number.isNaN(numUnits) ? Number(existing?.units) || 0 : Math.max(0, numUnits);
    const nextInStock = inStock !== undefined ? Boolean(inStock) : nextUnits > 0;

    const requestedPrice = price !== undefined && price !== null && price !== "" ? price : genericMrp;
    let nextPrice = existing?.price;
    if (requestedPrice !== undefined && requestedPrice !== null && requestedPrice !== "") {
      const parsedPrice = Number(requestedPrice);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        throw new Error("A selling price greater than zero is required");
      }
      nextPrice = Number(parsedPrice.toFixed(2));
    }

    const setFields = {
      inStock: nextInStock && nextUnits > 0,
      units: nextUnits,
      batchNumber: batchNumber || existing?.batchNumber || "BAT-2026",
      expiryDate: expiryDate || existing?.expiryDate || "12/2027",
      lastUpdated: new Date(),
    };
    if (nextPrice !== undefined && nextPrice !== null) {
      setFields.price = Number(Number(nextPrice).toFixed(2));
    }

    const stock = await Inventory.findOneAndUpdate(
      { kendraCode, medicineId },
      { $set: setFields },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const isNowInStock = stock.inStock && stock.units > 0;
    let triggeredAlerts = 0;
    if (wasOutOfStock && isNowInStock) {
      triggeredAlerts = await this.notifyWaitingCustomers(
        kendraCode,
        medicineId,
        store.name,
        stock.units
      );
    }

    return {
      kendraCode,
      medicineId,
      price:
        Number.isFinite(Number(stock.price)) && Number(stock.price) > 0
          ? Number(stock.price)
          : Number(medicine.genericMrp),
      stock: stock.toJSON(),
      triggeredAlerts,
    };
  }

  async addMedicineToKendra(kendraCode, medicineData) {
    const store = await Kendra.findOne({ kendraCode }).lean();
    if (!store) throw new Error("Kendra store not found");

    const {
      genericName,
      composition,
      category,
      packSize,
      genericMrp,
      units = 50,
      price,
      brandedEquivalents = [],
    } = medicineData;

    const cleanName = String(genericName || "").trim();
    if (!cleanName) throw new Error("Generic medicine name is required");

    const mrp = parseFloat(genericMrp);
    if (!Number.isFinite(mrp) || mrp <= 0) {
      throw new Error("A valid subsidized MRP is required");
    }

    const pack = packSize ? String(packSize).trim() : "10 Tablets";
    const cleanCategory = category ? String(category).trim() : "General";

    // Re-use an existing catalog row when the owner adds the same formulation
    // and pack size again; it should only become a stock update, not a
    // duplicate medicine entry.
    let medicineDoc = await Medicine.findOne({
      genericName: new RegExp(`^${escapeRegex(cleanName)}$`, "i"),
      packSize: new RegExp(`^${escapeRegex(pack)}$`, "i"),
    });
    const isNewMedicine = !medicineDoc;

    if (!medicineDoc) {
      const id = `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const drugCode = `PMBJP-${String(Date.now()).slice(-6)}-${Math.floor(
        100 + Math.random() * 900
      )}`;

      const cleanEquivalents = Array.isArray(brandedEquivalents)
        ? brandedEquivalents
            .filter((brand) => brand && String(brand.brandName || "").trim())
            .map((brand) => ({
              brandName: String(brand.brandName).trim(),
              manufacturer: brand.manufacturer ? String(brand.manufacturer).trim() : "",
              mrp: Number(brand.mrp) || 0,
            }))
            .filter((brand) => brand.mrp > 0)
        : [];

      medicineDoc = await Medicine.create({
        id,
        drugCode,
        genericName: cleanName,
        composition: composition ? String(composition).trim() : cleanName,
        category: cleanCategory || "General",
        packSize: pack,
        genericMrp: mrp,
        prescriptionRequired: false,
        purchaseInfo: {
          unitPrice: Number((mrp / 10).toFixed(2)),
          packMrp: mrp,
          packSize: pack,
          currency: "INR",
          subsidyScheme: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
          prescriptionRequired: false,
          purchaseAvailability: "Available at PMBJP Kendras",
        },
        brandedEquivalents: cleanEquivalents,
        searchKeywords: [
          cleanName.toLowerCase(),
          cleanCategory.toLowerCase(),
          drugCode.toLowerCase(),
        ],
      });
    }

    const medicineId = publicMedicineId(medicineDoc);
    if (!medicineId) throw new Error("Could not determine a medicine identifier");

    // Legacy catalog documents may not have a public `id`; persist one so
    // inventory and customer lookups stay stable.
    if (!medicineDoc.id) {
      medicineDoc.id = medicineId;
      await medicineDoc.save();
    }

    const parsedPrice = price !== undefined && price !== null && price !== "" ? Number(price) : mrp;
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      throw new Error("A valid selling price greater than zero is required");
    }

    const nextUnits = Math.max(0, parseInt(units, 10) || 0);
    const previousStock = await Inventory.findOne({ kendraCode, medicineId }).lean();
    const wasOutOfStock =
      !previousStock ||
      !previousStock.inStock ||
      !previousStock.units ||
      previousStock.units === 0;

    const stock = await Inventory.findOneAndUpdate(
      { kendraCode, medicineId },
      {
        $set: {
          inStock: nextUnits > 0,
          units: nextUnits,
          price: Number(parsedPrice.toFixed(2)),
          batchNumber: `BAT-${String(medicineDoc.drugCode || medicineId).slice(-6)}`,
          expiryDate: "12/2027",
          lastUpdated: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let triggeredAlerts = 0;
    if (wasOutOfStock && stock.inStock && stock.units > 0) {
      triggeredAlerts = await this.notifyWaitingCustomers(
        kendraCode,
        medicineId,
        store.name,
        stock.units
      );
    }

    return {
      medicine: uhiGatewayService.enrichMedicine(medicineDoc.toJSON()),
      stock: stock.toJSON(),
      isNewMedicine,
      triggeredAlerts,
    };
  }

  async getKendraOrders(kendraCode) {
    const orders = await Order.find({ kendraCode }).sort({ createdAt: -1 });
    return orders.map(mapOrder);
  }

  // =========================================================================
  // Customer operations
  // =========================================================================

  /**
   * Prices a cart at one Kendra, or compares every active Kendra and returns
   * the cheapest one that can actually fulfil the basket. The customer UI uses
   * this to show the "best price" option and to switch fulfilling Kendra.
   */
  async quoteOrder({ kendraCode, items = [] } = {}) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    const requestedById = new Map();
    for (const item of items) {
      const med = await uhiGatewayService.getMedicineById(item.medicineId);
      if (!med) throw new Error(`Medicine ${item.medicineId} not found in catalog`);
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const existing = requestedById.get(med.id);
      if (existing) existing.quantity += quantity;
      else requestedById.set(med.id, { med, quantity });
    }
    const requested = [...requestedById.values()];

    // Always compare every active Kendra so the customer can be told about a
    // cheaper option even when one Kendra is already selected.
    const stores = await Kendra.find({ status: "active" }).lean();
    if (stores.length === 0) {
      throw new Error("No active Jan Aushadhi Kendra is available to fulfil this order");
    }

    const requestedCode = kendraCode ? String(kendraCode).trim() : "";
    if (requestedCode && !stores.some((store) => store.kendraCode === requestedCode)) {
      throw new Error("Selected Jan Aushadhi Kendra not found or inactive");
    }

    const medicineIds = [...new Set(requested.map(({ med }) => med.id))];
    const stockRows = await Inventory.find({
      kendraCode: { $in: stores.map((store) => store.kendraCode) },
      medicineId: { $in: medicineIds },
    }).lean();
    const stockMap = new Map(
      stockRows.map((row) => [`${row.kendraCode}::${row.medicineId}`, row])
    );

    const buildQuote = (store) => {
      let totalAmount = 0;
      let canFulfill = true;

      const quoteItems = requested.map(({ med, quantity }) => {
        const stock = stockMap.get(`${store.kendraCode}::${med.id}`);
        const availableUnits = stock && stock.inStock ? Number(stock.units) || 0 : 0;
        const available = Boolean(stock && stock.inStock && availableUnits >= quantity);
        if (!available) canFulfill = false;

        const unitPrice = resolveInventoryPrice(stock, med);
        const lineTotal = Number((unitPrice * quantity).toFixed(2));
        totalAmount += lineTotal;

        return {
          medicineId: med.id,
          genericName: med.genericName,
          packSize: med.packSize,
          quantity,
          unitPrice,
          totalPrice: lineTotal,
          available,
          availableUnits,
        };
      });

      return {
        kendraCode: store.kendraCode,
        kendraName: store.name,
        city: store.city,
        canFulfill,
        totalAmount: Number(totalAmount.toFixed(2)),
        items: quoteItems,
      };
    };

    const quotes = stores.map(buildQuote);
    const fulfillingQuotes = quotes.filter((quote) => quote.canFulfill);
    const candidates = fulfillingQuotes.length > 0 ? fulfillingQuotes : quotes;
    const best = candidates.reduce((lowest, quote) =>
      quote.totalAmount < lowest.totalAmount ? quote : lowest
    );
    const selected = requestedCode
      ? quotes.find((quote) => quote.kendraCode === requestedCode) || best
      : best;

    return {
      selected,
      best,
      options: quotes
        .map((quote) => ({
          kendraCode: quote.kendraCode,
          kendraName: quote.kendraName,
          city: quote.city,
          canFulfill: quote.canFulfill,
          totalAmount: quote.totalAmount,
        }))
        .sort((a, b) => a.totalAmount - b.totalAmount),
    };
  }

  async createOrder(orderData) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerUserId,
      deliveryAddress,
      deliveryType = "delivery",
      kendraCode,
      kendraId,
      items = [],
      paymentMethod = "Cash / UPI on Delivery",
      notes = "",
    } = orderData;

    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one medicine item");
    }

    const resolvedKendraCode = kendraCode || kendraId;
    const store = await Kendra.findOne({ kendraCode: resolvedKendraCode, status: "active" }).lean();
    if (!store) throw new Error("Selected Jan Aushadhi Kendra not found or inactive");

    // Merge duplicate lines so stock is validated against the total quantity.
    const mergedItems = new Map();
    for (const item of items) {
      const medicineId = String(item.medicineId || "").trim();
      if (!medicineId) throw new Error("Every order item needs a medicine id");
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const existing = mergedItems.get(medicineId);
      if (existing) existing.quantity += quantity;
      else mergedItems.set(medicineId, { medicineId, quantity });
    }

    // Validate the whole basket before decrementing any stock. This keeps the
    // MongoDB inventory authoritative and gives customers a clear out-of-stock
    // message instead of silently refilling the shelf.
    const validatedItems = [];
    for (const item of mergedItems.values()) {
      const med = await uhiGatewayService.getMedicineById(item.medicineId);
      if (!med) throw new Error(`Medicine ${item.medicineId} not found in catalog`);

      const stock = await Inventory.findOne({
        kendraCode: resolvedKendraCode,
        medicineId: med.id,
      });

      const availableUnits = stock && stock.inStock ? Number(stock.units) || 0 : 0;
      if (!stock || !stock.inStock || availableUnits < item.quantity) {
        throw new Error(
          `${med.genericName} is out of stock at ${store.name}. Only ${availableUnits} unit(s) available.`
        );
      }

      validatedItems.push({
        med,
        quantity: item.quantity,
        stock,
        unitPrice: resolveInventoryPrice(stock, med),
      });
    }

    const processedItems = [];
    for (const { med, quantity, stock, unitPrice } of validatedItems) {
      stock.units -= quantity;
      if (stock.units <= 0) {
        stock.units = 0;
        stock.inStock = false;
      }
      stock.lastUpdated = new Date();
      await stock.save();

      processedItems.push({
        medicineId: med.id,
        drugCode: med.drugCode,
        genericName: med.genericName,
        packSize: med.packSize,
        genericMrp: unitPrice,
        quantity,
        totalPrice: Number((unitPrice * quantity).toFixed(2)),
      });
    }

    const totalAmount = Number(
      processedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
    );

    const counter = await Counter.findOneAndUpdate(
      { key: "order" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (counter.seq < 9403) {
      counter.seq = 9403;
      await counter.save();
    }
    const orderNumber = `ORD-${counter.seq}`;

    const newOrder = await Order.create({
      orderNumber,
      customerUserId: customerUserId || null,
      customerName: String(customerName || "Customer").trim(),
      customerEmail: String(customerEmail || "").trim().toLowerCase(),
      customerPhone: customerPhone ? String(customerPhone).trim() : "",
      deliveryAddress: deliveryAddress ? String(deliveryAddress).trim() : "Counter Pickup",
      deliveryType: deliveryType === "pickup" ? "pickup" : "delivery",
      kendraCode: store.kendraCode,
      kendraName: store.name,
      kendraPhone: store.phone,
      kendraAddress: store.address,
      items: processedItems,
      totalAmount,
      status: "placed",
      paymentMethod,
      paymentStatus:
        orderData.paymentStatus ||
        (paymentMethod.includes("Delivery") ? "pending_on_delivery" : "simulated_paid"),
      transactionId:
        orderData.transactionId ||
        (paymentMethod.includes("Delivery") ? null : `TXN-PMBJP-${Date.now().toString().slice(-6)}`),
      paymentSimulationMethod: orderData.paymentSimulationMethod || "UPI",
      notes: notes ? String(notes).trim() : "",
      statusHistory: [{ status: "placed", timestamp: new Date() }],
    });

    return mapOrder(newOrder);
  }

  async getCustomerOrders(customerEmail) {
    const email = String(customerEmail || "").trim().toLowerCase();
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    return orders.map(mapOrder);
  }

  async updateOrderStatus(orderNumber, newStatus, options = {}) {
    if (!ORDER_STATUSES.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) throw new Error("Order not found");
    if (options.enforceKendraCode && order.kendraCode !== options.enforceKendraCode) {
      const err = new Error("You can only update orders belonging to your own Kendra.");
      err.status = 403;
      throw err;
    }

    order.status = newStatus;
    order.statusHistory.push({ status: newStatus, timestamp: new Date() });

    if (newStatus === "cancelled") {
      for (const item of order.items) {
        await Inventory.findOneAndUpdate(
          { kendraCode: order.kendraCode, medicineId: item.medicineId },
          { $inc: { units: item.quantity }, $set: { inStock: true, lastUpdated: new Date() } }
        );
      }
    }

    await order.save();
    return mapOrder(order);
  }

  // =========================================================================
  // Out-of-stock alerts
  // =========================================================================

  async createStockAlert({
    customerName,
    customerEmail,
    customerPhone,
    customerUserId,
    medicineId,
    kendraCode,
    kendraId,
  }) {
    const med = await uhiGatewayService.getMedicineById(medicineId);
    if (!med) throw new Error("Medicine not found");

    const resolvedKendraCode = kendraCode || kendraId || null;
    let kendraName = "Any Nearby Kendra";
    if (resolvedKendraCode) {
      const store = await Kendra.findOne({ kendraCode: resolvedKendraCode }).lean();
      if (store) kendraName = store.name;
    }

    const alert = await StockAlert.create({
      customerUserId: customerUserId || null,
      customerName: String(customerName || "Customer").trim(),
      customerEmail: String(customerEmail || "").trim().toLowerCase(),
      customerPhone: customerPhone ? String(customerPhone).trim() : "",
      medicineId: med.id,
      medicineName: med.genericName,
      drugCode: med.drugCode,
      kendraCode: resolvedKendraCode,
      kendraName,
      status: "pending",
    });

    return alert.toJSON();
  }

  async getCustomerStockAlerts(customerEmail) {
    const email = String(customerEmail || "").trim().toLowerCase();
    const alerts = await StockAlert.find({ customerEmail: email }).sort({ createdAt: -1 });
    return alerts.map((alert) => alert.toJSON());
  }

  async notifyWaitingCustomers(kendraCode, medicineId, kendraName, unitsAvailable) {
    const now = new Date();
    const message = `Good news! The medicine is now back in stock at ${kendraName} (${unitsAvailable} units available). You can place your order online now.`;

    const result = await StockAlert.updateMany(
      {
        medicineId,
        status: "pending",
        $or: [{ kendraCode: null }, { kendraCode }],
      },
      {
        $set: {
          status: "notified",
          notifiedAt: now,
          notificationMessage: message,
        },
      }
    );

    return result.modifiedCount || 0;
  }
}

// ---------------------------------------------------------------------------
// Small local helpers (kept outside the class for readability)
// ---------------------------------------------------------------------------
async function updateOwnerById(application, status, store, rejectionReason = "") {
  const update = {
    status,
    ...(store ? { kendraCode: store.kendraCode, kendraName: store.name } : {}),
  };
  if (rejectionReason) update.rejectionReason = rejectionReason;
  await User.updateOne({ _id: application.ownerUserId }, { $set: update });
}

async function updateOwnerByEmail(application, status, store, rejectionReason = "") {
  const update = {
    status,
    ...(store ? { kendraCode: store.kendraCode, kendraName: store.name } : {}),
  };
  if (rejectionReason) update.rejectionReason = rejectionReason;
  await User.updateOne({ email: application.email }, { $set: update });
}

function publicMedicineId(medicine) {
  if (!medicine) return null;
  return medicine.id || (medicine._id ? String(medicine._id) : null);
}

function resolveInventoryPrice(stock, medicine) {
  const stockPrice = Number(stock && stock.price);
  if (Number.isFinite(stockPrice) && stockPrice > 0) {
    return Number(stockPrice.toFixed(2));
  }
  const catalogPrice = Number(medicine && medicine.genericMrp);
  return Number.isFinite(catalogPrice) ? Number(catalogPrice.toFixed(2)) : 0;
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Email is a best-effort side effect of an admin decision. It is dispatched on
 * the next tick so a slow SMTP/Ethereal connection can never delay or block the
 * approval/rejection HTTP response.
 */
function queueDecisionEmail(payload) {
  setImmediate(() => {
    sendKendraDecisionEmail(payload).catch((err) =>
      console.warn("[email] Kendra decision notice failed:", err.message)
    );
  });
}

module.exports = new DashboardService();
