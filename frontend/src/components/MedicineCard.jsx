import { MapPin } from "lucide-react";

export default function MedicineCard({ medicine, onLocateStores, index = 0 }) {
  const cheapestBranded = medicine.cheapestBrandedMrp;
  const savings = cheapestBranded ? cheapestBranded - medicine.genericMrp : null;
  const savingsPct = cheapestBranded ? Math.round((savings / cheapestBranded) * 100) : null;

  return (
    <article className="med-card" style={{ animationDelay: `${index * 60}ms` }}>
      {savingsPct !== null && (
        <div className="med-card__ribbon" aria-label={`Save ${savingsPct} percent`}>
          <span>save {savingsPct}%</span>
        </div>
      )}

      <p className="med-card__eyebrow">{medicine.category || "Generic"}</p>
      <h3 className="med-card__title">{medicine.genericName}</h3>
      <p className="med-card__meta">
        {medicine.composition} · {medicine.packSize} · <span className="mono">{medicine.drugCode}</span>
      </p>

      <div className="med-card__prices">
        <div className="price-block price-block--generic">
          <span className="price-block__label">Jan Aushadhi</span>
          <span className="price-block__value">₹{medicine.genericMrp.toFixed(2)}</span>
        </div>
        <div className="price-block price-block--branded">
          <span className="price-block__label">Branded, from</span>
          <span className="price-block__value price-block__value--strike">
            ₹{cheapestBranded ? cheapestBranded.toFixed(2) : "—"}
          </span>
        </div>
      </div>

      {medicine.brandedEquivalents?.length > 0 && (
        <ul className="med-card__brands">
          {medicine.brandedEquivalents.map((b) => (
            <li key={b.brandName}>
              <span>{b.brandName}</span>
              <span className="mono">₹{b.mrp.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <button className="med-card__cta" onClick={() => onLocateStores(medicine)}>
        <MapPin size={15} strokeWidth={2} />
        Find nearest Kendra
      </button>

      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .med-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-6) var(--space-4);
          box-shadow: var(--shadow-sm);
          transition: box-shadow var(--duration-base) var(--ease), transform var(--duration-base) var(--ease);
          animation: card-in var(--duration-base) var(--ease) backwards;
        }
        .med-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .med-card__ribbon {
          position: absolute;
          top: var(--space-4);
          right: -1px;
          background: var(--navy);
          color: var(--brass-soft);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.03em;
          font-weight: 500;
          padding: var(--space-1) var(--space-3) var(--space-1) var(--space-4);
          border-radius: 999px 0 0 999px;
        }

        .med-card__eyebrow {
          margin: 0 0 var(--space-1);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--brass);
          font-weight: 600;
        }
        .med-card__title {
          margin: 0 0 var(--space-2);
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--navy-deep);
          max-width: 80%;
        }
        .med-card__meta {
          margin: 0 0 var(--space-4);
          font-size: var(--text-sm);
          color: var(--ink-soft);
        }
        .mono {
          font-family: var(--font-mono);
        }

        .med-card__prices {
          display: flex;
          gap: var(--space-6);
          padding: var(--space-4) 0;
          margin-bottom: var(--space-4);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .price-block {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .price-block__label {
          font-size: var(--text-xs);
          color: var(--ink-faint);
        }
        .price-block__value {
          font-family: var(--font-mono);
          font-size: var(--text-lg);
          font-weight: 600;
        }
        .price-block--generic .price-block__value { color: var(--emerald); }
        .price-block--branded .price-block__value--strike {
          color: var(--rust);
          text-decoration: line-through;
          text-decoration-color: var(--rust);
          font-size: var(--text-base);
          font-weight: 500;
        }

        .med-card__brands {
          list-style: none;
          margin: 0 0 var(--space-4);
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .med-card__brands li {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-sm);
          color: var(--ink-soft);
        }

        .med-card__cta {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          justify-content: center;
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
          border-radius: 8px;
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          font-weight: 500;
          cursor: pointer;
          transition: background var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease);
        }
        .med-card__cta:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #fff;
        }
      `}</style>
    </article>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <style>{`
        .skeleton-card {
          height: 220px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--line);
          background: linear-gradient(90deg, var(--bg-subtle) 25%, var(--line) 50%, var(--bg-subtle) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
      `}</style>
    </div>
  );
}
