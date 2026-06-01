"use client";

import React, { useState, useRef, useCallback } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaQuoteLeft, FaThumbsUp } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

/* ─── Types ───────────────────────────────────────────────── */
interface Review {
  id: string;
  name: string;
  avatar: string;        // initials fallback
  avatarColor: string;  // bg color token
  rating: number;
  date: string;
  text: string;
  orderItem: string;
  likes: number;
  isVerified: boolean;
}

/* ─── Data ulasan dummy ───────────────────────────────────── */
const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Budi Santoso",
    avatar: "BS",
    avatarColor: "bg-primary-500",
    rating: 5,
    date: "28 Mei 2026",
    text: "Lalapan ayam gorengnya enak banget! Sambal koreknya nendang, segar, dan porsinya juga gede. Sudah langganan di sini hampir 2 tahun, konsisten enak!",
    orderItem: "Paket Lalapan Ayam Goreng Juara",
    likes: 24,
    isVerified: true,
  },
  {
    id: "r2",
    name: "Dewi Rahayu",
    avatar: "DR",
    avatarColor: "bg-accent-500",
    rating: 5,
    date: "25 Mei 2026",
    text: "Es dawet ayu-nya mantap banget, gulanya pas, santannya gurih. Cocok banget diminum sambil makan lalapan bebek. Recommended pokoknya!",
    orderItem: "Es Dawet Ayu Gula Merah",
    likes: 18,
    isVerified: true,
  },
  {
    id: "r3",
    name: "Rizal Firmansyah",
    avatar: "RF",
    avatarColor: "bg-blue-500",
    rating: 4,
    date: "20 Mei 2026",
    text: "Ayam penyetnya lembut, sambal ijonya segar dan pedas yang enak. Tempe tahu penyet-nya juga gurih. Hanya nunggu sedikit lama, tapi worth it!",
    orderItem: "Ayam Penyet Sambal Ijo",
    likes: 11,
    isVerified: true,
  },
  {
    id: "r4",
    name: "Siti Nurhaliza",
    avatar: "SN",
    avatarColor: "bg-amber-500",
    rating: 5,
    date: "18 Mei 2026",
    text: "Mendoan panas sama sambal kecapnya beneran enak banget buat cemilan. Tipis, lembut, gurih — persis yang dijual di pasar tradisional Banyumas. Langsung pesan lagi besoknya!",
    orderItem: "Mendoan Panas Sambal Kecap (Isi 4)",
    likes: 31,
    isVerified: false,
  },
  {
    id: "r5",
    name: "Andi Prasetyo",
    avatar: "AP",
    avatarColor: "bg-emerald-600",
    rating: 5,
    date: "15 Mei 2026",
    text: "Bebek gorengnya empuk banget, bumbunya meresap sempurna. Kremesan gurihnya bikin nagih. Ini versi bebek goreng terbaik yang pernah saya coba di Banyumas!",
    orderItem: "Paket Lalapan Bebek Goreng Empuk",
    likes: 42,
    isVerified: true,
  },
  {
    id: "r6",
    name: "Maya Kurniawati",
    avatar: "MK",
    avatarColor: "bg-purple-500",
    rating: 4,
    date: "10 Mei 2026",
    text: "Pisang goreng pasir kejunya enak, renyah di luar lembut di dalam. Kejunya melimpah! Porsinya pas untuk 2 orang. Cocok buat ngemil sore.",
    orderItem: "Pisang Goreng Pasir Keju",
    likes: 9,
    isVerified: true,
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star)
          return <FaStar key={star} className="text-amber-400" size={12} />;
        if (rating >= star - 0.5)
          return <FaStarHalfAlt key={star} className="text-amber-400" size={12} />;
        return <FaRegStar key={star} className="text-stone-300" size={12} />;
      })}
    </div>
  );
}

/* ─── Summary bar stats ───────────────────────────────────── */
const DIST = [
  { stars: 5, count: 847 },
  { stars: 4, count: 213 },
  { stars: 3, count: 64 },
  { stars: 2, count: 18 },
  { stars: 1, count: 7 },
];
const TOTAL = DIST.reduce((s, d) => s + d.count, 0);
const AVG = (
  DIST.reduce((s, d) => s + d.stars * d.count, 0) / TOTAL
).toFixed(1);

