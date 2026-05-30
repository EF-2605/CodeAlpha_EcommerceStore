# ShopWave — Full Stack E-commerce Store

A complete full-stack e-commerce web application built for the **CodeAlpha Full Stack Development Internship — Task 1**.

---

## About The Project

**ShopWave** is a fully functional e-commerce store built from scratch. It covers all aspects of modern web development — polished React frontend with authentication, cart management, and order processing.

**Task 1 Requirement:** Build a basic e-commerce site with product listings, shopping cart, product details page, order processing, and user registration/login.

---

## Features

### Shopping Experience
- 12 Products across 6 categories (Electronics, Sports, Kitchen, Home, Accessories, Bags)
- Category Filters — browse by product type instantly
- Live Search — real-time product search by name
- Product Detail Page — full specs, ratings, reviews, stock info

### Cart & Checkout
- Add / remove products from cart
- Update quantities with +/− controls
- Free shipping on orders above $75
- Tax calculation (8%)
- Full checkout form with real-time validation
- Payment details form with auto-formatting

### User Authentication
- User Registration with email validation
- User Login with credential verification
- Persistent session during app use
- Protected routes (checkout requires login)

### Order Management
- Place orders with full address and payment info
- Order history page per user
- Unique Order ID generation
- Order status tracking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, CSS3, JavaScript ES6+ |
| State Management | React useReducer |
| Build Tool | Vite 5 |
| Backend Ready | Node.js / Express.js |

---

## Getting Started

### Prerequisites
Install **Node.js** (v18+) from: https://nodejs.org

### Run Locally

```bash
# Clone the repository
git clone https://github.com/EF-2605/CodeAlpha_EcommerceStore.git

# Go into the project folder
cd CodeAlpha_EcommerceStore

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser: http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Demo Credentials

```
Email:    demo@shopwave.com
Password: demo123
```

Or register a new account from the app.

---

## Project Structure

```
CodeAlpha_EcommerceStore/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx        (React entry point)
    └── App.jsx         (Full application — all components)
```

---

## App Pages

| Page | Description |
|---|---|
| Home | Product grid with filters and search |
| Product Detail | Full product info, specs, add to cart |
| Cart | Item list, quantities, order summary |
| Checkout | Shipping address and payment form |
| Login / Register | User authentication |
| My Orders | Order history with status |

---

## Backend Integration

This frontend is ready to connect with any REST API. Replace reducer actions with fetch() calls:

```javascript
// Login
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Get Products
const products = await fetch('/api/products').then(r => r.json());

// Place Order
await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({ items: cart, address, total })
});
```

Recommended Backend: Node.js + Express.js + MongoDB

---

## Internship Details

| Detail | Info |
|---|---|
| Organization | CodeAlpha |
| Program | Full Stack Development Internship |
| Task | Task 1 — Simple E-commerce Store |
| Frontend | React.js, CSS3, JavaScript |
| Backend | Node.js / Express.js |

---

## Author

**[Eshaal Fatima]**  
Full Stack Development Intern at CodeAlpha  
LinkedIn: https://www.linkedin.com/in/eshaal-fatima-882906370/
GitHub: https://github.com/EF-2605

---

Built with love for CodeAlpha Full Stack Development Internship
