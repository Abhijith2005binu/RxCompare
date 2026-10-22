import { useState } from "react";
import { Pill, Heart, Shield, User, LogIn, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Nav({
  activeView,
  onViewChange,
  onOpenCabinet,
}) {
  const { user, isAuthenticated, isAdmin, savedMedicines, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const savedCount = (savedMedicines || []).length;

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Brand */}
        <div className="nav__brand" onClick={() => onViewChange("app")} role="button" tabIndex={0}>
          <span className="nav__mark">
            <img src="/logo.png" alt="RxCompare logo" className="nav__logo-img" />
          </span>
          <div className="nav__title-group">
            <span className="nav__word">RxCompare</span>
            <span className="nav__subword">SDG 3 · Good Health</span>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="nav__links">
          <button
            type="button"
            className={`nav__link ${activeView === "app" ? "is-active" : ""}`}
            onClick={() => onViewChange("app")}
          >
            <Pill size={15} />
            <span>Compare Prices</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              className={`nav__link nav__link--admin ${activeView === "admin" ? "is-active" : ""}`}
              onClick={() => onViewChange("admin")}
            >
              <LayoutDashboard size={15} />
              <span>Admin Portal</span>
              <span className="nav__admin-badge">Admin</span>
            </button>
          )}
        </nav>

        {/* Right Action Items */}
        <div className="nav__actions">
          {/* My Cabinet Button */}
          <button
            type="button"
            className="cabinet-trigger-btn"
            onClick={onOpenCabinet}
            title="Open Saved Prescription Cabinet"
          >
            <Heart size={16} fill={savedCount > 0 ? "var(--rust)" : "none"} color={savedCount > 0 ? "var(--rust)" : "currentColor"} />
            <span className="cabinet-lbl">Cabinet</span>
            {savedCount > 0 && <span className="cabinet-counter">{savedCount}</span>}
          </button>

          {/* User Auth Profile / Sign In */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="user-meta-wrap">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role-badge ${isAdmin ? "is-admin" : "is-user"}`}>
                    {isAdmin ? "Admin" : "Patient"}
                  </span>
                </div>
                <ChevronDown size={14} className="user-caret" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="menu-backdrop" onClick={() => setDropdownOpen(false)} />
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <strong>{user.name}</strong>
                      <span className="dropdown-email">{user.email}</span>
                    </div>

                    <div className="dropdown-links">
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenCabinet();
                        }}
                      >
                        <Heart size={15} />
                        <span>Saved Cabinet ({savedCount})</span>
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false);
                            onViewChange("admin");
                          }}
                        >
                          <LayoutDashboard size={15} />
                          <span>Admin Authority Console</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="dropdown-item logout"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="signin-nav-btn"
              onClick={() => openAuthModal("login")}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .nav__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .nav__mark {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .nav__logo-img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        .nav__title-group {
          display: flex;
          flex-direction: column;
        }
        .nav__word {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.01em;
          color: var(--navy-deep);
          line-height: 1.1;
        }
        .nav__subword {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav__links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav__link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .nav__link:hover {
          color: var(--navy-deep);
          background: var(--bg-subtle);
        }
        .nav__link.is-active {
          color: var(--navy);
          background: #ffffff;
          border-color: var(--line-strong);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .nav__link--admin {
          color: var(--navy);
        }
        .nav__admin-badge {
          background: var(--brass-soft);
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 999px;
          font-weight: 600;
        }

        .nav__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cabinet-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy-deep);
          cursor: pointer;
          transition: all 140ms ease;
        }
        .cabinet-trigger-btn:hover {
          background: var(--line);
        }
        .cabinet-counter {
          background: var(--rust);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 999px;
          font-weight: 700;
        }

        .signin-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .signin-nav-btn:hover {
          background: var(--navy-deep);
        }

        .user-profile-menu {
          position: relative;
        }
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 4px 10px 4px 4px;
          cursor: pointer;
          transition: border-color 140ms ease;
        }
        .user-profile-btn:hover {
          border-color: var(--line-strong);
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--navy);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .user-meta-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy-deep);
          max-width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 999px;
        }
        .user-role-badge.is-admin {
          background: var(--brass-soft);
          color: var(--navy);
        }
        .user-role-badge.is-user {
          background: var(--emerald-bg);
          color: var(--emerald);
        }
        .user-caret {
          color: var(--ink-faint);
        }

        .menu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 40;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(10, 38, 33, 0.15);
          width: 220px;
          z-index: 41;
          padding: 8px 0;
          animation: modal-scale 120ms ease-out;
        }
        .dropdown-header {
          padding: 8px 16px 10px;
          border-bottom: 1px solid var(--line);
        }
        .dropdown-header strong {
          display: block;
          font-size: 0.86rem;
          color: var(--navy-deep);
        }
        .dropdown-email {
          display: block;
          font-size: 0.74rem;
          color: var(--ink-faint);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-links {
          padding: 6px 0 0;
        }
        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: none;
          border: none;
          font-size: 0.84rem;
          color: var(--ink-soft);
          cursor: pointer;
          transition: background 120ms ease;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--bg-subtle);
          color: var(--ink);
        }
        .dropdown-item.logout {
          color: var(--rust);
          border-top: 1px solid var(--line);
          margin-top: 4px;
          padding-top: 10px;
        }
        .dropdown-item.logout:hover {
          background: #fdf2ef;
        }

        @media (max-width: 640px) {
          .nav__subword { display: none; }
          .cabinet-lbl { display: none; }
          .user-name { display: none; }
        }
      `}</style>
    </header>
  );
}
