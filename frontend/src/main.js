import "./style.css";
import {
  searchMedicines,
  getAllMedicines,
  getKendrasForMedicine,
  getAllStores,
  getNearbyStores,
  getUhiStatus,
  registerCustomer,
  registerKendraOwner,
  verifyEmail,
  resendVerification,
  loginUser,
  adminLogin,
  logoutUser,
  fetchMe,
  getAdminStats,
  getAdminApplications,
  approveApplication,
  rejectApplication,
  getAdminOrders,
  getAdminUsers,
  setAdminUserStatus,
  getAdminKendras,
  setAdminKendraStatus,
  deleteAdminUser,
  getKendraInventory,
  updateKendraStock,
  addMedicineToKendra,
  getKendraOrders,
  updateOrderStatus,
  quoteOrder,
  placeOrder,
  getMyOrders,
  subscribeStockAlert,
  getMyStockAlerts,
} from "./api.js";

// ---------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------
let currentUser = null;
let authReady = false;
let pendingRedirect = null;
let cart = []; // [{ medicineId, genericName, genericMrp, packSize, quantity, cheapestBrandedMrp }]
let activeView = "search";
let lastSearchResults = [];
let allMedicinesCache = [];
let allStoresCache = [];
let activeCategory = "all";
let currentDrawerMedicine = null;
let drawerShowAllKendras = false;
let currentKendraInventory = [];
let currentKendraCategories = [];
let currentCartQuote = null;
let cartQuoteRequestId = 0;
let rejectApplicationTarget = null;
let adminOrdersCache = [];
let adminOrderTarget = null;
let loginRole = "customer";
let userCoords = null;
let checkoutOrderData = null;
let ownerMap = null;
let ownerMarker = null;
let ownerMapInitialized = false;

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
const userPill = document.getElementById("user-pill");
const authGuestControls = document.getElementById("auth-guest-controls");
const btnHeaderLogin = document.getElementById("btn-header-login");
const btnHeaderRegister = document.getElementById("btn-header-register");
const btnLogout = document.getElementById("btn-logout");
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

const tabSearch = document.getElementById("tab-search");
const tabCustomer = document.getElementById("tab-customer");
const tabKendra = document.getElementById("tab-kendra");
const tabAdmin = document.getElementById("tab-admin");

// Modals & Drawers
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerBackdrop = document.getElementById("cart-drawer-backdrop");
const cartDrawerClose = document.getElementById("cart-drawer-close");
const cartItemsBody = document.getElementById("cart-items-body");
const cartFooter = document.getElementById("cart-footer");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartSavingsText = document.getElementById("cart-savings-text");
const cartKendraSelect = document.getElementById("cart-kendra-select");
const cartPriceNote = document.getElementById("cart-price-note");
const cartBestPriceRow = document.getElementById("cart-best-price-row");
const cartBestPriceText = document.getElementById("cart-best-price-text");
const btnUseBestKendra = document.getElementById("btn-use-best-kendra");
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
const kendraHubSection = document.getElementById("kendra-hub-section");
const kpiKendraTotalItems = document.getElementById("kpi-kendra-total-items");
const kpiKendraInStock = document.getElementById("kpi-kendra-in-stock");
const kpiKendraOutStock = document.getElementById("kpi-kendra-out-stock");
const kpiKendraOrders = document.getElementById("kpi-kendra-orders");
const kpiPendingOrdersCard = document.getElementById("kpi-pending-orders-card");
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
const kpiAdminCustomers = document.getElementById("kpi-admin-customers");
const kpiAdminOwners = document.getElementById("kpi-admin-owners");
const adminApprovalsTbody = document.getElementById("admin-approvals-tbody");
const adminKendrasTbody = document.getElementById("admin-kendras-tbody");
const adminOrdersTbody = document.getElementById("admin-orders-tbody");
const adminUsersTbody = document.getElementById("admin-users-tbody");
const countAdminPending = document.getElementById("count-admin-pending");
const countAdminKendras = document.getElementById("count-admin-kendras");
const countAdminOrders = document.getElementById("count-admin-orders");
const countAdminUsers = document.getElementById("count-admin-users");
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
const addProductCategory = document.getElementById("add-product-category");
const addProductCategoryOptions = document.getElementById("add-product-category-options");

// Admin rejection reason modal
const rejectApplicationForm = document.getElementById("reject-application-form");
const rejectApplicationId = document.getElementById("reject-application-id");
const rejectApplicationName = document.getElementById("reject-application-name");
const rejectApplicationReason = document.getElementById("reject-application-reason");
const rejectApplicationBackdrop = document.getElementById("reject-application-backdrop");
const rejectApplicationModal = document.getElementById("reject-application-modal");

// Admin order detail/status modal
const adminOrderBackdrop = document.getElementById("admin-order-backdrop");
const adminOrderModal = document.getElementById("admin-order-modal");
const adminOrderDetail = document.getElementById("admin-order-detail");
const adminOrderStatusForm = document.getElementById("admin-order-status-form");
const adminOrderStatusSelect = document.getElementById("admin-order-status-select");
const btnUpdateAdminOrderStatus = document.getElementById("btn-update-admin-order-status");

// ---------------------------------------------------------------------
// Authentication UI, Role Guards & History Router
// ---------------------------------------------------------------------
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");
const loginInfo = document.getElementById("login-info");
const btnLoginSubmit = document.getElementById("btn-login-submit");
const loginRoleHint = document.getElementById("login-role-hint");
const loginRoleTabs = document.querySelectorAll("[data-login-tab]");

const adminLoginForm = document.getElementById("admin-login-form");
const adminEmailInput = document.getElementById("admin-email");
const adminPasswordInput = document.getElementById("admin-password");
const adminLoginError = document.getElementById("admin-login-error");
const btnAdminLogin = document.getElementById("btn-admin-login");

const registerCustomerForm = document.getElementById("register-customer-form");
const registerOwnerForm = document.getElementById("register-owner-form");
const customerRegisterError = document.getElementById("customer-register-error");
const ownerRegisterError = document.getElementById("owner-register-error");
const registerTabs = document.querySelectorAll("[data-register-tab]");
const registerSuccess = document.getElementById("register-success");
const registerSuccessTitle = document.getElementById("register-success-title");
const registerSuccessMessage = document.getElementById("register-success-message");
const registerSuccessEmail = document.getElementById("register-success-email");
const registerAuthTabs = document.querySelector("#view-register .auth-tabs");
const btnRegisterCustomer = document.getElementById("btn-register-customer");
const btnRegisterOwner = document.getElementById("btn-register-owner");

const verifyIcon = document.getElementById("verify-icon");
const verifyTitle = document.getElementById("verify-title");
const verifyMessage = document.getElementById("verify-message");
const verifySpinner = document.getElementById("verify-spinner");
const otpForm = document.getElementById("otp-verify-form");
const otpEmail = document.getElementById("otp-email");
const otpCode = document.getElementById("otp-code");
const otpTimer = document.getElementById("otp-timer");
const otpError = document.getElementById("otp-error");
const otpInfo = document.getElementById("otp-info");
const btnVerifyOtp = document.getElementById("btn-verify-otp");
const verifyResendBlock = document.getElementById("verify-resend-block");
const resendForm = document.getElementById("resend-verification-form");
const resendEmail = document.getElementById("resend-email");
const resendError = document.getElementById("resend-error");
const resendInfo = document.getElementById("resend-info");
const btnResend = document.getElementById("btn-resend");

const ownerMapSearch = document.getElementById("owner-map-search");
const btnOwnerMapSearch = document.getElementById("btn-owner-map-search");
const btnOwnerMapLocate = document.getElementById("btn-owner-map-locate");
const ownerMapStatus = document.getElementById("owner-map-status");
const ownerLatInput = document.getElementById("owner-lat");
const ownerLngInput = document.getElementById("owner-lng");
const ownerCityInput = document.getElementById("own-city");
const ownerDistrictInput = document.getElementById("own-district");
const ownerStateInput = document.getElementById("own-state");
const ownerPincodeInput = document.getElementById("own-pincode");
const ownerAddressInput = document.getElementById("own-address");

let lastUnverifiedEmail = "";
let otpTimerId = null;
let otpExpiresAtTs = null;

const ROLE_LABELS = {
  customer: "Customer",
  kendra_owner: "Kendra Owner",
  admin: "Administrator",
};

const ORDER_STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  completed: "Delivered",
  cancelled: "Out of Order",
};

function orderStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || String(status || "").replace(/_/g, " ");
}

const ROUTE_PATHS = {
  search: "/",
  customer: "/account",
  kendra: "/kendra",
  admin: "/admin",
  login: "/login",
  register: "/register",
  "verify-email": "/verify-email",
  "admin-login": "/admin-login",
};

const PATH_VIEWS = Object.fromEntries(
  Object.entries(ROUTE_PATHS).map(([view, path]) => [path, view])
);

function setHidden(element, hidden) {
  if (element) element.hidden = Boolean(hidden);
}

function setFormMessage(element, message) {
  if (!element) return;
  element.textContent = message || "";
  element.hidden = !message;
}

const PASSWORD_POLICY = [
  { pattern: /[A-Z]/, label: "one uppercase letter" },
  { pattern: /[a-z]/, label: "one lowercase letter" },
  { pattern: /[0-9]/, label: "one number" },
  { pattern: /[^A-Za-z0-9\s]/, label: "one special character" },
];

function passwordPolicyError(password) {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  const missing = PASSWORD_POLICY.filter((rule) => !rule.pattern.test(password)).map(
    (rule) => rule.label
  );
  if (missing.length > 0) {
    return `Password must contain at least ${missing.join(", ")}.`;
  }
  return "";
}

function phoneValidationError(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (!digits) return "";
  if (!/^\d{10}$/.test(digits)) {
    return "Enter a valid 10-digit phone number (e.g. +91 98765 43210).";
  }
  return "";
}

function routeForView(viewName) {
  return ROUTE_PATHS[viewName] || "/";
}

function viewForPath(pathname) {
  const normalized = (pathname || "/").replace(/\/+$/, "") || "/";
  if (normalized === "/owner-login") return "login";
  return PATH_VIEWS[normalized] || "notfound";
}

/**
 * The public sign-in page hosts both account types. The Kendra Owner tab is a
 * visible entry point (header link, footer link and /owner-login URL) so owners
 * do not have to guess that the customer form also works for them.
 */
