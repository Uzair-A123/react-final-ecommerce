import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const emailRef = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(state?.message || "");

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("All fields are required.");
    if (login(form.email, form.password)) navigate("/dashboard");
    else setError("Invalid email or password.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">Demo: uzair@example.com / admin123</p>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <input ref={emailRef} name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Login</button>
    </form>
  );
}
