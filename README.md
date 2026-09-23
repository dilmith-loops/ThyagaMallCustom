# Thyaga Mall (mall.thyaga.lk) — E-Commerce Marketplace Platform

A high-performance, enterprise-grade e-commerce marketplace built for **Thyaga Mall** (`mall.thyaga.lk`), inspired by high-density marketplaces like Daraz, AliExpress, and eBay. 

Crafted with authentic Thyaga brand aesthetics (**Deep Royal Plum `#36135D`**, **Magenta `#A7144C`**, and **Crimson `#DC2626`** for flash sales) on a clean, modern white retail background — strictly avoiding generic AI dark and neon palettes.

---

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons)
- **Backend**: [Laravel](https://laravel.com/) (RESTful API, PHP 8.5, Laravel Sanctum Token Auth, Eloquent ORM)
- **Database**: [MySQL](https://www.mysql.com/) (Dedicated `thyaga_mall_db` with 406 real Thyaga products & categories imported)

---

## ✨ Features

### 🛍️ Storefront Marketplace (Daraz / AliExpress Style)
- **Top Announcement Bar**: Free shipping indicator ("FREE SHIPPING for orders over Rs. 2,999"), Thyaga Vouchers link, Track Order, and Customer Care hotline.
- **Smart Search & Header**: Header with category dropdown filter, instant search, Wishlist, interactive Cart drawer trigger with live item count and total in LKR.
- **Category Mega-Menu**: Multi-level flyout menu ("All Categories") + quick links for Home, Electronics, Beauty, Food, Fashion, and Toys.
- **Hero Promotional Carousel**: High-converting promo slider + category side navigation + Thyaga gift voucher card.
- **⚡ 24H Flash Deals Arena**:
  - Live synchronized countdown clock (`HH : MM : SS`).
  - Flash discount badges (`-25%`, `-35%`, `-45%`).
  - Real-time stock claim progress bar ("18 Sold / 4 Left in Stock").
  - Dedicated `/flash-deals` landing page.
- **Product Catalog (`/shop`)**:
  - Sidebar filters by Category, Price Range (Min/Max), and Sorting (Newest, Popular, Rating, Price Low-High, Price High-Low).
  - Responsive pagination.
- **Product Detail Page (`/product/[slug]`)**:
  - High-resolution zoom gallery and thumbnail switcher.
  - Price formatting in LKR (`Rs. X,XXX.XX`) with savings calculation.
  - Stock indicator and quantity stepper.
  - Thyaga voucher redemption notice.
  - Tabbed Description, Technical Specifications, and Verified Reviews.
  - Related Products recommendations.
- **Slide-Over Cart Drawer**:
  - Real-time free shipping threshold progress bar.
  - Quantity controls and instant item removal.
  - Voucher code input with immediate discount calculation.
- **Checkout Flow (`/checkout`)**:
  - Multi-step customer address and phone number form.
  - Payment method selection: Cash on Delivery (COD), Credit/Debit Card, and Thyaga Gift Voucher code.
  - Automated order number generation (`THY-YYYYMMDD-XXXX`).
- **Order Tracking (`/track-order`)**:
  - Real-time delivery status visualizer (`Pending` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`).

---

### 🛡️ Admin Portal (`/admin`)
- **Secure Admin Authentication (`/admin/login`)**:
  - Protected with Laravel Sanctum API tokens.
  - Pre-configured administrator:
    - **Email**: `admin@thyaga.lk`
    - **Password**: `password123`
- **Dashboard Overview (`/admin/dashboard`)**:
  - Real-time KPI metric cards (Total Sales, Total Orders, Pending Orders, Low Stock Alerts, Active Flash Deals).
  - Recent orders quick-view table.
  - Top categories breakdown.
- **Product Management (`/admin/products`)**:
  - Filterable data table of 400+ real products.
  - Add / Edit product modal (Title, SKU, Category, Regular Price, Sale Price, Stock, Image URL, Description).
  - Delete product action.
- **⚡ Flash Sales Scheduler (`/admin/flash-sales`)**:
  - Create and manage flash sale campaigns.
  - Live toggle to publish or pause the flash sale on the storefront.
  - Product picker to add items with custom flash discount prices and allocated stock limits.
- **Order Fulfillment (`/admin/orders`)**:
  - Order filter by status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).
  - Order details modal with customer contact, shipping address, and purchased items.
  - One-click order status update control.

---

## 🛠️ How to Run Locally

### 1. Backend (Laravel API)
```bash
cd backend
php artisan serve --port=8000
```
API endpoints available at: `http://127.0.0.1:8000/api`

To re-import or seed the 406 real catalog items from MySQL:
```bash
php artisan thyaga:import-catalog
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm run dev -- --port 3000
```
Storefront available at: `http://localhost:3000`
Admin Panel available at: `http://localhost:3000/admin/login`
