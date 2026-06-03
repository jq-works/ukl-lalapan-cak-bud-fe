# 🌟 Lalapan Cak Bud - Web Application Front-End

Lalapan Cak Bud is a modern, responsive, and highly interactive online food ordering and management system designed for **Lalapan Cak Bud** restaurant. The front-end is built using **Next.js**, **React 19**, and **Tailwind CSS v4**, delivering a seamless experience for both customers placing orders and administrators managing operations.

---

## 📖 Table of Contents
1. [Core Features](#-core-features)
2. [Technology Stack](#-technology-stack)
3. [Project Structure](#-project-structure)
4. [Installation & Setup](#-installation--setup)
5. [API Integrations](#-api-integrations)
6. [Screenshot Gallery](#-screenshot-gallery)
7. [Deployment](#-deployment)

---

## ⚡ Core Features

### 🛒 Customer-Facing Application
- **Interactive Home Page**: Features a cozy banner, popular food recommendation marquee, and a real-time list of menu items.
- **Advanced Filtering & Search**: Instant searching across menu names, ingredients, or descriptions. Categorized filtering via interactive chips.
- **Stock-Aware Menu List**: Items are sorted automatically—available items appear first, while out-of-stock items are dimmed and pushed to the end.
- **Shopping Cart & Checkout**: Interactive side drawer cart for quantity management, supporting order notes, order type selection (*Dine In* or *Take Away*), and guest or member data collection.
- **Flexible Payment Methods**: Fully integrated checkout supporting cash (`CASH`), QRIS (`QRIS`), and Bank BCA (`BANK_BCA`) payment methods.
- **Order Tracking Timeline**: Real-time progress tracker tracking order stages: `PENDING` ➔ `PROCESSING` ➔ `COMPLETED` / `CANCELED`.
- **Integrated Review Feed**: A dedicated page for customers to submit star ratings, written reviews, and suggestions, alongside a marquee on the homepage displaying live comments from the database.

### 💼 Admin Management Panel
- **Analytics Dashboard**: Financial metrics summary including Total Revenue, Paid Transactions count, Average Order Value, and Dine-In vs. Take-Away order split.
- **Order Queue Manager**: A centralized screen to monitor incoming orders with one-click status transitions (Accept, Complete, Cancel).
- **Menu & Category Manager**: Complete CRUD operations for food categories and items, file upload directly from laptops for food photos, and instant availability toggles.
- **Finance & Payment Verifier**: Detailed list of all payment transactions with filters for payment method and status, allowing admins to verify and mark transfer/QRIS payments as `PAID`.
- **Review Moderator**: Moderate customer feedback and delete inappropriate ulasans from the system.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (Turbopack)** | React Framework for Static & Dynamic Page Generation |
| **React 19** | Component-based User Interface library |
| **Tailwind CSS v4** | Utility-first CSS styling using native CSS custom properties |
| **Zustand** | Light, fast global state management for the shopping cart and checkout |
| **Axios** | HTTP client for backend REST API communication |
| **Radix UI & Shadcn** | Accessible headless primitives (Select, Dialogs, Dropdown Menu) |
| **Lucide & React Icons** | Premium vector iconography |
| **Cookies (js-cookie)** | Client-side cookie utility for JWT token handling |

---

## 📂 Project Structure

```bash
ukl-lalapan-cak-bud-fe/
├── app/                      # Next.js App Router (Pages, Layouts & Views)
│   ├── (auth)/               # Authentication Pages (Login, Register)
│   ├── (customer)/           # Customer Pages (Home, Checkout, Orders, Ulasan, Account)
│   ├── admin/                # Admin Panel Pages (Dashboard, Finance, Menu, Orders, Reviews, Settings)
│   ├── globals.css           # Global Styles & Tailwind CSS v4 Theme config
│   └── layout.tsx            # Main HTML wrapper and provider attachments
├── components/               # Reusable UI & Layout Components
│   ├── customer/             # Customer-focused views (FloatingCart, BottomNav, Reviews Marquee)
│   └── ui/                   # Shared UI primitives (Buttons, Shadcn Select, Dialogs, badges)
├── context/                  # Global React Contexts
│   ├── AlertContext.tsx      # System Alert banners
│   ├── AuthContext.tsx       # User Session handling & JWT verification
│   └── CartContext.tsx       # Food menu fetch and active filter states
├── lib/                      # Configuration, Helper utilities and stores
│   ├── api.ts                # Axios instance configuration & Interceptors
│   ├── data.ts               # Dynamic interface bindings
│   ├── utils.ts              # Class name merging utility (cn)
│   └── store/                # Zustand data stores
│       └── cartStore.ts      # Global Cart state, checkout, and order mapper actions
└── public/                   # Static Asset Directories
    └── images/               # App branding assets & screenshots
```

---

## ⚙️ Installation & Setup

Follow these steps to configure and run the project locally on your machine:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) installed (v18.x or newer recommended).

### 2. Clone and Install Dependencies
Navigate to the root directory and install node packages:
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` or `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://lalapancakbudukl-production.up.railway.app
```
*(Replace the URL with your local server endpoint if running the backend locally).*

### 4. Run the Development Server
Launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build & Linting
Verify TypeScript compilation, check for code lints, and bundle for production:
```bash
# Check code style rules
npm run lint

# Generate production bundle
npm run build
```

---

## 🔌 API Integrations

The front-end integrates with the backend API via the base endpoint specified in `.env`.
Key endpoints consumed:
- `POST /auth/login` & `POST /auth/register` — User authentication.
- `GET /menu-items` & `POST /menu-items` — Retrieve and modify menu catalog.
- `GET /categories` — Fetch available food categories.
- `POST /orders` & `GET /orders/user` — Manage member checkout and order history.
- `POST /orders/guest` & `GET /orders/guest/{orderId}` — Guest checkout and tracking.
- `POST /payments/{orderId}` & `PATCH /payments/{paymentId}/status` — Register payment and verify status.
- `GET /reviews` & `POST /reviews` — Public review postings and store statistics.

---

## 📸 Screenshot Gallery

Drop your screenshots inside the `./public/images/screenshots/` directory using the specified file names below to display them here:

### 📱 Customer Workspace

| Page View | Screenshot Placeholder |
| :--- | :--- |
| **Landing & Menu Home** | ![Landing Page](./public/images/screenshots/landing_page.png) |
| **Interactive Shopping Cart** | ![Shopping Cart](./public/images/screenshots/shopping_cart.png) |
| **Checkout & Payment Form** | ![Checkout Screen](./public/images/screenshots/checkout_page.png) |
| **Order Status Tracker** | ![Order Tracking](./public/images/screenshots/order_tracking.png) |
| **Customer Review & Feedback** | ![Reviews Page](./public/images/screenshots/reviews_feed.png) |

### 🛠️ Admin Workspace

| Page View | Screenshot Placeholder |
| :--- | :--- |
| **Analytics Dashboard Overview** | ![Admin Dashboard](./public/images/screenshots/admin_dashboard.png) |
| **Order Processing Queue** | ![Admin Orders](./public/images/screenshots/admin_orders.png) |
| **Menu & Category Management** | ![Admin Menu](./public/images/screenshots/admin_menu.png) |
| **Financial Ledger & Payment Verification** | ![Admin Finance](./public/images/screenshots/admin_finance.png) |
| **Customer Reviews Moderation** | ![Admin Reviews](./public/images/screenshots/admin_reviews.png) |

---

## 🚀 Deployment

The project is structured to easily deploy on modern static hosting platforms like **Vercel**, **Netlify**, or **Cloudflare Pages**. 

When deploying:
1. Connect your repository branch to the hosting dashboard.
2. Set the build command to `npm run build`.
3. Set the output directory to `.next`.
4. Define the environmental variable `NEXT_PUBLIC_API_URL` pointing to your live production backend server.
