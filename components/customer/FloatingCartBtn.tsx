"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCartBtn() {
  const { cart, setIsCartOpen } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed z-45 bottom-20 left-4 right-4 max-w-md mx-auto lg:bottom-6 lg:right-6 lg:left-auto lg:mx-0 lg:w-72"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full h-14 rounded-2xl bg-[#2d7a3e] text-white flex items-center justify-between px-5 shadow-xl shadow-green-300/45 hover:bg-[#1f5c2d] hover:shadow-green-300/60 active:scale-98 transition-all cursor-pointer relative animate-pulse-subtle"
          >
            {/* Left side: Shopping Bag and Count Badge */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-5.5 h-5.5" />
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#c8102e] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#2d7a3e]">
                  {totalItems}
                </span>
              </div>
              <span className="font-semibold text-sm">
                Keranjang Pesanan
              </span>
            </div>

            {/* Right side: Total Price */}
            <span className="font-bold text-sm bg-white/10 px-2.5 py-0.5 rounded-lg">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
