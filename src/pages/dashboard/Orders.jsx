import { useState, useMemo, useCallback } from "react";
import { orders as initialOrders, ORDER_STATUSES } from "../../utils/helpers";
import EmptyState from "../../components/EmptyState";

const badge = { Pending: "bg-yellow-100 text-yellow-800", Processing: "bg-blue-100 text-blue-800", Completed: "bg-green-100 text-green-800", Cancelled: "bg-red-100 text-red-800" };

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [status, setStatus] = useState("All");
  const shown = useMemo(() => orders.filter((o) => status === "All" || o.status === status), [orders, status]);
  const changeStatus = useCallback((id, next) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: next } : o))), []);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Orders</h2>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="mb-4 w-full sm:w-56">
        {["All", ...ORDER_STATUSES].map((s) => <option key={s}>{s}</option>)}
      </select>
      {shown.length === 0 ? <EmptyState text="No orders found." /> : (
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Products</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>{shown.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td><td>{o.customer}</td><td>{o.products}</td><td>${o.total}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge[o.status]}`}>{o.status}</span></td>
                <td>{o.date}</td>
                <td><select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)} className="py-1 text-sm">{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}