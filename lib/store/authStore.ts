import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "../api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
  updateProfile: (name: string, phone: string, email: string, oldPassword: string, newPassword?: string) => Promise<boolean>;
}

// Helper to decode JWT token payload locally
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT locally:", e);
    return null;
  }
}

// Helper to clear all cookies thoroughly
const clearCookies = () => {
  if (typeof document === "undefined") return;
  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (!name) continue;
      
      Cookies.remove(name, { path: "/" });
      Cookies.remove(name, { path: "/", domain: window.location.hostname });
      
      const domainParts = window.location.hostname.split(".");
      if (domainParts.length > 2) {
        const rootDomain = domainParts.slice(-2).join(".");
        Cookies.remove(name, { path: "/", domain: `.${rootDomain}` });
      }
    }
  } catch (err) {
    console.error("Error resetting cookies:", err);
  }
};

// Initial state retrieval
const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  const token = Cookies.get("cakbud_token") || localStorage.getItem("cakbud_token") || null;
  let user: UserProfile | null = null;
  const savedUser = localStorage.getItem("cakbud_user");
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error("Error parsing stored user data:", e);
    }
  }

  return {
    token,
    user,
    isAuthenticated: !!token,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ error: null, isLoading: true });

    // Reset session
    clearCookies();
    if (typeof window !== "undefined") {
      localStorage.removeItem("cakbud_token");
      localStorage.removeItem("cakbud_user");
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || "Email atau kata sandi salah.");
      }

      const userToken = data.data?.access_token || data.data?.token || data.data?.accessToken || data.token || data.accessToken || data.access_token;

      if (!userToken) {
        throw new Error("Token autentikasi tidak ditemukan dalam respon server.");
      }

      const decoded = decodeJwt(userToken);
      const apiUser = data.data?.user || data.user;
      const userRole = apiUser?.role || decoded?.role || "CUSTOMER";
      const userName = apiUser?.name || decoded?.name || email.split("@")[0];

      const userProfile: UserProfile = {
        id: apiUser?.id || decoded?.sub || "user-id",
        name: userName,
        email: apiUser?.email || email,
        role: userRole.toUpperCase() === "ADMIN" ? "ADMIN" : "CUSTOMER",
        phone: apiUser?.phone || decoded?.phone || "",
      };

      // Set cookie using js-cookie
      Cookies.set("cakbud_token", userToken, { expires: 7, path: "/", sameSite: "Lax" });
      
      if (typeof window !== "undefined") {
        localStorage.setItem("cakbud_token", userToken);
        localStorage.setItem("cakbud_user", JSON.stringify(userProfile));
      }

      set({
        token: userToken,
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Gagal masuk. Silakan periksa koneksi internet Anda.";
      console.error("Connection to API failed:", errMsg);
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  register: async (name, email, password, phone) => {
    set({ error: null, isLoading: true });

    try {
      const response = await api.post("/auth/register", { name, email, password, phone });
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || "Gagal melakukan registrasi.");
      }

      set({ isLoading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Gagal melakukan registrasi. Silakan periksa koneksi internet Anda.";
      console.error("Connection to API failed:", errMsg);
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    clearCookies();
    if (typeof window !== "undefined") {
      localStorage.removeItem("cakbud_token");
      localStorage.removeItem("cakbud_user");
      // Use client-side router navigation if wrapped, or fallback to location redirect
      window.location.href = "/";
    }
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setError: (error) => set({ error }),

  updateProfile: async (name, phone, email, oldPassword, newPassword) => {
    set({ error: null, isLoading: true });
    try {
      const payload: any = { name, phone, email, oldPassword };
      if (newPassword) {
        payload.newPassword = newPassword;
      }
      const response = await api.post("/auth/update-profile", payload);
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || "Gagal memperbarui profil.");
      }

      const apiUser = data.data?.user || data.data || data.user;
      set((state) => {
        if (!state.user) return {};
        const updatedUser = {
          ...state.user,
          name: apiUser?.name || name,
          phone: apiUser?.phone || phone,
          email: apiUser?.email || email,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("cakbud_user", JSON.stringify(updatedUser));
        }
        return { user: updatedUser, isLoading: false };
      });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Gagal memperbarui profil.";
      console.error("Gagal update profil:", errMsg);
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },
}));

