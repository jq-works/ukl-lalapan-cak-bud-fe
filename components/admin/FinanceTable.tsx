"use client";

import React from "react";
export interface PaymentOrder {
  id: string;
  totalPrice: number;
  status: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
  createdAt: string;
  guestName?: string | null;
  guestPhone?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  orderId: string;
  order?: PaymentOrder;
}

interface FinanceTableProps {
  paginatedPayments: Payment[];
  viewMode: "table" | "grid";
  formatDateTime: (dateStr: string) => string;
}

export function FinanceTable({
  paginatedPayments,
  viewMode,
  formatDateTime,
}: FinanceTableProps) {
  if (paginatedPayments.length === 0) {
    return (
      <div className="py-16 bg-white border border-stone-200 rounded-3xl text-center text-stone-400 font-bold uppercase tracking-wider text-xs shadow-xs">
        Tidak ada data pembayaran ditemukan.
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-stone-50 text-stone-500 border-b border-stone-100 text-xs font-bold uppercase tracking-wider">
                <th className="py-4.5 px-6 w-32">ID Pembayaran</th>
                <th className="py-4.5 px-6 w-32">ID Pesanan</th>
                <th className="py-4.5 px-6">Pelanggan</th>
                <th className="py-4.5 px-6 w-32">Jenis Order</th>
                <th className="py-4.5 px-6 w-36">Waktu / Tanggal</th>
                <th className="py-4.5 px-6 w-32">Metode</th>
                <th className="py-4.5 px-6 w-32">Total Harga</th>
                <th className="py-4.5 px-6 w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {paginatedPayments.map((p) => {
                const isDineIn = p.order?.orderType === "DINE_IN";
                const custName = p.order?.user?.name || p.order?.guestName || "Tamu";
                const custEmail = p.order?.user?.email || p.order?.guestPhone || "Tanpa akun";

                return (
                  <tr key={p.id} className="hover:bg-stone-50/40 transition-colors">
                    {/* Payment ID shortened */}
                    <td className="py-4.5 px-6 font-mono font-bold text-stone-900">
                      #{p.id?.slice(0, 8) || "N/A"}...
                    </td>

                    {/* Order ID shortened */}
                    <td className="py-4.5 px-6 font-mono text-stone-500">
                      #{p.orderId?.slice(0, 8) || "N/A"}...
                    </td>

                    {/* Customer Profile info */}
                    <td className="py-4.5 px-6">
                      <p className="font-bold text-stone-850">{custName}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{custEmail}</p>
                    </td>

                    {/* Order Type Badge */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border leading-none ${
                        isDineIn
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : "bg-orange-50 text-orange-700 border-orange-100"
                      }`}>
                        {isDineIn ? "🍽️ Dine In" : "🥡 Take Away"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4.5 px-6 text-stone-555 font-semibold text-stone-500">
                      {formatDateTime(p.createdAt)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4.5 px-6 font-bold text-stone-600">
                      <span className="bg-stone-100 px-2 py-1 rounded-md text-[10px] tracking-wide uppercase font-extrabold border border-stone-200">
                        {p.method}
                      </span>
                    </td>

                    {/* Paid Amount */}
                    <td className="py-4.5 px-6 font-bold text-stone-900 text-sm">
                      Rp {p.amount.toLocaleString("id-ID")}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border leading-none ${
                        p.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                          : "bg-amber-50 text-amber-700 border-amber-250"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === "PAID" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {p.status === "PAID" ? "Lunas" : "Menunggu"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {paginatedPayments.map((p) => {
        const isDineIn = p.order?.orderType === "DINE_IN";
        const custName = p.order?.user?.name || p.order?.guestName || "Tamu";

        return (
          <div 
            key={p.id} 
            className="bg-white border border-stone-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow group"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-3">
              <div className="space-y-1">
                <p className="text-[10px] text-stone-400 font-bold uppercase leading-none">Pembayaran ID</p>
                <p className="text-xs font-mono font-bold text-stone-950 mt-0.5">#{p.id?.slice(0, 8) || "N/A"}...</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border leading-none ${
                p.status === "PAID"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                  : "bg-amber-50 text-amber-700 border-amber-250"
              }`}>
                {p.status === "PAID" ? "Lunas" : "Menunggu"}
              </span>
            </div>

            {/* Card Info details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400 font-semibold">Pelanggan:</span>
                <span className="font-bold text-stone-850">{custName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 font-semibold">Tipe:</span>
                <span className={`font-bold ${isDineIn ? "text-purple-700" : "text-orange-700"}`}>
                  {isDineIn ? "🍽️ Dine In" : "🥡 Take Away"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 font-semibold">Metode:</span>
                <span className="font-bold text-stone-600 uppercase">{p.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 font-semibold">Tanggal:</span>
                <span className="font-medium text-stone-600">{formatDateTime(p.createdAt)}</span>
              </div>
            </div>

            {/* Card Footer Price */}
            <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
              <span className="text-[9px] text-stone-400 font-bold uppercase leading-none">Total Bayar</span>
              <span className="font-black text-stone-900 text-sm">Rp {p.amount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
