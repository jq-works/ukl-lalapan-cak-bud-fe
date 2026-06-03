"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { api } from "@/lib/api";

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

/* ─── Helpers ─────────────────────────────────────────────── */


/* ─── Summary bar stats ───────────────────────────────────── */


/* ─── Component ───────────────────────────────────────────── */
export default function RestaurantReviews() {

  const [isPaused, setIsPaused] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState("0.0");
  const [totalCount, setTotalCount] = useState(0);
  const [distribution, setDistribution] = useState([
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ]);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      const resData = res.data;
      if (resData.success) {
        const apiReviews = resData.data?.reviews || [];
        const stats = resData.data?.stats;
        
        const colors = ["bg-primary-500", "bg-accent-500", "bg-blue-500", "bg-amber-500", "bg-emerald-600", "bg-purple-500"];
        const mapped: Review[] = apiReviews.map((r: any) => {
          const index = Math.abs(r.user?.name?.charCodeAt(0) || 0) % colors.length;
          return {
            id: r.id,
            name: r.user?.name || "Pelanggan",
            avatar: (r.user?.name || "P").slice(0, 2).toUpperCase(),
            avatarColor: colors[index],
            rating: Number(r.rating || 5),
            date: new Date(r.createdAt || Date.now()).toLocaleDateString("id-ID", {
              day: "numeric", month: "short", year: "numeric"
            }),
            text: r.menuReview || "",
            orderItem: r.suggestions ? "Saran: " + r.suggestions : "Ulasan Kuliner",
            likes: Math.floor(Math.random() * 12) + 2,
            isVerified: true
          };
        });
        
        setReviewsList(mapped);
        
        // Update stats from backend
        let total = 0;
        let avg = "0.0";
        if (stats) {
          total = stats.totalReviews || 0;
          avg = Number(stats.averageRating || 0).toFixed(1);
        } else {
          total = apiReviews.length;
          const sum = apiReviews.reduce((acc: number, val: any) => acc + Number(val.rating || 5), 0);
          avg = total > 0 ? (sum / total).toFixed(1) : "0.0";
        }
        
        setAvgRating(avg);
        setTotalCount(total);
        
        // Calculate distribution
        const starCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
        apiReviews.forEach((r: any) => {
          const rating = Math.min(5, Math.max(1, Math.round(Number(r.rating || 5))));
          starCounts[rating - 1]++;
        });
        
        setDistribution([
          { stars: 5, count: starCounts[4] },
          { stars: 4, count: starCounts[3] },
          { stars: 3, count: starCounts[2] },
          { stars: 2, count: starCounts[1] },
          { stars: 1, count: starCounts[0] },
        ]);
      }
    } catch (e) {
      console.error("Gagal mengambil ulasan di RestaurantReviews:", e);
      setReviewsList([]);
      setAvgRating("0.0");
      setTotalCount(0);
      setDistribution([
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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



  const duplicatedReviews = reviewsList.length > 0
    ? (reviewsList.length < 3
        ? [...reviewsList, ...reviewsList, ...reviewsList, ...reviewsList]
        : [...reviewsList, ...reviewsList, ...reviewsList])
    : [];

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
          <span className="text-5xl font-extrabold text-stone-900 leading-none">{avgRating}</span>
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <FaStar key={s} className={s <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-stone-200"} size={14} />
            ))}
          </div>
          <span className="text-[11px] text-stone-400">{totalCount.toLocaleString("id-ID")} ulasan</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-20 bg-stone-100" />
        <div className="block sm:hidden w-full h-px bg-stone-100" />

        {/* Distribution bars */}
        <div className="flex-grow w-full space-y-1.5">
          {distribution.map(({ stars, count }) => {
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
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
              return (
                <div
                  key={uniqueKey}
                  className="flex-shrink-0 w-80 sm:w-[350px] bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex flex-col justify-between gap-3.5 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Top: avatar + name */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar initials */}
                        <div className={`w-9 h-9 rounded-full ${review.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-[11px] font-black text-white">{review.avatar}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-bold text-stone-800">{review.name}</p>
                          </div>
                          <p className="text-[11px] text-stone-400">{review.date}</p>
                        </div>
                      </div>
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
