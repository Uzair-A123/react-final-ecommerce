import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import { resizeImage } from "../../utils/helpers";

const emptyForm = {
  title: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
  description: "",
  discountPercentage: "",
};

/* Reusable label + input + error wrapper */
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

export default function ProductsManagement() {
  const { products: list, loading, error, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(null);

  // Add Product modal state
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const titleRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (addOpen) setTimeout(() => titleRef.current?.focus(), 50);
  }, [addOpen]);

  const categories = useMemo(
    () => [...new Set(list.map((p) => p.category).filter(Boolean))],
    [list]
  );

  /* ---------- Delete ---------- */
  const handleDelete = (p) => {
    if (window.confirm(`Delete "${p.title}"?`)) deleteProduct(p.id);
  };

  /* ---------- Edit ---------- */
  const handleEditChange = (e) =>
    setEditing((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveEdit = (e) => {
    e.preventDefault();
    updateProduct(editing.id, {
      title: editing.title.trim(),
      category: editing.category.trim().toLowerCase(),
      brand: editing.brand?.trim() || "",
      description: editing.description?.trim() || "",
      price: Number(editing.price),
      stock: Number(editing.stock),
      discountPercentage: Number(editing.discountPercentage) || 0,
    });
    setEditing(null);
  };

  /* ---------- Add ---------- */
  const openAddModal = () => {
    setForm(emptyForm);
    setPhoto("");
    setFormErrors({});
    setAddOpen(true);
  };

  const closeAddModal = () => {
    setAddOpen(false);
    setForm(emptyForm);
    setPhoto("");
    setFormErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setFormErrors((er) => ({ ...er, photo: "Please choose an image file." }));
    if (file.size > 5 * 1024 * 1024)
      return setFormErrors((er) => ({ ...er, photo: "Image must be under 5 MB." }));
    try {
      setPhoto(await resizeImage(file));
      setFormErrors((er) => ({ ...er, photo: "" }));
    } catch {
      setFormErrors((er) => ({ ...er, photo: "Could not read this image." }));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.category.trim()) errs.category = "Category is required.";
    if (form.price === "" || Number(form.price) <= 0)
      errs.price = "Enter a price greater than 0.";
    if (form.stock === "" || Number(form.stock) < 0)
      errs.stock = "Enter a stock of 0 or more.";
    if (!photo) errs.photo = "Please upload a product photo.";

    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      addProduct({
        id: `custom-${Date.now()}`,
        title: form.title.trim(),
        category: form.category.trim().toLowerCase(),
        brand: form.brand.trim(),
        description: form.description.trim() || "No description provided.",
        price: Number(form.price),
        stock: Number(form.stock),
        discountPercentage: Number(form.discountPercentage) || 0,
        rating: 0,
        thumbnail: photo,
        images: [photo],
        custom: true,
      });
      closeAddModal();
    } catch {
      setFormErrors((er) => ({ ...er, photo: "Storage is full. Try a smaller image." }));
    }
  };

  /* ---------- Render ---------- */
  if (loading && list.length === 0) return <Loading text="Loading products..." />;
  if (error && list.length === 0)
    return <p className="text-red-500">Failed to load products.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Products Management</h2>
        <button
          onClick={openAddModal}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-2">
                    {p.thumbnail && (
                      <img src={p.thumbnail} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <span>{p.title}</span>
                  </div>
                </td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>{p.rating}</td>
                <td className="space-x-1 whitespace-nowrap">
                  <button onClick={() => navigate(`/products/${p.id}`)}>View</button>
                  <button onClick={() => setEditing(p)}>Edit</button>
                  <button onClick={() => handleDelete(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}
      <Modal open={addOpen} onClose={closeAddModal} title="Add product">
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
          <Field label="Product photo" htmlFor="add-photo" required error={formErrors.photo}>
            <div className="grid h-40 place-items-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              {photo ? (
                <img src={photo} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <span className="text-sm text-gray-500">No photo selected</span>
              )}
            </div>
            <input id="add-photo" ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} />
            {photo && (
              <button
                type="button"
                className="self-start text-sm text-indigo-600 hover:underline"
                onClick={() => {
                  setPhoto("");
                  fileRef.current.value = "";
                }}
              >
                Remove photo
              </button>
            )}
          </Field>

          <Field label="Title" htmlFor="add-title" required error={formErrors.title}>
            <input
              id="add-title"
              ref={titleRef}
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="e.g. Wireless Headphones"
            />
          </Field>

          <Field label="Category" htmlFor="add-category" required error={formErrors.category}>
            <input
              id="add-category"
              name="category"
              list="add-categories"
              value={form.category}
              onChange={handleFormChange}
              placeholder="e.g. electronics"
            />
            <datalist id="add-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="Brand (optional)" htmlFor="add-brand">
            <input
              id="add-brand"
              name="brand"
              value={form.brand}
              onChange={handleFormChange}
              placeholder="e.g. Sony"
            />
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field label="Price ($)" htmlFor="add-price" required error={formErrors.price}>
              <input
                id="add-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleFormChange}
                placeholder="0.00"
                className="w-full"
              />
            </Field>
            <Field label="Stock (units)" htmlFor="add-stock" required error={formErrors.stock}>
              <input
                id="add-stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full"
              />
            </Field>
            <Field label="Discount (%)" htmlFor="add-discount">
              <input
                id="add-discount"
                name="discountPercentage"
                type="number"
                min="0"
                max="90"
                value={form.discountPercentage}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full"
              />
            </Field>
          </div>

          <Field label="Description (optional)" htmlFor="add-description">
            <textarea
              id="add-description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Describe the product"
            />
          </Field>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md py-2">
              Add Product
            </button>
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= EDIT MODAL ================= */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit product">
        {editing && (
          <form onSubmit={saveEdit} className="flex flex-col gap-3">
            <Field label="Title" htmlFor="edit-title" required>
              <input
                id="edit-title"
                name="title"
                value={editing.title ?? ""}
                onChange={handleEditChange}
                required
              />
            </Field>

            <Field label="Category" htmlFor="edit-category" required>
              <input
                id="edit-category"
                name="category"
                list="add-categories"
                value={editing.category ?? ""}
                onChange={handleEditChange}
                required
              />
            </Field>

            <Field label="Brand" htmlFor="edit-brand">
              <input
                id="edit-brand"
                name="brand"
                value={editing.brand ?? ""}
                onChange={handleEditChange}
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Field label="Price ($)" htmlFor="edit-price" required>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editing.price ?? ""}
                  onChange={handleEditChange}
                  className="w-full"
                  required
                />
              </Field>
              <Field label="Stock (units)" htmlFor="edit-stock" required>
                <input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={editing.stock ?? ""}
                  onChange={handleEditChange}
                  className="w-full"
                  required
                />
              </Field>
              <Field label="Discount (%)" htmlFor="edit-discount">
                <input
                  id="edit-discount"
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="90"
                  value={editing.discountPercentage ?? ""}
                  onChange={handleEditChange}
                  className="w-full"
                />
              </Field>
            </div>

            <Field label="Description" htmlFor="edit-description">
              <textarea
                id="edit-description"
                name="description"
                rows="3"
                value={editing.description ?? ""}
                onChange={handleEditChange}
              />
            </Field>

            <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md py-2">
              Save
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}