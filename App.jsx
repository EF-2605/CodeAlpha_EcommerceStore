import { useState, useEffect, createContext, useContext, useReducer } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", price: 149.99, category: "Electronics", rating: 4.8, reviews: 312, stock: 15, image: "🎧", description: "Premium audio experience with 40-hour battery life, active noise cancellation, and foldable design. Perfect for commuters and audiophiles alike.", specs: ["40hr battery", "ANC technology", "Bluetooth 5.0", "Foldable design"] },
  { id: 2, name: "Minimalist Leather Wallet", price: 39.99, category: "Accessories", rating: 4.6, reviews: 189, stock: 42, image: "👛", description: "Slim bifold wallet crafted from genuine full-grain leather. Fits up to 8 cards with a dedicated cash slot and RFID blocking.", specs: ["Genuine leather", "RFID blocking", "8 card slots", "Ultra-slim profile"] },
  { id: 3, name: "Smart Fitness Watch", price: 199.99, category: "Electronics", rating: 4.7, reviews: 428, stock: 8, image: "⌚", description: "Track your health 24/7 with heart rate, SpO2, sleep analysis, and 100+ workout modes. 7-day battery, 5ATM water resistance.", specs: ["Heart rate + SpO2", "7-day battery", "5ATM waterproof", "100+ workout modes"] },
  { id: 4, name: "Organic Cotton Tote Bag", price: 24.99, category: "Bags", rating: 4.5, reviews: 95, stock: 60, image: "🛍️", description: "Sustainably sourced organic cotton tote with reinforced handles and an inner zip pocket. Holds up to 30 lbs.", specs: ["100% organic cotton", "Inner zip pocket", "30 lb capacity", "Machine washable"] },
  { id: 5, name: "Ceramic Pour-Over Coffee Set", price: 64.99, category: "Kitchen", rating: 4.9, reviews: 201, stock: 23, image: "☕", description: "Artisan-crafted ceramic dripper and carafe set for the perfect pour-over ritual. Includes 50 natural paper filters.", specs: ["Artisan ceramic", "600ml carafe", "50 filters included", "Dishwasher safe"] },
  { id: 6, name: "Mechanical Keyboard TKL", price: 119.99, category: "Electronics", rating: 4.7, reviews: 356, stock: 19, image: "⌨️", description: "Tenkeyless mechanical keyboard with tactile brown switches, RGB backlighting, and aluminum top plate. N-key rollover.", specs: ["Tactile brown switches", "RGB per-key lighting", "Aluminum frame", "N-key rollover"] },
  { id: 7, name: "Yoga Mat Premium", price: 54.99, category: "Sports", rating: 4.6, reviews: 143, stock: 35, image: "🧘", description: "Extra-thick 6mm non-slip yoga mat with alignment markings, carrying strap, and moisture-wicking surface.", specs: ["6mm thickness", "Non-slip surface", "Alignment guides", "Carrying strap"] },
  { id: 8, name: "Stainless Steel Water Bottle", price: 32.99, category: "Sports", rating: 4.8, reviews: 267, stock: 50, image: "🍶", description: "Double-wall vacuum insulated bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free with leak-proof lid.", specs: ["24hr cold / 12hr hot", "BPA-free", "750ml capacity", "Leak-proof lid"] },
  { id: 9, name: "Scented Soy Candle Set", price: 44.99, category: "Home", rating: 4.5, reviews: 88, stock: 28, image: "🕯️", description: "Set of 3 hand-poured soy wax candles in amber glass jars. Scents: Sandalwood, Vanilla Latte, Sea Breeze.", specs: ["100% soy wax", "60hr burn time each", "Set of 3", "Gift-ready packaging"] },
  { id: 10, name: "Running Shoes Pro", price: 129.99, category: "Sports", rating: 4.7, reviews: 512, stock: 12, image: "👟", description: "Lightweight responsive running shoes with carbon-infused foam midsole, breathable mesh upper, and anti-slip outsole.", specs: ["Carbon-infused midsole", "Breathable mesh", "Anti-slip grip", "250g per shoe"] },
  { id: 11, name: "Bamboo Cutting Board Set", price: 38.99, category: "Kitchen", rating: 4.6, reviews: 154, stock: 30, image: "🪵", description: "Set of 3 sustainably grown bamboo cutting boards in small, medium, and large sizes. Naturally antibacterial.", specs: ["100% bamboo", "3 sizes", "Antibacterial", "Easy-grip handles"] },
  { id: 12, name: "Portable Bluetooth Speaker", price: 79.99, category: "Electronics", rating: 4.6, reviews: 287, stock: 22, image: "🔊", description: "360° surround sound with 12-hour playtime, IPX7 waterproofing, and built-in mic for hands-free calls.", specs: ["360° sound", "12hr battery", "IPX7 waterproof", "Hands-free mic"] },
];

