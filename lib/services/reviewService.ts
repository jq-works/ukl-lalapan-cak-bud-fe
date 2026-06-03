import { api } from "../api";

// Mengambil semua data ulasan pelanggan dari server.
export async function getReviews() {
  return api.get("/reviews");
}

// Mengirim ulasan rating dan kritik saran baru ke server.
export async function createReview(payload: {
  rating: number;
  menuReview: string;
  suggestions?: string;
}) {
  return api.post("/reviews", payload);
}

// Menghapus ulasan pelanggan tertentu berdasarkan ID (Admin).
export async function deleteReview(id: string) {
  return api.delete(`/reviews/${id}`);
}
