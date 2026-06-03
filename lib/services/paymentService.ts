import { api } from "../api";

// Mendaftarkan metode pembayaran transaksi untuk pesanan tamu (guest).
export const createGuestPayment = (orderId: string, payload: { method: "QRIS" | "BANK_BCA" | "CASH" }) => api.post(`/payments/guest/${orderId}`, payload);

// Mendaftarkan metode pembayaran transaksi untuk pesanan member.
export const createMemberPayment = (orderId: string, payload: { method: "QRIS" | "BANK_BCA" | "CASH" }) => api.post(`/payments/${orderId}`, payload);

// Mengambil data seluruh transaksi pembayaran kasir untuk admin.
export const getPayments = () => api.get("/payments");
