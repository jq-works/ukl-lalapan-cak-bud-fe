"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FoodImage } from "@/components/ui/FoodImage";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, checkout } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check window size for responsive layout animations
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = 4000;
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    setIsSubmitting(true);
    // Simulate loading for 1.5 seconds, then checkout
    setTimeout(() => {
      checkout();
      setIsSubmitting(false);
    }, 1500);
  };

  // Motion variants depending on screen size
  const drawerVariants = {
    hidden: isDesktop ? { x: "100%", y: 0 } : { y: "100%", x: 0 },
    visible: { x: 0, y: 0 },
    exit: isDesktop ? { x: "100%", y: 0 } : { y: "100%", x: 0 },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
          />

          {/* Responsive Drawer Container */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed z-55 flex flex-col bg-white shadow-2xl border-stone-100 overflow-hidden
              ${isDesktop 
                ? "top-0 right-0 h-screen w-96 rounded-l-3xl border-l" 
                : "bottom-0 left-0 right-0 w-full rounded-t-3xl max-h-[85vh] border-t"
              }
            `}
          >
            {/* Handle Bar (Visible on mobile only) */}
            {!isDesktop && (
              <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto my-3 flex-shrink-0" />
            )}

            {/* Header */}
            <div className={`px-5 pb-4 flex justify-between items-center flex-shrink-0 ${isDesktop ? "pt-6 border-b border-stone-100" : "pt-1 border-b border-stone-100"}`}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#2d7a3e]" />
                <h3 className="text-base font-bold text-stone-900">
                  Keranjang Pesanan
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-5xl mb-3">😋</span>
                  <p className="text-sm font-bold text-stone-800 mb-1">
                    Keranjang pesananmu masih kosong
                  </p>
                  <p className="text-xs text-stone-500 max-w-[240px]">
                    Yuk, pilih menu lezat Lalapan Cak Bud dulu untuk mengisi perutmu!
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center gap-3 py-2 border-b border-stone-50 last:border-0"
                  >
                    {/* Item Photo & Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <FoodImage src={item.image} alt={item.name} className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#2d7a3e]">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <QuantityControl
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      />
                      <span className="text-xs font-bold text-stone-700">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cost Summary & Checkout Action */}
            {cart.length > 0 && (
              <div className={`px-5 py-5 bg-stone-50 border-t border-stone-100 space-y-4 flex-shrink-0 ${isDesktop ? "pb-6" : "pb-safe-bottom"}`}>
                <div className="space-y-2 text-xs">
                  {/* Subtotal */}
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal Menu</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  {/* Delivery & Service Fee */}
                  <div className="flex justify-between text-stone-500">
                    <span className="flex items-center gap-1">
                      Ongkir & Biaya Layanan
                      <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                    </span>
                    <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-stone-200 my-1" />
                  {/* Total Payment */}
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-1">
                    <span>Total Pembayaran</span>
                    <span className="text-[#2d7a3e]">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  disabled={isSubmitting}
                  onClick={handleCheckout}
                  className="w-full h-12 bg-[#2d7a3e] hover:bg-[#1f5c2d] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200/50 hover:shadow-green-300/60 active:scale-98 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <span>Pesan Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
