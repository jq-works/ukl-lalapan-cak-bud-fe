"use client";

import React from "react";
import { Order, STATUS_CONFIG } from "@/app/admin/layout";
import { FiPrinter, FiEdit, FiTrash2 } from "react-icons/fi";
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

interface OrderTableListProps {
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

export function OrderTableList({
  paginatedOrders,
  handleUpdateStatus,
  deleteOrder,
  setEditingOrder,
}: OrderTableListProps) {
  return (
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
                  <td className="py-5 px-6 text-stone-500 font-semibold">{order.date}</td>

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
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-red-200 transition-all active:scale-95 cursor-pointer"
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
                <td colSpan={8} className="py-12 text-center text-stone-400 font-medium">
                  Tidak ada pesanan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
