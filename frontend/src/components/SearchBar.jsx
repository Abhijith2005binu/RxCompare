import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search size={18} strokeWidth={2} className="search-bar__icon" />
      <input
        id="med-search"
        type="text"
        placeholder="Try “Crocin”, “Storvas”, “Glycomet”, “Azithral”…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        className="search-bar__input"
      />
      <button type="submit" className="search-bar__button" disabled={loading}>
        {loading ? "Checking…" : "Compare price"}
      </button>

      <style>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-lg);
          padding: 6px 6px 6px 16px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 150ms ease, border-color 150ms ease;
        }
        .search-bar:focus-within {
          border-color: var(--navy);
          box-shadow: var(--shadow-md);
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
        .search-bar__button {
          background: var(--navy);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 20px;
          font-weight: 500;
          font-size: 0.88rem;
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
