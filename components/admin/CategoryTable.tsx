"use client";

import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

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

interface CategoryTableProps {
  categories: ApiCategory[];
  menuItems: ApiMenuItem[];
  openCategoryForm: (cat: ApiCategory) => void;
  setDeletingCategory: (cat: ApiCategory | null) => void;
}

export function CategoryTable({
  categories,
  menuItems,
  openCategoryForm,
  setDeletingCategory,
}: CategoryTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 border-b border-stone-100 text-xs font-bold uppercase tracking-wider">
              <th className="py-5 px-6">Nama Kategori</th>
              <th className="py-5 px-6 w-56">Jumlah Item Menu</th>
              <th className="py-5 px-6 text-right w-48">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const count = menuItems.filter((m) => m.categoryId === cat.id).length;

                return (
                  <tr key={cat.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-stone-850 text-sm">
                      {cat.name}
                    </td>
                    <td className="py-4 px-6 text-stone-500 font-semibold">
                      {count} Menu
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openCategoryForm(cat)}
                          className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg border border-stone-100 transition-colors cursor-pointer"
                          title="Ubah Kategori"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer"
                          title="Hapus Kategori"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-stone-400 font-semibold">
                  Belum ada kategori terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
