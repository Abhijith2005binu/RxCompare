import SearchBar from "./SearchBar.jsx";

export default function Hero({ onSearch, loading, stats }) {
  return (
    <section className="hero">
      <div className="hero__inner">
        <p className="hero__eyebrow">Pradhan Mantri Bhartiya Janaushadhi Pariyojana</p>
        <h1 className="hero__title">
          The same medicine, <em>a fraction</em> of the price.
        </h1>
        <p className="hero__subtitle">
          Enter the branded name from your prescription. We match it to its government-listed
          generic equivalent, show the exact price gap, and find the nearest Jan Aushadhi Kendra
          that stocks it.
        </p>

        <div className="hero__search">
          <SearchBar onSearch={onSearch} loading={loading} />
        </div>

        {stats && (
          <dl className="hero__stats">
            <div className="hero__stat">
              <dt>Formulations indexed</dt>
              <dd>{stats.medicineCount}</dd>
            </div>
            <div className="hero__stat">
              <dt>Average saving</dt>
              <dd>{stats.avgSavingsPct}%</dd>
            </div>
            <div className="hero__stat">
              <dt>Kendras listed</dt>
              <dd>{stats.storeCount}</dd>
            </div>
          </dl>
        )}
      </div>

      <style>{`
        .hero {
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--line);
        }
        .hero__inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 24px 40px;
        }
        .hero__eyebrow {
          margin: 0 0 14px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brass);
          font-weight: 600;
        }
        .hero__title {
          margin: 0 0 16px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(2rem, 5vw, 2.9rem);
          line-height: 1.12;
          letter-spacing: -0.01em;
          color: var(--navy-deep);
        }
        .hero__title em {
          font-style: italic;
          color: var(--navy);
        }
        .hero__subtitle {
          margin: 0 0 32px;
          color: var(--ink-soft);
          font-size: 1.02rem;
          max-width: 54ch;
          line-height: 1.6;
        }
        .hero__search {
          margin-bottom: 36px;
        }
        .hero__stats {
          display: flex;
          gap: 0;
          margin: 0;
          border-top: 1px solid var(--line-strong);
          padding-top: 20px;
        }
        .hero__stat {
          flex: 1;
          padding-right: 20px;
        }
        .hero__stat:not(:last-child) {
          border-right: 1px solid var(--line);
          margin-right: 20px;
        }
        .hero__stat dt {
          font-size: 0.74rem;
          color: var(--ink-faint);
          margin-bottom: 4px;
        }
        .hero__stat dd {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.5rem;
          color: var(--navy);
        }
        @media (max-width: 560px) {
          .hero__stats { flex-direction: column; gap: 14px; }
          .hero__stat { border-right: none !important; margin-right: 0 !important; padding-right: 0; }
        }
      `}</style>
    </section>
  );
}
