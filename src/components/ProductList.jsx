function QuantityControls({ quantity, stock, onIncrease, onDecrease, onRemove }) {
  const btn =
    "grid h-10 min-w-10 place-items-center rounded-lg border border-gray-300 bg-white px-3 text-base font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className={btn}
      >
        −
      </button>
      <span className="min-w-5 text-center font-medium" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={stock !== undefined && quantity >= stock}
        aria-label="Increase quantity"
        className={btn}
      >
        +
      </button>
      <button type="button" onClick={onRemove} className={btn}>
        Remove
      </button>
    </div>
  );
}

function ProductCard({ product, quantity, onAdd, onIncrease, onDecrease, onRemove }) {
  const outOfStock = product.stock <= 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-slate-700">
        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          {product.category}
        </span>
        <h3 className="line-clamp-2 font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <span className="text-lg font-bold">${product.price}</span>

          {quantity > 0 ? (
            <QuantityControls
              quantity={quantity}
              stock={product.stock}
              onIncrease={() => onIncrease(product.id)}
              onDecrease={() => onDecrease(product.id)}
              onRemove={() => onRemove(product.id)}
            />
          ) : (
            <button
              type="button"
              onClick={() => onAdd(product)}
              disabled={outOfStock}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProductList({
  products,
  cart = [],
  onAdd,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  if (products.length === 0) {
    return <p className="py-10 text-center text-gray-500 dark:text-slate-400">No products found.</p>;
  }

  const quantityOf = (id) => cart.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          quantity={quantityOf(p.id)}
          onAdd={onAdd}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}