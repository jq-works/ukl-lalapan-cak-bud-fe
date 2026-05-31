# 🍃 Lalapan Cak Bud — UI/UX Design System

Panduan lengkap desain sistem untuk proyek **UKL Lalapan Cak Bud** (platform pemesanan online warung makan).  
Dokumen ini menjadi referensi tunggal (*single source of truth*) untuk semua komponen, token, pola interaksi, dan keputusan desain ke depan.

---

## 📐 Filosofi Desain

> **"Fresh, Bold, Appetizing"**

Lalapan Cak Bud menggunakan pendekatan desain **food-app modern** terinspirasi dari GoFood — bersih, percaya diri, dan menggugah selera. Setiap elemen dirancang untuk:

- **Segar** — hijau sebagai warna utama mencerminkan kesegaran lalapan dan bahan alami
- **Berani** — merah sebagai aksen menciptakan urgensi, nafsu makan, dan kesan brand yang kuat
- **Efisien** — alur pesan yang cepat dan minim hambatan, karena pelanggan lapar tidak suka menunggu

> **Referensi UI:** GoFood (gofood.co.id) — card-based layout, bottom nav mobile, prominent CTA, category chips

---

## 🎨 Color Palette

### Primary — Brand Green

Diambil langsung dari warna dominan logo. Digunakan pada CTA utama, nav aktif, header, dan elemen brand.

| Token | Hex | Tailwind | Penggunaan |
|-------|-----|----------|------------|
| `primary-50` | `#f0faf2` | `green-50` (custom) | Background highlight ringan |
| `primary-100` | `#d4edda` | `green-100` (custom) | Badge bg, chip aktif |
| `primary-400` | `#3a9e52` | `green-500` approx | Gradient start, hover ringan |
| `primary-500` | `#2d7a3e` | — | **Default brand color**, CTA, nav aktif |
| `primary-600` | `#1f5c2d` | — | Hover state tombol |
| `primary-700` | `#174d25` | — | Active/pressed state tombol |
| `primary-900` | `#0f3018` | — | Teks heading di hero/banner |

> **Cara daftarkan di Tailwind:**
> ```js
> // tailwind.config.ts
> extend: {
>   colors: {
>     primary: {
>       50:  '#f0faf2',
>       100: '#d4edda',
>       400: '#3a9e52',
>       500: '#2d7a3e',
>       600: '#1f5c2d',
>       700: '#174d25',
>       900: '#0f3018',
>     }
>   }
> }
> ```

**Shadow hijau** untuk efek depth pada tombol utama:
```
shadow-md shadow-green-200    → default
shadow-lg shadow-green-300    → hover
```

---

### Accent — Brand Red

Diambil dari ring merah pada logo. Digunakan untuk promo, badge "Terlaris", notifikasi, dan aksi destruktif.

| Token | Hex | Tailwind | Penggunaan |
|-------|-----|----------|------------|
| `accent-50` | `#fff0f0` | `red-50` | Hover bg aksi destruktif |
| `accent-400` | `#e8192c` | `red-500` approx | Badge promo, highlight |
| `accent-500` | `#c8102e` | — | **Default accent**, badge terlaris, promo |
| `accent-600` | `#a50d25` | — | Hover state badge/promo |

> **Cara daftarkan di Tailwind:**
> ```js
> accent: {
>   50:  '#fff0f0',
>   400: '#e8192c',
>   500: '#c8102e',
>   600: '#a50d25',
> }
> ```

---

### Semantic Colors

| Tujuan | Warna | Tailwind | Hex |
|--------|-------|----------|-----|
| Success / Lunas | Emerald | `emerald-500` | `#10b981` |
| Success bg | Emerald light | `emerald-50` | `#ecfdf5` |
| Warning / Pending | Amber | `amber-500` | `#f59e0b` |
| Warning bg | Amber light | `amber-50` | `#fffbeb` |
| Danger / Batalkan | Red | `red-500` | `#ef4444` |
| Danger bg hover | Red light | `red-50` | `#fef2f2` |
| Info / Diproses | Blue | `blue-500` | `#3b82f6` |
| Info bg | Blue light | `blue-50` | `#eff6ff` |

