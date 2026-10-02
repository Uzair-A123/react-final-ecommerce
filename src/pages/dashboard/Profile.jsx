import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {useLocalStorage} from "../../hooks/useLocalStorage";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useLocalStorage("profile", { name: user.name, email: user.email, bio: "" });
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setSaved(false); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email.";
    setErrors(errs);
    if (!Object.keys(errs).length) { setProfile(form); setSaved(true); }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex-col gap-3 flex rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-2xl font-semibold">Profile</h2>
      <p>Role: {user.role}</p>
      {saved && <p className="text-green-600">Profile updated.</p>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      <textarea name="bio" rows="4" value={form.bio} onChange={handleChange} placeholder="About you" />
      <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
    </form>
  );
}
