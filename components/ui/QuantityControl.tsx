"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QuantityControl({ quantity, onIncrease, onDecrease }: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        className="w-7 h-7 rounded-full border border-[#2d7a3e] text-[#2d7a3e] flex items-center justify-center hover:bg-green-50 active:scale-90 transition-all cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      
      <span className="text-sm font-bold text-stone-900 min-w-[24px] text-center">
        {quantity}
      </span>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        className="w-7 h-7 rounded-full bg-[#2d7a3e] text-white flex items-center justify-center hover:bg-[#1f5c2d] active:scale-90 transition-all cursor-pointer shadow-sm"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
