import "./style.css";
import {
  searchMedicines,
  getAllMedicines,
  getKendrasForMedicine,
  getUhiStatus,
  getDemoUsers,
  loginUser,
  getAdminStats,
  getAdminApplications,
  approveApplication,
  rejectApplication,
  getAdminOrders,
  registerKendra,
  getKendraInventory,
  updateKendraStock,
  addMedicineToKendra,
  getKendraOrders,
  updateOrderStatus,
  placeOrder,
  getMyOrders,
  subscribeStockAlert,
  getMyStockAlerts,
} from "./api.js";

// ---------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------
let currentUser = {
  id: "usr-customer-1",
  name: "Ramesh Sharma",
  email: "ramesh.sharma@gmail.com",
  role: "customer",
  phone: "+91 98765 43210",
  address: "B-402, Green Glen Residences, Bellandur, Bengaluru, Karnataka - 560103",
  status: "active",
};

let availablePersonaUsers = [];
let cart = []; // [{ medicineId, genericName, genericMrp, packSize, quantity, cheapestBrandedMrp }]
let activeView = "search";
let lastSearchResults = [];
let allMedicinesCache = [];
let activeCategory = "all";
let currentDrawerMedicine = null;
let currentKendraInventory = [];
let userCoords = null;
let checkoutOrderData = null;

// ---------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------
const icon = {
  mapPin: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`,
  navArrow: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  cross: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function showToast(message, iconSymbol = "✓") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-icon">${iconSymbol}</span><span>${esc(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 200ms ease";
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// ---------------------------------------------------------------------
// DOM Elements
// ---------------------------------------------------------------------
const userDisplayRole = document.getElementById("user-role-tag");
const userDisplayName = document.getElementById("user-display-name");
const btnOpenPersona = document.getElementById("btn-open-persona");
const btnOpenCart = document.getElementById("btn-open-cart");
const cartCountBadge = document.getElementById("cart-count-badge");
const tabSearchText = document.getElementById("tab-search-text");

// Theme Toggle (Light / Dark mode)
const btnThemeToggle = document.getElementById("btn-theme-toggle");
const themeIconMoon = document.querySelector(".theme-icon--moon");
const themeIconSun = document.querySelector(".theme-icon--sun");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("rxcompare_theme", theme);
  if (themeIconMoon && themeIconSun) {
    if (theme === "dark") {
      themeIconMoon.style.display = "none";
      themeIconSun.style.display = "block";
    } else {
      themeIconMoon.style.display = "block";
      themeIconSun.style.display = "none";
    }
  }
}

const savedTheme = localStorage.getItem("rxcompare_theme") ||
  (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

if (btnThemeToggle) {
  btnThemeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme === "dark" ? "Dark" : "Light"} theme`, nextTheme === "dark" ? "🌙" : "☀️");
  });
}

const navTabs = document.querySelectorAll(".nav__tab");
const viewPanels = document.querySelectorAll(".view-panel");

// Modals & Drawers
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerBackdrop = document.getElementById("cart-drawer-backdrop");
const cartDrawerClose = document.getElementById("cart-drawer-close");
const cartItemsBody = document.getElementById("cart-items-body");
const cartFooter = document.getElementById("cart-footer");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartSavingsText = document.getElementById("cart-savings-text");
const cartKendraSelect = document.getElementById("cart-kendra-select");
const btnProceedPayment = document.getElementById("btn-proceed-payment");

const paymentModalBackdrop = document.getElementById("payment-modal-backdrop");
const btnClosePaymentModal = document.getElementById("btn-close-payment-modal");
const btnCancelPayment = document.getElementById("btn-cancel-payment");
const btnRunPaymentSim = document.getElementById("btn-run-payment-sim");
const posCustomerName = document.getElementById("pos-customer-name");
const posKendraName = document.getElementById("pos-kendra-name");
const posTotalAmount = document.getElementById("pos-total-amount");
const payDeliveryAddress = document.getElementById("pay-delivery-address");
const paymentSelectionStep = document.getElementById("payment-selection-step");
const paymentProgressStep = document.getElementById("payment-progress-step");
const paymentSuccessStep = document.getElementById("payment-success-step");
const payProgressStatus = document.getElementById("pay-progress-status");
const payProgressSub = document.getElementById("pay-progress-sub");
const receiptTxnId = document.getElementById("receipt-txn-id");
const receiptOrderId = document.getElementById("receipt-order-id");
const receiptAmount = document.getElementById("receipt-amount");
const receiptKendra = document.getElementById("receipt-kendra");
const btnViewOrderStatus = document.getElementById("btn-view-order-status");
const btnClosePaymentReceipt = document.getElementById("btn-close-payment-receipt");

const alertModalBackdrop = document.getElementById("alert-modal-backdrop");
const addProductModalBackdrop = document.getElementById("add-product-modal-backdrop");
const personaModalBackdrop = document.getElementById("persona-modal-backdrop");

// Store Drawer
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const drawerTitle = document.getElementById("drawer-title");
const drawerMedBanner = document.getElementById("drawer-med-banner");
const drawerBody = document.getElementById("drawer-body");
const drawerClose = document.getElementById("drawer-close");
const stockOnlyCheckbox = document.getElementById("stock-only-checkbox");
const cityFilterSelect = document.getElementById("city-filter-select");
const locateMeBtn = document.getElementById("locate-me-btn");

// View 1 (Search)
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsGrid = document.getElementById("results-grid");
const resultsError = document.getElementById("results-error");
const resultsEmpty = document.getElementById("results-empty");
const resultsHeader = document.getElementById("results-header");
const resultsLabel = document.getElementById("results-label");
const heroStats = document.getElementById("hero-stats");
const statMedicineCount = document.getElementById("stat-medicine-count");
const statAvgSavings = document.getElementById("stat-avg-savings");
const statStoreCount = document.getElementById("stat-store-count");

const searchCategorySelect = document.getElementById("search-category-select");
const searchCategory = document.querySelector(".search-bar__category");
const searchCategoryTrigger = document.getElementById("search-category-trigger");
const searchCategoryLabel = document.getElementById("search-category-label");
const searchCategoryOptions = document.getElementById("search-category-options");
const btnHeroCompare = document.getElementById("btn-hero-compare");
const btnHeroFind = document.getElementById("btn-hero-find");
const btnHeaderLocate = document.getElementById("btn-header-locate");
const categoriesRow = document.getElementById("categories-row");
const catPrevBtn = document.getElementById("cat-prev-btn");
const catNextBtn = document.getElementById("cat-next-btn");

// View 2 (Customer)
const customerOrdersList = document.getElementById("customer-orders-list");
const customerAlertsList = document.getElementById("customer-alerts-list");
const countCustomerOrders = document.getElementById("count-customer-orders");
const countCustomerAlerts = document.getElementById("count-customer-alerts");
const customerOrdersBadge = document.getElementById("customer-orders-count");
const btnRefreshCustomer = document.getElementById("btn-refresh-customer");

// View 3 (Kendra Owner)
const kendraDashTitle = document.getElementById("kendra-dash-title");
const kendraPendingBanner = document.getElementById("kendra-pending-banner");
const pendingKendraName = document.getElementById("pending-kendra-name");
const kendraRegisterSection = document.getElementById("kendra-register-section");
const kendraHubSection = document.getElementById("kendra-hub-section");
const kendraRegisterForm = document.getElementById("kendra-register-form");
const kpiKendraTotalItems = document.getElementById("kpi-kendra-total-items");
const kpiKendraInStock = document.getElementById("kpi-kendra-in-stock");
const kpiKendraOutStock = document.getElementById("kpi-kendra-out-stock");
const kpiKendraOrders = document.getElementById("kpi-kendra-orders");
const kendraInventoryTbody = document.getElementById("kendra-inventory-tbody");
const kendraInventorySearch = document.getElementById("kendra-inventory-search");
const kendraOrdersList = document.getElementById("kendra-orders-list");
const countKendraOrders = document.getElementById("count-kendra-orders");
const btnOpenAddMed = document.getElementById("btn-open-add-med");

// View 4 (Admin)
const kpiAdminKendras = document.getElementById("kpi-admin-kendras");
const kpiAdminPending = document.getElementById("kpi-admin-pending");
const kpiAdminOrders = document.getElementById("kpi-admin-orders");
const kpiAdminSavings = document.getElementById("kpi-admin-savings");
const adminApprovalsTbody = document.getElementById("admin-approvals-tbody");
const adminOrdersTbody = document.getElementById("admin-orders-tbody");
const countAdminPending = document.getElementById("count-admin-pending");
const countAdminOrders = document.getElementById("count-admin-orders");
const adminPendingCountBadge = document.getElementById("admin-pending-count");
const btnRefreshAdmin = document.getElementById("btn-refresh-admin");

// Stock Alert Modal Elements
const stockAlertForm = document.getElementById("stock-alert-form");
const alertMedicineId = document.getElementById("alert-medicine-id");
const alertKendraId = document.getElementById("alert-kendra-id");
const alertMedName = document.getElementById("alert-med-name");
const alertKendraName = document.getElementById("alert-kendra-name");
const alertCustomerName = document.getElementById("alert-customer-name");
const alertCustomerEmail = document.getElementById("alert-customer-email");
const alertCustomerPhone = document.getElementById("alert-customer-phone");

