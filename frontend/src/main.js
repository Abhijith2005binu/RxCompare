import "./style.css";
import { searchMedicines, getAllMedicines, getNearbyStores } from "./api.js";

// ---------------------------------------------------------------------
// DOM references (grabbed once, reused everywhere — the vanilla-JS
// equivalent of React refs/elements)
// ---------------------------------------------------------------------
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const heroStats = document.getElementById("hero-stats");
const statMedicineCount = document.getElementById("stat-medicine-count");
const statAvgSavings = document.getElementById("stat-avg-savings");
const statStoreCount = document.getElementById("stat-store-count");

const resultsGrid = document.getElementById("results-grid");
const resultsError = document.getElementById("results-error");
const resultsEmpty = document.getElementById("results-empty");
const resultsLabel = document.getElementById("results-label");

const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const drawerTitle = document.getElementById("drawer-title");
const drawerBody = document.getElementById("drawer-body");
const drawerClose = document.getElementById("drawer-close");

// ---------------------------------------------------------------------
// Small icon helpers (inline SVG strings — no icon library dependency)
// ---------------------------------------------------------------------
const icon = {
  mapPin: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  mapPinSmall: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`,
};

// ---------------------------------------------------------------------
// Escaping helper — we build HTML via template strings, so any
// user-influenced or dynamic text must be escaped to avoid breaking
// markup (there's no JSX auto-escaping here).
// ---------------------------------------------------------------------
function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---------------------------------------------------------------------
// Hero stats — loaded once on page load
// ---------------------------------------------------------------------
async function loadStats() {
  try {
    const [medicines, allStores] = await Promise.all([getAllMedicines(), getNearbyStores(null, null)]);
    const pcts = medicines
      .filter((m) => m.cheapestBrandedMrp)
      .map((m) => Math.round(((m.cheapestBrandedMrp - m.genericMrp) / m.cheapestBrandedMrp) * 100));
    const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;

    statMedicineCount.textContent = medicines.length;
    statAvgSavings.textContent = `${avg}%`;
    statStoreCount.textContent = allStores.length;
    heroStats.hidden = false;
  } catch {
    heroStats.hidden = true;
  }
}

// ---------------------------------------------------------------------
// Rendering: medicine card
// ---------------------------------------------------------------------
function medicineCardHTML(medicine, index) {
  const cheapestBranded = medicine.cheapestBrandedMrp;
  const savings = cheapestBranded ? cheapestBranded - medicine.genericMrp : null;
  const savingsPct = cheapestBranded ? Math.round((savings / cheapestBranded) * 100) : null;

  const ribbon =
    savingsPct !== null
      ? `<div class="med-card__ribbon" aria-label="Save ${savingsPct} percent"><span>save ${savingsPct}%</span></div>`
      : "";

  const brandsList = (medicine.brandedEquivalents || [])
    .map((b) => `<li><span>${esc(b.brandName)}</span><span class="mono">₹${b.mrp.toFixed(2)}</span></li>`)
    .join("");

  return `
    <article class="med-card" style="animation-delay:${index * 60}ms" data-id="${esc(medicine._id)}">
      ${ribbon}
      <p class="med-card__eyebrow">${esc(medicine.category || "Generic")}</p>
      <h3 class="med-card__title">${esc(medicine.genericName)}</h3>
      <p class="med-card__meta">
        ${esc(medicine.composition)} · ${esc(medicine.packSize)} · <span class="mono">${esc(medicine.drugCode)}</span>
      </p>

      <div class="med-card__prices">
        <div class="price-block price-block--generic">
          <span class="price-block__label">Jan Aushadhi</span>
          <span class="price-block__value">₹${medicine.genericMrp.toFixed(2)}</span>
        </div>
        <div class="price-block price-block--branded">
          <span class="price-block__label">Branded, from</span>
          <span class="price-block__value price-block__value--strike">
            ₹${cheapestBranded ? cheapestBranded.toFixed(2) : "—"}
          </span>
        </div>
      </div>

      ${brandsList ? `<ul class="med-card__brands">${brandsList}</ul>` : ""}

      <button class="med-card__cta" data-action="locate">
        ${icon.mapPinSmall}
        Find nearest Kendra
      </button>
    </article>
  `;
}

function skeletonCardHTML() {
  return `<div class="skeleton-card" aria-hidden="true"></div>`;
}

// keep the last search results in memory so click handlers (event
// delegation) can look up the right medicine by id without re-fetching
let lastResults = [];

function renderResults({ loading, results, searched, error }) {
  resultsError.hidden = true;
  resultsEmpty.hidden = true;
  resultsLabel.hidden = true;
  resultsGrid.innerHTML = "";

  if (error) {
    resultsError.hidden = false;
    resultsError.textContent = error;
    return;
  }

  if (loading) {
    resultsGrid.innerHTML = Array.from({ length: 3 }).map(skeletonCardHTML).join("");
    return;
  }

  if (searched && results.length === 0) {
    resultsEmpty.hidden = false;
    return;
  }

  if (searched && results.length > 0) {
    resultsLabel.hidden = false;
    resultsLabel.textContent = `${results.length} match${results.length > 1 ? "es" : ""}`;
  }

  lastResults = results;
  resultsGrid.innerHTML = results.map((m, i) => medicineCardHTML(m, i)).join("");
}

// Event delegation: one listener on the grid handles every "Find nearest
// Kendra" button, current or future, instead of wiring each card by hand.
resultsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-action="locate"]');
  if (!btn) return;
  const card = btn.closest(".med-card");
  const medicine = lastResults.find((m) => m._id === card.dataset.id);
  if (medicine) openDrawer(medicine);
});

// ---------------------------------------------------------------------
// Search flow
// ---------------------------------------------------------------------
async function handleSearch(query) {
  if (!query) return;
  searchButton.disabled = true;
  searchButton.textContent = "Checking…";
  renderResults({ loading: true, results: [], searched: true, error: null });

  try {
    const data = await searchMedicines(query);
    renderResults({ loading: false, results: data, searched: true, error: null });
  } catch (err) {
    renderResults({ loading: false, results: [], searched: true, error: err.message });
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Compare price";
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(searchInput.value.trim());
});

// ---------------------------------------------------------------------
// Store drawer
// ---------------------------------------------------------------------
function storeItemHTML(s) {
  const distance =
    typeof s.distanceKm === "number" ? `<span class="store-item__distance">${s.distanceKm} km</span>` : "";
  const phone = s.phone
    ? `<p class="store-item__phone">${icon.phone} ${esc(s.phone)}</p>`
    : "";

  return `
    <li class="store-item">
      <div class="store-item__icon">${icon.mapPin}</div>
      <div class="store-item__body">
        <p class="store-item__name">${esc(s.name)}</p>
        <p class="store-item__address">${esc(s.address)}</p>
        ${phone}
      </div>
      ${distance}
    </li>
  `;
}

function renderDrawerBody({ locating, stores }) {
  if (locating) {
    drawerBody.innerHTML = `<p class="drawer__status">Locating you…</p>`;
    return;
  }
  if (stores.length === 0) {
    drawerBody.innerHTML = `<p class="drawer__status">No stores found. Try again, or allow location access for distance-sorted results.</p>`;
    return;
  }
  drawerBody.innerHTML = `<ul class="drawer__list">${stores.map(storeItemHTML).join("")}</ul>`;
}

function openDrawer(medicine) {
  drawerTitle.textContent = `for ${medicine.genericName}`;
  drawer.classList.add("is-open");
  drawerBackdrop.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");

  renderDrawerBody({ locating: true, stores: [] });

  const applyStores = (lat, lng) =>
    getNearbyStores(lat, lng)
      .then((stores) => renderDrawerBody({ locating: false, stores }))
      .catch(() => renderDrawerBody({ locating: false, stores: [] }));

  if (!navigator.geolocation) {
    applyStores(null, null);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => applyStores(pos.coords.latitude, pos.coords.longitude),
    () => applyStores(null, null), // permission denied -> fall back to full static list
    { timeout: 6000 }
  );
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

drawerClose.addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
loadStats();
