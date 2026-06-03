"use client";

import React from "react";
import { FiDollarSign, FiTrendingUp, FiCreditCard } from "react-icons/fi";

interface FinanceStatsCardsProps {
  totalRevenue: number;
  totalTransactions: number;
  averageOrderValue: number;
  methodCounts: Record<string, number>;
  dineInRevenue: number;
  takeAwayRevenue: number;
  dineInPercent: number;
  takeAwayPercent: number;
}

export function FinanceStatsCards({
  totalRevenue,
  totalTransactions,
  averageOrderValue,
  methodCounts,
  dineInRevenue,
  takeAwayRevenue,
  dineInPercent,
  takeAwayPercent,
}: FinanceStatsCardsProps) {
  return (
    <div className="space-y-6">
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
                const pct = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span className="uppercase">{method}</span>
                      <span>Rp {amount.toLocaleString("id-ID")} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
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
    </div>
  );
}
