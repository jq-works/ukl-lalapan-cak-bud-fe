"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  FiHome, FiClipboard, FiShoppingBag, FiUsers, FiSettings, 
  FiLogOut
} from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Order {
  id: string;
  customerName: string;
  items: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  date: string;
  phone: string;
  note: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: "CB-0931", customerName: "Dzaky", items: "Lalapan Ayam Goreng x2, Es Teh Manis x2", total: 46000, status: "PENDING", date: "2026-06-01 16:45", phone: "08234372348", note: "[DINE IN]" },
  { id: "CB-0930", customerName: "Budi Santoso", items: "Lalapan Bebek Bakar x1, Jeruk Hangat x1", total: 35000, status: "PROCESSING", date: "2026-06-01 16:20", phone: "081234567890", note: "[TAKE AWAY]" },
  { id: "CB-0929", customerName: "Fahry Admin", items: "Lalapan Nila Goreng x2, Jus Alpukat x2", total: 64000, status: "PROCESSING", date: "2026-06-01 15:10", phone: "08122334455", note: "[DINE IN]" },
  { id: "CB-0928", customerName: "Siti Rahma", items: "Lalapan Ayam Bakar x3, Es Jeruk x3", total: 78000, status: "PROCESSING", date: "2026-06-01 14:05", phone: "08987654321", note: "[DINE IN]" },
  { id: "CB-0927", customerName: "Andi Wijaya", items: "Lalapan Lele Goreng x2, Es Teh x2", total: 36000, status: "COMPLETED", date: "2026-06-01 12:30", phone: "085544332211", note: "[TAKE AWAY]" },
  { id: "CB-0926", customerName: "Dewi Lestari", items: "Lalapan Bebek Goreng x1, Es Campur x1", total: 38000, status: "CANCELLED", date: "2026-06-01 11:15", phone: "08776655443", note: "[TAKE AWAY]" },
];

