"use client";

import React, { useState } from "react";
import { useAdminOrders, STATUS_CONFIG, Order } from "../layout";
import { FiSearch, FiTrash2, FiPlay, FiCheck, FiX, FiGrid, FiList, FiEdit, FiRefreshCw, FiPrinter } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const parseItems = (itemsStr: string) => {
  return itemsStr.split(", ").map(item => {
    const match = item.match(/(.+)\s+x(\d+)$/);
    if (match) {
      return { name: match[1], quantity: parseInt(match[2], 10) };
    }
    return { name: item, quantity: 1 };
  });
};

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

  React.useEffect(() => {
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

    // Active orders always come first
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // Within same group: oldest first (first-come-first-served)
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateA - dateB;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Kelola Pesanan</h2>
          <p className="text-stone-500 text-sm mt-1">Ubah status pesanan, cari detail, atau batalkan pesanan pelanggan.</p>
        </div>

        {/* Action buttons & View Mode Toggle */}
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
                viewMode === "grid" 
                  ? "bg-primary-500 text-white shadow-sm" 
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <FiGrid className="w-3.5 h-3.5" />
              Grid Kartu
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "table" 
                  ? "bg-primary-500 text-white shadow-sm" 
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <FiList className="w-3.5 h-3.5" />
              Tabel List
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search input */}
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

        {/* Status Chips Filter */}
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

      {/* Dynamic View Mode Content */}
      {viewMode === "table" ? (
        /* 1. TABLE LIST VIEW (WIDER LAYOUT & HIGHLIGHTED MENU) */
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-stone-50 text-stone-500 border-b border-stone-100 text-xs font-bold uppercase tracking-wider">
                  <th className="py-5 px-6 w-28">ID</th>
                  <th className="py-5 px-6 w-44">Pelanggan</th>
                  <th className="py-5 px-6">Rincian Menu (Porsi)</th>
                  <th className="py-5 px-6 w-32">Tipe</th>
                  <th className="py-5 px-6 w-40">Waktu / Tanggal</th>
                  <th className="py-5 px-6 w-32">Total Harga</th>
                  <th className="py-5 px-6 w-36">Status</th>
                  <th className="py-5 px-6 text-right w-64">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Plain ID (No click detail trigger) */}
                      <td className="py-5 px-6 font-mono font-bold text-stone-900">
                        #{order.id}
                      </td>

                      {/* Customer Details */}
                      <td className="py-5 px-6">
                        <p className="font-bold text-stone-850">{order.customerName}</p>
                        <p className="text-[10px] text-stone-400 font-medium">{order.phone || "-"}</p>
                      </td>

                      {/* Highlighted Menu Badges */}
                      <td className="py-5 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {parseItems(order.items).map((item, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-800 border border-primary-100 rounded-lg text-[10px] font-bold"
                            >
                              <span className="font-semibold text-primary-600">{item.quantity}x</span>
                              <span>{item.name}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Order Type Badge */}
                      <td className="py-5 px-6">
                        {(() => {
                          const isDineIn = order.orderType === "DINE_IN";
                          return (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isDineIn
                                ? "bg-purple-50 text-purple-700 border-purple-100"
                                : "bg-orange-50 text-orange-700 border-orange-100"
                            }`}>
                              {isDineIn ? "🍽️ Dine In" : "🥡 Take Away"}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Date */}
                      <td className="py-5 px-6 text-stone-550 font-semibold">{order.date}</td>

                      {/* Total */}
                      <td className="py-5 px-6 font-bold text-stone-850">Rp {order.total.toLocaleString("id-ID")}</td>

                      {/* Status */}
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[order.status].bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[order.status].dot}`} />
                          {STATUS_CONFIG[order.status].label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-5 px-6 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "PROCESSING")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm shadow-emerald-100"
                              >
                                Terima & Masak
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                                className="px-2.5 py-1.5 bg-red-55/10 hover:bg-red-100 text-red-655 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-red-200 transition-all active:scale-95 cursor-pointer"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {order.status === "PROCESSING" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm shadow-blue-100"
                            >
                              Selesai Masak
                            </button>
                          )}
                          {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
                            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider bg-stone-100/60 border border-stone-200/50 px-2.5 py-1 rounded-lg select-none">
                              Selesai Diproses
                            </span>
                          )}

                          <span className="w-[1px] h-4 bg-stone-200 mx-1 select-none" />

                          {/* Cetak Struk */}
                          <a
                            href={`/admin/orders/${order.id}/receipt`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 transition-colors cursor-pointer"
                            title="Cetak Struk"
                          >
                            <FiPrinter className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit Status Manual */}
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 transition-colors cursor-pointer"
                            title="Ubah Status Manual"
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>

                          {/* Highlighted Delete Action */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 transition-colors cursor-pointer"
                                title="Hapus Pesanan"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Pesanan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data pesanan {order.id} dari antrean? Aksi ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteOrder(order.id)} 
                                  className="bg-red-600 hover:bg-red-700 shadow-none text-white cursor-pointer"
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
      ) : (
        /* 2. GRID KARTU VIEW (2 COLUMNS - SPACIOUS, MODAL-FREE & BUTTON-FOCUSED) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => {
              const isDineIn = order.orderType === "DINE_IN";
              const parsedItems = parseItems(order.items);
              // Extract user note (strip [DINE IN] / [TAKE AWAY] prefix)
              const cleanNote = order.note?.replace(/^\[(DINE IN|TAKE AWAY)\]\s*/i, "").trim();

              return (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
                    order.status === "PENDING" ? "border-amber-100" :
                    order.status === "PROCESSING" ? "border-blue-100" :
                    "border-stone-100"
                  }`}
                >
                  {/* Card Header (Plain ID, no click detail trigger) */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className="font-mono font-bold text-lg text-stone-900 select-none">
                        #{order.id}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border ${STATUS_CONFIG[order.status].bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[order.status].dot}`} />
                          {STATUS_CONFIG[order.status].label}
                        </span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                          isDineIn 
                            ? "bg-purple-50 text-purple-700 border-purple-100" 
                            : "bg-orange-50 text-orange-700 border-orange-100"
                        }`}>
                          {isDineIn ? "🍽️ Dine In" : "🥡 Take Away"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold bg-stone-100 px-2 py-1 rounded-md">{order.date}</span>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-3 bg-stone-50 rounded-2xl p-4 mb-5 border border-stone-100/50">
                    <div>
                      <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Pemesan</p>
                      <p className="text-xs font-semibold text-stone-850 mt-0.5">👤 {order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">No. WhatsApp</p>
                      <p className="text-xs font-semibold text-stone-850 mt-0.5">📞 {order.phone || "-"}</p>
                    </div>
                  </div>

                  {/* HIGH-LIGHTED MENU ITEMS */}
                  <div className="space-y-3 mb-6 flex-grow">
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Rincian Menu Yang Dimasak:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {parsedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-primary-50/70 px-4 py-3 rounded-2xl border border-primary-100/40">
                          <span className="text-xs font-bold text-stone-900">{item.name}</span>
                          <span className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {item.quantity}x
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Note / Catatan */}
                    {cleanNote && (
                      <div className="flex items-start gap-2 px-3 py-2 bg-amber-50/60 border border-amber-100 rounded-xl text-xs">
                        <span className="text-amber-500 mt-0.5 shrink-0">📝</span>
                        <span className="text-stone-700 font-medium">{cleanNote}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs mt-3 bg-stone-50/30 px-3 py-2 rounded-xl">
                      <span className="font-semibold text-stone-500">Total Harga Pesanan</span>
                      <span className="font-bold text-stone-950 text-sm">Rp {order.total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {/* HIGHLIGHTED PROGRESS BUTTONS (NO MODAL FOR STATUS ACTION) */}
                  <div className="space-y-3 pt-4 border-t border-stone-100">
                    
                    {/* PRIMARY GIANT TRANSITION BUTTONS */}
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "PROCESSING")}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shadow-lg shadow-emerald-250/50 flex items-center justify-center gap-2"
                        title="Terima pesanan dan mulai memasak"
                      >
                        <FiPlay className="w-4 h-4 fill-current" />
                        Terima & Mulai Masak
                      </button>
                    )}

                    {order.status === "PROCESSING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shadow-lg shadow-blue-250/50 flex items-center justify-center gap-2"
                        title="Selesai memasak dan sajikan ke pelanggan"
                      >
                        <FiCheck className="w-4.5 h-4.5 stroke-[3]" />
                        Selesaikan Masak & Sajikan
                      </button>
                    )}

                    {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
                      <div className="text-center py-3 bg-stone-150/40 border border-stone-100 rounded-2xl text-[10px] text-stone-400 font-semibold uppercase tracking-wider select-none">
                        Selesai Diproses
                      </div>
                    )}

                    {/* SECONDARY ACTION BAR */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-100/60">
                      
                      {/* Reject button (for Pending) */}
                      {order.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                            className="w-full py-2.5 bg-red-55/10 hover:bg-red-600 text-red-605 hover:text-white border border-red-100 hover:border-red-600 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                            title="Tolak pesanan masuk"
                          >
                            <FiX className="w-3.5 h-3.5 stroke-[3]" />
                            Tolak Pesanan
                          </button>
                          <a
                            href={`/admin/orders/${order.id}/receipt`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Cetak Struk"
                          >
                            <FiPrinter className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Ubah Status Manual"
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Cancel button (for Processing) */}
                      {order.status === "PROCESSING" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                            className="w-full py-2.5 bg-red-55/10 hover:bg-red-600 text-red-650 hover:text-white border border-red-100 hover:border-red-600 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                            title="Batalkan proses masak"
                          >
                            <FiX className="w-3.5 h-3.5 stroke-[3]" />
                            Batalkan Pesanan
                          </button>
                          <a
                            href={`/admin/orders/${order.id}/receipt`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Cetak Struk"
                          >
                            <FiPrinter className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Ubah Status Manual"
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Prominent red Delete button (for Completed / Cancelled) */}
                      {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="w-full py-2.5 bg-red-55/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Hapus Dari Antrean"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                                Hapus Antrean
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Pesanan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data pesanan {order.id} dari antrean? Aksi ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteOrder(order.id)} 
                                  className="bg-red-600 hover:bg-red-700 shadow-none text-white cursor-pointer"
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <a
                            href={`/admin/orders/${order.id}/receipt`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Cetak Struk"
                          >
                            <FiPrinter className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-100 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Ubah Status Manual"
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 bg-white border border-stone-200 rounded-3xl text-center text-stone-400 font-bold uppercase tracking-wider text-xs">
              Tidak ada pesanan ditemukan.
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5"
          >
            Selanjutnya &rarr;
          </button>
        </div>
      )}
      {/* Dialog Edit Status Manual */}
      <AlertDialog open={!!editingOrder} onOpenChange={(open) => { if (!open) setEditingOrder(null); }}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-stone-900 text-lg">Koreksi Status Pesanan</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500 text-xs">
              Ubah status untuk pesanan <span className="font-mono font-semibold text-stone-900">#{editingOrder?.id}</span> milik <span className="font-semibold text-stone-900">{editingOrder?.customerName}</span> secara manual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="px-6 pb-6 space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Pilih Status Baru:</label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"] as const).map((status) => {
                const config = STATUS_CONFIG[status];
                const isSelected = editingOrder?.status === status;
                
                // Tailored active styles matching the status's color family
                const activeStyles = {
                  PENDING: "bg-amber-50 text-amber-700 border-amber-400 shadow-sm shadow-amber-100",
                  PROCESSING: "bg-blue-50 text-blue-700 border-blue-400 shadow-sm shadow-blue-100",
                  COMPLETED: "bg-stone-100 text-stone-850 border-stone-400 shadow-sm shadow-stone-100",
                  CANCELLED: "bg-red-50 text-red-700 border-red-400 shadow-sm shadow-red-100",
                }[status];

                return (
                  <button
                    key={status}
                    onClick={() => {
                      if (editingOrder) {
                        setEditingOrder({ ...editingOrder, status });
                      }
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? activeStyles
                        : "bg-white text-stone-600 border-stone-100 hover:bg-stone-50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              onClick={() => setEditingOrder(null)} 
              className="cursor-pointer border-stone-100 text-stone-600 font-semibold text-xs py-2 px-4 rounded-xl"
            >
              Batal
            </AlertDialogCancel>
            <button
              onClick={() => {
                if (editingOrder) {
                  handleUpdateStatus(editingOrder.id, editingOrder.status);
                  setEditingOrder(null);
                }
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
