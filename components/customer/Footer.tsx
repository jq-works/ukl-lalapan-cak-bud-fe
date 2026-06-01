"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaStar, FaLeaf, FaHeart, FaWhatsapp } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

/* ─── Static data ─────────────────────────────────────────── */
const JAM_BUKA = [
  { hari: "Senin – Jumat", jam: "10.00 – 21.00 WIB" },
  { hari: "Sabtu – Minggu", jam: "09.00 – 22.00 WIB" },
];

const QUICK_LINKS = [
  { label: "Beranda",     tab: "home"    as const },
  { label: "Pesanan Saya", tab: "orders" as const },
  { label: "Akun Saya",  tab: "account" as const },
];

const CATEGORIES_DISPLAY = [
  { icon: "🍗", label: "Lalapan" },
  { icon: "🥘", label: "Penyet" },
  { icon: "🥤", label: "Minuman" },
  { icon: "🍌", label: "Cemilan" },
];

/* ─── Component ───────────────────────────────────────────── */
export default function CustomerFooter() {
  const { setActiveTab } = useCart();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer-section" className="relative overflow-hidden bg-gradient-to-b from-primary-500 to-primary-700 text-white mt-6 pb-20 md:pb-0">

      {/* ── Glowing accent top border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />

      {/* ── Background Image Utama (Premium Dark Rustic Food Vignette) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.12] pointer-events-none select-none z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')" }}
      />

      {/* ── Pattern Overlay (Subtle Dot Grid Pattern for modern UI texture) */}
      <div 
        className="absolute inset-0 opacity-[0.08] z-0 select-none pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* ── Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-primary-600/40 to-primary-700/80 z-0" />

      {/* ── Premium Radial Background Glow */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, var(--color-primary-400) 0%, transparent 60%), " +
            "radial-gradient(circle at 90% 80%, var(--color-primary-500) 0%, transparent 50%)",
        }}
      />

      {/* ── Decorative Leaf Watermark */}
      <div className="absolute left-6 top-6 opacity-[0.06] pointer-events-none select-none -translate-x-1/4 -translate-y-1/4 text-white rotate-45">
        <FaLeaf style={{ width: 200, height: 200 }} />
      </div>

      {/* ── Floating Food Highlight on Right Side (Traditional Indonesian Dish) */}
      <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-80 h-80 rounded-full overflow-hidden border-[6px] border-white/20 shadow-2xl opacity-15 pointer-events-none select-none z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80')" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">

        {/* ════ Main Grid ══════════════════════════════════ */}
        <div className="pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* ── 1. Brand Section ─────────────────────────── */}
          <div className="space-y-5">
            {/* Logo Wrapper */}
            <div className="inline-block relative">
              <img
                src="/images/logo_cakbud.png"
                alt="Logo Lalapan Cak Bud"
                className="h-14 w-auto object-contain drop-shadow-lg select-none pointer-events-none transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Tagline */}
            <p className="text-[13px] text-white leading-relaxed max-w-xs drop-shadow-sm">
              Warung lalapan legendaris dengan cita rasa autentik Jawa Tengah.
              Segar, gurih, dan pedas mantap — sejak 2008.
            </p>

            {/* Rating Badge - Premium Glassmorphism */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 shadow-sm">
              <FaStar className="text-amber-300 animate-pulse" size={12} />
              <span className="text-xs font-bold text-white">4.9</span>
              <span className="text-[10px] text-white/80 font-medium">· 1,000+ Ulasan Pelanggan</span>
            </div>

            {/* Social Media Link Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white hover:text-[#2d7a3e] hover:bg-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                title="Ikuti Instagram Kami"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white hover:text-[#10b981] hover:bg-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                title="Hubungi Via WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* ── 2. Navigation & Categories ────────────────── */}
          <div className="space-y-6">
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-white/90">
                Menu Utama
              </h3>
              <ul className="space-y-2">
                {QUICK_LINKS.map(({ label, tab }) => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className="text-[13px] text-white hover:text-white/80 hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-white/90">
                Kategori Populer
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES_DISPLAY.map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab("home")}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-white/10 hover:bg-white hover:text-[#2d7a3e] border border-white/20 rounded-full px-3 py-1.5 transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <span className="text-xs leading-none">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 3. Operational Hours ─────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white/90">
              Jam Operasional
            </h3>

            {/* Operational Card */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4.5 space-y-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/95 flex items-center gap-1.5">
                  <FiClock className="text-white" size={13} /> Status
                </span>
                <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/10 rounded-full px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                    Sedang Buka
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {JAM_BUKA.map(({ hari, jam }) => (
                  <div key={hari} className="flex justify-between items-center text-[12px] sm:text-[13px]">
                    <span className="text-white/80 font-medium">{hari}</span>
                    <span className="text-white font-bold">{jam}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4. Location & Contact ─────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white/90">
              Lokasi &amp; Kontak
            </h3>

            <div className="space-y-3">
              {/* Alamat */}
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-white mt-1 flex-shrink-0" size={13} />
                <p className="text-[13px] text-white/90 leading-relaxed">
                  Jl. Pahlawan No. 12, Kec. Banyumas,
                  <br />
                  Kab. Banyumas, Jawa Tengah
                </p>
              </div>

              {/* Telepon */}
              <div className="flex items-center gap-2.5">
                <FaPhone className="text-white flex-shrink-0" size={13} />
                <a
                  href="tel:+6281234567890"
                  className="text-[13px] text-white/90 hover:text-white/80 transition-colors duration-200 font-medium"
                >
                  +62 812-3456-7890
                </a>
              </div>
            </div>

            {/* Google Maps CTA Button */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full justify-center bg-white/10 hover:bg-white text-white hover:text-[#2d7a3e] border border-white/20 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer shadow-md"
            >
              <FaMapMarkerAlt size={12} />
              Buka di Google Maps
            </a>

            {/* Certification Badges */}
            <div className="flex items-center gap-2.5 pt-3.5 border-t border-white/10">
              <span className="text-[9px] font-extrabold tracking-wider text-white bg-white/20 border border-white/10 rounded-md px-2 py-0.5 uppercase">
                MUI Halal
              </span>
              <span className="text-[9px] font-extrabold tracking-wider text-white bg-white/20 border border-white/10 rounded-md px-2 py-0.5 uppercase">
                100% Higienis
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom Divider Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ════ Bottom Copyright Bar ════════════════════════ */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/70">
          <p className="font-medium text-center sm:text-left">
            &copy; {currentYear}{" "}
            <span className="font-bold text-white">Lalapan Cak Bud</span>. Semua hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1 font-medium">
            Dibuat dengan{" "}
            <FaHeart className="text-accent-500 mx-0.5 animate-pulse" size={11} />{" "}
            untuk penggemar kuliner Banyumas
          </p>
        </div>

      </div>
    </footer>
  );
}
