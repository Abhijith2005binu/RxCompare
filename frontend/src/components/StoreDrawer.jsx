import { X, MapPin, Phone } from "lucide-react";

export default function StoreDrawer({ open, stores, medicineName, locating, onClose }) {
  return (
    <>
      <div className={`drawer-backdrop ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="drawer__header">
          <div>
            <p className="drawer__eyebrow">Nearest Jan Aushadhi Kendra</p>
            {medicineName && <h4 className="drawer__title">for {medicineName}</h4>}
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer__body">
          {locating && <p className="drawer__status">Locating you…</p>}
          {!locating && stores.length === 0 && (
            <p className="drawer__status">
              No stores found. Try again, or allow location access for distance-sorted results.
            </p>
          )}

          <ul className="drawer__list">
            {stores.map((s) => (
              <li key={s._id || s.name} className="store-item">
                <div className="store-item__icon">
                  <MapPin size={16} strokeWidth={2} />
                </div>
                <div className="store-item__body">
                  <p className="store-item__name">{s.name}</p>
                  <p className="store-item__address">{s.address}</p>
                  {s.phone && (
                    <p className="store-item__phone">
                      <Phone size={12} strokeWidth={2} /> {s.phone}
                    </p>
                  )}
                </div>
                {typeof s.distanceKm === "number" && (
                  <span className="store-item__distance">{s.distanceKm} km</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <style>{`
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease;
          z-index: 30;
        }
        .drawer-backdrop.is-open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(400px, 100%);
          background: var(--surface);
          box-shadow: var(--shadow-lg);
          transform: translateX(100%);
          transition: transform 220ms ease;
          z-index: 31;
          display: flex;
          flex-direction: column;
        }
        .drawer.is-open {
          transform: translateX(0);
        }
        .drawer__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 22px 22px 18px;
          border-bottom: 1px solid var(--line);
        }
        .drawer__eyebrow {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-faint);
        }
        .drawer__title {
          margin: 3px 0 0;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .drawer__close {
          background: var(--bg-subtle);
          border: none;
          border-radius: 8px;
          padding: 6px;
          color: var(--ink-soft);
          cursor: pointer;
          display: flex;
        }
        .drawer__close:hover {
          background: var(--line);
        }
        .drawer__body {
          overflow-y: auto;
          padding: 18px 22px 24px;
        }
        .drawer__status {
          color: var(--ink-soft);
          font-size: 0.88rem;
        }
        .drawer__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .store-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid var(--line);
        }
        .store-item:last-child {
          border-bottom: none;
        }
        .store-item__icon {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
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
        .store-item__name {
          margin: 0;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--ink);
        }
        .store-item__address {
          margin: 2px 0 0;
          font-size: 0.78rem;
          color: var(--ink-soft);
        }
        .store-item__phone {
          margin: 4px 0 0;
          font-size: 0.76rem;
          color: var(--ink-faint);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .store-item__distance {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--navy);
          background: var(--bg-subtle);
          border-radius: 999px;
          padding: 3px 10px;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
