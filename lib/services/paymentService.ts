import { api } from "../api";

// Mendaftarkan metode pembayaran transaksi untuk pesanan tamu (guest).
export async function createGuestPayment(orderId: string, payload: { method: "QRIS" | "BANK_BCA" | "CASH" }) {
  return api.post(`/payments/guest/${orderId}`, payload);
}

// Mendaftarkan metode pembayaran transaksi untuk pesanan member.
export async function createMemberPayment(orderId: string, payload: { method: "QRIS" | "BANK_BCA" | "CASH" }) {
  return api.post(`/payments/${orderId}`, payload);
}

// Mengambil data seluruh transaksi pembayaran kasir untuk admin.
export async function getPayments() {
  return api.get("/payments");
}
