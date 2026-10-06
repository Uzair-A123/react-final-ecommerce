import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", email: "", password: "", confirmPassword: "" };

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        <span className="text-red-500"> *</span>
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitError("");
  };

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Enter your full name (at least 2 characters).";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      errs.password = "Password must contain at least one letter and one number.";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    const result = await register(form);
    setSubmitting(false);

    if (!result.ok) return setSubmitError(result.error);

    navigate("/login", {
      state: { success: "Account created successfully. Please log in." },
    });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <h2 className="text-2xl font-semibold">Create account</h2>
        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <Field label="Full name" htmlFor="signup-name" error={errors.name}>
          <input
            id="signup-name"
            ref={nameRef}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Uzair Khan"
            autoComplete="name"
          />
        </Field>

        <Field label="Email" htmlFor="signup-email" error={errors.email}>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Password" htmlFor="signup-password" error={errors.password}>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters, letters and numbers"
            autoComplete="new-password"
          />
        </Field>

        <Field label="Confirm password" htmlFor="signup-confirm" error={errors.confirmPassword}>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}