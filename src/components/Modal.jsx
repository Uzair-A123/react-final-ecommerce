import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-5 py-3 dark:border-slate-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain p-5">{children}</div>
      </div>
    </div>
  );
}