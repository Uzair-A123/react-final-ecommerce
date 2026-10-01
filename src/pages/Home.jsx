import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useCart } from "../context/CartContext";
import ProductList from "../components/ProductList";
import Card from "../components/Card";
import Loading from "../components/Loading";

const features = [
  ["🛍️", "Browse & Search", "Find products fast with search."],
  ["🛒", "Smart Cart", "Cart state is managed saved locally."],
  ["🔐", "Admin Area", "A protected dashboard to manage products, orders and users."],
];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data, loading, error } = useFetch("https://dummyjson.com/products?limit=4");
  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-700 px-8 py-20 text-center text-white shadow-xl">
        <h1 className="mb-3 text-3xl font-bold sm:text-5xl">Welcome to E-Store</h1>
        <p className="mx-auto mb-6 max-w-xl text-indigo-100">
          A modern e-commerce store with a complete management system.
        </p>
        <button onClick={() => navigate("/products")} className="bg-white px-6 py-3 font-semibold text-indigo-600 hover:bg-indigo-50">
          View Products
        </button>
      </section>

      <section className="my-8 grid gap-4 sm:grid-cols-3">
        {features.map(([icon, title, text]) => (
          <Card key={title}><div className="text-3xl">{icon}</div><h3 className="mt-2 font-semibold">{title}</h3><p className="text-sm text-gray-500 dark:text-slate-400">{text}</p></Card>
        ))}
      </section>

      <h2 className="mb-4 text-2xl font-semibold">Featured Products</h2>
      {loading && <Loading text="Loading products..." />}
      {error && <p className="text-red-500">Something went wrong. Please try again.</p>}
      {data && <ProductList products={data.products} onAdd={addToCart} />}
    </>
  );
}
