export async function fetchProducts(filters, signal) {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("categories", filters.categories.join(","));
  if (filters.minPrice > 0) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice < 100000) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minRating > 0) params.set("minRating", String(filters.minRating));
  if (filters.sortBy !== "default") params.set("sortBy", filters.sortBy);
  if (filters.search.trim()) params.set("search", filters.search.trim());

  const response = await fetch(`/api/products${params.size ? `?${params}` : ""}`, { signal });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "Unable to fetch products.");
  return data;
}
