"use client";

import React, { useState, useEffect } from "react";
import { useAdminOrders, STATUS_CONFIG, Order } from "../layout";
import { FiSearch, FiGrid, FiList, FiRefreshCw } from "react-icons/fi";
import { OrderTableList } from "@/components/admin/OrderTableList";
import { OrderCardGrid } from "@/components/admin/OrderCardGrid";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder, fetchOrders } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleRefresh = async () => {
    if (!fetchOrders) return;
    setIsRefreshing(true);
    try {
      await fetchOrders();
    } catch (err) {
      console.error("Gagal memperbarui pesanan:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = (id: string, newStatus: Order["status"]) => {
    updateOrderStatus(id, newStatus);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.items.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL"
      ? true
      : statusFilter === "ACTIVE" 
        ? (o.status === "PENDING" || o.status === "PROCESSING") 
        : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const isActive = (status: Order["status"]) => status === "PENDING" || status === "PROCESSING";
    const aActive = isActive(a.status);
    const bActive = isActive(b.status);

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateA - dateB;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Kelola Pesanan</h2>
          <p className="text-stone-500 text-sm mt-1">Ubah status pesanan, cari detail, atau batalkan pesanan pelanggan.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95 border border-stone-200/50"
            title="Refresh Data Pesanan"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Memperbarui..." : "Refresh Data"}</span>
          </button>

          <div className="flex bg-stone-100 rounded-xl p-1 gap-1 items-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "grid" ? "bg-primary-500 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <FiGrid className="w-3.5 h-3.5" />
              Grid Kartu
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "table" ? "bg-primary-500 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <FiList className="w-3.5 h-3.5" />
              Tabel List
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full lg:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari ID, pelanggan, atau menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
          {["ALL", "ACTIVE", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                statusFilter === status
                  ? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-green-200"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-900 border-stone-100"
              }`}
            >
              {status === "ALL" ? "Semua Pesanan" : status === "ACTIVE" ? "Antrean Aktif" : STATUS_CONFIG[status as Order["status"]].label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "table" ? (
        <OrderTableList
          paginatedOrders={paginatedOrders}
          handleUpdateStatus={handleUpdateStatus}
          deleteOrder={deleteOrder}
          setEditingOrder={setEditingOrder}
        />
      ) : (
        <OrderCardGrid
          paginatedOrders={paginatedOrders}
          handleUpdateStatus={handleUpdateStatus}
          deleteOrder={deleteOrder}
          setEditingOrder={setEditingOrder}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stone-150 pt-5 mt-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-sm animate-fade-in select-none">
          <button
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
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  currentPage === page ? "bg-primary-500 border-primary-500 text-white shadow-sm" : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5"
          >
            Selanjutnya &rarr;
          </button>
        </div>
      )}

      <OrderDetailDialog
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        handleUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
