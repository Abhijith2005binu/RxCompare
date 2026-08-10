import { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import MedicineCard, { SkeletonCard } from "./components/MedicineCard.jsx";
import StoreDrawer from "./components/StoreDrawer.jsx";
import Footer from "./components/Footer.jsx";
import { searchMedicines, getAllMedicines, getNearbyStores } from "./utils/api.js";

export default function App() {
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [storeMedicine, setStoreMedicine] = useState(null);
  const [locating, setLocating] = useState(false);

  // Populate the hero stats strip once on load (catalog size, avg saving, store count).
  useEffect(() => {
    Promise.all([getAllMedicines(), getNearbyStores(null, null)])
      .then(([medicines, allStores]) => {
        const pcts = medicines
          .filter((m) => m.cheapestBrandedMrp)
          .map((m) => Math.round(((m.cheapestBrandedMrp - m.genericMrp) / m.cheapestBrandedMrp) * 100));
        const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
        setStats({ medicineCount: medicines.length, avgSavingsPct: avg, storeCount: allStores.length });
      })
      .catch(() => setStats(null));
  }, []);

  async function handleSearch(query) {
    if (!query) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchMedicines(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLocateStores(medicine) {
    setStoreMedicine(medicine);
    setDrawerOpen(true);
    setLocating(true);

    const applyStores = (lat, lng) =>
      getNearbyStores(lat, lng)
        .then(setStores)
        .catch(() => setStores([]))
        .finally(() => setLocating(false));

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

  return (
    <div className="app">
      <Nav />
      <Hero onSearch={handleSearch} loading={loading} stats={stats} />

      <main className="app__main">
        {error && <p className="app__error">{error}</p>}

        {!loading && searched && results.length === 0 && !error && (
          <p className="app__empty">
            No match for that name yet — this demo ships with 16 common formulations. Try “Crocin”,
            “Storvas”, “Glycomet”, or “Azithral”.
          </p>
        )}

        {!loading && searched && results.length > 0 && (
          <p className="app__results-label">
            {results.length} match{results.length > 1 ? "es" : ""}
          </p>
        )}

        <div className="app__results">
          {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          {!loading &&
            results.map((med, i) => (
              <MedicineCard key={med._id} medicine={med} onLocateStores={handleLocateStores} index={i} />
            ))}
        </div>
      </main>

      <Footer />

      <StoreDrawer
        open={drawerOpen}
        stores={stores}
        medicineName={storeMedicine?.genericName}
        locating={locating}
        onClose={() => setDrawerOpen(false)}
      />

      <style>{`
        .app__main {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--space-8) var(--space-6) 60px;
          min-height: 30vh;
        }
        .app__error {
          color: var(--rust);
          font-size: var(--text-sm);
        }
        .app__empty {
          color: var(--ink-soft);
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .app__results-label {
          margin: 0 0 var(--space-4);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-faint);
        }
        .app__results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-4);
        }
      `}</style>
    </div>
  );
}
