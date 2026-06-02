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
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading, error, setError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Reset errors when inputs change
  useEffect(() => {
    setLocalError(null);
    setError(null);
  }, [name, email, password, phone, setError]);

  // Handle post-auth redirection in case already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !phone) {
      setLocalError("Semua kolom wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Kata sandi minimal harus 6 karakter.");
      return;
    }

    // Basic phone number validation
    if (!/^[0-9+]{8,15}$/.test(phone.replace(/\s+/g, ""))) {
      setLocalError("Nomor telepon tidak valid. Gunakan angka.");
      return;
    }

    try {
      const success = await register(name, email, password, phone);
      if (success) {
        setIsSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setLocalError(err.message || "Gagal mendaftar. Silakan coba lagi.");
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
              Mulai nikmati kelezatan lalapan dengan mendaftarkan akun Anda.
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-white border border-stone-150 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center">
                  <FiCheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Registrasi Berhasil!</h3>
                  <p className="text-stone-400 text-xs mt-1">
                    Mengarahkan Anda ke halaman login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Message */}
                {(localError || error) && (
                  <Alert variant="destructive" className="animate-shake">
                    <FiAlertCircle className="w-4 h-4 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <AlertTitle>Pendaftaran Gagal</AlertTitle>
                      <AlertDescription>{localError || error}</AlertDescription>
                    </div>
                  </Alert>
                )}

                {/* Name Field */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="w-full h-11 bg-stone-50/50 border border-stone-250 rounded-xl pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="nama@email.com"
                      className="w-full h-11 bg-stone-50/50 border border-stone-250 rounded-xl pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
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

                {/* Register CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold shadow-md shadow-green-200/50 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer mt-2 text-xs"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mendaftarkan...</span>
                    </div>
                  ) : (
                    "Buat Akun Baru"
                  )}
                </button>
              </form>
            )}

            {/* Redirection Links */}
            <div className="text-center text-xs text-stone-500 pt-2">
              Sudah memiliki akun?{" "}
              <Link 
                href="/login" 
                className="text-primary-500 hover:underline font-bold transition-colors"
              >
                Masuk Disini
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