function setLoginRole(role) {
  loginRole = role === "owner" ? "owner" : "customer";
  const isOwner = loginRole === "owner";

  loginRoleTabs.forEach((tab) => {
    const active = tab.dataset.loginTab === loginRole;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  if (loginRoleHint) {
    loginRoleHint.textContent = isOwner
      ? "Kendra Owner sign-in: manage inventory, prices and incoming orders in the Kendra Portal."
      : "Customer sign-in: compare medicines, place orders and manage restock alerts.";
  }
  if (btnLoginSubmit) {
    btnLoginSubmit.textContent = isOwner ? "Sign In to Kendra Portal" : "Sign In";
  }
  if (loginEmail) {
    loginEmail.placeholder = isOwner ? "owner@example.com" : "you@example.com";
  }
  if (loginPassword) {
    loginPassword.placeholder = isOwner
      ? "Your Kendra owner password"
      : "Your account password";
  }
  if (loginForm) {
    loginForm.dataset.loginRole = loginRole;
  }
  setFormMessage(loginError, "");
  setFormMessage(loginInfo, "");
}

function updateRoleUI() {
  const role = currentUser ? currentUser.role : "guest";
  document.body.dataset.role = role;

  setHidden(authGuestControls, Boolean(currentUser));
  setHidden(userPill, !currentUser);
  setHidden(tabCustomer, !currentUser || role !== "customer");
  setHidden(tabKendra, role !== "kendra_owner");
  setHidden(tabAdmin, role !== "admin");
  setHidden(btnOpenCart, !currentUser || role !== "customer");

  if (currentUser) {
    userDisplayName.textContent = currentUser.name || "Account";
    userDisplayRole.textContent = ROLE_LABELS[role] || role;
    userDisplayRole.style.background =
      role === "admin" ? "#fae4df" : role === "kendra_owner" ? "#e6f6ee" : "#eaf1fb";
    userDisplayRole.style.color =
      role === "admin" ? "#a42c16" : role === "kendra_owner" ? "#167a52" : "#1c529e";
    tabSearchText.textContent = role === "customer" ? "Find Medicines" : "Medicine Catalog";
  } else {
    userDisplayName.textContent = "—";
    userDisplayRole.textContent = "Guest";
    tabSearchText.textContent = "Find Medicines";
  }

  if (alertCustomerName) alertCustomerName.value = currentUser?.name || "";
  if (alertCustomerEmail) alertCustomerEmail.value = currentUser?.email || "";
  if (alertCustomerPhone) alertCustomerPhone.value = currentUser?.phone || "";
  if (payDeliveryAddress) payDeliveryAddress.value = currentUser?.address || "";
}

function canAccessView(viewName) {
  if (
    ["search", "login", "register", "verify-email", "admin-login", "notfound"].includes(viewName)
  ) {
    return true;
  }
  if (!currentUser) return false;
  if (viewName === "admin") return currentUser.role === "admin";
  if (viewName === "kendra") return currentUser.role === "kendra_owner";
  if (viewName === "customer") return currentUser.role === "customer";
  return false;
}

function redirectAfterAuth(user) {
  const fallback =
    user.role === "admin" ? "/admin" : user.role === "kendra_owner" ? "/kendra" : "/account";
  const requested = pendingRedirect;
  pendingRedirect = null;

  if (requested && canAccessView(viewForPath(requested))) {
    navigate(requested, { replace: true });
    return;
  }
  navigate(fallback, { replace: true });
}

async function enterSession(user, message) {
  currentUser = user;
  updateRoleUI();
  if (message) showToast(message, user.role === "admin" ? "🛡️" : "✓");
  redirectAfterAuth(user);
}

function switchView(viewName, { updateUrl = false } = {}) {
  if (!canAccessView(viewName)) {
    renderRoute();
    return;
  }

  activeView = viewName;

  navTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === viewName);
  });
  viewPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `view-${viewName}`);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (viewName === "register") {
    if (registerSuccess && !registerSuccess.hidden) resetRegisterFeedback();
    syncRegisterTab("customer", { reset: false });
  }
  if (viewName === "verify-email") handleVerifyRoute();
  if (viewName === "customer") loadCustomerDashboard();
  if (viewName === "kendra") loadKendraDashboard();
  if (viewName === "admin") loadAdminDashboard();
  if (viewName === "login") loginEmail?.focus();
  if (viewName === "admin-login") adminEmailInput?.focus();

  if (updateUrl) navigate(routeForView(viewName));
}

function navigate(path, { replace = false } = {}) {
  const target = path || "/";
  if (replace) {
    window.history.replaceState({}, "", target);
  } else if (window.location.pathname !== target) {
    window.history.pushState({}, "", target);
  }
  renderRoute();
}

function renderRoute() {
  const path = window.location.pathname || "/";
  const viewName = viewForPath(path);

  if (!canAccessView(viewName)) {
    if (!currentUser) {
      pendingRedirect = path;
      showToast("Please sign in to continue.", "🔒");
      if (viewForPath(path) !== "login") {
        const intendedView = viewForPath(path);
        navigate("/login", { replace: true });
        if (intendedView === "kendra") setLoginRole("owner");
      } else {
        switchView("login");
      }
    } else {
      showToast("You do not have permission to open that portal.", "🔒");
      navigate("/", { replace: true });
    }
    return;
  }

  switchView(viewName);

  if (viewName === "login") {
    const normalized = path.replace(/\/+$/, "") || "/";
    setLoginRole(normalized === "/owner-login" ? "owner" : "customer");
    loginEmail?.focus();
  }
}

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => navigate(routeForView(tab.dataset.view)));
});

btnHeaderLogin?.addEventListener("click", () => navigate("/login"));
btnHeaderRegister?.addEventListener("click", () => navigate("/register"));
loginRoleTabs.forEach((tab) => {
  tab.addEventListener("click", () => setLoginRole(tab.dataset.loginTab));
});
btnLogout?.addEventListener("click", handleLogout);

window.addEventListener("popstate", renderRoute);

// ---------------------------------------------------------------------
// Sign In / Sign Out
// ---------------------------------------------------------------------
async function handleLogout() {
  try {
    await logoutUser();
  } catch {
    // The cookie is cleared server-side; ignore network errors on sign-out.
  }
  currentUser = null;
  pendingRedirect = null;
  updateRoleUI();
  navigate("/");
  showToast("You have been signed out.", "👋");
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage(loginError, "");
  setFormMessage(loginInfo, "");

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    setFormMessage(loginError, "Enter your email address and password.");
    return;
  }

  btnLoginSubmit.disabled = true;
  btnLoginSubmit.textContent = "Signing in…";

  try {
    const res = await loginUser(email, password);
    loginForm.reset();
    const firstName = (res.user.name || "").split(" ")[0];
    await enterSession(res.user, `Welcome back, ${firstName || "there"}!`);
  } catch (err) {
    if (err.code === "ADMIN_URL_REQUIRED") {
      setFormMessage(
        loginError,
        "Administrator accounts cannot sign in here. Use the dedicated administrator sign-in URL."
      );
    } else if (err.code === "EMAIL_NOT_VERIFIED") {
      lastUnverifiedEmail = email;
      setFormMessage(
        loginInfo,
        "Your email address is not verified yet. Opening the verification page so you can enter your OTP."
      );
      setTimeout(() => navigate("/verify-email"), 900);
    } else if (err.code === "KENDRA_REJECTED") {
      setFormMessage(
        loginError,
        "Your Kendra application was not approved. Please contact the PMBJP administrator."
      );
    } else {
      setFormMessage(loginError, err.message || "Sign-in failed. Please try again.");
    }
  } finally {
    btnLoginSubmit.disabled = false;
    btnLoginSubmit.textContent = loginRole === "owner" ? "Sign In to Kendra Portal" : "Sign In";
  }
});

adminLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage(adminLoginError, "");

  const email = adminEmailInput.value.trim();
  const password = adminPasswordInput.value;

  if (!email || !password) {
    setFormMessage(adminLoginError, "Enter the administrator email and password.");
    return;
  }

  btnAdminLogin.disabled = true;
  btnAdminLogin.textContent = "Authenticating…";

  try {
    const res = await adminLogin(email, password);
    adminLoginForm.reset();
    await enterSession(res.user, "Administrator signed in.");
  } catch (err) {
    setFormMessage(
      adminLoginError,
      err.message || "Invalid administrator credentials."
    );
  } finally {
    btnAdminLogin.disabled = false;
    btnAdminLogin.textContent = "Sign In as Administrator";
  }
});

// ---------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------
function syncRegisterTab(tabName, { reset = true } = {}) {
  registerTabs.forEach((tab) => {
    const isActive = tab.dataset.registerTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (registerCustomerForm) registerCustomerForm.hidden = tabName !== "customer";
  if (registerOwnerForm) registerOwnerForm.hidden = tabName !== "owner";

  if (reset) {
    setFormMessage(customerRegisterError, "");
    setFormMessage(ownerRegisterError, "");
  }

  if (tabName === "owner") {
    requestAnimationFrame(() => initOwnerMap());
  }
}

registerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setHidden(registerSuccess, true);
    setHidden(registerAuthTabs, false);
    registerCustomerForm?.classList.remove("is-hidden");
    registerOwnerForm?.classList.remove("is-hidden");
    syncRegisterTab(tab.dataset.registerTab);
  });
});

function resetRegisterFeedback() {
  setHidden(registerSuccess, true);
  setHidden(registerAuthTabs, false);
  setFormMessage(customerRegisterError, "");
  setFormMessage(ownerRegisterError, "");
}

function showRegisterSuccess({ title, message, email }) {
  if (registerCustomerForm) registerCustomerForm.hidden = true;
  if (registerOwnerForm) registerOwnerForm.hidden = true;
  setHidden(registerAuthTabs, true);
  setHidden(registerSuccess, false);

  registerSuccessTitle.textContent = title;
  registerSuccessMessage.textContent = message;
  registerSuccessEmail.textContent = email || "";
}

registerCustomerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage(customerRegisterError, "");

  const formData = new FormData(registerCustomerForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (!name) return setFormMessage(customerRegisterError, "Enter your full name.");
  if (!email) return setFormMessage(customerRegisterError, "Enter your email address.");
  const customerPasswordError = passwordPolicyError(password);
  if (customerPasswordError) {
    return setFormMessage(customerRegisterError, customerPasswordError);
  }
  if (password !== confirmPassword) {
    return setFormMessage(customerRegisterError, "The two passwords do not match.");
  }
  const customerPhoneError = phoneValidationError(phone);
  if (customerPhoneError) {
    return setFormMessage(customerRegisterError, customerPhoneError);
  }

  btnRegisterCustomer.disabled = true;
  btnRegisterCustomer.textContent = "Creating account…";

  try {
    const res = await registerCustomer({ name, email, password, phone, address });
    lastUnverifiedEmail = email;
    otpExpiresAtTs = Date.now() + (Number(res.otpExpiresInMinutes) || 10) * 60 * 1000;
    registerCustomerForm.reset();
    showRegisterSuccess({
      title: "Customer account created",
      message:
        res.message ||
        "We emailed you a 6-digit OTP. Enter it on the verification page before signing in.",
      email,
    });
    showToast("Registration saved. Please verify your email with the OTP.", "✉️");
  } catch (err) {
    const detail =
      Array.isArray(err.details) && err.details.length
        ? `${err.message}: ${err.details.join("; ")}`
        : err.message;
    setFormMessage(customerRegisterError, detail || "Registration failed.");
    if (err.code === "EMAIL_EXISTS_UNVERIFIED") {
      lastUnverifiedEmail = email;
      otpExpiresAtTs = Date.now() + (Number(err.body?.otpExpiresInMinutes) || 10) * 60 * 1000;
    }
  } finally {
    btnRegisterCustomer.disabled = false;
    btnRegisterCustomer.textContent = "Create Customer Account";
  }
});

registerOwnerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage(ownerRegisterError, "");

  // Enter inside an earlier step acts as "Continue" instead of submitting.
  if (ownerStep < OWNER_STEP_COUNT) {
    if (validateOwnerStep(ownerStep)) showOwnerStep(ownerStep + 1);
    return;
  }

  const formData = new FormData(registerOwnerForm);
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const ownerPasswordError = passwordPolicyError(password);
  if (ownerPasswordError) {
    return setFormMessage(ownerRegisterError, ownerPasswordError);
  }
  if (password !== confirmPassword) {
    return setFormMessage(ownerRegisterError, "The two passwords do not match.");
  }

  const lat = parseFloat(formData.get("lat"));
  const lng = parseFloat(formData.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return setFormMessage(
      ownerRegisterError,
      "Choose the shop location on the map (or enter latitude and longitude)."
    );
  }

  const payload = {
    kendraName: String(formData.get("kendraName") || "").trim(),
    ownerName: String(formData.get("ownerName") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    password,
    phone: String(formData.get("phone") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    district: String(formData.get("district") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    pincode: String(formData.get("pincode") || "").trim(),
    licenseNumber: String(formData.get("licenseNumber") || "").trim(),
    operatingHours: String(formData.get("operatingHours") || "").trim(),
    lat,
    lng,
  };

  const requiredFields = [
    ["kendraName", "Kendra / shop name"],
    ["ownerName", "Owner / pharmacist name"],
    ["email", "Email address"],
    ["phone", "Counter phone"],
    ["address", "Shop address"],
    ["city", "City"],
    ["state", "State"],
    ["licenseNumber", "Drug license number"],
  ];
  const missing = requiredFields.filter(([key]) => !payload[key]);
  if (missing.length) {
    return setFormMessage(
      ownerRegisterError,
      `Please fill in: ${missing.map(([, label]) => label).join(", ")}.`
    );
  }
  const ownerPhoneError = phoneValidationError(payload.phone);
  if (ownerPhoneError) {
    return setFormMessage(ownerRegisterError, ownerPhoneError);
  }

  btnRegisterOwner.disabled = true;
  btnRegisterOwner.textContent = "Submitting application…";

  try {
    const res = await registerKendraOwner(payload);
    lastUnverifiedEmail = payload.email;
    otpExpiresAtTs = Date.now() + (Number(res.otpExpiresInMinutes) || 10) * 60 * 1000;
    registerOwnerForm.reset();
    showOwnerStep(1);
    if (ownerMarker && ownerMap) {
      ownerMap.removeLayer(ownerMarker);
      ownerMarker = null;
    }
    showRegisterSuccess({
      title: "Kendra registration submitted",
      message:
        res.message ||
        "We emailed you a 6-digit OTP. Verify it so the PMBJP administrator can review your shop.",
      email: payload.email,
    });
    showToast("Kendra application saved. Please verify your email with the OTP.", "✉️");
  } catch (err) {
    const detail =
      Array.isArray(err.details) && err.details.length
        ? `${err.message}: ${err.details.join("; ")}`
        : err.message;
    setFormMessage(ownerRegisterError, detail || "Kendra registration failed.");
  } finally {
    btnRegisterOwner.disabled = false;
    btnRegisterOwner.textContent = "Submit Kendra Registration";
  }
});

// ---------------------------------------------------------------------
// Kendra registration — 3-step wizard (same page)
// ---------------------------------------------------------------------
const OWNER_STEP_COUNT = 3;
let ownerStep = 1;
const ownerStepPanels = document.querySelectorAll("[data-owner-step]");
const ownerProgressSteps = document.querySelectorAll("[data-owner-progress]");
const ownerProgressFill = document.getElementById("owner-progress-fill");
const btnOwnerStepNext = document.getElementById("btn-owner-step-next");
const btnOwnerStepBack = document.getElementById("btn-owner-step-back");

function showOwnerStep(step) {
  ownerStep = Math.min(OWNER_STEP_COUNT, Math.max(1, step));

  ownerStepPanels.forEach((panel) => {
    panel.hidden = Number(panel.dataset.ownerStep) !== ownerStep;
  });
  ownerProgressSteps.forEach((indicator) => {
    const index = Number(indicator.dataset.ownerProgress);
    indicator.classList.toggle("is-active", index === ownerStep);
    indicator.classList.toggle("is-complete", index < ownerStep);
  });
  if (ownerProgressFill) {
    ownerProgressFill.style.width = `${(ownerStep / OWNER_STEP_COUNT) * 100}%`;
  }
  if (btnOwnerStepBack) btnOwnerStepBack.hidden = ownerStep === 1;
  if (btnOwnerStepNext) btnOwnerStepNext.hidden = ownerStep === OWNER_STEP_COUNT;
  if (btnRegisterOwner) btnRegisterOwner.hidden = ownerStep !== OWNER_STEP_COUNT;

  if (ownerStep === OWNER_STEP_COUNT) {
    requestAnimationFrame(() => initOwnerMap());
  }
}

function validateOwnerStep(step) {
  const panel = document.querySelector(`[data-owner-step="${step}"]`);
  if (!panel) return true;

  const fields = panel.querySelectorAll("input[required]");
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  if (step === 1) {
    const formData = new FormData(registerOwnerForm);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const passwordError = passwordPolicyError(password);
    if (passwordError) {
      setFormMessage(ownerRegisterError, passwordError);
      return false;
    }
    if (password !== confirmPassword) {
      setFormMessage(ownerRegisterError, "The two passwords do not match.");
      return false;
    }
  }

  return true;
}

btnOwnerStepNext?.addEventListener("click", () => {
  setFormMessage(ownerRegisterError, "");
  if (!validateOwnerStep(ownerStep)) return;
  showOwnerStep(ownerStep + 1);
});

btnOwnerStepBack?.addEventListener("click", () => {
  setFormMessage(ownerRegisterError, "");
  showOwnerStep(ownerStep - 1);
});

showOwnerStep(1);

// ---------------------------------------------------------------------
// Email Verification
// ---------------------------------------------------------------------
function stopOtpTimer() {
  if (otpTimerId) {
    clearInterval(otpTimerId);
    otpTimerId = null;
  }
  setHidden(otpTimer, true);
}

function startOtpTimer(remainingMs) {
  stopOtpTimer();
  if (!otpTimer) return;
  otpExpiresAtTs = Date.now() + Math.max(0, Number(remainingMs) || 0);

  const tick = () => {
    const remaining = Math.max(0, otpExpiresAtTs - Date.now());
    const minutes = String(Math.floor(remaining / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
    otpTimer.textContent =
      remaining > 0
        ? `OTP valid for ${minutes}:${seconds}`
        : "This OTP has expired. Request a new one below.";
    if (remaining <= 0) {
      if (otpTimerId) clearInterval(otpTimerId);
      otpTimerId = null;
    }
  };

  setHidden(otpTimer, false);
  tick();
  otpTimerId = setInterval(tick, 1000);
}

async function handleVerifyRoute() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || lastUnverifiedEmail;

  if (otpEmail && !otpEmail.value && email) otpEmail.value = email;
  if (resendEmail && !resendEmail.value && email) resendEmail.value = email;

  setFormMessage(otpError, "");
  setFormMessage(otpInfo, "");
  setFormMessage(resendError, "");
  setFormMessage(resendInfo, "");
  setHidden(verifySpinner, true);
  setHidden(otpForm, false);
  setHidden(verifyResendBlock, false);

  verifyIcon.textContent = "✉️";
  verifyTitle.textContent = "Enter your verification OTP";
  verifyMessage.textContent = email
    ? `We emailed a 6-digit OTP to ${email}. Enter it below to activate your account.`
    : "Enter the email address you registered with and the 6-digit OTP we emailed you.";

  if (otpExpiresAtTs && otpExpiresAtTs > Date.now()) {
    startOtpTimer(otpExpiresAtTs - Date.now());
  } else {
    stopOtpTimer();
  }

  if (otpCode) otpCode.focus();
}

otpForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage(otpError, "");
  setFormMessage(otpInfo, "");

  const email = otpEmail.value.trim().toLowerCase();
  const otp = otpCode.value.replace(/\D/g, "");

  if (!email) {
    return setFormMessage(otpError, "Enter the email address you registered with.");
  }
  if (otp.length !== 6) {
    return setFormMessage(otpError, "Enter the 6-digit OTP from your email.");
  }

  btnVerifyOtp.disabled = true;
  btnVerifyOtp.textContent = "Verifying…";

  try {
    const res = await verifyEmail(email, otp);
    lastUnverifiedEmail = email;
    stopOtpTimer();
    otpExpiresAtTs = null;
    otpForm.reset();
    setHidden(otpForm, true);
    setHidden(verifyResendBlock, true);
    verifyIcon.textContent = "✓";
    verifyTitle.textContent = "Email verified";
    verifyMessage.textContent = res.message || "Your email address has been verified.";
    showToast("Email verified. You can sign in now.", "✓");
  } catch (err) {
    setFormMessage(otpError, err.message || "Could not verify this OTP.");
    if (err.code === "OTP_EXPIRED" || err.code === "OTP_LOCKED") stopOtpTimer();
  } finally {
    btnVerifyOtp.disabled = false;
    btnVerifyOtp.textContent = "Verify OTP";
  }
});

resendForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage(resendError, "");
  setFormMessage(resendInfo, "");

  const email = resendEmail.value.trim();
  if (!email) {
    setFormMessage(resendError, "Enter the email address you registered with.");
    return;
  }

  btnResend.disabled = true;
  btnResend.textContent = "Sending…";

  try {
    const res = await resendVerification(email);
    lastUnverifiedEmail = email;
    if (otpEmail && !otpEmail.value) otpEmail.value = email;
    setFormMessage(resendInfo, res.message || "A new 6-digit OTP has been sent.");
    if (res.otpExpiresInMinutes) {
      startOtpTimer(Number(res.otpExpiresInMinutes) * 60 * 1000);
    }
  } catch (err) {
    setFormMessage(resendError, err.message || "Could not send a new OTP.");
  } finally {
    btnResend.disabled = false;
    btnResend.textContent = "Send a new OTP";
  }
});

// ---------------------------------------------------------------------
// Owner shop-location map (Leaflet + OpenStreetMap)
// ---------------------------------------------------------------------
const INDIA_CENTER = [22.9734, 78.6569];

function setOwnerMapStatus(message, tone = "info") {
  if (!ownerMapStatus) return;
  ownerMapStatus.textContent = message;
  ownerMapStatus.dataset.tone = tone;
}

function applyOwnerAddressDetails(address = {}, displayName = "") {
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.suburb ||
    address.hamlet ||
    "";
  const district = address.state_district || address.county || address.city_district || "";
  const state = address.state || "";
  const pincode = address.postcode || "";

  if (city) ownerCityInput.value = city;
  if (district) ownerDistrictInput.value = district;
  if (state) ownerStateInput.value = state;
  if (pincode) ownerPincodeInput.value = pincode;

  if (displayName) setOwnerMapStatus(`Pin set at ${displayName}`);
}

