"use client";

import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutNotesAndPaymentProps {
  paymentMethod: "cash" | "qris" | "transfer";
  setPaymentMethod: (method: "cash" | "qris" | "transfer") => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  isAuthenticated: boolean;
  checkoutMode: "member" | "guest";
}

export function CheckoutNotesAndPayment({
  paymentMethod,
  setPaymentMethod,
  orderNote,
  setOrderNote,
  isAuthenticated,
  checkoutMode,
}: CheckoutNotesAndPaymentProps) {
  if (!isAuthenticated && checkoutMode !== "guest") return null;

  return (
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
  );
}

interface CheckoutSummaryCardProps {
  cart: CartItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  checkoutMode: "member" | "guest";
  handleCheckoutClick: () => void;
}

export function CheckoutSummaryCard({
  cart,
  subtotal,
  serviceFee,
  total,
  isSubmitting,
  isAuthenticated,
  checkoutMode,
  handleCheckoutClick,
}: CheckoutSummaryCardProps) {
  return (
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
  );
}
