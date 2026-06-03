"use client";

import React, { useEffect, useState } from "react";
import { orderService } from "@/lib/services";
import { FiPrinter, FiX, FiLoader, FiAlertTriangle } from "react-icons/fi";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  menuItem?: {
    name: string;
    price: number;
  };
}

interface OrderDetail {
  id: string;
  totalPrice: number;
  status: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
  createdAt: string;
  guestName?: string | null;
  guestPhone?: string | null;
  orderItems: OrderItem[];
  user?: {
    name: string;
    email: string;
    phone?: string;
  } | null;
  payment?: {
    method: string;
    status: string;
  } | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderReceiptPage({ params }: PageProps) {
  const { id } = React.use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderDetail(id);
        if (response.data?.success) {
          setOrder(response.data.data);
        } else {
          setError(response.data?.message || "Gagal mengambil data pesanan.");
        }
      } catch (err: any) {
        console.error("Gagal memuat detail pesanan:", err);
        setError(
          err.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data pesanan."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  // Trigger print dialog automatically once loaded
  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-3">
        <FiLoader className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-sm font-semibold text-stone-600 font-sans">
          Memuat struk belanja...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm max-w-sm w-full text-center space-y-4 font-sans">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900">Gagal Memuat Struk</h3>
            <p className="text-xs text-stone-500 mt-1">
              {error || "Pesanan tidak ditemukan."}
            </p>
          </div>
          <button
            onClick={() => window.close()}
            className="w-full h-10 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup Halaman
          </button>
        </div>
      </div>
    );
  }

  const customerName = order.user?.name || order.guestName || "Pelanggan Tamu";
  
  // Extract phone number from note or guestPhone
  const phone = order.guestPhone || (order.note?.match(/\[HP:\s*([^\]]+)\]/)?.[1] || "");
  
  // Clean note from metadata prefixes
  const cleanNote = order.note
    ?.replace(/^\[(DINE IN|TAKE AWAY)\]\s*/i, "")
    ?.replace(/\[HP:\s*([^\]]+)\]\s*/i, "")
    ?.trim();

  const isDineIn = order.orderType === "DINE_IN";
  const dateFormatted = new Date(order.createdAt).toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const subtotal = order.totalPrice;
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  const paymentStatus = order.payment?.status || (order.status === "COMPLETED" ? "PAID" : "UNPAID");
  const paymentMethod = order.payment?.method || (order.note?.includes("[CASH]") ? "CASH" : "MIDTRANS");

  return (
    <div className="bg-stone-100 min-h-screen py-10 px-4 flex items-center justify-center print:bg-white print:p-0 print:py-0">
      {/* Floating Control Bar for Screen Only */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-stone-200 shadow-lg px-4 py-2 rounded-full flex items-center gap-3 print:hidden z-50 transition-all hover:bg-white">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-full transition-all active:scale-95 cursor-pointer shadow-sm shadow-primary-200 font-sans"
        >
          <FiPrinter className="w-3.5 h-3.5" />
          <span>Cetak Struk</span>
        </button>
        <div className="w-[1px] h-4 bg-stone-200" />
        <button
          onClick={() => window.close()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs rounded-full transition-all active:scale-95 cursor-pointer font-sans"
        >
          <FiX className="w-3.5 h-3.5" />
          <span>Tutup</span>
        </button>
      </div>

      {/* POS Thermal Receipt Mockup */}
      <div className="bg-white w-full max-w-[340px] p-6 rounded-2xl shadow-xl border border-stone-200/50 print:border-none print:shadow-none print:p-0 print:max-w-none print:w-full font-mono text-stone-850 text-[11px] leading-relaxed">
        {/* Header */}
        <div className="text-center space-y-1 mb-4">
          <h2 className="font-bold text-[15px] tracking-wide text-stone-900">LALAPAN CAK BUD</h2>
          <p className="text-[9px] text-stone-555 leading-normal">
            Spesialis Lalapan & Bebek Bakar
            <br />
            Jl. Veteran No. 8, Lowokwaru, Malang
            <br />
            Telp: 0856-4967-78299
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-stone-300 my-3" />

        {/* Metadata */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>No. Order:</span>
            <span className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{dateFormatted}</span>
          </div>
          <div className="flex justify-between">
            <span>Tipe:</span>
            <span className="font-bold">{isDineIn ? "🍽️ DINE IN" : "🥡 TAKE AWAY"}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-bold truncate max-w-[180px]">{customerName}</span>
          </div>
          {phone && (
            <div className="flex justify-between">
              <span>No. Telp:</span>
              <span>{phone}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-stone-300 my-3" />

        {/* Items Header */}
        <div className="flex justify-between font-bold mb-1">
          <span>Menu</span>
          <span>Total</span>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {order.orderItems.map((item) => {
            const name = item.menuItem?.name || "Menu Item";
            const qty = item.quantity;
            const unitPrice = item.price;
            const itemTotal = qty * unitPrice;

            return (
              <div key={item.id} className="space-y-0.5">
                <div className="flex justify-between font-medium">
                  <span className="max-w-[200px] break-words">{name}</span>
                  <span>Rp {itemTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="text-[10px] text-stone-500">
                  {qty} x Rp {unitPrice.toLocaleString("id-ID")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-stone-300 my-3" />

        {/* Calculations */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya Layanan:</span>
            <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
          </div>
          {/* Divider */}
          <div className="border-t border-dashed border-stone-300 pt-1 mt-1" />
          <div className="flex justify-between font-bold text-stone-900 text-xs">
            <span>TOTAL:</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-stone-300 my-3" />

        {/* Payment Details */}
        <div className="space-y-1 text-center bg-stone-50 py-1.5 px-2 rounded-lg border border-stone-200/50 print:bg-white print:border-stone-300">
          <div className="flex justify-between">
            <span>Metode:</span>
            <span className="font-bold uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-bold ${paymentStatus === "PAID" ? "text-green-600 print:text-black" : "text-amber-600 print:text-black"}`}>
              {paymentStatus === "PAID" ? "LUNAS [PAID]" : "BELUM BAYAR"}
            </span>
          </div>
        </div>

        {/* Note (if exists) */}
        {cleanNote && (
          <div className="mt-3 p-2 bg-amber-50/50 border border-amber-200/50 rounded-lg print:bg-white print:border-stone-300">
            <span className="font-bold block mb-0.5">Catatan:</span>
            <p className="italic text-stone-750">{cleanNote}</p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-stone-300 my-4" />

        {/* Footer */}
        <div className="text-center space-y-1 text-[9px] text-stone-550">
          <p className="font-bold tracking-wider">MATUR NUWUN</p>
          <p>Terima kasih atas kunjungan Anda</p>
          <p className="italic text-stone-400">Powered by Lalapan Cak Bud</p>
        </div>
      </div>
    </div>
  );
}
