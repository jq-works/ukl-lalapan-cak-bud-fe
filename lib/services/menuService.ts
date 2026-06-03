import { api } from "../api";

// Mengambil semua daftar menu makanan dari server.
export async function getMenuItems() {
  return api.get("/menu-items");
}

// Menambahkan menu makanan baru ke database server.
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

// Memperbarui detail informasi atau ketersediaan menu makanan berdasarkan ID.
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

// Menghapus menu makanan tertentu dari server berdasarkan ID.
export async function deleteMenuItem(id: string) {
  return api.delete(`/menu-items/${id}`);
}
