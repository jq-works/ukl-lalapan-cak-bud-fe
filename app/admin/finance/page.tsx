"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  FiSearch, FiGrid, FiList, FiRefreshCw, FiXCircle
} from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinanceStatsCards } from "@/components/admin/FinanceStatsCards";
import { FinanceTable, Payment, PaymentOrder } from "@/components/admin/FinanceTable";

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
          {/* Statistics & Analytics Breakdown */}
          <FinanceStatsCards
            totalRevenue={totalRevenue}
            totalTransactions={totalTransactions}
            averageOrderValue={averageOrderValue}
            methodCounts={methodCounts}
            dineInRevenue={dineInRevenue}
            takeAwayRevenue={takeAwayRevenue}
            dineInPercent={dineInPercent}
            takeAwayPercent={takeAwayPercent}
          />

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
                <Select
                  value={methodFilter}
                  onValueChange={(val) => setMethodFilter(val)}
                >
                  <SelectTrigger 
                    className="h-10 px-3 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer flex items-center justify-between gap-1 w-[130px] text-stone-750"
                  >
                    <SelectValue placeholder="Metode" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white border border-stone-150 rounded-xl shadow-md p-1">
                    <SelectItem value="ALL" className="text-xs font-semibold text-stone-750 focus:bg-stone-50 focus:text-stone-900 rounded-lg py-2 px-3 cursor-pointer">Semua Metode</SelectItem>
                    <SelectItem value="QRIS" className="text-xs font-semibold text-stone-750 focus:bg-stone-50 focus:text-stone-900 rounded-lg py-2 px-3 cursor-pointer">QRIS</SelectItem>
                    <SelectItem value="BANK_BCA" className="text-xs font-semibold text-stone-750 focus:bg-stone-50 focus:text-stone-900 rounded-lg py-2 px-3 cursor-pointer">BANK BCA</SelectItem>
                    <SelectItem value="CASH" className="text-xs font-semibold text-stone-750 focus:bg-stone-50 focus:text-stone-900 rounded-lg py-2 px-3 cursor-pointer">CASH</SelectItem>
                    <SelectItem value="DUMMY" className="text-xs font-semibold text-stone-750 focus:bg-stone-50 focus:text-stone-900 rounded-lg py-2 px-3 cursor-pointer">DUMMY</SelectItem>
                  </SelectContent>
                </Select>
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
          <FinanceTable
            paginatedPayments={paginatedPayments}
            viewMode={viewMode}
            formatDateTime={formatDateTime}
          />

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-150 pt-5 mt-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-xs animate-fade-in select-none">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                &larr; Seb.
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
                className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                Sel. &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
