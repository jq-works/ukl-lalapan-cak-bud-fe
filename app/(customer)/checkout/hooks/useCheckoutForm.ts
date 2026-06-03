"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Hook kustom untuk memisahkan logika formulir, validasi, dan pengiriman checkout dari UI page.tsx.
export function useCheckoutForm() {
  const { cart, checkout } = useCart();
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk data formulir checkout
  const [checkoutMode, setCheckoutMode] = useState<"member" | "guest">("member");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // State untuk opsi penyajian dan metode pembayaran
  const [orderType, setOrderType] = useState<"dine_in" | "take_away">("take_away");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "transfer">("qris");
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);

  // Efek samping untuk menentukan mode checkout berdasarkan status autentikasi pelanggan
  useEffect(() => {
    if (isAuthenticated) {
      setCheckoutMode("member");
    } else {
      setCheckoutMode("guest");
    }
  }, [isAuthenticated]);

  // Penghitungan rincian biaya belanja
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  // Memvalidasi data input pelanggan (khusus guest) sebelum memunculkan modal pembayaran
  const handleCheckoutClick = () => {
    setFormError(null);

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

  // Menjalankan proses pengiriman pesanan (checkout) ke server melalui store
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

  return {
    cart,
    isAuthenticated,
    user,
    isLoading,
    isSubmitting,
    checkoutMode,
    setCheckoutMode,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    orderNote,
    setOrderNote,
    formError,
    setFormError,
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    showPaymentSimulation,
    setShowPaymentSimulation,
    subtotal,
    serviceFee,
    total,
    handleCheckoutClick,
    executeCheckout,
    router,
  };
}
