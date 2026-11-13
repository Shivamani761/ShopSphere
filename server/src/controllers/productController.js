import { products } from "../data/products.js";

const CATEGORIES = new Set(["Electronics", "Apparel", "Footwear", "Home & Kitchen", "Sports"]);
const SORTS = new Set(["default", "price-low-high", "price-high-low", "top-rated"]);

function parseNumber(value, fallback, field) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    const error = new Error(`${field} must be a valid number.`);
    error.status = 400;
    throw error;
  }
  return parsed;
}

export function listProducts(req, res, next) {
  try {
    const rawCategories = req.query.categories;
    const categories = rawCategories
      ? String(rawCategories).split(",").map(value => value.trim()).filter(Boolean)
      : [];
    const invalidCategories = categories.filter(category => !CATEGORIES.has(category));
    if (invalidCategories.length) {
      const error = new Error(`Invalid category: ${invalidCategories.join(", ")}. Allowed categories: ${[...CATEGORIES].join(", ")}.`);
      error.status = 400;
      throw error;
    }

    const minPrice = parseNumber(req.query.minPrice, 0, "minPrice");
    const maxPrice = parseNumber(req.query.maxPrice, 100000, "maxPrice");
    const minRating = parseNumber(req.query.minRating, 0, "minRating");
    const sortBy = req.query.sortBy || "default";
    const search = String(req.query.search || "").trim().toLowerCase();

    if (minPrice < 0 || maxPrice < 0 || minPrice > 100000 || maxPrice > 100000) {
      const error = new Error("Price values must be between ₹0 and ₹100000.");
      error.status = 400;
      throw error;
    }
    if (minPrice > maxPrice) {
      const error = new Error("minPrice cannot be greater than maxPrice.");
      error.status = 400;
      throw error;
    }
    if (minRating < 0 || minRating > 5) {
      const error = new Error("minRating must be between 0 and 5.");
      error.status = 400;
      throw error;
    }
    if (!SORTS.has(sortBy)) {
      const error = new Error("Invalid sortBy. Use default, price-low-high, price-high-low or top-rated.");
      error.status = 400;
      throw error;
    }

    // Work on a new array; the master inventory is never mutated.
    let filtered = products.filter(product => {
      const categoryMatch = categories.length === 0 || categories.includes(product.category);
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      const ratingMatch = product.rating >= minRating;
      const searchMatch = !search || `${product.name} ${product.category}`.toLowerCase().includes(search);
      return categoryMatch && priceMatch && ratingMatch && searchMatch;
    });

    // Sorting is deliberately applied after all filtering conditions.
    if (sortBy === "price-low-high") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high-low") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "top-rated") filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

    res.status(200).json({
      success: true,
      total: filtered.length,
      products: filtered,
      filters: { categories, minPrice, maxPrice, minRating, sortBy }
    });
  } catch (error) {
    next(error);
  }
}
