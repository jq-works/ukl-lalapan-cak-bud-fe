import { api } from "../api";

// Mengambil seluruh daftar kategori menu makanan dari server.
export async function getCategories() {
  return api.get("/categories");
}

// Membuat kategori menu baru di server.
export async function createCategory(payload: { name: string }) {
  return api.post("/categories", payload);
}

// Memperbarui nama kategori menu makanan berdasarkan ID.
export async function updateCategory(id: string, payload: { name: string }) {
  return api.patch(`/categories/${id}`, payload);
}

// Menghapus kategori menu makanan berdasarkan ID.
export async function deleteCategory(id: string) {
  return api.delete(`/categories/${id}`);
}
