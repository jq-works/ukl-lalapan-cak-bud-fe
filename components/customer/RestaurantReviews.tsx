"use client";

import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { useRestaurantReviews } from "./hooks/useRestaurantReviews";

export default function RestaurantReviews() {
  const {
    isPaused,
    setIsPaused,
    avgRating,
    totalCount,
    distribution,
    trackRef,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    duplicatedReviews,
  } = useRestaurantReviews();

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

                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < review.rating ? "text-amber-400" : "text-stone-200"
                          }`}
                        />
                      ))}
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
