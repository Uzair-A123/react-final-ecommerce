export default function Footer() {
  return (
    <footer className="border-t border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-slate-700">
      © {new Date().getFullYear()} E-Store. Built with React.
    </footer>
  );
}
