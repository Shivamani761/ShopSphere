import { ArrowDownUp } from "lucide-react";

export default function SortDropdown({ value, onChange }) {
  return <label className="sort-control"><ArrowDownUp size={15}/><span>Sort by</span>
    <select value={value} onChange={e => onChange(e.target.value)} aria-label="Sort products">
      <option value="default">Recommended</option>
      <option value="price-low-high">Price: Low to High</option>
      <option value="price-high-low">Price: High to Low</option>
      <option value="top-rated">Top Rated First</option>
    </select>
  </label>;
}
