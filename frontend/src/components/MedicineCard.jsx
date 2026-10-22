import { useState } from "react";
import { MapPin, Heart, Calculator, ExternalLink, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MedicineCard({
  medicine,
  onLocateStores,
  onOpenCalculator,
  index = 0,
}) {
  const { toggleSave, isSaved } = useAuth();
  const [showAllBrands, setShowAllBrands] = useState(false);

  const cheapestBranded = medicine.cheapestBrandedMrp;
  const savings = cheapestBranded ? cheapestBranded - medicine.genericMrp : null;
  const savingsPct =
    cheapestBranded && cheapestBranded > medicine.genericMrp
      ? Math.round((savings / cheapestBranded) * 100)
      : null;

  const saved = isSaved(medicine._id);

  const allBrands = medicine.brandedEquivalents || [];
  const displayBrands = showAllBrands ? allBrands : allBrands.slice(0, 3);

  return (
    <article className="med-card" style={{ animationDelay: `${index * 50}ms` }}>
      {savingsPct !== null && (
        <div className="med-card__ribbon" aria-label={`Save ${savingsPct} percent`}>
          <span>SAVE {savingsPct}%</span>
        </div>
      )}

      {/* Header Info */}
      <div className="med-card__top">
        <div className="med-card__header-info">
          <span className="med-card__category">{medicine.category || "General"}</span>
          <h3 className="med-card__title">{medicine.genericName}</h3>
          <p className="med-card__composition">
            {medicine.composition} · {medicine.packSize}
          </p>
        </div>

        {/* Favorite / Cabinet Button */}
        <button
          type="button"
          className={`med-card__fav-btn ${saved ? "is-saved" : ""}`}
          onClick={() => toggleSave(medicine)}
          title={saved ? "Remove from prescription cabinet" : "Save to prescription cabinet"}
          aria-label={saved ? "Remove from cabinet" : "Save to cabinet"}
        >
          <Heart size={18} fill={saved ? "var(--rust)" : "none"} />
        </button>
      </div>

      {/* Drug Code Badge */}
      <div className="med-card__badges">
        <span className="med-code-badge">{medicine.drugCode}</span>
        <span className="med-who-badge">
          <ShieldCheck size={12} /> WHO-GMP Certified
        </span>
      </div>

      {/* Price Comparison Block */}
      <div className="med-card__prices">
        <div className="price-block price-block--generic">
          <span className="price-block__label">Jan Aushadhi Generic</span>
          <span className="price-block__value">₹{medicine.genericMrp.toFixed(2)}</span>
          <span className="price-block__sub">Affordable healthcare rate</span>
        </div>

        <div className="price-divider" />

        <div className="price-block price-block--branded">
          <span className="price-block__label">Market Retail, from</span>
          <span className="price-block__value price-block__value--strike">
            ₹{cheapestBranded ? cheapestBranded.toFixed(2) : "—"}
          </span>
          {savings !== null && savings > 0 && (
            <span className="price-block__diff">Save ₹{savings.toFixed(2)}/pack</span>
          )}
        </div>
      </div>

      {/* Prescribed Branded Equivalents List */}
      {allBrands.length > 0 && (
        <div className="med-card__brands-wrap">
          <span className="brands-title">Common Prescribed Brands:</span>
          <ul className="brands-list">
            {displayBrands.map((b) => (
              <li key={b.brandName} className="brand-item">
                <div className="brand-item__info">
                  <span className="brand-name">{b.brandName}</span>
                  {b.manufacturer && (
                    <span className="brand-maker">({b.manufacturer})</span>
                  )}
                </div>
                <span className="brand-mrp">₹{b.mrp.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {allBrands.length > 3 && (
            <button
              type="button"
              className="toggle-brands-btn"
              onClick={() => setShowAllBrands(!showAllBrands)}
            >
              {showAllBrands ? (
                <>
                  <ChevronUp size={14} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> +{allBrands.length - 3} more brands
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Card Action Buttons */}
      <div className="med-card__footer">
        <button
          type="button"
          className="card-act-btn card-act-btn--calc"
          onClick={() => onOpenCalculator && onOpenCalculator(medicine)}
          title="Calculate monthly & annual savings"
        >
          <Calculator size={15} />
          <span>Savings Calculator</span>
        </button>

        <button
          type="button"
          className="card-act-btn card-act-btn--locate"
          onClick={() => onLocateStores(medicine)}
          title="Find nearest Jan Aushadhi Kendra"
        >
          <MapPin size={15} />
          <span>Find Kendra</span>
        </button>
      </div>

      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .med-card {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg, 12px);
          padding: 20px 20px 18px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 180ms ease, transform 180ms ease, border-color 180ms ease;
          animation: card-in 220ms ease backwards;
          display: flex;
          flex-direction: column;
        }
        .med-card:hover {
          box-shadow: 0 10px 28px rgba(10, 38, 33, 0.1);
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        .med-card__ribbon {
          position: absolute;
          top: 18px;
          right: -1px;
          background: linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 100%);
          color: #a4e5c4;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          font-weight: 700;
          padding: 3px 12px 3px 14px;
          border-radius: 999px 0 0 999px;
          box-shadow: 0 2px 6px rgba(10, 38, 33, 0.12);
        }

        .med-card__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
        }
        .med-card__header-info {
          flex: 1;
          padding-right: 50px; /* space for ribbon */
        }
        .med-card__category {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--brass);
          font-weight: 600;
          margin-bottom: 3px;
        }
        .med-card__title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.22rem;
          font-weight: 600;
          color: var(--navy-deep);
          line-height: 1.25;
        }
        .med-card__composition {
          margin: 0;
          font-size: 0.8rem;
          color: var(--ink-soft);
          line-height: 1.35;
        }

        .med-card__fav-btn {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-faint);
          cursor: pointer;
          transition: all 140ms ease;
          flex-shrink: 0;
        }
        .med-card__fav-btn:hover {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }
        .med-card__fav-btn.is-saved {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }

        .med-card__badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .med-code-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          background: var(--brass-soft);
          color: var(--navy);
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .med-who-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--emerald);
          background: var(--emerald-bg);
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .med-card__prices {
          display: flex;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 16px;
          align-items: center;
        }
        .price-block {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .price-divider {
          width: 1px;
          height: 38px;
          background: var(--line);
          margin: 0 12px;
        }
        .price-block__label {
          font-size: 0.7rem;
          color: var(--ink-faint);
          margin-bottom: 2px;
        }
        .price-block__value {
          font-family: var(--font-mono);
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.1;
        }
        .price-block--generic .price-block__value {
          color: var(--emerald);
        }
        .price-block--branded .price-block__value--strike {
          color: var(--rust);
          text-decoration: line-through;
          font-size: 1.05rem;
        }
        .price-block__sub {
          font-size: 0.68rem;
          color: var(--ink-faint);
          margin-top: 2px;
        }
        .price-block__diff {
          font-size: 0.72rem;
          color: var(--navy);
          font-weight: 600;
          margin-top: 2px;
        }

        .med-card__brands-wrap {
          margin-bottom: 16px;
          flex: 1;
        }
        .brands-title {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .brands-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .brand-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.8rem;
          padding: 4px 6px;
          border-radius: 4px;
          transition: background 120ms ease;
        }
        .brand-item:hover {
          background: var(--bg-subtle);
        }
        .brand-name {
          font-weight: 500;
          color: var(--ink);
        }
        .brand-maker {
          font-size: 0.72rem;
          color: var(--ink-faint);
          margin-left: 4px;
        }
        .brand-mrp {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--ink-soft);
          font-weight: 500;
        }
        .toggle-brands-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--navy);
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 0;
          margin-top: 4px;
        }
        .toggle-brands-btn:hover {
          text-decoration: underline;
        }

        .med-card__footer {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--line);
        }
        .card-act-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .card-act-btn--calc {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .card-act-btn--calc:hover {
          background: var(--brass-soft);
          border-color: var(--brass);
          color: var(--navy);
        }
        .card-act-btn--locate {
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #ffffff;
        }
        .card-act-btn--locate:hover {
          background: var(--navy-deep);
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
          height: 280px;
          border-radius: var(--radius-lg, 12px);
          border: 1px solid var(--line);
          background: linear-gradient(90deg, var(--bg-subtle) 25%, var(--line) 50%, var(--bg-subtle) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
      `}</style>
    </div>
  );
}
