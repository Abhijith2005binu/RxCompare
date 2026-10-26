const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * All requests send the httpOnly auth cookie so the backend can identify the
 * signed-in customer / Kendra owner / administrator.
 */
async function handle(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.code = body.code || null;
    error.details = body.details || null;
    error.body = body;
    throw error;
  }
  return body;
}

function request(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  }).then(handle);
}

// -----------------------------------------------------------------------------
// Core Medicine & Kendra Search
// -----------------------------------------------------------------------------
export function searchMedicines(query) {
  return request(`/medicines/search?q=${encodeURIComponent(query)}`);
}

export function getAllMedicines() {
  return request("/medicines");
}

export function getMedicineById(id) {
  return request(`/medicines/${encodeURIComponent(id)}`);
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
  return request(`/medicines/${encodeURIComponent(medicineId)}/kendras${queryStr}`);
}

export function getAllStores() {
  return request("/stores");
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
  return request(`/stores/nearby${queryStr}`);
}

export function getUhiStatus() {
  return request("/uhi/status");
}

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------
export function registerCustomer(data) {
  return request("/auth/register/customer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerKendraOwner(data) {
  return request("/auth/register/kendra", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyEmail(token) {
  return request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export function resendVerification(email) {
  return request("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function adminLogin(email, password) {
  return request("/auth/admin-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logoutUser() {
  return request("/auth/logout", { method: "POST" });
}

export function fetchMe() {
  return request("/auth/me");
}

// -----------------------------------------------------------------------------
// Admin APIs
// -----------------------------------------------------------------------------
export function getAdminStats() {
  return request("/admin/stats");
}

export function getAdminApplications(status = "all") {
  return request(`/admin/applications?status=${encodeURIComponent(status)}`);
}

export function approveApplication(id) {
  return request(`/admin/applications/${encodeURIComponent(id)}/approve`, {
    method: "POST",
  });
}

export function rejectApplication(id, reason = "") {
  return request(`/admin/applications/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function getAdminOrders() {
  return request("/admin/orders");
}

export function getAdminUsers(role = "all") {
  return request(`/admin/users?role=${encodeURIComponent(role)}`);
}

export function deleteAdminUser(id) {
  return request(`/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// -----------------------------------------------------------------------------
// Kendra Owner APIs
// -----------------------------------------------------------------------------
export function getKendraInventory(kendraCode) {
  return request(`/kendra/inventory/${encodeURIComponent(kendraCode)}`);
}

export function updateKendraStock(kendraCode, medicineId, data) {
  return request(
    `/kendra/inventory/${encodeURIComponent(kendraCode)}/${encodeURIComponent(medicineId)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function addMedicineToKendra(kendraCode, medData) {
  return request(`/kendra/inventory/${encodeURIComponent(kendraCode)}`, {
    method: "POST",
    body: JSON.stringify(medData),
  });
}

export function getKendraOrders(kendraCode) {
  return request(`/kendra/orders/${encodeURIComponent(kendraCode)}`);
}

export function updateOrderStatus(orderId, status) {
  return request(`/kendra/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// -----------------------------------------------------------------------------
// Customer APIs (Ordering & Out-of-Stock Notifications)
// -----------------------------------------------------------------------------
export function quoteOrder(quoteData) {
  return request("/orders/quote", {
    method: "POST",
    body: JSON.stringify(quoteData),
  });
}

export function placeOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function getMyOrders() {
  return request("/orders/my");
}

export function subscribeStockAlert(alertData) {
  return request("/stock-alerts", {
    method: "POST",
    body: JSON.stringify(alertData),
  });
}

export function getMyStockAlerts() {
  return request("/stock-alerts/my");
}