async function reverseGeocodeOwnerPin(lat, lng) {
  setOwnerMapStatus("Looking up the address for this pin…");
  try {
    const url =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1" +
      `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&accept-language=en`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
    const data = await res.json();
    applyOwnerAddressDetails(data.address || {}, data.display_name || "");
    if (!data.display_name) {
      setOwnerMapStatus(`Pin set at ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  } catch {
    setOwnerMapStatus(
      "Pin set. Address lookup is unavailable — enter city, state and pincode manually.",
      "warn"
    );
  }
}

function setOwnerCoords(lat, lng, { pan = true, reverse = true } = {}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  ownerLatInput.value = lat.toFixed(6);
  ownerLngInput.value = lng.toFixed(6);

  if (ownerMap && window.L) {
    if (!ownerMarker) {
      ownerMarker = window.L.marker([lat, lng], { draggable: true }).addTo(ownerMap);
      ownerMarker.on("dragend", () => {
        const position = ownerMarker.getLatLng();
        setOwnerCoords(position.lat, position.lng, { pan: false });
      });
    } else {
      ownerMarker.setLatLng([lat, lng]);
    }
    if (pan) ownerMap.setView([lat, lng], Math.max(ownerMap.getZoom(), 15));
  }

  if (reverse) reverseGeocodeOwnerPin(lat, lng);
}

async function searchOwnerLocation(query) {
  const term = String(query || "").trim();
  if (!term) {
    setOwnerMapStatus("Type an address, locality, city or pincode to search.", "warn");
    return;
  }

  btnOwnerMapSearch.disabled = true;
  setOwnerMapStatus(`Searching for “${term}”…`);

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1" +
      `&q=${encodeURIComponent(term)}&accept-language=en`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      setOwnerMapStatus("No matching location found. Try a landmark, city or pincode.", "warn");
      return;
    }

    const hit = results[0];
    const lat = parseFloat(hit.lat);
    const lng = parseFloat(hit.lon);
    setOwnerCoords(lat, lng, { pan: true, reverse: false });
    applyOwnerAddressDetails(hit.address || {}, hit.display_name || `${lat}, ${lng}`);
  } catch {
    setOwnerMapStatus(
      "Location search is unavailable right now. Click the map or enter coordinates manually.",
      "warn"
    );
  } finally {
    btnOwnerMapSearch.disabled = false;
  }
}

function initOwnerMap() {
  const container = document.getElementById("owner-map");
  if (!container) return;

  if (ownerMapInitialized) {
    ownerMap?.invalidateSize();
    return;
  }

  if (!window.L) {
    container.classList.add("map-picker__canvas--fallback");
    container.innerHTML =
      '<p>The map library could not be loaded (check your internet connection).<br />' +
      "You can still enter the shop latitude and longitude manually below.</p>";
    setOwnerMapStatus("Map unavailable — enter latitude and longitude manually.", "warn");
    return;
  }

  ownerMapInitialized = true;

  ownerMap = window.L.map(container, {
    center: INDIA_CENTER,
    zoom: 4,
    scrollWheelZoom: true,
  });

  window.L
    .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    })
    .addTo(ownerMap);

  ownerMap.on("click", (event) => {
    setOwnerCoords(event.latlng.lat, event.latlng.lng, { pan: false });
  });

  const existingLat = parseFloat(ownerLatInput.value);
  const existingLng = parseFloat(ownerLngInput.value);
  if (Number.isFinite(existingLat) && Number.isFinite(existingLng)) {
    setOwnerCoords(existingLat, existingLng, { pan: true, reverse: false });
  }

  requestAnimationFrame(() => ownerMap?.invalidateSize());
  window.setTimeout(() => ownerMap?.invalidateSize(), 300);
}

btnOwnerMapSearch?.addEventListener("click", () => searchOwnerLocation(ownerMapSearch.value));

ownerMapSearch?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchOwnerLocation(ownerMapSearch.value);
  }
});

btnOwnerMapLocate?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setOwnerMapStatus("Geolocation is not supported by this browser.", "warn");
    return;
  }
  setOwnerMapStatus("Requesting your device location…");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setOwnerCoords(position.coords.latitude, position.coords.longitude, { pan: true });
    },
    () => setOwnerMapStatus("Could not access your location. Click the map instead.", "warn"),
    { timeout: 8000 }
  );
});

function syncOwnerCoordsFromInputs() {
  const lat = parseFloat(ownerLatInput.value);
  const lng = parseFloat(ownerLngInput.value);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    setOwnerMapStatus("Latitude must be −90…90 and longitude −180…180.", "warn");
    return;
  }
  setOwnerCoords(lat, lng, { pan: true });
}

ownerLatInput?.addEventListener("change", syncOwnerCoordsFromInputs);
ownerLngInput?.addEventListener("change", syncOwnerCoordsFromInputs);

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
// Auth guards for customer-only actions
// ---------------------------------------------------------------------
function requireCustomer(actionLabel = "continue") {
  if (!currentUser) {
    pendingRedirect = window.location.pathname || "/";
    showToast(`Please sign in to ${actionLabel}.`, "🔒");
    navigate("/login");
    return false;
  }
  if (currentUser.role !== "customer") {
    showToast("This action is available to customer accounts only.", "🔒");
    return false;
  }
  return true;
}

async function ensureStoresLoaded() {
  if (allStoresCache.length === 0) {
    try {
      const stores = await getAllStores();
      allStoresCache = Array.isArray(stores) ? stores : [];
    } catch {
      allStoresCache = [];
    }
  }
  return allStoresCache;
}

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
  if (!requireCustomer("add medicines to your cart")) return;

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
  currentCartQuote = null;
  if (cartDrawer.classList.contains("is-open")) {
    renderCartDrawer(true);
    refreshCartQuote();
  }
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
  currentCartQuote = null;
  renderCartDrawer();
}

function removeFromCart(medicineId) {
  cart = cart.filter((i) => i.medicineId !== medicineId);
  saveCartToStorage();
  currentCartQuote = null;
  renderCartDrawer();
}

async function openCartDrawer() {
  if (!requireCustomer("open your cart")) return;

  cartDrawer.classList.add("is-open");
  cartDrawerBackdrop.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  // Render the basket first without a quote; the quote starts after the Kendra
  // options are populated so the selected store is sent with the request.
  renderCartDrawer(true);

  // Populate Kendra fulfilers from the database.
  try {
    if (allStoresCache.length === 0) {
      const stores = await getAllStores();
      allStoresCache = Array.isArray(stores) ? stores : [];
    }

    if (allStoresCache.length > 0) {
      const previous = cartKendraSelect.value;
      cartKendraSelect.innerHTML = allStoresCache
        .map(
          (store) =>
            `<option value="${esc(store.id || store.kendraCode)}">${esc(store.name)} (${esc(
              store.city
            )})</option>`
        )
        .join("");
      if (previous && allStoresCache.some((s) => (s.id || s.kendraCode) === previous)) {
        cartKendraSelect.value = previous;
      }
    } else {
      cartKendraSelect.innerHTML = `<option value="">No active Kendras available</option>`;
    }
  } catch {
    cartKendraSelect.innerHTML = `<option value="">Unable to load Kendra list</option>`;
  }

  refreshCartQuote();
}

async function refreshCartQuote() {
  const requestId = ++cartQuoteRequestId;

  if (!cart.length) {
    currentCartQuote = null;
    if (cartPriceNote) {
      cartPriceNote.textContent = "Choose a Kendra to see live stock and the price for this cart.";
      cartPriceNote.classList.remove("cart-price-note--warn");
    }
    if (cartBestPriceRow) cartBestPriceRow.hidden = true;
    if (btnProceedPayment) btnProceedPayment.disabled = false;
    return;
  }

  if (btnProceedPayment) {
    btnProceedPayment.disabled = true;
    btnProceedPayment.textContent = "Checking live Kendra stock…";
  }

  try {
    const res = await quoteOrder({
      kendraCode: cartKendraSelect.value || undefined,
      items: cart.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      })),
    });
    // Ignore a slow response from an older selection.
    if (requestId !== cartQuoteRequestId) return;
    currentCartQuote = res;

    if (res.selected?.kendraCode && !cartKendraSelect.value) {
      cartKendraSelect.value = res.selected.kendraCode;
    }
    renderCartQuoteSummary();
  } catch (err) {
    if (requestId !== cartQuoteRequestId) return;
    currentCartQuote = null;
    if (cartPriceNote) {
      cartPriceNote.textContent = err.message;
      cartPriceNote.classList.add("cart-price-note--warn");
    }
    if (cartBestPriceRow) cartBestPriceRow.hidden = true;
    if (btnProceedPayment) btnProceedPayment.disabled = true;
  } finally {
    if (requestId === cartQuoteRequestId && btnProceedPayment) {
      btnProceedPayment.textContent = "Proceed to Instant Checkout & Pay";
    }
  }
}

function renderCartQuoteSummary() {
  const selected = currentCartQuote?.selected;
  const best = currentCartQuote?.best;

  if (!selected) {
    if (cartPriceNote) {
      cartPriceNote.textContent = "Choose a Kendra to see live stock and the price for this cart.";
    }
    return;
  }

  if (cartTotalPrice) {
    cartTotalPrice.textContent = `₹${Number(selected.totalAmount || 0).toFixed(2)}`;
  }
  if (cartPriceNote) {
    cartPriceNote.textContent = selected.canFulfill
      ? `Selected: ${selected.kendraName} · every item is in stock at this Kendra.`
      : `${selected.kendraName} cannot fulfil every item in this cart. Switch to another Kendra or reduce quantities.`;
    cartPriceNote.classList.toggle("cart-price-note--warn", !selected.canFulfill);
  }
  if (btnProceedPayment) {
    btnProceedPayment.disabled = !selected.canFulfill;
  }

  if (
    best &&
    best.canFulfill &&
    best.kendraCode &&
    best.kendraCode !== selected.kendraCode &&
    best.totalAmount < selected.totalAmount
  ) {
    if (cartBestPriceRow) cartBestPriceRow.hidden = false;
    if (cartBestPriceText) {
      cartBestPriceText.textContent = `Best price for this cart: ₹${Number(
        best.totalAmount
      ).toFixed(2)} at ${best.kendraName}.`;
    }
  } else if (cartBestPriceRow) {
    cartBestPriceRow.hidden = true;
  }

  // Re-render line items with the selected Kendra's prices.
  renderCartDrawer(true);
}

cartKendraSelect?.addEventListener("change", () => {
  currentCartQuote = null;
  refreshCartQuote();
});

btnUseBestKendra?.addEventListener("click", () => {
  const best = currentCartQuote?.best;
  if (!best) return;
  cartKendraSelect.value = best.kendraCode;
  currentCartQuote = null;
  refreshCartQuote();
  showToast(`Switched to ${best.kendraName} — the best price for this cart.`, "✓");
});

function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  cartDrawerBackdrop.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

btnOpenCart.addEventListener("click", openCartDrawer);
cartDrawerClose.addEventListener("click", closeCartDrawer);
cartDrawerBackdrop.addEventListener("click", closeCartDrawer);

function renderCartDrawer(skipQuote = false) {
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
    cartQuoteRequestId += 1;
    currentCartQuote = null;
    if (cartPriceNote) {
      cartPriceNote.textContent = "Choose a Kendra to see live stock and the price for this cart.";
      cartPriceNote.classList.remove("cart-price-note--warn");
    }
    if (cartBestPriceRow) cartBestPriceRow.hidden = true;
    if (btnProceedPayment) btnProceedPayment.disabled = false;
    return;
  }

  cartFooter.hidden = false;
  let total = 0;
  let totalSavings = 0;

  cartItemsBody.innerHTML = cart
    .map((item) => {
      const quoted = currentCartQuote?.selected?.items?.find(
        (quoteItem) => quoteItem.medicineId === item.medicineId
      );
      const unitPrice = Number(quoted?.unitPrice ?? item.genericMrp);
      const itemSubtotal = unitPrice * item.quantity;
      const itemSavings = (item.cheapestBrandedMrp - unitPrice) * item.quantity;
      total += itemSubtotal;
      totalSavings += Math.max(0, itemSavings);

      return `
      <div class="cart-item">
        <div class="cart-item__info">
          <div class="cart-item__title">${esc(item.genericName)}</div>
          <div class="cart-item__meta">${esc(item.packSize)} · ₹${unitPrice.toFixed(2)}/pack${
            quoted && quoted.available === false ? " · out of stock here" : ""
          }</div>
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

  const quotedTotal = currentCartQuote?.selected?.totalAmount;
  cartTotalPrice.textContent = `₹${Number(quotedTotal ?? total).toFixed(2)}`;
  cartSavingsText.textContent = `Estimated savings vs branded: ₹${totalSavings.toFixed(2)}`;

  if (!skipQuote) refreshCartQuote();
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
  if (!requireCustomer("place an order")) return;
  if (cart.length === 0) return;

  const selectedQuote = currentCartQuote?.selected;
  if (selectedQuote && !selectedQuote.canFulfill) {
    showToast(
      `${selectedQuote.kendraName} cannot fulfil the full cart. Switch Kendra or reduce quantities.`,
      "⚠️"
    );
    return;
  }

  const kendraId =
    selectedQuote?.kendraCode ||
    cartKendraSelect.value ||
    allStoresCache[0]?.id ||
    allStoresCache[0]?.kendraCode ||
    "";
  const kendraName =
    selectedQuote?.kendraName ||
    cartKendraSelect.options[cartKendraSelect.selectedIndex]?.text ||
    "Jan Aushadhi Kendra";

  if (!kendraId) {
    showToast("No active Jan Aushadhi Kendra is available to fulfil this order.", "⚠️");
    return;
  }

  const items = cart.map((item) => {
    const quoteItem = selectedQuote?.items?.find(
      (entry) => entry.medicineId === item.medicineId
    );
    return {
      medicineId: item.medicineId,
      genericName: item.genericName,
      packSize: item.packSize,
      genericMrp: quoteItem?.unitPrice ?? item.genericMrp,
      quantity: item.quantity,
    };
  });
  const totalAmount =
    selectedQuote?.totalAmount ??
    items.reduce((sum, item) => sum + item.genericMrp * item.quantity, 0);

  closeCartDrawer();
  openPaymentSimulationModal({
    kendraId,
    kendraName,
    items,
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
  if (!requireCustomer("place an order")) return;

  checkoutOrderData = orderPayload;

  posCustomerName.textContent = currentUser.name;
  posKendraName.textContent = orderPayload.kendraName;
  posTotalAmount.textContent = `₹${orderPayload.totalAmount.toFixed(2)}`;
  payDeliveryAddress.value =
    currentUser.address || "Counter Pickup at Jan Aushadhi Kendra";

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
        currentCartQuote = null;
        cartQuoteRequestId += 1;
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
  navigate("/account");
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
document.getElementById("brand-logo-btn")?.addEventListener("click", () => navigate("/"));

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
      const target = document.getElementById("search-results-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}

if (btnHeaderLocate) {
  btnHeaderLocate.addEventListener("click", () => {
    openKendraListDrawer();
  });
}

document.querySelectorAll(".quick-tag").forEach((btn) => {
  btn.addEventListener("click", () => {
    searchInput.value = btn.dataset.term;
    handleSearch(btn.dataset.term);
  });
});

// Card button delegation
resultsGrid.addEventListener("click", async (e) => {
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
    if (!requireCustomer("place an order")) return;
    const stores = await ensureStoresLoaded();
    const store = stores[0];
    if (!store) {
      showToast("No active Jan Aushadhi Kendra is available right now.", "⚠️");
      return;
    }
    openPaymentSimulationModal({
      kendraId: store.id || store.kendraCode,
      kendraName: store.name,
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
  const isLowStock = isStocked && (store.isLowStock || store.stockStatus === "Low Stock");
  const price = Number(store.price ?? store.medicineInfo?.price ?? store.medicineInfo?.genericMrp);
  const priceLabel = Number.isFinite(price) ? `₹${price.toFixed(2)} / pack` : "Price on request";

  const stockBadge = isStocked
    ? `<span class="stock-badge ${isLowStock ? "stock-badge--low" : "stock-badge--in"}">
         ${isLowStock ? "⚠ Low Stock" : icon.check} ${isLowStock ? "" : "In Stock"} (${store.unitsAvailable ?? "Available"} units)
       </span>`
    : `<span class="stock-badge stock-badge--out">
         ${icon.cross} Out of Stock
       </span>`;

  const distanceBadge =
    typeof store.distanceKm === "number"
      ? `<span class="store-item__distance">${store.distanceKm} km away</span>`
      : `<span class="store-item__distance">${esc(store.city)}</span>`;

  const bestPriceBadge = store.isBestPrice
    ? `<span class="best-price-badge">★ Best price</span>`
    : "";

  const orderOrAlertBtn = isStocked
    ? `<button type="button" class="store-link store-link--order" data-action="order-from-store" data-kendra-id="${esc(store.id)}" data-kendra-name="${esc(store.name)}" data-kendra-price="${Number.isFinite(price) ? price : ""}">
         ${icon.bolt} Buy Here at ${priceLabel}
       </button>`
    : `<button type="button" class="store-link store-link--alert" data-action="alert-for-store" data-kendra-id="${esc(store.id)}" data-kendra-name="${esc(store.name)}">
         ${icon.bell} Notify When Restocked
       </button>`;

  return `
    <li class="store-item ${isStocked ? "store-item--stocked" : "store-item--unstocked"} ${store.isBestPrice ? "store-item--best" : ""}">
      <div class="store-item__header">
        <div class="store-item__title-group">
          <span class="store-item__code">${esc(store.kendraCode || store.id)}</span>
          <h5 class="store-item__name">${esc(store.name)}</h5>
        </div>
        ${distanceBadge}
      </div>

      <p class="store-item__address">${esc(store.address)}</p>

      <div class="store-item__price-row">
        <span class="store-item__price">${priceLabel}</span>
        ${bestPriceBadge}
      </div>

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

function kendraOnlyItemHTML(store) {
  const distanceBadge =
    typeof store.distanceKm === "number"
      ? `<span class="store-item__distance">${store.distanceKm} km away</span>`
      : `<span class="store-item__distance">${esc(store.city)}</span>`;

  return `
    <li class="store-item">
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
      </div>

      <div class="store-item__actions">
        ${store.directionsUrl ? `<a href="${esc(store.directionsUrl)}" target="_blank" rel="noopener noreferrer" class="store-link store-link--nav">${icon.navArrow} Directions</a>` : ""}
        ${store.phone ? `<a href="tel:${esc(store.phone)}" class="store-link store-link--call">${icon.phone} Call</a>` : ""}
      </div>
    </li>
  `;
}

function renderDrawerBody({ loading, kendras, error, kendraOnly = false }) {
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
        <p class="text-subtle">${
          kendraOnly
            ? "Try selecting a different region."
            : 'Try unchecking "Show In-Stock Only" or selecting a different region.'
        }</p>
      </div>`;
    return;
  }

  if (kendraOnly) {
    drawerBody.innerHTML = `<ul class="drawer__list">${kendras
      .map(kendraOnlyItemHTML)
      .join("")}</ul>`;
    return;
  }

  const best =
    kendras.find((store) => store.isBestPrice && store.inStock) ||
    kendras.find((store) => store.inStock) ||
    null;
  const bestSummary = best
    ? `<div class="drawer-best-price">
         <div>
           <span class="drawer-best-price__label">Best available price</span>
           <div class="drawer-best-price__value">
             ₹${Number(best.price ?? currentDrawerMedicine?.genericMrp ?? 0).toFixed(2)}
             <span class="drawer-best-price__kendra">at ${esc(best.name)}</span>
           </div>
         </div>
         <span class="drawer-best-price__hint">Switch to any Kendra below — stock and price update live from MongoDB.</span>
       </div>`
    : `<div class="drawer-best-price drawer-best-price--empty">
         <span>No Kendra currently has this medicine in stock. Subscribe below for a restock alert.</span>
       </div>`;

  drawerBody.innerHTML = `${bestSummary}<ul class="drawer__list">${kendras
    .map(storeItemHTML)
    .join("")}</ul>`;
}

async function fetchKendrasForDrawer() {
  renderDrawerBody({ loading: true, kendras: [] });
  const inStockOnly = stockOnlyCheckbox.checked;
  const city = cityFilterSelect.value;
  const lat = userCoords ? userCoords.lat : null;
  const lng = userCoords ? userCoords.lng : null;

  if (!currentDrawerMedicine) {
    try {
      let kendras = await getNearbyStores(lat, lng, 100);
      if (city) {
        const needle = city.trim().toLowerCase();
        kendras = (kendras || []).filter(
          (kendra) =>
            String(kendra.city || "").toLowerCase() === needle ||
            String(kendra.district || "").toLowerCase() === needle
        );
      }
      renderDrawerBody({ loading: false, kendras, kendraOnly: true });
    } catch (err) {
      renderDrawerBody({ loading: false, kendras: [], error: err.message, kendraOnly: true });
    }
    return;
  }

  const medicineId = currentDrawerMedicine.id || currentDrawerMedicine._id;

  try {
    if (drawerShowAllKendras) {
      // Every active Kendra, nearest first, with this medicine's live stock
      // merged in so the region and in-stock filters keep working.
      const [allKendras, stockedKendras] = await Promise.all([
        getNearbyStores(lat, lng, 100),
        getKendrasForMedicine(medicineId, { lat, lng, inStockOnly: false, limit: 100 }),
      ]);
      const stockedByCode = new Map(
        (stockedKendras.kendras || []).map((kendra) => [kendra.kendraCode, kendra])
      );
      let kendras = (allKendras || []).map((kendra) => {
        const stocked = stockedByCode.get(kendra.kendraCode);
        return stocked || { ...kendra, inStock: false, unitsAvailable: 0 };
      });
      if (city) {
        const needle = city.trim().toLowerCase();
        kendras = kendras.filter(
          (kendra) =>
            String(kendra.city || "").toLowerCase() === needle ||
            String(kendra.district || "").toLowerCase() === needle
        );
      }
      if (inStockOnly) {
        kendras = kendras.filter((kendra) => kendra.inStock === true);
      }
      renderDrawerBody({ loading: false, kendras });
      return;
    }

    const res = await getKendrasForMedicine(medicineId, {
      lat,
      lng,
      inStockOnly,
      city,
      limit: 50,
    });
    renderDrawerBody({ loading: false, kendras: res.kendras || [] });
  } catch (err) {
    renderDrawerBody({ loading: false, kendras: [], error: err.message });
  }
}

function openDrawer(medicine) {
  currentDrawerMedicine = medicine;
  drawerShowAllKendras = false;
  drawerMedBanner.hidden = false;
  const stockToggle = stockOnlyCheckbox.closest(".drawer__stock-toggle");
  if (stockToggle) stockToggle.hidden = false;
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

function openKendraListDrawer() {
  currentDrawerMedicine = null;
  drawerShowAllKendras = true;
  drawerTitle.textContent = "Jan Aushadhi Kendras";
  drawerMedBanner.innerHTML = "";
  drawerMedBanner.hidden = true;
  const stockToggle = stockOnlyCheckbox.closest(".drawer__stock-toggle");
  if (stockToggle) stockToggle.hidden = true;

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
      drawerShowAllKendras = true;
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
    if (!requireCustomer("place an order")) return;
    const kendraId = orderStoreBtn.dataset.kendraId;
    const kendraName = orderStoreBtn.dataset.kendraName;
    const kendraPrice =
      parseFloat(orderStoreBtn.dataset.kendraPrice) || currentDrawerMedicine.genericMrp;
    closeDrawer();
    openPaymentSimulationModal({
      kendraId,
      kendraName,
      items: [
        {
          medicineId: currentDrawerMedicine.id || currentDrawerMedicine._id,
          genericName: currentDrawerMedicine.genericName,
          packSize: currentDrawerMedicine.packSize || "10 Tablets",
          genericMrp: kendraPrice,
          quantity: 1,
        },
      ],
      totalAmount: kendraPrice,
    });
  } else if (alertStoreBtn && currentDrawerMedicine) {
    if (!requireCustomer("subscribe to restock alerts")) return;
    const kendraId = alertStoreBtn.dataset.kendraId;
    closeDrawer();
    openAlertModal(currentDrawerMedicine, kendraId);
  }
});

// ---------------------------------------------------------------------
// Out-of-Stock Alert ("Notify Me")
// ---------------------------------------------------------------------
function openAlertModal(medicine, kendraId = null) {
  if (!requireCustomer("subscribe to restock alerts")) return;

  alertMedicineId.value = medicine.id || medicine._id;
  alertKendraId.value = kendraId || "";
  alertMedName.textContent = medicine.genericName;
  alertKendraName.textContent = kendraId ? `Kendra ${kendraId}` : "Any Nearby Kendra";
  if (currentUser) {
    alertCustomerName.value = currentUser.name || "";
    alertCustomerEmail.value = currentUser.email || "";
    alertCustomerPhone.value = currentUser.phone || "";
  }
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
  if (!requireCustomer("subscribe to restock alerts")) return;

  const formData = new FormData(stockAlertForm);
  const medicineId = formData.get("medicineId");
  const kendraId = formData.get("kendraId");
  const customerPhone = formData.get("customerPhone");

  try {
    const res = await subscribeStockAlert({
      medicineId,
      kendraId,
      customerPhone,
    });

    alertModalBackdrop.hidden = true;
    const am = document.getElementById("alert-modal");
    if (am) am.hidden = true;
    showToast(res.message || "Restock alert subscribed.", "🔔");
    navigate("/account");
  } catch (err) {
    alert(`Alert subscription failed: ${err.message}`);
  }
});

// ---------------------------------------------------------------------
// Kendra Owner Add Formulation
// ---------------------------------------------------------------------
function populateCategoryDatalist() {
  if (!addProductCategoryOptions) return;
  const categories = [...new Set(currentKendraCategories.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
  addProductCategoryOptions.innerHTML = categories
    .map((category) => `<option value="${esc(category)}"></option>`)
    .join("");
}

btnOpenAddMed.addEventListener("click", () => {
  if (!currentUser || currentUser.role !== "kendra_owner") {
    showToast("Adding products requires an approved Kendra owner account.", "🔒");
    return;
  }
  if (!currentUser.kendraCode) {
    showToast("Your Kendra application has not been approved yet.", "⏳");
    return;
  }
  populateCategoryDatalist();
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
  if (!currentUser || currentUser.role !== "kendra_owner" || !currentUser.kendraCode) {
    showToast("Only an approved Kendra owner can add products.", "🔒");
    return;
  }
  const formData = new FormData(addProductForm);
  const kendraCode = currentUser.kendraCode;

  const medData = {
    genericName: String(formData.get("genericName") || "").trim(),
    composition: String(formData.get("composition") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    packSize: String(formData.get("packSize") || "").trim(),
    genericMrp: parseFloat(formData.get("genericMrp")),
    units: parseInt(formData.get("units"), 10),
  };

  const priceField = String(formData.get("price") || "").trim();
  if (priceField) medData.price = parseFloat(priceField);

  if (!medData.category) {
    showToast("Choose an existing category or type a new category name.", "⚠️");
    return;
  }
  if (!Number.isFinite(medData.genericMrp) || medData.genericMrp <= 0) {
    showToast("Enter a valid catalog MRP.", "⚠️");
    return;
  }
  if (medData.price !== undefined && (!Number.isFinite(medData.price) || medData.price <= 0)) {
    showToast("Enter a selling price greater than zero, or leave it blank.", "⚠️");
    return;
  }

  const submitBtn = addProductForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding…";
  }

  try {
    const res = await addMedicineToKendra(kendraCode, medData);
    addProductModalBackdrop.hidden = true;
    const apm = document.getElementById("add-product-modal");
    if (apm) apm.hidden = true;
    addProductForm.reset();
    showToast(
      res.isNewMedicine === false
        ? "Existing formulation added to your Kendra stock with the new price."
        : "Formulation successfully added to Kendra inventory!",
      "✓"
    );
    if (res.triggeredAlerts > 0) {
      showToast(
        `${res.triggeredAlerts} waiting customer(s) were notified that this medicine is back in stock.`,
        "🔔"
      );
    }
    loadKendraDashboard();
  } catch (err) {
    showToast(`Failed to add product: ${err.message}`, "⚠️");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Add Formulation to Kendra";
    }
  }
});

// ---------------------------------------------------------------------
// VIEW 2: Customer Dashboard (Orders & Alerts)
// ---------------------------------------------------------------------
async function loadCustomerDashboard() {
  if (!currentUser || currentUser.role !== "customer") {
    return;
  }

  customerOrdersList.innerHTML = `<div class="drawer__loading"><div class="spinner"></div><p>Fetching your orders…</p></div>`;
  customerAlertsList.innerHTML = `<div class="drawer__loading"><div class="spinner"></div><p>Fetching your restock alerts…</p></div>`;

  try {
    const [ordersRes, alertsRes] = await Promise.all([
      getMyOrders(),
      getMyStockAlerts(),
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
            <span class="status-pill status-pill--${esc(o.status)}">${esc(orderStatusLabel(o.status))}</span>
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
  if (!currentUser || currentUser.role !== "kendra_owner") {
    kendraHubSection.hidden = true;
    kendraPendingBanner.hidden = true;
    kendraDashTitle.textContent = "Jan Aushadhi Kendra Management Portal";
    return;
  }

  // Owners can be approved while their session is still open. Refresh the
  // session from MongoDB so the portal unlocks without requiring a new login.
  if (!currentUser.kendraCode) {
    try {
      const res = await fetchMe();
      if (res.user) {
        currentUser = { ...currentUser, ...res.user };
        updateRoleUI();
      }
    } catch {
      // Keep the cached profile if the refresh fails.
    }
  }

  if (!currentUser.kendraCode || currentUser.status === "pending") {
    kendraPendingBanner.hidden = false;
    pendingKendraName.textContent =
      currentUser.kendraName || "Your Jan Aushadhi Kendra application";
    kendraHubSection.hidden = true;
    kendraDashTitle.textContent = `${currentUser.kendraName || "Jan Aushadhi Kendra"} (Pending Admin Approval)`;
    return;
  }

  kendraPendingBanner.hidden = true;
  kendraHubSection.hidden = false;

  const kendraCode = currentUser.kendraCode;
  kendraDashTitle.textContent = `${currentUser.kendraName || kendraCode}`;

  try {
    const [invRes, ordersRes] = await Promise.all([
      getKendraInventory(kendraCode),
      getKendraOrders(kendraCode),
    ]);

    const items = invRes.items || [];
    const orders = ordersRes.orders || [];
    currentKendraInventory = items;
    currentKendraCategories = invRes.categories || [];
    populateCategoryDatalist();

    const inStockCount = items.filter((i) => i.inStock).length;
    const outStockCount = items.length - inStockCount;
    const pendingOrdersCount = orders.filter(
      (o) => o.status !== "completed" && o.status !== "cancelled"
    ).length;

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
    kendraInventoryTbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 24px;">No formulations indexed for this Kendra yet. Click "+ Add New Medicine Product" above to add.</td></tr>`;
    return;
  }

  kendraInventoryTbody.innerHTML = items
    .map(
      (item) => `
      <tr data-med-id="${esc(item.medicineId)}">
        <td class="mono"><strong>${esc(item.drugCode)}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--navy-deep);">${esc(item.genericName)}</div>
          <div class="text-subtle" style="font-size: 0.76rem;">${esc(item.composition)} · ${esc(item.category || "General")}</div>
        </td>
        <td>${esc(item.packSize)}</td>
        <td class="mono text-subtle">₹${Number(item.basePrice ?? item.genericMrp).toFixed(2)}</td>
        <td>
          <div class="stock-input-group">
            <input type="number" min="0.01" step="0.01" value="${Number(item.price ?? item.genericMrp).toFixed(2)}"
              class="stock-price-input" data-field="price" aria-label="Selling price" />
          </div>
        </td>
        <td class="mono text-subtle" style="font-size: 0.78rem;">${esc(item.batchNumber)} <br/> Exp: ${esc(item.expiryDate)}</td>
        <td>
          <div class="stock-input-group">
            <input type="number" min="0" value="${item.units}" class="stock-units-input" data-field="units" aria-label="Stock units" />
          </div>
        </td>
        <td>
          <span class="stock-badge ${
            item.inStock
              ? item.isLowStock
                ? "stock-badge--low"
                : "stock-badge--in"
              : "stock-badge--out"
          }">
            ${
              item.inStock
                ? item.isLowStock
                  ? `Low Stock (${item.units})`
                  : `${icon.check} In Stock`
                : `${icon.cross} Out of Stock`
            }
          </span>
        </td>
        <td>
          <button type="button" class="btn btn--outline btn--sm" data-action="save-stock">
            Save Price &amp; Stock
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
          <span class="status-pill status-pill--${esc(o.status)}">${esc(orderStatusLabel(o.status))}</span>
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
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${
              o.status !== "cancelled" && o.status !== "completed"
                ? `<button type="button" class="btn btn--outline btn--sm" style="background: #fff1f2; color: #b42318; border-color: #fecdd3;" data-action="set-status" data-status="cancelled">Out of Order</button>
                   <button type="button" class="btn btn--outline btn--sm" style="background: #fffbeb; color: #92400e; border-color: #fde68a;" data-action="set-status" data-status="out_for_delivery">Out for Delivery</button>
                   <button type="button" class="btn btn--outline btn--sm" style="background: #e6f6ee; color: #167a52; border-color: #a4ddbf;" data-action="set-status" data-status="completed">Delivered</button>`
                : ""
            }
          </div>
        </div>
      </div>`
    )
    .join("");
}

kpiPendingOrdersCard?.addEventListener("click", () => {
  const ordersTab = document.querySelector('[data-subtab="kendra-orders"]');
  if (ordersTab) ordersTab.click();
  document
    .getElementById("subtab-kendra-orders")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
});

kpiPendingOrdersCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    kpiPendingOrdersCard.click();
  }
});

kendraInventorySearch.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase().trim();
  if (!term) {
    renderKendraInventoryTable(currentKendraInventory);
    return;
  }
  const filtered = currentKendraInventory.filter(
    (i) =>
      String(i.genericName || "").toLowerCase().includes(term) ||
      String(i.drugCode || "").toLowerCase().includes(term) ||
      String(i.composition || "").toLowerCase().includes(term) ||
      String(i.category || "").toLowerCase().includes(term)
  );
  renderKendraInventoryTable(filtered);
});

kendraInventoryTbody.addEventListener("click", async (e) => {
  const btn = e.target.closest('[data-action="save-stock"]');
  if (!btn) return;
  if (!currentUser || currentUser.role !== "kendra_owner" || !currentUser.kendraCode) {
    showToast("Only an approved Kendra owner can update stock.", "🔒");
    return;
  }
  const tr = btn.closest("tr");
  const medId = tr.dataset.medId;
  const unitsInput = tr.querySelector('[data-field="units"]');
  const priceInput = tr.querySelector('[data-field="price"]');
  const units = parseInt(unitsInput.value, 10);
  const price = parseFloat(priceInput.value);

  if (!Number.isFinite(units) || units < 0) {
    showToast("Enter a valid stock quantity.", "⚠️");
    return;
  }
  if (!Number.isFinite(price) || price <= 0) {
    showToast("Enter a valid selling price greater than zero.", "⚠️");
    return;
  }

  const kendraCode = currentUser.kendraCode;
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    const res = await updateKendraStock(kendraCode, medId, {
      units,
      price,
      inStock: units > 0,
    });

    if (res.triggeredAlerts > 0) {
      showToast(
        `Stock and price saved. ${res.triggeredAlerts} waiting customer(s) were notified about the restock.`,
        "🔔"
      );
    } else {
      showToast("Price and stock synchronised to MongoDB.", "✓");
    }
    loadKendraDashboard();
  } catch (err) {
    showToast(`Failed to update stock: ${err.message}`, "⚠️");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Price & Stock";
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
    showToast(`Order #${orderId} marked as ${orderStatusLabel(status)}`, "✓");
    loadKendraDashboard();
  } catch (err) {
    alert(`Status update failed: ${err.message}`);
  }
});

// ---------------------------------------------------------------------
// VIEW 4: Admin Portal (Accept/Reject Kendra Owner Requests)
// ---------------------------------------------------------------------
async function loadAdminDashboard() {
  if (!currentUser || currentUser.role !== "admin") {
    return;
  }

  try {
    const [statsRes, appsRes, kendrasRes, ordersRes, usersRes] = await Promise.all([
      getAdminStats(),
      getAdminApplications(),
      getAdminKendras(),
      getAdminOrders(),
      getAdminUsers("all"),
    ]);

    const stats = statsRes.stats || {};
    const apps = appsRes.applications || [];
    const kendras = kendrasRes.kendras || [];
    const orders = ordersRes.orders || [];
    const users = usersRes.users || [];

    kpiAdminKendras.textContent = stats.totalKendras ?? 0;
    kpiAdminPending.textContent = stats.pendingApplications ?? 0;
    kpiAdminOrders.textContent = stats.totalOrders ?? 0;
    kpiAdminSavings.textContent = `₹${Number(stats.estimatedSavings || 0).toLocaleString()}`;
    kpiAdminCustomers.textContent = stats.totalCustomers ?? 0;
    kpiAdminOwners.textContent = `${stats.approvedOwners ?? 0} / ${stats.pendingOwners ?? 0}`;

    countAdminPending.textContent = apps.filter((a) => a.status === "pending").length;
    countAdminKendras.textContent = kendras.length;
    countAdminOrders.textContent = orders.length;
    countAdminUsers.textContent = users.length;
    adminPendingCountBadge.textContent = stats.pendingApplications ?? 0;
    adminPendingCountBadge.hidden = (stats.pendingApplications ?? 0) === 0;

    renderAdminApplications(apps);
    renderAdminKendras(kendras);
    renderAdminOrders(orders);
    renderAdminUsers(users);
  } catch (err) {
    showToast(`Admin load error: ${err.message}`, "⚠️");
  }
}

function renderAdminUsers(users) {
  if (!adminUsersTbody) return;
  if (users.length === 0) {
    adminUsersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px;">No registered customers or Kendra owners yet.</td></tr>`;
    return;
  }

  adminUsersTbody.innerHTML = users
    .map((user) => {
      const roleLabel = user.role === "kendra_owner" ? "Kendra Owner" : "Customer";
      const statusClass =
        user.status === "approved" || user.status === "active"
          ? "ready"
          : user.status === "rejected" || user.status === "suspended"
          ? "cancelled"
          : "confirmed";
      const canSuspend = user.status === "active" || user.status === "approved";
      const canReactivate = user.status === "suspended";
      const nextStatus = canSuspend
        ? "suspended"
        : user.role === "kendra_owner"
        ? "approved"
        : "active";
      return `
        <tr data-user-id="${esc(user.id)}" data-user-name="${esc(user.name)}">
          <td>
            <strong>${esc(user.name)}</strong>
            <div class="text-subtle">${esc(user.email)}${user.phone ? ` · ${esc(user.phone)}` : ""}</div>
          </td>
          <td>
            <span class="status-pill status-pill--${user.role === "kendra_owner" ? "confirmed" : "placed"}">
              ${esc(roleLabel)}
            </span>
          </td>
          <td>
            <span class="status-pill status-pill--${statusClass}">${esc(user.status)}</span>
          </td>
          <td>
            ${
              user.role === "kendra_owner"
                ? `<div>${esc(user.kendraName || "—")}</div><div class="text-subtle mono">${esc(
                    user.kendraCode || "Not approved yet"
                  )}</div>`
                : `<span class="text-subtle">—</span>`
            }
          </td>
          <td class="text-subtle">${
            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"
          }</td>
          <td>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${
                canSuspend || canReactivate
                  ? `<button type="button" class="btn ${
                      canReactivate ? "btn--primary" : "btn--outline"
                    } btn--sm" data-action="toggle-user-status" data-next-status="${nextStatus}">
                       ${canReactivate ? "Reactivate" : "Suspend"}
                     </button>`
                  : ""
              }
              <button type="button" class="btn btn--outline btn--sm" data-action="delete-user">
                Delete
              </button>
            </div>
          </td>
        </tr>`;
    })
    .join("");
}

function renderAdminApplications(apps) {
  if (apps.length === 0) {
    adminApprovalsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px;">No Kendra registration applications in queue.</td></tr>`;
    return;
  }

  adminApprovalsTbody.innerHTML = apps
    .map(
      (app) => `
      <tr data-app-id="${esc(app.id)}" data-app-name="${esc(app.name)}">
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
  adminOrdersCache = orders;

  if (orders.length === 0) {
    adminOrdersTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px;">No orders recorded in network.</td></tr>`;
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
        <td><span class="status-pill status-pill--${esc(o.status)}">${esc(orderStatusLabel(o.status))}</span></td>
        <td>
          <button type="button" class="btn btn--outline btn--sm" data-action="view-order" data-order-id="${esc(o.id)}">View</button>
        </td>
      </tr>`
    )
    .join("");
}

function renderAdminKendras(kendras) {
  if (!adminKendrasTbody) return;
  if (kendras.length === 0) {
    adminKendrasTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px;">No Kendra stores registered yet.</td></tr>`;
    return;
  }

  adminKendrasTbody.innerHTML = kendras
    .map((kendra) => {
      const isActive = kendra.status === "active";
      const nextStatus = isActive ? "suspended" : "active";
      const statusClass =
        kendra.status === "active"
          ? "ready"
          : kendra.status === "suspended"
          ? "cancelled"
          : "confirmed";
      return `
        <tr data-kendra-code="${esc(kendra.kendraCode)}" data-kendra-name="${esc(kendra.name)}">
          <td class="mono"><strong>${esc(kendra.kendraCode)}</strong></td>
          <td>
            <div style="font-weight: 600; color: var(--navy-deep);">${esc(kendra.name)}</div>
            <div class="text-subtle">${esc(kendra.ownerName || "Owner not linked")}</div>
          </td>
          <td>${esc(kendra.city)}, ${esc(kendra.state)}</td>
          <td>
            <span class="status-pill status-pill--${statusClass}">${esc(kendra.status)}</span>
          </td>
          <td>
            ${
              kendra.status === "active" || kendra.status === "suspended"
                ? `<button type="button" class="btn ${
                    isActive ? "btn--danger" : "btn--primary"
                  } btn--sm" data-action="toggle-kendra-status" data-next-status="${nextStatus}">
                     ${isActive ? "Suspend" : "Reactivate"}
                   </button>`
                : `<span class="text-subtle">Not approved</span>`
            }
          </td>
        </tr>`;
    })
    .join("");
}

adminKendrasTbody?.addEventListener("click", async (event) => {
  const btn = event.target.closest('[data-action="toggle-kendra-status"]');
  if (!btn) return;

  const row = btn.closest("tr");
  const kendraCode = row?.dataset.kendraCode;
  const kendraName = row?.dataset.kendraName || kendraCode;
  const nextStatus = btn.dataset.nextStatus;
  if (!kendraCode || !nextStatus) return;

  btn.disabled = true;
  btn.textContent = nextStatus === "suspended" ? "Suspending…" : "Reactivating…";

  try {
    const res = await setAdminKendraStatus(kendraCode, nextStatus);
    showToast(res.message || `${kendraName} is now ${nextStatus}.`, "✓");
    await loadAdminDashboard();
  } catch (err) {
    showToast(`Kendra status error: ${err.message}`, "⚠️");
    btn.disabled = false;
    btn.textContent = nextStatus === "suspended" ? "Suspend" : "Reactivate";
  }
});

adminOrdersTbody?.addEventListener("click", (event) => {
  const btn = event.target.closest('[data-action="view-order"]');
  if (!btn) return;
  openAdminOrderModal(btn.dataset.orderId);
});

function openAdminOrderModal(orderId) {
  const order = adminOrdersCache.find((o) => String(o.id) === String(orderId));
  if (!order) {
    showToast("Order not found in the loaded list.", "⚠️");
    return;
  }

  adminOrderTarget = order.id;

  const items = (order.items || [])
    .map(
      (item) =>
        `<li>${esc(item.genericName)}${item.packSize ? ` · ${esc(item.packSize)}` : ""} — ${item.quantity} × ₹${Number(
          item.genericMrp || 0
        ).toFixed(2)}</li>`
    )
    .join("");
  const history = (order.statusHistory || [])
    .map(
      (entry) =>
        `<li>${esc(orderStatusLabel(entry.status))}${
          entry.timestamp ? ` — ${new Date(entry.timestamp).toLocaleString()}` : ""
        }</li>`
    )
    .join("");

  if (adminOrderDetail) {
    adminOrderDetail.innerHTML = `
      <div style="display: grid; gap: 6px; font-size: 0.9rem;">
        <div><span class="text-subtle">Customer:</span> <strong>${esc(order.customerName)}</strong></div>
        <div><span class="text-subtle">Email:</span> ${esc(order.customerEmail || "—")}</div>
        <div><span class="text-subtle">Phone:</span> ${esc(order.customerPhone || "—")}</div>
        <div><span class="text-subtle">Delivery address:</span> ${esc(order.deliveryAddress || "—")}</div>
        <div><span class="text-subtle">Kendra:</span> ${esc(order.kendraName)} (${esc(order.kendraCode)})</div>
        <div><span class="text-subtle">Total:</span> <strong>₹${Number(order.totalAmount || 0).toFixed(2)}</strong></div>
        <div><span class="text-subtle">Payment:</span> ${esc(order.paymentMethod || "—")} · ${esc(order.paymentStatus || "—")}</div>
      </div>
      <div style="margin-top: 12px;">
        <strong>Items</strong>
        <ul style="margin: 6px 0 0 18px;">${items || "<li>No items</li>"}</ul>
      </div>
      <div style="margin-top: 12px;">
        <strong>Status history</strong>
        <ul style="margin: 6px 0 0 18px;">${history || "<li>No history recorded</li>"}</ul>
      </div>`;
  }

  if (adminOrderStatusSelect) adminOrderStatusSelect.value = order.status;
  if (adminOrderBackdrop) adminOrderBackdrop.hidden = false;
  if (adminOrderModal) adminOrderModal.hidden = false;
}

function closeAdminOrderModal() {
  adminOrderTarget = null;
  if (adminOrderBackdrop) adminOrderBackdrop.hidden = true;
  if (adminOrderModal) adminOrderModal.hidden = true;
}

document.getElementById("btn-close-admin-order")?.addEventListener("click", closeAdminOrderModal);
document.getElementById("btn-cancel-admin-order")?.addEventListener("click", closeAdminOrderModal);
adminOrderBackdrop?.addEventListener("click", closeAdminOrderModal);

adminOrderStatusForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const orderId = adminOrderTarget;
  const status = adminOrderStatusSelect?.value;
  if (!orderId || !status) return;

  btnUpdateAdminOrderStatus.disabled = true;
  btnUpdateAdminOrderStatus.textContent = "Updating…";

  try {
    await updateOrderStatus(orderId, status);
    showToast(`Order #${orderId} marked as ${orderStatusLabel(status)}`, "✓");
    closeAdminOrderModal();
    await loadAdminDashboard();
  } catch (err) {
    showToast(`Status update failed: ${err.message}`, "⚠️");
  } finally {
    btnUpdateAdminOrderStatus.disabled = false;
    btnUpdateAdminOrderStatus.textContent = "Update Status";
  }
});

adminApprovalsTbody.addEventListener("click", async (e) => {
  const approveBtn = e.target.closest('[data-action="approve-kendra"]');
  const rejectBtn = e.target.closest('[data-action="reject-kendra"]');
  if (!approveBtn && !rejectBtn) return;

  const tr = e.target.closest("tr");
  const appId = tr.dataset.appId;
  const appName = tr.dataset.appName || "this Kendra";

  if (approveBtn) {
    approveBtn.disabled = true;
    approveBtn.textContent = "Approving…";
    try {
      const res = await approveApplication(appId);
      showToast(
        res.message || `${appName} approved and active in the PMBJP network.`,
        "✓"
      );
      await loadAdminDashboard();
    } catch (err) {
      showToast(`Approval error: ${err.message}`, "⚠️");
      approveBtn.disabled = false;
      approveBtn.textContent = "Approve & Activate Kendra";
    }
  } else if (rejectBtn) {
    openRejectApplicationModal(appId, appName);
  }
});

function openRejectApplicationModal(appId, appName) {
  rejectApplicationTarget = appId;
  if (rejectApplicationId) rejectApplicationId.value = appId;
  if (rejectApplicationName) rejectApplicationName.textContent = appName;
  if (rejectApplicationReason) rejectApplicationReason.value = "Incomplete documentation";
  if (rejectApplicationBackdrop) rejectApplicationBackdrop.hidden = false;
  if (rejectApplicationModal) rejectApplicationModal.hidden = false;
  if (rejectApplicationReason) rejectApplicationReason.focus();
}

function closeRejectApplicationModal() {
  rejectApplicationTarget = null;
  if (rejectApplicationBackdrop) rejectApplicationBackdrop.hidden = true;
  if (rejectApplicationModal) rejectApplicationModal.hidden = true;
}

document
  .getElementById("btn-close-reject-application")
  ?.addEventListener("click", closeRejectApplicationModal);
document
  .getElementById("btn-cancel-reject-application")
  ?.addEventListener("click", closeRejectApplicationModal);
rejectApplicationBackdrop?.addEventListener("click", closeRejectApplicationModal);

rejectApplicationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const appId = rejectApplicationTarget || rejectApplicationId?.value;
  const reason = String(rejectApplicationReason?.value || "").trim();
  if (!appId) return;
  if (!reason) {
    showToast("Enter a reason for the rejection.", "⚠️");
    return;
  }

  const submitBtn = document.getElementById("btn-confirm-reject-application");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Rejecting…";
  }

  try {
    const res = await rejectApplication(appId, reason);
    closeRejectApplicationModal();
    showToast(res.message || "Application rejected.", "✓");
    await loadAdminDashboard();
  } catch (err) {
    showToast(`Reject error: ${err.message}`, "⚠️");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirm Rejection";
    }
  }
});

