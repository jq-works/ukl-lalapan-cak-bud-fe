"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { GiChiliPepper } from "react-icons/gi";

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
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      
      {/* Dot Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

      {/* Floating Traditional Food Visual Accent (Traditional Mortar & Pestle/Chili shape in bg) */}
      <div className="absolute -top-16 -right-16 w-64 h-64 border border-white/5 rounded-full bg-white/2 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <GiChiliPepper className="text-white text-9xl rotate-45 transform translate-y-6 -translate-x-6" />
      </div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 border border-white/5 rounded-full bg-white/2 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <MdRestaurantMenu className="text-white text-9xl -rotate-12" />
      </div>

      {/* Back button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/15 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm text-sm"
      >
        <FiArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md z-10 transition-all duration-300">
        
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg mb-4 text-primary-400">
            <span className="text-3xl">🍃</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Lalapan <span className="text-primary-400">Cak Bud</span>
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Selamat datang kembali! Silakan masuk ke akun Anda.
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message */}
            {(localError || error) && (
              <div className="flex items-start gap-2 bg-accent-500/20 border border-accent-500/30 text-white rounded-xl p-3 text-xs leading-relaxed animate-shake">
                <FiAlertCircle className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span>{localError || error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-white/90">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-white/90">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-primary-950/50 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer mt-2"
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
          <div className="mt-6 text-center text-xs text-white/60">
            Belum punya akun?{" "}
            <Link 
              href="/register" 
              className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-4 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>

        {/* Demo Accounts Helper - Premium Glass Box */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-white/50 space-y-1">
          <p className="font-semibold text-white/70">Akun Uji Coba Offline:</p>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            <div>
              <p className="text-white/60 font-medium">👨‍💼 Admin:</p>
              <p className="font-mono text-[10px]">fahry@gmail.com</p>
              <p className="font-mono text-[10px]">Pass: 12345678</p>
            </div>
            <div>
              <p className="text-white/60 font-medium">👤 Customer:</p>
              <p className="font-mono text-[10px]">dzaky@gmail.com</p>
              <p className="font-mono text-[10px]">Pass: 12345678 (min. 6 char)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
