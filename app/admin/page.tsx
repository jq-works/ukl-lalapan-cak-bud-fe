"use client";

import React, { useState, useEffect } from "react";
import { menuService } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import { useAdminOrders, STATUS_CONFIG } from "./layout";
import { FiTrendingUp, FiClock, FiCheckCircle } from "react-icons/fi";
import { MdOutlineFastfood } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { orders } = useAdminOrders();
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [menuCount, setMenuCount] = useState<number>(0);

  // Fetch menu count from API
  useEffect(() => {
    const fetchMenuCount = async () => {
      try {
        const res = await menuService.getMenuItems();
        const resData = res.data;
        if (resData.success !== false) {
          const items = resData.data || [];
          setMenuCount(items.length);
        }
      } catch (err) {
        console.error("Gagal mengambil jumlah menu dari API:", err);
      }
    };
    fetchMenuCount();
  }, []);

  // Dashboard Stats Calculations
  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "PENDING")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING").length;
  const completedCount = orders.filter(o => o.status === "COMPLETED").length;
  const waitingOrdersCount = orders.filter(o => o.status === "PENDING").length;
  const processingOrdersCount = orders.filter(o => o.status === "PROCESSING").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Halo, {user?.name || "Admin"}! 👋</h2>
        <p className="text-stone-500 text-sm mt-1">Berikut adalah ringkasan performa Warung Lalapan Cak Bud hari ini.</p>
      </div>

      {/* Stats Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4 relative z-10">
            <FiTrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-bold text-stone-900">Rp {totalRevenue.toLocaleString("id-ID")}</h4>
          <p className="text-sm text-stone-500 font-medium mt-1">Total Pendapatan Harian</p>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold inline-block mt-3 border border-emerald-100">
            +12.5% vs Kemarin
          </span>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 relative z-10">
            <FiClock className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-bold text-stone-900">{pendingCount} Pesanan</h4>
          <p className="text-sm text-stone-500 font-medium mt-1">Perlu Diproses</p>
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold inline-block mt-3 border border-amber-100">
            Perlu Tindakan
          </span>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50/50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4 relative z-10">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-bold text-stone-900">{completedCount} Pesanan</h4>
          <p className="text-sm text-stone-500 font-medium mt-1">Pesanan Selesai</p>
          <span className="text-[11px] text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full font-semibold inline-block mt-3 border border-primary-100">
            Selesai Disajikan
          </span>
        </div>

        {/* Total Menu */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center mb-4 relative z-10">
            <MdOutlineFastfood className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-bold text-stone-900">{menuCount} Menu</h4>
          <p className="text-sm text-stone-500 font-medium mt-1">Menu Terdaftar di Database</p>
          <span className="text-[11px] text-[#2d7a3e] bg-emerald-50 px-2.5 py-1 rounded-full font-semibold inline-block mt-3 border border-emerald-100">
            Aktif & Tersedia
          </span>
        </div>
      </div>

      {/* Quick Actions & Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Overview */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">Antrean Pesanan Masuk</h3>
            <button 
              onClick={() => router.push("/admin/orders")}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>
          
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">#{order.id}</span>
                    <span className="text-stone-700 font-semibold">{order.customerName}</span>
                    <span className={`text-[9px] font-semibold px-2 py-0.25 rounded-md border ${
                      order.orderType === "DINE_IN" 
                        ? "bg-purple-50 text-purple-700 border-purple-100" 
                        : "bg-orange-55/10 text-orange-700 border-orange-100"
                    }`}>
                      {order.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
                    </span>
                  </div>
                  <p className="text-stone-550 truncate max-w-[200px] sm:max-w-sm">
                    {order.items}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_CONFIG[order.status].bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[order.status].dot}`} />
                    {STATUS_CONFIG[order.status].label}
                  </span>
                  <span className="font-semibold text-stone-850">Rp {order.total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action: Kelola Pesanan */}
        <div className="bg-gradient-to-br from-stone-850 via-stone-900 to-stone-950 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-stone-950/20 min-h-[260px]">
          {/* Radial Glow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(58,158,82,0.15),transparent_60%)] pointer-events-none" />
          
          {/* Dot Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />

          <div className="relative z-10">
            <span className="text-[10px] text-primary-450 font-bold uppercase tracking-wider bg-primary-950/60 border border-primary-800/40 px-2.5 py-0.5 rounded-full inline-block mb-3">
              Aksi Cepat
            </span>
            <h3 className="font-bold text-lg text-white">Kelola Pesanan</h3>
            <p className="text-stone-400 text-xs mt-1">Pantau dan ubah status pesanan pelanggan secara langsung.</p>
          </div>

          <div className="my-5 grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">Menunggu</span>
              <span className="block text-xl font-extrabold text-white mt-1">{waitingOrdersCount}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-wider">Diproses</span>
              <span className="block text-xl font-extrabold text-white mt-1">{processingOrdersCount}</span>
            </div>
          </div>

          <button 
            onClick={() => router.push("/admin/orders")}
            className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs transition-all duration-200 active:scale-95 cursor-pointer relative z-10 shadow-md shadow-green-900/30 flex items-center justify-center gap-1.5"
          >
            <span>Buka Dashboard Pesanan</span>
          </button>
        </div>
      </div>

      {/* Info Message Dialog */}
      <AlertDialog open={!!infoMessage} onOpenChange={(open) => { if (!open) setInfoMessage(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Informasi</AlertDialogTitle>
            <AlertDialogDescription>
              {infoMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setInfoMessage(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
