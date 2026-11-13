import { Search, ShoppingBag, Menu } from "lucide-react";

export default function Header({ search, onSearch, total, onMenu, account, cartCount, onAccount, onCart }) {
  return <header className="header">
    <button className="mobile-menu icon-button" onClick={onMenu} aria-label="Open filters"><Menu size={20}/></button>
    <a className="logo" href="#"><span className="logo-symbol">S</span><span>shop<span>sphere</span></span></a>
    <nav className="nav-links"><a className="selected" href="#products">Discover</a><a href="#products">New arrivals</a><a href="#about">About</a></nav>
    <label className="header-search"><Search size={17}/><input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search products..." aria-label="Search products"/></label>
    <div className="header-right"><span className="header-count">{total} products</span><button className="account-header-button" onClick={onAccount}>{account ? account.name.split(" ")[0] : "Sign in"}</button><button className="icon-button bag" aria-label="Shopping cart" onClick={onCart}><ShoppingBag size={19}/>{cartCount > 0 && <b className="cart-count">{cartCount}</b>}</button></div>
  </header>;
}
