"use client";

import React from "react";
import { User, MapPin, Award, ShieldAlert, LogOut, ChevronRight, Gift } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function AccountSection() {
  const { setActiveTab } = useCart();

  const handleLogout = () => {
    alert("Simulasi Log Out Berhasil. Menghapus sesi masuk...");
    setActiveTab("home");
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-stone-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-250">
        <div className="w-16 h-16 rounded-full bg-[#2d7a3e]/10 flex items-center justify-center text-[#2d7a3e] border border-[#2d7a3e]/20 flex-shrink-0 select-none">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-stone-900 leading-tight">
            Dzaky Ramadhan
          </h3>
          <p className="text-xs text-stone-400 font-medium">
            dzaky.ramadhan@example.com · +62 812-3456-7890
          </p>
          <div className="inline-flex items-center gap-1 bg-[#2d7a3e]/10 text-[#2d7a3e] px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Award className="w-3 h-3 fill-current" />
            <span>Member Platinum</span>
          </div>
        </div>
      </div>

      {/* Points & Loyalty Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Points Card */}
        <div className="bg-white border border-stone-150 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Cak Bud Poin</p>
            <p className="text-sm font-extrabold text-stone-800">1,240 Poin</p>
          </div>
        </div>
        
        {/* Address Counter */}
        <div className="bg-white border border-stone-150 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
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
        <div className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-xs font-bold text-stone-800">Alamat Tersimpan</p>
              <p className="text-[11px] text-stone-400">Atur lokasi kos, kantor, dan rumah</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Option 2: Help Center */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-xs font-bold text-stone-800">Pusat Bantuan</p>
              <p className="text-[11px] text-stone-400">Hubungi CS Lalapan Cak Bud jika ada kendala</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Option 3: Logout Action */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-500 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-bold">Keluar Akun</span>
        </div>
      </div>

      {/* App Version Info */}
      <div className="text-center py-2">
        <p className="text-[10px] text-stone-400 font-medium">
          Lalapan Cak Bud App v1.0.4 (Next.js 16)
        </p>
      </div>
    </div>
  );
}