// Add Product Modal
const addProductForm = document.getElementById("add-product-form");

// ---------------------------------------------------------------------
// Role-Based Isolation & Persona Switching
// ---------------------------------------------------------------------
function updateRoleUI() {
  document.body.dataset.role = currentUser.role;
  userDisplayName.textContent = currentUser.name;

  if (currentUser.role === "admin") {
    userDisplayRole.textContent = "Admin";
    userDisplayRole.style.background = "#fae4df";
    userDisplayRole.style.color = "#a42c16";
    tabSearchText.textContent = "Medicine Catalog";
  } else if (currentUser.role === "kendra_owner") {
    userDisplayRole.textContent = "Kendra Owner";
    userDisplayRole.style.background = "#e6f6ee";
    userDisplayRole.style.color = "#167a52";
    tabSearchText.textContent = "Medicine Catalog";
  } else {
    userDisplayRole.textContent = "Customer";
    userDisplayRole.style.background = "#eaf1fb";
    userDisplayRole.style.color = "#1c529e";
    tabSearchText.textContent = "Find Medicines";
  }

  // Pre-fill fields
  alertCustomerName.value = currentUser.name;
  alertCustomerEmail.value = currentUser.email;
  alertCustomerPhone.value = currentUser.phone || "";
  payDeliveryAddress.value = currentUser.address || "";
}

const DEMO_PERSONAS = {
  customer: {
    id: "usr-customer-1",
    name: "Ramesh Sharma",
    email: "ramesh.sharma@gmail.com",
    role: "customer",
    phone: "+91 98765 43210",
    address: "B-402, Green Glen Residences, Bellandur, Bengaluru, Karnataka - 560103",
    status: "active",
  },
  kendra: {
    id: "usr-kendra-1",
    name: "Sunil Deshmukh",
    email: "parel.kendra@pmbjp.in",
    role: "kendra_owner",
    kendraId: "PMBJK02001",
    kendraName: "Jan Aushadhi Kendra - KEM Hospital Parel",
    phone: "+91 98201 44552",
    status: "approved",
  },
  pendingKendra: {
    id: "usr-kendra-2",
    name: "Anita Saxena",
    email: "anita.kendra@pmbjp.in",
    role: "kendra_owner",
    kendraId: "PMBJK-APP-99",
    kendraName: "Jan Aushadhi Kendra - Rohini Sector 7",
    phone: "+91 98112 33445",
    status: "pending",
  },
  admin: {
    id: "usr-admin-1",
    name: "Dr. Rajesh Varma",
    email: "admin@rxcompare.gov.in",
    role: "admin",
    designation: "Chief PMBJP Network Administrator",
    phone: "+91 11 2338 5642",
    status: "active",
  },
};

const LOCAL_DEMO_USERS = [
  DEMO_PERSONAS.admin,
  DEMO_PERSONAS.kendra,
  DEMO_PERSONAS.pendingKendra,
  DEMO_PERSONAS.customer,
];

function switchUser(user) {
  currentUser = user;
  localStorage.setItem("rxcompare_user", JSON.stringify(user));
  updateRoleUI();
  personaModalBackdrop.hidden = true;
  const pm = document.getElementById("persona-modal");
  if (pm) pm.hidden = true;

  if (currentUser.role === "admin") {
    switchView("admin");
  } else if (currentUser.role === "kendra_owner") {
    switchView("kendra");
  } else {
    switchView("search");
  }
}

function switchView(viewName) {
  // Ensure the appropriate role persona is active when switching view tabs
  if (viewName === "kendra" && currentUser.role !== "kendra_owner") {
    currentUser = DEMO_PERSONAS.kendra;
    localStorage.setItem("rxcompare_user", JSON.stringify(currentUser));
    updateRoleUI();
    showToast("Active Persona: Sunil Deshmukh (Kendra Owner)", "🏥");
  } else if (viewName === "admin" && currentUser.role !== "admin") {
    currentUser = DEMO_PERSONAS.admin;
    localStorage.setItem("rxcompare_user", JSON.stringify(currentUser));
    updateRoleUI();
    showToast("Active Persona: Dr. Rajesh Varma (Admin)", "🛡️");
  } else if (viewName === "customer" && currentUser.role !== "customer") {
    currentUser = DEMO_PERSONAS.customer;
    localStorage.setItem("rxcompare_user", JSON.stringify(currentUser));
    updateRoleUI();
    showToast("Active Persona: Ramesh Sharma (Customer)", "👤");
  }

  activeView = viewName;
  navTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === viewName);
  });
  viewPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `view-${viewName}`);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (viewName === "customer") loadCustomerDashboard();
  if (viewName === "kendra") loadKendraDashboard();
  if (viewName === "admin") loadAdminDashboard();
}

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view));
});

// Subtab toggling
document.querySelectorAll(".subtab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const parentContainer = btn.closest(".dash-container");
    const targetSubtab = btn.dataset.subtab;

    parentContainer.querySelectorAll(".subtab").forEach((b) => b.classList.remove("is-active"));
    parentContainer.querySelectorAll(".subtab-panel").forEach((p) => p.classList.remove("is-active"));

    btn.classList.add("is-active");
    const targetPanel = document.getElementById(`subtab-${targetSubtab}`);
    if (targetPanel) targetPanel.classList.add("is-active");
  });
});

// ---------------------------------------------------------------------
// Shopping Cart ("Add to Cart") Functionality
// ---------------------------------------------------------------------
function loadCartFromStorage() {
  const saved = localStorage.getItem("rxcompare_cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch {
      cart = [];
    }
  }
  updateCartBadge();
}

function saveCartToStorage() {
  localStorage.setItem("rxcompare_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;
}

function addToCart(medicine, quantity = 1) {
  const medId = medicine.id || medicine._id;
  const existing = cart.find((i) => i.medicineId === medId);
  const cheapestBranded = medicine.cheapestBrandedMrp || medicine.genericMrp * 2.5;

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      medicineId: medId,
      genericName: medicine.genericName,
      composition: medicine.composition,
      packSize: medicine.packSize || "10 Tablets",
      genericMrp: medicine.genericMrp,
      cheapestBrandedMrp: cheapestBranded,
      quantity,
    });
  }

  saveCartToStorage();
  const savings = Math.max(0, (cheapestBranded - medicine.genericMrp) * quantity);
  showToast(`Added ${medicine.genericName} to Cart (Saved ₹${savings.toFixed(2)})`, "🛒");
}

function updateCartItemQty(medicineId, delta) {
  const item = cart.find((i) => i.medicineId === medicineId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.medicineId !== medicineId);
  }
  saveCartToStorage();
  renderCartDrawer();
}

function removeFromCart(medicineId) {
  cart = cart.filter((i) => i.medicineId !== medicineId);
  saveCartToStorage();
  renderCartDrawer();
}

async function openCartDrawer() {
  cartDrawer.classList.add("is-open");
  cartDrawerBackdrop.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  renderCartDrawer();

  // Populate Kendra fulfillers dropdown
  try {
    const res = await getAllMedicines(); // triggers list
    cartKendraSelect.innerHTML = `
      <option value="PMBJK02001">Jan Aushadhi Kendra - KEM Hospital Parel (Mumbai)</option>
      <option value="PMBJK01001">Jan Aushadhi Kendra - AIIMS Ansari Nagar (New Delhi)</option>
      <option value="PMBJK03001">Jan Aushadhi Kendra - Victoria Hospital (Bengaluru)</option>
      <option value="PMBJK04001">Jan Aushadhi Kendra - NIMS Punjagutta (Hyderabad)</option>
      <option value="PMBJK05001">Jan Aushadhi Kendra - Rasta Peth (Pune)</option>
    `;
  } catch {
    cartKendraSelect.innerHTML = `<option value="PMBJK02001">Jan Aushadhi Kendra - Central Counter</option>`;
  }
}

function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  cartDrawerBackdrop.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

btnOpenCart.addEventListener("click", openCartDrawer);
cartDrawerClose.addEventListener("click", closeCartDrawer);
cartDrawerBackdrop.addEventListener("click", closeCartDrawer);

