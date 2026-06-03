"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  FiSearch, FiDollarSign, FiTrendingUp, FiCreditCard, 
  FiGrid, FiList, FiRefreshCw, FiCalendar, FiUser, 
  FiCheckCircle, FiActivity, FiXCircle
} from "react-icons/fi";

interface PaymentOrder {
  id: string;
  totalPrice: number;
  status: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
  createdAt: string;
  guestName?: string | null;
  guestPhone?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  orderId: string;
  order?: PaymentOrder;
}

export default function AdminFinancePage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("PAID");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchPayments = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const response = await api.get("/payments");
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal mengambil data keuangan");
      }
      setPayments(resData.data || []);
      setError(null);
    } catch (err: any) {
      console.error("Gagal memuat data keuangan admin:", err);
      setError(err.response?.data?.message || err.message || "Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial Fetch & Poll every 15 seconds
  useEffect(() => {
    fetchPayments();
    const interval = setInterval(() => fetchPayments(true), 15000);
    return () => clearInterval(interval);
  }, []);

  // Reset pagination to page 1 on filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, methodFilter, statusFilter]);

  // Compute calculated metrics
  const paidPayments = payments.filter(p => p.status === "PAID");
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = paidPayments.length;
  const averageOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Compute order type metrics
  const dineInRevenue = paidPayments.filter(p => p.order?.orderType === "DINE_IN").reduce((sum, p) => sum + p.amount, 0);
  const takeAwayRevenue = paidPayments.filter(p => p.order?.orderType === "TAKE_AWAY").reduce((sum, p) => sum + p.amount, 0);
  const dineInPercent = totalRevenue > 0 ? Math.round((dineInRevenue / totalRevenue) * 100) : 0;
  const takeAwayPercent = totalRevenue > 0 ? Math.round((takeAwayRevenue / totalRevenue) * 100) : 0;

  // Compute payment method counts
  const methodCounts = paidPayments.reduce((acc, p) => {
    const m = p.method || "UNKNOWN";
    acc[m] = (acc[m] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  // Filtered payments list
  const filteredPayments = payments.filter(p => {
    // Search filter
    const custName = p.order?.user?.name || p.order?.guestName || "Tamu";
    const matchesSearch = 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase());

    // Method filter
    const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;

    // Status filter
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Paginated payments list
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper to format dates
  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("id-ID", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-stone-850">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Kelola Keuangan</h2>
          <p className="text-stone-500 text-sm mt-1">Pantau total omzet penjualan, metode pembayaran terpopuler, dan laporan kasir secara langsung.</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => fetchPayments(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95 border border-stone-200/50"
            title="Refresh Data Keuangan"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Memperbarui..." : "Refresh Data"}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-stone-150/60 rounded-xl p-1 gap-1 items-center border border-stone-200/35">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "table" 
                  ? "bg-primary-500 text-white shadow-sm" 
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <FiList className="w-3.5 h-3.5" />
              Tabel
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "grid" 
                  ? "bg-primary-500 text-white shadow-sm" 
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <FiGrid className="w-3.5 h-3.5" />
              Grid
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-stone-100 rounded-3xl p-16 flex flex-col items-center justify-center gap-3 shadow-xs">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-500">Memuat laporan keuangan...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-stone-100 rounded-3xl p-12 text-center shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <FiXCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Gagal Mengambil Data</h3>
            <p className="text-stone-550 text-xs mt-1 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => fetchPayments(true)}
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-md shadow-green-200/50"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. TOTAL REVENUE */}
            <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-xs flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 w-24 h-24 bg-primary-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-105" />
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                <FiDollarSign className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Pendapatan</p>
                <p className="text-xl font-black text-stone-900">Rp {totalRevenue.toLocaleString("id-ID")}</p>
                <p className="text-[9px] text-stone-400 font-semibold leading-none pt-0.5">Dari transaksi berhasil</p>
              </div>
            </div>

            {/* 2. TOTAL VOLUME */}
            <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-xs flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-105" />
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <FiTrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Volume Penjualan</p>
                <p className="text-xl font-black text-stone-900">{totalTransactions} Transaksi</p>
                <p className="text-[9px] text-stone-400 font-semibold leading-none pt-0.5">Berstatus PAID (Lunas)</p>
              </div>
            </div>

            {/* 3. AVERAGE ORDER VALUE */}
            <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-xs flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-105" />
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-750">
                <FiCreditCard className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Rata-rata Transaksi</p>
                <p className="text-xl font-black text-stone-900">Rp {averageOrderValue.toLocaleString("id-ID")}</p>
                <p className="text-[9px] text-stone-400 font-semibold leading-none pt-0.5">Per-pembayaran berhasil</p>
              </div>
            </div>
          </div>

          {/* Graphical Analytics & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Payment Methods Distribution */}
            <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">Breakdown Metode Pembayaran</h3>
                <p className="text-stone-500 text-[11px] mt-0.5">Distribusi omzet berdasarkan jenis layanan pembayaran.</p>
              </div>

              <div className="space-y-3.5 pt-2">
                {Object.keys(methodCounts).length > 0 ? (
                  Object.entries(methodCounts).map(([method, amount]) => {
                    const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                    return (
                      <div key={method} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-stone-700">
                          <span className="uppercase">{method}</span>
                          <span>Rp {amount.toLocaleString("id-ID")} ({percent}%)</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-stone-400 text-xs font-semibold uppercase tracking-wider select-none">
                    Belum ada data pembayaran metode.
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: Dine In vs Take Away Revenue */}
            <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">Distribusi Jenis Pesanan</h3>
                <p className="text-stone-500 text-[11px] mt-0.5">Proporsi pemasukan dari Dine In vs Take Away.</p>
              </div>

              <div className="space-y-6 pt-2">
                {/* Dine In Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-700 flex items-center gap-1.5">🍽️ Makan Di Tempat (Dine In)</span>
                    <span className="font-extrabold text-purple-700">Rp {dineInRevenue.toLocaleString("id-ID")} ({dineInPercent}%)</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${dineInPercent}%` }}
                    />
                  </div>
                </div>

                {/* Take Away Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-700 flex items-center gap-1.5">🥡 Bawa Pulang (Take Away)</span>
                    <span className="font-extrabold text-orange-700">Rp {takeAwayRevenue.toLocaleString("id-ID")} ({takeAwayPercent}%)</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                      style={{ width: `${takeAwayPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtering Section */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xs">
            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari Pembayaran ID, Pesanan ID, atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Methods & Status Filter selectors */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Method Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase select-none">Metode:</span>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="h-10 px-3 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="ALL">Semua Metode</option>
                  <option value="QRIS">QRIS</option>
                  <option value="BANK_BCA">BANK BCA</option>
                  <option value="CASH">CASH</option>
                  <option value="DUMMY">DUMMY</option>
                </select>
              </div>

              {/* Status Selector Chips */}
              <div className="flex items-center gap-1.5 bg-stone-50 p-1 border border-stone-100 rounded-xl">
                {[
                  { key: "ALL", label: "Semua Status" },
                  { key: "PAID", label: "Lunas" },
                  { key: "PENDING", label: "Menunggu" }
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStatusFilter(s.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === s.key
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main payment list view */}
          {filteredPayments.length > 0 ? (
            viewMode === "table" ? (
              /* 1. TABLE LIST VIEW */
              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 border-b border-stone-100 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4.5 px-6 w-32">ID Pembayaran</th>
                        <th className="py-4.5 px-6 w-32">ID Pesanan</th>
                        <th className="py-4.5 px-6">Pelanggan</th>
                        <th className="py-4.5 px-6 w-32">Jenis Order</th>
                        <th className="py-4.5 px-6 w-36">Waktu / Tanggal</th>
                        <th className="py-4.5 px-6 w-32">Metode</th>
                        <th className="py-4.5 px-6 w-32">Total Harga</th>
                        <th className="py-4.5 px-6 w-32">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs">
                      {paginatedPayments.map((p) => {
                        const isDineIn = p.order?.orderType === "DINE_IN";
                        const custName = p.order?.user?.name || p.order?.guestName || "Tamu";
                        const custEmail = p.order?.user?.email || p.order?.guestPhone || "Tanpa akun";
                        
                        return (
                          <tr key={p.id} className="hover:bg-stone-50/40 transition-colors">
                            {/* Payment ID shortened */}
                            <td className="py-4.5 px-6 font-mono font-bold text-stone-900">
                              #{p.id.slice(0, 8)}...
                            </td>

                            {/* Order ID shortened */}
                            <td className="py-4.5 px-6 font-mono text-stone-500">
                              #{p.orderId.slice(0, 8)}...
                            </td>

                            {/* Customer Profile info */}
                            <td className="py-4.5 px-6">
                              <p className="font-bold text-stone-850">{custName}</p>
                              <p className="text-[10px] text-stone-400 font-medium">{custEmail}</p>
                            </td>

                            {/* Order Type Badge */}
                            <td className="py-4.5 px-6">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border leading-none ${
                                isDineIn
                                  ? "bg-purple-50 text-purple-700 border-purple-100"
                                  : "bg-orange-50 text-orange-700 border-orange-100"
                              }`}>
                                {isDineIn ? "🍽️ Dine In" : "🥡 Take Away"}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-4.5 px-6 text-stone-550 font-semibold">
                              {formatDateTime(p.createdAt)}
                            </td>

                            {/* Payment Method */}
                            <td className="py-4.5 px-6 font-bold text-stone-600">
                              <span className="bg-stone-100 px-2 py-1 rounded-md text-[10px] tracking-wide uppercase font-extrabold border border-stone-200">
                                {p.method}
                              </span>
                            </td>

                            {/* Paid Amount */}
                            <td className="py-4.5 px-6 font-bold text-stone-900 text-sm">
                              Rp {p.amount.toLocaleString("id-ID")}
                            </td>

                            {/* Status Badge */}
                            <td className="py-4.5 px-6">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border leading-none ${
                                p.status === "PAID"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                  : "bg-amber-50 text-amber-700 border-amber-250"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${p.status === "PAID" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                {p.status === "PAID" ? "Lunas" : "Menunggu"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* 2. GRID CARDS VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedPayments.map((p) => {
                  const isDineIn = p.order?.orderType === "DINE_IN";
                  const custName = p.order?.user?.name || p.order?.guestName || "Tamu";
                  
                  return (
                    <div 
                      key={p.id} 
                      className="bg-white border border-stone-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow group"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-stone-400 font-bold uppercase leading-none">Pembayaran ID</p>
                          <p className="text-xs font-mono font-bold text-stone-950 mt-0.5">#{p.id.slice(0, 8)}...</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border leading-none ${
                          p.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                            : "bg-amber-50 text-amber-700 border-amber-250"
                        }`}>
                          {p.status === "PAID" ? "Lunas" : "Menunggu"}
                        </span>
                      </div>

                      {/* Card Info details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold">Pelanggan:</span>
                          <span className="font-bold text-stone-850">{custName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold">Tipe:</span>
                          <span className={`font-bold ${isDineIn ? "text-purple-700" : "text-orange-700"}`}>
                            {isDineIn ? "🍽️ Dine In" : "🥡 Take Away"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold">Metode:</span>
                          <span className="font-bold text-stone-600 uppercase">{p.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold">Tanggal:</span>
                          <span className="font-medium text-stone-600">{formatDateTime(p.createdAt)}</span>
                        </div>
                      </div>

                      {/* Card Footer Price */}
                      <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
                        <span className="text-[9px] text-stone-400 font-bold uppercase leading-none">Total Bayar</span>
                        <span className="font-black text-stone-900 text-sm">Rp {p.amount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="py-16 bg-white border border-stone-200 rounded-3xl text-center text-stone-400 font-bold uppercase tracking-wider text-xs shadow-xs">
              Tidak ada data pembayaran ditemukan.
            </div>
          )}

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-150 pt-5 mt-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-xs animate-fade-in select-none">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5"
              >
                &larr; Sebelumnya
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                        : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5"
              >
                Selanjutnya &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
