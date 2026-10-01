export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      {children}
    </div>
  );
}
