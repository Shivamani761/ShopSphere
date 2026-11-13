import ProductCard from "./ProductCard.jsx";
import { PackageSearch } from "lucide-react";

export default function ProductGrid({ products, loading, error, onReset, onAddToCart, addingProductId }) {
  if (loading) return <div className="product-grid">{Array.from({ length: 6 }, (_, i) => <div className="skeleton-card" key={i}><div/><span/><b/></div>)}</div>;
  if (error) return <div className="empty-state"><PackageSearch size={42}/><h3>We couldn't load the catalogue.</h3><p>{error}</p><button onClick={onReset}>Reset filters and retry</button></div>;
  if (!products.length) return <div className="empty-state"><div className="empty-icon"><PackageSearch size={34}/></div><span className="overline">NOTHING HERE JUST YET</span><h3>No items match your criteria.</h3><p>Try widening your price range or clearing one of your filters to discover more.</p><button onClick={onReset}>Reset filters</button></div>;
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} adding={addingProductId === product.id}/>)}</div>;
}
