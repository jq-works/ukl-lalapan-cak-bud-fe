"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function BottomNav() {
  const { orders } = useCart();
  const pathname = usePathname();

  // Find number of active/undelivered orders
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
  ).length;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-stone-150 flex items-center justify-around z-40 px-4 shadow-lg select-none pb-safe">
      {/* Beranda (Home) */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-1 w-20 h-full cursor-pointer transition-colors duration-200 ${
          isActive("/") ? "text-primary-500" : "text-stone-400"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className={`text-[11px] ${isActive("/") ? "font-semibold text-primary-500" : "font-medium text-stone-400"}`}>
          Beranda
        </span>
      </Link>

      {/* Pesanan (Orders) */}
      <Link
        href="/orders"
        className={`flex flex-col items-center justify-center gap-1 w-20 h-full cursor-pointer relative transition-colors duration-200 ${
          isActive("/orders") ? "text-primary-500" : "text-stone-400"
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        {activeOrdersCount > 0 && (
          <span className="absolute top-2 right-4 w-2 h-2 bg-[#c8102e] rounded-full animate-pulse" />
        )}
        <span className={`text-[11px] ${isActive("/orders") ? "font-semibold text-primary-500" : "font-medium text-stone-400"}`}>
          Pesanan
        </span>
      </Link>

      {/* Akun (Account) */}
      <Link
        href="/account"
        className={`flex flex-col items-center justify-center gap-1 w-20 h-full cursor-pointer transition-colors duration-200 ${
          isActive("/account") ? "text-primary-500" : "text-stone-400"
        }`}
      >
        <User className="w-5 h-5" />
        <span className={`text-[11px] ${isActive("/account") ? "font-semibold text-primary-500" : "font-medium text-stone-400"}`}>
          Akun
        </span>
      </Link>
    </nav>
  );
}