---

### Status Order Colors

Konsisten di seluruh halaman customer dan admin.

| Status | Label | Warna Teks | Warna BG | Arti |
|--------|-------|------------|----------|------|
| `PENDING` | Menunggu | `amber-700` | `amber-50` | Pesanan masuk, belum dibayar |
| `PAID` | Lunas | `emerald-700` | `emerald-50` | Pembayaran dikonfirmasi |
| `PROCESSING` | Diproses | `blue-700` | `blue-50` | Sedang dimasak |
| `READY` | Siap Diambil | `primary-700` | `primary-50` | Pesanan selesai dibuat |
| `COMPLETED` | Selesai | `gray-600` | `gray-100` | Pesanan sudah diambil |
| `CANCELLED` | Dibatalkan | `red-600` | `red-50` | Pesanan dibatalkan |

---

### Neutral (UI Chrome)

| Token | Tailwind | Hex | Penggunaan |
|-------|----------|-----|------------|
| Background utama | `gray-50` | `#f9fafb` | Page background |
| Surface / Card | `white` | `#ffffff` | Card menu, panel |
| Border halus | `gray-100` | `#f3f4f6` | Border antar section |
| Border medium | `gray-200` | `#e5e7eb` | Border input, chip |
| Icon default | `gray-400` | `#9ca3af` | Icon tidak aktif |
| Teks sekunder | `gray-400` | `#9ca3af` | Subtitle, placeholder |
| Teks body | `gray-500` | `#6b7280` | Deskripsi, label |
| Teks hover | `gray-700` | `#374151` | Teks hover nav |
| Teks heading | `gray-800` | `#1f2937` | Nama menu, heading card |
| Teks utama | `gray-900` | `#111827` | Heading besar, nama warung |

---

## 🔤 Tipografi

### Font Family

```css
/* Heading / Display — Karakter bold, appetite-driven */
font-family: 'Plus Jakarta Sans', sans-serif;

/* Body / UI — Clean, readable */
font-family: 'Plus Jakarta Sans', sans-serif;
```

> Plus Jakarta Sans dipilih karena karakter geometrisnya yang tegas namun ramah, cocok untuk aplikasi food-tech lokal.  
> Alternatif: `'DM Sans'` atau `'Nunito'` jika Plus Jakarta Sans tidak tersedia.

> **Cara load di Next.js:**
> ```tsx
> // app/layout.tsx
> import { Plus_Jakarta_Sans } from "next/font/google";
> const jakarta = Plus_Jakarta_Sans({
>   subsets: ["latin"],
>   weight: ["400", "500", "600", "700", "800"]
> });
> ```

### Skala Tipografi

| Level | Size | Weight | Tailwind | Penggunaan |
|-------|------|--------|----------|------------|
| Display | `24px` | 800 | `text-2xl font-extrabold` | Hero headline, nama warung |
| Heading 1 | `20px` | 700 | `text-xl font-bold` | Judul halaman |
| Heading 2 | `16px` | 700 | `text-base font-bold` | Judul section, nama menu |
| Body | `14px` | 500 | `text-sm font-medium` | Deskripsi menu, label form |
| Body Small | `13px` | 400 | `text-[13px]` | Teks sekunder, info tambahan |
| Caption | `12px` | 600 | `text-xs font-semibold` | Badge status, label chip |
| Micro | `11px` | 400 | `text-[11px]` | Timestamp, estimasi waktu |

### Harga — Khusus

Harga selalu menggunakan ukuran yang lebih besar dari teks body sekitarnya, dengan warna primary.

```
Harga utama  → text-base font-bold text-primary-600
Harga coret  → text-sm font-normal text-gray-400 line-through
Harga promo  → text-base font-bold text-accent-500
```

---

## 📏 Spacing & Sizing

### Grid Dasar

