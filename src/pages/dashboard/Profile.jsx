import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const emptyForm = { name: "", email: "", position: "", bio: "" };

const readProfile = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

function Field({ label, htmlFor, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function ProfileContent({ user }) {
  const storageKey = `profile:${user.email}`;
  const [profile, setProfile] = useState(() => readProfile(storageKey));
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const nameRef = useRef(null);

  const hasChanges =
    !editing ||
    !profile ||
    form.name.trim() !== (profile.name ?? "") ||
    form.email.trim() !== (profile.email ?? "") ||
    form.position.trim() !== (profile.position ?? "") ||
    form.bio.trim() !== (profile.bio ?? "");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email.";
    if (!form.position.trim()) errs.position = "Position is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const next = {
      name: form.name.trim(),
      email: form.email.trim(),
      position: form.position.trim(),
      bio: form.bio.trim(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      return setMessage({ type: "error", text: "Could not save the profile. Storage is full." });
    }

    setProfile(next);
    setForm(emptyForm);
    setMessage({ type: "success", text: editing ? "Profile updated." : "Profile saved." });
    setEditing(false);
  };

  const handleEdit = () => {
    setForm({ ...emptyForm, ...profile });
    setEditing(true);
    setErrors({});
    setMessage({ type: "", text: "" });
    nameRef.current?.focus();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(false);
    setErrors({});
  };

  const handleDelete = () => {
    if (!window.confirm("Delete your profile?")) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      return setMessage({ type: "error", text: "Could not delete the profile." });
    }
    setProfile(null);
    setForm(emptyForm);
    setEditing(false);
    setErrors({});
    setMessage({ type: "success", text: "Profile deleted." });
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Profile</h2>

      {message.text && (
        <p className={`mb-4 text-sm ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>
          {message.text}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="text-lg font-semibold">
            {editing ? "Edit profile" : "Add profile details"}
          </h3>

          <Field label="Name" htmlFor="profile-name" required error={errors.name}>
            <input
              id="profile-name"
              ref={nameRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Uzair Khan"
              autoComplete="name"
            />
          </Field>

          <Field label="Email" htmlFor="profile-email" required error={errors.email}>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Position" htmlFor="profile-position" required error={errors.position}>
            <input
              id="profile-position"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="e.g. Store Manager"
            />
          </Field>

          <Field label="About you" htmlFor="profile-bio">
            <textarea
              id="profile-bio"
              name="bio"
              rows="4"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short bio"
            />
          </Field>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!hasChanges}
              className="flex-1 rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              {editing ? "Update profile" : "Save profile"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {profile ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold">{profile.name}</h3>
                  <p className="truncate text-sm text-indigo-600">{profile.position}</p>
                </div>
              </div>

              <dl className="flex flex-col gap-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-500 dark:text-slate-400">Email</dt>
                  <dd className="break-words">{profile.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-slate-400">Position</dt>
                  <dd>{profile.position}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-slate-400">About</dt>
                  <dd className="whitespace-pre-wrap break-words">
                    {profile.bio || "No bio added."}
                  </dd>
                </div>
              </dl>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-40 place-items-center text-center text-sm text-gray-500 dark:text-slate-400">
              No profile information yet. Fill in the form and save to see it here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  return <ProfileContent key={user.email} user={user} />;
}