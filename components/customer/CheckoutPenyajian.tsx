"use client";

import React from "react";

interface CheckoutPenyajianProps {
  orderType: "dine_in" | "take_away";
  setOrderType: (type: "dine_in" | "take_away") => void;
}

export function CheckoutPenyajian({
  orderType,
  setOrderType,
}: CheckoutPenyajianProps) {
  return (
    <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">1</span>
        <h3 className="text-sm font-bold text-stone-900">Pilih Tipe Penyajian</h3>
      </div>
      
      <div className="flex bg-stone-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setOrderType("dine_in")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            orderType === "dine_in"
              ? "bg-[#2d7a3e] text-white shadow-md shadow-green-200/50"
              : "text-stone-500 hover:text-stone-850"
          }`}
        >
          Dine In (Makan di Tempat)
        </button>
        <button
          type="button"
          onClick={() => setOrderType("take_away")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            orderType === "take_away"
              ? "bg-[#2d7a3e] text-white shadow-md shadow-green-200/50"
              : "text-stone-500 hover:text-stone-850"
          }`}
        >
          Take Away (Bawa Pulang)
        </button>
      </div>
    </div>
  );
}
