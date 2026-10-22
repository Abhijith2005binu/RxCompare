const API_URL = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// -----------------------------------------------------------------------------
// Core Medicine & Kendra Search
// -----------------------------------------------------------------------------
export function searchMedicines(query) {
  return fetch(`${API_URL}/medicines/search?q=${encodeURIComponent(query)}`).then(handle);
}

export function getAllMedicines() {
  return fetch(`${API_URL}/medicines`).then(handle);
}

export function getMedicineById(id) {
  return fetch(`${API_URL}/medicines/${encodeURIComponent(id)}`).then(handle);
}

export function getKendrasForMedicine(medicineId, { lat, lng, inStockOnly = false, city = "", limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (lat && lng) {
    params.set("lat", lat);
    params.set("lng", lng);
  }
  if (inStockOnly) {
    params.set("inStockOnly", "true");
  }
  if (city) {
    params.set("city", city);
  }
  if (limit) {
    params.set("limit", limit);
  }
  const queryStr = params.toString() ? `?${params.toString()}` : "";
  return fetch(`${API_URL}/medicines/${encodeURIComponent(medicineId)}/kendras${queryStr}`).then(handle);
}

export function getNearbyStores(lat, lng, limit = 10, medicineId = null) {
  const params = new URLSearchParams();
  if (lat && lng) {
    params.set("lat", lat);
    params.set("lng", lng);
  }
  if (limit) {
    params.set("limit", limit);
  }
  if (medicineId) {
    params.set("medicineId", medicineId);
  }
  const queryStr = params.toString() ? `?${params.toString()}` : "";
  return fetch(`${API_URL}/stores/nearby${queryStr}`).then(handle);
}

export function getUhiStatus() {
  return fetch(`${API_URL}/uhi/status`).then(handle);
}

// -----------------------------------------------------------------------------
// Auth & User Switcher
// -----------------------------------------------------------------------------
export function getDemoUsers() {
  return fetch(`${API_URL}/auth/demo-users`).then(handle);
}

export function loginUser(email) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handle);
}

export function registerUser(userData) {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then(handle);
}

// -----------------------------------------------------------------------------
// Admin APIs
// -----------------------------------------------------------------------------
export function getAdminStats() {
  return fetch(`${API_URL}/admin/stats`).then(handle);
}

export function getAdminApplications(status = "all") {
  return fetch(`${API_URL}/admin/applications?status=${encodeURIComponent(status)}`).then(handle);
}

export function approveApplication(id) {
  return fetch(`${API_URL}/admin/applications/${encodeURIComponent(id)}/approve`, {
    method: "POST",
  }).then(handle);
}

export function rejectApplication(id, reason = "") {
  return fetch(`${API_URL}/admin/applications/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  }).then(handle);
}

export function getAdminOrders() {
  return fetch(`${API_URL}/admin/orders`).then(handle);
}

// -----------------------------------------------------------------------------
// Kendra Owner APIs
// -----------------------------------------------------------------------------
export function registerKendra(formData) {
  return fetch(`${API_URL}/kendra/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then(handle);
}

export function getKendraInventory(kendraId) {
  return fetch(`${API_URL}/kendra/inventory/${encodeURIComponent(kendraId)}`).then(handle);
}

export function updateKendraStock(kendraId, medicineId, data) {
  return fetch(`${API_URL}/kendra/inventory/${encodeURIComponent(kendraId)}/${encodeURIComponent(medicineId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);
}

export function addMedicineToKendra(kendraId, medData) {
  return fetch(`${API_URL}/kendra/inventory/${encodeURIComponent(kendraId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medData),
  }).then(handle);
}

export function getKendraOrders(kendraId) {
  return fetch(`${API_URL}/kendra/orders/${encodeURIComponent(kendraId)}`).then(handle);
}

export function updateOrderStatus(orderId, status) {
  return fetch(`${API_URL}/kendra/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(handle);
}

// -----------------------------------------------------------------------------
// Customer APIs (Ordering & Out-of-Stock Notifications)
// -----------------------------------------------------------------------------
export function placeOrder(orderData) {
  return fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  }).then(handle);
}

export function getMyOrders(email) {
  return fetch(`${API_URL}/orders/my?email=${encodeURIComponent(email)}`).then(handle);
}

export function subscribeStockAlert(alertData) {
  return fetch(`${API_URL}/stock-alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alertData),
  }).then(handle);
}

export function getMyStockAlerts(email) {
  return fetch(`${API_URL}/stock-alerts/my?email=${encodeURIComponent(email)}`).then(handle);
}
