import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useRequireAuth from "../hooks/useRequireAuth";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";

const perks = [
  ["🚚", "Fast delivery"],
  ["🔒", "Secure checkout"],
  ["↩️", "Easy returns"],
  ["💬", "24/7 support"],
];

const stepBtn =
  "grid h-8 min-w-8 place-items-center rounded-lg border border-gray-300 bg-white px-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";

function MiniProductCard({ product, quantity, onOpen, onAdd, onIncrease, onDecrease, onRemove }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white text-gray-900 shadow-lg dark:bg-slate-800 dark:text-slate-100">
      <button
        type="button"
        onClick={() => onOpen(product.id)}
        className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-slate-700"
        aria-label={`View ${product.title}`}
      >
        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition hover:scale-105"
          />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">${product.price}</span>

        <div className="mt-auto">
          {quantity > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onDecrease(product.id)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className={stepBtn}
              >
                −
              </button>
              <span className="min-w-4 text-center text-sm font-medium" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onIncrease(product.id)}
                disabled={product.stock !== undefined && quantity >= product.stock}
                aria-label="Increase quantity"
                className={stepBtn}
              >
                +
              </button>
              <button type="button" onClick={() => onRemove(product.id)} className={stepBtn}>
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAdd(product)}
              disabled={outOfStock}
              className="w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { cart, addToCart, increase, decrease, removeFromCart } = useCart();
  const requireAuth = useRequireAuth();
  const { products, loading, error } = useProducts();

  const handleAdd = requireAuth(
    addToCart,
    "Please log in or sign up to add items to your cart."
  );
  const handleIncrease = requireAuth(increase, "Please log in to manage your cart.");
  const handleDecrease = requireAuth(decrease, "Please log in to manage your cart.");
  const handleRemove = requireAuth(removeFromCart, "Please log in to manage your cart.");

  const featured = products.slice(0, 4);

  const quantityOf = (id) => cart.find((i) => i.id === id)?.quantity ?? 0;

  const categoryCount = useMemo(
    () => new Set(products.map((p) => p.category).filter(Boolean)).size,
    [products]
  );

  const stats = [
    [products.length || "30+", "Products"],
    [categoryCount || "10+", "Categories"],
    ["24/7", "Support"],
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-900 to-slate-800 px-5 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-indigo-100 backdrop-blur sm:text-sm">
              ✨ New arrivals every week
            </span>

            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              Shop smarter with{" "}
              <span className="bg-linear-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                E-Store
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-indigo-100 sm:text-lg">
              A modern e-commerce store with a complete management system. Discover great
              products at great prices.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                onClick={() => navigate("/products")}
                className="rounded-xl bg-white px-7 py-3 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Shop now
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                Create account
              </button>
            </div>

            <dl className="mt-10 grid w-full max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-bold sm:text-3xl">{value}</dd>
                  <p className="text-xs text-indigo-200 sm:text-sm">{label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Featured products</h2>
              <button
                onClick={() => navigate("/products")}
                className="text-sm font-semibold text-indigo-200 hover:text-white hover:underline"
              >
                View all →
              </button>
            </div>

            {loading && featured.length === 0 && <Loading text="Loading products..." />}
            {error && featured.length === 0 && (
              <p className="text-red-300">Something went wrong. Please try again.</p>
            )}
            {featured.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {featured.map((p) => (
                  <MiniProductCard
                    key={p.id}
                    product={p}
                    quantity={quantityOf(p.id)}
                    onOpen={(id) => navigate(`/products/${id}`)}
                    onAdd={handleAdd}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {perks.map(([icon, text]) => (
          <div
            key={text}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium sm:text-base">{text}</span>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-linear-to-r from-indigo-600 to-fuchsia-600 px-6 py-10 text-center text-white shadow-lg sm:px-10 sm:py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to start shopping?</h2>
        <p className="mx-auto mt-2 max-w-xl text-indigo-100">
          Create a free account to save your profile and manage your store.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/signup")}
            className="rounded-xl bg-white px-7 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Sign up free
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="rounded-xl border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Contact us
          </button>
        </div>
      </section>
    </div>
  );
}