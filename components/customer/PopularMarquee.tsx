"use client";

import React, { useRef, useState, useCallback } from "react";
import { Flame, Plus, Check } from "lucide-react";
import { FoodImage } from "@/components/ui/FoodImage";
import { useCart } from "@/context/CartContext";

export function PopularMarquee() {
  const { addToCart, foodItems } = useCart();
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
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

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    addToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  const popularItems = foodItems.filter((item) => (item.isTerlaris || item.rating >= 4.8) && item.isAvailable !== false);
  if (popularItems.length === 0) return null;

  // Triple the items so the loop is seamless even when scrolling
  const duplicatedItems = [...popularItems, ...popularItems, ...popularItems];

  return (
    <div className="space-y-3 py-2">
      {/* Title */}
      <div className="flex items-center gap-2 px-4 sm:px-0">
        <Flame className="w-4 h-4 text-[#c8102e] fill-current" />
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Menu Pilihan Pelanggan
        </h3>
        <span className="text-[10px] text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-full">
          Geser untuk jelajahi
        </span>
      </div>

      {/* Scroll Track */}
      <div className="relative w-full select-none">
        {/* Left gradient */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent pointer-events-none z-10" />
        {/* Right gradient */}
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-stone-50 via-stone-50/80 to-transparent pointer-events-none z-10" />

        {/* Scrollable + animated track */}
        <div
          ref={trackRef}
          className="overflow-x-auto scrollbar-hide py-2 px-2 cursor-grab"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setIsPaused(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Inner strip — animates when not paused */}
          <div
            className="flex gap-4 w-max"
            style={{
              animation: isPaused ? "none" : "marquee 32s linear infinite",
            }}
          >
            {duplicatedItems.map((item, idx) => {
              const uniqueKey = `${item.id}-${idx}`;
              const isAdded = addedItemId === item.id;

              return (
                <div
                  key={uniqueKey}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 flex gap-3.5 items-center"
                >
                  {/* Photo */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0 bg-stone-50">
                    <FoodImage src={item.image} alt={item.name} className="w-full h-full" />
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0 pr-1">
                    <h4 className="text-sm font-extrabold text-stone-900 line-clamp-1 mb-0.5">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium mb-1.5">
                      <span>Terjual {item.sold}</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#2d7a3e]">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all border cursor-pointer ${
                      isAdded
                        ? "bg-emerald-500 border-emerald-500 text-white scale-105"
                        : "bg-[#2d7a3e]/10 border-transparent text-[#2d7a3e] hover:bg-[#2d7a3e] hover:text-white active:scale-90"
                    }`}
                    title="Tambah ke Pesanan"
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
