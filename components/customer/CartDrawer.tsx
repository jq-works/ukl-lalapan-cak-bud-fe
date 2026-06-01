"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, ShieldAlert, ArrowRight, Loader2, User, Key, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FoodImage } from "@/components/ui/FoodImage";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, checkout } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Checkout flow states
  const [checkoutMode, setCheckoutMode] = useState<"member" | "guest">("member");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Check window size for responsive layout animations
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set default mode on authentication state change
  useEffect(() => {
    if (isAuthenticated) {
      setCheckoutMode("member");
    } else {
      setCheckoutMode("guest");
    }
  }, [isAuthenticated]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = 4000;
  const total = subtotal + serviceFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // If guest, validate fields
    if (!isAuthenticated && checkoutMode === "guest") {
      if (!guestName.trim()) {
        setFormError("Nama lengkap pemesan wajib diisi.");
        return;
      }
      if (!guestPhone.trim()) {
        setFormError("Nomor WhatsApp wajib diisi.");
        return;
      }
      if (!/^[0-9+]{8,15}$/.test(guestPhone.replace(/\s+/g, ""))) {
        setFormError("Nomor WhatsApp tidak valid. Gunakan angka.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let success = false;
      if (isAuthenticated) {
        // Authenticated checkout
        success = await checkout(undefined, orderNote);
      } else {
        // Guest checkout
        success = await checkout({ name: guestName, phone: guestPhone }, orderNote);
      }
      
      if (success) {
        // Reset local states
        setGuestName("");
        setGuestPhone("");
        setOrderNote("");
      }
    } catch (err: any) {
      setFormError(err.message || "Gagal melakukan pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
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
                : "bottom-0 left-0 right-0 w-full rounded-t-3xl max-h-[90vh] border-t"
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
                <h3 className="text-sm font-bold text-stone-900">
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
                  <p className="text-xs font-bold text-stone-800 mb-1">
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

            {/* Cost Summary, Checkout Mode & Action */}
            {cart.length > 0 && (
              <div className={`px-5 py-4 bg-stone-50 border-t border-stone-100 space-y-4 flex-shrink-0 ${isDesktop ? "pb-6" : "pb-safe-bottom"}`}>
                
                {/* Cost Calculations */}
                <div className="space-y-1.5 text-xs border-b border-stone-200 pb-3">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal Menu</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span className="flex items-center gap-1">
                      Ongkir & Biaya Layanan
                      <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                    </span>
                    <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-stone-900 pt-1">
                    <span>Total Pembayaran</span>
                    <span className="text-[#2d7a3e]">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Form Error Message */}
                {formError && (
                  <div className="bg-red-50 border border-red-150 rounded-xl p-3 text-[11px] text-red-600 flex items-start gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Authentication & Checkout Setup */}
                <div className="space-y-3">
                  {/* Guest Selection Selector */}
                  {!isAuthenticated && (
                    <div className="flex bg-stone-200/60 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setCheckoutMode("guest")}
                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          checkoutMode === "guest"
                            ? "bg-white text-stone-900 shadow-sm"
                            : "text-stone-500 hover:text-stone-850"
                        }`}
                      >
                        Pesan sebagai Tamu
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutMode("member")}
                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          checkoutMode === "member"
                            ? "bg-white text-stone-900 shadow-sm"
                            : "text-stone-500 hover:text-stone-850"
                        }`}
                      >
                        Pesan sebagai Member
                      </button>
                    </div>
                  )}

                  {/* Mode Content */}
                  {isAuthenticated ? (
                    /* Authenticated Member Info Box */
                    <div className="p-3 bg-primary-50/60 border border-primary-100 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#2d7a3e]">
                        <User className="w-3.5 h-3.5" />
                        <span>Checkout Member</span>
                      </div>
                      <p className="text-stone-600">Pemesanan atas nama: <span className="font-semibold text-stone-900">{user?.name}</span></p>
                      {user?.phone && <p className="text-stone-500">Nomor WhatsApp: <span className="font-semibold text-stone-850">{user?.phone}</span></p>}
                    </div>
                  ) : checkoutMode === "member" ? (
                    /* Guest wants member checkout but has no account */
                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl text-center space-y-2.5">
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Nikmati loyalty poin dan pelacakan pesanan real-time dengan masuk ke akun Anda.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push("/login");
                        }}
                        className="w-full h-9 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Masuk Ke Akun
                      </button>
                    </div>
                  ) : (
                    /* Guest input form fields */
                    <div className="space-y-2">
                      <div>
                        <input
                          type="text"
                          placeholder="Nama Pemesan"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Nomor WhatsApp (08xxxxxx)"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Note Field (Shown for both guest form and member) */}
                  {(isAuthenticated || checkoutMode === "guest") && (
                    <div>
                      <input
                        type="text"
                        placeholder="Catatan Pesanan (misal: pedas sekali, es teh manis)"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Checkout Button */}
                {(isAuthenticated || checkoutMode === "guest") ? (
                  <button
                    disabled={isSubmitting}
                    onClick={handleCheckoutSubmit}
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
                ) : null}

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
