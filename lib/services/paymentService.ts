import { api } from "../api";

export async function createGuestPayment(orderId: string, payload: { method: "QRIS" | "BANK_BCA" | "CASH" }) {
  return api.post(`/payments/guest/${orderId}`, payload);
}

export async function createMemberPayment(orderId: string, payload: { method: "QRIS" | "BANK_BCA" | "CASH" }) {
  return api.post(`/payments/${orderId}`, payload);
}

export async function getPayments() {
  return api.get("/payments");
}
