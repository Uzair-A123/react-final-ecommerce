import { useState, useMemo, useRef, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductList from "../components/ProductList";
import Loading from "../components/Loading";

export default function Products() {
  const { data, loading, error } = useFetch("https://dummyjson.com/products?limit=100");
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const searchRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  const products = useMemo(() => data?.products ?? [], [data]);
  const categories = useMemo(() => ["all", ...new Set(products.map((p) => p.category))], [products]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [products, search, category]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Products</h2>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchBar ref={searchRef} value={search} onChange={setSearch} />
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </div>
      {loading && <Loading text="Loading products..." />}
      {error && <p className="text-red-500">Something went wrong. Please try again.</p>}
      {!loading && !error && <ProductList products={filtered} onAdd={addToCart} />}
    </div>
  );
}
