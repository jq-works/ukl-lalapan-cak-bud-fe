"use client";

import React, { useState, useEffect, useMemo } from "react";
import { orderService } from "@/lib/services";
import { Order, CartItem } from "@/context/CartContext";

// Hook kustom untuk memisahkan logika riwayat belanja dan pelacakan tamu
export function useOrderHistory(orders: Order[], isAuthenticated: boolean, user: any, reorder: (order: Order) => void) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // State pelacakan pesanan tamu (Guest Tracking)
  const [trackOrderId, setTrackOrderId] = useState("");
  const [guestOrder, setGuestOrder] = useState<Order | null>(null);
  const [guestTrackError, setGuestTrackError] = useState<string | null>(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Riwayat pesanan lokal tamu (localStorage)
  const [localGuestOrders, setLocalGuestOrders] = useState<Order[]>([]);
  const [isLocalGuestsLoading, setIsLocalGuestsLoading] = useState(false);

  // Memuat riwayat lokal & update status pesanan tamu asinkron
  useEffect(() => {
    if (!isAuthenticated) {
      const savedGuests = localStorage.getItem("cakbud_guest_order_ids");
      if (savedGuests) {
        try {
          const guestIds: string[] = JSON.parse(savedGuests);
          if (guestIds.length > 0) {
            setIsLocalGuestsLoading(true);
            const fetchGuestStatuses = async () => {
              const updatedGuests: Order[] = [];
              
              for (const id of guestIds) {
                try {
                  const res = await orderService.trackGuestOrder(id);
                  if (res.status === 200) {
                    const resData = res.data;
                    const o = resData.data || resData.order;
                    if (o) {
                      const apiItems = o.orderItems || o.items || [];
                      const mappedItems: CartItem[] = apiItems.map((item: any) => ({
                        id: item.menuItem?.id || item.menuItemId || "",
                        name: item.menuItem?.name || item.name || "Menu",
                        price: Number(item.menuItem?.price || item.price || 0),
                        quantity: Number(item.quantity || 1),
                        image: item.menuItem?.imageUrl || item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
                      }));
                      const dateObj = new Date(o.createdAt || o.date);
                      updatedGuests.push({
                        id: o.id,
                        items: mappedItems,
                        total: Number(o.total || o.totalPrice || 0),
                        status: o.status === "CANCELED" ? "CANCELLED" : (o.status || "PENDING"),
                        date: dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
                        time: dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                        estimatedTime: "20-30 Menit",
                        phone: o.phone || o.customerPhone || o.guestPhone || "",
                        customerName: o.guestName || o.customerName || "Tamu",
                        createdAt: o.createdAt || o.date || ""
                      });
                    }
                  }
                } catch (e) {
                  console.error("Gagal melacak riwayat lokal tamu:", e);
                }
              }
              const sortedGuests = updatedGuests.sort((a, b) => {
                const isActive = (status: Order["status"]) => status === "PENDING" || status === "PROCESSING";
                const aActive = isActive(a.status);
                const bActive = isActive(b.status);
                if (aActive && !bActive) return -1;
                if (!aActive && bActive) return 1;
                const dateA = new Date(a.createdAt || a.date).getTime();
                const dateB = new Date(b.createdAt || b.date).getTime();
                return dateB - dateA;
              });
              setLocalGuestOrders(sortedGuests);
              setIsLocalGuestsLoading(false);
            };
            fetchGuestStatuses();
          }
        } catch (e) {
          console.error("Failed to parse stashed guest IDs:", e);
        }
      }
    }
  }, [isAuthenticated]);

  // Aksi menyalin ID pesanan ke clipboard
  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Aksi melacak pesanan guest secara spesifik berdasarkan formulir input
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;
    setIsTrackLoading(true);
    setGuestTrackError(null);
    setGuestOrder(null);
    setHasSearched(true);

    try {
      const response = await orderService.trackGuestOrder(trackOrderId.trim());
      
      if (response.status !== 200) {
        throw new Error("Pesanan tidak ditemukan. Silakan periksa kembali ID Pesanan Anda.");
      }
      
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Pesanan tidak ditemukan.");
      }
      const o = resData.data || resData.order;
      if (!o) {
        throw new Error("Detail pesanan tidak ditemukan.");
      }
      
      const apiItems = o.orderItems || o.items || [];
      const mappedItems: CartItem[] = apiItems.map((item: any) => ({
        id: item.menuItem?.id || item.menuItemId || "",
        name: item.menuItem?.name || item.name || "Menu",
        price: Number(item.menuItem?.price || item.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.menuItem?.imageUrl || item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
      }));
      
      const dateObj = new Date(o.createdAt || o.date);
      const mappedOrder: Order = {
        id: o.id,
        items: mappedItems,
        total: Number(o.total || o.totalPrice || 0),
        status: o.status === "CANCELED" ? "CANCELLED" : (o.status || "PENDING"),
        date: dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        time: dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        estimatedTime: "20-30 Menit",
        phone: o.phone || o.customerPhone || o.guestPhone || "",
        customerName: o.guestName || o.customerName || "Tamu",
        createdAt: o.createdAt || o.date || ""
      };
      
      setGuestOrder(mappedOrder);

      // Simpan pencarian ID tamu ke stashed list
      const savedGuests = localStorage.getItem("cakbud_guest_order_ids");
      let guestList: string[] = [];
      if (savedGuests) {
        try { guestList = JSON.parse(savedGuests); } catch {}
      }
      if (!guestList.includes(mappedOrder.id)) {
        guestList.push(mappedOrder.id);
        localStorage.setItem("cakbud_guest_order_ids", JSON.stringify(guestList));
        setLocalGuestOrders(prev => [mappedOrder, ...prev]);
      }
    } catch (err: any) {
      setGuestTrackError(err.message || "Gagal melacak pesanan. Periksa koneksi internet Anda.");
    } finally {
      setIsTrackLoading(false);
    }
  };

  // Mengurutkan pesanan member (pesanan aktif di atas, disusul tanggal terbaru)
  const displayedMemberOrders = useMemo(() => {
    if (isAuthenticated && user) {
      return [...orders].sort((a, b) => {
        const isActive = (status: Order["status"]) => status === "PENDING" || status === "PROCESSING";
        const aActive = isActive(a.status);
        const bActive = isActive(b.status);

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
      });
    }
    return [];
  }, [orders, isAuthenticated, user]);

  return {
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
  };
}
