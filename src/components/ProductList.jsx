import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductList({ products, onAdd }) {
  if (products.length === 0) return <EmptyState text="No products found." />;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
    </div>
  );
}