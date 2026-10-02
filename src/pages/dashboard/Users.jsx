import { useState, useMemo, useCallback, memo } from "react";
import { users as initialUsers } from "../../utils/helpers";
import EmptyState from "../../components/EmptyState";

const UserRow = memo(function UserRow({ user, onToggle }) {
  return (
    <tr>
      <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
      <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>{user.status}</span></td>
      <td><button onClick={() => onToggle(user.id)} className="text-sm">{user.status === "Active" ? "Deactivate" : "Activate"}</button></td>
    </tr>
  );
});

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const toggleStatus = useCallback((id) => setUsers((list) => list.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u))), []);
  const shown = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Users</h2>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="mb-4 w-full sm:w-72" />
      {shown.length === 0 ? <EmptyState text="No users found." /> : (
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{shown.map((u) => <UserRow key={u.id} user={u} onToggle={toggleStatus} />)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