Seluruh spacing menggunakan kelipatan **4px** (Tailwind default).

| Nilai | px | Tailwind |
|-------|----|----------|
| XS | 4px | `gap-1`, `p-1` |
| SM | 8px | `gap-2`, `p-2` |
| MD | 12px | `gap-3`, `p-3` |
| LG | 16px | `gap-4`, `p-4` |
| XL | 24px | `gap-6`, `p-6` |
| 2XL | 32px | `gap-8`, `p-8` |

### Komponen Sizing

| Komponen | Dimensi |
|----------|---------|
| Header / Topbar | `h-16` (64px) |
| Bottom Navigation (mobile) | `h-16` (64px) |
| Food Card (list) | `h-auto`, min `h-28` |
| Food Card (grid) | `w-full aspect-[4/3]` gambar |
| Food Image (list) | `w-20 h-20` (80px) |
| Category Chip | `h-9` (36px) |
| CTA Button utama | `h-12` (48px) |
| Button secondary | `h-10` (40px) |
| Input field | `h-12` (48px) |
| Quantity Button | `w-8 h-8` (32px) |
| Avatar admin | `w-9 h-9` (36px) |
| Floating Cart Button | `h-14 min-w-[180px]` |
| Badge/Pill | `h-5` atau `h-6` |

---

## 🔲 Border Radius

| Level | Tailwind | px | Penggunaan |
|-------|----------|----|------------|
| Full | `rounded-full` | 50% | Pill status, badge, quantity button |
| 2XL | `rounded-2xl` | 16px | Food card, modal, bottom sheet |
| XL | `rounded-xl` | 12px | **Default** — tombol, input, chip kategori |
| LG | `rounded-lg` | 8px | Image thumbnail, dropdown item |
| MD | `rounded-md` | 6px | Badge kecil inline |

---

## 🌫️ Shadow

| Level | Tailwind | Penggunaan |
|-------|----------|------------|
| Card ringan | `shadow-sm` | Food card default |
| Card hover | `shadow-md` | Food card saat hover |
| Header | `shadow-sm` | Sticky header/topbar |
| Float button | `shadow-xl` | Floating cart button |
| Brand shadow | `shadow-md shadow-green-200` | CTA button default |
| Brand shadow hover | `shadow-lg shadow-green-300` | CTA button hover |
| Modal / Bottom Sheet | `shadow-2xl` | Overlay panel |

---

## ⚡ Transition & Animasi

### Durasi Standar

| Kecepatan | Nilai | Tailwind | Penggunaan |
|-----------|-------|----------|------------|
| Cepat | 150ms | `duration-150` | Warna hover icon/teks |
| Normal | 200ms | `duration-200` | Hover card, button state |
| Sedang | 300ms | `duration-300` | Slide bottom sheet, expand section |
| Lambat | 500ms | `duration-500` | Skeleton loading fade |

### Easing

```
ease-in-out   → transisi slide/transform (bottom sheet, cart slide)
ease-out      → elemen masuk ke layar (modal muncul, toast)
```

### Pola Animasi yang Digunakan

```tsx
// Hover card menu
transition-all duration-200 hover:shadow-md hover:-translate-y-0.5

// Tombol CTA pressed
active:scale-95 transition-transform duration-150

// Bottom sheet slide up
transition-transform duration-300 ease-out
// → translate-y-full (hidden) | translate-y-0 (visible)

// Badge quantity bump (saat item ditambah)
transition-transform duration-150
// → scale-100 → scale-125 → scale-100

// Floating cart button
transition-all duration-300
// → opacity-0 scale-95 (hidden) | opacity-100 scale-100 (visible)

// Skeleton shimmer
animate-pulse bg-gray-200

// Status badge
transition-colors duration-200
```

---

## 🧩 Komponen Library

### 1. Header (Customer)

```
<header h-16 sticky top-0 z-40 bg-white shadow-sm>
  ├── [Back Button / Logo]    ← kiri
  ├── [Page Title]            ← tengah (atau kiri setelah logo)
  └── [Action Icon]           ← kanan (keranjang / notifikasi)
```

