"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Award, ShieldAlert, LogOut, ChevronRight, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AccountSection() {
  const { user, isAuthenticated, logout, updateProfile, error, setError } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [pwdOldPassword, setPwdOldPassword] = useState("");
  const [pwdNewPassword, setPwdNewPassword] = useState("");
  const [pwdConfirmPassword, setPwdConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setFormPhone(user.phone || "");
      setFormEmail(user.email || "");
    }
  }, [user]);

  // Reset errors when edit profile dialog open state changes
  useEffect(() => {
    if (isEditOpen) {
      setError(null);
      setEditError(null);
      setEditConfirmPassword("");
    }
  }, [isEditOpen, setError]);

  // Reset errors when change password dialog open state changes
  useEffect(() => {
    if (isPasswordOpen) {
      setError(null);
      setPasswordError(null);
      setPwdOldPassword("");
      setPwdNewPassword("");
      setPwdConfirmPassword("");
    }
  }, [isPasswordOpen, setError]);

  const handleUpdateProfile = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setEditError("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!formEmail.trim()) {
      setEditError("Alamat email tidak boleh kosong.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      setEditError("Format email tidak valid.");
      return;
    }
    if (!editConfirmPassword) {
      setEditError("Kata sandi saat ini wajib diisi untuk verifikasi.");
      return;
    }

    setIsUpdating(true);
    setEditError(null);
    setError(null);
    
    const success = await updateProfile(
      formName.trim(), 
      formPhone.trim(), 
      formEmail.trim(), 
      editConfirmPassword
    );
    if (success) {
      setIsEditOpen(false);
      showAlert("Profil Anda berhasil diperbarui.", "Profil Diperbarui");
    }
    setIsUpdating(false);
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!pwdOldPassword) {
      setPasswordError("Kata sandi saat ini wajib diisi.");
      return;
    }
    if (!pwdNewPassword) {
      setPasswordError("Kata sandi baru tidak boleh kosong.");
      return;
    }
    if (pwdNewPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (pwdNewPassword !== pwdConfirmPassword) {
      setPasswordError("Kata sandi baru tidak cocok dengan konfirmasi.");
      return;
    }

    setIsUpdating(true);
    setPasswordError(null);
    setError(null);
    
    const success = await updateProfile(
      user.name, 
      user.phone || "", 
      user.email, 
      pwdOldPassword, 
      pwdNewPassword
    );
    if (success) {
      setIsPasswordOpen(false);
      showAlert("Kata sandi Anda berhasil diperbarui.", "Kata Sandi Diperbarui");
    }
    setIsUpdating(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6 max-w-md mx-auto py-8 px-4 text-center">
        {/* Lock / Log In Prompt Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-primary-100/60 border border-primary-200/50 flex items-center justify-center text-primary-600 animate-pulse mb-6">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-stone-900">Gabung Bersama Kami!</h2>
          <p className="text-stone-500 text-xs leading-relaxed max-w-sm mx-auto">
            Nikmati kemudahan melacak pesanan aktif secara real-time dan lakukan checkout instan tanpa mengisi ulang data.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          {/* CTA: Go to login page */}
          <button
            onClick={() => router.push("/login")}
            className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-md shadow-green-200/60 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Masuk ke Akun Anda
          </button>
          
          {/* Link to register page */}
          <p className="text-xs text-stone-400">
            Belum punya akun?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-primary-500 font-bold hover:underline cursor-pointer"
            >
              Daftar Akun Baru
            </button>
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 pt-8 border-t border-stone-150">
          <div className="p-3 bg-white border border-stone-100 rounded-xl text-left space-y-1">
            <Award className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-bold text-stone-800">Lacak Pesanan</p>
            <p className="text-[10px] text-stone-400 font-medium">Pantau pesanan Anda secara real-time.</p>
          </div>
          <div className="p-3 bg-white border border-stone-100 rounded-xl text-left space-y-1">
            <User className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-bold text-stone-800">Checkout Instan</p>
            <p className="text-[10px] text-stone-400 font-medium">Pesan lebih cepat tanpa input ulang.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-stone-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-250">
        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-700 border border-primary-500/20 flex-shrink-0 select-none font-bold text-xl">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-stone-900 leading-tight">
            {user.name}
          </h3>
          <p className="text-xs text-stone-400 font-medium leading-none">
            {user.email} {user.phone && `· ${user.phone}`}
          </p>
        </div>
      </div>

      {/* Settings Options List */}
      <div className="bg-white border border-stone-150 rounded-2xl overflow-hidden shadow-sm">
        {/* Option: Edit Profil */}        {/* Option 1: Edit Profil */}
        <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <AlertDialogTrigger asChild>
            <div className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Edit Profil</p>
                  <p className="text-[11px] text-stone-400 font-medium">Ubah nama lengkap, nomor telepon, dan email Anda</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Ubah Profil Saya</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Perbarui data diri Anda. Masukkan kata sandi saat ini untuk memverifikasi perubahan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Form Fields */}
            <div className="space-y-3 px-6 pb-6 pt-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Nomor Telepon</label>
                <input 
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Nomor Telepon (misal: 08123456789)"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Alamat Email</label>
                <input 
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              <div className="h-px bg-stone-100 my-4" />

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-red-500 uppercase tracking-wider">Kata Sandi Saat Ini *</label>
                <input 
                  type="password"
                  value={editConfirmPassword}
                  onChange={(e) => setEditConfirmPassword(e.target.value)}
                  placeholder="Masukkan kata sandi saat ini"
                  className="w-full h-11 px-4 border-2 border-primary-500/30 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-450 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              {(editError || error) && (
                <p className="text-[10px] font-semibold text-red-600 mt-2">{editError || error}</p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                if (user) {
                  setFormName(user.name);
                  setFormPhone(user.phone || "");
                  setFormEmail(user.email || "");
                }
                setEditError(null);
                setEditConfirmPassword("");
              }}>
                Batal
              </AlertDialogCancel>
              <button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-500 px-5 text-xs font-bold text-white shadow-md shadow-green-200/50 transition-all duration-200 hover:bg-primary-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none active:scale-95 cursor-pointer"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Option 2: Ubah Kata Sandi */}
        <AlertDialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <AlertDialogTrigger asChild>
            <div className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Ubah Kata Sandi</p>
                  <p className="text-[11px] text-stone-400 font-medium">Perbarui kata sandi akun Anda secara berkala</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Ubah Kata Sandi</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Ubah kata sandi akun Anda secara berkala untuk menjaga keamanan data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Form Fields */}
            <div className="space-y-3 px-6 pb-6 pt-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Kata Sandi Saat Ini *</label>
                <input 
                  type="password"
                  value={pwdOldPassword}
                  onChange={(e) => setPwdOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Kata Sandi Baru *</label>
                <input 
                  type="password"
                  value={pwdNewPassword}
                  onChange={(e) => setPwdNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Konfirmasi Kata Sandi Baru *</label>
                <input 
                  type="password"
                  value={pwdConfirmPassword}
                  onChange={(e) => setPwdConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              {(passwordError || error) && (
                <p className="text-[10px] font-semibold text-red-600 mt-2">{passwordError || error}</p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setPwdOldPassword("");
                setPwdNewPassword("");
                setPwdConfirmPassword("");
                setPasswordError(null);
              }}>
                Batal
              </AlertDialogCancel>
              <button 
                onClick={handleResetPassword}
                disabled={isUpdating}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-500 px-5 text-xs font-bold text-white shadow-md shadow-green-200/50 transition-all duration-200 hover:bg-primary-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none active:scale-95 cursor-pointer"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <span>Ubah Kata Sandi</span>
                )}
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>



        {/* Option 2: Help Center */}
        <div 
          onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
          className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-xs font-bold text-stone-800">Pusat Bantuan</p>
              <p className="text-[11px] text-stone-400 font-medium">Hubungi CS Lalapan Cak Bud jika ada kendala</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Option 3: Logout Action */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-600 cursor-pointer transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold">Keluar Akun</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin keluar dari akun Lalapan Cak Bud?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 shadow-none">
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* App Version Info */}
      <div className="text-center py-2">
        <p className="text-[10px] text-stone-400 font-medium">
          Lalapan Cak Bud App v1.1.0 (Next.js 16)
        </p>
      </div>
    </div>
  );
}