/* ─── Component ───────────────────────────────────────────── */
export default function RestaurantReviews() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);

  // ── Drag-to-scroll state ──────────────────────────────────────────────
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    setIsPaused(true);
  }, []);

  const onMouseUp = useCallback(() => {
    if (!trackRef.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = "grab";
  }, []);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    setIsPaused(false);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  // ── Touch scroll ──────────────────────────────────────────────────────
  const touchStart = useRef(0);
  const touchScrollLeft = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    touchStart.current = e.touches[0].clientX;
    touchScrollLeft.current = trackRef.current.scrollLeft;
    setIsPaused(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const diff = touchStart.current - e.touches[0].clientX;
    trackRef.current.scrollLeft = touchScrollLeft.current + diff;
  }, []);

  const onTouchEnd = useCallback(() => setIsPaused(false), []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const duplicatedReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section id="ulasan-section" className="space-y-6">

      {/* ── Section header ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <FaStar className="text-amber-400" size={16} />
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Ulasan Pelanggan
        </h3>
      </div>

      {/* ── Rating summary card ─────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex flex-col sm:flex-row items-center gap-6">

        {/* Big score */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-5xl font-extrabold text-stone-900 leading-none">{AVG}</span>
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <FaStar key={s} className={s <= Math.round(Number(AVG)) ? "text-amber-400" : "text-stone-200"} size={14} />
            ))}
          </div>
          <span className="text-[11px] text-stone-400">{TOTAL.toLocaleString("id-ID")} ulasan</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-20 bg-stone-100" />
        <div className="block sm:hidden w-full h-px bg-stone-100" />

        {/* Distribution bars */}
        <div className="flex-grow w-full space-y-1.5">
          {DIST.map(({ stars, count }) => {
            const pct = Math.round((count / TOTAL) * 100);
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-stone-500 w-4 text-right">{stars}</span>
                <FaStar className="text-amber-400 flex-shrink-0" size={10} />
                <div className="flex-grow h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-stone-400 w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Review horizontal marquee ───────────────────────── */}
      <div className="relative w-full select-none">
        {/* Left gradient fade */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent pointer-events-none z-10" />
        {/* Right gradient fade */}
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-stone-50 via-stone-50/80 to-transparent pointer-events-none z-10" />

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="overflow-x-auto scrollbar-hide py-2 px-1 cursor-grab"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setIsPaused(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Inner scrolling strip */}
          <div
            className="flex gap-4 w-max items-stretch"
            style={{
              animation: isPaused ? "none" : "marquee 45s linear infinite",
            }}
          >
            {duplicatedReviews.map((review, idx) => {
              const uniqueKey = `${review.id}-${idx}`;
              const liked = likedIds.has(review.id);
              return (
                <div
                  key={uniqueKey}
                  className="flex-shrink-0 w-80 sm:w-[350px] bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex flex-col justify-between gap-3.5 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Top: avatar + name + rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar initials */}
                        <div className={`w-9 h-9 rounded-full ${review.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-[11px] font-black text-white">{review.avatar}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-bold text-stone-800">{review.name}</p>
                            {review.isVerified && (
                              <MdVerified className="text-primary-500" size={13} title="Pembeli terverifikasi" />
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400">{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>

                    {/* Quote icon + review text */}
                    <div className="relative">
                      <FaQuoteLeft className="absolute -top-1 -left-0.5 text-stone-100" size={18} />
                      <p className="text-[13px] text-stone-600 leading-relaxed pl-5 line-clamp-3">
                        {review.text}
                      </p>
                    </div>

                    {/* Ordered item badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Dipesan:
                      </span>
                      <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 rounded-md px-2 py-0.5 line-clamp-1">
                        {review.orderItem}
                      </span>
                    </div>
                  </div>

                  {/* Footer: like button */}
                  <div className="flex items-center justify-end pt-2 border-t border-stone-50">
                    <button
                      onClick={() => toggleLike(review.id)}
                      className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                        liked
                          ? "text-primary-600 bg-primary-50"
                          : "text-stone-400 hover:text-primary-500 hover:bg-primary-50"
                      }`}
                      aria-label="Suka ulasan ini"
                    >
                      <FaThumbsUp size={11} />
                      <span>{review.likes + (liked ? 1 : 0)}</span>
                      <span className="hidden xs:inline">Membantu</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer Info ─────────────────────────────────────── */}
      <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 pt-1">
        <span>Menampilkan ulasan terbaru</span>
        <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
          Sentuh & geser untuk melihat semua
        </span>
      </div>
    </section>
  );
}
