"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "@/components/customer/navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { BottomNav } from "@/components/customer/BottomNav";
import CustomerFooter from "@/components/customer/Footer";
import { ShieldAlert, ArrowRight, Loader2, User, Phone, ShoppingBag, ArrowLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CheckoutPage() {
  const { cart, checkout } = useCart();
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Checkout forms states
  const [checkoutMode, setCheckoutMode] = useState<"member" | "guest">("member");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Dine In vs Take Away & Payment Simulation states
  const [orderType, setOrderType] = useState<"dine_in" | "take_away">("take_away");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "transfer">("qris");
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);

  // Set default mode on authentication state change
  useEffect(() => {
    if (isAuthenticated) {
      setCheckoutMode("member");
    } else {
      setCheckoutMode("guest");
    }
  }, [isAuthenticated]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  const handleCheckoutClick = () => {
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

    setShowPaymentSimulation(true);
  };

  const executeCheckout = async (initialStatus: "PENDING" | "PROCESSING") => {
    setIsSubmitting(true);
    try {
      let success = false;
      const typeLabel = orderType === "dine_in" ? "DINE IN" : "TAKE AWAY";
      const activePhone = isAuthenticated ? (user?.phone || "") : guestPhone;
      const phoneTag = activePhone ? `[HP: ${activePhone}] ` : "";
      const finalNote = `[${typeLabel}] ${phoneTag}${orderNote}`.trim();
      const apiOrderType = orderType === "dine_in" ? "DINE_IN" : "TAKE_AWAY";

      if (isAuthenticated) {
        success = await checkout(undefined, finalNote, initialStatus, apiOrderType, paymentMethod);
      } else {
        success = await checkout({ name: guestName, phone: guestPhone }, finalNote, initialStatus, apiOrderType, paymentMethod);
      }
      
      if (success) {
        setGuestName("");
        setGuestPhone("");
        setOrderNote("");
        setShowPaymentSimulation(false);
        router.push("/orders");
      }
    } catch (err: any) {
      setFormError(err.message || "Gagal melakukan pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Memuat detail checkout...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if cart is empty and not submitting
  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col justify-start text-stone-850">
        <CustomerNavbar />
        <main className="max-w-md w-full mx-auto px-4 pt-16 pb-32 grow text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-5xl mx-auto">
            🛒
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-stone-900">Keranjang Belanja Kosong</h2>
            <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
              Silakan pilih menu makanan lezat Lalapan Cak Bud terlebih dahulu sebelum melakukan pengisian data checkout.
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full h-11 bg-[#2d7a3e] hover:bg-[#1f5c2d] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Pilih Menu Sekarang
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-start text-stone-850">
      <CustomerNavbar />

      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 pt-6 pb-32 grow">
        <div className="fade-in space-y-6">
          
          {/* Header Title with Back Link */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Checkout Pesanan</h1>
              <p className="text-stone-500 text-xs">Lengkapi detail pengisian data pemesanan di bawah ini.</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Menu
            </button>
          </div>

          {/* Checkout Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column: Customer Info & Setup Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form Error Alert */}
              {formError && (
                <Alert variant="destructive" className="animate-shake">
                  <ShieldAlert className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <AlertTitle>Terjadi Kesalahan</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Card 1: Order Penyajian Type */}
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

              {/* Card 2: Customer Identity Information */}
              <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">2</span>
                  <h3 className="text-sm font-bold text-stone-900">Informasi Pemesan</h3>
                </div>

                {!isAuthenticated && (
                  <div className="flex bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCheckoutMode("guest")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        checkoutMode === "member"
                          ? "bg-white text-stone-900 shadow-sm"
                          : "text-stone-500 hover:text-stone-850"
                      }`}
                    >
                      Pesan dengan Akun
                    </button>
                  </div>
                )}

                {/* Info Input/View Body */}
                {isAuthenticated ? (
                  /* Member Profile Info View */
                  <div className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {user?.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">{user?.name}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{user?.email} · {user?.phone || "-"}</p>
                      </div>
                    </div>
                  </div>
                ) : checkoutMode === "member" ? (
                  /* Redirect to Login Card */
                  <div className="p-5 border border-stone-200 rounded-2xl text-center space-y-3">
                    <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                      Gunakan Akun Anda untuk melacak status pesanan secara real-time.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="px-6 py-2 bg-[#2d7a3e] hover:bg-[#1f5c2d] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Masuk Ke Akun
                    </button>
                  </div>
                ) : (
                  /* Guest Input Fields */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Contoh: Dzaky Ramadhan"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full h-11 pl-9 pr-4 bg-stone-50/50 border border-stone-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2d7a3e] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Nomor WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="tel"
                          placeholder="Contoh: 08123456789"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full h-11 pl-9 pr-4 bg-stone-50/50 border border-stone-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2d7a3e] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3: Additional Notes & Payment Method */}
              {(isAuthenticated || checkoutMode === "guest") && (
                <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm space-y-5">
                  
                  {/* Note Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">3</span>
                      <h3 className="text-sm font-bold text-stone-900">Catatan Khusus (Opsional)</h3>
                    </div>
                    <input
                      type="text"
                      placeholder="Contoh: Sambal dipisah, minta sendok, dll."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full h-11 px-4 bg-stone-50/50 border border-stone-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2d7a3e] focus:bg-white transition-all"
                    />
                  </div>

                  <hr className="border-stone-100" />

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">4</span>
                      <h3 className="text-sm font-bold text-stone-900">Pilih Metode Pembayaran</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("qris")}
                        className={`p-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left space-y-1 ${
                          paymentMethod === "qris"
                            ? "bg-primary-50 border-[#2d7a3e] text-[#2d7a3e] shadow-sm"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <p className="font-extrabold">QRIS (Otomatis)</p>
                        <p className="text-[10px] text-stone-400 font-semibold">Bayar instan pakai e-wallet</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("transfer")}
                        className={`p-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left space-y-1 ${
                          paymentMethod === "transfer"
                            ? "bg-primary-50 border-[#2d7a3e] text-[#2d7a3e] shadow-sm"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <p className="font-extrabold">BCA Transfer</p>
                        <p className="text-[10px] text-stone-400 font-semibold">Virtual Account transfer</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left space-y-1 ${
                          paymentMethod === "cash"
                            ? "bg-primary-50 border-[#2d7a3e] text-[#2d7a3e] shadow-sm"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <p className="font-extrabold">Bayar di Kasir</p>
                        <p className="text-[10px] text-stone-400 font-semibold">Bayar tunai di kasir warung</p>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right Column: Order items summary & Billing total */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Order Items Review */}
              <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <ShoppingBag className="w-5 h-5 text-[#2d7a3e]" />
                  <h3 className="text-sm font-bold text-stone-900">Rincian Belanja</h3>
                </div>

                <div className="divide-y divide-stone-50 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-stone-850 truncate">{item.name}</p>
                        <p className="text-[10px] text-stone-400 font-bold mt-0.5">
                          {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="font-bold text-stone-700 shrink-0">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-100" />

                {/* Costs details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal Menu</span>
                    <span className="font-medium text-stone-800">Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Biaya Admin & Layanan</span>
                    <span className="text-stone-700 font-semibold">Rp {serviceFee.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-stone-900 border-t border-stone-100 pt-2.5">
                    <span>Total Pembayaran</span>
                    <span className="text-[#2d7a3e]">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Final Submission Button */}
                {(isAuthenticated || checkoutMode === "guest") ? (
                  <button
                    disabled={isSubmitting}
                    onClick={handleCheckoutClick}
                    className="w-full h-12 bg-[#2d7a3e] hover:bg-[#1f5c2d] disabled:bg-stone-300 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200/55 hover:shadow-green-300/40 active:scale-98 transition-all cursor-pointer text-xs mt-2"
                  >
                    <span>Konfirmasi & Bayar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-3 bg-stone-50 rounded-xl text-center text-[10px] text-stone-450 font-bold">
                    Pilih mode pemesan di sebelah kiri untuk melanjutkan.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Payment Simulation Dialog Modal */}
      {showPaymentSimulation && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-stone-200 w-full max-w-sm shadow-2xl p-6 space-y-5 animate-scale-up text-center">
            
            {/* Modal Header */}
            <div className="space-y-1 pb-2 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-sm uppercase tracking-tight">
                {paymentMethod === "cash" ? "Barcode Pembayaran" : "Simulasi Pembayaran"}
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold">
                {paymentMethod === "cash" 
                  ? "Tunjukkan barcode ini ke kasir untuk menyelesaikan transaksi." 
                  : "Selesaikan transaksi via simulasi transfer / QRIS."}
              </p>
            </div>

            {/* Billing Details */}
            <div className="bg-stone-50 rounded-2xl p-4 flex flex-col items-center justify-center space-y-4 border border-stone-150">
              <div>
                <p className="text-[9px] text-stone-450 font-bold uppercase tracking-wider">Total Tagihan</p>
                <p className="text-base font-black text-[#2d7a3e] mt-0.5">Rp {total.toLocaleString("id-ID")}</p>
              </div>

              {paymentMethod === "qris" ? (
                /* QRIS Simulated QR Box */
                <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
                  <div className="w-32 h-32 bg-white border-4 border-primary-600 rounded-lg flex items-center justify-center relative select-none">
                    <div className="absolute top-2 left-2 w-6 h-6 border-4 border-primary-600 rounded-sm"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-4 border-primary-600 rounded-sm"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-4 border-primary-600 rounded-sm"></div>
                    <div className="w-16 h-16 opacity-30" style={{
                      backgroundImage: "radial-gradient(circle, var(--color-primary-600) 3px, transparent 3px)",
                      backgroundSize: "8px 8px"
                    }}></div>
                    <div className="absolute bg-primary-500 text-white text-[9px] font-black rounded px-1.5 py-0.5 shadow-md uppercase">Cak Bud</div>
                  </div>
                  <p className="text-[9px] text-stone-400 font-bold mt-2 uppercase tracking-wider">QRIS LALAPAN CAK BUD</p>
                </div>
              ) : paymentMethod === "transfer" ? (
                /* BCA Simulated VA Account Info */
                <div className="w-full space-y-2.5 p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-left shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-450 font-semibold">Nama Bank:</span>
                    <span className="font-extrabold text-stone-850">Bank BCA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-450 font-semibold">No. Rekening:</span>
                    <span className="font-mono font-bold text-[#2d7a3e] select-all tracking-wider">88009988776655</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-450 font-semibold">Atas Nama:</span>
                    <span className="font-semibold text-stone-800">Lalapan Cak Bud</span>
                  </div>
                </div>
              ) : (
                /* Cash / Bayar di Kasir Barcode */
                <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-stone-200 shadow-sm w-full">
                  <div className="w-full h-16 bg-white flex items-center justify-center gap-[2.5px] px-4 py-2 border border-stone-150 rounded relative select-none">
                    {/* Simulated Barcode Stripes */}
                    <div className="w-[3px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[4px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-px h-full bg-stone-900" />
                    <div className="w-[3px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[4px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[3px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-[4px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[3px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[4px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-[3px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[4px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[3px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-[1px] h-full bg-stone-900" />
                    <div className="w-[4px] h-full bg-stone-900" />
                    <div className="w-[2px] h-full bg-stone-900" />
                    <div className="w-[3px] h-full bg-stone-900" />
                  </div>
                  <p className="text-[10px] font-mono text-stone-600 font-bold mt-2 tracking-widest uppercase">
                    CSH-982138
                  </p>
                  <p className="text-[9px] text-[#2d7a3e] font-extrabold mt-1.5 uppercase tracking-wider">
                    TUNJUKKAN BARCODE INI KE KASIR
                  </p>
                </div>
              )}

              <p className="text-[10px] text-stone-450 font-medium leading-relaxed max-w-[220px]">
                {paymentMethod === "cash" 
                  ? "Tunjukkan barcode ini ke kasir warung saat melakukan pembayaran tunai." 
                  : "Tekan tombol di bawah untuk menyimulasikan pembayaran terkonfirmasi Lunas di sistem dapur."}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => executeCheckout(paymentMethod === "cash" ? "PENDING" : "PROCESSING")}
                className="w-full h-11 bg-[#2d7a3e] hover:bg-[#1f5c2d] disabled:bg-stone-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengonfirmasi...</span>
                  </>
                ) : (
                  <span>
                    {paymentMethod === "cash" 
                      ? "Selesaikan Pemesanan (Bayar di Kasir)" 
                      : "Konfirmasi Pembayaran Lunas"}
                  </span>
                )}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowPaymentSimulation(false)}
                className="w-full h-10 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Kembali ke Form
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomerFooter />
      <BottomNav />
    </div>
  );
}
