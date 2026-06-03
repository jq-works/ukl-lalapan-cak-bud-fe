import { api } from "../api";

export async function getReviews() {
  return api.get("/reviews");
}

export async function createReview(payload: {
  rating: number;
  menuReview: string;
  suggestions?: string;
}) {
  return api.post("/reviews", payload);
}

export async function deleteReview(id: string) {
  return api.delete(`/reviews/${id}`);
}
