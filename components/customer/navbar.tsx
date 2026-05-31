"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CustomerNavbar() {
  const { cart, activeTab, setActiveTab, setIsCartOpen } = useCart();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-100/80 sticky top-0 z-50 px-4 md:px-8 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 gap-4">
        
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            onClick={() => setActiveTab("home")} 
            className="flex items-center gap-2 flex-shrink-0 transition-transform active:scale-95"
          >
            <img 
              src="/images/logo_cakbud.png" 
              alt="Logo Cak Bud" 
              className="h-10 sm:h-12 w-auto object-contain select-none pointer-events-none filter drop-shadow-sm"
            />
          </Link>

          {/* Elegant Capsule Tabs (Inspired by premium food-tech platforms) */}
          <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <button 
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === "home" 
                  ? "bg-[#2d7a3e]/10 text-[#2d7a3e]" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Beranda
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "orders" 
                  ? "bg-[#2d7a3e]/10 text-[#2d7a3e]" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Pesanan Saya
            </button>
            <button 
              onClick={() => setActiveTab("account")}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "account" 
                  ? "bg-[#2d7a3e]/10 text-[#2d7a3e]" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Akun
            </button>
          </div>
        </div>

        {/* Right Side: Cart Icon & Log In button */}
        <div className="flex items-center gap-3">
          {/* Shopping Bag Button (Glows & bounces when items are in cart) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`p-2.5 rounded-full relative transition-all duration-300 cursor-pointer ${
              totalItems > 0 
                ? "bg-[#2d7a3e]/10 text-[#2d7a3e] scale-105 shadow-sm hover:scale-110 active:scale-95" 
                : "bg-stone-50 hover:bg-stone-100 text-stone-600 active:scale-95"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#c8102e] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-md animate-bump">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Button / Log In (Elegant and compact) */}
          <button 
            onClick={() => setActiveTab("account")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#2d7a3e] hover:bg-[#1f5c2d] active:scale-95 text-white text-xs font-bold rounded-full transition-all shadow-md shadow-green-200/50 hover:shadow-lg hover:shadow-green-300/40 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Masuk / Akun</span>
          </button>
        </div>

      </div>
    </nav>
  );
}