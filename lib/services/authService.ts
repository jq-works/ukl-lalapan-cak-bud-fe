import { api } from "../api";

// Mengirim kredensial login email dan password ke server.
export const login = (email: string, password: string) => api.post("/auth/login", { email, password });

// Mendaftarkan member baru dengan data nama, email, sandi, dan no HP.
export const register = (payload: { name: string; email: string; password?: string; phone: string }) => api.post("/auth/register", payload);

// Memperbarui data profil pengguna saat ini ke server.
export const updateProfile = (payload: { name: string; phone: string; email: string; oldPassword?: string; newPassword?: string }) => api.patch("/auth/update-profile", payload);
