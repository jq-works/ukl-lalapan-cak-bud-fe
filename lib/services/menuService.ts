import { api } from "../api";

// Mengambil semua daftar menu makanan dari server.
export const getMenuItems = () => api.get("/menu-items");

// Menambahkan menu makanan baru ke database server.
export const createMenuItem = (payload: {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) => api.post("/menu-items", payload);

// Memperbarui detail informasi atau ketersediaan menu makanan berdasarkan ID.
export const updateMenuItem = (id: string, payload: {
  name?: string;
  price?: number;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) => api.patch(`/menu-items/${id}`, payload);

// Menghapus menu makanan tertentu dari server berdasarkan ID.
export const deleteMenuItem = (id: string) => api.delete(`/menu-items/${id}`);
