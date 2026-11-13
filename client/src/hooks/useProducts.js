import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productApi.js";

export function useProducts(filters) {
  const [state, setState] = useState({ products: [], total: 0, loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setState(previous => ({ ...previous, loading: true, error: "" }));
      try {
        const data = await fetchProducts(filters, controller.signal);
        if (!controller.signal.aborted) {
          setState({ products: data.products, total: data.total, loading: false, error: "" });
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          setState(previous => ({ ...previous, loading: false, error: error.message }));
        }
      }
    }, 160);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters.categories, filters.minPrice, filters.maxPrice, filters.minRating, filters.sortBy, filters.search]);

  return state;
}
