import axios from "axios";
import Cookies from "js-cookie";

let apiURL = process.env.NEXT_PUBLIC_API_URL || "https://lalapancakbudukl-production.up.railway.app";
if (apiURL && !apiURL.startsWith("http://") && !apiURL.startsWith("https://")) {
  apiURL = `https://${apiURL}`;
}

export const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token to Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("cakbud_token") || (typeof window !== "undefined" ? localStorage.getItem("cakbud_token") : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