**Varian:**
- `home` → Logo Cak Bud + ikon keranjang + ikon notifikasi
- `detail` → Back button + judul halaman
- `checkout` → Back button + "Checkout" + tanpa ikon kanan

---

### 2. Bottom Navigation (Customer Mobile)

```
<nav h-16 fixed bottom-0 bg-white border-t border-gray-100>
  ├── [Beranda]    → HomeIcon
  ├── [Pesanan]    → ClipboardListIcon
  └── [Akun]       → UserIcon
```

**Nav Item Anatomy:**
```
Active   → icon primary-500, label text-[11px] font-semibold primary-500
Default  → icon gray-400, label text-[11px] gray-400
```

---

### 3. Food Card

**Varian List (Horizontal):**
```
<div rounded-2xl bg-white shadow-sm p-3>
  ├── [FoodImage 80×80 rounded-xl]   ← kiri
  └── [Info]                          ← kanan
      ├── Nama menu (text-base font-bold gray-900)
      ├── Deskripsi singkat (text-[13px] gray-500, max 2 baris)
      ├── [Badge "Terlaris"] (opsional)
      └── [Harga + Tombol +]
```

**Varian Grid (Vertical):**
```
<div rounded-2xl bg-white shadow-sm overflow-hidden>
  ├── [FoodImage full-width aspect-[4/3]]
  └── [Info p-3]
      ├── Nama menu
      ├── Harga
      └── [Tombol Tambah]
```

**Badge "Terlaris":**
```
bg-accent-500 text-white text-[10px] font-bold
rounded-full px-2 py-0.5
```

**Tombol Tambah (kondisi belum diorder):**
```
w-8 h-8 rounded-full bg-primary-500 text-white
shadow-sm shadow-green-200
```

**Quantity Control (sudah ada di keranjang):**
```
[−] [angka] [+]
Tombol: w-7 h-7 rounded-full
−  → border border-primary-500 text-primary-500
+  → bg-primary-500 text-white
Angka: text-sm font-bold gray-900 min-w-[24px] text-center
```

---

### 4. Category Chip

```
<button h-9 rounded-xl px-4>
  Active  → bg-primary-500 text-white font-semibold shadow-sm shadow-green-200
  Default → bg-white border border-gray-200 text-gray-500 font-medium
```

Scroll horizontal tanpa scrollbar:
```tsx
<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
```

---

### 5. Floating Cart Button

Muncul ketika keranjang tidak kosong. Fixed bottom, di atas bottom nav.

```
<button fixed bottom-20 left-4 right-4 h-14 rounded-2xl
        bg-primary-500 text-white shadow-xl shadow-green-300>
  ├── [ShoppingBagIcon] + badge jumlah item (rounded-full bg-accent-500)
  ├── "Lihat Keranjang (n item)"  → font-semibold
  └── Total harga                 → font-bold kanan
```

---

### 6. Order Status Badge

Digunakan di halaman tracking dan list pesanan admin.

```tsx
// Contoh implementasi
const statusConfig = {
  PENDING:    { label: 'Menunggu',    bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  PAID:       { label: 'Lunas',       bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  PROCESSING: { label: 'Diproses',    bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  READY:      { label: 'Siap Ambil',  bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
  COMPLETED:  { label: 'Selesai',     bg: 'bg-gray-100',   text: 'text-gray-600',    dot: 'bg-gray-400' },
  CANCELLED:  { label: 'Dibatalkan',  bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
};

// Markup
<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
  {label}
</span>
```

---

### 7. FoodImage (dengan Fallback)

Komponen pembungkus wajib untuk semua gambar menu. Menangani kondisi `imageUrl` dari API belum tersedia.

```tsx
// components/ui/FoodImage.tsx
interface FoodImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function FoodImage({ src, alt, className }: FoodImageProps) {
  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-3xl">🍽️</span>  {/* Placeholder sementara */}
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}
```

