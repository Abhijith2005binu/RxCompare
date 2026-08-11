const API_URL = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function searchMedicines(query) {
  return fetch(`${API_URL}/medicines/search?q=${encodeURIComponent(query)}`).then(handle);
}

export function getAllMedicines() {
  return fetch(`${API_URL}/medicines`).then(handle);
}

export function getNearbyStores(lat, lng, limit = 5) {
  const params = lat && lng ? `?lat=${lat}&lng=${lng}&limit=${limit}` : "";
  return fetch(`${API_URL}/stores/nearby${params}`).then(handle);
}
