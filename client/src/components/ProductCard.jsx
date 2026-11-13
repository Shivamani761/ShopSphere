import { Star } from "lucide-react";

const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

export default function ProductCard({ product, onAddToCart, adding }) {
  const fallback = "https://placehold.co/700x520/f1f4f8/536176?text=ShopSphere";
  return <article className="product-card">
    <div className="product-image">
      <img src={product.image} alt={product.name} loading="lazy" onError={event => { event.currentTarget.src = fallback; }}/>
      <span className="image-category">{product.category}</span>
    </div>
    <div className="product-info">
      <div className="product-category">{product.category}</div>
      <h3>{product.name}</h3>
      <div className="product-rating"><Star size={14} fill="currentColor"/><strong>{product.rating.toFixed(1)}</strong><span>({product.reviews.toLocaleString("en-IN")} reviews)</span></div>
      <div className="product-card-bottom"><div className="product-price">{money(product.price)}</div><button className="add-cart-button" onClick={() => onAddToCart(product.id)} disabled={adding}>{adding ? "Adding..." : "Add to cart"}</button></div>
    </div>
  </article>;
}
