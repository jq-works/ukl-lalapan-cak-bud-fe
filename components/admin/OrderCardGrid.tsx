"use client";

import React from "react";
import { Order, STATUS_CONFIG } from "@/app/admin/layout";
import { FiPlay, FiCheck, FiX, FiPrinter, FiEdit, FiTrash2 } from "react-icons/fi";
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

interface OrderCardGridProps {
  paginatedOrders: Order[];
  handleUpdateStatus: (id: string, newStatus: Order["status"]) => void;
  deleteOrder: (id: string) => void;
  setEditingOrder: (order: Order) => void;
}

const parseItems = (itemsStr: string) => {
  return itemsStr.split(", ").map(item => {
    const match = item.match(/(.+)\s+x(\d+)$/);
    if (match) {
      return { name: match[1], quantity: parseInt(match[2], 10) };
    }
    return { name: item, quantity: 1 };
  });
};

export function OrderCardGrid({
  paginatedOrders,
  handleUpdateStatus,
  deleteOrder,
  setEditingOrder,
}: OrderCardGridProps) {
  return (
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
                        className="w-full py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 hover:border-red-600 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
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
                        className="w-full py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 hover:border-red-600 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
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
                            className="w-full py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
  );
}
