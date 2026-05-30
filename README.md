# 🛒 ShopWave — Full Stack E-commerce Store

<div align="center">

![ShopWave Banner](https://img.shields.io/badge/ShopWave-E--commerce-orange?style=for-the-badge&logo=shopify&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Ready-339933?style=for-the-badge&logo=node.js&logoColor=white)

**A complete full-stack e-commerce web application built for CodeAlpha Full Stack Development Internship — Task 1**

[🔗 Live Demo](#) · [📹 Video Walkthrough](#) · [🐛 Report Bug](#)

</div>

---

## 📌 About The Project

**ShopWave** is a fully functional e-commerce store built from scratch as part of the **CodeAlpha Full Stack Development Internship Program**. It covers all aspects of modern web development — from a polished React frontend to a structured backend-ready architecture with authentication, cart management, and order processing.

> 🎯 **Task 1 Requirement:** Build a basic e-commerce site with product listings, shopping cart, product details page, order processing, and user registration/login.

---

## ✨ Features

### 🛍️ Shopping Experience
- **12 Products** across 6 categories (Electronics, Sports, Kitchen, Home, Accessories, Bags)
- **Category Filters** — browse by product type instantly
- **Live Search** — real-time product search by name
- **Product Detail Page** — full specs, ratings, reviews, stock info

### 🛒 Cart & Checkout
- Add/remove products from cart
- Update quantities with +/− controls
- **Free shipping** on orders above $75
- Tax calculation (8%)
- Full **checkout form** with real-time validation
- Payment details form (card number auto-formatting, expiry, CVV)

### 👤 User Authentication
- **User Registration** with email validation
- **User Login** with credential verification
- Persistent session during app use
- Protected routes (checkout requires login)

### 📦 Order Management
- Place orders with full address & payment info
- **Order history** page per user
- Unique Order ID generation
- Order status tracking

### 🔔 UX Extras
- Toast notifications for every action
- Empty state handling (cart, orders)
- Responsive & accessible UI
- Smooth page transitions

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js 18 | UI Components & Rendering |
| **State Management** | React useReducer + Context | Global App State |
| **Styling** | CSS3 (custom, no framework) | All UI design |
| **Build Tool** | Vite 5 | Dev server & bundling |
| **Backend Ready** | Node.js / Express.js | REST API (pluggable) |
| **Font** | Google Fonts (DM Sans + Playfair Display) | Typography |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** installed (v18+ recommended).
Download from: https://nodejs.org

### Installation & Run

```bash
# Step 1: Clone the repository
git clone https://github.com/EF-2605/CodeAlpha_EcommerceStore.git

# Step 2: Navigate into the project
cd CodeAlpha_EcommerceStore

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev

# Step 5: Open in browser
# Visit: http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Demo Credentials

You can use the pre-created demo account or register a new one:

```
Email:    demo@shopwave.com
Password: demo123
```

---

## 📁 Project Structure

```
CodeAlpha_EcommerceStore/
│
├── index.html              # HTML entry point
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite configuration
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
│
└── src/
    ├── main.jsx            # React DOM render entry
    └── App.jsx             # Full application:
                            #   ├── Product data & categories
                            #   ├── Global state (useReducer)
                            #   ├── Navbar component
                            #   ├── Home / Product Grid page
                            #   ├── Product Detail page
                            #   ├── Shopping Cart page
                            #   ├── Checkout page
                            #   ├── Login & Register pages
                            #   └── Order History page
```

---

## 📸 App Pages

| Page | Description |
|---|---|
| 🏠 **Home** | Product grid with filters and search |
| 📄 **Product Detail** | Full product info, specs, add to cart |
| 🛒 **Cart** | Item list, quantities, order summary |
| 💳 **Checkout** | Shipping address + payment form |
| 👤 **Login / Register** | User authentication forms |
| 📦 **My Orders** | Order history with status |

---

## 🔌 Backend Integration Guide

This frontend is designed to plug into any REST API. Replace reducer actions with API calls:

```javascript
// Example: Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Example: Get Products
const products = await fetch('/api/products').then(r => r.json());

// Example: Place Order
await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({ items: cart, address, total })
});
```

**Recommended Backend:** Node.js + Express.js + MongoDB

---

## 🎓 Internship Details

| Detail | Info |
|---|---|
| **Organization** | CodeAlpha |
| **Program** | Full Stack Development Internship |
| **Task** | Task 1 — Simple E-commerce Store |
| **Frontend** | HTML, CSS, JavaScript (React) |
| **Backend** | Node.js / Express.js |
| **Database** | MongoDB / PostgreSQL (ready to connect) |

---

## 👨‍💻 Author

**[Eshaal Fatima]**
Full Stack Development Intern @ CodeAlpha

[![LinkedIn](https://www.linkedin.com/in/eshaal-fatima-882906370/)
[![GitHub](https://github.com/EF-2605)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ for **CodeAlpha Full Stack Development Internship**

⭐ Star this repo if you found it helpful!

</div>
