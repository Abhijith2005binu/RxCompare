import { useEffect, useState, useMemo } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import MedicineCard, { SkeletonCard } from "./components/MedicineCard.jsx";
import StoreDrawer from "./components/StoreDrawer.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Toast from "./components/Toast.jsx";
import SavingsCalculator from "./components/SavingsCalculator.jsx";
import SavedCabinet from "./components/SavedCabinet.jsx";
import AdminPortal from "./components/admin/AdminPortal.jsx";
import { searchMedicines, getAllMedicines, getNearbyStores } from "./utils/api.js";
import { useAuth } from "./context/AuthContext.jsx";
import { Pill, RotateCcw, ShieldCheck } from "lucide-react";

export default function App() {
  const { toast, clearToast, isAdmin, isAuthenticated } = useAuth();

  // Active view: 'app' (Consumer Price Comparator) | 'admin' (Admin Control Console)
  const [activeView, setActiveView] = useState("app");

  // Data states
  const [catalog, setCatalog] = useState([]);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Filters & sorting
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("savings-desc");

  // Interactive Drawer / Modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [storeMedicine, setStoreMedicine] = useState(null);
  const [locating, setLocating] = useState(false);

  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [calcMedicine, setCalcMedicine] = useState(null);

  // Switch away from admin view if not admin
  useEffect(() => {
    if (activeView === "admin" && !isAdmin) {
      setActiveView("app");
    }
  }, [isAdmin, activeView]);

  // Load initial catalog and platform stats
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [medicines, allStores] = await Promise.all([
        getAllMedicines(),
        getNearbyStores(null, null),
      ]);
      setCatalog(medicines);
      setResults(medicines);

      const pcts = medicines
        .filter((m) => m.cheapestBrandedMrp && m.cheapestBrandedMrp > m.genericMrp)
        .map((m) =>
          Math.round(((m.cheapestBrandedMrp - m.genericMrp) / m.cheapestBrandedMrp) * 100)
        );
      const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
      setStats({
        medicineCount: medicines.length,
        avgSavingsPct: avg,
        storeCount: allStores.length,
      });
    } catch (err) {
      setError(err.message || "Failed to connect to RxCompare API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Search handler
  async function handleSearch(query) {
    setSearchQuery(query);
    setError(null);

    if (!query || !query.trim()) {
      setSearched(false);
      setResults(catalog);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMedicines(query.trim());
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter and sort the current results
  const displayedResults = useMemo(() => {
    let list = [...results];

    // Filter by Category
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter(
        (m) => (m.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.genericMrp || 0) - (b.genericMrp || 0);
      }
      if (sortBy === "name-asc") {
        return (a.genericName || "").localeCompare(b.genericName || "");
      }
      // 'savings-desc' default
      const savA = a.cheapestBrandedMrp ? a.cheapestBrandedMrp - a.genericMrp : 0;
      const savPctA = a.cheapestBrandedMrp ? savA / a.cheapestBrandedMrp : 0;

      const savB = b.cheapestBrandedMrp ? b.cheapestBrandedMrp - b.genericMrp : 0;
      const savPctB = b.cheapestBrandedMrp ? savB / b.cheapestBrandedMrp : 0;

      return savPctB - savPctA;
    });

    return list;
  }, [results, selectedCategory, sortBy]);

  // Handle locating stores
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
      () => applyStores(null, null),
      { timeout: 6000 }
    );
  }

  // Handle reset search
  function handleResetFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("savings-desc");
    setSearched(false);
    setResults(catalog);
  }

  // Render Admin Portal when in 'admin' view
  if (activeView === "admin" && isAdmin) {
    return (
      <div className="app">
        <Nav
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenCabinet={() => setCabinetOpen(true)}
        />
        <AdminPortal onBackToUserView={() => setActiveView("app")} />
        <Toast toast={toast} onClose={clearToast} />
        <SavedCabinet
          open={cabinetOpen}
          onClose={() => setCabinetOpen(false)}
          onLocateStores={handleLocateStores}
          onOpenCalculator={(m) => setCalcMedicine(m)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <Nav
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenCabinet={() => setCabinetOpen(true)}
      />

      <Hero
        onSearch={handleSearch}
        loading={loading}
        stats={stats}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="app__main">
        {error && (
          <div className="app__error-banner" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => handleSearch(searchQuery)} className="retry-btn">
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Results Header Bar */}
        <div className="results-header-strip">
          <div className="results-count-group">
            <span className="results-title">
              {searched
                ? `Results for "${searchQuery}"`
                : selectedCategory !== "All"
                ? `${selectedCategory} Formulations`
                : "Jan Aushadhi Generic Catalog"}
            </span>
            <span className="results-badge">
              {displayedResults.length} formulation{displayedResults.length !== 1 ? "s" : ""}
            </span>
          </div>

          {(searched || selectedCategory !== "All") && (
            <button type="button" className="reset-filters-btn" onClick={handleResetFilters}>
              <RotateCcw size={13} /> View Full Catalog
            </button>
          )}
        </div>

        {/* Empty Search Result State */}
        {!loading && displayedResults.length === 0 && !error && (
          <div className="app__empty-card">
            <div className="empty-pill-icon">
              <Pill size={32} />
            </div>
            <h3>No direct formulation matches found</h3>
            <p>
              We couldn't find a medicine matching "{searchQuery}". Try typing common brand names
              like <strong>“Crocin”</strong>, <strong>“Storvas”</strong>,{" "}
              <strong>“Glycomet”</strong>, or <strong>“Azithral”</strong>.
            </p>
            <div className="empty-actions">
              <button
                type="button"
                className="btn-browse-all"
                onClick={handleResetFilters}
              >
                Browse Full Catalog
              </button>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="app__results">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          {!loading &&
            displayedResults.map((med, i) => (
              <MedicineCard
                key={med._id}
                medicine={med}
                onLocateStores={handleLocateStores}
                onOpenCalculator={(m) => setCalcMedicine(m)}
                index={i}
              />
            ))}
        </div>

        {/* Mission / SDG 3 Health Equity Banner */}
        <div className="mission-banner">
          <div className="mission-icon">
            <ShieldCheck size={28} />
          </div>
          <div className="mission-content">
            <h4>Aligned with United Nations Sustainable Development Goal 3</h4>
            <p>
              RxCompare bridges prescription brand costs with government Jan Aushadhi generic
              counterparts. Our goal is universal healthcare affordability — identical quality,
              verified compositions, and direct pharmacy location.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <StoreDrawer
        open={drawerOpen}
        stores={stores}
        medicineName={storeMedicine?.genericName}
        locating={locating}
        onClose={() => setDrawerOpen(false)}
      />

      <SavedCabinet
        open={cabinetOpen}
        onClose={() => setCabinetOpen(false)}
        onLocateStores={handleLocateStores}
        onOpenCalculator={(m) => setCalcMedicine(m)}
      />

      {calcMedicine && (
        <SavingsCalculator
          medicine={calcMedicine}
          onClose={() => setCalcMedicine(null)}
          onLocateStores={handleLocateStores}
        />
      )}

      <AuthModal />
      <Toast toast={toast} onClose={clearToast} />

      <style>{`
        .app__main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          min-height: 40vh;
        }

        .app__error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fdf2ef;
          border: 1px solid var(--rust);
          color: var(--rust);
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 0.88rem;
          margin-bottom: 24px;
        }
        .app__error-banner p {
          margin: 0;
        }
        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid var(--rust);
          color: var(--rust);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }

        .results-header-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .results-count-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .results-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .results-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: var(--bg-subtle);
          color: var(--ink-soft);
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }

        .reset-filters-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          transition: background 140ms ease;
        }
        .reset-filters-btn:hover {
          background: var(--bg-subtle);
        }

        .app__empty-card {
          text-align: center;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 48px 24px;
          max-width: 520px;
          margin: 32px auto;
        }
        .empty-pill-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--bg-subtle);
          color: var(--ink-faint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .app__empty-card h3 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--navy-deep);
        }
        .app__empty-card p {
          margin: 0 0 20px;
          font-size: 0.88rem;
          color: var(--ink-soft);
          line-height: 1.5;
        }
        .btn-browse-all {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }

        .app__results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .mission-banner {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          background: linear-gradient(135deg, #f5f8f6 0%, #eaf4ee 100%);
          border: 1px solid #cce5d6;
          border-radius: 12px;
          padding: 24px 28px;
          margin-top: 20px;
        }
        .mission-icon {
          color: var(--emerald);
          flex-shrink: 0;
          margin-top: 4px;
        }
        .mission-content h4 {
          margin: 0 0 6px;
          font-family: var(--font-display);
          font-size: 1.12rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .mission-content p {
          margin: 0;
          font-size: 0.84rem;
          color: var(--ink-soft);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