function renderCartDrawer() {
  if (cart.length === 0) {
    cartItemsBody.innerHTML = `
      <div style="text-align: center; padding: 40px 16px; color: var(--ink-soft);">
        <p style="font-size: 2.2rem; margin: 0 0 8px;">🛒</p>
        <p style="font-size: 1rem; font-weight: 600; color: var(--navy-deep); margin: 0;">Your Cart is Empty</p>
        <p class="text-subtle" style="margin: 6px 0 16px;">Search any medicine from your prescription to add generic equivalents at subsidized prices.</p>
        <button type="button" class="btn btn--outline" onclick="document.getElementById('cart-drawer-close').click()">
          Browse Formulations
        </button>
      </div>`;
    cartFooter.hidden = true;
    cartSavingsText.textContent = "Estimated savings vs branded: ₹0.00";
    return;
  }

  cartFooter.hidden = false;
  let total = 0;
  let totalSavings = 0;

  cartItemsBody.innerHTML = cart
    .map((item) => {
      const itemSubtotal = item.genericMrp * item.quantity;
      const itemSavings = (item.cheapestBrandedMrp - item.genericMrp) * item.quantity;
      total += itemSubtotal;
      totalSavings += Math.max(0, itemSavings);

      return `
      <div class="cart-item">
        <div class="cart-item__info">
          <div class="cart-item__title">${esc(item.genericName)}</div>
          <div class="cart-item__meta">${esc(item.packSize)} · ₹${item.genericMrp.toFixed(2)}/pack</div>
        </div>

        <div class="cart-item__right">
          <div class="cart-item__qty">
            <button type="button" class="btn-qty-sm" data-action="cart-minus" data-id="${esc(item.medicineId)}" aria-label="Decrease quantity">−</button>
            <span class="cart-item__qty-val">${item.quantity}</span>
            <button type="button" class="btn-qty-sm" data-action="cart-plus" data-id="${esc(item.medicineId)}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item__price">₹${itemSubtotal.toFixed(2)}</div>
          <button type="button" class="cart-item__remove" data-action="cart-remove" data-id="${esc(item.medicineId)}" title="Remove item" aria-label="Remove item">&times;</button>
        </div>
      </div>`;
    })
    .join("");

  cartTotalPrice.textContent = `₹${total.toFixed(2)}`;
  cartSavingsText.textContent = `Estimated savings vs branded: ₹${totalSavings.toFixed(2)}`;
}

cartItemsBody.addEventListener("click", (e) => {
  const plusBtn = e.target.closest('[data-action="cart-plus"]');
  const minusBtn = e.target.closest('[data-action="cart-minus"]');
  const removeBtn = e.target.closest('[data-action="cart-remove"]');

  if (plusBtn) updateCartItemQty(plusBtn.dataset.id, 1);
  if (minusBtn) updateCartItemQty(minusBtn.dataset.id, -1);
  if (removeBtn) removeFromCart(removeBtn.dataset.id);
});

// Proceed from Cart to Simulated Payment
btnProceedPayment.addEventListener("click", () => {
  if (cart.length === 0) return;
  const kendraId = cartKendraSelect.value || "PMBJK02001";
  const kendraName = cartKendraSelect.options[cartKendraSelect.selectedIndex]?.text || "Jan Aushadhi Kendra";

  const totalAmount = cart.reduce((sum, item) => sum + item.genericMrp * item.quantity, 0);

  closeCartDrawer();
  openPaymentSimulationModal({
    kendraId,
    kendraName,
    items: cart.map((i) => ({
      medicineId: i.medicineId,
      genericName: i.genericName,
      packSize: i.packSize,
      genericMrp: i.genericMrp,
      quantity: i.quantity,
    })),
    totalAmount,
  });
});

// ---------------------------------------------------------------------
// Interactive Payment Simulation Workflow
// ---------------------------------------------------------------------
function closePaymentModal() {
  paymentModalBackdrop.hidden = true;
  const pm = document.getElementById("payment-modal");
  if (pm) pm.hidden = true;
  btnRunPaymentSim.disabled = false;
  btnRunPaymentSim.textContent = "Authorize & Simulate Instant Payment";
}

function openPaymentSimulationModal(orderPayload) {
  checkoutOrderData = orderPayload;

  posCustomerName.textContent = currentUser.name;
  posKendraName.textContent = orderPayload.kendraName;
  posTotalAmount.textContent = `₹${orderPayload.totalAmount.toFixed(2)}`;
  payDeliveryAddress.value = currentUser.address || "B-402, Green Glen Residences, Bellandur, Bengaluru - 560103";

  // Reset payment channel selection to UPI by default
  document.querySelectorAll(".pay-method-card").forEach((c) => c.classList.remove("is-selected"));
  const defaultOption = document.querySelector('input[name="paymentSimulationOption"][value="UPI"]');
  if (defaultOption) {
    defaultOption.checked = true;
    defaultOption.closest(".pay-method-card")?.classList.add("is-selected");
  }

  btnRunPaymentSim.disabled = false;
  btnRunPaymentSim.textContent = "Authorize & Simulate Instant Payment";

  paymentSelectionStep.style.display = "block";
  paymentProgressStep.style.display = "none";
  paymentSuccessStep.style.display = "none";
  paymentModalBackdrop.hidden = false;
  const pm = document.getElementById("payment-modal");
  if (pm) pm.hidden = false;
}

// Payment method card selection highlight & radio binding
document.querySelectorAll(".pay-method-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".pay-method-card").forEach((c) => c.classList.remove("is-selected"));
    card.classList.add("is-selected");
    const radio = card.querySelector("input[type=radio]");
    if (radio) radio.checked = true;
  });
});

document.querySelectorAll('input[name="paymentSimulationOption"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelectorAll(".pay-method-card").forEach((c) => c.classList.remove("is-selected"));
    radio.closest(".pay-method-card")?.classList.add("is-selected");
  });
});

btnClosePaymentModal.addEventListener("click", closePaymentModal);
btnCancelPayment.addEventListener("click", closePaymentModal);
if (btnClosePaymentReceipt) {
  btnClosePaymentReceipt.addEventListener("click", closePaymentModal);
}
paymentModalBackdrop.addEventListener("click", closePaymentModal);

btnRunPaymentSim.addEventListener("click", async () => {
  if (!checkoutOrderData) return;

  const selectedMethod = document.querySelector('input[name="paymentSimulationOption"]:checked')?.value || "UPI";
  const address = payDeliveryAddress.value.trim() || currentUser.address || "Counter Pickup";

  btnRunPaymentSim.disabled = true;
  btnRunPaymentSim.textContent = "Processing Simulation…";

  // Step 1 -> Transition to Live Animated Simulation
  paymentSelectionStep.style.display = "none";
  paymentProgressStep.style.display = "block";

  const pstep1 = document.getElementById("pstep-1");
  const pstep2 = document.getElementById("pstep-2");
  const pstep3 = document.getElementById("pstep-3");

  pstep1.classList.add("is-active");
  pstep2.classList.remove("is-active");
  pstep3.classList.remove("is-active");

  payProgressStatus.textContent = `Connecting to ${selectedMethod === "UPI" ? "UPI Sandbox (NPCI)" : selectedMethod === "Card" ? "RuPay Payment Gateway" : "Cash on Delivery Node"}…`;
  payProgressSub.textContent = "Initiating secure encrypted handshake…";

  // Simulate Gateway Handshake progression
  setTimeout(() => {
    pstep2.classList.add("is-active");
    payProgressStatus.textContent = "Verifying Jan Aushadhi generic subsidy entitlement…";
    payProgressSub.textContent = "Government PMBJP statutory ceiling verified. Zero transaction surcharge.";

    setTimeout(async () => {
      pstep3.classList.add("is-active");
      payProgressStatus.textContent = "Capturing payment & allocating store inventory…";

      try {
        const orderRes = await placeOrder({
          customerName: currentUser.name,
          customerEmail: currentUser.email,
          customerPhone: currentUser.phone || "+91 98765 43210",
          deliveryAddress: address,
          deliveryType: address.includes("Pickup") ? "pickup" : "delivery",
          kendraId: checkoutOrderData.kendraId,
          items: checkoutOrderData.items,
          paymentMethod: `Simulated ${selectedMethod} (Instant Paid)`,
          paymentStatus: selectedMethod === "Cash" ? "pending_on_delivery" : "simulated_paid",
          transactionId: `TXN-PMBJP-${Date.now().toString().slice(-6)}`,
          paymentSimulationMethod: selectedMethod,
        });

        // Clear cart on successful order
        cart = [];
        saveCartToStorage();

        // Step 3 -> Show Success Receipt
        paymentProgressStep.style.display = "none";
        paymentSuccessStep.style.display = "block";

        receiptTxnId.textContent = orderRes.order.transactionId || `TXN-PMBJP-${Date.now().toString().slice(-6)}`;
        receiptOrderId.textContent = `#${orderRes.order.id}`;
        receiptAmount.textContent = `₹${orderRes.order.totalAmount.toFixed(2)}`;
        receiptKendra.textContent = orderRes.order.kendraName;

        showToast(`Order #${orderRes.order.id} registered on PMBJP network!`, "✓");
      } catch (err) {
        showToast(`Order placement error: ${err.message}`, "⚠️");
        btnRunPaymentSim.disabled = false;
        btnRunPaymentSim.textContent = "Authorize & Simulate Instant Payment";
        paymentProgressStep.style.display = "none";
        paymentSelectionStep.style.display = "block";
      }
    }, 650);
  }, 650);
});

btnViewOrderStatus.addEventListener("click", () => {
  closePaymentModal();
  switchView("customer");
});

