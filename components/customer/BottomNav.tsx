"use client";

import React from "react";
import { Home, ClipboardList, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function BottomNav() {
  const { activeTab, setActiveTab, orders } = useCart();

  // Find number of active/undelivered orders
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-stone-100 flex items-center justify-around z-40 px-4 shadow-lg select-none pb-safe">
      {/* Beranda (Home) */}
      <button
        onClick={() => setActiveTab("home")}
        className={`flex flex-col items-center justify-center gap-1 w-20 h-full cursor-pointer transition-colors duration-200 ${
          activeTab === "home" ? "text-[#2d7a3e]" : "text-stone-400"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className={`text-[11px] ${activeTab === "home" ? "font-semibold text-[#2d7a3e]" : "font-medium text-stone-400"}`}>
          Beranda
        </span>
      </button>

      {/* Pesanan (Orders) */}
      <button
        onClick={() => setActiveTab("orders")}
        className={`flex flex-col items-center justify-center gap-1 w-20 h-full cursor-pointer relative transition-colors duration-200 ${
          activeTab === "orders" ? "text-[#2d7a3e]" : "text-stone-400"
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        {activeOrdersCount > 0 && (
          <span className="absolute top-2 right-4 w-2 h-2 bg-[#c8102e] rounded-full animate-pulse" />
        )}
        <span className={`text-[11px] ${activeTab === "orders" ? "font-semibold text-[#2d7a3e]" : "font-medium text-stone-400"}`}>
          Pesanan
        </span>
      </button>

      {/* Akun (Account) */}
      <button
        onClick={() => setActiveTab("account")}
        className={`flex flex-col items-center justify-center gap-1 w-20 h-full cursor-pointer transition-colors duration-200 ${
          activeTab === "account" ? "text-[#2d7a3e]" : "text-stone-400"
        }`}
      >
        <User className="w-5 h-5" />
        <span className={`text-[11px] ${activeTab === "account" ? "font-semibold text-[#2d7a3e]" : "font-medium text-stone-400"}`}>
          Akun
        </span>
      </button>
    </nav>
  );
}
