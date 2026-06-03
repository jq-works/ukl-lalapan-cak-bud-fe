"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface CheckoutPaymentModalProps {
  showPaymentSimulation: boolean;
  setShowPaymentSimulation: (show: boolean) => void;
  paymentMethod: "cash" | "qris" | "transfer";
  total: number;
  isSubmitting: boolean;
  executeCheckout: (initialStatus: "PENDING" | "PROCESSING") => void;
}

export function CheckoutPaymentModal({
  showPaymentSimulation,
  setShowPaymentSimulation,
  paymentMethod,
  total,
  isSubmitting,
  executeCheckout,
}: CheckoutPaymentModalProps) {
  if (!showPaymentSimulation) return null;

  return (
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
  );
}
