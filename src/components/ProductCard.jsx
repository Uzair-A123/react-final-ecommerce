import { memo } from "react";
import { Link } from "react-router-dom";

const ProductCard = memo(function ProductCard({ product, onAdd }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <img src={product.thumbnail} alt={product.title} className="w-full" />
      <h3 className="mb-2 mt-4 text-lg font-semibold">{product.title}</h3>
      <p>${product.price} · {product.category}</p>
      <p>⭐ {product.rating} · {product.discountPercentage}% off</p>
      <Link to={`/products/${product.id}`}>View Details</Link>
      <button onClick={() => onAdd(product)}>Add to Cart</button>
    </div>
  );
});
export default ProductCard;
