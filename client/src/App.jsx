
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from "./components/Header.jsx";
import FilterSidebar from "./components/FilterSidebar.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import SortDropdown from "./components/SortDropdown.jsx";
import AccountModal from "./components/AccountModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import { useProducts } from "./hooks/useProducts.js";
import {
  createAccount,
  loginAccount,
  logoutAccount,
  fetchCart,
  addCartProduct,
  changeCartQuantity,
  removeCartProduct
} from "./services/accountApi.js";

const initialFilters = {
  categories: [],
  minPrice: 0,
  maxPrice: 100000,
  minRating: 0,
  sortBy: "default",
  search: ""
};

export default function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { products, total, loading, error } = useProducts(filters);

  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("shopsphere-account") || "null"
      );
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => sessionStorage.getItem("shopsphere-token") || ""
  );

  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    total: 0
  });

  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [addingProductId, setAddingProductId] = useState("");
  const [pendingAddProductId, setPendingAddProductId] = useState("");

  const updateFilters = patch =>
    setFilters(current => ({ ...current, ...patch }));

  const resetFilters = () => setFilters(initialFilters);

  useEffect(() => {
    if (!token) {
      setCart({ items: [], itemCount: 0, total: 0 });
      return;
    }

    fetchCart(token)
      .then(result => setCart(result.cart))
      .catch(() => {
        setToken("");
        setAccount(null);
        sessionStorage.removeItem("shopsphere-token");
        sessionStorage.removeItem("shopsphere-account");
      });
  }, [token]);

  const handleAuth = async ({ mode, name, email, password }) => {
    setAuthBusy(true);
    setAuthError("");

    try {
      const result =
        mode === "signup"
          ? await createAccount({ name, email, password })
          : await loginAccount({ email, password });

      setToken(result.token);
      setAccount(result.account);

      sessionStorage.setItem("shopsphere-token", result.token);
      sessionStorage.setItem(
        "shopsphere-account",
        JSON.stringify(result.account)
      );

      setAccountOpen(false);

      if (pendingAddProductId) {
        const cartResult = await addCartProduct(
          result.token,
          pendingAddProductId
        );

        setCart(cartResult.cart);
        setCartOpen(true);
        setPendingAddProductId("");
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (token) await logoutAccount(token);
    } catch {}

    setToken("");
    setAccount(null);
    setCart({ items: [], itemCount: 0, total: 0 });

    sessionStorage.removeItem("shopsphere-token");
    sessionStorage.removeItem("shopsphere-account");
  };

  const handleAddToCart = async productId => {
    if (!account || !token) {
      setPendingAddProductId(productId);
      setAccountOpen(true);
      setAuthError(
        "Create an account or sign in to add this product. We will add it to your cart after you sign in."
      );
      return;
    }

    setAddingProductId(productId);

    try {
      const result = await addCartProduct(token, productId);
      setCart(result.cart);
      setCartOpen(true);
    } catch (err) {
      setAuthError(err.message);
      setAccountOpen(true);
    } finally {
      setAddingProductId("");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const result = await changeCartQuantity(
        token,
        productId,
        quantity
      );
      setCart(result.cart);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const removeItem = async productId => {
    try {
      const result = await removeCartProduct(token, productId);
      setCart(result.cart);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  return (
    <div className="app-shell">

      <Header
        search={filters.search}
        onSearch={search => updateFilters({ search })}
        total={total}
        onMenu={() => setDrawerOpen(true)}
        account={account}
        cartCount={cart.itemCount}
        onAccount={() => {
          setAuthError("");
          setAccountOpen(true);
        }}
        onCart={() => setCartOpen(true)}
      />

      {account && (
        <div className="account-strip">
          <span>
            Signed in as <strong>{account.name}</strong>
          </span>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      )}

      <main>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <span className="hero-tag">
              <Sparkles size={13} /> THE SMARTER WAY TO SHOP
            </span>

            <h1>
              Good finds.
              <br />
              <em>Great feeling.</em>
            </h1>

            <p>
              Discover everyday essentials, thoughtfully picked for you.
              Your next favourite is just a filter away.
            </p>

            <a href="#products" className="hero-cta">
              Explore collection <ArrowRight size={16} />
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-circle circle-a" />
            <div className="hero-circle circle-b" />
            <div className="hero-product product-one">
              S<span>✳</span>
            </div>
            <div className="hero-product product-two">
              SHOP
              <br />
              BETTER
            </div>
            <div className="hero-note">
              CURATED FOR
              <br />
              EVERYDAY LIVING
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="catalog-section" id="products">
          <div className="section-intro">
            <div>
              <span className="overline">THE COLLECTION</span>
              <h2>
                Explore products<span>.</span>
              </h2>
            </div>
            <p>Quality picks for every part of your day.</p>
          </div>

          <div className="catalog-layout">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />

            <div className="catalog-content">
              <div className="catalog-toolbar">
                <div>
                  <strong>
                    {loading ? "Updating..." : `${total} products`}
                  </strong>
                  <span> matched to your selection</span>
                </div>

                <SortDropdown
                  value={filters.sortBy}
                  onChange={sortBy => updateFilters({ sortBy })}
                />
              </div>

              <ProductGrid
                products={products}
                loading={loading}
                error={error}
                onReset={resetFilters}
                onAddToCart={handleAddToCart}
                addingProductId={addingProductId}
              />
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-section" id="about">
          <span className="overline">GET TO KNOW US</span>

          <h2>About ShopSphere</h2>

          <p>
            Welcome to ShopSphere – Your World of Shopping, All in One Place!
            We are a modern online shopping platform designed to make
            shopping simple, convenient, and enjoyable.
          </p>

          <p>
            Explore electronics, apparel, footwear, home and kitchen
            essentials, and sports products — all in one place.
          </p>

          <h3>What Makes Us Special?</h3>

          <ul>
            <li>Wide range of products across multiple categories.</li>
            <li>Smart filters to find products easily.</li>
            <li>Product ratings to help make better choices.</li>
            <li>Secure account access and personalized shopping.</li>
            <li>Easy cart management and a smooth shopping experience.</li>
          </ul>

          <h3>Our Mission</h3>

          <p>
            Our mission is to provide a smooth and convenient shopping
            experience with smart filters, product ratings, user accounts,
            and easy cart management.
          </p>

          <h3>Shop smarter. Shop easier. ShopSphere!</h3>
        </section>

      </main>

      {/* Footer */}
      <footer>
        <a className="logo" href="#">
          <span className="logo-symbol">S</span>
          <span>
            shop<span>sphere</span>
          </span>
        </a>

        <p>Discover more. Choose well. Live better.</p>

        <a href="#about">About Us</a>

        <span>© 2026 SHOPSPHERE</span>
      </footer>

      {/* Account Modal */}
      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onSubmit={handleAuth}
        busy={authBusy}
        error={authError}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        account={account}
        onQuantity={updateQuantity}
        onRemove={removeItem}
        onSignIn={() => {
          setCartOpen(false);
          setAuthError("");
          setAccountOpen(true);
        }}
      />

    </div>
  );
}
