"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { api } from "@/lib/api";
import { FoodImage } from "@/components/ui/FoodImage";
import { FOOD_ITEMS, CATEGORIES, FoodItem } from "@/lib/data";
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, 
  FiAlertCircle, FiCheck, FiFolder, FiCoffee, 
  FiGrid, FiList, FiImage, FiRefreshCw
} from "react-icons/fi";
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

export default function AdminMenuPage() {
  const { token } = useAuth();
  const { showAlert } = useAlert();
  
  // Tabs state: "items" (Kelola Makanan) or "categories" (Kelola Kategori)
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");
  
  // Connection state
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Main Data lists
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals & Dialog control states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiMenuItem | null>(null); // null means "Create" mode
  const [deletingItem, setDeletingItem] = useState<ApiMenuItem | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null); // null means "Create" mode
  const [deletingCategory, setDeletingCategory] = useState<ApiCategory | null>(null);

  // Form states for Food Item
  const [itemFormName, setItemFormName] = useState("");
  const [itemFormPrice, setItemFormPrice] = useState("");
  const [itemFormCategoryId, setItemFormCategoryId] = useState("");
  const [itemFormDescription, setItemFormDescription] = useState("");
  const [itemFormImageUrl, setItemFormImageUrl] = useState("");
  const [itemFormIsAvailable, setItemFormIsAvailable] = useState(true);
  const [itemFormError, setItemFormError] = useState<string | null>(null);

  // Form states for Category
  const [categoryFormName, setCategoryFormName] = useState("");
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // 1. Fetch Categories
      const catRes = await api.get("/categories");
      const catData = catRes.data;
      if (catData.success === false) {
        throw new Error(catData.message || "Gagal mengambil data kategori");
      }
      const loadedCategories: ApiCategory[] = catData.data || [];

      // 2. Fetch Menu Items
      const menuRes = await api.get("/menu-items");
      const menuData = menuRes.data;
      if (menuData.success === false) {
        throw new Error(menuData.message || "Gagal mengambil data menu makanan");
      }
      const loadedMenuItems: ApiMenuItem[] = menuData.data || [];

      setCategories(loadedCategories);
      setMenuItems(loadedMenuItems);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      console.error("Connection to production API failed:", errMsg);
      setApiError(errMsg || "Gagal memuat data dari server.");
      showAlert("Gagal memuat data dari server: " + errMsg, "Kesalahan Koneksi Server");
    } finally {
      setIsLoading(false);
    }
  };



  const handleToggleAvailability = async (item: ApiMenuItem) => {
    const updatedStatus = !item.isAvailable;
    
    // Optimistic Update
    const updatedItems = menuItems.map(m => m.id === item.id ? { ...m, isAvailable: updatedStatus } : m);
    setMenuItems(updatedItems);

    try {
      const res = await api.patch(`/menu-items/${item.id}`, { isAvailable: updatedStatus });
      const resData = res.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal memperbarui status di server");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      console.error("Gagal update status ketersediaan ke server:", errMsg);
      showAlert("Gagal mengubah ketersediaan menu di server: " + errMsg, "Gagal Update");
      // Revert optimistic update
      setMenuItems(menuItems);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    const targetId = deletingItem.id;
    try {
      const res = await api.delete(`/menu-items/${targetId}`);
      const resData = res.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal menghapus item dari server");
      }
      
      setMenuItems(prev => prev.filter(m => m.id !== targetId));
      setDeletingItem(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      showAlert("Gagal menghapus menu di server: " + errMsg, "Kesalahan Hapus Menu");
      setDeletingItem(null);
    }
  };

  // OPEN Food Item Form Modal (Create or Edit)
  const openItemForm = (item: ApiMenuItem | null = null) => {
    setItemFormError(null);
    if (item) {
      // Edit mode
      setEditingItem(item);
      setItemFormName(item.name);
      setItemFormPrice(item.price.toString());
      setItemFormCategoryId(item.categoryId);
      setItemFormDescription(item.description || "");
      setItemFormImageUrl(item.imageUrl || "");
      setItemFormIsAvailable(item.isAvailable);
    } else {
      // Create mode
      setEditingItem(null);
      setItemFormName("");
      setItemFormPrice("");
      setItemFormCategoryId(categories[0]?.id || "");
      setItemFormDescription("");
      setItemFormImageUrl("");
      setItemFormIsAvailable(true);
    }
    setIsItemModalOpen(true);
  };

  // SUBMIT Food Item Form (Create or Edit)
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemFormError(null);

    // Basic Validation
    if (!itemFormName.trim()) {
      setItemFormError("Nama makanan wajib diisi");
      return;
    }
    const priceNum = parseFloat(itemFormPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setItemFormError("Harga makanan harus berupa angka valid dan minimal 0");
      return;
    }
    if (!itemFormCategoryId) {
      setItemFormError("Pilih kategori makanan");
      return;
    }

    const matchedCategory = categories.find(c => c.id === itemFormCategoryId);

    const payload = {
      name: itemFormName,
      price: priceNum,
      categoryId: itemFormCategoryId,
      description: itemFormDescription,
      imageUrl: itemFormImageUrl || undefined,
      isAvailable: itemFormIsAvailable
    };

    if (editingItem) {
      // EDIT MENU ITEM
      try {
        const res = await api.patch(`/menu-items/${editingItem.id}`, payload);
        const resData = res.data;
        if (resData.success === false) {
          throw new Error(resData.message || "Gagal menyimpan perubahan ke server");
        }
        
        const updatedItem: ApiMenuItem = {
          ...editingItem,
          ...payload,
          category: matchedCategory
        };
        setMenuItems(prev => prev.map(m => m.id === editingItem.id ? updatedItem : m));
        setIsItemModalOpen(false);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message;
        showAlert("Gagal memperbarui menu di server: " + errMsg, "Gagal Edit Menu");
      }
    } else {
      // CREATE MENU ITEM
      try {
        const res = await api.post("/menu-items", payload);
        const resData = res.data;
        if (resData.success === false) {
          throw new Error(resData.message || "Gagal membuat menu baru di server");
        }
        const data = resData.data || resData;
        
        const realItem: ApiMenuItem = {
          id: data.id || `item-${Date.now()}`,
          ...payload,
          category: matchedCategory
        };
        setMenuItems(prev => [realItem, ...prev]);
        setIsItemModalOpen(false);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message;
        showAlert("Gagal menyimpan menu baru ke server: " + errMsg, "Gagal Tambah Menu");
      }
    }
  };

  // OPEN Category Form Modal (Create or Edit)
  const openCategoryForm = (category: ApiCategory | null = null) => {
    setCategoryFormError(null);
    if (category) {
      setEditingCategory(category);
      setCategoryFormName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryFormName("");
    }
    setIsCategoryModalOpen(true);
  };

  // SUBMIT Category Form (Create or Edit)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError(null);

    if (!categoryFormName.trim()) {
      setCategoryFormError("Nama kategori wajib diisi");
      return;
    }

    // Check Duplicate
    const isDup = categories.some(c => 
      c.name.toLowerCase() === categoryFormName.trim().toLowerCase() && 
      (!editingCategory || c.id !== editingCategory.id)
    );
    if (isDup) {
      setCategoryFormError("Kategori dengan nama tersebut sudah ada");
      return;
    }

    const payload = { name: categoryFormName.trim() };

    if (editingCategory) {
      // EDIT CATEGORY
      try {
        const res = await api.patch(`/categories/${editingCategory.id}`, payload);
        const resData = res.data;
        if (resData.success === false) {
          throw new Error(resData.message || "Gagal mengubah kategori di server");
        }
        
        const updatedCategory: ApiCategory = {
          id: editingCategory.id,
          name: categoryFormName.trim()
        };
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c));
        
        // Update item category tags locally
        setMenuItems(prev => prev.map(m => 
          m.categoryId === editingCategory.id 
            ? { ...m, category: updatedCategory } 
            : m
        ));
        setIsCategoryModalOpen(false);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message;
        showAlert("Gagal mengubah kategori di server: " + errMsg, "Gagal Edit Kategori");
      }
    } else {
      // CREATE CATEGORY
      try {
        const res = await api.post("/categories", payload);
        const resData = res.data;
        if (resData.success === false) {
          throw new Error(resData.message || "Gagal membuat kategori baru di server");
        }
        const data = resData.data || resData;
        
        const realCategory: ApiCategory = {
          id: data.id || `cat-${Date.now()}`,
          name: categoryFormName.trim()
        };
        setCategories(prev => [...prev, realCategory]);
        setIsCategoryModalOpen(false);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message;
        showAlert("Gagal menyimpan kategori baru ke server: " + errMsg, "Gagal Tambah Kategori");
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    const targetId = deletingCategory.id;

    try {
      const res = await api.delete(`/categories/${targetId}`);
      const resData = res.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal menghapus kategori dari server");
      }

      const updatedCategories = categories.filter(c => c.id !== targetId);
      const fallbackCategory = updatedCategories[0];

      setCategories(updatedCategories);
      // Also update any menu items inside this category: move to first category or delete them
      setMenuItems(prev => prev.map(m => {
        if (m.categoryId === targetId) {
          return {
            ...m,
            categoryId: fallbackCategory ? fallbackCategory.id : "",
            category: fallbackCategory || undefined
          };
        }
        return m;
      }));
      setDeletingCategory(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      showAlert("Gagal menghapus kategori di server: " + errMsg, "Kesalahan Hapus Kategori");
      setDeletingCategory(null);
    }
  };

  // Filter food list
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategoryFilter === "Semua" || 
                            (item.category && item.category.name === selectedCategoryFilter) ||
                            (item.categoryId === selectedCategoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Kelola Menu & Kategori</h2>
          <p className="text-stone-500 text-sm mt-1">Daftarkan produk baru, kategorikan, serta sesuaikan stok atau ketersediaan.</p>
        </div>

        {/* Refresh Data Button */}
        <div>
          <button
            onClick={fetchInitialData}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-150/60 hover:bg-stone-200 border border-stone-200/50 text-stone-700 font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95 shadow-xs"
            title="Refresh Data dari Server"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tabs Menu & Add Item/Category Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Switch tab buttons */}
        <div className="flex bg-stone-100 rounded-xl p-1 gap-1 self-start items-center">
          <button
            onClick={() => setActiveTab("items")}
            className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              activeTab === "items" 
                ? "bg-primary-500 text-white shadow-sm" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <FiCoffee className="w-3.5 h-3.5" />
            Daftar Makanan
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              activeTab === "categories" 
                ? "bg-primary-500 text-white shadow-sm" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <FiFolder className="w-3.5 h-3.5" />
            Kategori Menu
          </button>
        </div>

        {/* Dynamic add button based on active tab */}
        {activeTab === "items" ? (
          <button
            onClick={() => openItemForm(null)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus className="w-4 h-4 stroke-[3]" />
            Tambah Makanan Baru
          </button>
        ) : (
          <button
            onClick={() => openCategoryForm(null)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus className="w-4 h-4 stroke-[3]" />
            Tambah Kategori Baru
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white border border-stone-100 rounded-3xl p-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-500">Memuat data dari server...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: KELOLA MAKANAN */}
          {activeTab === "items" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                {/* Search Bar */}
                <div className="relative w-full lg:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari nama makanan atau deskripsi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category Tags Filter & View Mode */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  {/* Category Chips */}
                  <div className="flex flex-wrap gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    <button
                      onClick={() => setSelectedCategoryFilter("Semua")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedCategoryFilter === "Semua"
                          ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                          : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-900 border-stone-100"
                      }`}
                    >
                      Semua
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryFilter(cat.name)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          selectedCategoryFilter === cat.name
                            ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                            : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-900 border-stone-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Divider line */}
                  <span className="hidden sm:block h-6 w-[1px] bg-stone-250" />

                  {/* View Mode Toggle */}
                  <div className="flex bg-stone-100 rounded-xl p-1 gap-1 self-start sm:self-auto flex-shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-205 flex items-center gap-1.5 ${
                        viewMode === "grid" 
                          ? "bg-primary-500 text-white shadow-sm" 
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <FiGrid className="w-3.5 h-3.5" />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-205 flex items-center gap-1.5 ${
                        viewMode === "list" 
                          ? "bg-primary-500 text-white shadow-sm" 
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <FiList className="w-3.5 h-3.5" />
                      Tabel
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid / List Layout Content */}
              {filteredItems.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all group ${
                          item.isAvailable ? "border-stone-100 hover:shadow-md" : "border-stone-150 bg-stone-50/50 opacity-90"
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
                          {/* Switch button styling */}
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
                              className="p-2 bg-red-55/10 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer"
                              title="Hapus Menu"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* TABEL LIST VIEW */
                  <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-stone-50 text-stone-500 border-b border-stone-100 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-6 w-24">Gambar</th>
                            <th className="py-4 px-6">Nama Makanan</th>
                            <th className="py-4 px-6">Kategori</th>
                            <th className="py-4 px-6 w-36">Harga</th>
                            <th className="py-4 px-6 w-36">Ketersediaan</th>
                            <th className="py-4 px-6 text-right w-36">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-xs">
                          {filteredItems.map((item) => (
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
                                    className="p-2 bg-red-55/10 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer"
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
                )
              ) : (
                <div className="py-16 bg-white border border-stone-200 rounded-3xl text-center text-stone-400 font-bold uppercase tracking-wider text-xs">
                  Tidak ada menu makanan ditemukan.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KELOLA KATEGORI */}
          {activeTab === "categories" && (
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
                        const count = menuItems.filter(m => m.categoryId === cat.id).length;

                        return (
                          <tr key={cat.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-4 px-6 font-bold text-stone-850 text-sm">
                              {cat.name}
                            </td>
                            <td className="py-4 px-6 text-stone-500 font-semibold">
                              {count} Menu Makanan
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
                                  className="p-2 bg-red-55/10 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer"
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
          )}
        </>
      )}

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
                <div className="p-3 bg-red-50 text-red-650 border border-red-100 rounded-xl text-xs font-semibold flex items-center gap-2">
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
                  <select
                    value={itemFormCategoryId}
                    onChange={(e) => setItemFormCategoryId(e.target.value)}
                    className="w-full h-11 px-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
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
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Gambar Makanan</label>
                
                {/* Image Preview if available */}
                {itemFormImageUrl ? (
                  <div className="flex items-center gap-4 p-3 bg-stone-50 border border-stone-100 rounded-xl">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/50 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={itemFormImageUrl} 
                        alt="Pratinjau Gambar" 
                        className="w-full h-full object-cover"
                        onError={() => {
                          // Handle broken image
                        }}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Local Laptop Upload Option */}
                    <label className="border-2 border-dashed border-stone-200 hover:border-primary-500 hover:bg-stone-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                      <FiImage className="w-6 h-6 text-stone-400 mb-1" />
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

                    {/* Internet URL Option */}
                    <div className="border border-stone-100 bg-stone-50/50 rounded-xl p-4 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-stone-600 block mb-1">Gunakan Link Internet:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={itemFormImageUrl}
                        onChange={(e) => setItemFormImageUrl(e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
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
                Simpan Makanan
              </button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG 2: FORM KATEGORI MODAL (ADD / EDIT) */}
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

      {/* ALERT DIALOG 1: HAPUS MENU CONFIRMATION */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => { if (!open) setDeletingItem(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Menu Makanan</AlertDialogTitle>
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

      {/* ALERT DIALOG 2: HAPUS KATEGORI CONFIRMATION */}
      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => { if (!open) setDeletingCategory(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-stone-900">{deletingCategory?.name}</span>? 
              <br /><br />
              <span className="text-red-600 font-semibold block bg-red-50 p-3 rounded-xl border border-red-100 text-xs">
                ⚠️ PERHATIAN: Semua makanan yang termasuk dalam kategori ini akan secara otomatis kehilangan kategori / dipindahkan.
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
    </div>
  );
}
