import { api } from "../api";

// Mengambil semua data ulasan pelanggan dari server.
export const getReviews = () => api.get("/reviews");

// Mengirim ulasan rating dan kritik saran baru ke server.
export const createReview = (payload: {
  rating: number;
  menuReview: string;
  suggestions?: string;
}) => api.post("/reviews", payload);

// Menghapus ulasan pelanggan tertentu berdasarkan ID (Admin).
export const deleteReview = (id: string) => api.delete(`/reviews/${id}`);
