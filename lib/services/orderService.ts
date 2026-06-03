import { api } from "../api";

// Membuat pesanan baru untuk pelanggan non-member (tamu).
export async function createGuestOrder(payload: {
  guestName: string;
  guestPhone: string;
  items: Array<{ menuItemId: string; quantity: number }>;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
}) {
  return api.post("/orders/guest", payload);
}

// Membuat pesanan baru untuk pelanggan terdaftar (member).
export async function createMemberOrder(payload: {
  items: Array<{ menuItemId: string; quantity: number }>;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
}) {
  return api.post("/orders", payload);
}

// Mengambil daftar riwayat pesanan pribadi milik member.
export async function getMyOrders() {
  return api.get("/orders/me");
}

// Mengambil seluruh daftar pesanan masuk untuk dashboard admin.
export async function getOrders() {
  return api.get("/orders");
}

// Mengambil detail pesanan tertentu berdasarkan ID untuk nota struk belanja.
export async function getOrderDetail(id: string) {
  return api.get(`/orders/${id}`);
}

// Melacak status pengerjaan pesanan tamu secara real-time berdasarkan ID.
export async function trackGuestOrder(id: string) {
  return api.get(`/orders/guest/track/${id}`);
}

// Memperbarui status kemajuan pesanan pelanggan berdasarkan ID (Admin).
export async function updateOrderStatus(id: string, status: string) {
  return api.patch(`/orders/${id}/status`, { status });
}
