"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Copy, Check, RefreshCw, Search, AlertCircle, Clock, ChefHat, CheckCircle2, Flame } from "lucide-react";
import { useCart, Order } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useOrderHistory } from "./hooks/useOrderHistory";

function ConfettiEffect() {
  const colors = ["#2d7a3e", "#3a9e52", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 6 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initialX = Math.random() * 100;
        const delay = Math.random() * 1.5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              left: `${initialX}%`,
              top: "-10px",
            }}
            animate={{
              y: ["0px", "250px"],
              x: [`0px`, `${Math.random() * 50 - 25}px`],
              rotate: [0, Math.random() * 360],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1.5,
              delay: delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

function PremiumVisualTracker({ status, estimatedTime }: { status: Order["status"]; estimatedTime?: string }) {
  const steps: { label: string; statusMatch: Order["status"][]; desc: string; icon: React.ComponentType<any> }[] = [
    { 
      label: "Menunggu", 
      statusMatch: ["PENDING"], 
      desc: "Dapur Cak Bud sedang meninjau dan menerima pesanan Anda... ⏰",
      icon: Clock 
    },
    { 
      label: "Diproses", 
      statusMatch: ["PROCESSING"], 
      desc: "Lalapan lezat Anda sedang digoreng & disiapkan hangat! 🍳🔥",
      icon: ChefHat 
    },
    { 
      label: "Selesai", 
      statusMatch: ["COMPLETED"], 
      desc: "Selesai! Silakan ambil atau nikmati santapan lezat Anda! 🍽️😋",
      icon: CheckCircle2 
    },
  ];

  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50/60 border border-red-150/40 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
          <AlertCircle className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <p className="text-xs font-bold text-red-800">Pesanan Dibatalkan</p>
          <p className="text-[10px] text-red-650 font-semibold mt-0.5">
            Mohon maaf, pesanan ini telah dibatalkan oleh pihak Lalapan Cak Bud.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((step) => step.statusMatch.includes(status));
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const currentStep = steps[activeIndex] || steps[0];

  return (
    <div className={`bg-gradient-to-br from-stone-50 to-stone-100/50 border rounded-2xl p-4.5 space-y-4 shadow-sm relative overflow-hidden transition-all duration-500 ${
      status === "COMPLETED" ? "border-emerald-200 shadow-emerald-50" : "border-stone-150/45"
    }`}>
      {/* Efek Confetti ketika status tracking selesai (COMPLETED) */}
      {status === "COMPLETED" && <ConfettiEffect />}

      {/* Background glowing ambient filter */}
      <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#2d7a3e]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-center text-[10px] font-bold tracking-tight pb-2.5 border-b border-stone-200/50">
        <span className="text-stone-400 uppercase">ESTIMASI SAJIAN</span>
        <div className="flex items-center gap-1 text-[#2d7a3e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d7a3e] animate-ping" />
          <span className="font-extrabold">{estimatedTime || "20-30 Menit"}</span>
        </div>
      </div>

      {/* Progress Bar & Animated Icons */}
      <div className="relative pt-2 pb-6 px-1">
        {/* Connector Line Background */}
        <div className="absolute top-[26px] left-6 right-6 h-[4px] bg-stone-200/70 rounded-full z-0" />
        
        {/* Filled Spring Progress Line */}
        <motion.div 
          className="absolute top-[26px] left-6 h-[4px] bg-gradient-to-r from-[#2d7a3e] to-[#3a9e52] rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        />

        <div className="flex items-center justify-between relative z-10">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={idx} className="flex flex-col items-center select-none">
                {/* Icon Container with rich hover/pulse states */}
                <motion.div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCurrent 
                      ? "bg-white border-[#2d7a3e] text-[#2d7a3e] shadow-md shadow-green-100" 
                      : isDone 
                        ? "bg-[#2d7a3e] border-[#2d7a3e] text-white" 
                        : "bg-white border-stone-250 text-stone-400"
                  }`}
                  animate={
                    isCurrent 
                      ? status === "COMPLETED"
                        ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
                        : { scale: [1, 1.06, 1] }
                      : {}
                  }
                  transition={
                    isCurrent && status === "COMPLETED"
                      ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                      : { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }
                >
                  {isCurrent && StepIcon === ChefHat ? (
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <StepIcon className="w-5 h-5 stroke-[2.5]" />
                    </motion.div>
                  ) : isCurrent && StepIcon === Clock ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    >
                      <StepIcon className="w-5 h-5 stroke-[2.5]" />
                    </motion.div>
                  ) : isCurrent && StepIcon === CheckCircle2 ? (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <StepIcon className="w-5 h-5 stroke-[2.5] text-emerald-650" />
                    </motion.div>
                  ) : (
                    <StepIcon className="w-5 h-5 stroke-[2.5]" />
                  )}
                </motion.div>

                {/* Step Labels */}
                <span className={`text-[9px] font-black mt-2 tracking-wide uppercase ${
                  isCurrent ? "text-[#2d7a3e]" : isDone ? "text-stone-700" : "text-stone-400"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Status Message Card */}
      <motion.div 
        key={status}
        initial={{ opacity: 0, y: 5 }}
        animate={
          status === "COMPLETED"
            ? { opacity: 1, y: 0, scale: [1, 1.02, 1] }
            : { opacity: 1, y: 0 }
        }
        transition={
          status === "COMPLETED"
            ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
            : {}
        }
        className={`bg-white border rounded-xl p-3 flex items-center gap-2.5 shadow-sm ${
          status === "COMPLETED" ? "border-emerald-250" : "border-stone-150/40"
        }`}
      >
        {status === "PROCESSING" ? (
          <Flame className="w-4 h-4 text-orange-500 animate-bounce shrink-0" />
        ) : status === "PENDING" ? (
          <Clock className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
        <p className="text-[10px] font-bold text-stone-700 leading-tight">
          {currentStep.desc}
        </p>
      </motion.div>
    </div>
  );
}

export function OrderHistory() {
  const { orders, reorder } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const {
    copiedId,
    trackOrderId,
    setTrackOrderId,
    guestOrder,
    guestTrackError,
    isTrackLoading,
    hasSearched,
    localGuestOrders,
    isLocalGuestsLoading,
    handleCopyId,
    handleTrackSubmit,
    displayedMemberOrders,
  } = useOrderHistory(orders, isAuthenticated, user, reorder);

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
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Masukkan ID Pesanan (UUID)
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Contoh: fc913159-1e3e-4a5b-aac3-796af3c749c5"
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white border border-stone-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2d7a3e] focus:border-[#2d7a3e] transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isTrackLoading}
            className="w-full h-10 bg-[#2d7a3e] hover:bg-[#1f5c2d] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-green-150 disabled:opacity-50"
          >
            {isTrackLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Lacak Pesanan Saya</span>
          </button>
        </form>
      )}

      {/* Tracked Guest Order Display */}
      {!isAuthenticated && hasSearched && (
        <div className="space-y-4 border-b border-stone-100 pb-6">
          <h3 className="text-xs font-extrabold text-[#2d7a3e] uppercase tracking-wider">Hasil Pelacakan Live:</h3>
          {guestTrackError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 leading-relaxed">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Melacak</p>
                <p className="mt-0.5">{guestTrackError}</p>
              </div>
            </div>
          )}
          {guestOrder && (
            <div className="bg-white border border-[#2d7a3e]/40 rounded-2xl p-4 space-y-4 shadow-sm shadow-green-50">
              <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-stone-900">{guestOrder.id}</span>
                    <button
                      onClick={(e) => handleCopyId(e, guestOrder.id)}
                      className="text-stone-450 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      {copiedId === guestOrder.id ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-700 font-bold">
                    Pemesan: {guestOrder.customerName || "Tamu"}
                  </p>
                  <p className="text-[10px] text-stone-450 font-semibold">{guestOrder.date} pukul {guestOrder.time}</p>
                </div>
                <StatusBadge status={guestOrder.status} />
              </div>

              <div className="space-y-1.5 text-xs font-medium text-stone-700">
                {guestOrder.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between">
                    <span>{item.name} <span className="text-stone-400 font-bold">x{item.quantity}</span></span>
                    <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                <div>
                  <p className="text-[9px] text-stone-450 font-medium leading-none">Total Pembayaran</p>
                  <p className="text-xs font-bold text-[#2d7a3e] mt-1">Rp {guestOrder.total.toLocaleString("id-ID")}</p>
                </div>
                <span className="text-[10px] text-stone-400 font-semibold">Tamu</span>
              </div>

              {/* Visual Tracker */}
              <PremiumVisualTracker status={guestOrder.status} estimatedTime={guestOrder.estimatedTime} />
            </div>
          )}
        </div>
      )}

      {/* List Display */}
      {isAuthenticated ? (
        // ── MEMBER HISTORY DISPLAY ──
        displayedMemberOrders.length === 0 ? (
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
            {displayedMemberOrders.map((order) => {
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
                        Pemesan: {order.customerName === "Member" && user?.name ? user.name : (order.customerName || "Member")} {(order.phone || user?.phone) ? `(${order.phone || user?.phone})` : ""}
                      </p>
                      <p className="text-[10px] text-stone-450 font-semibold">{order.date} pukul {order.time}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs font-medium text-stone-700">
                    {order.items.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex justify-between">
                        <span>{item.name} <span className="text-stone-400 font-bold">x{item.quantity}</span></span>
                        <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Payment & Reorder */}
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
                  {!isCompleted && !isCancelled && (
                    <PremiumVisualTracker status={order.status} estimatedTime={order.estimatedTime} />
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        // ── GUEST HISTORY DISPLAY (LOCAL STASH) ──
        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-stone-850 uppercase tracking-wider">
              Pesanan Tamu di Browser Ini:
            </h3>
            {isLocalGuestsLoading && (
              <div className="w-3.5 h-3.5 border border-stone-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          
          {localGuestOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-stone-400 text-xs bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
              <p className="font-semibold text-stone-500">Tidak ada riwayat lokal</p>
              <p className="max-w-[220px] mx-auto mt-0.5 text-[10px] text-stone-400">
                Pesan sebagai tamu, lalu status pesanan Anda akan otomatis disimpan untuk dipantau di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {localGuestOrders.map((order) => {
                const isCompleted = order.status === "COMPLETED";
                const isCancelled = order.status === "CANCELLED";

                return (
                  <div key={order.id} className="bg-white border border-stone-150 rounded-2xl p-4 space-y-4 hover:shadow-md transition-shadow">
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
                          Pemesan: {order.customerName}
                        </p>
                        <p className="text-[10px] text-stone-450 font-semibold">{order.date} pukul {order.time}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="space-y-1.5 text-xs font-medium text-stone-700">
                      {order.items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex justify-between">
                          <span>{item.name} <span className="text-stone-400 font-bold">x{item.quantity}</span></span>
                          <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                      <div>
                        <p className="text-[9px] text-stone-450 font-medium leading-none">Total Pembayaran</p>
                        <p className="text-xs font-bold text-[#2d7a3e] mt-1">Rp {order.total.toLocaleString("id-ID")}</p>
                      </div>
                      <span className="text-[10px] text-stone-450 font-semibold">Tamu</span>
                    </div>

                    {/* Visual Tracker */}
                    {!isCompleted && !isCancelled && (
                      <PremiumVisualTracker status={order.status} estimatedTime={order.estimatedTime} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
