import { api } from "../api";

// Mengambil seluruh daftar kategori menu makanan dari server.
export const getCategories = () => api.get("/categories");

// Membuat kategori menu baru di server.
export const createCategory = (payload: { name: string }) => api.post("/categories", payload);

// Memperbarui nama kategori menu makanan berdasarkan ID.
export const updateCategory = (id: string, payload: { name: string }) => api.patch(`/categories/${id}`, payload);

// Menghapus kategori menu makanan berdasarkan ID.
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
