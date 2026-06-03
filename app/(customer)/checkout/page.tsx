"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CustomerNavbar from "@/components/customer/navbar";
import { BottomNav } from "@/components/customer/BottomNav";
import CustomerFooter from "@/components/customer/Footer";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckoutPenyajian } from "@/components/customer/CheckoutPenyajian";
import { CheckoutInfoForm } from "@/components/customer/CheckoutInfoForm";
import { CheckoutNotesAndPayment, CheckoutSummaryCard } from "@/components/customer/CheckoutSummaryCard";
import { CheckoutPaymentModal } from "@/components/customer/CheckoutPaymentModal";

export default function CheckoutPage() {
  const { cart, checkout } = useCart();
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  // Status proses transaksi (loading submit)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data informasi identitas pelanggan
  const [checkoutMode, setCheckoutMode] = useState<"member" | "guest">("member");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Detail cara penyajian, pembayaran, dan simulasi
  const [orderType, setOrderType] = useState<"dine_in" | "take_away">("take_away");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "transfer">("qris");
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);

  // Menentukan jenis checkout (member / tamu) secara otomatis berdasarkan login
  useEffect(() => {
    setCheckoutMode(isAuthenticated ? "member" : "guest");
  }, [isAuthenticated]);

  // Kalkulasi rincian total pembayaran belanjaan
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  // Validasi data input pemesan tamu sebelum masuk ke pembayaran
  const handleCheckoutClick = () => {
    setFormError(null);

    if (!isAuthenticated && checkoutMode === "guest") {
      if (!guestName.trim()) return setFormError("Nama lengkap pemesan wajib diisi.");
      if (!guestPhone.trim()) return setFormError("Nomor WhatsApp wajib diisi.");
      if (!/^[0-9+]{8,15}$/.test(guestPhone.replace(/\s+/g, ""))) {
        return setFormError("Nomor WhatsApp tidak valid. Gunakan angka.");
      }
    }

    setShowPaymentSimulation(true);
  };

  // Mengirimkan data pesanan belanja ke server
  const executeCheckout = async (initialStatus: "PENDING" | "PROCESSING") => {
    setIsSubmitting(true);
    try {
      const typeLabel = orderType === "dine_in" ? "DINE IN" : "TAKE AWAY";
      const activePhone = isAuthenticated ? (user?.phone || "") : guestPhone;
      const phoneTag = activePhone ? `[HP: ${activePhone}] ` : "";
      const finalNote = `[${typeLabel}] ${phoneTag}${orderNote}`.trim();
      const apiOrderType = orderType === "dine_in" ? "DINE_IN" : "TAKE_AWAY";

      const guestData = isAuthenticated ? undefined : { name: guestName, phone: guestPhone };
      const success = await checkout(guestData, finalNote, initialStatus, apiOrderType, paymentMethod);
      
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

  // Dialihkan ke menu utama jika keranjang kosong
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
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Checkout Pesanan</h1>
              <p className="text-stone-500 text-xs">Lengkapi detail pengisian data pemesanan di bawah ini.</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 text-stone-650 rounded-xl text-xs font-bold hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Menu
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              {formError && (
                <Alert variant="destructive" className="animate-shake">
                  <ShieldAlert className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <AlertTitle>Terjadi Kesalahan</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </div>
                </Alert>
              )}

              <CheckoutPenyajian
                orderType={orderType}
                setOrderType={setOrderType}
              />

              <CheckoutInfoForm
                isAuthenticated={isAuthenticated}
                user={user}
                checkoutMode={checkoutMode}
                setCheckoutMode={setCheckoutMode}
                guestName={guestName}
                setGuestName={setGuestName}
                guestPhone={guestPhone}
                setGuestPhone={setGuestPhone}
              />

              <CheckoutNotesAndPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                orderNote={orderNote}
                setOrderNote={setOrderNote}
                isAuthenticated={isAuthenticated}
                checkoutMode={checkoutMode}
              />

            </div>

            <div className="space-y-6 lg:col-span-1">
              
              <CheckoutSummaryCard
                cart={cart}
                subtotal={subtotal}
                serviceFee={serviceFee}
                total={total}
                isSubmitting={isSubmitting}
                isAuthenticated={isAuthenticated}
                checkoutMode={checkoutMode}
                handleCheckoutClick={handleCheckoutClick}
              />

            </div>

          </div>

        </div>
      </main>

      <CheckoutPaymentModal
        showPaymentSimulation={showPaymentSimulation}
        setShowPaymentSimulation={setShowPaymentSimulation}
        paymentMethod={paymentMethod}
        total={total}
        isSubmitting={isSubmitting}
        executeCheckout={executeCheckout}
      />

      <CustomerFooter />
      <BottomNav />
    </div>
  );
}
