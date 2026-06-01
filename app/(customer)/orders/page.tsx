"use client";

import React from "react";
import CustomerNavbar from "@/components/customer/navbar";
import { OrderHistory } from "@/components/customer/OrderHistory";
import { FloatingCartBtn } from "@/components/customer/FloatingCartBtn";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { BottomNav } from "@/components/customer/BottomNav";
import CustomerFooter from "@/components/customer/Footer";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-start text-stone-850">
      <CustomerNavbar />

      <main className="max-w-3xl w-full mx-auto px-4 md:px-8 pt-6 pb-32 flex-grow">
        <div className="fade-in space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Pesanan Saya</h1>
            <p className="text-stone-500 text-xs mt-1">Pantau status pesanan aktif Anda atau lihat riwayat transaksi kuliner sebelumnya.</p>
          </div>

          <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm">
            <OrderHistory />
          </div>
        </div>
      </main>

      <CustomerFooter />
      <FloatingCartBtn />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
