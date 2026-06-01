"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CustomerNavbar() {
  const { cart, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push("/account");
    } else {
      router.push("/login");
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-100/80 sticky top-0 z-50 px-4 md:px-8 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 gap-4">
        
        {/* Left Side: Brand Logo */}
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-transform active:scale-95"
          >
            <img 
              src="/images/logo_cakbud.png" 
              alt="Logo Cak Bud" 
              className="h-10 sm:h-12 w-auto object-contain select-none pointer-events-none filter drop-shadow-sm"
            />
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 whitespace-nowrap">
              LALAPAN <span className="text-primary-500">CAK BUD</span>
            </span>
          </Link>
        </div>

        {/* Center: Elegant Capsule Tabs (Centered) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Link 
              href="/"
              className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive("/") 
                  ? "bg-primary-500/10 text-primary-500" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Beranda
            </Link>
            <Link 
              href="/menu"
              className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive("/menu") 
                  ? "bg-primary-500/10 text-primary-500" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Menu
            </Link>
            <Link 
              href="/ulasan"
              className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive("/ulasan") 
                  ? "bg-primary-500/10 text-primary-500" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Ulasan
            </Link>
            <Link 
              href="/orders"
              className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive("/orders") 
                  ? "bg-primary-500/10 text-primary-500" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              Pesanan Saya
            </Link>
          </div>
        </div>

        {/* Right Side: Cart Icon & Log In / Account button */}
        <div className="flex items-center gap-3">
          {/* Shopping Bag Button (Glows & bounces when items are in cart) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`p-2.5 rounded-full relative transition-all duration-300 cursor-pointer ${
              totalItems > 0 
                ? "bg-primary-500/10 text-primary-500 scale-105 shadow-sm hover:scale-110 active:scale-95" 
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

          {/* User Button / Log In / Account (Elegant and compact) */}
          <button 
            onClick={handleAccountClick}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 active:scale-95 text-xs font-bold rounded-full transition-all cursor-pointer ${
              isActive("/account")
                ? "bg-primary-500/10 text-primary-500 border border-primary-500/20"
                : "bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-green-200/40 hover:shadow-lg hover:shadow-green-300/30"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isAuthenticated ? "Akun Saya" : "Masuk"}</span>
          </button>
        </div>

      </div>
    </nav>
  );
}