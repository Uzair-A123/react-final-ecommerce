import { useMemo } from "react";
import useFetch from "./useFetch";
import {useLocalStorage} from "./useLocalStorage";

export default function useProducts(limit = 100) {
  const { data, loading, error } = useFetch(`https://dummyjson.com/products?limit=${limit}`);
  const [custom] = useLocalStorage("customProducts", []);
  // custom products first, so a newly added product is in the initial position
  const products = useMemo(() => [...custom, ...(data?.products ?? [])], [custom, data]);
  return { products, loading, error };
}
