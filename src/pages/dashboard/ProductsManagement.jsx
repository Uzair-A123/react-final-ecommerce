import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";

export default function ProductsManagement() {
  const { data, loading, error } = useFetch("https://dummyjson.com/products?limit=30");

  const [saved, setSaved] = useLocalStorage("adminProducts", null);
  const [custom, setCustom] = useLocalStorage("customProducts", []);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const list = [...custom, ...(saved ?? data?.products ?? [])];

 
  const saveAll = useCallback((next) => {
    setCustom(next.filter((p) => p.custom));
    setSaved(next.filter((p) => !p.custom));
  }, [setCustom, setSaved]);

  const deleteProduct = useCallback((id) => saveAll(list.filter((p) => p.id !== id)), [list, saveAll]);
  const saveEdit = (e) => {
    e.preventDefault();
    saveAll(list.map((p) => (p.id === editing.id ? { ...editing, price: Number(editing.price), stock: Number(editing.stock) } : p)));
    setEditing(null);
  };

  if (loading && !saved) return <Loading text="Loading products..." />;
  if (error && !saved) return <p className="text-red-500">Failed to load products.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Products Management</h2>
        <Link to="/dashboard/products/new" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">+ Add Product</Link>
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td><div className="flex items-center gap-2">{p.thumbnail && <img src={p.thumbnail} alt="" className="h-10 w-10 rounded object-cover" />}<span>{p.title}</span></div></td>
                <td>{p.category}</td><td>${p.price}</td><td>{p.stock}</td><td>{p.rating}</td>
                <td className="space-x-1 whitespace-nowrap">
                  <button onClick={() => navigate(`/products/${p.id}`)}>View</button>
                  <button onClick={() => setEditing(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit product">
        {editing && (
          <form onSubmit={saveEdit} className="flex flex-col gap-3">
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            <input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
            <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