// Two-step inline confirmation keeps deletion safe without a blocking dialog.
adminUsersTbody?.addEventListener("click", async (event) => {
  const statusBtn = event.target.closest('[data-action="toggle-user-status"]');
  if (statusBtn) {
    const row = statusBtn.closest("tr");
    const userId = row?.dataset.userId;
    const userName = row?.dataset.userName || "this account";
    const nextStatus = statusBtn.dataset.nextStatus;
    if (!userId || !nextStatus) return;

    statusBtn.disabled = true;
    statusBtn.textContent = nextStatus === "suspended" ? "Suspending…" : "Reactivating…";

    try {
      const res = await setAdminUserStatus(userId, nextStatus);
      showToast(
        res.message ||
          `${userName} is now ${nextStatus === "suspended" ? "suspended" : "active"}.`,
        "✓"
      );
      await loadAdminDashboard();
    } catch (err) {
      showToast(`Account status error: ${err.message}`, "⚠️");
      statusBtn.disabled = false;
      statusBtn.textContent = nextStatus === "suspended" ? "Suspend" : "Reactivate";
    }
    return;
  }

  const btn = event.target.closest('[data-action="delete-user"]');
  if (!btn) return;

  const row = btn.closest("tr");
  const userId = row?.dataset.userId;
  const userName = row?.dataset.userName || "this account";

  if (btn.dataset.confirm !== "1") {
    adminUsersTbody.querySelectorAll('[data-action="delete-user"]').forEach((other) => {
      other.dataset.confirm = "";
      other.textContent = "Delete";
      other.disabled = false;
      other.classList.add("btn--outline");
      other.classList.remove("btn--danger");
    });
    btn.dataset.confirm = "1";
    btn.textContent = "Confirm delete";
    btn.classList.remove("btn--outline");
    btn.classList.add("btn--danger");

    setTimeout(() => {
      if (btn.isConnected && btn.dataset.confirm === "1") {
        btn.dataset.confirm = "";
        btn.textContent = "Delete";
        btn.classList.add("btn--outline");
        btn.classList.remove("btn--danger");
      }
    }, 6000);
    return;
  }

  if (!userId) return;
  btn.disabled = true;
  btn.textContent = "Deleting…";

  try {
    const res = await deleteAdminUser(userId);
    showToast(res.message || `${userName} deleted permanently.`, "🗑️");
    await loadAdminDashboard();
  } catch (err) {
    showToast(`Delete error: ${err.message}`, "⚠️");
    btn.disabled = false;
    btn.textContent = "Delete";
    btn.dataset.confirm = "";
    btn.classList.add("btn--outline");
    btn.classList.remove("btn--danger");
  }
});