export const STATUS_CONFIG = {
  PENDING:    { label: "Menunggu",    bg: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  PROCESSING: { label: "Diproses", bg: "bg-blue-50 text-blue-700 border-blue-200",    dot: "bg-blue-500" },
  COMPLETED:  { label: "Selesai",     bg: "bg-stone-100 text-stone-600 border-stone-200",    dot: "bg-stone-400" },
  CANCELLED:  { label: "Dibatalkan",  bg: "bg-red-50 text-red-600 border-red-200",     dot: "bg-red-400" },
};

interface AdminContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  updateOrderStatus: (id: string, newStatus: Order["status"]) => void;
  deleteOrder: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdminOrders() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminOrders must be used within an AdminLayout");
  }
  return context;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    const savedToken = token || localStorage.getItem("cakbud_token");
    if (!savedToken) return;
    try {
      const response = await api.get("/orders");
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal mengambil data orders");
      }
      const apiOrders = resData.data || resData.orders || [];
      const mappedOrders: Order[] = apiOrders.map((o: any) => {
        const apiItems = o.orderItems || o.items || [];
        const itemsStr = apiItems.map((item: any) => {
          const name = item.menuItem?.name || item.name || "Menu";
          const qty = item.quantity || 1;
          return `${name} x${qty}`;
        }).join(", ");
        
        return {
          id: o.id,
          customerName: o.user?.name || o.guestName || o.customerName || (o.userId ? "Member" : "Tamu"),
          items: itemsStr,
          total: Number(o.total || o.totalPrice || 0),
          status: o.status === "CANCELED" ? "CANCELLED" : (o.status || "PENDING"),
          date: new Date(o.createdAt || o.date).toLocaleString("id-ID", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
          }),
          phone: o.user?.phone || o.guestPhone || o.phone || "",
          note: o.note || ""
        };
      });
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Gagal mengambil orders admin dari API:", err);
    }
  };

  // Fetch admin orders on mount and auth state updates, then start a 15s refresh interval
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      fetchOrders();
      const interval = setInterval(fetchOrders, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, token]);

  // Secure route check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Memeriksa hak akses admin...</p>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING").length;

  const updateOrderStatus = async (id: string, newStatus: Order["status"]) => {
    const savedToken = token || localStorage.getItem("cakbud_token");
    if (!savedToken) return;
    
    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

    try {
      const apiStatus = newStatus === "CANCELLED" ? "CANCELED" : newStatus;
      const response = await api.patch(`/orders/${id}/status`, { status: apiStatus });
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal memperbarui status order di server");
      }
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      // Revert status on failure
      fetchOrders();
    }
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <AdminContext.Provider value={{ orders, setOrders, updateOrderStatus, deleteOrder }}>
      <div className="flex min-h-screen bg-stone-50 font-sans">
        {/* Left Sidebar */}
        <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-stone-100 flex flex-col justify-between z-20">
          <div>
            {/* Logo Area */}
            <div className="h-16 border-b border-stone-100 flex items-center px-6 gap-2">
              <img 
                src="/images/logo_cakbud.png" 
                alt="Logo Cak Bud" 
                className="h-9 w-auto object-contain select-none pointer-events-none"
              />
              <div>
                <h1 className="font-extrabold text-stone-900 text-xs leading-none uppercase">Cak Bud Admin</h1>
                <span className="text-[9px] text-primary-500 font-bold uppercase tracking-wider block mt-0.5">Dashboard Panel</span>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="p-4 space-y-1">
              <Link
                href="/admin"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  pathname === "/admin"
                    ? "bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium"
                }`}
              >
                <FiHome className="w-4 h-4" />
                Dasbor Utama
              </Link>
              <Link
                href="/admin/orders"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  pathname === "/admin/orders"
                    ? "bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium"
                }`}
              >
                <FiClipboard className="w-4 h-4" />
                Kelola Pesanan
                {pendingCount > 0 && (
                  <span className="ml-auto bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/menu"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  pathname === "/admin/menu"
                    ? "bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium"
                }`}
              >
                <FiShoppingBag className="w-4 h-4" />
                Kelola Menu
              </Link>
              <button
                onClick={() => setInfoMessage("Fitur Data Pelanggan tersedia di tahap pengembangan berikutnya.")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium transition-all text-left cursor-pointer"
              >
                <FiUsers className="w-4 h-4" />
                Pelanggan
              </button>
              <button
                onClick={() => setInfoMessage("Pengaturan sistem tersedia di tahap pengembangan berikutnya.")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-950 font-medium transition-all text-left cursor-pointer"
              >
                <FiSettings className="w-4 h-4" />
                Pengaturan
              </button>
            </nav>
          </div>

          {/* User Profile Info & Logout */}
          <div className="p-4 border-t border-stone-100">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold">
                {user?.name?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              <div>
                <p className="font-bold text-stone-850 text-xs leading-none">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-stone-400 mt-1">{user?.email || "admin@lalapan.com"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-650 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              Keluar Akun
            </button>
          </div>
        </aside>

        {/* Right Workspace */}
        <div className="flex-1 pl-64 flex flex-col min-h-screen">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">Admin Panel</span>
              <span className="text-stone-300 text-xs">/</span>
              <span className="text-xs text-stone-800 font-bold capitalize">
                {pathname === "/admin" ? "dashboard" : pathname.replace("/admin/", "")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-xs text-stone-500 hidden sm:block">
                <span className="font-semibold">
                  {new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <span className="h-8 w-[1px] bg-stone-200" />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 border border-primary-200">
                  ADMIN
                </span>
              </div>
            </div>
          </header>

          {/* Main Work Area */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>

        {/* Info Message Dialog */}
        <AlertDialog open={!!infoMessage} onOpenChange={(open) => { if (!open) setInfoMessage(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Informasi</AlertDialogTitle>
              <AlertDialogDescription>
                {infoMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setInfoMessage(null)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminContext.Provider>
  );
}
