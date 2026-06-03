import { api } from "../api";

export async function getMenuItems() {
  return api.get("/menu-items");
}

export async function createMenuItem(payload: {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) {
  return api.post("/menu-items", payload);
}

export async function updateMenuItem(id: string, payload: {
  name?: string;
  price?: number;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) {
  return api.patch(`/menu-items/${id}`, payload);
}

export async function deleteMenuItem(id: string) {
  return api.delete(`/menu-items/${id}`);
}
