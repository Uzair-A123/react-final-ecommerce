import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "./useFetch";

const KEYS = {
  custom: "customProducts",
  edits: "productEdits",
  deleted: "deletedProducts",
};
const EVENT = "products-changed";

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

// Throws if storage is full, so callers can show an error
const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT)); // update other components in this tab
};

export default function useProducts() {
  const { data, loading, error } = useFetch(
    "https://dummyjson.com/products?limit=30"
  );

  const [custom, setCustom] = useState(() => read(KEYS.custom, []));
  const [edits, setEdits] = useState(() => read(KEYS.edits, {}));
  const [deleted, setDeleted] = useState(() => read(KEYS.deleted, []));

  // Keep every component (and every tab) in sync
  useEffect(() => {
    const sync = () => {
      setCustom(read(KEYS.custom, []));
      setEdits(read(KEYS.edits, {}));
      setDeleted(read(KEYS.deleted, []));
    };
    sync(); // pick up anything saved before this component mounted
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // API products (minus deleted, plus edits) after your own products
  const products = useMemo(() => {
    const api = (data?.products ?? [])
      .filter((p) => !deleted.includes(p.id))
      .map((p) => ({ ...p, ...(edits[p.id] || {}) }));
    return [...custom, ...api];
  }, [data, custom, edits, deleted]);

  const addProduct = useCallback((product) => {
    write(KEYS.custom, [product, ...read(KEYS.custom, [])]);
  }, []);

  const updateProduct = useCallback((id, changes) => {
    const customList = read(KEYS.custom, []);
    if (customList.some((p) => p.id === id)) {
      // your own product: update it directly
      write(
        KEYS.custom,
        customList.map((p) => (p.id === id ? { ...p, ...changes } : p))
      );
    } else {
      // API product: save only the changed fields
      const current = read(KEYS.edits, {});
      write(KEYS.edits, { ...current, [id]: { ...current[id], ...changes } });
    }
  }, []);

  const deleteProduct = useCallback((id) => {
    const customList = read(KEYS.custom, []);
    if (customList.some((p) => p.id === id)) {
      write(KEYS.custom, customList.filter((p) => p.id !== id));
    } else {
      write(KEYS.deleted, [...read(KEYS.deleted, []), id]);
    }
  }, []);

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
}