"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  FiHome, FiClipboard, FiShoppingBag, FiUsers, FiSettings, 
  FiLogOut, FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle,
  FiSearch, FiFilter, FiEdit, FiTrash2, FiCalendar, FiUser
} from "react-icons/fi";
import { MdOutlineFoodBank, MdOutlineFastfood } from "react-icons/md";

// Mock initial orders for dashboard
interface Order {
  id: string;
  customerName: string;
  items: string;
  total: number;
  status: "PENDING" | "PAID" | "PROCESSING" | "READY" | "COMPLETED" | "CANCELLED";
  date: string;
  phone: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: "CB-0931", customerName: "Dzaky", items: "Lalapan Ayam Goreng x2, Es Teh Manis x2", total: 46000, status: "PENDING", date: "2026-06-01 16:45", phone: "08234372348" },
  { id: "CB-0930", customerName: "Budi Santoso", items: "Lalapan Bebek Bakar x1, Jeruk Hangat x1", total: 35000, status: "PAID", date: "2026-06-01 16:20", phone: "081234567890" },
  { id: "CB-0929", customerName: "Fahry Admin", items: "Lalapan Nila Goreng x2, Jus Alpukat x2", total: 64000, status: "PROCESSING", date: "2026-06-01 15:10", phone: "08122334455" },
  { id: "CB-0928", customerName: "Siti Rahma", items: "Lalapan Ayam Bakar x3, Es Jeruk x3", total: 78000, status: "READY", date: "2026-06-01 14:05", phone: "08987654321" },
  { id: "CB-0927", customerName: "Andi Wijaya", items: "Lalapan Lele Goreng x2, Es Teh x2", total: 36000, status: "COMPLETED", date: "2026-06-01 12:30", phone: "085544332211" },
  { id: "CB-0926", customerName: "Dewi Lestari", items: "Lalapan Bebek Goreng x1, Es Campur x1", total: 38000, status: "CANCELLED", date: "2026-06-01 11:15", phone: "08776655443" },
];

