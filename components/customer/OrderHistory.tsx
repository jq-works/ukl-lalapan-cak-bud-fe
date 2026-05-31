"use client";

import React, { useState } from "react";
import { ClipboardList, Copy, Check, RefreshCw, ChevronRight } from "lucide-react";
import { useCart, Order } from "@/context/CartContext";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function OrderHistory() {
  const { orders, reorder, setActiveTab } = useCart();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to check order progress step
  const getStepProgress = (status: Order["status"]) => {
    const steps: { label: string; statusMatch: Order["status"][] }[] = [
      { label: "Menunggu", statusMatch: ["PENDING"] },
      { label: "Dibayar", statusMatch: ["PAID"] },
      { label: "Diproses", statusMatch: ["PROCESSING"] },
      { label: "Siap Ambil", statusMatch: ["READY"] },
      { label: "Selesai", statusMatch: ["COMPLETED"] },
    ];

    if (status === "CANCELLED") return null;

    const currentIndex = steps.findIndex((step) => step.statusMatch.includes(status));
    return {
      steps,
      currentIndex: currentIndex !== -1 ? currentIndex : 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-2 pb-1">
        <div className="w-5 h-5 bg-[#2d7a3e]/10 rounded-md flex items-center justify-center text-[#2d7a3e]">
          <ClipboardList className="w-4 h-4" />
        </div>
        <h2 className="text-base font-extrabold text-stone-900 tracking-tight">
          Riwayat Pesanan Saya
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <span className="text-5xl mb-4">📋</span>
          <p className="text-sm font-bold text-stone-800 mb-1">
            Belum ada pesanan
          </p>
          <p className="text-xs text-stone-400 max-w-[240px] mb-4">
            Semua pesanan makananmu di warung Cak Bud akan muncul dan bisa dilacak di sini.
          </p>
          <button
            onClick={() => setActiveTab("home")}
            className="px-5 py-2 bg-[#2d7a3e] hover:bg-[#1f5c2d] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-green-200/50 hover:shadow-md cursor-pointer"
          >
            Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const progress = getStepProgress(order.status);
            const isCompleted = order.status === "COMPLETED";
            const isCancelled = order.status === "CANCELLED";

            return (
              <div
                key={order.id}
                className="bg-white border border-stone-150 rounded-2xl p-4 shadow-sm space-y-4 hover:shadow-md transition-all duration-200"
              >
                {/* Order Top Section */}
                <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-stone-800">
                        {order.id}
                      </span>
                      <button
                        onClick={(e) => handleCopyId(e, order.id)}
                        className="p-1 hover:bg-stone-50 rounded text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                        title="Salin ID Pesanan"
                      >
                        {copiedId === order.id ? (
                          <Check className="w-3 h-3 text-emerald-500 font-bold" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-400 font-medium">
                      {order.date} pukul {order.time}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Rincian Hidangan
                  </p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-stone-700 font-medium">
                        <span className="line-clamp-1 max-w-[200px]">
                          {item.name} <span className="text-stone-400 font-bold">x{item.quantity}</span>
                        </span>
                        <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Payment & Reorder Trigger */}
                <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                  <div>
                    <p className="text-[10px] font-medium text-stone-400">Total Pembayaran</p>
                    <p className="text-sm font-bold text-[#2d7a3e]">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <button
                    onClick={() => reorder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#2d7a3e] text-[#2d7a3e] hover:bg-green-50 rounded-xl font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-sm shadow-green-100"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Pesan Lagi</span>
                  </button>
                </div>

                {/* Dynamic Visual Timeline for Active Orders */}
                {progress && !isCompleted && !isCancelled && (
                  <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100/50 mt-2 space-y-3">
                    <p className="text-[10px] font-bold text-stone-500 flex justify-between">
                      <span>ESTIMASI SIAP</span>
                      <span className="text-[#2d7a3e] font-extrabold">{order.estimatedTime}</span>
                    </p>
                    
                    {/* Visual Dots Timeline */}
                    <div className="flex items-center w-full justify-between relative px-2">
                      {/* Connection bar background */}
                      <div className="absolute top-[7px] left-8 right-8 h-[2px] bg-stone-200 z-0" />
                      {/* Connection bar active */}
                      <div
                        className="absolute top-[7px] left-8 h-[2px] bg-[#2d7a3e] z-0 transition-all duration-500"
                        style={{
                          width: `${(progress.currentIndex / (progress.steps.length - 1)) * 80}%`,
                        }}
                      />

                      {progress.steps.map((step, idx) => {
                        const isDone = idx <= progress.currentIndex;
                        const isCurrent = idx === progress.currentIndex;

                        return (
                          <div key={idx} className="flex flex-col items-center z-10 relative">
                            {/* Circle Dot */}
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isCurrent
                                  ? "bg-[#2d7a3e] border-[#2d7a3e] scale-125 animate-pulse"
                                  : isDone
                                  ? "bg-[#2d7a3e] border-[#2d7a3e]"
                                  : "bg-white border-stone-300"
                              }`}
                            >
                              {isDone && !isCurrent && (
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </div>
                            
                            {/* Step Label */}
                            <span
                              className={`text-[9px] font-bold mt-1 transition-colors ${
                                isCurrent
                                  ? "text-[#2d7a3e]"
                                  : isDone
                                  ? "text-stone-700"
                                  : "text-stone-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
