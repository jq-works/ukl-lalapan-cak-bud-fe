"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, updateProfile, error, setError } = useAuth();
  const { showAlert } = useAlert();

  // Profile Form States
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  // Password Form States
  const [pwdOldPassword, setPwdOldPassword] = useState("");
  const [pwdNewPassword, setPwdNewPassword] = useState("");
  const [pwdConfirmPassword, setPwdConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize form values from user context
  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setFormPhone(user.phone || "");
      setFormEmail(user.email || "");
    }
  }, [user]);

  // Clean error state on mount/unmount
  useEffect(() => {
    setError(null);
    return () => {
      setError(null);
    };
  }, [setError]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
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
      setEditError("Kata sandi saat ini wajib diisi untuk verifikasi perubahan.");
      return;
    }

    setIsUpdatingProfile(true);
    setEditError(null);
    setError(null);

    const success = await updateProfile(
      formName.trim(),
      formPhone.trim(),
      formEmail.trim(),
      editConfirmPassword
    );

    if (success) {
      showAlert("Profil admin berhasil diperbarui.", "Profil Diperbarui");
      setEditConfirmPassword("");
    } else {
      setTimeout(() => {
        setEditError(error || "Gagal memperbarui profil. Pastikan kata sandi benar.");
      }, 55);
    }
    setIsUpdatingProfile(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
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

    setIsUpdatingPassword(true);
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
      showAlert("Kata sandi admin berhasil diperbarui.", "Kata Sandi Diperbarui");
      setPwdOldPassword("");
      setPwdNewPassword("");
      setPwdConfirmPassword("");
    } else {
      setTimeout(() => {
        setPasswordError(error || "Gagal mengubah kata sandi. Pastikan kata sandi saat ini benar.");
      }, 55);
    }
    setIsUpdatingPassword(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Pengaturan Dashboard</h2>
        <p className="text-stone-500 text-sm mt-1">Ubah informasi profil dan kata sandi administrator Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Profile Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-lg">
                {user?.name?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-stone-400" />
                  Profil Administrator
                </h3>
                <p className="text-xs text-stone-400">Kelola identitas utama akun Anda</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Nomor Telepon</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Nomor Telepon (misal: 08123456789)"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Alamat Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              <div className="h-px bg-stone-100 my-4" />

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-red-500 uppercase tracking-wider">Kata Sandi Saat Ini *</label>
                <div className="relative">
                  <input
                    type={showProfilePassword ? "text" : "password"}
                    value={editConfirmPassword}
                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                    placeholder="Masukkan kata sandi saat ini untuk menyimpan perubahan"
                    className="w-full h-11 pl-4 pr-10 border-2 border-primary-500/30 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowProfilePassword(!showProfilePassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showProfilePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {editError && (
                <p className="text-[10px] font-semibold text-red-650 mt-2">{editError}</p>
              )}

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full h-11 flex items-center justify-center rounded-xl bg-primary-500 text-xs font-bold text-white shadow-md shadow-green-200/50 hover:bg-primary-600 transition-all duration-200 disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none active:scale-95 cursor-pointer mt-4"
              >
                {isUpdatingProfile ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <span>Simpan Perubahan Profil</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Card 2: Password Reset Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 font-bold text-lg">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  Ubah Kata Sandi
                </h3>
                <p className="text-xs text-stone-400">Jaga keamanan akun Anda secara berkala</p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Kata Sandi Saat Ini *</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={pwdOldPassword}
                    onChange={(e) => setPwdOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama"
                    className="w-full h-11 pl-4 pr-10 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showOldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Kata Sandi Baru *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={pwdNewPassword}
                    onChange={(e) => setPwdNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-11 pl-4 pr-10 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Konfirmasi Kata Sandi Baru *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={pwdConfirmPassword}
                    onChange={(e) => setPwdConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full h-11 pl-4 pr-10 border border-stone-200 rounded-xl text-xs font-semibold text-stone-850 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <p className="text-[10px] font-semibold text-red-650 mt-2">{passwordError}</p>
              )}

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full h-11 flex items-center justify-center rounded-xl bg-primary-500 text-xs font-bold text-white shadow-md shadow-green-200/50 hover:bg-primary-600 transition-all duration-200 disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none active:scale-95 cursor-pointer mt-4"
              >
                {isUpdatingPassword ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <span>Perbarui Kata Sandi</span>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
