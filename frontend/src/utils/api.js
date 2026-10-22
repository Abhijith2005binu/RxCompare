const API_URL = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const errorMsg =
      data?.error ||
      (Array.isArray(data?.details) ? data.details.join(", ") : null) ||
      `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------------------------------------------------------
// Authentication & User Cabinet
// ---------------------------------------------------------------------------

export function login(email, password) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handle);
}

export function register(name, email, password, role = "user") {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  }).then(handle);
}

export function quickDemoLogin(role = "admin") {
  return fetch(`${API_URL}/auth/quick-demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  }).then(handle);
}

export function getCurrentUser(token) {
  return fetch(`${API_URL}/auth/me`, {
    headers: { ...authHeader(token) },
  }).then(handle);
}

export function toggleSaveMedicine(medicineId, token) {
  return fetch(`${API_URL}/auth/saved-medicines/${medicineId}`, {
    method: "POST",
    headers: { ...authHeader(token) },
  }).then(handle);
}

export function getSavedMedicines(token) {
  return fetch(`${API_URL}/auth/saved-medicines`, {
    headers: { ...authHeader(token) },
  }).then(handle);
}

// ---------------------------------------------------------------------------
// Medicines Catalog
// ---------------------------------------------------------------------------

export function searchMedicines(query) {
  return fetch(`${API_URL}/medicines/search?q=${encodeURIComponent(query)}`).then(handle);
}

export function getAllMedicines() {
  return fetch(`${API_URL}/medicines`).then(handle);
}

export function getMedicineById(id) {
  return fetch(`${API_URL}/medicines/${id}`).then(handle);
}

export function createMedicine(payload, token) {
  return fetch(`${API_URL}/medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function updateMedicine(id, payload, token) {
  return fetch(`${API_URL}/medicines/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function deleteMedicine(id, token) {
  return fetch(`${API_URL}/medicines/${id}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  }).then(handle);
}

// ---------------------------------------------------------------------------
// Jan Aushadhi Kendras / Stores
// ---------------------------------------------------------------------------

export function getAllStores() {
  return fetch(`${API_URL}/stores`).then(handle);
}

export function getNearbyStores(lat, lng, limit = 5) {
  const params = lat && lng ? `?lat=${lat}&lng=${lng}&limit=${limit}` : "";
  return fetch(`${API_URL}/stores/nearby${params}`).then(handle);
}

export function createStore(payload, token) {
  return fetch(`${API_URL}/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function updateStore(id, payload, token) {
  return fetch(`${API_URL}/stores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function deleteStore(id, token) {
  return fetch(`${API_URL}/stores/${id}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  }).then(handle);
}
