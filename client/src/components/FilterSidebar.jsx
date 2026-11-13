import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider.jsx";

const categories = ["Electronics", "Apparel", "Footwear", "Home & Kitchen", "Sports"];
const ratings = [5, 4, 3, 2, 1];

export default function FilterSidebar({ filters, onChange, onReset, open, onClose }) {
  const toggleCategory = category => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter(item => item !== category)
      : [...filters.categories, category];
    onChange({ categories: next });
  };

  return <>
    <div className={`drawer-backdrop ${open ? "visible" : ""}`} onClick={onClose}/>
    <aside className={`sidebar ${open ? "drawer-open" : ""}`}>
      <div className="sidebar-top"><div><span className="overline">MAKE IT YOURS</span><h2><SlidersHorizontal size={18}/> Filters</h2></div><button className="close-drawer" onClick={onClose} aria-label="Close filters"><X size={19}/></button></div>
      <section className="filter-group">
        <div className="group-heading"><h3>Category</h3><span>{filters.categories.length ? `${filters.categories.length} selected` : "All"}</span></div>
        {categories.map(category => <label className="check-option" key={category}>
          <input type="checkbox" checked={filters.categories.includes(category)} onChange={() => toggleCategory(category)}/>
          <span className="custom-check"/><span>{category}</span>
        </label>)}
      </section>
      <section className="filter-group">
        <div className="group-heading"><h3>Price range</h3><span>INR</span></div>
        <PriceRangeSlider minPrice={filters.minPrice} maxPrice={filters.maxPrice} onChange={onChange}/>
      </section>
      <section className="filter-group">
        <div className="group-heading"><h3>Customer rating</h3></div>
        <div className="rating-list">
          <label className="rating-option"><input type="radio" name="rating" checked={filters.minRating === 0} onChange={() => onChange({ minRating: 0 })}/><span className="radio-mark"/><span>All ratings</span></label>
          {ratings.map(rating => <label className="rating-option" key={rating}>
            <input type="radio" name="rating" checked={filters.minRating === rating} onChange={() => onChange({ minRating: rating })}/>
            <span className="radio-mark"/><span className="stars">{"★".repeat(rating)}<span className="faded-stars">{"★".repeat(5-rating)}</span></span><span className="rating-caption">{rating === 5 ? "only" : "& up"}</span>
          </label>)}
        </div>
      </section>
      <button className="reset-button" onClick={onReset}><RotateCcw size={15}/> Reset filters</button>
      <p className="sidebar-footnote"><span/> Your results update automatically</p>
    </aside>
  </>;
}
