"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Phone } from "lucide-react";

interface CheckoutInfoFormProps {
  isAuthenticated: boolean;
  user: any;
  checkoutMode: "member" | "guest";
  setCheckoutMode: (mode: "member" | "guest") => void;
  guestName: string;
  setGuestName: (val: string) => void;
  guestPhone: string;
  setGuestPhone: (val: string) => void;
}

export function CheckoutInfoForm({
  isAuthenticated,
  user,
  checkoutMode,
  setCheckoutMode,
  guestName,
  setGuestName,
  guestPhone,
  setGuestPhone,
}: CheckoutInfoFormProps) {
  const router = useRouter();

  return (
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
              {user?.name?.slice(0, 2).toUpperCase() || "MB"}
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
  );
}
