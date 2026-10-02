import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import useFetch from "../../hooks/useFetch";
import { orders, users } from "../../utils/helpers";

export default function Dashboard() {
  const { data, loading } = useFetch("https://dummyjson.com/products?limit=4&select=title,price,thumbnail");
  const revenue = orders.filter((o) => o.status === "Completed").reduce((s, o) => s + o.total, 0);
  const stats = [["📦 Total Products", 194], ["🧾 Total Orders", orders.length], ["👥 Total Users", users.length], ["💰 Total Revenue", `$${revenue.toFixed(2)}`]];
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([l, v]) => <Card key={l}><p className="text-sm text-gray-500 dark:text-slate-400">{l}</p><p className="text-2xl font-bold">{v}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">Recent Orders</h3>
          <ul className="space-y-1 text-sm">{orders.slice(-4).reverse().map((o) => <li key={o.id} className="flex justify-between"><span>{o.id} · {o.customer}</span><span>${o.total} · {o.status}</span></li>)}</ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Recent Products</h3>
          {loading ? <Loading /> : (
            <ul className="space-y-2 text-sm">{data?.products.map((p) => <li key={p.id} className="flex items-center gap-2"><img src={p.thumbnail} alt="" className="h-8 w-8 rounded object-cover" /><span className="flex-1 truncate">{p.title}</span><span>${p.price}</span></li>)}</ul>
          )}
        </Card>
      </div>
      <Card className="mt-6">
        <h3 className="mb-2 font-semibold">Quick Actions</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/dashboard/products">Manage products</Link><Link to="/dashboard/orders">View orders</Link><Link to="/dashboard/users">View users</Link><Link to="/dashboard/settings">Settings</Link>
        </div>
      </Card>
    </div>
  );
}
