import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import { resizeImage } from "../../utils/helpers";

const empty = { title: "", category: "", brand: "", price: "", stock: "", description: "", discountPercentage: "" };

export default function AddProduct() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [custom, setCustom] = useLocalStorage("customProducts", []);
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState("");
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);
  const fileRef = useRef(null);
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors((er) => ({ ...er, photo: "Please choose an image file." }));
    if (file.size > 5 * 1024 * 1024) return setErrors((er) => ({ ...er, photo: "Image must be under 5 MB." }));
    try {
      setPhoto(await resizeImage(file));
      setErrors((er) => ({ ...er, photo: "" }));
    } catch {
      setErrors((er) => ({ ...er, photo: "Could not read this image." }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.category.trim()) errs.category = "Category is required.";
    if (form.price === "" || Number(form.price) <= 0) errs.price = "Enter a price greater than 0.";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Enter a stock of 0 or more.";
    if (!photo) errs.photo = "Please upload a product photo.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setCustom([{
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
      custom: true,
    }, ...custom]); // newest first
    navigate("/products"); // show it on the website, in the first position
  };

  const err = (k) => errors[k] && <p className="text-sm text-red-500">{errors[k]}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Add New Product</h2>
        <Link to="/dashboard/products">← Back to Products</Link>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <label className="font-medium">Product photo</label>
          <div className="grid h-56 place-items-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-slate-600 dark:bg-slate-700">
            {photo ? <img src={photo} alt="Preview" className="h-full w-full object-contain" /> : <span className="text-sm text-gray-500 dark:text-slate-400">No photo selected</span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} />
          {photo && <button type="button" className="self-start text-sm" onClick={() => { setPhoto(""); fileRef.current.value = ""; }}>Remove photo</button>}
          {err("photo")}
        </div>
        <div className="flex flex-col gap-3">
          <input ref={titleRef} name="title" value={form.title} onChange={handleChange} placeholder="Product title" />
          {err("title")}
          <input name="category" list="categories" value={form.category} onChange={handleChange} placeholder="Category" />
          <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          {err("category")}
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand (optional)" />
          <div className="grid grid-cols-3 gap-3">
            <div><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" className="w-full" />{err("price")}</div>
            <div><input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full" />{err("stock")}</div>
            <input name="discountPercentage" type="number" min="0" max="90" value={form.discountPercentage} onChange={handleChange} placeholder="Discount %" className="w-full" />
          </div>
          <textarea name="description" rows="4" value={form.description} onChange={handleChange} placeholder="Description (optional)" />
          <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Add Product</button>
        </div>
      </form>
    </div>
  );
}
