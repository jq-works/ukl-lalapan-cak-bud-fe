"use client";

import React, { useState, useEffect } from "react";
import { paymentService } from "@/lib/services";
import { Payment } from "@/components/admin/FinanceTable";

// Hook kustom untuk memisahkan logika halaman keuangan admin
export function useAdminFinance() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pencarian & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("PAID");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Halaman Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mengambil laporan data pembayaran kasir
  const fetchPayments = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const response = await paymentService.getPayments();
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

  // Pemuatan data awal dan jajak pendapat (polling) setiap 15 detik
  useEffect(() => {
    fetchPayments();
    const interval = setInterval(() => fetchPayments(true), 15000);
    return () => clearInterval(interval);
  }, []);

  // Reset pagination ke awal jika pencarian/filter diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, methodFilter, statusFilter]);

  // Penghitungan Metrik Keuangan
  const paidPayments = payments.filter(p => p.status === "PAID");
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = paidPayments.length;
  const averageOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Persentase Tipe Pesanan
  const dineInRevenue = paidPayments.filter(p => p.order?.orderType === "DINE_IN").reduce((sum, p) => sum + p.amount, 0);
  const takeAwayRevenue = paidPayments.filter(p => p.order?.orderType === "TAKE_AWAY").reduce((sum, p) => sum + p.amount, 0);
  const dineInPercent = totalRevenue > 0 ? Math.round((dineInRevenue / totalRevenue) * 100) : 0;
  const takeAwayPercent = totalRevenue > 0 ? Math.round((takeAwayRevenue / totalRevenue) * 100) : 0;

  // Pengelompokan Jumlah Berdasarkan Metode
  const methodCounts = paidPayments.reduce((acc, p) => {
    const m = p.method || "UNKNOWN";
    acc[m] = (acc[m] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  // Memfilter pembayaran berdasarkan keyword pencarian, status, dan metode
  const filteredPayments = payments.filter(p => {
    const custName = p.order?.user?.name || p.order?.guestName || "Tamu";
    const matchesSearch = 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper pemformat tanggal/waktu
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

  return {
    payments,
    isLoading,
    error,
    isRefreshing,
    searchQuery,
    setSearchQuery,
    methodFilter,
    setMethodFilter,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    fetchPayments,
    totalRevenue,
    totalTransactions,
    averageOrderValue,
    dineInRevenue,
    takeAwayRevenue,
    dineInPercent,
    takeAwayPercent,
    methodCounts,
    totalPages,
    paginatedPayments,
    formatDateTime,
  };
}
