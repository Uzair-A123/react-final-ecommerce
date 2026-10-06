import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { orders as initialOrders, ORDER_STATUSES } from "../../utils/helpers";
import useProducts from "../../hooks/useProducts";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";

const badge = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const STORAGE_KEY = "adminOrders";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  customer: "",
  category: "",
  productId: "",
  quantity: "1",
  status: ORDER_STATUSES[0],
  date: today(),
});

const loadOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialOrders;
  } catch {
    return initialOrders;
  }
};

function Field({ label, htmlFor, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function Orders() {
  const { products } = useProducts();
  const [orders, setOrders] = useState(loadOrders);
  const [status, setStatus] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const customerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      return;
    }
  }, [orders]);

  useEffect(() => {
    if (addOpen) setTimeout(() => customerRef.current?.focus(), 50);
  }, [addOpen]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === form.category),
    [products, form.category]
  );

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === form.productId),
    [products, form.productId]
  );

  const total = useMemo(() => {
    if (!selectedProduct) return 0;
    const qty = Number(form.quantity) || 0;
    return Math.round(selectedProduct.price * qty * 100) / 100;
  }, [selectedProduct, form.quantity]);

  const shown = useMemo(
    () => orders.filter((o) => status === "All" || o.status === status),
    [orders, status]
  );

  const changeStatus = useCallback(
    (id, next) =>
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: next } : o))),
    []
  );

  const deleteOrder = useCallback((order) => {
    if (window.confirm(`Delete order ${order.id} for ${order.customer}?`)) {
      setOrders((list) => list.filter((o) => o.id !== order.id));
    }
  }, []);

  const openAddModal = () => {
    setForm(emptyForm());
    setFormErrors({});
    setAddOpen(true);
  };

  const closeAddModal = () => {
    setAddOpen(false);
    setFormErrors({});
  };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCategoryChange = (e) => {
    setForm((prev) => ({ ...prev, category: e.target.value, productId: "" }));
    setFormErrors((er) => ({ ...er, category: "", productId: "" }));
  };

  const selectProduct = (id) => {
    setForm((prev) => ({ ...prev, productId: String(id) }));
    setFormErrors((er) => ({ ...er, productId: "" }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    const qty = Number(form.quantity);
    const errs = {};
    if (!form.customer.trim()) errs.customer = "Customer name is required.";
    if (!form.category) errs.category = "Please select a category.";
    if (!selectedProduct) errs.productId = "Please select a product.";
    if (!Number.isInteger(qty) || qty < 1) errs.quantity = "Enter a quantity of 1 or more.";
    else if (selectedProduct && qty > selectedProduct.stock)
      errs.quantity = `Only ${selectedProduct.stock} in stock.`;
    if (!form.date) errs.date = "Date is required.";

    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer: form.customer.trim(),
      products: `${selectedProduct.title} x${qty}`,
      total,
      status: form.status,
      date: form.date,
    };

    setOrders((list) => [newOrder, ...list]);
    setStatus("All");
    closeAddModal();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <button
          onClick={openAddModal}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          + Add Order
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-1 sm:w-56">
        <label htmlFor="order-filter" className="text-sm font-medium text-gray-700">
          Filter by status
        </label>
        <select
          id="order-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full"
        >
          {["All", ...ORDER_STATUSES].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <EmptyState text="No orders found." />
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.products}</td>
                  <td>${o.total}</td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td>{o.date}</td>
                  <td>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                        aria-label={`Change status of order ${o.id}`}
                        className="py-1 text-sm"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteOrder(o)}
                        aria-label={`Delete order ${o.id}`}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={addOpen} onClose={closeAddModal} title="Add order">
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
          <Field label="Customer name" htmlFor="order-customer" required error={formErrors.customer}>
            <input
              id="order-customer"
              ref={customerRef}
              name="customer"
              value={form.customer}
              onChange={handleFormChange}
              placeholder="e.g. Ali Khan"
            />
          </Field>

          <Field label="Product category" htmlFor="order-category" required error={formErrors.category}>
            <select
              id="order-category"
              name="category"
              value={form.category}
              onChange={handleCategoryChange}
              className="w-full"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex flex-col gap-1">
            <span id="order-product-label" className="text-sm font-medium text-gray-700">
              Product
              <span className="text-red-500"> *</span>
              {form.category && (
                <span className="font-normal text-gray-500">
                  {" "}
                  ({categoryProducts.length} in {form.category})
                </span>
              )}
            </span>

            <div
              role="radiogroup"
              aria-labelledby="order-product-label"
              className="max-h-64 overflow-y-auto rounded-lg border border-gray-300 bg-white"
            >
              {!form.category && (
                <p className="p-4 text-center text-sm text-gray-500">
                  Select a category to see its products.
                </p>
              )}

              {form.category && categoryProducts.length === 0 && (
                <p className="p-4 text-center text-sm text-gray-500">
                  No products in this category.
                </p>
              )}

              {categoryProducts.map((p) => {
                const selected = String(p.id) === form.productId;
                const outOfStock = p.stock <= 0;
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-2 last:border-b-0 ${
                      selected ? "bg-indigo-50 ring-1 ring-inset ring-indigo-500" : "hover:bg-gray-50"
                    } ${outOfStock ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="radio"
                      name="productId"
                      value={p.id}
                      checked={selected}
                      disabled={outOfStock}
                      onChange={() => selectProduct(p.id)}
                      className="h-4 w-4 shrink-0"
                    />
                    {p.thumbnail && (
                      <img
                        src={p.thumbnail}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.title}</span>
                      <span className="block text-xs text-gray-500">
                        {outOfStock ? "Out of stock" : `${p.stock} in stock`}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">${p.price}</span>
                  </label>
                );
              })}
            </div>

            {formErrors.productId && (
              <p className="text-sm text-red-500">{formErrors.productId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Quantity" htmlFor="order-quantity" required error={formErrors.quantity}>
              <input
                id="order-quantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={handleFormChange}
                className="w-full"
              />
            </Field>
            <Field label="Total ($)" htmlFor="order-total">
              <input
                id="order-total"
                value={total.toFixed(2)}
                readOnly
                className="w-full bg-gray-100"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Order date" htmlFor="order-date" required error={formErrors.date}>
              <input
                id="order-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleFormChange}
                className="w-full"
              />
            </Field>
            <Field label="Status" htmlFor="order-status">
              <select
                id="order-status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
            >
              Add Order
            </button>
            <button
              type="button"
              onClick={closeAddModal}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}