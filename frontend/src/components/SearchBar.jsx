import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch, loading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  function handleClear() {
    setValue("");
    onSearch("");
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search size={18} strokeWidth={2} className="search-bar__icon" />
      <input
        id="med-search"
        type="text"
        placeholder="Type branded or generic name: “Crocin”, “Storvas”, “Glycomet”, “Azithral”..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        className="search-bar__input"
      />

      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search query"
        >
          <X size={15} />
        </button>
      )}

      <button type="submit" className="search-bar__button" disabled={loading}>
        {loading ? "Comparing..." : "Compare price"}
      </button>

      <style>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-lg, 12px);
          padding: 6px 6px 6px 16px;
          box-shadow: 0 4px 16px rgba(10, 38, 33, 0.06);
          transition: box-shadow 150ms ease, border-color 150ms ease;
        }
        .search-bar:focus-within {
          border-color: var(--navy);
          box-shadow: 0 6px 24px rgba(10, 38, 33, 0.12);
        }
        .search-bar__icon {
          color: var(--ink-faint);
          flex-shrink: 0;
        }
        .search-bar__input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.98rem;
          padding: 10px 0;
          color: var(--ink);
        }
        .search-bar__input::placeholder {
          color: var(--ink-faint);
        }
        .search-bar__input:focus {
          outline: none;
        }

        .search-bar__clear {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .search-bar__clear:hover {
          color: var(--ink);
          background: var(--bg-subtle);
        }

        .search-bar__button {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 11px 22px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 120ms ease;
          flex-shrink: 0;
        }
        .search-bar__button:hover:not(:disabled) {
          background: var(--navy-deep);
        }
        .search-bar__button:disabled {
          opacity: 0.6;
          cursor: default;
        }
        @media (max-width: 480px) {
          .search-bar { flex-wrap: wrap; padding: 10px 12px; }
          .search-bar__button { width: 100%; margin-top: 6px; }
        }
      `}</style>
    </form>
  );
}
