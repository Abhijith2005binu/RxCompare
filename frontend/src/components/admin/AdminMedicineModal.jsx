import { useState, useEffect } from "react";
import { X, Plus, Trash2, Pill, Sparkles, AlertCircle } from "lucide-react";
import { createMedicine, updateMedicine } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  "General",
  "Pain Relief",
  "Cardiovascular",
  "Diabetes",
  "Antibiotics",
  "Gastrointestinal",
  "Respiratory",
  "Neurology",
  "Vitamins & Supplements",
];

export default function AdminMedicineModal({ open, medicine, onClose, onSuccess }) {
  const { token, showToast } = useAuth();

  const isEdit = Boolean(medicine && medicine._id);

  const [drugCode, setDrugCode] = useState("");
  const [genericName, setGenericName] = useState("");
  const [composition, setComposition] = useState("");
  const [category, setCategory] = useState("General");
  const [packSize, setPackSize] = useState("10 tablets");
  const [genericMrp, setGenericMrp] = useState("");
  const [brandedEquivalents, setBrandedEquivalents] = useState([
    { brandName: "", manufacturer: "", mrp: "" },
  ]);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (medicine) {
      setDrugCode(medicine.drugCode || "");
      setGenericName(medicine.genericName || "");
      setComposition(medicine.composition || "");
      setCategory(medicine.category || "General");
      setPackSize(medicine.packSize || "10 tablets");
      setGenericMrp(medicine.genericMrp?.toString() || "");
      setBrandedEquivalents(
        medicine.brandedEquivalents && medicine.brandedEquivalents.length > 0
          ? medicine.brandedEquivalents.map((b) => ({
              brandName: b.brandName || "",
              manufacturer: b.manufacturer || "",
              mrp: b.mrp?.toString() || "",
            }))
          : [{ brandName: "", manufacturer: "", mrp: "" }]
      );
      setKeywords(
        medicine.searchKeywords && Array.isArray(medicine.searchKeywords)
          ? medicine.searchKeywords.join(", ")
          : ""
      );
    } else {
      // Defaults for new formulation
      setDrugCode(`JAS-${Math.floor(100 + Math.random() * 900)}`);
      setGenericName("");
      setComposition("");
      setCategory("General");
      setPackSize("10 tablets");
      setGenericMrp("");
      setBrandedEquivalents([{ brandName: "", manufacturer: "", mrp: "" }]);
      setKeywords("");
    }
    setError(null);
  }, [medicine, open]);

  if (!open) return null;

  // Add / remove / update branded equivalents
  const handleAddBrand = () => {
    setBrandedEquivalents([...brandedEquivalents, { brandName: "", manufacturer: "", mrp: "" }]);
  };

  const handleRemoveBrand = (index) => {
    if (brandedEquivalents.length <= 1) return;
    setBrandedEquivalents(brandedEquivalents.filter((_, i) => i !== index));
  };

  const handleBrandChange = (index, field, value) => {
    const updated = [...brandedEquivalents];
    updated[index][field] = value;
    setBrandedEquivalents(updated);
  };

  // Compute live savings calculation
  const genPriceNum = parseFloat(genericMrp) || 0;
  const validBrandedMrps = brandedEquivalents
    .map((b) => parseFloat(b.mrp))
    .filter((v) => !isNaN(v) && v > 0);
  const cheapestBrand = validBrandedMrps.length > 0 ? Math.min(...validBrandedMrps) : 0;
  const savingsAmount = cheapestBrand > genPriceNum ? cheapestBrand - genPriceNum : 0;
  const savingsPct = cheapestBrand > 0 ? Math.round((savingsAmount / cheapestBrand) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanGenericMrp = parseFloat(genericMrp);
      if (isNaN(cleanGenericMrp) || cleanGenericMrp <= 0) {
        throw new Error("Jan Aushadhi Generic MRP must be a positive number");
      }

      // Filter and clean branded equivalents
      const cleanBrands = brandedEquivalents
        .filter((b) => b.brandName && b.brandName.trim())
        .map((b) => {
          const mrpNum = parseFloat(b.mrp);
          if (isNaN(mrpNum) || mrpNum <= 0) {
            throw new Error(`Branded equivalent "${b.brandName}" must have a valid positive MRP`);
          }
          return {
            brandName: b.brandName.trim(),
            manufacturer: b.manufacturer ? b.manufacturer.trim() : "Unknown",
            mrp: mrpNum,
          };
        });

      const cleanKeywords = keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        drugCode: drugCode.trim(),
        genericName: genericName.trim(),
        composition: composition.trim(),
        category: category.trim(),
        packSize: packSize.trim(),
        genericMrp: cleanGenericMrp,
        brandedEquivalents: cleanBrands,
        searchKeywords: cleanKeywords,
      };

      if (isEdit) {
        await updateMedicine(medicine._id, payload, token);
        showToast(`Successfully updated "${payload.genericName}"`, "success");
      } else {
        await createMedicine(payload, token);
        showToast(`Added new formulation "${payload.genericName}" to PMBJP catalog`, "success");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save medicine entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="admin-modal__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="admin-modal__header">
          <div className="admin-badge">
            <Pill size={14} />
            <span>{isEdit ? "Edit Formulation" : "Add New Formulation"}</span>
          </div>
          <h2 className="admin-title">
            {isEdit ? `Update ${medicine.genericName}` : "Register Jan Aushadhi Formulation"}
          </h2>
          <p className="admin-subtitle">
            Cataloged medicines are searchable by patients and compared against market brand names.
          </p>
        </div>

        {/* Live Calculation Preview Banner */}
        {cheapestBrand > 0 && (
          <div className="live-preview-banner">
            <Sparkles size={16} />
            <div className="preview-stat">
              <span>Generic Price: <strong>₹{genPriceNum.toFixed(2)}</strong></span>
              <span>Cheapest Branded: <strong>₹{cheapestBrand.toFixed(2)}</strong></span>
              <span>Patient Savings: <strong className="preview-green">₹{savingsAmount.toFixed(2)} ({savingsPct}%)</strong></span>
            </div>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row form-row--2">
            <div className="form-field">
              <label>PMBJP Drug Code *</label>
              <input
                type="text"
                placeholder="e.g. JAS-017"
                value={drugCode}
                onChange={(e) => setDrugCode(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Therapeutic Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Generic Name &amp; Strength *</label>
            <input
              type="text"
              placeholder="e.g. Paracetamol 650mg or Atorvastatin 10mg"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Active Chemical Composition *</label>
            <input
              type="text"
              placeholder="e.g. Paracetamol IP 650mg"
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              required
            />
          </div>

          <div className="form-row form-row--2">
            <div className="form-field">
              <label>Standard Pack Size *</label>
              <input
                type="text"
                placeholder="e.g. 10 tablets, 15 capsules, 100ml"
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Jan Aushadhi Generic MRP (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                placeholder="e.g. 18.50"
                value={genericMrp}
                onChange={(e) => setGenericMrp(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dynamic Branded Competitors Section */}
          <div className="branded-section">
            <div className="branded-section__header">
              <div>
                <label className="branded-title">Branded Competitor Equivalents</label>
                <p className="branded-desc">Add popular commercial brand names prescribed by doctors</p>
              </div>
              <button
                type="button"
                className="add-brand-btn"
                onClick={handleAddBrand}
              >
                <Plus size={14} /> Add Brand
              </button>
            </div>

            <div className="branded-list">
              {brandedEquivalents.map((brand, idx) => (
                <div key={idx} className="brand-row">
                  <div className="brand-col flex-2">
                    <input
                      type="text"
                      placeholder="Brand Name (e.g. Dolo 650)"
                      value={brand.brandName}
                      onChange={(e) => handleBrandChange(idx, "brandName", e.target.value)}
                    />
                  </div>
                  <div className="brand-col flex-2">
                    <input
                      type="text"
                      placeholder="Manufacturer (e.g. Micro Labs)"
                      value={brand.manufacturer}
                      onChange={(e) => handleBrandChange(idx, "manufacturer", e.target.value)}
                    />
                  </div>
                  <div className="brand-col flex-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      placeholder="MRP (₹)"
                      value={brand.mrp}
                      onChange={(e) => handleBrandChange(idx, "mrp", e.target.value)}
                    />
                  </div>
                  {brandedEquivalents.length > 1 && (
                    <button
                      type="button"
                      className="brand-del-btn"
                      onClick={() => handleRemoveBrand(idx)}
                      title="Remove Brand"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Search Keywords (Comma Separated)</label>
            <input
              type="text"
              placeholder="e.g. dolo, crocin, fever, pain, calpol"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <small className="field-hint">
              Entering keywords allows patients to find this formulation even if they type common nicknames.
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving Formulation..." : isEdit ? "Save Changes" : "Create Formulation"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.45);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .admin-modal {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 620px;
          border-radius: var(--radius-lg, 12px);
          padding: 30px;
          box-shadow: 0 20px 60px rgba(10, 38, 33, 0.22);
          border: 1px solid var(--line);
          max-height: 90vh;
          overflow-y: auto;
          animation: modal-scale 180ms ease-out;
        }

        .admin-modal__close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--ink-soft);
          padding: 6px;
          cursor: pointer;
        }
        .admin-modal__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .admin-modal__header {
          margin-bottom: 20px;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--brass-soft);
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .admin-title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .admin-subtitle {
          margin: 0;
          font-size: 0.84rem;
          color: var(--ink-soft);
        }

        .live-preview-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f1f8f4;
          border: 1px solid #cce8d8;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 18px;
          color: var(--emerald);
        }
        .preview-stat {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 0.8rem;
          color: var(--ink);
        }
        .preview-green {
          color: var(--emerald);
        }

        .admin-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fdf2ef;
          border: 1px solid var(--rust);
          color: var(--rust);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin-bottom: 16px;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          gap: 14px;
        }
        .form-row--2 > * {
          flex: 1;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink);
        }
        .form-field input,
        .form-field select {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
          background: #ffffff;
          font-family: inherit;
          font-size: 0.88rem;
          color: var(--ink);
          outline: none;
        }
        .form-field input:focus,
        .form-field select:focus {
          border-color: var(--navy);
          box-shadow: 0 0 0 2px rgba(18, 60, 51, 0.1);
        }
        .field-hint {
          font-size: 0.74rem;
          color: var(--ink-faint);
          margin-top: 2px;
        }

        .branded-section {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px;
        }
        .branded-section__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .branded-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .branded-desc {
          margin: 2px 0 0;
          font-size: 0.74rem;
          color: var(--ink-soft);
        }
        .add-brand-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
        }
        .add-brand-btn:hover {
          background: var(--brass-soft);
        }

        .branded-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .brand-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .brand-col.flex-2 {
          flex: 2;
        }
        .brand-col.flex-1 {
          flex: 1;
        }
        .brand-col input {
          width: 100%;
          padding: 8px 10px;
          font-size: 0.84rem;
          border-radius: 6px;
          border: 1px solid var(--line-strong);
          outline: none;
        }
        .brand-col input:focus {
          border-color: var(--navy);
        }
        .brand-del-btn {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          padding: 6px;
        }
        .brand-del-btn:hover {
          color: var(--rust);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .btn-cancel {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
        }
        .btn-cancel:hover {
          background: var(--line);
        }
        .btn-save {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 22px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .btn-save:hover:not(:disabled) {
          background: var(--navy-deep);
        }
        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
