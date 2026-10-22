import { useState } from "react";
import { X, MapPin, Phone, ExternalLink, Navigation, Search } from "lucide-react";

export default function StoreDrawer({ open, stores, medicineName, locating, onClose }) {
  const [filterQuery, setFilterQuery] = useState("");

  if (!open) return null;

  const filteredStores = (stores || []).filter((s) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.state?.toLowerCase().includes(q) ||
      s.address?.toLowerCase().includes(q) ||
      s.pincode?.includes(q)
    );
  });

  return (
    <>
      <div className="drawer-backdrop is-open" onClick={onClose} />
      <aside className="drawer is-open" aria-hidden={!open} role="dialog" aria-modal="true">
        <div className="drawer__header">
          <div>
            <span className="drawer__eyebrow">Jan Aushadhi Kendra Locator</span>
            <h4 className="drawer__title">
              {medicineName ? `Pharmacies for ${medicineName}` : "Nearby Kendras"}
            </h4>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="Close pharmacy drawer">
            <X size={18} />
          </button>
        </div>

        {/* Search filter within drawer */}
        <div className="drawer__search-box">
          <Search size={14} className="drawer__search-icon" />
          <input
            type="text"
            placeholder="Search by city (e.g. Delhi, Bengaluru, Mumbai)..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="drawer__search-input"
          />
          {filterQuery && (
            <button
              type="button"
              className="drawer__search-clear"
              onClick={() => setFilterQuery("")}
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="drawer__body">
          {locating && (
            <div className="drawer__status">
              <Navigation size={16} className="locating-spin" />
              <span>Acquiring GPS coordinates for nearest distance calculation...</span>
            </div>
          )}

          {!locating && filteredStores.length === 0 && (
            <div className="drawer__empty">
              <p>No Jan Aushadhi Kendras found matching "{filterQuery}".</p>
            </div>
          )}

          <ul className="drawer__list">
            {filteredStores.map((s) => (
              <li key={s._id || s.name} className="store-item">
                <div className="store-item__icon">
                  <MapPin size={16} strokeWidth={2.2} />
                </div>

                <div className="store-item__body">
                  <div className="store-item__header-row">
                    <h5 className="store-item__name">{s.name}</h5>
                    {typeof s.distanceKm === "number" && (
                      <span className="store-item__distance">{s.distanceKm} km away</span>
                    )}
                  </div>

                  <p className="store-item__address">
                    {s.address}, {s.city}, {s.state} {s.pincode ? `- ${s.pincode}` : ""}
                  </p>

                  <div className="store-item__actions-row">
                    {s.phone && (
                      <a href={`tel:${s.phone}`} className="store-action-btn phone">
                        <Phone size={12} /> {s.phone}
                      </a>
                    )}

                    {s.location?.lat && s.location?.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${s.location.lat},${s.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="store-action-btn map"
                      >
                        <Navigation size={12} /> Directions <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <style>{`
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.4);
          z-index: 40;
          animation: fade-in 180ms ease-out;
        }

        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(440px, 100%);
          background: var(--surface);
          box-shadow: var(--shadow-lg);
          z-index: 41;
          display: flex;
          flex-direction: column;
          animation: slide-in 220ms var(--ease, ease-out);
        }

        .drawer__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 22px 22px 16px;
          border-bottom: 1px solid var(--line);
        }
        .drawer__eyebrow {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brass);
          font-weight: 600;
        }
        .drawer__title {
          margin: 4px 0 0;
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .drawer__close {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 6px;
          color: var(--ink-soft);
          cursor: pointer;
          display: flex;
        }
        .drawer__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .drawer__search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-bottom: 1px solid var(--line);
          background: var(--bg-subtle);
        }
        .drawer__search-icon {
          color: var(--ink-faint);
        }
        .drawer__search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.82rem;
          color: var(--ink);
          outline: none;
        }
        .drawer__search-clear {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
        }

        .drawer__body {
          overflow-y: auto;
          padding: 18px 20px 24px;
          flex: 1;
        }
        .drawer__status {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 10px 14px;
          color: var(--navy);
          font-size: 0.82rem;
          margin-bottom: 16px;
        }
        .locating-spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .drawer__empty {
          text-align: center;
          padding: 30px;
          color: var(--ink-soft);
          font-size: 0.86rem;
        }

        .drawer__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .store-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: #ffffff;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }
        .store-item:hover {
          border-color: var(--line-strong);
          box-shadow: var(--shadow-sm);
        }

        .store-item__icon {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: var(--emerald-bg);
          color: var(--emerald);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .store-item__body {
          flex: 1;
          min-width: 0;
        }
        .store-item__header-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }
        .store-item__name {
          margin: 0;
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--navy-deep);
        }
        .store-item__distance {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--emerald);
          background: var(--emerald-bg);
          border-radius: 999px;
          padding: 2px 8px;
          flex-shrink: 0;
        }
        .store-item__address {
          margin: 0 0 10px;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.4;
        }

        .store-item__actions-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .store-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          padding: 4px 8px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 120ms ease;
        }
        .store-action-btn.phone {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          color: var(--ink-soft);
        }
        .store-action-btn.phone:hover {
          background: var(--line);
          color: var(--ink);
        }
        .store-action-btn.map {
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #ffffff;
        }
        .store-action-btn.map:hover {
          background: var(--navy-deep);
        }
      `}</style>
    </>
  );
}
