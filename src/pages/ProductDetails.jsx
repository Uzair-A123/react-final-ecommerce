import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {useLocalStorage} from "../hooks/useLocalStorage";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import Button from "../components/Button";

export default function ProductDetails() {
  const { id } = useParams();
  const [custom] = useLocalStorage("customProducts", []);
  const local = custom.find((c) => String(c.id) === id); // admin-added product?
  const { data, loading, error } = useFetch(local ? null : `https://dummyjson.com/products/${id}`);
  const { addToCart } = useCart();
  const p = local ?? data;

  if (!local && loading) return <Loading text="Loading product..." />;
  if (!p || (!local && error)) return <p className="text-red-500">Something went wrong. Please try again.</p>;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img src={p.thumbnail} alt={p.title} className="w-full rounded-lg" />
      <div>
        <h2 className="mb-4 text-2xl font-semibold">{p.title}</h2>
        <p>{p.description}</p>
        <p className="my-2"><b>${p.price}</b> · {p.discountPercentage}% off · ⭐ {p.rating}</p>
        <p className="mb-4">Category: {p.category} · Brand: {p.brand || "N/A"} · Stock: {p.stock}</p>
        <Button onClick={() => addToCart(p)}>Add to Cart</Button>{" "}
        <Link to="/products">Back to Products</Link>
      </div>
    </div>
  );
}
