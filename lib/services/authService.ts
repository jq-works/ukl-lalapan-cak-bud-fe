import { api } from "../api";

export async function login(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}

export async function register(payload: { name: string; email: string; password?: string; phone: string }) {
  return api.post("/auth/register", payload);
}

export async function updateProfile(payload: {
  name: string;
  phone: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}) {
  return api.patch("/auth/update-profile", payload);
}
