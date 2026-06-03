import { api } from "../api";

export async function createGuestOrder(payload: {
  guestName: string;
  guestPhone: string;
  items: Array<{ menuItemId: string; quantity: number }>;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
}) {
  return api.post("/orders/guest", payload);
}

export async function createMemberOrder(payload: {
  items: Array<{ menuItemId: string; quantity: number }>;
  orderType: "DINE_IN" | "TAKE_AWAY";
  note?: string;
}) {
  return api.post("/orders", payload);
}

export async function getMyOrders() {
  return api.get("/orders/me");
}

export async function getOrders() {
  return api.get("/orders");
}

export async function getOrderDetail(id: string) {
  return api.get(`/orders/${id}`);
}

export async function trackGuestOrder(id: string) {
  return api.get(`/orders/guest/track/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  return api.patch(`/orders/${id}/status`, { status });
}
