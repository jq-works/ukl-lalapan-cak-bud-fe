"use client";

import React from "react";
import { FiAlertCircle, FiImage } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiCategory {
  id: string;
  name: string;
}

interface ApiMenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: string;
  category?: ApiCategory;
}

interface MenuItemModalProps {
  // Form Modal Props
  isItemModalOpen: boolean;
  setIsItemModalOpen: (open: boolean) => void;
  editingItem: ApiMenuItem | null;
  itemFormName: string;
  setItemFormName: (val: string) => void;
  itemFormPrice: string;
  setItemFormPrice: (val: string) => void;
  itemFormCategoryId: string;
  setItemFormCategoryId: (val: string) => void;
  itemFormDescription: string;
  setItemFormDescription: (val: string) => void;
  itemFormImageUrl: string;
  setItemFormImageUrl: (val: string) => void;
  itemFormIsAvailable: boolean;
  setItemFormIsAvailable: (val: boolean) => void;
  itemFormError: string | null;
  setItemFormError: (val: string | null) => void;
  categories: ApiCategory[];
  handleItemSubmit: (e: React.FormEvent) => void;

  // Delete Modal Props
  deletingItem: ApiMenuItem | null;
  setDeletingItem: (item: ApiMenuItem | null) => void;
  handleDeleteItem: () => void;
}

export function MenuItemModal({
  isItemModalOpen,
  setIsItemModalOpen,
  editingItem,
  itemFormName,
  setItemFormName,
  itemFormPrice,
  setItemFormPrice,
  itemFormCategoryId,
  setItemFormCategoryId,
  itemFormDescription,
  setItemFormDescription,
  itemFormImageUrl,
  setItemFormImageUrl,
  itemFormIsAvailable,
  setItemFormIsAvailable,
  itemFormError,
  setItemFormError,
  categories,
  handleItemSubmit,
  deletingItem,
  setDeletingItem,
  handleDeleteItem,
}: MenuItemModalProps) {
  return (
    <>
      {/* DIALOG 1: FORM MAKANAN MODAL (ADD / EDIT) */}
      <AlertDialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          <form onSubmit={handleItemSubmit}>
            <AlertDialogHeader className="border-b border-stone-100 flex flex-row items-center justify-between p-6 py-5">
              <AlertDialogTitle className="font-bold text-stone-900 text-base">
                {editingItem ? "Ubah Data Makanan" : "Tambah Makanan Baru"}
              </AlertDialogTitle>
              <button 
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </AlertDialogHeader>

            <div className="p-6 space-y-4">
              {itemFormError && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{itemFormError}</span>
                </div>
              )}

              {/* Item Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Nama Makanan *</label>
                <input
                  type="text"
                  placeholder="Contoh: Lalapan Lele Bakar Cak Bud"
                  value={itemFormName}
                  onChange={(e) => setItemFormName(e.target.value)}
                  className="w-full h-11 px-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Harga Makanan (Rp) *</label>
                  <input
                    type="number"
                    placeholder="Contoh: 18000"
                    value={itemFormPrice}
                    onChange={(e) => setItemFormPrice(e.target.value)}
                    className="w-full h-11 px-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Category ID */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Kategori *</label>
                  <Select
                    value={itemFormCategoryId}
                    onValueChange={(val) => setItemFormCategoryId(val)}
                  >
                    <SelectTrigger 
                      className="w-full !h-11 px-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all flex items-center justify-between text-stone-750"
                    >
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white border border-stone-150 rounded-xl shadow-md p-1">
                      {categories.map(c => (
                        <SelectItem 
                          key={c.id} 
                          value={c.id}
                          className="text-xs font-semibold text-stone-750 focus:bg-stone-50 focus:text-stone-900 rounded-lg py-2.5 px-3 cursor-pointer"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Deskripsi Lengkap</label>
                <textarea
                  placeholder="Tuliskan isian lalapan, bumbu, level pedas sambal..."
                  value={itemFormDescription}
                  onChange={(e) => setItemFormDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-[70px] resize-none"
                />
              </div>

              {/* Image Upload Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Gambar Menu</label>
                
                {/* Image Preview if available */}
                {itemFormImageUrl ? (
                  <div className="flex items-center gap-4 p-3 bg-stone-50 border border-stone-100 rounded-xl">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/50 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={itemFormImageUrl} 
                        alt="Pratinjau Gambar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-700 font-bold truncate">
                        {itemFormImageUrl.startsWith("data:") ? "Gambar Lokal Terunggah" : itemFormImageUrl}
                      </p>
                      <p className="text-[9px] text-stone-400 font-semibold mt-0.5 uppercase tracking-wider">
                        {itemFormImageUrl.startsWith("data:") ? "Format Base64 Data URL" : "Format Web Link"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setItemFormImageUrl("")}
                        className="text-[10px] text-red-600 font-bold hover:text-red-700 mt-1 cursor-pointer"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Local Laptop Upload Option */}
                    <label className="border-2 border-dashed border-stone-200 hover:border-primary-500 hover:bg-stone-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                      <FiImage className="w-8 h-8 text-stone-400 mb-1.5" />
                      <span className="text-[11px] font-bold text-stone-700">Unggah dari Laptop</span>
                      <span className="text-[9px] text-stone-400 mt-0.5">Maks. 2MB (PNG/JPG)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          if (file.size > 2 * 1024 * 1024) {
                            setItemFormError("Ukuran gambar terlalu besar (maksimal 2MB)");
                            return;
                          }
         
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setItemFormImageUrl(reader.result);
                            }
                          };
                          reader.onerror = () => {
                            setItemFormError("Gagal membaca file gambar");
                          };
                          reader.readAsDataURL(file);
                        }} 
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100/50">
                <div>
                  <span className="text-xs font-bold text-stone-850">Status Ketersediaan</span>
                  <p className="text-[10px] text-stone-400 font-medium">Bisa diganti dengan cepat di kartu menu.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setItemFormIsAvailable(!itemFormIsAvailable)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                    itemFormIsAvailable ? "bg-primary-500" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-250 ease-in-out ${
                      itemFormIsAvailable ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <AlertDialogFooter>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-stone-200 bg-white px-5 text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-500 px-5 text-xs font-bold text-white shadow-md shadow-green-200/50 hover:bg-primary-600 active:scale-95 transition-all cursor-pointer"
              >
                Simpan Menu
              </button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT DIALOG 1: HAPUS MENU CONFIRMATION */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => { if (!open) setDeletingItem(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <span className="font-bold text-stone-900">{deletingItem?.name}</span> dari daftar menu? Aksi ini permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem} 
              className="bg-red-650 hover:bg-red-700 shadow-none text-white cursor-pointer"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
