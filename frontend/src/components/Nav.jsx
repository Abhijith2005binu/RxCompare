import { Pill } from "lucide-react";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
      
      <span className="nav__mark">
        <img src="/logo.png" alt="RxCompare logo" className="nav__logo-img" />
      </span>
          <span className="nav__word">RxCompare</span>
        </div>
        <span className="nav__pill">PMBJP-aligned pricing</span>
      </div>

      <style>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--line);
        }
        .nav__inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav__brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .nav__mark {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: none;      
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .nav__word {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
          color: var(--navy-deep);
        }
        .nav__logo-img {
          width: 26px;
          height: 26px;
          object-fit: contain;
        }
        .nav__pill {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-soft);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 5px 11px;
        }
        @media (max-width: 560px) {
          .nav__pill { display: none; }
        }
      `}</style>
    </header>
  );
}
