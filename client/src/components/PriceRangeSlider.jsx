import { useId } from "react";

const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

export default function PriceRangeSlider({ minPrice, maxPrice, onChange }) {
  const id = useId();
  const minPercent = (minPrice / 100000) * 100;
  const maxPercent = (maxPrice / 100000) * 100;
  return <div className="price-control">
    <div className="price-values"><strong>{money(minPrice)}</strong><strong>{money(maxPrice)}</strong></div>
    <div className="dual-range" style={{ "--min": `${minPercent}%`, "--max": `${maxPercent}%` }}>
      <div className="range-track"/><div className="range-selected"/>
      <input id={`${id}-min`} aria-label="Minimum price" type="range" min="0" max="100000" step="500" value={minPrice}
        onChange={e => onChange({ minPrice: Math.min(Number(e.target.value), maxPrice) })}/>
      <input id={`${id}-max`} aria-label="Maximum price" type="range" min="0" max="100000" step="500" value={maxPrice}
        onChange={e => onChange({ maxPrice: Math.max(Number(e.target.value), minPrice) })}/>
    </div>
    <div className="range-labels"><span>₹0</span><span>₹1,00,000</span></div>
  </div>;
}
