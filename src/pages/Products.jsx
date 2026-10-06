import { useState, useMemo, useRef, useEffect } from "react";
import useProducts from "../hooks/useProducts";
import useRequireAuth from "../hooks/useRequireAuth";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductList from "../components/ProductList";
import Loading from "../components/Loading";

export default function Products() {
  const { products, loading, error } = useProducts();
  const { cart, addToCart, increase, decrease, removeFromCart } = useCart();
  const requireAuth = useRequireAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleAdd = requireAuth(addToCart, "Please log in or sign up to add items to your cart.");
  const handleIncrease = requireAuth(increase, "Please log in to manage your cart.");
  const handleDecrease = requireAuth(decrease, "Please log in to manage your cart.");
  const handleRemove = requireAuth(removeFromCart, "Please log in to manage your cart.");

  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    );
  }, [products, search, category]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Products</h2>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchBar ref={searchRef} value={search} onChange={setSearch} />
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </div>
      {loading && products.length === 0 && <Loading text="Loading products..." />}
      {error && products.length === 0 && (
        <p className="text-red-500">Something went wrong. Please try again.</p>
      )}
      {products.length > 0 && (
        <ProductList
          products={filtered}
          cart={cart}
          onAdd={handleAdd}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}