const STATUS_CONFIG = {
  PENDING:    { label: "Menunggu",    bg: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  PAID:       { label: "Lunas",       bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  PROCESSING: { label: "Diproses",    bg: "bg-blue-50 text-blue-700 border-blue-200",    dot: "bg-blue-500" },
  READY:      { label: "Siap Ambil",  bg: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  COMPLETED:  { label: "Selesai",     bg: "bg-stone-100 text-stone-600 border-stone-200",    dot: "bg-stone-400" },
  CANCELLED:  { label: "Dibatalkan",  bg: "bg-red-50 text-red-600 border-red-200",     dot: "bg-red-400" },
};

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Secure route: check auth status
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "ADMIN") {
        // Not authorized as Admin
        router.push("/");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Memeriksa hak akses admin...</p>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "PENDING")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === "PENDING" || o.status === "PAID" || o.status === "PROCESSING").length;
  const readyCount = orders.filter(o => o.status === "READY").length;
  const completedCount = orders.filter(o => o.status === "COMPLETED").length;

  const handleUpdateStatus = (id: string, newStatus: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pesanan ${id}?`)) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.items.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      
      {/* 1. Left Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-stone-200 flex flex-col justify-between z-20">
        <div>
          {/* Logo Area */}
          <div className="h-16 border-b border-stone-200 flex items-center px-6 gap-3">
            <span className="text-2xl">🍃</span>
            <div>
              <h1 className="font-extrabold text-stone-900 text-sm leading-none">Cak Bud Admin</h1>
              <span className="text-[10px] text-primary-500 font-semibold uppercase tracking-wider">Dashboard Panel</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === "dashboard"
                  ? "bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium"
              }`}
            >
              <FiHome className="w-4 h-4" />
              Dasbor Utama
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === "orders"
                  ? "bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium"
              }`}
            >
              <FiClipboard className="w-4 h-4" />
              Kelola Pesanan
              {pendingCount > 0 && (
                <span className="ml-auto bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => alert("Fitur Kelola Menu Makanan tersedia di tahap pengembangan berikutnya.")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium transition-all"
            >
              <FiShoppingBag className="w-4 h-4" />
              Kelola Menu
            </button>
            <button
              onClick={() => alert("Fitur Data Pelanggan tersedia di tahap pengembangan berikutnya.")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium transition-all"
            >
              <FiUsers className="w-4 h-4" />
              Pelanggan
            </button>
            <button
              onClick={() => alert("Pengaturan sistem tersedia di tahap pengembangan berikutnya.")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium transition-all"
            >
              <FiSettings className="w-4 h-4" />
              Pengaturan
            </button>
          </nav>
        </div>

        {/* User Profile Info & Logout */}
        <div className="p-4 border-t border-stone-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-stone-850 text-xs leading-none">{user.name}</p>
              <p className="text-[10px] text-stone-400 mt-1">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* 2. Right Workspace */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Admin Panel</span>
            <span className="text-stone-300 text-xs">/</span>
            <span className="text-xs text-stone-800 font-bold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs text-stone-500 hidden sm:block">
              <span className="font-semibold">{new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <span className="h-8 w-[1px] bg-stone-200" />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 border border-primary-200">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {/* Main Work Area */}
        <main className="flex-1 p-8">
          {activeTab === "dashboard" ? (
            <div className="space-y-8 animate-fade-in">
              
              {/* Heading */}
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900">Halo, {user.name}! 👋</h2>
                <p className="text-stone-500 text-sm mt-1">Berikut adalah ringkasan performa Warung Lalapan Cak Bud hari ini.</p>
              </div>

              {/* Stats Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4 relative z-10">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-2xl font-black text-stone-900">Rp {totalRevenue.toLocaleString("id-ID")}</h4>
                  <p className="text-xs text-stone-500 font-semibold mt-1">Total Pendapatan Harian</p>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-block mt-3 border border-emerald-100">
                    +12.5% vs Kemarin
                  </span>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 relative z-10">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <h4 className="text-2xl font-black text-stone-900">{pendingCount} Pesanan</h4>
                  <p className="text-xs text-stone-500 font-semibold mt-1">Perlu Diproses</p>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold inline-block mt-3 border border-amber-100">
                    Sangat Sibuk
                  </span>
                </div>

                {/* Ready for Pickup */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-4 relative z-10">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-2xl font-black text-stone-900">{readyCount} Pesanan</h4>
                  <p className="text-xs text-stone-500 font-semibold mt-1">Siap Diambil Pelanggan</p>
                  <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold inline-block mt-3 border border-green-100">
                    Ambil di Kasir
                  </span>
                </div>

                {/* Popular Menu */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105" />
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4 relative z-10">
                    <MdOutlineFastfood className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-900 truncate">Lalapan Ayam Bakar</h4>
                  <p className="text-xs text-stone-500 font-semibold mt-1">Menu Terlaris Hari Ini</p>
                  <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-bold inline-block mt-3 border border-red-100">
                    Terjual 32 Porsi
                  </span>
                </div>

              </div>

              {/* Quick Actions & Recent Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Orders Overview */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-stone-900 text-base">Antrean Pesanan Masuk</h3>
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-primary-600 hover:underline cursor-pointer"
                    >
                      Lihat Semua
                    </button>
                  </div>
                  
                  <div className="divide-y divide-stone-100">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900">{order.id}</span>
                            <span className="text-stone-400 font-medium">{order.customerName}</span>
                          </div>
                          <p className="text-stone-500 truncate max-w-sm">{order.items}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[order.status].bg}`}>
                            <span className={`w-1 h-1 rounded-full ${STATUS_CONFIG[order.status].dot}`} />
                            {STATUS_CONFIG[order.status].label}
                          </span>
                          <span className="font-bold text-stone-850">Rp {order.total.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operating Control Card */}
                <div className="bg-gradient-to-br from-primary-950 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg">
                  {/* Dot texture */}
                  <div 
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px"
                    }}
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Status Operasional</h3>
                    <p className="text-white/60 text-xs mt-1">Atur jam buka/tutup warung secara real-time.</p>
                  </div>

                  <div className="my-6 space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/80 font-medium">Status Warung:</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        BUKA
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/80 font-medium">Sistem Pemesanan:</span>
                      <span className="text-xs font-bold text-white">Online (WhatsApp & Web)</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Fitur untuk menutup toko sementara dinonaktifkan.")}
                    className="w-full h-10 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer relative z-10"
                  >
                    Tutup Warung Sementara
                  </button>
                </div>

              </div>

            </div>
          ) : (
            
            // Orders Management Tab
            <div className="space-y-6 animate-fade-in">
              {/* Header section with actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-stone-900">Kelola Pesanan</h2>
                  <p className="text-stone-500 text-sm mt-1">Ubah status pesanan, cari detail, atau batalkan pesanan pelanggan.</p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search input */}
                <div className="relative w-full md:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari ID, pelanggan, atau menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Status Chips Filter */}
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                  {["ALL", "PENDING", "PAID", "PROCESSING", "READY", "COMPLETED", "CANCELLED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === status
                          ? "bg-primary-500 text-white shadow-sm shadow-green-200"
                          : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-900 border border-stone-200"
                      }`}
                    >
                      {status === "ALL" ? "Semua" : STATUS_CONFIG[status as Order["status"]].label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 border-b border-stone-200 text-xs font-bold">
                        <th className="py-4 px-6">ID Pesanan</th>
                        <th className="py-4 px-6">Pelanggan</th>
                        <th className="py-4 px-6">Rincian Menu</th>
                        <th className="py-4 px-6">Tanggal</th>
                        <th className="py-4 px-6">Total Harga</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-4 px-6 font-mono font-bold text-stone-900">{order.id}</td>
                            <td className="py-4 px-6">
                              <p className="font-bold text-stone-850">{order.customerName}</p>
                              <p className="text-[10px] text-stone-400 font-medium">{order.phone}</p>
                            </td>
                            <td className="py-4 px-6 text-stone-600 font-medium max-w-xs truncate">{order.items}</td>
                            <td className="py-4 px-6 text-stone-500 font-medium">{order.date}</td>
                            <td className="py-4 px-6 font-bold text-stone-850">Rp {order.total.toLocaleString("id-ID")}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[order.status].bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[order.status].dot}`} />
                                {STATUS_CONFIG[order.status].label}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right relative">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingOrder(order)}
                                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                                  title="Ubah Status"
                                >
                                  <FiEdit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <FiTrash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-stone-400 font-medium">
                            Tidak ada pesanan ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* 3. Modal Editor Status (Popup Form for changing order status) */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-sm">Ubah Status Pesanan {editingOrder.id}</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-stone-500 font-medium">
                Pelanggan: <span className="font-bold text-stone-900">{editingOrder.customerName}</span>
              </p>
              <p className="text-xs text-stone-500 font-medium">
                Pesanan: <span className="text-stone-850">{editingOrder.items}</span>
              </p>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">Pilih Status Baru:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["PENDING", "PAID", "PROCESSING", "READY", "COMPLETED", "CANCELLED"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(editingOrder.id, status)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        editingOrder.status === status
                          ? "bg-primary-50 border-primary-500 text-primary-700"
                          : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[status].dot}`} />
                      {STATUS_CONFIG[status].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
