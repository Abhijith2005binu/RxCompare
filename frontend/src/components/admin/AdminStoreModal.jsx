import { useState, useEffect } from "react";
import { X, Building2, MapPin, Compass, AlertCircle } from "lucide-react";
import { createStore, updateStore } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const CITY_PRESETS = [
  { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
];

export default function AdminStoreModal({ open, store, onClose, onSuccess }) {
  const { token, showToast } = useAuth();
  const isEdit = Boolean(store && store._id);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (store) {
      setName(store.name || "");
      setAddress(store.address || "");
      setCity(store.city || "");
      setState(store.state || "");
      setPincode(store.pincode || "");
      setPhone(store.phone || "");
      setLat(store.location?.lat?.toString() || "");
      setLng(store.location?.lng?.toString() || "");
    } else {
      setName("");
      setAddress("");
      setCity("Bengaluru");
      setState("Karnataka");
      setPincode("");
      setPhone("");
      setLat("12.9716");
      setLng("77.5946");
    }
    setError(null);
  }, [store, open]);

  if (!open) return null;

  const handleApplyPreset = (preset) => {
    setCity(preset.name);
    setState(preset.state);
    setLat(preset.lat.toString());
    setLng(preset.lng.toString());
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        showToast("Fetched your device coordinates", "info");
      },
      () => {
        setError("Location permission denied or timed out");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const numLat = parseFloat(lat);
      const numLng = parseFloat(lng);

      if (isNaN(numLat) || numLat < -90 || numLat > 90) {
        throw new Error("Latitude must be a valid number between -90 and 90");
      }
      if (isNaN(numLng) || numLng < -180 || numLng > 180) {
        throw new Error("Longitude must be a valid number between -180 and 180");
      }

      const payload = {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),
        location: {
          lat: numLat,
          lng: numLng,
        },
      };

      if (isEdit) {
        await updateStore(store._id, payload, token);
        showToast(`Successfully updated "${payload.name}"`, "success");
      } else {
        await createStore(payload, token);
        showToast(`Successfully registered "${payload.name}"`, "success");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save store location");
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
            <Building2 size={14} />
            <span>{isEdit ? "Edit Kendra Store" : "Register Jan Aushadhi Kendra"}</span>
          </div>
          <h2 className="admin-title">
            {isEdit ? `Update ${store.name}` : "New Jan Aushadhi Kendra"}
          </h2>
          <p className="admin-subtitle">
            Stores appear in the nearby pharmacy locator for patients seeking low-cost generic drugs.
          </p>
        </div>

        {error && (
          <div className="admin-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Coordinate Presets */}
        <div className="presets-wrap">
          <span className="presets-lbl">Quick Presets:</span>
          <div className="presets-btns">
            {CITY_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                className="preset-chip"
                onClick={() => handleApplyPreset(p)}
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              className="preset-chip preset-chip--gps"
              onClick={handleUseCurrentLocation}
            >
              <Compass size={12} /> My GPS
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-field">
            <label>Kendra Store Name *</label>
            <input
              type="text"
              placeholder="e.g. PMBJP Kendra - Government General Hospital"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Full Physical Address *</label>
            <input
              type="text"
              placeholder="e.g. Shop 12, Ground Floor, Civic Centre"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-row form-row--2">
            <div className="form-field">
              <label>City *</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>State *</label>
              <input
                type="text"
                placeholder="e.g. Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row form-row--2">
            <div className="form-field">
              <label>Pincode</label>
              <input
                type="text"
                placeholder="e.g. 560001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Contact Phone</label>
              <input
                type="text"
                placeholder="e.g. 080-22998877"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row form-row--2">
            <div className="form-field">
              <label>Geographic Latitude (-90 to 90) *</label>
              <input
                type="number"
                step="0.0001"
                placeholder="e.g. 12.9716"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Geographic Longitude (-180 to 180) *</label>
              <input
                type="number"
                step="0.0001"
                placeholder="e.g. 77.5946"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving Kendra..." : isEdit ? "Save Changes" : "Register Kendra"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .presets-wrap {
          background: var(--bg-subtle);
          border: 1px dashed var(--line-strong);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }
        .presets-lbl {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .presets-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .preset-chip {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 0.74rem;
          color: var(--ink-soft);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .preset-chip:hover {
          border-color: var(--navy);
          color: var(--navy);
        }
        .preset-chip--gps {
          color: var(--emerald);
          border-color: var(--emerald);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
