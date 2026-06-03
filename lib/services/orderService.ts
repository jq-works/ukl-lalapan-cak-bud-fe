import { api } from "../api";

// Membuat pesanan baru untuk pelanggan non-member (tamu).
export const createGuestOrder = (payload: {
  guestName: string;
  guestPhone: string;
  items: Array<{ menuItemId: string; quantity: number }>;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
}) => api.post("/orders/guest", payload);

// Membuat pesanan baru untuk pelanggan terdaftar (member).
export const createMemberOrder = (payload: {
  items: Array<{ menuItemId: string; quantity: number }>;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
}) => api.post("/orders", payload);

// Mengambil daftar riwayat pesanan pribadi milik member.
export const getMyOrders = () => api.get("/orders/me");

// Mengambil seluruh daftar pesanan masuk untuk dashboard admin.
export const getOrders = () => api.get("/orders");

// Mengambil detail pesanan tertentu berdasarkan ID untuk nota struk belanja.
export const getOrderDetail = (id: string) => api.get(`/orders/${id}`);

// Melacak status pengerjaan pesanan tamu secara real-time berdasarkan ID.
export const trackGuestOrder = (id: string) => api.get(`/orders/guest/track/${id}`);

// Memperbarui status kemajuan pesanan pelanggan berdasarkan ID (Admin).
export const updateOrderStatus = (id: string, status: string) => api.patch(`/orders/${id}/status`, { status });
