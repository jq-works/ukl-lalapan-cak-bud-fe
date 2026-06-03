# 🌟 Lalapan Cak Bud - Front-End Aplikasi Web

Lalapan Cak Bud adalah sistem pemesanan makanan online dan manajemen warung makan yang modern, responsif, dan interaktif yang dirancang khusus untuk warung makan **Lalapan Cak Bud**. Bagian front-end ini dibangun menggunakan **Next.js**, **React 19**, dan **Tailwind CSS v4**, memberikan pengalaman pengguna yang mulus bagi pelanggan saat melakukan pemesanan serta mempermudah admin dalam mengelola operasional warung.

---

## 📖 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
3. [Struktur Proyek](#-struktur-proyek)
4. [Instalasi & Setup](#-instalasi--setup)
5. [Integrasi API](#-integrasi-api)
6. [Galeri Tangkapan Layar (Screenshot)](#-galeri-tangkapan-layar-screenshot)
7. [Deploy ke Production](#-deploy-ke-production)

---

## ⚡ Fitur Utama

### 🛒 Aplikasi Sisi Pelanggan (Customer)
- **Halaman Beranda Interaktif**: Dilengkapi dengan banner promosi, dekorasi kuliner, *marquee* menu populer yang bergeser otomatis, serta ulasan pelanggan langsung dari database.
- **Pencarian & Penyaringan Lanjut**: Memungkinkan pencarian instan berdasarkan nama menu, bahan, atau deskripsi. Filter kategori yang intuitif menggunakan chip kategori.
- **Daftar Menu Cerdas**: Menu diurutkan secara otomatis—menu yang tersedia diletakkan di bagian atas, sementara menu yang habis (kosong) akan otomatis redup (*dimmed*) dan digeser ke bagian akhir daftar.
- **Keranjang Belanja & Form Checkout**: Keranjang belanja samping (*side drawer*) untuk menyesuaikan jumlah porsi, menambahkan catatan pesanan khusus, memilih tipe pesanan (*Dine In* / Makan di tempat atau *Take Away* / Bawa pulang), serta form input data bagi pembeli umum (*guest*) maupun anggota (*member*).
- **Metode Pembayaran Fleksibel**: Checkout terintegrasi penuh dengan server untuk mendukung metode pembayaran Tunai (`CASH`), QRIS (`QRIS`), dan Transfer Bank BCA (`BANK_BCA`).
- **Pelacakan Status Pesanan Real-Time**: Alur pelacakan visual yang memantau proses pesanan dari tahap: `PENDING` ➔ `PROCESSING` ➔ `COMPLETED` / `CANCELED`.
- **Umpan Balik & Ulasan**: Halaman khusus bagi pelanggan terautentikasi untuk mengirimkan bintang rating, teks ulasan hidangan, serta kritik dan saran.

### 💼 Panel Manajemen Admin
- **Dasbor Analisis**: Ringkasan performa finansial seperti Total Pendapatan, Jumlah Transaksi Sukses, Rata-Rata Nilai Pesanan, dan grafik persentase tipe pemesanan (*Dine In* vs *Take Away*).
- **Antrean Pemesanan Harian**: Layar pusat untuk memantau pesanan masuk secara real-time dengan tombol aksi cepat untuk mengubah status pesanan (Terima/Proses, Selesaikan, Batalkan).
- **Kelola Kategori & Menu**: Operasi CRUD lengkap untuk hidangan dan kategori menu makanan. Menyediakan fitur unggah foto makanan langsung dari perangkat laptop serta tombol pintas ketersediaan stok menu.
- **Pencatatan Keuangan & Verifikasi Pembayaran**: Daftar transaksi pembayaran yang detail dengan filter metode pembayaran dan status pembayaran, membantu admin memverifikasi dan mengubah status transfer/QRIS menjadi Lunas (`PAID`).
- **Moderasi Ulasan**: Memantau masukan ulasan pelanggan dan menghapus komentar yang tidak pantas dari sistem.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Fungsi |
| :--- | :--- |
| **Next.js 16 (Turbopack)** | Framework React untuk pembuatan halaman statis & dinamis |
| **React 19** | Pustaka antarmuka pengguna berbasis komponen |
| **Tailwind CSS v4** | Framework CSS utility-first menggunakan native CSS custom properties |
| **Zustand** | Manajemen state global yang ringan untuk keranjang belanja dan checkout |
| **Axios** | Client HTTP untuk komunikasi dengan REST API backend |
| **Radix UI & Shadcn** | Primitif UI yang aksesibel (Select, Dialog, Dropdown Menu) |
| **Lucide & React Icons** | Pustaka ikon vektor premium |
| **Cookies (js-cookie)** | Utilitas sisi klien untuk penyimpanan JWT token autentikasi |

---

## 📂 Struktur Proyek

```bash
ukl-lalapan-cak-bud-fe/
├── app/                      # Direktori App Router Next.js (Halaman, Layout & View)
│   ├── (auth)/               # Halaman Autentikasi (Login, Register)
│   ├── (customer)/           # Halaman Sisi Pelanggan (Home, Checkout, Orders, Ulasan, Account)
│   ├── admin/                # Halaman Panel Admin (Dashboard, Finance, Menu, Orders, Reviews, Settings)
│   ├── globals.css           # Gaya CSS Global & Konfigurasi Tema Tailwind CSS v4
│   └── layout.tsx            # Wrapper utama HTML dan pemasangan global providers
├── components/               # Komponen UI & Layout yang Dapat Digunakan Kembali
│   ├── customer/             # Komponen khusus halaman pelanggan (FloatingCart, BottomNav, Reviews Marquee)
│   └── ui/                   # Primitif UI dasar (Tombol, Shadcn Select, Dialog, Status Badge)
├── context/                  # Penyedia Context Global React
│   ├── AlertContext.tsx      # Banner notifikasi/alert sistem
│   ├── AuthContext.tsx       # Manajemen sesi pengguna & verifikasi token JWT
│   └── CartContext.tsx       # State pemuatan menu makanan dan filter aktif
├── lib/                      # Konfigurasi, Fungsi pembantu, dan Data Store
│   ├── api.ts                # Konfigurasi Axios instance & interceptor token
│   ├── data.ts               # Binding tipe data & interface TypeScript
│   ├── utils.ts              # Fungsi pembantu penggabungan kelas CSS (cn)
│   ├── services/             # Layanan (Service) API modular terpisah
│   │   ├── index.ts          # Ekspor utama semua layanan
│   │   ├── authService.ts    # API Autentikasi (login, register, profil)
│   │   ├── menuService.ts    # API Menu makanan (CRUD, status ketersediaan)
│   │   ├── categoryService.ts# API Kategori menu (CRUD)
│   │   ├── orderService.ts   # API Pesanan (checkout, track guest, admin list)
│   │   ├── paymentService.ts # API Transaksi & Pembayaran (tunai, transfer, QRIS)
│   │   └── reviewService.ts  # API Ulasan & feedback (CRUD)
│   └── store/                # Store data global Zustand
│       └── cartStore.ts      # State keranjang belanja, proses checkout, dan pemetaan pesanan
└── public/                   # Direktori Aset Statis
    └── images/               # Logo aplikasi dan tangkapan layar (screenshot)
```

---

## ⚙️ Instalasi & Setup

Ikuti langkah-langkah di bawah ini untuk mengonfigurasi dan menjalankan proyek secara lokal:

### 1. Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org) di komputer Anda (versi v18.x atau yang lebih baru sangat disarankan).

### 2. Klon Repositori dan Instal Dependensi
Buka terminal pada direktori proyek dan jalankan perintah:
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Buat berkas `.env` atau `.env.local` pada root direktori proyek Anda:
```env
NEXT_PUBLIC_API_URL=https://lalapancakbudukl-production.up.railway.app
```
*(Ganti URL di atas dengan endpoint server lokal Anda jika Anda menjalankan server backend secara lokal).*

### 4. Jalankan Development Server
Mulai server pengembangan lokal dengan fitur Hot Module Replacement (HMR):
```bash
npm run dev
```
Buka peramban browser dan akses alamat [http://localhost:3000](http://localhost:3000).

### 5. Build Produksi & Pemeriksaan Kode
Lakukan pemeriksaan kode (linting) dan buat bundel produksi yang optimal:
```bash
# Periksa kepatuhan aturan kode
npm run lint

# Buat berkas build untuk dideploy
npm run build
```

---

## 🔌 Integrasi API & Data Fetching

Aplikasi front-end ini terintegrasi langsung dengan server backend menggunakan endpoint dasar yang didefinisikan pada `.env`.

### 🏗️ Arsitektur Data Fetching (Simplified Modular Services)
Untuk menjaga kode tetap bersih, mudah dibaca, dan terstruktur, semua pemanggilan REST API (menggunakan Axios) dikelompokkan ke dalam modul layanan di dalam folder `lib/services/` menggunakan sintaks fungsi panah (*arrow functions*) yang ringkas dan padat. Hal ini memisahkan logika UI/State dengan logika komunikasi server dengan sangat minimalis.

#### Contoh Desain Service Sederhana (`lib/services/menuService.ts`):
```typescript
import { api } from "../api";

export const getMenuItems = () => api.get("/menu-items");
export const createMenuItem = (payload: any) => api.post("/menu-items", payload);
export const deleteMenuItem = (id: string) => api.delete(`/menu-items/${id}`);
```

#### Daftar Service & Endpoint:
1. **`authService`** (`lib/services/authService.ts`)
   - `login(email, password)` ➔ `POST /auth/login`
   - `register({ name, email, password, phone })` ➔ `POST /auth/register`
   - `updateProfile(payload)` ➔ `PATCH /auth/update-profile`
2. **`menuService`** (`lib/services/menuService.ts`)
   - `getMenuItems()` ➔ `GET /menu-items`
   - `createMenuItem(payload)` ➔ `POST /menu-items`
   - `updateMenuItem(id, payload)` ➔ `PATCH /menu-items/{id}`
   - `deleteMenuItem(id)` ➔ `DELETE /menu-items/{id}`
3. **`categoryService`** (`lib/services/categoryService.ts`)
   - `getCategories()` ➔ `GET /categories`
   - `createCategory(payload)` ➔ `POST /categories`
   - `updateCategory(id, payload)` ➔ `PATCH /categories/{id}`
   - `deleteCategory(id)` ➔ `DELETE /categories/{id}`
4. **`orderService`** (`lib/services/orderService.ts`)
   - `getOrders()` ➔ `GET /orders` (Admin)
   - `getMyOrders()` ➔ `GET /orders/me` (Member)
   - `getOrderDetail(id)` ➔ `GET /orders/{id}`
   - `createMemberOrder(payload)` ➔ `POST /orders`
   - `createGuestOrder(payload)` ➔ `POST /orders/guest`
   - `trackGuestOrder(id)` ➔ `GET /orders/guest/track/{id}`
   - `updateOrderStatus(id, status)` ➔ `PATCH /orders/{id}/status`
5. **`paymentService`** (`lib/services/paymentService.ts`)
   - `getPayments()` ➔ `GET /payments` (Admin)
   - `createMemberPayment(orderId, payload)` ➔ `POST /payments/{orderId}`
   - `createGuestPayment(orderId, payload)` ➔ `POST /payments/guest/{orderId}`
6. **`reviewService`** (`lib/services/reviewService.ts`)
   - `getReviews()` ➔ `GET /reviews`
   - `createReview(payload)` ➔ `POST /reviews`
   - `deleteReview(id)` ➔ `DELETE /reviews/{id}`

#### Contoh Penggunaan Service:
Cukup impor service yang diinginkan dari `@/lib/services` dan panggil fungsinya secara asinkron (`async/await`):
```typescript
import { menuService } from "@/lib/services";

// Di dalam komponen atau store:
async function loadMenu() {
  try {
    const res = await menuService.getMenuItems();
    if (res.status === 200) {
      const items = res.data.data;
      console.log("Menu loaded successfully:", items);
    }
  } catch (error) {
    console.error("Gagal memuat menu:", error);
  }
}
```

---

## 📸 Galeri Tangkapan Layar (Screenshot)

Letakkan gambar tangkapan layar aplikasi Anda di dalam direktori `./public/images/screenshots/` sesuai dengan nama file berikut untuk menampilkannya di halaman dokumentasi ini:

### 📱 Halaman Pelanggan (Customer)

| Tampilan Halaman | File Gambar Screenshot |
| :--- | :--- |
| **Beranda & Daftar Menu** | ![Beranda](./public/images/screenshots/landing_page.png) |
| **Keranjang Belanja Samping** | ![Keranjang Belanja](./public/images/screenshots/shopping_cart.png) |
| **Formulir Checkout & Metode Pembayaran** | ![Checkout](./public/images/screenshots/checkout_page.png) |
| **Pelacakan Status Pesanan** | ![Pelacakan Pesanan](./public/images/screenshots/order_tracking.png) |
| **Umpan Balik & Kritik Saran** | ![Halaman Ulasan](./public/images/screenshots/reviews_feed.png) |

### 🛠️ Halaman Pengelola (Admin Panel)

| Tampilan Halaman | File Gambar Screenshot |
| :--- | :--- |
| **Dasbor Analisis Finansial** | ![Dasbor Admin](./public/images/screenshots/admin_dashboard.png) |
| **Antrean & Pemrosesan Pesanan** | ![Manajemen Pesanan](./public/images/screenshots/admin_orders.png) |
| **Kelola Menu & Kategori Hidangan** | ![Manajemen Menu](./public/images/screenshots/admin_menu.png) |
| **Laporan Keuangan & Verifikasi Lunas** | ![Keuangan Admin](./public/images/screenshots/admin_finance.png) |
| **Moderasi Ulasan Pelanggan** | ![Ulasan Admin](./public/images/screenshots/admin_reviews.png) |

---

## 🚀 Deploy ke Production

Proyek ini terstruktur agar siap dideploy dengan mudah pada platform hosting modern seperti **Vercel**, **Netlify**, atau **Cloudflare Pages**.

Saat melakukan deploy:
1. Hubungkan branch repositori Git Anda ke dasbor hosting.
2. Atur perintah build ke `npm run build`.
3. Atur direktori keluaran (output directory) ke `.next`.
4. Definisikan variabel lingkungan `NEXT_PUBLIC_API_URL` yang mengarah ke server backend produksi Anda yang aktif.
