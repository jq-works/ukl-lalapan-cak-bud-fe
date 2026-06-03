"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";
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

interface ApiCategory {
  id: string;
  name: string;
}

interface CategoryModalProps {
  // Form Modal
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  editingCategory: ApiCategory | null;
  categoryFormName: string;
  setCategoryFormName: (val: string) => void;
  categoryFormError: string | null;
  handleCategorySubmit: (e: React.FormEvent) => void;

  // Delete Modal
  deletingCategory: ApiCategory | null;
  setDeletingCategory: (cat: ApiCategory | null) => void;
  handleDeleteCategory: () => void;
}

export function CategoryModal({
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  editingCategory,
  categoryFormName,
  setCategoryFormName,
  categoryFormError,
  handleCategorySubmit,
  deletingCategory,
  setDeletingCategory,
  handleDeleteCategory,
}: CategoryModalProps) {
  return (
    <>
      {/* DIALOG: FORM KATEGORI MODAL (ADD / EDIT) */}
      <AlertDialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <AlertDialogContent className="sm:max-w-sm">
          <form onSubmit={handleCategorySubmit}>
            <AlertDialogHeader className="border-b border-stone-100 flex flex-row items-center justify-between p-6 py-5">
              <AlertDialogTitle className="font-bold text-stone-900 text-base">
                {editingCategory ? "Ubah Nama Kategori" : "Tambah Kategori Baru"}
              </AlertDialogTitle>
              <button 
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-stone-400 hover:text-stone-650 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </AlertDialogHeader>

            <div className="p-6 space-y-4">
              {categoryFormError && (
                <div className="p-3 bg-red-50 text-red-605 border border-red-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{categoryFormError}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Nama Kategori *</label>
                <input
                  type="text"
                  placeholder="Contoh: Lalapan, Penyet, Cemilan..."
                  value={categoryFormName}
                  onChange={(e) => setCategoryFormName(e.target.value)}
                  className="w-full h-11 px-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <AlertDialogFooter>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-stone-200 bg-white px-5 text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-500 px-5 text-xs font-bold text-white shadow-md shadow-green-200/50 hover:bg-primary-600 active:scale-95 transition-all cursor-pointer"
              >
                Simpan Kategori
              </button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT DIALOG: HAPUS KATEGORI CONFIRMATION */}
      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => { if (!open) setDeletingCategory(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-stone-900">{deletingCategory?.name}</span>? 
              <br /><br />
              <span className="text-red-600 font-semibold block bg-red-50 p-3 rounded-xl border border-red-100 text-xs">
                ⚠️ PERHATIAN: Semua menu yang termasuk dalam kategori ini akan secara otomatis kehilangan kategori / dipindahkan.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory} 
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
