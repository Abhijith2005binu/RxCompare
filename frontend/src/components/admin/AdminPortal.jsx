import { useState, useEffect } from "react";
import {
  Pill,
  Building2,
  BarChart3,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  ArrowLeft,
  AlertCircle,
  Database,
  Check,
} from "lucide-react";
import {
  getAllMedicines,
  getAllStores,
  deleteMedicine,
  deleteStore,
} from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import AdminMedicineModal from "./AdminMedicineModal";
import AdminStoreModal from "./AdminStoreModal";

export default function AdminPortal({ onBackToUserView }) {
  const { user, token, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'medicines' | 'stores'
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [medSearch, setMedSearch] = useState("");
  const [medCategory, setMedCategory] = useState("All");
  const [storeSearch, setStoreSearch] = useState("");

  // Modal States
  const [medModalOpen, setMedModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  // Delete Confirmation State
  const [deleteItem, setDeleteItem] = useState(null); // { type: 'medicine'|'store', item }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allMeds, allStores] = await Promise.all([
        getAllMedicines(),
        getAllStores(),
      ]);
      setMedicines(allMeds);
      setStores(allStores);
    } catch (err) {
      showToast(err.message || "Failed to load management data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute platform analytics
  const totalCompetitors = medicines.reduce(
    (acc, m) => acc + (m.brandedEquivalents?.length || 0),
    0
  );

  const savingsArray = medicines
    .filter((m) => m.cheapestBrandedMrp && m.cheapestBrandedMrp > m.genericMrp)
    .map((m) =>
      Math.round(((m.cheapestBrandedMrp - m.genericMrp) / m.cheapestBrandedMrp) * 100)
    );
  const avgSavings = savingsArray.length
    ? Math.round(savingsArray.reduce((a, b) => a + b, 0) / savingsArray.length)
    : 0;

  // Category counts
  const categoryCounts = medicines.reduce((acc, m) => {
    const cat = m.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const allCategories = ["All", ...Object.keys(categoryCounts)];

  // Filtered medicines
  const filteredMedicines = medicines.filter((m) => {
    const matchCat = medCategory === "All" || m.category === medCategory;
    const q = medSearch.toLowerCase();
    const matchSearch =
      !q ||
      m.genericName?.toLowerCase().includes(q) ||
      m.drugCode?.toLowerCase().includes(q) ||
      m.composition?.toLowerCase().includes(q) ||
      m.brandedEquivalents?.some((b) => b.brandName?.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  // Filtered stores
  const filteredStores = stores.filter((s) => {
    const q = storeSearch.toLowerCase();
    return (
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.state?.toLowerCase().includes(q) ||
      s.address?.toLowerCase().includes(q)
    );
  });

  // Handlers for adding/editing
  const handleOpenAddMed = () => {
    setEditingMed(null);
    setMedModalOpen(true);
  };

  const handleOpenEditMed = (med) => {
    setEditingMed(med);
    setMedModalOpen(true);
  };

  const handleOpenAddStore = () => {
    setEditingStore(null);
    setStoreModalOpen(true);
  };

  const handleOpenEditStore = (store) => {
    setEditingStore(store);
    setStoreModalOpen(true);
  };

  // Delete execution
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setDeleteLoading(true);
    try {
      if (deleteItem.type === "medicine") {
        await deleteMedicine(deleteItem.item._id, token);
        showToast(`Deleted formulation "${deleteItem.item.genericName}"`, "success");
      } else {
        await deleteStore(deleteItem.item._id, token);
        showToast(`Deleted store "${deleteItem.item.name}"`, "success");
      }
      setDeleteItem(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || "Failed to delete item", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-portal">
      {/* Top Banner Navigation */}
      <header className="portal-header">
        <div className="portal-header__inner">
          <div className="portal-header__left">
            <button
              type="button"
              className="back-btn"
              onClick={onBackToUserView}
              title="Return to patient search"
            >
              <ArrowLeft size={16} />
              <span>Back to App</span>
            </button>
            <div className="portal-title-wrap">
              <div className="admin-badge-strip">
                <ShieldCheck size={14} />
                <span>Admin Authority Console</span>
              </div>
              <h1 className="portal-title">Platform &amp; PMBJP Catalog Control</h1>
            </div>
          </div>

          <div className="portal-header__actions">
            <button
              type="button"
              className="portal-act-btn portal-act-btn--med"
              onClick={handleOpenAddMed}
            >
              <Plus size={16} />
              <span>Add Formulation</span>
            </button>
            <button
              type="button"
              className="portal-act-btn portal-act-btn--store"
              onClick={handleOpenAddStore}
            >
              <Plus size={16} />
              <span>Add Kendra</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Strip */}
      <div className="portal-nav-tabs">
        <div className="portal-nav-tabs__inner">
          <button
            type="button"
            className={`tab-btn ${activeTab === "overview" ? "is-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 size={16} />
            <span>Overview &amp; Analytics</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "medicines" ? "is-active" : ""}`}
            onClick={() => setActiveTab("medicines")}
          >
            <Pill size={16} />
            <span>Medicines Catalog ({medicines.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "stores" ? "is-active" : ""}`}
            onClick={() => setActiveTab("stores")}
          >
            <Building2 size={16} />
            <span>Jan Aushadhi Kendras ({stores.length})</span>
          </button>
        </div>
      </div>

      <main className="portal-main">
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="overview-section">
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-card__icon kpi-card__icon--blue">
                  <Pill size={20} />
                </div>
                <div className="kpi-card__data">
                  <span className="kpi-label">Formulations Indexed</span>
                  <span className="kpi-val">{medicines.length}</span>
                  <span className="kpi-sub">Standard Jan Aushadhi generic products</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__icon kpi-card__icon--emerald">
                  <TrendingUp size={20} />
                </div>
                <div className="kpi-card__data">
                  <span className="kpi-label">Average Catalog Savings</span>
                  <span className="kpi-val">{avgSavings}%</span>
                  <span className="kpi-sub">Direct patient discount vs retail brands</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__icon kpi-card__icon--amber">
                  <Building2 size={20} />
                </div>
                <div className="kpi-card__data">
                  <span className="kpi-label">Active Kendra Stores</span>
                  <span className="kpi-val">{stores.length}</span>
                  <span className="kpi-sub">Across major Indian metropolitan centers</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__icon kpi-card__icon--purple">
                  <Database size={20} />
                </div>
                <div className="kpi-card__data">
                  <span className="kpi-label">Branded Competitors Tracked</span>
                  <span className="kpi-val">{totalCompetitors}</span>
                  <span className="kpi-sub">Prescription equivalents monitored</span>
                </div>
              </div>
            </div>

            {/* Therapeutic Distribution & System Checks */}
            <div className="overview-split">
              <div className="overview-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Therapeutic Categories Breakdown</h3>
                  <span className="panel-badge">{Object.keys(categoryCounts).length} Classes</span>
                </div>
                <div className="category-bars">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const pct = Math.round((count / (medicines.length || 1)) * 100);
                    return (
                      <div key={cat} className="category-bar-row">
                        <div className="bar-labels">
                          <span className="cat-name">{cat}</span>
                          <span className="cat-count">
                            {count} formulation{count > 1 ? "s" : ""} ({pct}%)
                          </span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overview-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Standards &amp; Regulatory Conformance</h3>
                  <span className="panel-badge panel-badge--green">SDG 3 Compliant</span>
                </div>
                <div className="regulatory-items">
                  <div className="reg-item">
                    <Check size={18} className="reg-icon" />
                    <div>
                      <strong>WHO-GMP Certified Facilities</strong>
                      <p>All catalog formulations adhere to WHO Good Manufacturing Practices.</p>
                    </div>
                  </div>
                  <div className="reg-item">
                    <Check size={18} className="reg-icon" />
                    <div>
                      <strong>NABL Batch Accreditation</strong>
                      <p>Every generic lot tested by independent accredited testing laboratories.</p>
                    </div>
                  </div>
                  <div className="reg-item">
                    <Check size={18} className="reg-icon" />
                    <div>
                      <strong>Offline Haversine Distance Engine</strong>
                      <p>GPS calculations run completely client-side without paid third-party dependencies.</p>
                    </div>
                  </div>
                  <div className="reg-item">
                    <Check size={18} className="reg-icon" />
                    <div>
                      <strong>Full REST CRUD &amp; JWT Auth Enabled</strong>
                      <p>Authenticated role-based access for catalog modifications.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDICINES CATALOG CRUD */}
        {activeTab === "medicines" && (
          <div className="crud-section">
            <div className="crud-toolbar">
              <div className="search-input-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Filter by drug code, generic name, brand, or composition..."
                  value={medSearch}
                  onChange={(e) => setMedSearch(e.target.value)}
                />
              </div>

              <div className="filter-select-wrap">
                <label>Category:</label>
                <select value={medCategory} onChange={(e) => setMedCategory(e.target.value)}>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="add-table-btn"
                onClick={handleOpenAddMed}
              >
                <Plus size={16} /> Add Formulation
              </button>
            </div>

            <div className="table-responsive">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>Drug Code</th>
                    <th>Generic Name &amp; Composition</th>
                    <th>Category</th>
                    <th>Pack Size</th>
                    <th>Generic MRP</th>
                    <th>Branded MRP</th>
                    <th>Savings %</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-table-cell">
                        No medicine formulations matched your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map((m) => {
                      const cheapest = m.cheapestBrandedMrp;
                      const sav = cheapest ? cheapest - m.genericMrp : 0;
                      const savPct = cheapest ? Math.round((sav / cheapest) * 100) : 0;

                      return (
                        <tr key={m._id}>
                          <td>
                            <span className="code-badge">{m.drugCode}</span>
                          </td>
                          <td>
                            <strong className="table-med-name">{m.genericName}</strong>
                            <span className="table-med-sub">{m.composition}</span>
                          </td>
                          <td>
                            <span className="category-pill">{m.category || "General"}</span>
                          </td>
                          <td>{m.packSize}</td>
                          <td>
                            <span className="table-price-gen">₹{m.genericMrp?.toFixed(2)}</span>
                          </td>
                          <td>
                            <span className="table-price-br">
                              ₹{cheapest ? cheapest.toFixed(2) : "—"}
                            </span>
                          </td>
                          <td>
                            {savPct > 0 ? (
                              <span className="table-savings-badge">Save {savPct}%</span>
                            ) : (
                              <span className="table-savings-zero">—</span>
                            )}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="action-btn action-btn--edit"
                                onClick={() => handleOpenEditMed(m)}
                                title="Edit formulation"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                className="action-btn action-btn--delete"
                                onClick={() => setDeleteItem({ type: "medicine", item: m })}
                                title="Delete formulation"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JAN AUSHADHI KENDRAS CRUD */}
        {activeTab === "stores" && (
          <div className="crud-section">
            <div className="crud-toolbar">
              <div className="search-input-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Filter by Kendra name, city, state, or address..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="add-table-btn"
                onClick={handleOpenAddStore}
              >
                <Plus size={16} /> Register Kendra
              </button>
            </div>

            <div className="table-responsive">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>Kendra Store Name</th>
                    <th>Address</th>
                    <th>City &amp; State</th>
                    <th>Pincode</th>
                    <th>Contact Phone</th>
                    <th>Coordinates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-table-cell">
                        No Jan Aushadhi Kendras found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredStores.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div className="store-name-cell">
                            <Building2 size={15} className="store-icon" />
                            <strong>{s.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="table-address">{s.address}</span>
                        </td>
                        <td>
                          {s.city}, {s.state}
                        </td>
                        <td>
                          <span className="code-badge">{s.pincode || "—"}</span>
                        </td>
                        <td>{s.phone || "—"}</td>
                        <td>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${s.location?.lat},${s.location?.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="coords-link"
                            title="Open in Google Maps"
                          >
                            <span>
                              {s.location?.lat?.toFixed(4)}, {s.location?.lng?.toFixed(4)}
                            </span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="action-btn action-btn--edit"
                              onClick={() => handleOpenEditStore(s)}
                              title="Edit Kendra"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className="action-btn action-btn--delete"
                              onClick={() => setDeleteItem({ type: "store", item: s })}
                              title="Delete Kendra"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Medicine Add/Edit Modal */}
      <AdminMedicineModal
        open={medModalOpen}
        medicine={editingMed}
        onClose={() => setMedModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Store Add/Edit Modal */}
      <AdminStoreModal
        open={storeModalOpen}
        store={editingStore}
        onClose={() => setStoreModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="admin-overlay" onClick={() => setDeleteItem(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()} role="alertdialog">
            <div className="delete-icon">
              <AlertCircle size={28} />
            </div>
            <h3 className="delete-title">Confirm Deletion</h3>
            <p className="delete-msg">
              Are you sure you want to permanently delete{" "}
              <strong>
                {deleteItem.type === "medicine"
                  ? deleteItem.item.genericName
                  : deleteItem.item.name}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="delete-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setDeleteItem(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-portal {
          min-height: 100vh;
          background: #f8faf8;
          display: flex;
          flex-direction: column;
        }

        .portal-header {
          background: #ffffff;
          border-bottom: 1px solid var(--line);
          padding: 20px 24px;
        }
        .portal-header__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .portal-header__left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy-deep);
          cursor: pointer;
          transition: all 140ms ease;
        }
        .back-btn:hover {
          background: var(--line);
        }

        .admin-badge-strip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--brass-soft);
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          margin-bottom: 4px;
        }
        .portal-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--navy-deep);
        }

        .portal-header__actions {
          display: flex;
          gap: 10px;
        }
        .portal-act-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 8px;
          padding: 9px 15px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 140ms ease;
        }
        .portal-act-btn--med {
          background: var(--navy);
          color: #ffffff;
        }
        .portal-act-btn--med:hover {
          background: var(--navy-deep);
        }
        .portal-act-btn--store {
          background: #ffffff;
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .portal-act-btn--store:hover {
          background: var(--bg-subtle);
        }

        .portal-nav-tabs {
          background: #ffffff;
          border-bottom: 1px solid var(--line);
        }
        .portal-nav-tabs__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 4px;
          padding: 0 24px;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 18px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 140ms ease;
        }
        .tab-btn:hover {
          color: var(--navy);
        }
        .tab-btn.is-active {
          color: var(--navy);
          font-weight: 600;
          border-bottom-color: var(--navy);
        }

        .portal-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          width: 100%;
          flex: 1;
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .kpi-card {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          box-shadow: var(--shadow-sm);
        }
        .kpi-card__icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-card__icon--blue {
          background: #eaf1fb;
          color: #1a56db;
        }
        .kpi-card__icon--emerald {
          background: var(--emerald-bg);
          color: var(--emerald);
        }
        .kpi-card__icon--amber {
          background: #fdf5e8;
          color: #b45309;
        }
        .kpi-card__icon--purple {
          background: #f3e8ff;
          color: #7e22ce;
        }
        .kpi-card__data {
          display: flex;
          flex-direction: column;
        }
        .kpi-label {
          font-size: 0.78rem;
          color: var(--ink-soft);
          margin-bottom: 2px;
        }
        .kpi-val {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--navy-deep);
          line-height: 1.1;
        }
        .kpi-sub {
          font-size: 0.72rem;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        .overview-split {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 20px;
        }
        .overview-panel {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line);
        }
        .panel-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .panel-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          background: var(--bg-subtle);
          color: var(--ink-soft);
          padding: 3px 8px;
          border-radius: 999px;
        }
        .panel-badge--green {
          background: var(--emerald-bg);
          color: var(--emerald);
          font-weight: 600;
        }

        .category-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 4px;
        }
        .cat-name {
          font-weight: 600;
          color: var(--navy-deep);
        }
        .cat-count {
          color: var(--ink-soft);
          font-family: var(--font-mono);
          font-size: 0.74rem;
        }
        .bar-track {
          height: 7px;
          background: var(--bg-subtle);
          border-radius: 999px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: var(--navy);
          border-radius: 999px;
          transition: width 400ms ease-out;
        }

        .regulatory-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .reg-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .reg-icon {
          color: var(--emerald);
          background: var(--emerald-bg);
          border-radius: 50%;
          padding: 2px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .reg-item strong {
          display: block;
          font-size: 0.84rem;
          color: var(--navy-deep);
          margin-bottom: 2px;
        }
        .reg-item p {
          margin: 0;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        /* CRUD Tables & Toolbar */
        .crud-section {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .crud-toolbar {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .search-input-wrap {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--ink-faint);
        }
        .search-input-wrap input {
          border: none;
          background: transparent;
          width: 100%;
          font-size: 0.88rem;
          color: var(--ink);
          outline: none;
        }

        .filter-select-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--ink-soft);
        }
        .filter-select-wrap select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
          background: #ffffff;
          font-size: 0.84rem;
          color: var(--ink);
          outline: none;
        }

        .add-table-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 9px 16px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
        }
        .add-table-btn:hover {
          background: var(--navy-deep);
        }

        .table-responsive {
          overflow-x: auto;
        }
        .crud-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
          text-align: left;
        }
        .crud-table th {
          background: var(--bg-subtle);
          padding: 12px 14px;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--ink-soft);
          border-bottom: 1px solid var(--line-strong);
          font-family: var(--font-mono);
        }
        .crud-table td {
          padding: 14px;
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }
        .crud-table tr:hover td {
          background: #fbfdfc;
        }

        .code-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: var(--brass-soft);
          color: var(--navy);
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 4px;
        }
        .table-med-name {
          display: block;
          color: var(--navy-deep);
          font-size: 0.9rem;
        }
        .table-med-sub {
          display: block;
          font-size: 0.74rem;
          color: var(--ink-soft);
          margin-top: 2px;
        }
        .category-pill {
          font-size: 0.74rem;
          background: var(--bg-subtle);
          color: var(--ink);
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }
        .table-price-gen {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--emerald);
        }
        .table-price-br {
          font-family: var(--font-mono);
          color: var(--rust);
          text-decoration: line-through;
        }
        .table-savings-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          background: var(--emerald-bg);
          color: var(--emerald);
          padding: 3px 8px;
          border-radius: 999px;
        }
        .table-savings-zero {
          color: var(--ink-faint);
        }

        .store-name-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--navy-deep);
        }
        .store-icon {
          color: var(--brass);
          flex-shrink: 0;
        }
        .table-address {
          font-size: 0.8rem;
          color: var(--ink-soft);
          max-width: 280px;
          display: block;
        }
        .coords-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--navy);
          text-decoration: none;
        }
        .coords-link:hover {
          text-decoration: underline;
        }

        .table-actions {
          display: flex;
          gap: 6px;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--line);
          background: var(--bg-subtle);
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .action-btn--edit:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }
        .action-btn--delete:hover {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }

        .empty-table-cell {
          text-align: center;
          padding: 40px;
          color: var(--ink-soft);
          font-style: italic;
        }

        /* Delete Modal */
        .delete-modal {
          background: #ffffff;
          border-radius: 12px;
          padding: 28px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(10, 38, 33, 0.25);
        }
        .delete-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #fdf2ef;
          color: var(--rust);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .delete-title {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--navy-deep);
        }
        .delete-msg {
          margin: 0 0 24px;
          font-size: 0.88rem;
          color: var(--ink-soft);
          line-height: 1.5;
        }
        .delete-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .btn-delete {
          background: var(--rust);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-delete:hover:not(:disabled) {
          background: #8e351d;
        }
        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
