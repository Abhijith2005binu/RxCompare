import SearchBar from "./SearchBar.jsx";
import { Sparkles, SlidersHorizontal } from "lucide-react";

const POPULAR_SEARCHES = [
  "Crocin",
  "Storvas",
  "Glycomet",
  "Azithral",
  "Combiflam",
  "Pantocid",
  "Telma",
  "Augmentin",
];

const CATEGORIES = [
  "All",
  "Pain Relief",
  "Cardiovascular",
  "Diabetes",
  "Antibiotics",
  "Gastrointestinal",
];

export default function Hero({
  onSearch,
  loading,
  stats,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__badge-strip">
          <span className="hero__eyebrow">
            Pradhan Mantri Bhartiya Janaushadhi Pariyojana
          </span>
          <span className="hero__sdg-tag">SDG 3</span>
        </div>

        <h1 className="hero__title">
          The same medicine, <em>a fraction</em> of the price.
        </h1>
        <p className="hero__subtitle">
          Type the <strong>branded medicine name</strong> prescribed by your doctor. We match it to the
          government-listed Jan Aushadhi generic equivalent, verify identical composition, and locate
          nearest stocking Kendras.
        </p>

        {/* Search Bar Container */}
        <div className="hero__search">
          <SearchBar onSearch={onSearch} loading={loading} initialValue={searchQuery} />
        </div>

        {/* Popular Medicine Search Chips */}
        <div className="hero__quick-chips">
          <span className="quick-chips__lbl">
            <Sparkles size={13} /> Popular Inquiries:
          </span>
          <div className="quick-chips__list">
            {POPULAR_SEARCHES.map((brand) => (
              <button
                key={brand}
                type="button"
                className={`quick-chip ${searchQuery.toLowerCase() === brand.toLowerCase() ? "is-active" : ""}`}
                onClick={() => onSearch(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorters Bar */}
        <div className="hero__filter-bar">
          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${selectedCategory === cat ? "is-active" : ""}`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-dropdown-wrap">
            <SlidersHorizontal size={14} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select"
              aria-label="Sort medicines by"
            >
              <option value="savings-desc">Highest Savings %</option>
              <option value="price-asc">Lowest Generic Price</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Platform Catalog Stats */}
        {stats && (
          <dl className="hero__stats">
            <div className="hero__stat">
              <dt>Formulations Indexed</dt>
              <dd>{stats.medicineCount}</dd>
            </div>
            <div className="hero__stat">
              <dt>Average Patient Saving</dt>
              <dd>{stats.avgSavingsPct}%</dd>
            </div>
            <div className="hero__stat">
              <dt>Jan Aushadhi Kendras</dt>
              <dd>{stats.storeCount}</dd>
            </div>
          </dl>
        )}
      </div>

      <style>{`
        .hero {
          background: radial-gradient(circle at top left, #ffffff 0%, var(--bg-subtle) 70%);
          border-bottom: 1px solid var(--line);
        }
        .hero__inner {
          max-width: 820px;
          margin: 0 auto;
          padding: 48px 24px 36px;
        }

        .hero__badge-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .hero__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brass);
          font-weight: 600;
        }
        .hero__sdg-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          background: var(--emerald-bg);
          color: var(--emerald);
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .hero__title {
          margin: 0 0 16px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.1;
          letter-spacing: -0.015em;
          color: var(--navy-deep);
        }
        .hero__title em {
          font-style: italic;
          color: var(--navy);
          text-decoration: underline;
          text-decoration-color: var(--brass-soft);
          text-underline-offset: 6px;
        }
        .hero__subtitle {
          margin: 0 0 28px;
          color: var(--ink-soft);
          font-size: 1.02rem;
          max-width: 58ch;
          line-height: 1.6;
        }

        .hero__search {
          margin-bottom: 16px;
        }

        .hero__quick-chips {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .quick-chips__lbl {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .quick-chips__list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .quick-chip {
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 0.76rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .quick-chip:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }
        .quick-chip.is-active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }

        .hero__filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .category-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .category-chip {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 5px 11px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .category-chip:hover {
          border-color: var(--line-strong);
          color: var(--ink);
        }
        .category-chip.is-active {
          background: #ffffff;
          border-color: var(--navy);
          color: var(--navy);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .sort-dropdown-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          padding: 4px 10px;
        }
        .sort-icon {
          color: var(--ink-faint);
        }
        .sort-select {
          border: none;
          background: transparent;
          font-size: 0.78rem;
          color: var(--ink-soft);
          outline: none;
          font-weight: 500;
          cursor: pointer;
        }

        .hero__stats {
          display: flex;
          gap: 0;
          margin: 0;
          border-top: 1px solid var(--line-strong);
          padding-top: 22px;
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
          font-weight: 700;
          font-size: 1.65rem;
          color: var(--navy-deep);
        }

        @media (max-width: 600px) {
          .hero__stats { flex-direction: column; gap: 14px; }
          .hero__stat { border-right: none !important; margin-right: 0 !important; padding-right: 0; }
          .hero__filter-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