> **Catatan:** Komponen ini wajib digunakan di semua tempat yang menampilkan gambar menu. Ketika BE temanmu selesai mengintegrasikan Cloudinary, hanya komponen ini yang perlu diupdate — tidak ada perubahan di halaman lain.

---

### 8. Input Field

```
<input h-12 rounded-xl border border-gray-200 px-4
       text-sm font-medium text-gray-800
       placeholder:text-gray-400
       focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
       bg-white>
```

**Input dengan icon:**
```
<div relative>
  <Icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 />
  <input pl-10 ... />
</div>
```

---

### 9. Tombol (Button)

| Varian | Style |
|--------|-------|
| Primary | `bg-primary-500 text-white rounded-xl h-12 font-semibold shadow-md shadow-green-200 hover:bg-primary-600 active:scale-95` |
| Secondary | `bg-white border border-primary-500 text-primary-500 rounded-xl h-12 font-semibold hover:bg-primary-50` |
| Danger | `bg-white border border-red-300 text-red-500 rounded-xl hover:bg-red-50` |
| Ghost | `text-primary-500 font-semibold hover:bg-primary-50 rounded-xl` |
| Disabled | `bg-gray-200 text-gray-400 cursor-not-allowed rounded-xl h-12 font-semibold` |

---

### 10. Admin Sidebar

```
<aside>
  ├── [Logo Area]             ← Logo Cak Bud + nama warung
  ├── <nav>
  │   └── [NavItem] × n      ← icon + label
  └── [User Info + Logout]    ← bawah
```

**Nav Item:**
```
Active   → bg-primary-50 text-primary-600 border-l-2 border-primary-500 font-semibold
Default  → text-gray-500 hover:bg-gray-50 hover:text-gray-700
```

---

### 11. Admin Dashboard Card (Stat)

```
<div rounded-2xl bg-white p-5 shadow-sm border border-gray-100>
  ├── [Icon 40px rounded-xl bg-primary-50 text-primary-500]
  ├── Angka (text-2xl font-bold gray-900)
  └── Label (text-sm text-gray-500)
```

---

## 🗂️ Layout Shell

### Customer (Mobile-first)

```
<body className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
  <Header />                              ← sticky top
  <main className="pb-32">              ← padding bottom untuk bottom nav + float button
    {children}
  </main>
  <FloatingCartButton />                ← fixed, di atas bottom nav
  <BottomNavigation />                  ← fixed bottom
</body>
```

### Admin (Desktop)

```
<body className="flex min-h-screen bg-gray-50">
  <AdminSidebar />                       ← fixed kiri, w-64
  <div className="flex flex-col flex-1 min-w-0">
    <AdminTopbar />                      ← sticky atas, h-16
    <main className="flex-1 p-6">
      {children}
    </main>
  </div>
</body>
```

---

## 🗂️ Struktur File Komponen

```
components/
├── ui/
│   ├── FoodImage.tsx        ← wrapper gambar dengan fallback
│   ├── StatusBadge.tsx      ← badge status pesanan
│   ├── CategoryChip.tsx     ← chip kategori menu
│   ├── QuantityControl.tsx  ← tombol +/- jumlah
│   └── Button.tsx           ← reusable button semua varian
├── customer/
│   ├── Header.tsx           ← header dengan varian
│   ├── BottomNav.tsx        ← navigasi bawah mobile
│   ├── FoodCard.tsx         ← kartu menu (list & grid)
│   └── FloatingCartBtn.tsx  ← tombol keranjang mengambang
└── admin/
    ├── AdminSidebar.tsx     ← sidebar panel admin
    ├── AdminTopbar.tsx      ← topbar admin
    └── OrderTable.tsx       ← tabel daftar pesanan
```

---

## 🖱️ Interaction States

### Hierarki Hover

```
Default  → bg-white atau bg-gray-50
Hover    → bg-gray-50 + shadow naik satu level
Active   → bg-primary-50 + warna primary
Pressed  → scale-95 + bg satu level lebih gelap
Disabled → opacity-50, cursor-not-allowed
```

