import { useState } from "react";
import { X, Heart, Trash2, MapPin, Copy, Check, Calculator, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SavedCabinet({ open, onClose, onLocateStores, onOpenCalculator }) {
  const { savedMedicines, toggleSave, showToast, isAuthenticated, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  // Filter valid medicine objects (in case IDs were not populated)
  const items = (savedMedicines || []).filter((m) => m && typeof m === "object" && m.genericName);

  // Compute total monthly savings for 1 pack of each saved medicine
  let totalGeneric = 0;
  let totalBranded = 0;

  items.forEach((m) => {
    const gen = m.genericMrp || 0;
    const br = m.cheapestBrandedMrp || (m.brandedEquivalents?.[0]?.mrp || gen * 2.5);
    totalGeneric += gen;
    totalBranded += br;
  });

  const totalMonthlySavings = Math.max(0, totalBranded - totalGeneric);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const overallSavingsPct = totalBranded > 0 ? Math.round((totalMonthlySavings / totalBranded) * 100) : 0;

  const handleCopySummary = () => {
    if (items.length === 0) return;

    let text = "🏥 My RxCompare Prescription Cabinet Summary\n\n";
    items.forEach((m, idx) => {
      const gen = m.genericMrp?.toFixed(2);
      const br = (m.cheapestBrandedMrp || m.brandedEquivalents?.[0]?.mrp)?.toFixed(2) || "N/A";
      text += `${idx + 1}. ${m.genericName} (${m.drugCode})\n`;
      text += `   Composition: ${m.composition} | Pack: ${m.packSize}\n`;
      text += `   Jan Aushadhi Generic: ₹${gen} (Branded: ₹${br})\n\n`;
    });

    text += `💰 Total Routine Generic Cost: ₹${totalGeneric.toFixed(2)}\n`;
    text += `💎 Total Routine Branded Cost: ₹${totalBranded.toFixed(2)}\n`;
    text += `🎉 Monthly Savings: ₹${totalMonthlySavings.toFixed(2)} (${overallSavingsPct}% savings)\n`;
    text += `📈 Annual Savings: ₹${totalAnnualSavings.toFixed(2)}\n`;
    text += `\nPowered by RxCompare — Aligned with PMBJP & SDG 3`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Prescription summary copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <div className="cabinet-backdrop" onClick={onClose} />
      <aside className="cabinet-drawer" role="dialog" aria-modal="true">
        <div className="cabinet__header">
          <div>
            <div className="cabinet__eyebrow">
              <Heart size={14} fill="currentColor" color="var(--rust)" />
              <span>Personal Medicine Cabinet</span>
            </div>
            <h3 className="cabinet__title">Saved Prescriptions ({items.length})</h3>
          </div>
          <button className="cabinet__close" onClick={onClose} aria-label="Close cabinet">
            <X size={18} />
          </button>
        </div>

        {!isAuthenticated && (
          <div className="guest-sync-banner">
            <p>
              Browsing as guest. <strong>Sign in</strong> to sync your prescriptions across devices.
            </p>
            <button
              type="button"
              className="guest-sync-btn"
              onClick={() => {
                onClose();
                openAuthModal("login");
              }}
            >
              Sign In
            </button>
          </div>
        )}

        {items.length > 0 && (
          <div className="cabinet__summary-card">
            <div className="summary-col">
              <span className="summary-label">Monthly Routine</span>
              <span className="summary-price generic">₹{totalGeneric.toFixed(2)}</span>
              <span className="summary-price strike">₹{totalBranded.toFixed(2)}</span>
            </div>
            <div className="summary-savings">
              <span className="savings-badge">Save {overallSavingsPct}%</span>
              <span className="savings-val">₹{totalMonthlySavings.toFixed(2)} / mo</span>
              <span className="savings-ann">₹{totalAnnualSavings.toFixed(0)} / yr</span>
            </div>
          </div>
        )}

        <div className="cabinet__body">
          {items.length === 0 ? (
            <div className="cabinet__empty">
              <div className="empty-icon">
                <Heart size={28} />
              </div>
              <h4>Your cabinet is empty</h4>
              <p>
                Search for any medicine and tap the heart icon to save it here for consolidated
                monthly savings and pharmacy locating.
              </p>
            </div>
          ) : (
            <ul className="cabinet__list">
              {items.map((m) => {
                const gen = m.genericMrp || 0;
                const br = m.cheapestBrandedMrp || m.brandedEquivalents?.[0]?.mrp || gen * 2.5;
                const sav = Math.max(0, br - gen);

                return (
                  <li key={m._id} className="cabinet-item">
                    <div className="cabinet-item__info">
                      <div className="cabinet-item__tag">{m.drugCode}</div>
                      <h4 className="cabinet-item__title">{m.genericName}</h4>
                      <p className="cabinet-item__meta">
                        {m.composition} · {m.packSize}
                      </p>
                      <div className="cabinet-item__prices">
                        <span className="price-gen">₹{gen.toFixed(2)}</span>
                        <span className="price-br">₹{br.toFixed(2)}</span>
                        <span className="price-sav">Save ₹{sav.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="cabinet-item__actions">
                      <button
                        type="button"
                        className="act-btn locate"
                        title="Locate Kendra"
                        onClick={() => {
                          onClose();
                          if (onLocateStores) onLocateStores(m);
                        }}
                      >
                        <MapPin size={15} />
                      </button>
                      <button
                        type="button"
                        className="act-btn calc"
                        title="Calculate Savings"
                        onClick={() => {
                          onClose();
                          if (onOpenCalculator) onOpenCalculator(m);
                        }}
                      >
                        <Calculator size={15} />
                      </button>
                      <button
                        type="button"
                        className="act-btn remove"
                        title="Remove from cabinet"
                        onClick={() => toggleSave(m)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cabinet__footer">
            <button
              type="button"
              className="copy-summary-btn"
              onClick={handleCopySummary}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied Prescription!" : "Copy Cabinet Summary"}</span>
            </button>
          </div>
        )}
      </aside>

      <style>{`
        .cabinet-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.4);
          z-index: 40;
          animation: fade-in 180ms ease-out;
        }

        .cabinet-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(440px, 100%);
          background: #ffffff;
          box-shadow: 0 16px 48px rgba(10, 38, 33, 0.22);
          z-index: 41;
          display: flex;
          flex-direction: column;
          animation: slide-in 220ms var(--ease, ease-out);
        }

        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cabinet__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 22px 22px 16px;
          border-bottom: 1px solid var(--line);
        }
        .cabinet__eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-faint);
          margin-bottom: 4px;
        }
        .cabinet__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.28rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .cabinet__close {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 6px;
          color: var(--ink-soft);
          cursor: pointer;
          display: flex;
        }
        .cabinet__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .guest-sync-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #fdfaf3;
          border-bottom: 1px solid #ebd9bf;
          padding: 10px 20px;
          font-size: 0.78rem;
          color: #7d571f;
        }
        .guest-sync-banner p {
          margin: 0;
          line-height: 1.35;
        }
        .guest-sync-btn {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }

        .cabinet__summary-card {
          margin: 16px 20px 0;
          background: linear-gradient(135deg, #0a2621 0%, #123c33 100%);
          color: #ffffff;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 14px rgba(10, 38, 33, 0.12);
        }
        .summary-col {
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          text-transform: uppercase;
          color: #a0b8af;
          margin-bottom: 2px;
        }
        .summary-price.generic {
          font-family: var(--font-mono);
          font-size: 1.25rem;
          font-weight: 700;
          color: #a4e5c4;
        }
        .summary-price.strike {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          text-decoration: line-through;
          color: #f7a894;
        }

        .summary-savings {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .savings-badge {
          background: rgba(164, 229, 196, 0.2);
          color: #a4e5c4;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 2px;
        }
        .savings-val {
          font-family: var(--font-mono);
          font-size: 0.96rem;
          font-weight: 600;
          color: #ffffff;
        }
        .savings-ann {
          font-size: 0.7rem;
          color: #c7ded4;
        }

        .cabinet__body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }

        .cabinet__empty {
          text-align: center;
          padding: 60px 16px;
          color: var(--ink-soft);
        }
        .empty-icon {
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
        .cabinet__empty h4 {
          margin: 0 0 8px;
          font-size: 1.05rem;
          color: var(--navy-deep);
        }
        .cabinet__empty p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          max-width: 32ch;
          margin: 0 auto;
        }

        .cabinet__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cabinet-item {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          transition: box-shadow 150ms ease, border-color 150ms ease;
        }
        .cabinet-item:hover {
          border-color: var(--line-strong);
          box-shadow: var(--shadow-sm);
        }

        .cabinet-item__info {
          flex: 1;
          min-width: 0;
        }
        .cabinet-item__tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--brass);
          font-weight: 600;
          margin-bottom: 2px;
        }
        .cabinet-item__title {
          margin: 0 0 3px;
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--navy-deep);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cabinet-item__meta {
          margin: 0 0 6px;
          font-size: 0.74rem;
          color: var(--ink-soft);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cabinet-item__prices {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
        }
        .price-gen {
          color: var(--emerald);
          font-weight: 700;
        }
        .price-br {
          color: var(--rust);
          text-decoration: line-through;
        }
        .price-sav {
          color: var(--navy);
          background: var(--bg-subtle);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.68rem;
        }

        .cabinet-item__actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .act-btn {
          width: 28px;
          height: 28px;
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
        .act-btn.locate:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }
        .act-btn.calc:hover {
          background: var(--brass-soft);
          border-color: var(--brass);
          color: var(--brass);
        }
        .act-btn.remove:hover {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }

        .cabinet__footer {
          padding: 14px 20px;
          border-top: 1px solid var(--line);
          background: var(--bg-subtle);
        }
        .copy-summary-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 11px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 140ms ease;
        }
        .copy-summary-btn:hover {
          background: var(--navy-deep);
        }
      `}</style>
    </>
  );
}
