"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardList, Copy, Check, RefreshCw, Phone, Search, AlertCircle } from "lucide-react";
import { useCart, Order } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function OrderHistory() {
  const { orders, reorder } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Guest tracking states
  const [trackPhone, setTrackPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackPhone.trim()) return;
    setSearchedPhone(trackPhone.trim());
    setHasSearched(true);
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

  // Filter orders depending on user role
  const displayedOrders = React.useMemo(() => {
    if (isAuthenticated && user) {
      // Members see their own orders (matches user phone, or is general history in offline mode)
      return orders.filter(
        (o) => !o.phone || o.phone === user.phone || o.customerName === user.name
      );
    } else if (hasSearched && searchedPhone) {
      // Guests only see orders matching the tracked phone number
      const sanitizedSearch = searchedPhone.replace(/\s+/g, "");
      return orders.filter((o) => {
        if (!o.phone) return false;
        const sanitizedOrderPhone = o.phone.replace(/\s+/g, "");
        return sanitizedOrderPhone.includes(sanitizedSearch) || sanitizedSearch.includes(sanitizedOrderPhone);
      });
    }
    return [];
  }, [orders, isAuthenticated, user, hasSearched, searchedPhone]);

  return (
    <div className="space-y-6">
      {/* Header Tab */}
      <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
        <div className="w-5 h-5 bg-[#2d7a3e]/10 rounded-md flex items-center justify-center text-[#2d7a3e]">
          <ClipboardList className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-extrabold text-stone-900 tracking-tight">
          {isAuthenticated ? "Riwayat Belanja Member" : "Pelacakan Pesanan Tamu"}
        </h2>
      </div>

      {/* Guest Mode: Tracking Form */}
      {!isAuthenticated && (
        <form onSubmit={handleTrackSubmit} className="space-y-3 p-4.5 bg-stone-50 rounded-2xl border border-stone-150">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase">
              Masukkan Nomor WhatsApp Pemesan
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="tel"
                placeholder="Contoh: 08123456789"
                value={trackPhone}
                onChange={(e) => setTrackPhone(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white border border-stone-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2d7a3e] focus:border-[#2d7a3e] transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-[#2d7a3e] hover:bg-[#1f5c2d] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-green-150"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lacak Pesanan Saya</span>
          </button>
        </form>
      )}

      {/* List Display */}
      {isAuthenticated ? (
        // ── MEMBER HISTORY DISPLAY ──
        displayedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">📋</span>
            <p className="text-xs font-bold text-stone-850 mb-1">Belum ada transaksi</p>
            <p className="text-[11px] text-stone-400 max-w-[220px] mb-4">
              Pesan menu lalapan nikmat dan status pesanan aktif Anda akan tercatat di sini.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-[#2d7a3e] text-white text-xs font-bold rounded-xl hover:bg-[#1f5c2d] transition-colors cursor-pointer"
            >
              Pesan Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const progress = getStepProgress(order.status);
              const isCompleted = order.status === "COMPLETED";
              const isCancelled = order.status === "CANCELLED";

              return (
                <div key={order.id} className="bg-white border border-stone-150 rounded-2xl p-4 space-y-4 hover:shadow-md transition-shadow">
                  {/* Order ID & Status */}
                  <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-stone-900">{order.id}</span>
                        <button
                          onClick={(e) => handleCopyId(e, order.id)}
                          className="text-stone-450 hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          {copiedId === order.id ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-700 font-bold">
                        Pemesan: {order.customerName || "Member"} {order.phone && `(${order.phone})`}
                      </p>
                      <p className="text-[10px] text-stone-400 font-semibold">{order.date} pukul {order.time}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs font-medium text-stone-700">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} <span className="text-stone-400 font-bold">x{item.quantity}</span></span>
                        <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Payment & Reorder (MEMBERS ONLY CAN REORDER) */}
                  <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                    <div>
                      <p className="text-[9px] text-stone-400 font-medium leading-none">Total Pembayaran</p>
                      <p className="text-xs font-bold text-[#2d7a3e] mt-1">Rp {order.total.toLocaleString("id-ID")}</p>
                    </div>
                    <button
                      onClick={() => reorder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#2d7a3e] text-[#2d7a3e] hover:bg-green-50 rounded-xl font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Pesan Lagi</span>
                    </button>
                  </div>

                  {/* Visual Tracker */}
                  {progress && !isCompleted && !isCancelled && (
                    <div className="bg-stone-50/70 border border-stone-150/40 rounded-xl p-3 space-y-3.5">
                      <div className="flex justify-between text-[9px] font-bold text-stone-500">
                        <span>ESTIMASI WAKTU</span>
                        <span className="text-[#2d7a3e] font-extrabold">{order.estimatedTime}</span>
                      </div>
                      <div className="flex items-center justify-between relative px-2">
                        <div className="absolute top-[7px] left-8 right-8 h-[2px] bg-stone-200 z-0" />
                        <div
                          className="absolute top-[7px] left-8 h-[2px] bg-[#2d7a3e] z-0 transition-all duration-500"
                          style={{ width: `${(progress.currentIndex / (progress.steps.length - 1)) * 80}%` }}
                        />
                        {progress.steps.map((step, idx) => {
                          const isDone = idx <= progress.currentIndex;
                          const isCurrent = idx === progress.currentIndex;
                          return (
                            <div key={idx} className="flex flex-col items-center z-10 relative">
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 ${
                                isCurrent ? "bg-[#2d7a3e] border-[#2d7a3e] scale-110" : isDone ? "bg-[#2d7a3e] border-[#2d7a3e]" : "bg-white border-stone-300"
                              }`} />
                              <span className={`text-[8px] font-bold mt-1 ${isCurrent ? "text-[#2d7a3e]" : isDone ? "text-stone-700" : "text-stone-400"}`}>
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
        )
      ) : (
        // ── GUEST TRACKING DISPLAY ──
        !hasSearched ? (
          /* Info display prompt */
          <div className="flex flex-col items-center justify-center py-10 text-center text-stone-400 text-xs">
            <span className="text-4xl mb-3">🔍</span>
            <p className="font-semibold text-stone-850">Lacak Status Pesanan Tamu Anda</p>
            <p className="max-w-[250px] mx-auto mt-1 leading-relaxed text-[11px]">
              Silakan masukkan nomor telepon WhatsApp yang Anda gunakan saat melakukan checkout di keranjang belanja.
            </p>
          </div>
        ) : displayedOrders.length === 0 ? (
          /* Search results not found */
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold">Pesanan Tidak Ditemukan</p>
              <p className="mt-0.5">Tidak ada pesanan aktif terdaftar untuk nomor <span className="font-mono font-semibold">{searchedPhone}</span>. Silakan periksa kembali nomor yang dimasukkan.</p>
            </div>
          </div>
        ) : (
          /* Guest tracking list (NO REORDER BUTTON) */
          <div className="space-y-4">
            <p className="text-[11px] text-[#2d7a3e] font-bold">
              Menampilkan {displayedOrders.length} pesanan terdaftar untuk {searchedPhone}
            </p>
            {displayedOrders.map((order) => {
              const progress = getStepProgress(order.status);
              const isCompleted = order.status === "COMPLETED";
              const isCancelled = order.status === "CANCELLED";

              return (
                <div key={order.id} className="bg-white border border-stone-150 rounded-2xl p-4 space-y-4 hover:shadow-md transition-shadow">
                  {/* Order ID & Status */}
                  <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-stone-900">{order.id}</span>
                        <button
                          onClick={(e) => handleCopyId(e, order.id)}
                          className="text-stone-450 hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          {copiedId === order.id ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-700 font-bold">
                        Pemesan: {order.customerName || "Tamu"} {order.phone && `(${order.phone})`}
                      </p>
                      <p className="text-[10px] text-stone-400 font-semibold">{order.date} pukul {order.time}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs font-medium text-stone-700">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} <span className="text-stone-400 font-bold">x{item.quantity}</span></span>
                        <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Payment ONLY (NO REORDER BUTTON) */}
                  <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                    <div>
                      <p className="text-[9px] text-stone-400 font-medium leading-none">Total Pembayaran (Tamu)</p>
                      <p className="text-xs font-bold text-[#2d7a3e] mt-1">Rp {order.total.toLocaleString("id-ID")}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 font-semibold">Tamu</span>
                  </div>

                  {/* Visual Tracker */}
                  {progress && !isCompleted && !isCancelled && (
                    <div className="bg-stone-50/70 border border-stone-150/40 rounded-xl p-3 space-y-3.5">
                      <div className="flex justify-between text-[9px] font-bold text-stone-500">
                        <span>ESTIMASI SIAP</span>
                        <span className="text-[#2d7a3e] font-extrabold">{order.estimatedTime}</span>
                      </div>
                      <div className="flex items-center justify-between relative px-2">
                        <div className="absolute top-[7px] left-8 right-8 h-[2px] bg-stone-200 z-0" />
                        <div
                          className="absolute top-[7px] left-8 h-[2px] bg-[#2d7a3e] z-0 transition-all duration-500"
                          style={{ width: `${(progress.currentIndex / (progress.steps.length - 1)) * 80}%` }}
                        />
                        {progress.steps.map((step, idx) => {
                          const isDone = idx <= progress.currentIndex;
                          const isCurrent = idx === progress.currentIndex;
                          return (
                            <div key={idx} className="flex flex-col items-center z-10 relative">
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 ${
                                isCurrent ? "bg-[#2d7a3e] border-[#2d7a3e] scale-110" : isDone ? "bg-[#2d7a3e] border-[#2d7a3e]" : "bg-white border-stone-300"
                              }`} />
                              <span className={`text-[8px] font-bold mt-1 ${isCurrent ? "text-[#2d7a3e]" : isDone ? "text-stone-700" : "text-stone-400"}`}>
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
        )
      )}
    </div>
  );
}
