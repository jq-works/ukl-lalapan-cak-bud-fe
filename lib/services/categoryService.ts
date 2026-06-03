import { api } from "../api";

export async function getCategories() {
  return api.get("/categories");
}

export async function createCategory(payload: { name: string }) {
  return api.post("/categories", payload);
}

export async function updateCategory(id: string, payload: { name: string }) {
  return api.patch(`/categories/${id}`, payload);
}

export async function deleteCategory(id: string) {
  return api.delete(`/categories/${id}`);
}