// ---------------------------------------------------------------------
// VIEW 1: Medicine Search & Card Rendering
// ---------------------------------------------------------------------
function medicineCardHTML(medicine, index) {
  const cheapestBranded = medicine.cheapestBrandedMrp;
  const savings = cheapestBranded ? cheapestBranded - medicine.genericMrp : null;
  const savingsPct = cheapestBranded ? Math.round((savings / cheapestBranded) * 100) : null;

  const saveBadge =
    savingsPct !== null
      ? `<span class="med-card__save-badge">save ${savingsPct}%</span>`
      : "";

  const rxPill = medicine.prescriptionRequired
    ? `<span class="badge badge--rx" title="Valid medical prescription required at counter">Rx Required</span>`
    : `<span class="badge badge--otc" title="Available over the counter">OTC Available</span>`;

  const unitPriceStr =
    medicine.purchaseInfo && medicine.purchaseInfo.unitPrice
      ? `(₹${medicine.purchaseInfo.unitPrice.toFixed(2)} / unit)`
      : "";

  const brandsList = (medicine.brandedEquivalents || [])
    .map(
      (b) => `
      <li class="med-card__brand-item">
        <span class="brand-name">${esc(b.brandName)} <small class="brand-mfr">${esc(b.manufacturer || "")}</small></span>
        <span class="mono brand-price">₹${b.mrp.toFixed(2)}</span>
      </li>`
    )
    .join("");

  return `
    <article class="med-card" style="animation-delay:${index * 30}ms" data-id="${esc(medicine.id || medicine._id)}">
      <div class="med-card__top">
        <span class="med-card__category">${esc(medicine.category || "Generic Formulation")}</span>
        <div class="med-card__badges-group">
          ${rxPill}
          ${saveBadge}
        </div>
      </div>

      <h3 class="med-card__title">${esc(medicine.genericName)}</h3>
      
      <p class="med-card__meta">
        <strong>${esc(medicine.composition || medicine.genericName)}</strong> · ${esc(medicine.packSize || "10 tablets")} · <span class="mono">${esc(medicine.drugCode)}</span>
      </p>

      <div class="med-card__prices">
        <div class="price-block price-block--generic">
          <span class="price-block__label">Jan Aushadhi Subsidized Price</span>
          <div class="price-block__val-row">
            <span class="price-block__value">₹${medicine.genericMrp.toFixed(2)}</span>
            <span class="price-block__sub">${unitPriceStr}</span>
          </div>
        </div>

        <div class="price-block price-block--branded">
          <span class="price-block__label">Branded market, from</span>
          <span class="price-block__value price-block__value--strike">
            ₹${cheapestBranded ? cheapestBranded.toFixed(2) : "—"}
          </span>
          ${savings ? `<span class="price-block__savings">Save ₹${savings.toFixed(2)}</span>` : ""}
        </div>
      </div>

      ${
        brandsList
          ? `<div class="med-card__equivalents-box">
               <p class="equivalents-title">Prescription equivalents &amp; market price:</p>
               <ul class="med-card__brands">${brandsList}</ul>
             </div>`
          : ""
      }

      <div class="med-card__actions-row">
        <button type="button" class="med-card__cta med-card__cta--kendra" data-action="locate">
          ${icon.mapPin} <span>Find Kendra</span>
        </button>
        <button type="button" class="med-card__cta med-card__cta--cart" data-action="add-cart">
          ${icon.cart} <span>Add to Cart</span>
        </button>
        <button type="button" class="med-card__btn-order" data-action="buy-now">
          ${icon.bolt} <span>Instant Order &amp; Simulate Payment</span>
        </button>
      </div>
    </article>
  `;
}

function renderSearchResults({ loading, results, searched, error }) {
  resultsError.hidden = true;
  resultsEmpty.hidden = true;
  if (resultsHeader) resultsHeader.hidden = true;
  resultsGrid.innerHTML = "";

  if (error) {
    resultsError.hidden = false;
    resultsError.textContent = error;
    return;
  }

  if (loading) {
    resultsGrid.innerHTML = Array.from({ length: 3 }).map(() => `<div class="skeleton-card"></div>`).join("");
    return;
  }

  if (searched && results.length === 0) {
    resultsEmpty.hidden = false;
    return;
  }

  if (results.length > 0 && resultsHeader) {
    resultsHeader.hidden = false;
    resultsLabel.textContent = searched
      ? `${results.length} formulation${results.length > 1 ? "s" : ""} matched on ABDM network`
      : `Featured PMBJP generic formulations (${results.length})`;
  }

  lastSearchResults = results;
  resultsGrid.innerHTML = results.map((m, i) => medicineCardHTML(m, i)).join("");
}

function syncCategoryDropdown() {
  if (!searchCategorySelect || !searchCategoryLabel || !searchCategoryOptions) return;

  const selectedOption = searchCategorySelect.options[searchCategorySelect.selectedIndex];
  searchCategoryLabel.textContent = selectedOption ? selectedOption.textContent : "All categories";

  searchCategoryOptions.querySelectorAll('[role="option"]').forEach((option) => {
    const selected = option.dataset.value === searchCategorySelect.value;
    option.setAttribute("aria-selected", String(selected));
    option.classList.toggle("is-selected", selected);
  });
}

function setCategoryDropdownOpen(open, focusSelected = false) {
  if (!searchCategory || !searchCategoryTrigger || !searchCategoryOptions) return;

  searchCategory.classList.toggle("is-open", open);
  searchCategoryTrigger.setAttribute("aria-expanded", String(open));
  searchCategoryOptions.hidden = !open;

  if (open && focusSelected) {
    searchCategoryOptions.querySelector('[aria-selected="true"]')?.focus();
  }
}

function initializeCategoryDropdown() {
  if (!searchCategorySelect || !searchCategoryOptions) return;

  const options = Array.from(searchCategorySelect.options, (nativeOption) => {
    const option = document.createElement("button");
    option.type = "button";
    option.tabIndex = -1;
    option.className = "search-bar__category-option";
    option.setAttribute("role", "option");
    option.dataset.value = nativeOption.value;

    const label = document.createElement("span");
    label.textContent = nativeOption.textContent;
    option.append(label);

    const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    check.setAttribute("viewBox", "0 0 20 20");
    check.setAttribute("width", "16");
    check.setAttribute("height", "16");
    check.setAttribute("fill", "none");
    check.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m4 10 4 4 8-8");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    check.append(path);
    option.append(check);

    option.addEventListener("click", () => {
      searchCategorySelect.value = nativeOption.value;
      searchCategorySelect.dispatchEvent(new Event("change", { bubbles: true }));
      searchCategoryTrigger.focus();
      setCategoryDropdownOpen(false);
    });

    option.addEventListener("keydown", (event) => {
      const allOptions = Array.from(searchCategoryOptions.querySelectorAll('[role="option"]'));
      const currentIndex = allOptions.indexOf(option);
      let nextIndex = currentIndex;

      if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % allOptions.length;
      else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + allOptions.length) % allOptions.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = allOptions.length - 1;
      else if (event.key === "Escape") {
        event.preventDefault();
        setCategoryDropdownOpen(false);
        searchCategoryTrigger.focus();
        return;
      } else {
        return;
      }

      event.preventDefault();
      allOptions[nextIndex].focus();
    });

    return option;
  });

  searchCategoryOptions.replaceChildren(...options);
  searchCategoryTrigger.addEventListener("click", () => {
    setCategoryDropdownOpen(searchCategoryOptions.hidden, searchCategoryOptions.hidden);
  });
  searchCategoryTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCategoryDropdownOpen(false);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setCategoryDropdownOpen(true, true);
  });
  document.addEventListener("pointerdown", (event) => {
    if (!searchCategory.contains(event.target)) setCategoryDropdownOpen(false);
  });
  document.addEventListener("focusin", (event) => {
    if (!searchCategory.contains(event.target)) setCategoryDropdownOpen(false);
  });
  searchCategorySelect.addEventListener("change", syncCategoryDropdown);
  syncCategoryDropdown();
}

initializeCategoryDropdown();

