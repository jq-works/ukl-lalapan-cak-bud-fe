"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CustomerNavbar from "@/components/customer/navbar";
import { BottomNav } from "@/components/customer/BottomNav";
import CustomerFooter from "@/components/customer/Footer";
import { FloatingCartBtn } from "@/components/customer/FloatingCartBtn";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const { login, user, isAuthenticated, isLoading, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  // Reset errors when inputs change
  useEffect(() => {
    setLocalError(null);
    setError(null);
  }, [email, password, setError]);

  // Handle post-auth redirection in case already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setLocalError("Semua kolom wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Kata sandi minimal harus 6 karakter.");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Redirection is handled by the useEffect watching isAuthenticated
      }
    } catch (err: any) {
      setLocalError(err.message || "Gagal masuk. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-start text-stone-850">
      <CustomerNavbar />
      
      <main className="max-w-md w-full mx-auto px-4 pt-10 pb-32 flex-grow flex flex-col justify-center">
        <div className="fade-in space-y-6 w-full">
          
          {/* Logo and Brand */}
          <div className="text-center">
            <img 
              src="/images/logo_cakbud.png" 
              alt="Logo Cak Bud" 
              className="h-16 w-auto object-contain mx-auto mb-3 select-none pointer-events-none"
            />
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Lalapan <span className="text-primary-500">Cak Bud</span>
            </h1>
            <p className="text-stone-500 text-xs mt-2">
              Selamat datang kembali! Silakan masuk ke akun Anda.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-stone-150 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Message */}
              {(localError || error) && (
                <Alert variant="destructive" className="animate-shake">
                  <FiAlertCircle className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <AlertTitle>Gagal Masuk</AlertTitle>
                    <AlertDescription>{localError || error}</AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@mail.com"
                    className="w-full h-11 bg-stone-50/50 border border-stone-250 rounded-xl pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 bg-stone-50/50 border border-stone-250 rounded-xl pl-10 pr-10 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold shadow-md shadow-green-200/50 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer mt-2 text-xs"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Masuk Ke Akun"
                )}
              </button>
            </form>

            {/* Redirection Links */}
            <div className="text-center text-xs text-stone-500 pt-2">
              Belum punya akun?{" "}
              <Link 
                href="/register" 
                className="text-primary-500 hover:underline font-bold transition-colors"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CustomerFooter />
      <FloatingCartBtn />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