btnRefreshAdmin.addEventListener("click", loadAdminDashboard);

// ---------------------------------------------------------------------
// Bootstrapping
// ---------------------------------------------------------------------
async function initApp() {
  loadCartFromStorage();
  updateRoleUI();

  // Resolve the real session from the httpOnly cookie.
  try {
    const res = await fetchMe();
    currentUser = res.user || null;
  } catch {
    currentUser = null;
  }
  authReady = true;
  updateRoleUI();

  // Public catalog + network statistics (available to guests).
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
    renderSearchResults({
      loading: false,
      results: [],
      searched: true,
      error:
        "Could not load the medicine catalogue. Make sure MongoDB is running and the database is seeded (npm run seed).",
    });
  }

  renderRoute();
}

// In-app route links (auth pages, footer, etc.)
document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("a[data-route]");
  if (!routeLink) return;
  event.preventDefault();
  navigate(routeLink.getAttribute("data-route") || "/");
});

// Footer portal links
document.querySelectorAll(".footer__link[data-view]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(routeForView(link.dataset.view));
  });
});

// ---------------------------------------------------------------------
// Background Hero Image Slider
// ---------------------------------------------------------------------
function initHeroBgSlider() {
  const slides = document.querySelectorAll(".hero__slide");
  const dots = document.querySelectorAll("#hero-slider-dots .hero__dot");
  const prevBtn = document.getElementById("hero-arrow-prev");
  const nextBtn = document.getElementById("hero-arrow-next");
  const heroSection = document.getElementById("hero-section");

  if (!slides.length) return;

  let currentSlide = 0;
  let sliderTimer = null;

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentSlide);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    sliderTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
      startAutoPlay();
    });
  });

  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopAutoPlay);
    heroSection.addEventListener("mouseleave", startAutoPlay);
  }

  startAutoPlay();
}

initApp();
initHeroBgSlider();
