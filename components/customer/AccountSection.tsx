"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Award, ShieldAlert, LogOut, ChevronRight, Gift, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function AccountSection() {
  const { user, isAuthenticated, logout } = useAuth();
  const { setActiveTab } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setActiveTab("home");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6 max-w-md mx-auto py-8 px-4 text-center">
        {/* Lock / Log In Prompt Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-primary-100/60 border border-primary-200/50 flex items-center justify-center text-primary-600 animate-pulse mb-6">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-stone-900">Gabung Sebagai Member!</h2>
          <p className="text-stone-500 text-xs leading-relaxed max-w-sm mx-auto">
            Nikmati kemudahan melacak pesanan aktif, kumpulkan Cak Bud Poin untuk promo gratis, dan lakukan checkout instan tanpa mengisi ulang data.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          {/* CTA: Go to login page */}
          <button
            onClick={() => router.push("/login")}
            className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-md shadow-green-200/60 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Masuk ke Akun Anda
          </button>
          
          {/* Link to register page */}
          <p className="text-xs text-stone-400">
            Belum punya akun?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-primary-500 font-bold hover:underline cursor-pointer"
            >
              Daftar Member Baru
            </button>
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 pt-8 border-t border-stone-150">
          <div className="p-3 bg-white border border-stone-100 rounded-xl text-left space-y-1">
            <Gift className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-bold text-stone-800">Cak Bud Poin</p>
            <p className="text-[10px] text-stone-400 font-medium">Tukarkan dengan produk gratis.</p>
          </div>
          <div className="p-3 bg-white border border-stone-100 rounded-xl text-left space-y-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-bold text-stone-800">Simpan Alamat</p>
            <p className="text-[10px] text-stone-400 font-medium">Pengiriman pesanan jadi lebih cepat.</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine loyalty level based on name length or mock rule
  const isPlatinum = user.name.length > 5;

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-stone-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-250">
        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-700 border border-primary-500/20 flex-shrink-0 select-none font-bold text-xl">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-stone-900 leading-tight">
            {user.name}
          </h3>
          <p className="text-xs text-stone-400 font-medium leading-none">
            {user.email} {user.phone && `· ${user.phone}`}
          </p>
          <div className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-750 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1.5 border border-primary-500/10">
            <Award className="w-3 h-3 fill-current text-primary-600" />
            <span>Member {isPlatinum ? "Platinum" : "Silver"}</span>
          </div>
        </div>
      </div>

      {/* Points & Loyalty Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Points Card */}
        <div className="bg-white border border-stone-150 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Cak Bud Poin</p>
            <p className="text-sm font-extrabold text-stone-800">{isPlatinum ? "1,240 Poin" : "350 Poin"}</p>
          </div>
        </div>
        
        {/* Address Counter */}
        <div className="bg-white border border-stone-150 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Alamat Saya</p>
            <p className="text-sm font-extrabold text-stone-800">2 Lokasi</p>
          </div>
        </div>
      </div>

      {/* Settings Options List */}
      <div className="bg-white border border-stone-150 rounded-2xl overflow-hidden shadow-sm">
        {/* Option 1: Saved Addresses */}
        <div 
          onClick={() => alert("Fitur Alamat Tersimpan akan segera hadir.")}
          className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-xs font-bold text-stone-800">Alamat Tersimpan</p>
              <p className="text-[11px] text-stone-400 font-medium">Atur lokasi kos, kantor, dan rumah</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Option 2: Help Center */}
        <div 
          onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
          className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-xs font-bold text-stone-800">Pusat Bantuan</p>
              <p className="text-[11px] text-stone-400 font-medium">Hubungi CS Lalapan Cak Bud jika ada kendala</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Option 3: Logout Action */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-bold">Keluar Akun</span>
        </div>
      </div>

      {/* App Version Info */}
      <div className="text-center py-2">
        <p className="text-[10px] text-stone-400 font-medium">
          Lalapan Cak Bud App v1.1.0 (Next.js 16)
        </p>
      </div>
    </div>
  );
}