const CATEGORIES = ["All", ...new Set(PRODUCTS.map(p => p.category))];

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

const initialState = {
  user: null,
  users: [{ id: 1, name: "Demo User", email: "demo@shopwave.com", password: "demo123", orders: [] }],
  cart: [],
  orders: [],
  page: "home",
  selectedProduct: null,
  notification: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE": return { ...state, page: action.payload, selectedProduct: null };
    case "SET_PRODUCT": return { ...state, selectedProduct: action.payload, page: "product" };
    case "LOGIN": {
      const user = state.users.find(u => u.email === action.email && u.password === action.password);
      if (!user) return { ...state, notification: { type: "error", msg: "Invalid email or password." } };
      return { ...state, user, notification: { type: "success", msg: `Welcome back, ${user.name.split(" ")[0]}!` } };
    }
    case "REGISTER": {
      if (state.users.find(u => u.email === action.data.email))
        return { ...state, notification: { type: "error", msg: "Email already registered." } };
      const newUser = { id: Date.now(), ...action.data, orders: [] };
      return { ...state, users: [...state.users, newUser], user: newUser, notification: { type: "success", msg: `Account created! Welcome, ${newUser.name.split(" ")[0]}!` } };
    }
    case "LOGOUT": return { ...state, user: null, cart: [], page: "home", notification: { type: "info", msg: "Logged out successfully." } };
    case "ADD_TO_CART": {
      const exists = state.cart.find(i => i.id === action.product.id);
      const cart = exists
        ? state.cart.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { ...action.product, qty: 1 }];
      return { ...state, cart, notification: { type: "success", msg: `${action.product.name.split(" ").slice(0, 3).join(" ")} added to cart!` } };
    }
    case "REMOVE_FROM_CART": return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
    case "UPDATE_QTY": return { ...state, cart: state.cart.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i) };
    case "PLACE_ORDER": {
      if (!state.user) return { ...state, page: "login", notification: { type: "info", msg: "Please log in to place an order." } };
      const order = { id: `ORD-${Date.now()}`, items: [...state.cart], total: action.total, date: new Date().toLocaleDateString(), status: "Processing", address: action.address };
      const updatedUsers = state.users.map(u => u.id === state.user.id ? { ...u, orders: [order, ...u.orders] } : u);
      const updatedUser = { ...state.user, orders: [order, ...state.user.orders] };
      return { ...state, users: updatedUsers, user: updatedUser, orders: [order, ...state.orders], cart: [], page: "orders", notification: { type: "success", msg: `Order ${order.id} placed successfully!` } };
    }
    case "CLEAR_NOTIFICATION": return { ...state, notification: null };
    default: return state;
  }
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#f7f5f2;color:#1a1a18;min-height:100vh}
  :root{--cream:#f7f5f2;--warm:#ede9e3;--charcoal:#1a1a18;--muted:#6b6860;--accent:#c4581a;--accent-light:#f5ede5;--green:#2d6a4f;--green-light:#e8f5ee;--border:#ddd9d3;--white:#ffffff;--card-shadow:0 1px 3px rgba(0,0,0,0.08);--radius:10px}
  .app{min-height:100vh;display:flex;flex-direction:column}
  /* NAV */
  nav{background:var(--charcoal);color:var(--white);padding:0 2rem;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
  .nav-brand{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:600;color:var(--white);cursor:pointer;letter-spacing:-0.02em}
  .nav-brand span{color:#e8a87c}
  .nav-links{display:flex;align-items:center;gap:0.25rem}
  .nav-btn{background:none;border:none;color:rgba(255,255,255,0.75);cursor:pointer;padding:0.4rem 0.75rem;border-radius:6px;font-size:0.85rem;font-family:'DM Sans',sans-serif;transition:all 0.15s;display:flex;align-items:center;gap:0.3rem}
  .nav-btn:hover{background:rgba(255,255,255,0.1);color:var(--white)}
  .cart-badge{background:var(--accent);color:white;border-radius:50%;width:18px;height:18px;font-size:0.7rem;display:flex;align-items:center;justify-content:center;font-weight:600}
  /* NOTIFICATION */
  .notif{position:fixed;top:70px;right:1rem;z-index:200;padding:0.75rem 1.25rem;border-radius:var(--radius);font-size:0.875rem;font-weight:500;max-width:320px;animation:slideIn 0.3s ease;box-shadow:0 4px 16px rgba(0,0,0,0.12)}
  .notif-success{background:#2d6a4f;color:white}
  .notif-error{background:#c0392b;color:white}
  .notif-info{background:#2c5f8a;color:white}
  @keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
  /* HERO */
  .hero{background:var(--charcoal);color:white;padding:4rem 2rem;text-align:center}
  .hero h1{font-family:'Playfair Display',serif;font-size:3rem;font-weight:600;margin-bottom:0.75rem;letter-spacing:-0.03em}
  .hero h1 span{color:#e8a87c}
  .hero p{color:rgba(255,255,255,0.65);font-size:1.05rem;max-width:480px;margin:0 auto 2rem;font-weight:300}
  .hero-cta{background:var(--accent);color:white;border:none;padding:0.75rem 2rem;border-radius:8px;font-size:1rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.15s}
  .hero-cta:hover{background:#b04c14}
  /* MAIN */
  main{flex:1;padding:2rem;max-width:1200px;margin:0 auto;width:100%}
  /* FILTERS */
  .filters{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem;align-items:center}
  .filter-label{font-size:0.8rem;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:0.05em;margin-right:0.25rem}
  .filter-btn{background:var(--white);border:1.5px solid var(--border);color:var(--muted);padding:0.35rem 0.9rem;border-radius:50px;font-size:0.82rem;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;font-weight:500}
  .filter-btn:hover{border-color:var(--accent);color:var(--accent)}
  .filter-btn.active{background:var(--charcoal);border-color:var(--charcoal);color:white}
  .search-bar{border:1.5px solid var(--border);background:var(--white);padding:0.4rem 0.9rem;border-radius:50px;font-size:0.875rem;font-family:'DM Sans',sans-serif;outline:none;margin-left:auto;width:200px;color:var(--charcoal)}
  .search-bar:focus{border-color:var(--accent)}
  /* PRODUCT GRID */
  .product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.25rem}
  .product-card{background:var(--white);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column}
  .product-card:hover{box-shadow:0 6px 24px rgba(0,0,0,0.1);transform:translateY(-2px)}
  .product-img{background:var(--warm);height:160px;display:flex;align-items:center;justify-content:center;font-size:3.5rem}
  .product-info{padding:1rem;flex:1;display:flex;flex-direction:column}
  .product-cat{font-size:0.72rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--accent);font-weight:600;margin-bottom:0.3rem}
  .product-name{font-size:0.95rem;font-weight:600;color:var(--charcoal);margin-bottom:0.5rem;line-height:1.35}
  .product-rating{display:flex;align-items:center;gap:0.3rem;font-size:0.78rem;color:var(--muted);margin-bottom:0.6rem}
  .stars{color:#e8a020}
  .product-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:0.75rem;border-top:1px solid var(--border)}
  .product-price{font-size:1.1rem;font-weight:600;color:var(--charcoal)}
  .add-btn{background:var(--charcoal);color:white;border:none;padding:0.4rem 0.9rem;border-radius:6px;font-size:0.8rem;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;transition:background 0.15s}
  .add-btn:hover{background:var(--accent)}
  /* PRODUCT DETAIL */
  .product-detail{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start}
  .detail-img{background:var(--warm);border-radius:var(--radius);height:360px;display:flex;align-items:center;justify-content:center;font-size:7rem;border:1px solid var(--border)}
  .detail-cat{font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--accent);font-weight:600;margin-bottom:0.5rem}
  .detail-name{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:500;color:var(--charcoal);margin-bottom:0.5rem;line-height:1.25}
  .detail-price{font-size:1.6rem;font-weight:600;color:var(--charcoal);margin:0.75rem 0}
  .detail-desc{color:var(--muted);line-height:1.65;font-size:0.92rem;margin-bottom:1.25rem}
  .spec-list{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-bottom:1.5rem}
  .spec-item{background:var(--warm);border-radius:6px;padding:0.4rem 0.75rem;font-size:0.8rem;color:var(--charcoal);font-weight:500}
  .in-stock{color:var(--green);font-size:0.82rem;font-weight:500;margin-bottom:1rem}
  .btn-primary{background:var(--charcoal);color:white;border:none;padding:0.8rem 1.75rem;border-radius:8px;font-size:0.95rem;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;transition:background 0.15s;width:100%}
  .btn-primary:hover{background:var(--accent)}
  .btn-back{background:none;border:1.5px solid var(--border);color:var(--muted);padding:0.5rem 1.1rem;border-radius:8px;font-size:0.85rem;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;margin-bottom:1.5rem;display:inline-flex;align-items:center;gap:0.4rem;transition:all 0.15s}
  .btn-back:hover{border-color:var(--charcoal);color:var(--charcoal)}
  /* CART */
  .cart-layout{display:grid;grid-template-columns:1fr 380px;gap:2rem;align-items:start}
  .section-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:500;margin-bottom:1.5rem;color:var(--charcoal)}
  .cart-item{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem;margin-bottom:0.75rem}
  .cart-item-img{font-size:2rem;background:var(--warm);width:56px;height:56px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .cart-item-info{flex:1}
  .cart-item-name{font-weight:600;font-size:0.92rem;margin-bottom:0.2rem}
  .cart-item-price{color:var(--muted);font-size:0.85rem}
  .qty-ctrl{display:flex;align-items:center;gap:0.5rem}
  .qty-btn{background:var(--warm);border:none;width:26px;height:26px;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:600;display:flex;align-items:center;justify-content:center;color:var(--charcoal)}
  .qty-val{font-weight:600;min-width:20px;text-align:center;font-size:0.9rem}
  .remove-btn{background:none;border:none;color:#c0392b;cursor:pointer;font-size:0.8rem;font-weight:500;font-family:'DM Sans',sans-serif;padding:0.25rem 0.5rem;border-radius:4px}
  .remove-btn:hover{background:#fdecea}
  .order-summary{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;position:sticky;top:75px}
  .summary-row{display:flex;justify-content:space-between;font-size:0.9rem;margin-bottom:0.6rem;color:var(--muted)}
  .summary-total{display:flex;justify-content:space-between;font-size:1.05rem;font-weight:600;color:var(--charcoal);padding-top:0.75rem;border-top:1.5px solid var(--border);margin-top:0.5rem}
  .empty-cart{text-align:center;padding:4rem 2rem;color:var(--muted)}
  .empty-icon{font-size:3rem;margin-bottom:1rem;opacity:0.5}
  /* CHECKOUT */
  .checkout-layout{display:grid;grid-template-columns:1fr 380px;gap:2rem;align-items:start}
  .form-group{margin-bottom:1rem}
  .form-label{font-size:0.82rem;font-weight:500;color:var(--charcoal);display:block;margin-bottom:0.4rem}
  .form-input{width:100%;border:1.5px solid var(--border);border-radius:8px;padding:0.6rem 0.85rem;font-size:0.9rem;font-family:'DM Sans',sans-serif;outline:none;background:var(--white);color:var(--charcoal);transition:border 0.15s}
  .form-input:focus{border-color:var(--charcoal)}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
  .form-section{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;margin-bottom:1rem}
  .form-section-title{font-weight:600;font-size:0.9rem;margin-bottom:1rem;color:var(--charcoal);padding-bottom:0.5rem;border-bottom:1px solid var(--border)}
  /* AUTH */
  .auth-page{min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;background:var(--cream);padding:2rem}
  .auth-card{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:2.5rem;width:100%;max-width:420px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
  .auth-title{font-family:'Playfair Display',serif;font-size:1.75rem;font-weight:500;margin-bottom:0.4rem;color:var(--charcoal)}
  .auth-sub{color:var(--muted);font-size:0.875rem;margin-bottom:2rem}
  .auth-switch{text-align:center;margin-top:1.25rem;font-size:0.875rem;color:var(--muted)}
  .auth-link{color:var(--accent);cursor:pointer;font-weight:500;text-decoration:none}
  /* ORDERS */
  .order-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem 1.5rem;margin-bottom:1rem}
  .order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem}
  .order-id{font-weight:600;font-size:0.9rem;color:var(--charcoal)}
  .order-date{font-size:0.8rem;color:var(--muted)}
  .status-badge{padding:0.25rem 0.75rem;border-radius:50px;font-size:0.75rem;font-weight:600}
  .status-processing{background:var(--accent-light);color:var(--accent)}
  .order-items{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem}
  .order-item-chip{background:var(--warm);padding:0.3rem 0.6rem;border-radius:6px;font-size:0.78rem}
  .order-total{font-weight:600;color:var(--charcoal);font-size:0.95rem}
  /* FOOTER */
  footer{background:var(--charcoal);color:rgba(255,255,255,0.5);text-align:center;padding:1.5rem;font-size:0.8rem}
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Stars = ({ r }) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const fmt = n => `$${Number(n).toFixed(2)}`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Notification({ notif, onClose }) {
  useEffect(() => { if (notif) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); } }, [notif]);
  if (!notif) return null;
  return <div className={`notif notif-${notif.type}`}>{notif.msg}</div>;
}

function Navbar({ state, dispatch }) {
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  return (
    <nav>
      <div className="nav-brand" onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>
        Shop<span>Wave</span>
      </div>
      <div className="nav-links">
        <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>Shop</button>
        {state.user && <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "orders" })}>Orders</button>}
        <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "cart" })}>
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        {state.user ? (
          <>
            <button className="nav-btn" style={{ color: "rgba(255,255,255,0.9)" }}>👤 {state.user.name.split(" ")[0]}</button>
            <button className="nav-btn" onClick={() => dispatch({ type: "LOGOUT" })}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: "login" })}>Login</button>
            <button className="nav-btn" style={{ background: "var(--accent)", color: "white", borderRadius: "6px" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "register" })}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

