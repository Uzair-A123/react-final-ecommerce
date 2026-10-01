export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-[92vw] max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        {children}
        <button className="mt-3" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
