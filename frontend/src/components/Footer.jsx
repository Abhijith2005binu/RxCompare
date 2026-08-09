export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__disclaimer">
          Generic pricing shown here is sample/demo data — swap in the live PMBJP price list from
          data.gov.in before relying on this for real purchases.
        </p>
        <p className="footer__meta">Built for SDG 3 · Good Health &amp; Well-Being</p>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--line);
          background: var(--bg-subtle);
        }
        .footer__inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 24px 32px;
        }
        .footer__disclaimer {
          margin: 0 0 8px;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.6;
          max-width: 60ch;
        }
        .footer__meta {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
      `}</style>
    </footer>
  );
}