function HomePage({ state, dispatch }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const filtered = PRODUCTS.filter(p => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="hero">
        <h1>Curated <span>Essentials</span></h1>
        <p>Premium products thoughtfully selected for modern living.</p>
        <button className="hero-cta" onClick={() => document.getElementById("shop-grid").scrollIntoView({ behavior: "smooth" })}>Browse Collection</button>
      </div>
      <main id="shop-grid">
        <div className="filters">
          <span className="filter-label">Filter:</span>
          {CATEGORIES.map(c => <button key={c} className={`filter-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
          <input className="search-bar" placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="product-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-img" onClick={() => dispatch({ type: "SET_PRODUCT", payload: p })}>{p.image}</div>
              <div className="product-info">
                <div className="product-cat">{p.category}</div>
                <div className="product-name" onClick={() => dispatch({ type: "SET_PRODUCT", payload: p })}>{p.name}</div>
                <div className="product-rating">
                  <span className="stars">{Stars({ r: p.rating })}</span>
                  <span>{p.rating} ({p.reviews})</span>
                </div>
                <div className="product-footer">
                  <span className="product-price">{fmt(p.price)}</span>
                  <button className="add-btn" onClick={() => dispatch({ type: "ADD_TO_CART", product: p })}>+ Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>No products match your search.</div>}
      </main>
    </>
  );
}

function ProductPage({ product, dispatch }) {
  return (
    <main>
      <button className="btn-back" onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>← Back to Shop</button>
      <div className="product-detail">
        <div className="detail-img">{product.image}</div>
        <div>
          <div className="detail-cat">{product.category}</div>
          <h1 className="detail-name">{product.name}</h1>
          <div className="product-rating" style={{ marginBottom: "0" }}>
            <span className="stars" style={{ fontSize: "1rem" }}>{Stars({ r: product.rating })}</span>
            <span style={{ color: "var(--muted)" }}>{product.rating} · {product.reviews} reviews</span>
          </div>
          <div className="detail-price">{fmt(product.price)}</div>
          <p className="detail-desc">{product.description}</p>
          <ul className="spec-list">
            {product.specs.map((s, i) => <li key={i} className="spec-item">✓ {s}</li>)}
          </ul>
          <div className="in-stock">✓ In Stock — {product.stock} units available</div>
          <button className="btn-primary" onClick={() => dispatch({ type: "ADD_TO_CART", product })}>Add to Cart — {fmt(product.price)}</button>
        </div>
      </div>
    </main>
  );
}

function CartPage({ state, dispatch }) {
  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 75 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (state.cart.length === 0) return (
    <main>
      <h1 className="section-title">Your Cart</h1>
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <p style={{ fontWeight: 500, fontSize: "1.05rem", marginBottom: "0.5rem" }}>Your cart is empty</p>
        <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>Discover our curated collection and add some items.</p>
        <button className="btn-primary" style={{ width: "auto", padding: "0.7rem 2rem" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>Browse Products</button>
      </div>
    </main>
  );

  return (
    <main>
      <h1 className="section-title">Your Cart ({state.cart.reduce((s, i) => s + i.qty, 0)} items)</h1>
      <div className="cart-layout">
        <div>
          {state.cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">{item.image}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{fmt(item.price)} each</div>
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty - 1 })}>−</button>
                <span className="qty-val">{item.qty}</span>
                <button className="qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty + 1 })}>+</button>
              </div>
              <div style={{ textAlign: "right", minWidth: 70 }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{fmt(item.price * item.qty)}</div>
                <button className="remove-btn" onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: item.id })}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h3 style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free 🎉" : fmt(shipping)}</span></div>
          {shipping > 0 && <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginBottom: "0.4rem" }}>Add {fmt(75 - subtotal)} more for free shipping</div>}
          <div className="summary-row"><span>Tax (8%)</span><span>{fmt(tax)}</span></div>
          <div className="summary-total"><span>Total</span><span>{fmt(total)}</span></div>
          <button className="btn-primary" style={{ marginTop: "1.25rem" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "checkout" })}>Proceed to Checkout</button>
          <button className="btn-back" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>Continue Shopping</button>
        </div>
      </div>
    </main>
  );
}

function CheckoutPage({ state, dispatch }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: state.user?.email || "", phone: "", address: "", city: "", zip: "", country: "United States", cardName: "", cardNum: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 75 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/\S+@\S+\.\S+/)) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (!form.cardNum.replace(/\s/g, "").match(/^\d{16}$/)) e.cardNum = "16-digit card number required";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY format";
    if (!form.cvv.match(/^\d{3,4}$/)) e.cvv = "3-4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inp = (k, v) => {
    let val = v;
    if (k === "cardNum") val = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "expiry") { val = v.replace(/\D/g, "").slice(0, 4); if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2); }
    if (k === "cvv") val = v.replace(/\D/g, "").slice(0, 4);
    setForm(f => ({ ...f, [k]: val }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = () => {
    if (!state.user) { dispatch({ type: "SET_PAGE", payload: "login" }); return; }
    if (validate()) dispatch({ type: "PLACE_ORDER", total, address: `${form.address}, ${form.city}, ${form.zip}` });
  };

  const F = ({ label, name, placeholder, half }) => (
    <div className="form-group" style={half ? {} : {}}>
      <label className="form-label">{label}</label>
      <input className="form-input" value={form[name]} onChange={e => inp(name, e.target.value)} placeholder={placeholder} style={errors[name] ? { borderColor: "#c0392b" } : {}} />
      {errors[name] && <div style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors[name]}</div>}
    </div>
  );

  return (
    <main>
      <button className="btn-back" onClick={() => dispatch({ type: "SET_PAGE", payload: "cart" })}>← Back to Cart</button>
      <h1 className="section-title">Checkout</h1>
      {!state.user && <div style={{ background: "var(--accent-light)", border: "1.5px solid var(--accent)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--accent)", fontWeight: 500 }}>
        💡 <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "login" })}>Log in</span> to save your order history.
      </div>}
      <div className="checkout-layout">
        <div>
          <div className="form-section">
            <div className="form-section-title">Contact Information</div>
            <div className="form-row"><F label="First Name" name="firstName" placeholder="John" /><F label="Last Name" name="lastName" placeholder="Smith" /></div>
            <div className="form-row"><F label="Email" name="email" placeholder="john@example.com" /><F label="Phone" name="phone" placeholder="+1 555 0100" /></div>
          </div>
          <div className="form-section">
            <div className="form-section-title">Shipping Address</div>
            <F label="Street Address" name="address" placeholder="123 Main Street" />
            <div className="form-row"><F label="City" name="city" placeholder="New York" /><F label="ZIP Code" name="zip" placeholder="10001" /></div>
            <F label="Country" name="country" placeholder="United States" />
          </div>
          <div className="form-section">
            <div className="form-section-title">💳 Payment Details</div>
            <F label="Cardholder Name" name="cardName" placeholder="John Smith" />
            <F label="Card Number" name="cardNum" placeholder="1234 5678 9012 3456" />
            <div className="form-row"><F label="Expiry Date" name="expiry" placeholder="MM/YY" /><F label="CVV" name="cvv" placeholder="123" /></div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>🔒 Your payment information is encrypted and secure.</div>
          </div>
        </div>
        <div className="order-summary" style={{ top: 75 }}>
          <h3 style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>Order Summary</h3>
          {state.cart.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem", color: "var(--muted)" }}>
              <span>{i.image} {i.name.split(" ").slice(0, 3).join(" ")}… ×{i.qty}</span>
              <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
            <div className="summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : fmt(shipping)}</span></div>
            <div className="summary-row"><span>Tax</span><span>{fmt(tax)}</span></div>
            <div className="summary-total"><span>Total</span><span>{fmt(total)}</span></div>
          </div>
          <button className="btn-primary" style={{ marginTop: "1.25rem" }} onClick={handleSubmit}>Place Order — {fmt(total)}</button>
        </div>
      </div>
    </main>
  );
}

function AuthPage({ mode, dispatch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isLogin = mode === "login";

  const handleSubmit = () => {
    if (isLogin) {
      dispatch({ type: "LOGIN", email: form.email, password: form.password });
    } else {
      if (!form.name.trim() || !form.email.match(/\S+@\S+\.\S+/) || form.password.length < 6) {
        dispatch({ type: "CLEAR_NOTIFICATION" });
        return;
      }
      dispatch({ type: "REGISTER", data: { name: form.name, email: form.email, password: form.password } });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="auth-sub">{isLogin ? "Sign in to your ShopWave account." : "Join ShopWave and start shopping."}</p>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={isLogin ? "Your password" : "Min 6 characters"} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        {isLogin && <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Demo: demo@shopwave.com / demo123</div>}
        <button className="btn-primary" onClick={handleSubmit}>{isLogin ? "Sign In" : "Create Account"}</button>
        <p className="auth-switch">
          {isLogin ? "New here? " : "Already have an account? "}
          <span className="auth-link" onClick={() => dispatch({ type: "SET_PAGE", payload: isLogin ? "register" : "login" })}>
            {isLogin ? "Create an account" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

function OrdersPage({ state, dispatch }) {
  if (!state.user) return (
    <main>
      <div className="empty-cart">
        <div className="empty-icon">🔒</div>
        <p style={{ fontWeight: 500, fontSize: "1.05rem", marginBottom: "0.5rem" }}>Please log in to view orders</p>
        <button className="btn-primary" style={{ width: "auto", padding: "0.7rem 2rem" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "login" })}>Login</button>
      </div>
    </main>
  );

  const orders = state.user.orders;

  return (
    <main>
      <h1 className="section-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">📦</div>
          <p style={{ fontWeight: 500, fontSize: "1.05rem", marginBottom: "0.5rem" }}>No orders yet</p>
          <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>Place your first order to see it here.</p>
          <button className="btn-primary" style={{ width: "auto", padding: "0.7rem 2rem" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "home" })}>Start Shopping</button>
        </div>
      ) : orders.map(o => (
        <div key={o.id} className="order-card">
          <div className="order-header">
            <div>
              <div className="order-id">{o.id}</div>
              <div className="order-date">Placed {o.date}</div>
            </div>
            <span className={`status-badge status-processing`}>{o.status}</span>
          </div>
          <div className="order-items">
            {o.items.map(i => <span key={i.id} className="order-item-chip">{i.image} {i.name.split(" ").slice(0, 3).join(" ")} ×{i.qty}</span>)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>📍 {o.address}</div>
            <div className="order-total">Total: {fmt(o.total)}</div>
          </div>
        </div>
      ))}
    </main>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="app">
      <style>{css}</style>
      <Notification notif={state.notification} onClose={() => dispatch({ type: "CLEAR_NOTIFICATION" })} />
      <Navbar state={state} dispatch={dispatch} />
      {state.page === "home" && <HomePage state={state} dispatch={dispatch} />}
      {state.page === "product" && state.selectedProduct && <ProductPage product={state.selectedProduct} dispatch={dispatch} />}
      {state.page === "cart" && <CartPage state={state} dispatch={dispatch} />}
      {state.page === "checkout" && <CheckoutPage state={state} dispatch={dispatch} />}
      {state.page === "login" && <AuthPage mode="login" dispatch={dispatch} />}
      {state.page === "register" && <AuthPage mode="register" dispatch={dispatch} />}
      {state.page === "orders" && <OrdersPage state={state} dispatch={dispatch} />}
      <footer>© 2024 ShopWave — CodeAlpha Full Stack Internship Task 1</footer>
    </div>
  );
}