function applyCategoryFilter(cat) {
  activeCategory = cat || "";

  if (searchCategorySelect) {
    searchCategorySelect.value = activeCategory;
    syncCategoryDropdown();
  }

  if (categoriesRow) {
    categoriesRow.querySelectorAll(".cat-item").forEach((btn) => {
      const btnCat = btn.dataset.cat || "";
      btn.classList.toggle("is-active", btnCat.toLowerCase() === activeCategory.toLowerCase());
    });
  }

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  let list = allMedicinesCache.length > 0 ? allMedicinesCache : lastSearchResults;

  if (query) {
    list = list.filter((m) =>
      (m.genericName || "").toLowerCase().includes(query) ||
      (m.composition || "").toLowerCase().includes(query) ||
      (m.category || "").toLowerCase().includes(query) ||
      (m.searchKeywords || []).some((k) => k.toLowerCase().includes(query)) ||
      (m.brandedEquivalents || []).some((b) => b.brandName.toLowerCase().includes(query))
    );
  }

  if (activeCategory) {
    list = list.filter((m) =>
      (m.category || "").toLowerCase().includes(activeCategory.toLowerCase()) ||
      (m.genericName || "").toLowerCase().includes(activeCategory.toLowerCase())
    );
  }

  renderSearchResults({
    loading: false,
    results: !activeCategory && !query ? list.slice(0, 9) : list,
    searched: Boolean(query) || Boolean(activeCategory),
    error: null,
  });

  const section = document.getElementById("search-results-section");
  if (section && (activeCategory || query)) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function handleSearch(query) {
  const cat = searchCategorySelect ? searchCategorySelect.value.trim() : "";
  if (!query && !cat) {
    renderSearchResults({ loading: false, results: allMedicinesCache.slice(0, 9), searched: false, error: null });
    return;
  }

  searchButton.disabled = true;
  searchButton.innerHTML = `<span class="spinner-sm"></span> <span>Querying ABDM…</span>`;
  renderSearchResults({ loading: true, results: [], searched: true, error: null });

  try {
    let data;
    if (query) {
      data = await searchMedicines(query);
    } else {
      data = allMedicinesCache;
    }

    if (cat) {
      data = data.filter((m) =>
        (m.category || "").toLowerCase().includes(cat.toLowerCase())
      );
    }

    renderSearchResults({ loading: false, results: data, searched: true, error: null });

    const section = document.getElementById("search-results-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (err) {
    renderSearchResults({ loading: false, results: [], searched: true, error: err.message });
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span class="search-btn-text">Compare &amp; Find Kendra</span>`;
  }
}

// Service pills
document.querySelectorAll(".service-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    const cat = pill.dataset.cat;
    applyCategoryFilter(cat === "all" ? "" : cat);
  });
});

// Brand logo button returns to search
document.getElementById("brand-logo-btn")?.addEventListener("click", () => switchView("search"));

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(searchInput.value.trim());
});

if (searchCategorySelect) {
  searchCategorySelect.addEventListener("change", (e) => {
    applyCategoryFilter(e.target.value);
  });
}

if (categoriesRow) {
  categoriesRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-item");
    if (!btn) return;
    const cat = btn.dataset.cat;
    applyCategoryFilter(cat);
  });
}

if (catPrevBtn && categoriesRow) {
  catPrevBtn.addEventListener("click", () => {
    categoriesRow.scrollBy({ left: -240, behavior: "smooth" });
  });
}

if (catNextBtn && categoriesRow) {
  catNextBtn.addEventListener("click", () => {
    categoriesRow.scrollBy({ left: 240, behavior: "smooth" });
  });
}

if (btnHeroCompare) {
  btnHeroCompare.addEventListener("click", (e) => {
    e.preventDefault();
    const query = searchInput ? searchInput.value.trim() : "";
    const cat = searchCategorySelect ? searchCategorySelect.value.trim() : "";
    if (query || cat) {
      handleSearch(query);
    } else {
      const target = document.getElementById("search-results") || document.getElementById("categories-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}

if (btnHeaderLocate) {
  btnHeaderLocate.addEventListener("click", () => {
    const targetMed = (lastSearchResults && lastSearchResults.length > 0) ? lastSearchResults[0] : (allMedicinesCache[0] || null);
    if (targetMed) {
      openDrawer(targetMed);
    } else {
      switchView("search");
      searchInput.focus();
    }
  });
}

document.querySelectorAll(".quick-tag").forEach((btn) => {
  btn.addEventListener("click", () => {
    searchInput.value = btn.dataset.term;
    handleSearch(btn.dataset.term);
  });
});

// Card button delegation
resultsGrid.addEventListener("click", (e) => {
  const locateBtn = e.target.closest('[data-action="locate"]');
  const addCartBtn = e.target.closest('[data-action="add-cart"]');
  const buyNowBtn = e.target.closest('[data-action="buy-now"]');
  const card = e.target.closest(".med-card");
  if (!card) return;

  const targetId = card.dataset.id;
  const medicine = lastSearchResults.find((m) => (m.id || m._id) === targetId);
  if (!medicine) return;

  if (locateBtn) {
    openDrawer(medicine);
  } else if (addCartBtn) {
    addToCart(medicine, 1);
  } else if (buyNowBtn) {
    openPaymentSimulationModal({
      kendraId: "PMBJK02001",
      kendraName: "Jan Aushadhi Kendra - KEM Hospital Parel",
      items: [
        {
          medicineId: medicine.id || medicine._id,
          genericName: medicine.genericName,
          packSize: medicine.packSize || "10 Tablets",
          genericMrp: medicine.genericMrp,
          quantity: 1,
        },
      ],
      totalAmount: medicine.genericMrp,
    });
  }
});

// ---------------------------------------------------------------------
// Kendra Drawer (Proximity & Stock Availability)
// ---------------------------------------------------------------------
function storeItemHTML(store) {
  const isStocked = store.inStock === true;
  const stockBadge = isStocked
    ? `<span class="stock-badge stock-badge--in">
         ${icon.check} In Stock (${store.unitsAvailable ?? "Available"} units)
       </span>`
    : `<span class="stock-badge stock-badge--out">
         ${icon.cross} Out of Stock
       </span>`;

  const distanceBadge =
    typeof store.distanceKm === "number"
      ? `<span class="store-item__distance">${store.distanceKm} km away</span>`
      : `<span class="store-item__distance">${esc(store.city)}</span>`;

  const orderOrAlertBtn = isStocked
    ? `<button type="button" class="store-link store-link--order" data-action="order-from-store" data-kendra-id="${esc(store.id)}" data-kendra-name="${esc(store.name)}">
         ${icon.bolt} Buy Here (Simulate Pay)
       </button>`
    : `<button type="button" class="store-link store-link--alert" data-action="alert-for-store" data-kendra-id="${esc(store.id)}" data-kendra-name="${esc(store.name)}">
         ${icon.bell} Notify When Restocked
       </button>`;

  return `
    <li class="store-item ${isStocked ? "store-item--stocked" : "store-item--unstocked"}">
      <div class="store-item__header">
        <div class="store-item__title-group">
          <span class="store-item__code">${esc(store.kendraCode || store.id)}</span>
          <h5 class="store-item__name">${esc(store.name)}</h5>
        </div>
        ${distanceBadge}
      </div>

      <p class="store-item__address">${esc(store.address)}</p>

      <div class="store-item__meta-row">
        <span class="store-item__hours">${icon.clock} ${esc(store.operatingHours || "08:30 AM - 09:00 PM")}</span>
        ${stockBadge}
      </div>

      <div class="store-item__actions">
        ${orderOrAlertBtn}
        ${store.directionsUrl ? `<a href="${esc(store.directionsUrl)}" target="_blank" rel="noopener noreferrer" class="store-link store-link--nav">${icon.navArrow} Directions</a>` : ""}
        ${store.phone ? `<a href="tel:${esc(store.phone)}" class="store-link store-link--call">${icon.phone} Call</a>` : ""}
      </div>
    </li>
  `;
}

function renderDrawerBody({ loading, kendras, error }) {
  if (loading) {
    drawerBody.innerHTML = `
      <div class="drawer__loading">
        <div class="spinner"></div>
        <p>Checking live Jan Aushadhi Kendra stock &amp; proximity…</p>
      </div>`;
    return;
  }

  if (error) {
    drawerBody.innerHTML = `<p class="drawer__status drawer__status--error">${esc(error)}</p>`;
    return;
  }

  if (!kendras || kendras.length === 0) {
    drawerBody.innerHTML = `
      <div class="drawer__empty-state">
        <p>No Kendras matching this filter.</p>
        <p class="text-subtle">Try unchecking "Show In-Stock Only" or selecting a different region.</p>
      </div>`;
    return;
  }

  drawerBody.innerHTML = `<ul class="drawer__list">${kendras.map(storeItemHTML).join("")}</ul>`;
}

async function fetchKendrasForDrawer() {
  if (!currentDrawerMedicine) return;

  renderDrawerBody({ loading: true, kendras: [] });
  const inStockOnly = stockOnlyCheckbox.checked;
  const city = cityFilterSelect.value;
  const lat = userCoords ? userCoords.lat : null;
  const lng = userCoords ? userCoords.lng : null;

  try {
    const res = await getKendrasForMedicine(currentDrawerMedicine.id || currentDrawerMedicine._id, {
      lat,
      lng,
      inStockOnly,
      city,
      limit: 15,
    });
    renderDrawerBody({ loading: false, kendras: res.kendras || [] });
  } catch (err) {
    renderDrawerBody({ loading: false, kendras: [], error: err.message });
  }
}

function openDrawer(medicine) {
  currentDrawerMedicine = medicine;
  drawerTitle.textContent = `${medicine.genericName}`;

  const cheapestBranded = medicine.cheapestBrandedMrp;
  const savingsPct = cheapestBranded
    ? Math.round(((cheapestBranded - medicine.genericMrp) / cheapestBranded) * 100)
    : null;

  drawerMedBanner.innerHTML = `
    <div class="drawer-med-card">
      <div class="drawer-med-card__top">
        <div class="drawer-med-card__price-col">
          <span class="drawer-med-card__label">Subsidized PMBJP Price</span>
          <div class="drawer-med-card__price-row">
            <span class="drawer-med-card__price">₹${medicine.genericMrp.toFixed(2)}</span>
            <span class="drawer-med-card__unit">/ ${esc(medicine.packSize || "strip of 10 tablets")}</span>
          </div>
        </div>
        ${savingsPct ? `<span class="drawer-med-card__save-tag">Save ${savingsPct}% vs Branded</span>` : ""}
      </div>
      <div class="drawer-med-card__info-row">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Direct purchase counter available at certified Kendras below:</span>
      </div>
    </div>
  `;

  drawer.classList.add("is-open");
  drawerBackdrop.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");

  fetchKendrasForDrawer();
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

drawerClose.addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
stockOnlyCheckbox.addEventListener("change", fetchKendrasForDrawer);
cityFilterSelect.addEventListener("change", fetchKendrasForDrawer);

locateMeBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  locateMeBtn.textContent = "Locating…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      locateMeBtn.innerHTML = `${icon.check} Located`;
      cityFilterSelect.value = "";
      fetchKendrasForDrawer();
    },
    () => {
      alert("Unable to detect coordinates. Select a region from the dropdown.");
      locateMeBtn.innerHTML = `${icon.navArrow} My Location`;
    },
    { timeout: 6000 }
  );
});

// Drawer action delegation
drawerBody.addEventListener("click", (e) => {
  const orderStoreBtn = e.target.closest('[data-action="order-from-store"]');
  const alertStoreBtn = e.target.closest('[data-action="alert-for-store"]');

  if (orderStoreBtn && currentDrawerMedicine) {
    const kendraId = orderStoreBtn.dataset.kendraId;
    const kendraName = orderStoreBtn.dataset.kendraName;
    closeDrawer();
    openPaymentSimulationModal({
      kendraId,
      kendraName,
      items: [
        {
          medicineId: currentDrawerMedicine.id || currentDrawerMedicine._id,
          genericName: currentDrawerMedicine.genericName,
          packSize: currentDrawerMedicine.packSize || "10 Tablets",
          genericMrp: currentDrawerMedicine.genericMrp,
          quantity: 1,
        },
      ],
      totalAmount: currentDrawerMedicine.genericMrp,
    });
  } else if (alertStoreBtn && currentDrawerMedicine) {
    const kendraId = alertStoreBtn.dataset.kendraId;
    closeDrawer();
    openAlertModal(currentDrawerMedicine, kendraId);
  }
});

// ---------------------------------------------------------------------
// Out-of-Stock Alert ("Notify Me")
// ---------------------------------------------------------------------
function openAlertModal(medicine, kendraId = null) {
  alertMedicineId.value = medicine.id || medicine._id;
  alertKendraId.value = kendraId || "";
  alertMedName.textContent = medicine.genericName;
  alertKendraName.textContent = kendraId ? `Kendra ${kendraId}` : "Any Nearby Kendra";
  alertModalBackdrop.hidden = false;
  const am = document.getElementById("alert-modal");
  if (am) am.hidden = false;
}

document.getElementById("btn-close-alert-modal").addEventListener("click", () => {
  alertModalBackdrop.hidden = true;
  const am = document.getElementById("alert-modal");
  if (am) am.hidden = true;
});
document.getElementById("btn-cancel-alert").addEventListener("click", () => {
  alertModalBackdrop.hidden = true;
  const am = document.getElementById("alert-modal");
  if (am) am.hidden = true;
});

stockAlertForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(stockAlertForm);
  const medicineId = formData.get("medicineId");
  const kendraId = formData.get("kendraId");
  const customerName = formData.get("customerName");
  const customerEmail = formData.get("customerEmail");
  const customerPhone = formData.get("customerPhone");

  try {
    const res = await subscribeStockAlert({
      medicineId,
      kendraId,
      customerName,
      customerEmail,
      customerPhone,
    });

    alertModalBackdrop.hidden = true;
    const am = document.getElementById("alert-modal");
    if (am) am.hidden = true;
    showToast(`Subscribed! We will alert ${customerEmail} upon restock`, "🔔");

    currentUser.name = customerName || currentUser.name;
    currentUser.email = customerEmail;
    currentUser.phone = customerPhone;
    updateRoleUI();

    switchView("customer");
  } catch (err) {
    alert(`Alert subscription failed: ${err.message}`);
  }
});

// ---------------------------------------------------------------------
// Kendra Owner Add Formulation
// ---------------------------------------------------------------------
btnOpenAddMed.addEventListener("click", () => {
  if (currentUser.role !== "kendra_owner") {
    currentUser = DEMO_PERSONAS.kendra;
    localStorage.setItem("rxcompare_user", JSON.stringify(currentUser));
    updateRoleUI();
  }
  addProductModalBackdrop.hidden = false;
  const apm = document.getElementById("add-product-modal");
  if (apm) apm.hidden = false;
});

document.getElementById("btn-close-product-modal").addEventListener("click", () => {
  addProductModalBackdrop.hidden = true;
  const apm = document.getElementById("add-product-modal");
  if (apm) apm.hidden = true;
});
document.getElementById("btn-cancel-product").addEventListener("click", () => {
  addProductModalBackdrop.hidden = true;
  const apm = document.getElementById("add-product-modal");
  if (apm) apm.hidden = true;
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const kendraId = currentUser.kendraId || "PMBJK02001";

  const medData = {
    genericName: formData.get("genericName"),
    composition: formData.get("composition"),
    category: formData.get("category"),
    packSize: formData.get("packSize"),
    genericMrp: parseFloat(formData.get("genericMrp")),
    units: parseInt(formData.get("units"), 10),
  };

  try {
    await addMedicineToKendra(kendraId, medData);
    addProductModalBackdrop.hidden = true;
    const apm = document.getElementById("add-product-modal");
    if (apm) apm.hidden = true;
    addProductForm.reset();
    showToast("Formulation successfully added to Kendra inventory!", "✓");
    loadKendraDashboard();
  } catch (err) {
    alert(`Failed to add product: ${err.message}`);
  }
});

// ---------------------------------------------------------------------
// User Role Persona Switcher
// ---------------------------------------------------------------------
function renderPersonaUsers(users) {
  return users
    .map((user) => `
      <div class="persona-item">
        <div>
          <div style="font-weight: 700; color: var(--navy-deep); font-size: 0.95rem;">
            ${esc(user.name)}
            <span class="user-pill__role-tag" style="margin-left: 6px; font-size: 0.72rem; padding: 2px 6px;">${esc(user.role)}</span>
            ${user.status === "pending" ? `<span class="badge badge--amber" style="margin-left: 4px; font-size: 0.7rem;">Pending</span>` : ""}
          </div>
          <p class="text-subtle" style="margin: 2px 0 0; font-size: 0.8rem;">${esc(user.email)} ${user.kendraName ? `· ${esc(user.kendraName)}` : ""}</p>
        </div>
        <button type="button" class="btn btn--outline btn--sm" data-action="switch-to-user" data-email="${esc(user.email)}">
          Login as ${esc(user.name.split(" ")[0])}
        </button>
      </div>`)
    .join("");
}

btnOpenPersona.addEventListener("click", async () => {
  personaModalBackdrop.hidden = false;
  const pm = document.getElementById("persona-modal");
  if (pm) pm.hidden = false;

  const container = document.getElementById("persona-cards-container");
  container.innerHTML = `<p class="text-subtle" style="padding: 12px; text-align: center;">Loading persona credentials…</p>`;

  try {
    const res = await getDemoUsers();
    if (!Array.isArray(res.users) || res.users.length === 0) {
      throw new Error("No demo users are available from the server");
    }
    availablePersonaUsers = res.users;
    container.innerHTML = renderPersonaUsers(availablePersonaUsers);
  } catch (err) {
    availablePersonaUsers = LOCAL_DEMO_USERS;
    container.innerHTML = `
      <p class="text-subtle" role="status" style="margin: 0 0 12px;">
        The server is unavailable; local demo profiles are available.
      </p>
      ${renderPersonaUsers(availablePersonaUsers)}`;
  }
});

document.getElementById("btn-close-persona-modal").addEventListener("click", () => {
  personaModalBackdrop.hidden = true;
  const pm = document.getElementById("persona-modal");
  if (pm) pm.hidden = true;
});

document.getElementById("persona-cards-container").addEventListener("click", (e) => {
  const btn = e.target.closest('[data-action="switch-to-user"]');
  if (!btn) return;
  const user = availablePersonaUsers.find((persona) => persona.email === btn.dataset.email);
  if (!user) {
    showToast("That demo profile is no longer available. Reopen the role switcher and try again.", "!");
    return;
  }
  switchUser(user);
});

document.querySelectorAll(".btn-persona").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const email = btn.dataset.email;
    try {
      const res = await loginUser(email);
      switchUser(res.user);
    } catch {
      switchUser({
        id: `usr-${Date.now()}`,
        name: btn.textContent.trim(),
        email,
        role: btn.dataset.role,
      });
    }
  });
});

// ---------------------------------------------------------------------
// VIEW 2: Customer Dashboard (Orders & Alerts)
// ---------------------------------------------------------------------
async function loadCustomerDashboard() {
  customerOrdersList.innerHTML = `<div class="drawer__loading"><div class="spinner"></div><p>Fetching your orders…</p></div>`;
  customerAlertsList.innerHTML = `<div class="drawer__loading"><div class="spinner"></div><p>Fetching your restock alerts…</p></div>`;

  try {
    const [ordersRes, alertsRes] = await Promise.all([
      getMyOrders(currentUser.email),
      getMyStockAlerts(currentUser.email),
    ]);

    const orders = ordersRes.orders || [];
    const alerts = alertsRes.alerts || [];

    countCustomerOrders.textContent = orders.length;
    countCustomerAlerts.textContent = alerts.length;
    customerOrdersBadge.textContent = orders.length;
    customerOrdersBadge.hidden = orders.length === 0;

    // Render Orders
    if (orders.length === 0) {
      customerOrdersList.innerHTML = `
        <div class="card card--padded" style="text-align: center;">
          <h4>No online orders placed yet</h4>
          <p class="text-subtle">Search for a branded or generic medicine, add it to your cart, or click "Instant Order" to simulate your first prescription purchase.</p>
          <button type="button" class="btn btn--primary" style="margin-top: 12px;" onclick="document.querySelector('[data-view=search]').click()">
            Browse Medicines Catalog
          </button>
        </div>`;
    } else {
      customerOrdersList.innerHTML = orders
        .map(
          (o) => `
        <div class="order-card">
          <div class="order-card__header">
            <div>
              <span class="order-card__id">${esc(o.id)}</span>
              <span class="order-card__date">${new Date(o.createdAt).toLocaleString()}</span>
            </div>
            <span class="status-pill status-pill--${esc(o.status)}">${esc(o.status)}</span>
          </div>

          <div style="font-size: 0.85rem; color: var(--navy-deep); font-weight: 500;">
            Fulfilling Kendra: ${esc(o.kendraName)} · ${esc(o.deliveryType === "delivery" ? "Home Delivery" : "Counter Pickup")}
          </div>

          <table class="order-items-table">
            <tbody>
              ${o.items
                .map(
                  (item) => `
                <tr>
                  <td><strong>${esc(item.genericName)}</strong> <span class="text-subtle">(${esc(item.packSize || "")})</span></td>
                  <td style="text-align: center;">Qty: ${item.quantity}</td>
                  <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">₹${item.totalPrice.toFixed(2)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>

          <div class="order-card__footer">
            <span class="text-subtle">
              ${esc(o.paymentMethod || "")} ${o.transactionId ? `· Ref: <span class="mono">${esc(o.transactionId)}</span>` : ""}
            </span>
            <div class="order-total-price">Total Paid: ₹${o.totalAmount.toFixed(2)}</div>
          </div>
        </div>`
        )
        .join("");
    }

    // Render Alerts
    if (alerts.length === 0) {
      customerAlertsList.innerHTML = `
        <div class="card card--padded" style="text-align: center;">
          <h4>No active restock alerts</h4>
          <p class="text-subtle">When you check a Kendra and a medicine is out of stock, click "Notify When Restocked" to receive automated restock updates here.</p>
        </div>`;
    } else {
      customerAlertsList.innerHTML = alerts
        .map((a) => {
          const isNotified = a.status === "notified";
          return `
          <div class="alert-card ${isNotified ? "alert-banner--warning" : ""}">
            <div class="alert-card__header">
              <div>
                <strong style="font-size: 1rem;">${esc(a.medicineName)}</strong>
                <span class="text-subtle" style="margin-left: 8px;">Subscribed on ${new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
              <span class="status-pill status-pill--${isNotified ? "ready" : "placed"}">
                ${isNotified ? "Restocked!" : "Waiting Restock"}
              </span>
            </div>

            <p style="margin: 4px 0 0; font-size: 0.88rem;">
              Monitoring Kendra: <strong>${esc(a.kendraName)}</strong>
            </p>

            ${
              isNotified && a.notificationMessage
                ? `<div class="info-callout" style="background: #e6f6ee; border-color: #a4ddbf; color: #167a52; margin: 8px 0 0;">
                     🎉 ${esc(a.notificationMessage)}
                   </div>`
                : `<p class="text-subtle" style="margin: 0; font-size: 0.8rem;">We will alert ${esc(a.customerEmail)} as soon as inventory units are restocked.</p>`
            }
          </div>`;
        })
        .join("");
    }
  } catch (err) {
    customerOrdersList.innerHTML = `<p class="drawer__status--error">${esc(err.message)}</p>`;
  }
}

btnRefreshCustomer.addEventListener("click", loadCustomerDashboard);

// ---------------------------------------------------------------------
// VIEW 3: Kendra Owner Dashboard (Add Medicines & Update Stock)
// ---------------------------------------------------------------------
async function loadKendraDashboard() {
  if (currentUser.role !== "kendra_owner") {
    kendraRegisterSection.hidden = false;
    kendraHubSection.hidden = true;
    kendraPendingBanner.hidden = true;
    kendraDashTitle.textContent = "Jan Aushadhi Kendra Registration";
    return;
  }

  if (currentUser.status === "pending") {
    kendraPendingBanner.hidden = false;
    pendingKendraName.textContent = currentUser.kendraName || "Your Kendra";
    kendraRegisterSection.hidden = true;
    kendraHubSection.hidden = true;
    kendraDashTitle.textContent = `${currentUser.kendraName || "Jan Aushadhi Kendra"} (Pending Admin Approval)`;
    return;
  }

  kendraPendingBanner.hidden = true;
  kendraRegisterSection.hidden = true;
  kendraHubSection.hidden = false;

  const kendraId = currentUser.kendraId || "PMBJK02001";
  kendraDashTitle.textContent = `${currentUser.kendraName || "Jan Aushadhi Kendra Counter"}`;

  try {
    const [invRes, ordersRes] = await Promise.all([
      getKendraInventory(kendraId),
      getKendraOrders(kendraId),
    ]);

    const items = invRes.items || [];
    const orders = ordersRes.orders || [];
    currentKendraInventory = items;

    const inStockCount = items.filter((i) => i.inStock).length;
    const outStockCount = items.length - inStockCount;
    const pendingOrdersCount = orders.filter((o) => o.status === "placed" || o.status === "confirmed").length;

    kpiKendraTotalItems.textContent = items.length;
    kpiKendraInStock.textContent = inStockCount;
    kpiKendraOutStock.textContent = outStockCount;
    kpiKendraOrders.textContent = pendingOrdersCount;
    countKendraOrders.textContent = orders.length;

    renderKendraInventoryTable(items);
    renderKendraOrders(orders);
  } catch (err) {
    alert(`Failed to load Kendra inventory: ${err.message}`);
  }
}

function renderKendraInventoryTable(items) {
  if (items.length === 0) {
    kendraInventoryTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px;">No formulations indexed for this Kendra yet. Click "+ Add New Medicine Product" above to add.</td></tr>`;
    return;
  }

  kendraInventoryTbody.innerHTML = items
    .map(
      (item) => `
      <tr data-med-id="${esc(item.medicineId)}">
        <td class="mono"><strong>${esc(item.drugCode)}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--navy-deep);">${esc(item.genericName)}</div>
          <div class="text-subtle" style="font-size: 0.76rem;">${esc(item.composition)}</div>
        </td>
        <td>${esc(item.packSize)}</td>
        <td class="mono font-bold">₹${item.genericMrp.toFixed(2)}</td>
        <td class="mono text-subtle" style="font-size: 0.78rem;">${esc(item.batchNumber)} <br/> Exp: ${esc(item.expiryDate)}</td>
        <td>
          <div class="stock-input-group">
            <input type="number" min="0" value="${item.units}" class="stock-units-input" data-field="units" />
          </div>
        </td>
        <td>
          <span class="stock-badge ${item.inStock ? "stock-badge--in" : "stock-badge--out"}">
            ${item.inStock ? `${icon.check} In Stock` : `${icon.cross} Out of Stock`}
          </span>
        </td>
        <td>
          <button type="button" class="btn btn--outline btn--sm" data-action="save-stock">
            Update Stock
          </button>
        </td>
      </tr>`
    )
    .join("");
}

function renderKendraOrders(orders) {
  if (orders.length === 0) {
    kendraOrdersList.innerHTML = `<div class="card card--padded" style="text-align: center;"><p class="text-subtle">No incoming customer orders for this Kendra yet.</p></div>`;
    return;
  }

  kendraOrdersList.innerHTML = orders
    .map(
      (o) => `
      <div class="order-card" data-order-id="${esc(o.id)}">
        <div class="order-card__header">
          <div>
            <span class="order-card__id">${esc(o.id)}</span>
            <span class="order-card__date">${new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <span class="status-pill status-pill--${esc(o.status)}">${esc(o.status)}</span>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; flex-wrap: wrap; gap: 8px;">
          <div>
            <strong>Customer:</strong> ${esc(o.customerName)} (${esc(o.customerPhone)})
            <div class="text-subtle">${esc(o.deliveryType === "delivery" ? `Delivery: ${o.deliveryAddress}` : "Counter Pickup")}</div>
          </div>
          <div style="text-align: right;">
            <div class="order-total-price">₹${o.totalAmount.toFixed(2)}</div>
            <div class="text-subtle">${esc(o.paymentMethod || "")}</div>
          </div>
        </div>

        <table class="order-items-table">
          <tbody>
            ${o.items.map((i) => `<tr><td>${esc(i.genericName)}</td><td style="text-align: center;">Qty: ${i.quantity}</td><td style="text-align: right;">₹${i.totalPrice.toFixed(2)}</td></tr>`).join("")}
          </tbody>
        </table>

        <div class="order-card__footer" style="gap: 8px;">
          <span class="text-subtle">Order Fulfillment:</span>
          <div style="display: flex; gap: 6px;">
            ${o.status === "placed" ? `<button type="button" class="btn btn--primary btn--sm" data-action="set-status" data-status="confirmed">Accept &amp; Confirm</button>` : ""}
            ${o.status === "confirmed" ? `<button type="button" class="btn btn--primary btn--sm" data-action="set-status" data-status="ready">Mark Ready for Pickup / Delivery</button>` : ""}
            ${o.status === "ready" ? `<button type="button" class="btn btn--outline btn--sm" style="background: #e6f6ee; color: #167a52;" data-action="set-status" data-status="completed">Complete Order</button>` : ""}
          </div>
        </div>
      </div>`
    )
    .join("");
}

kendraInventorySearch.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase().trim();
  if (!term) {
    renderKendraInventoryTable(currentKendraInventory);
    return;
  }
  const filtered = currentKendraInventory.filter(
    (i) =>
      i.genericName.toLowerCase().includes(term) ||
      i.drugCode.toLowerCase().includes(term) ||
      i.composition.toLowerCase().includes(term)
  );
  renderKendraInventoryTable(filtered);
});

