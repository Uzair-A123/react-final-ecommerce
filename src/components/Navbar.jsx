import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const linkClass = ({ isActive }) =>
  isActive ? "font-bold text-indigo-600" : "hover:text-indigo-600";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="flex flex-wrap items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-slate-700">
      <Link to="/" className="text-xl font-bold text-indigo-600">E-Store</Link>
      <button className="md:hidden" onClick={() => setOpen((o) => !o)}>☰</button>
      <div
        onClick={() => setOpen(false)}
        className={`${open ? "flex" : "hidden"} w-full flex-col gap-3 pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-5 md:pt-0`}
      >
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        <NavLink to="/about" className={linkClass}>About</NavLink>
        <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        <NavLink to="/cart" className={linkClass}>Cart ({totalItems})</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>Login</NavLink>
        )}
        <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>
      </div>
    </nav>
  );
}
