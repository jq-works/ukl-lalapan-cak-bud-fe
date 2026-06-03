"use client";

import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FoodImage } from "@/components/ui/FoodImage";

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

interface MenuItemsListProps {
  items: ApiMenuItem[];
  viewMode: "grid" | "list";
  handleToggleAvailability: (item: ApiMenuItem) => void;
  openItemForm: (item: ApiMenuItem) => void;
  setDeletingItem: (item: ApiMenuItem | null) => void;
}

export function MenuItemsList({
  items,
  viewMode,
  handleToggleAvailability,
  openItemForm,
  setDeletingItem,
}: MenuItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 bg-white border border-stone-200/60 rounded-3xl text-center text-stone-400 font-bold uppercase tracking-wider text-xs shadow-sm">
        Tidak ada menu ditemukan.
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all group ${
              item.isAvailable ? "border-stone-100 hover:shadow-md" : "border-stone-155 bg-stone-50/50 opacity-90"
            }`}
          >
            <div>
              {/* Food Image Container */}
              <div className="relative w-full h-44 bg-stone-100 overflow-hidden">
                <FoodImage 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
                    !item.isAvailable && "filter grayscale-[40%]"
                  }`} 
                />
                {/* Category Badge overlay */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-stone-100 text-stone-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full select-none shadow-sm">
                  {item.category?.name || "Kategori"}
                </span>

                {/* Availability status badge */}
                {!item.isAvailable && (
                  <span className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest select-none">
                    Habis
                  </span>
                )}
              </div>

              {/* Text Details */}
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-stone-850 text-sm leading-tight line-clamp-1">{item.name}</h3>
                <p className="text-stone-500 text-xs line-clamp-2 min-h-[2rem]">
                  {item.description || "Tidak ada deskripsi."}
                </p>
                <p className="font-bold text-stone-900 text-sm pt-2">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 border-t border-stone-100 bg-stone-50/40 flex items-center justify-between gap-4">
              {/* Switch button */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-500 font-semibold select-none">
                  {item.isAvailable ? "Tersedia" : "Habis"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(item)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                    item.isAvailable ? "bg-primary-500" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-250 ease-in-out ${
                      item.isAvailable ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openItemForm(item)}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg border border-stone-100 transition-colors cursor-pointer"
                  title="Edit Menu"
                >
                  <FiEdit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(item)}
                  className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer"
                  title="Hapus Menu"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-stone-50 text-stone-500 border-b border-stone-100 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6 w-24">Gambar</th>
              <th className="py-4 px-6">Nama Menu</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6 w-36">Harga</th>
              <th className="py-4 px-6 w-36">Ketersediaan</th>
              <th className="py-4 px-6 text-right w-36">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                {/* Image */}
                <td className="py-3.5 px-6">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
                    <FoodImage 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </td>

                {/* Name & Desc */}
                <td className="py-3.5 px-6">
                  <p className="font-bold text-stone-850 text-sm">{item.name}</p>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 max-w-[280px]">
                    {item.description || "Tidak ada deskripsi."}
                  </p>
                </td>

                {/* Category */}
                <td className="py-3.5 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 bg-stone-50 text-stone-700 border border-stone-100 rounded-lg text-[10px] font-bold">
                    {item.category?.name || "Kategori"}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-6 font-bold text-stone-900 text-sm">
                  Rp {item.price.toLocaleString("id-ID")}
                </td>

                {/* Availability */}
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500 font-semibold select-none">
                      {item.isAvailable ? "Tersedia" : "Habis"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                        item.isAvailable ? "bg-primary-500" : "bg-stone-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-250 ease-in-out ${
                          item.isAvailable ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openItemForm(item)}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg border border-stone-100 transition-colors cursor-pointer"
                      title="Edit Menu"
                    >
                      <FiEdit className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer"
                      title="Hapus Menu"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
