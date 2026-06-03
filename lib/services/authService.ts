import { api } from "../api";

// Mengirim kredensial login email dan password ke server.
export async function login(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}

// Mendaftarkan member baru dengan data nama, email, sandi, dan no HP.
export async function register(payload: { name: string; email: string; password?: string; phone: string }) {
  return api.post("/auth/register", payload);
}

// Memperbarui data profil pengguna saat ini ke server.
export async function updateProfile(payload: {
  name: string;
  phone: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}) {
  return api.patch("/auth/update-profile", payload);
}
