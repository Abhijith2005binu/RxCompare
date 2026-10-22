import { useState } from "react";
import { X, Calculator, ShieldCheck, TrendingUp, MapPin, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SavingsCalculator({ medicine, onClose, onLocateStores }) {
  const { toggleSave, isSaved } = useAuth();
  const [packsPerMonth, setPacksPerMonth] = useState(1);
  const [timeframe, setTimeframe] = useState("annual"); // 'monthly' | 'annual' | '5year'

  if (!medicine) return null;

  const genericPrice = medicine.genericMrp || 0;
  const brandedPrice = medicine.cheapestBrandedMrp || genericPrice * 3; // fallback estimate if no branded price
  const packSavings = Math.max(0, brandedPrice - genericPrice);
  const savingsPct = brandedPrice > 0 ? Math.round((packSavings / brandedPrice) * 100) : 0;

  const monthlyGeneric = genericPrice * packsPerMonth;
  const monthlyBranded = brandedPrice * packsPerMonth;
  const monthlySavings = packSavings * packsPerMonth;

  const annualSavings = monthlySavings * 12;
  const fiveYearSavings = annualSavings * 5;

  const currentSavings =
    timeframe === "monthly"
      ? monthlySavings
      : timeframe === "annual"
      ? annualSavings
      : fiveYearSavings;

  const saved = isSaved(medicine._id);

  return (
    <div className="calc-overlay" onClick={onClose}>
      <div className="calc-modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="calc-close" onClick={onClose} aria-label="Close calculator">
          <X size={18} />
        </button>

        <div className="calc-header">
          <div className="calc-badge">
            <Calculator size={15} />
            <span>Interactive Savings Estimator</span>
          </div>
          <h2 className="calc-title">{medicine.genericName}</h2>
          <p className="calc-meta">
            {medicine.composition} · {medicine.packSize}
          </p>
        </div>

        {/* Prescription Dosage Input */}
        <div className="dosage-section">
          <label className="dosage-label">
            <span>Prescription Consumption:</span>
            <strong>
              {packsPerMonth} {packsPerMonth === 1 ? "pack" : "packs"} / month
            </strong>
          </label>
          <div className="dosage-slider-wrap">
            <input
              type="range"
              min="1"
              max="12"
              value={packsPerMonth}
              onChange={(e) => setPacksPerMonth(Number(e.target.value))}
              className="dosage-slider"
            />
            <div className="slider-ticks">
              <span>1 pack (mild)</span>
              <span>3 packs</span>
              <span>6 packs</span>
              <span>12 packs (family)</span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="timeframe-tabs">
          <button
            type="button"
            className={`time-tab ${timeframe === "monthly" ? "is-active" : ""}`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`time-tab ${timeframe === "annual" ? "is-active" : ""}`}
            onClick={() => setTimeframe("annual")}
          >
            1 Year Savings
          </button>
          <button
            type="button"
            className={`time-tab ${timeframe === "5year" ? "is-active" : ""}`}
            onClick={() => setTimeframe("5year")}
          >
            5-Year Projection
          </button>
        </div>

        {/* Dynamic Big Metric Card */}
        <div className="savings-highlight-card">
          <div className="savings-metric">
            <span className="metric-tag">
              <TrendingUp size={14} /> Total Out-of-Pocket Savings
            </span>
            <div className="metric-figure">₹{currentSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
            <span className="metric-sub">
              You keep {savingsPct}% more money in your household health budget
            </span>
          </div>

          <div className="cost-comparison-row">
            <div className="cost-box cost-box--generic">
              <span className="cost-lbl">Jan Aushadhi Generic</span>
              <span className="cost-val">
                ₹
                {(
                  timeframe === "monthly"
                    ? monthlyGeneric
                    : timeframe === "annual"
                    ? monthlyGeneric * 12
                    : monthlyGeneric * 60
                ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="cost-vs">vs</div>
            <div className="cost-box cost-box--branded">
              <span className="cost-lbl">Branded Equivalent</span>
              <span className="cost-val strike">
                ₹
                {(
                  timeframe === "monthly"
                    ? monthlyBranded
                    : timeframe === "annual"
                    ? monthlyBranded * 12
                    : monthlyBranded * 60
                ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Quality Assurance Note */}
        <div className="quality-card">
          <ShieldCheck size={20} className="quality-icon" />
          <div className="quality-text">
            <strong>Govt. Certified Quality &amp; Efficacy</strong>
            <p>
              Pradhan Mantri Bhartiya Janaushadhi Pariyojana medicines are chemically bioequivalent
              to popular brands, manufactured in WHO-GMP certified facilities, and batch-tested at
              NABL-accredited national laboratories.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="calc-actions">
          <button
            type="button"
            className={`calc-btn calc-btn--save ${saved ? "is-saved" : ""}`}
            onClick={() => toggleSave(medicine)}
          >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
            <span>{saved ? "In Cabinet" : "Save to Cabinet"}</span>
          </button>

          <button
            type="button"
            className="calc-btn calc-btn--locate"
            onClick={() => {
              onClose();
              if (onLocateStores) onLocateStores(medicine);
            }}
          >
            <MapPin size={16} />
            <span>Find Nearest Kendra</span>
          </button>
        </div>
      </div>

      <style>{`
        .calc-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.48);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .calc-modal {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 520px;
          border-radius: var(--radius-lg, 12px);
          padding: 28px 28px 24px;
          box-shadow: 0 24px 64px rgba(10, 38, 33, 0.22);
          border: 1px solid var(--line);
          animation: modal-scale 200ms ease-out forwards;
          max-height: 90vh;
          overflow-y: auto;
        }

        .calc-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--ink-soft);
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calc-close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .calc-header {
          margin-bottom: 20px;
        }
        .calc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--emerald-bg);
          color: var(--emerald);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .calc-title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .calc-meta {
          margin: 0;
          font-size: 0.86rem;
          color: var(--ink-soft);
        }

        .dosage-section {
          background: var(--bg-subtle);
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 16px;
          border: 1px solid var(--line);
        }
        .dosage-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.86rem;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .dosage-label strong {
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.92rem;
        }
        .dosage-slider {
          width: 100%;
          cursor: pointer;
          accent-color: var(--navy);
        }
        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        .timeframe-tabs {
          display: flex;
          background: var(--bg-subtle);
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 18px;
        }
        .time-tab {
          flex: 1;
          padding: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 120ms ease;
        }
        .time-tab.is-active {
          background: #ffffff;
          color: var(--navy-deep);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .savings-highlight-card {
          background: linear-gradient(135deg, #0a2621 0%, #123c33 100%);
          color: #ffffff;
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 18px;
          box-shadow: 0 8px 24px rgba(10, 38, 33, 0.18);
        }
        .savings-metric {
          margin-bottom: 16px;
        }
        .metric-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a4e5c4;
          margin-bottom: 6px;
        }
        .metric-figure {
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .metric-sub {
          display: block;
          font-size: 0.8rem;
          color: #d1e7dd;
          margin-top: 4px;
        }

        .cost-comparison-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 14px;
          gap: 12px;
        }
        .cost-box {
          display: flex;
          flex-direction: column;
        }
        .cost-lbl {
          font-size: 0.72rem;
          color: #a0b8af;
          margin-bottom: 2px;
        }
        .cost-val {
          font-family: var(--font-mono);
          font-size: 1.05rem;
          font-weight: 600;
          color: #ffffff;
        }
        .cost-val.strike {
          text-decoration: line-through;
          color: #f7a894;
        }
        .cost-vs {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #8da39b;
        }

        .quality-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: #f8faf8;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }
        .quality-icon {
          color: var(--emerald);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .quality-text strong {
          display: block;
          font-size: 0.82rem;
          color: var(--navy-deep);
          margin-bottom: 2px;
        }
        .quality-text p {
          margin: 0;
          font-size: 0.76rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        .calc-actions {
          display: flex;
          gap: 10px;
        }
        .calc-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .calc-btn--save {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .calc-btn--save:hover {
          background: var(--line);
        }
        .calc-btn--save.is-saved {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }
        .calc-btn--locate {
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #ffffff;
        }
        .calc-btn--locate:hover {
          background: var(--navy-deep);
        }
      `}</style>
    </div>
  );
}
