import { carts } from "../data/store.js";
import { products } from "../data/products.js";

function getCart(email) {
  if (!carts.has(email)) carts.set(email, new Map());
  return carts.get(email);
}
function serializeCart(email) {
  const cart = getCart(email);
  const items = [...cart.entries()].map(([productId, quantity]) => {
    const product = products.find(item => item.id === productId);
    return product ? { ...product, quantity, lineTotal: product.price * quantity } : null;
  }).filter(Boolean);
  return { items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), total: items.reduce((sum, item) => sum + item.lineTotal, 0) };
}

export function getCartItems(req, res) {
  res.json({ success: true, cart: serializeCart(req.account.email) });
}
export function addToCart(req, res) {
  const product = products.find(item => item.id === req.body.productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  const cart = getCart(req.account.email);
  const quantity = Math.max(1, Math.min(99, Number(req.body.quantity) || 1));
  cart.set(product.id, Math.min(99, (cart.get(product.id) || 0) + quantity));
  res.status(201).json({ success: true, cart: serializeCart(req.account.email), message: "Added to your cart." });
}
export function updateCartItem(req, res) {
  const quantity = Number(req.body.quantity);
  const cart = getCart(req.account.email);
  if (!cart.has(req.params.productId)) return res.status(404).json({ success: false, message: "Cart item not found." });
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return res.status(400).json({ success: false, message: "Quantity must be between 1 and 99." });
  cart.set(req.params.productId, quantity);
  res.json({ success: true, cart: serializeCart(req.account.email) });
}
export function removeCartItem(req, res) {
  getCart(req.account.email).delete(req.params.productId);
  res.json({ success: true, cart: serializeCart(req.account.email) });
}
