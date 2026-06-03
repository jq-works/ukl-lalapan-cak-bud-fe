"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingBag, Tag, Flame } from "lucide-react";
import { FoodItem } from "@/lib/data";
import { FoodImage } from "@/components/ui/FoodImage";
import { useCart } from "@/context/CartContext";

interface FoodCardProps {
  item: FoodItem;
  viewType: "grid" | "list";
  isMatch?: boolean;
}

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function FoodCard({ item, viewType, isMatch = true }: FoodCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const dimmed = !isMatch;
  const isAvailable = item.isAvailable !== false;

  const cartItem = cart.find((c) => c.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPct = hasDiscount
    ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, qty + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, qty - 1);
  };

  if (viewType === "list") {
    return (
      <div className={`bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex gap-4 p-4 group ${dimmed ? "opacity-45 grayscale-[60%]" : ""}`}>
        {/* Food Image */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
          <FoodImage src={item.image} alt={item.name} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
          {item.isTerlaris && (
            <div className="absolute top-1.5 left-1.5 bg-[#c8102e] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm z-10">
              <Flame className="w-2.5 h-2.5 sm:w-3 h-3 fill-current" />
              Terlaris
            </div>
          )}
          {hasDiscount && (
            <div className="absolute bottom-1.5 left-1.5 bg-[#2d7a3e] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm z-10">
              <Tag className="w-2.5 h-2.5 sm:w-3 h-3" />
              -{discountPct}%
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-stone-950/75 rounded-lg shadow-md">
                Habis
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 line-clamp-2 leading-snug mb-1 sm:mb-1.5">
              {item.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {item.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mt-2">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-[#2d7a3e]">
                {formatPrice(item.price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through font-medium">
                  {formatPrice(item.originalPrice!)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-400 font-medium">
              <span>Terjual {item.sold}</span>
            </div>
          </div>
        </div>

        {/* Cart Control */}
        <div className="flex-shrink-0 flex flex-col items-end justify-end">
          {!isAvailable ? (
            <span className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-400 text-xs font-bold border border-stone-200 select-none">
              Habis
            </span>
          ) : qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
                justAdded
                  ? "bg-emerald-500 text-white scale-105"
                  : "bg-[#2d7a3e] text-white hover:bg-[#1f5c2d] active:scale-90"
              }`}
              aria-label="Tambah ke pesanan"
            >
              {justAdded ? (
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-50 rounded-full p-1 border border-stone-100">
              <button
                onClick={handleDecrease}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#2d7a3e]/60 text-[#2d7a3e] flex items-center justify-center hover:bg-green-50 active:scale-90 transition-all cursor-pointer"
                aria-label="Kurangi"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm sm:text-base font-bold text-stone-900 min-w-[18px] sm:min-w-[22px] text-center">
                {qty}
              </span>
              <button
                onClick={handleIncrease}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2d7a3e] text-white flex items-center justify-center hover:bg-[#1f5c2d] active:scale-90 transition-all cursor-pointer shadow-sm"
                aria-label="Tambah"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Grid View ──────────────────────────────────────────────────────────────
  return (
    <div className={`bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group ${dimmed ? "opacity-45 grayscale-[60%]" : ""}`}>
      {/* Food Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
        <FoodImage src={item.image} alt={item.name} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {item.isTerlaris && (
          <div className="absolute top-2 left-2 bg-[#c8102e] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 z-10">
            <Flame className="w-2.5 h-2.5 fill-current" />
            Terlaris
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-[#2d7a3e] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
            -{discountPct}%
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-stone-950/75 rounded-lg shadow-md">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-xs font-extrabold text-stone-900 line-clamp-2 leading-snug mb-1">
          {item.name}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium mb-auto">
          <span>Terjual {item.sold}</span>
        </div>

        {/* Price + Add button */}
        <div className="flex items-end justify-between mt-2 gap-1">
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-[#2d7a3e]">
              {formatPrice(item.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-stone-400 line-through font-medium">
                {formatPrice(item.originalPrice!)}
              </span>
            )}
          </div>

          {!isAvailable ? (
            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-400 text-[10px] font-bold border border-stone-200 select-none">
              Habis
            </span>
          ) : qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm flex-shrink-0 ${
                justAdded
                  ? "bg-emerald-500 text-white scale-105"
                  : "bg-[#2d7a3e] text-white hover:bg-[#1f5c2d] active:scale-90"
              }`}
              aria-label="Tambah ke pesanan"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-stone-50 rounded-full px-1 py-0.5 border border-stone-100">
              <button
                onClick={handleDecrease}
                className="w-5 h-5 rounded-full border border-[#2d7a3e]/60 text-[#2d7a3e] flex items-center justify-center hover:bg-green-50 active:scale-90 transition-all cursor-pointer"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs font-bold text-stone-900 min-w-[16px] text-center">
                {qty}
              </span>
              <button
                onClick={handleIncrease}
                className="w-5 h-5 rounded-full bg-[#2d7a3e] text-white flex items-center justify-center hover:bg-[#1f5c2d] active:scale-90 transition-all cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
