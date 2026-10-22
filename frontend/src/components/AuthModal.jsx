import { useState, useEffect } from "react";
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, quickLogin } = useAuth();

  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync internal tab with context state
  useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
      setError(null);
    }
  }, [authModalTab, authModalOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password, role);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickDemo(targetRole) {
    setError(null);
    setLoading(true);
    try {
      await quickLogin(targetRole);
    } catch (err) {
      setError(err.message || "Failed to login with demo credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay" onClick={closeAuthModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="auth-modal__close" onClick={closeAuthModal} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div className="auth-modal__header">
          <div className="auth-modal__badge">
            <ShieldCheck size={16} strokeWidth={2.2} />
            <span>Secure Access</span>
          </div>
          <h2 className="auth-modal__title">
            {tab === "login" ? "Welcome back to RxCompare" : "Create your RxCompare Account"}
          </h2>
          <p className="auth-modal__subtitle">
            {tab === "login"
              ? "Access your saved prescriptions and manage generic medicine comparisons."
              : "Compare branded vs generic Jan Aushadhi prices, save prescription cabinets, and locate Kendras."}
          </p>
        </div>

        {/* Demo 1-Click Quick Access Strip */}
        <div className="demo-shortcuts">
          <span className="demo-shortcuts__label">Quick 1-Click Access:</span>
          <div className="demo-shortcuts__buttons">
            <button
              type="button"
              className="demo-btn demo-btn--admin"
              onClick={() => handleQuickDemo("admin")}
              disabled={loading}
            >
              <Sparkles size={14} />
              <span>Demo Admin (Full CRUD)</span>
            </button>
            <button
              type="button"
              className="demo-btn demo-btn--patient"
              onClick={() => handleQuickDemo("user")}
              disabled={loading}
            >
              <UserIcon size={14} />
              <span>Demo Patient</span>
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab ${tab === "login" ? "is-active" : ""}`}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === "register" ? "is-active" : ""}`}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {tab === "register" && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div className="input-wrap">
                <UserIcon size={16} className="input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Dr. Priya Nair or Rahul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {tab === "register" && (
            <div className="form-group">
              <label htmlFor="auth-role">Account Role</label>
              <select
                id="auth-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select-input"
              >
                <option value="user">Patient / Consumer (Compare &amp; Save)</option>
                <option value="admin">Administrator (Manage Catalog &amp; Kendras)</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Processing..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer-note">
          {tab === "login" ? (
            <p>
              Don't have an account yet?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        .auth-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.45);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fade-in 180ms ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-scale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .auth-modal {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 460px;
          border-radius: var(--radius-lg, 12px);
          padding: 32px 32px 28px;
          box-shadow: 0 20px 60px rgba(10, 38, 33, 0.22);
          border: 1px solid var(--line);
          animation: modal-scale 220ms var(--ease, ease-out) forwards;
          max-height: 90vh;
          overflow-y: auto;
        }

        .auth-modal__close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--ink-soft);
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 120ms ease;
        }
        .auth-modal__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .auth-modal__header {
          margin-bottom: 20px;
        }

        .auth-modal__badge {
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
          margin-bottom: 12px;
        }

        .auth-modal__title {
          margin: 0 0 6px;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--navy-deep);
          line-height: 1.25;
        }

        .auth-modal__subtitle {
          margin: 0;
          font-size: 0.86rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        .demo-shortcuts {
          background: var(--bg-subtle);
          border: 1px dashed var(--line-strong);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 18px;
        }
        .demo-shortcuts__label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }
        .demo-shortcuts__buttons {
          display: flex;
          gap: 8px;
        }
        .demo-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          font-size: 0.78rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 150ms ease;
          border: 1px solid var(--line-strong);
          background: #ffffff;
        }
        .demo-btn--admin {
          color: var(--navy);
          border-color: var(--brass);
          background: #fffdf9;
        }
        .demo-btn--admin:hover:not(:disabled) {
          background: var(--brass-soft);
        }
        .demo-btn--patient {
          color: var(--emerald);
          border-color: var(--emerald);
          background: #fbfdfc;
        }
        .demo-btn--patient:hover:not(:disabled) {
          background: var(--emerald-bg);
        }
        .demo-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 16px 0 16px;
          color: var(--ink-faint);
          font-size: 0.74rem;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid var(--line);
        }
        .auth-divider span {
          padding: 0 10px;
        }

        .auth-tabs {
          display: flex;
          background: var(--bg-subtle);
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 20px;
        }
        .auth-tab {
          flex: 1;
          padding: 8px;
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .auth-tab.is-active {
          background: #ffffff;
          color: var(--navy-deep);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .auth-error {
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

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink-soft);
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }
        .input-wrap:focus-within {
          border-color: var(--navy);
          box-shadow: 0 0 0 2px rgba(18, 60, 51, 0.12);
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--ink-faint);
          pointer-events: none;
        }
        .input-wrap input {
          width: 100%;
          border: none;
          background: transparent;
          padding: 10px 38px 10px 36px;
          font-size: 0.9rem;
          color: var(--ink);
          font-family: inherit;
        }
        .input-wrap input:focus {
          outline: none;
        }
        .input-eye {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          display: flex;
          padding: 4px;
        }
        .input-eye:hover {
          color: var(--ink);
        }

        .select-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
          background: #ffffff;
          font-family: inherit;
          font-size: 0.88rem;
          color: var(--ink);
          outline: none;
        }
        .select-input:focus {
          border-color: var(--navy);
        }

        .auth-submit-btn {
          margin-top: 8px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 140ms ease;
        }
        .auth-submit-btn:hover:not(:disabled) {
          background: var(--navy-deep);
        }
        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer-note {
          margin-top: 20px;
          text-align: center;
          font-size: 0.82rem;
          color: var(--ink-soft);
        }
        .auth-footer-note p {
          margin: 0;
        }
        .link-btn {
          background: none;
          border: none;
          color: var(--navy);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
