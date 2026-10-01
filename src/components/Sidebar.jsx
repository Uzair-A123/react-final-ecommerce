import { NavLink } from "react-router-dom";

const items = [["", "📊 Overview"], ["products", "📦 Products"], ["orders", "🧾 Orders"], ["users", "👥 Users"], ["profile", "🙍 Profile"], ["settings", "⚙️ Settings"]];
const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 ${isActive ? "bg-indigo-600 font-semibold text-white" : "hover:bg-gray-100 dark:hover:bg-slate-700"}`;

export default function Sidebar({ open, onNavigate, onLogout }) {
  return (
    <aside onClick={onNavigate} className={`${open ? "flex" : "hidden"} flex-col gap-1 md:flex md:w-52 md:shrink-0`}>
      {items.map(([path, label]) => (
        <NavLink key={label} to={`/dashboard/${path}`} end={path === ""} className={linkClass}>{label}</NavLink>
      ))}
      <button className="mt-2" onClick={onLogout}>Logout</button>
    </aside>
  );
}