kendraInventoryTbody.addEventListener("click", async (e) => {
  const btn = e.target.closest('[data-action="save-stock"]');
  if (!btn) return;
  const tr = btn.closest("tr");
  const medId = tr.dataset.medId;
  const unitsInput = tr.querySelector('[data-field="units"]');
  const units = parseInt(unitsInput.value, 10);

  const kendraId = currentUser.kendraId || "PMBJK02001";
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    const res = await updateKendraStock(kendraId, medId, {
      units,
      inStock: units > 0,
    });

    if (res.triggeredAlerts > 0) {
      alert(`Stock updated! Restocked batch automatically notified ${res.triggeredAlerts} waiting customer(s)!`);
    } else {
      showToast("Stock units updated successfully!", "✓");
    }
    loadKendraDashboard();
  } catch (err) {
    alert(`Failed to update stock: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = "Update Stock";
  }
});

kendraOrdersList.addEventListener("click", async (e) => {
  const btn = e.target.closest('[data-action="set-status"]');
  if (!btn) return;
  const orderCard = btn.closest(".order-card");
  const orderId = orderCard.dataset.orderId;
  const status = btn.dataset.status;

  btn.disabled = true;
  try {
    await updateOrderStatus(orderId, status);
    showToast(`Order #${orderId} marked as ${status}`, "✓");
    loadKendraDashboard();
  } catch (err) {
    alert(`Status update failed: ${err.message}`);
  }
});

kendraRegisterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(kendraRegisterForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await registerKendra(data);
    alert(res.message);

    currentUser.role = "kendra_owner";
    currentUser.kendraName = res.application.name;
    currentUser.status = "pending";
    updateRoleUI();
    loadKendraDashboard();
  } catch (err) {
    alert(`Registration failed: ${err.message}`);
  }
});

// ---------------------------------------------------------------------
// VIEW 4: Admin Portal (Accept/Reject Kendra Owner Requests)
// ---------------------------------------------------------------------
async function loadAdminDashboard() {
  try {
    const [statsRes, appsRes, ordersRes] = await Promise.all([
      getAdminStats(),
      getAdminApplications(),
      getAdminOrders(),
    ]);

    const stats = statsRes.stats || {};
    const apps = appsRes.applications || [];
    const orders = ordersRes.orders || [];

    kpiAdminKendras.textContent = stats.totalKendras;
    kpiAdminPending.textContent = stats.pendingApplications;
    kpiAdminOrders.textContent = stats.totalOrders;
    kpiAdminSavings.textContent = `₹${stats.estimatedSavings.toLocaleString()}`;

    countAdminPending.textContent = apps.filter((a) => a.status === "pending").length;
    countAdminOrders.textContent = orders.length;
    adminPendingCountBadge.textContent = stats.pendingApplications;
    adminPendingCountBadge.hidden = stats.pendingApplications === 0;

    renderAdminApplications(apps);
    renderAdminOrders(orders);
  } catch (err) {
    alert(`Admin load error: ${err.message}`);
  }
}