### Feedback Visual Aksi

```
Tambah item ke keranjang   → tombol + animate bounce, floating button muncul
Hapus item dari keranjang  → item fade out, floating button hilang jika 0
Simulasi bayar             → loading spinner → status PAID → toast sukses
Copy nomor pesanan         → icon ganti CheckIcon, warna emerald, reset 2 detik
Reorder berhasil           → navigasi ke keranjang + toast "Item ditambahkan"
```

### Toast / Snackbar

```
<div fixed bottom-24 left-4 right-4 z-50
     bg-gray-900 text-white rounded-2xl
     px-4 py-3 text-sm font-medium
     shadow-xl>
  ├── [icon] + pesan
  └── (auto dismiss 2 detik)
```

---

## 📱 Breakpoint

Proyek ini **mobile-first**. Halaman customer didesain untuk lebar `max-w-md` (448px).

| Nama | Tailwind | Keterangan |
|------|----------|------------|
| Mobile | Default | Customer app — tampilan utama |
| Tablet | `md:` (768px) | Admin dashboard mulai responsif |
| Desktop | `lg:` (1024px) | Admin dashboard full layout |

---

## ✅ Do's & Don'ts

### ✅ Do

- Gunakan `rounded-xl` sebagai radius default semua komponen interaktif
- Selalu gunakan `<FoodImage />` — **jangan pernah** pakai `<img>` langsung untuk gambar menu
- Harga selalu tampilkan dengan format Rupiah: `Rp 15.000` (titik sebagai pemisah ribuan)
- Status pesanan selalu gunakan `<StatusBadge />` dengan config yang sudah ada
- CTA utama per halaman hanya satu, dengan warna `primary-500`
- Gunakan `active:scale-95` pada semua tombol untuk feedback tap mobile
- Estimasi waktu selalu tampil di halaman tracking (hardcode / dummy OK selama BE belum siap)

### ❌ Don't

- Jangan gunakan warna merah `accent-500` untuk aksi utama — hanya untuk promo & badge terlaris
- Jangan hardcode hex warna — gunakan kelas Tailwind atau token yang sudah didaftarkan
- Jangan tampilkan gambar `<img>` tanpa fallback handler
- Jangan gunakan `font-bold` untuk body teks biasa
- Jangan pakai `shadow-2xl` pada card biasa — hanya untuk modal/float button
- Jangan mix `rounded-full` dengan `rounded-xl` dalam satu kelompok komponen
- Jangan gunakan warna selain `emerald` untuk status sukses/lunas
- Jangan lupa `pb-32` pada `<main>` di halaman customer — tanpa ini konten akan tertutup bottom nav + floating button

---

## 🔮 Panduan Komponen Baru

Saat membuat komponen baru, ikuti checklist ini:

- [ ] Gunakan token warna yang sudah ada (jangan hardcode hex)
- [ ] Default border: `border border-gray-100` atau `border-gray-200`
- [ ] Semua elemen interaktif punya `transition-all duration-200`
- [ ] Hover state: `hover:bg-gray-50` (ringan) atau `hover:bg-primary-50`
- [ ] CTA/aksi utama: `bg-primary-500` + `shadow-md shadow-green-200`
- [ ] Destructive action: `text-red-500` + `hover:bg-red-50`
- [ ] Gunakan `cursor-pointer` secara eksplisit pada semua button
- [ ] Tambahkan `active:scale-95` untuk mobile tap feedback
- [ ] Icon size: 20px nav, 18px tombol, 16px inline
- [ ] Semua gambar menu wajib dibungkus `<FoodImage />`
- [ ] Status pesanan wajib memakai `<StatusBadge status={...} />`

---

*Dokumen ini dibuat berdasarkan desain UKL Lalapan Cak Bud v1.0*  
*Referensi visual: GoFood (gofood.co.id) · Palet warna: Logo Lalapan Cak Bud*  
*Update dokumen ini setiap kali ada keputusan desain baru yang disepakati.*
