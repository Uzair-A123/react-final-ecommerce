import { useState, useMemo, useCallback, memo } from "react";
import { users as initialUsers } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../../components/EmptyState";

const USERS_KEY = "registeredUsers";
const STATUS_KEY = "userStatuses";
const ADMIN_EMAIL = "uzair@example.com";

const DEMO_USER = {
  id: "demo-user",
  name: "Uzair",
  email: ADMIN_EMAIL,
  role: "Admin",
  status: "Active",
  password: "admin123",
};

const readJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const loadUsers = () => {
  const registered = readJSON(USERS_KEY, [])
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.position || "User",
      status: "Active",
      password: u.password,
    }))
    .reverse();

  const base = initialUsers.some((u) => u.email.toLowerCase() === ADMIN_EMAIL)
    ? initialUsers.map((u) =>
        u.email.toLowerCase() === ADMIN_EMAIL ? { ...u, password: DEMO_USER.password } : u
      )
    : [DEMO_USER, ...initialUsers];

  const seen = new Set();
  const merged = [...base, ...registered].filter((u) => {
    const key = u.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const statuses = readJSON(STATUS_KEY, {});
  return merged.map((u) => ({ ...u, status: statuses[u.id] || u.status }));
};

const UserRow = memo(function UserRow({
  user,
  onToggle,
  isAdmin,
  revealed,
  onReveal,
}) {
  const isAdminAccount = user.email.toLowerCase() === ADMIN_EMAIL;

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {isAdmin && (
        <td>
          {user.password ? (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <code className="text-sm">{revealed ? user.password : "••••••••"}</code>
              <button
                type="button"
                onClick={() => onReveal(user.id)}
                aria-label={`${revealed ? "Hide" : "Show"} password for ${user.email}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                {revealed ? "Hide" : "Show"}
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-slate-400">Not saved</span>
          )}
        </td>
      )}
      <td>{user.role}</td>
      <td>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
          }`}
        >
          {user.status}
        </span>
      </td>
      {isAdmin && (
        <td>
          {isAdminAccount ? (
            <span className="text-sm text-gray-500 dark:text-slate-400">-</span>
          ) : (
            <button onClick={() => onToggle(user.id)} className="text-sm">
              {user.status === "Active" ? "Deactivate" : "Activate"}
            </button>
          )}
        </td>
      )}
    </tr>
  );
});

export default function Users() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;

  const [users, setUsers] = useState(loadUsers);
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState(() => new Set());

  const toggleStatus = useCallback(
    (id) => {
      if (!isAdmin) return;
      setUsers((list) => {
        const next = list.map((u) =>
          u.id === id && u.email.toLowerCase() !== ADMIN_EMAIL
            ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
            : u
        );
        try {
          const statuses = Object.fromEntries(next.map((u) => [u.id, u.status]));
          localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
        } catch {
          return next;
        }
        return next;
      });
    },
    [isAdmin]
  );

  const toggleReveal = useCallback((id) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const shown = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {users.length} {users.length === 1 ? "user" : "users"} in total
          </p>
        </div>

        <div className="flex w-full flex-col gap-1 sm:w-72">
          <label htmlFor="user-search" className="text-sm font-medium">
            Search users
          </label>
          <input
            id="user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or email"
            className="w-full"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState text="No users found." />
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {isAdmin && <th>Password</th>}
                <th>Role</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  onToggle={toggleStatus}
                  isAdmin={isAdmin}
                  revealed={revealed.has(u.id)}
                  onReveal={toggleReveal}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}