function renderAdminApplications(apps) {
  if (apps.length === 0) {
    adminApprovalsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px;">No Kendra registration applications in queue.</td></tr>`;
    return;
  }

  adminApprovalsTbody.innerHTML = apps
    .map(
      (app) => `
      <tr data-app-id="${esc(app.id)}">
        <td class="mono"><strong>${esc(app.kendraCode || app.id)}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--navy-deep);">${esc(app.name)}</div>
          <div class="text-subtle">${esc(app.ownerName)} · ${esc(app.phone)}</div>
        </td>
        <td>${esc(app.city)}, ${esc(app.state)}</td>
        <td class="mono text-subtle">${esc(app.licenseNumber)}</td>
        <td class="text-subtle">${new Date(app.submittedAt).toLocaleDateString()}</td>
        <td>
          <span class="status-pill status-pill--${app.status === "approved" ? "ready" : app.status === "rejected" ? "cancelled" : "confirmed"}">
            ${esc(app.status)}
          </span>
        </td>
        <td>
          ${
            app.status === "pending"
              ? `<div style="display: flex; gap: 6px;">
                   <button type="button" class="btn btn--primary btn--sm" data-action="approve-kendra">Approve &amp; Activate Kendra</button>
                   <button type="button" class="btn btn--danger btn--sm" data-action="reject-kendra">Reject</button>
                 </div>`
              : `<span class="text-subtle">${app.status === "approved" ? "Active in PMBJP Network" : "Declined"}</span>`
          }
        </td>
      </tr>`
    )
    .join("");
}

function renderAdminOrders(orders) {
  if (orders.length === 0) {
    adminOrdersTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px;">No orders recorded in network.</td></tr>`;
    return;
  }

  adminOrdersTbody.innerHTML = orders
    .map(
      (o) => `
      <tr>
        <td class="mono font-bold">${esc(o.id)}</td>
        <td>
          <strong>${esc(o.customerName)}</strong>
          <div class="text-subtle">${esc(o.customerEmail)}</div>
        </td>
        <td>${esc(o.kendraName)}</td>
        <td>${o.items.map((i) => `${i.genericName} (x${i.quantity})`).join(", ")}</td>
        <td class="mono font-bold text-emerald">₹${o.totalAmount.toFixed(2)}</td>
        <td>
          <span class="status-pill status-pill--${o.paymentStatus === 'simulated_paid' ? 'ready' : 'confirmed'}">
            ${esc(o.paymentStatus || 'simulated_paid')}
          </span>
        </td>
        <td><span class="status-pill status-pill--${esc(o.status)}">${esc(o.status)}</span></td>
      </tr>`
    )
    .join("");
}

adminApprovalsTbody.addEventListener("click", async (e) => {
  const approveBtn = e.target.closest('[data-action="approve-kendra"]');
  const rejectBtn = e.target.closest('[data-action="reject-kendra"]');
  if (!approveBtn && !rejectBtn) return;

  const tr = e.target.closest("tr");
  const appId = tr.dataset.appId;

  if (approveBtn) {
    approveBtn.disabled = true;
    approveBtn.textContent = "Approving…";
    try {
      const res = await approveApplication(appId);
      alert(res.message);
      showToast("Kendra approved and active in network!", "✓");
      loadAdminDashboard();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  } else if (rejectBtn) {
    const reason = prompt("Enter reason for declining application:", "Incomplete documentation");
    if (!reason) return;
    rejectBtn.disabled = true;
    try {
      const res = await rejectApplication(appId, reason);
      alert(res.message);
      loadAdminDashboard();
    } catch (err) {
      alert(`Reject error: ${err.message}`);
    }
  }
});

btnRefreshAdmin.addEventListener("click", loadAdminDashboard);

// ---------------------------------------------------------------------
// Bootstrapping
// ---------------------------------------------------------------------
async function initApp() {
  const saved = localStorage.getItem("rxcompare_user");
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
    } catch {
      // keep default
    }
  }

  loadCartFromStorage();
  updateRoleUI();

  try {
    const [status, medicines] = await Promise.all([
      getUhiStatus().catch(() => null),
      getAllMedicines(),
    ]);

    if (medicines && medicines.length > 0) {
      allMedicinesCache = medicines;
      statMedicineCount.textContent = `${medicines.length}+`;
      statStoreCount.textContent = status ? `${status.totalKendras}` : "12+";

      const pcts = medicines
        .filter((m) => m.cheapestBrandedMrp)
        .map((m) => Math.round(((m.cheapestBrandedMrp - m.genericMrp) / m.cheapestBrandedMrp) * 100));
      const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
      statAvgSavings.textContent = `${avg}%`;
      heroStats.hidden = false;

      renderSearchResults({ loading: false, results: medicines.slice(0, 9), searched: false, error: null });
    }
  } catch (err) {
    // Graceful fallback
  }
}

// Footer navigation links
document.querySelectorAll(".footer__link[data-view]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchView(link.dataset.view);
  });
});

initApp();
