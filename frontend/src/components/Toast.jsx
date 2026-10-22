import { useEffect } from "react";
import { Check, AlertCircle, Sparkles, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className={`toast-container toast--${toast.type || "info"}`} role="alert">
      <div className="toast-icon">
        {isSuccess && <Check size={16} strokeWidth={2.5} />}
        {isError && <AlertCircle size={16} strokeWidth={2.5} />}
        {!isSuccess && !isError && <Sparkles size={16} strokeWidth={2} />}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>

      <style>{`
        @keyframes toast-enter {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 280px;
          max-width: 440px;
          padding: 12px 16px;
          background: #ffffff;
          border-radius: var(--radius-lg, 12px);
          box-shadow: 0 12px 32px rgba(10, 38, 33, 0.16), 0 2px 6px rgba(10, 38, 33, 0.08);
          border: 1px solid var(--line);
          animation: toast-enter 220ms var(--ease, ease-out) forwards;
        }

        .toast--success {
          border-left: 4px solid var(--emerald);
        }
        .toast--success .toast-icon {
          color: var(--emerald);
          background: var(--emerald-bg);
        }

        .toast--error {
          border-left: 4px solid var(--rust);
        }
        .toast--error .toast-icon {
          color: var(--rust);
          background: #fdeee9;
        }

        .toast--info {
          border-left: 4px solid var(--navy);
        }
        .toast--info .toast-icon {
          color: var(--navy);
          background: var(--bg-subtle);
        }

        .toast-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-message {
          flex: 1;
          font-size: 0.88rem;
          color: var(--ink);
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease, background 150ms ease;
        }
        .toast-close:hover {
          color: var(--ink);
          background: var(--bg-subtle);
        }
      `}</style>
    </div>
  );
}
