"use client";

import React, { useState, useEffect } from "react";
import { useAlert } from "@/context/AlertContext";
import { menuService, categoryService } from "@/lib/services";

export interface ApiCategory {
  id: string;
  name: string;
}

export interface ApiMenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: string;
  category?: ApiCategory;
}

// Hook kustom untuk memisahkan logika halaman kelola menu & kategori admin
export function useAdminMenu() {
  const { showAlert } = useAlert();
  
  // Tab aktif: "items" (Kelola Menu) atau "categories" (Kelola Kategori)
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");
  const [isLoading, setIsLoading] = useState(true);

  // List data utama
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  // Filter & Mode Tampilan
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Kontrol dialog/modal CRUD
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiMenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ApiMenuItem | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ApiCategory | null>(null);

  // State Formulir Food Item
  const [itemFormName, setItemFormName] = useState("");
  const [itemFormPrice, setItemFormPrice] = useState("");
  const [itemFormCategoryId, setItemFormCategoryId] = useState("");
  const [itemFormDescription, setItemFormDescription] = useState("");
  const [itemFormImageUrl, setItemFormImageUrl] = useState("");
  const [itemFormIsAvailable, setItemFormIsAvailable] = useState(true);
  const [itemFormError, setItemFormError] = useState<string | null>(null);

  // State Formulir Category
  const [categoryFormName, setCategoryFormName] = useState("");
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

  // Mengambil data awal kategori dan menu dari server
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const catRes = await categoryService.getCategories();
      const catData = catRes.data;
      if (catData.success === false) {
        throw new Error(catData.message || "Gagal mengambil data kategori");
      }
      const loadedCategories: ApiCategory[] = catData.data || [];
 
      const menuRes = await menuService.getMenuItems();
      const menuData = menuRes.data;
      if (menuData.success === false) {
        throw new Error(menuData.message || "Gagal mengambil data menu");
      }
      const loadedMenuItems: ApiMenuItem[] = menuData.data || [];
 
      setCategories(loadedCategories);
      setMenuItems(loadedMenuItems);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      console.error("Gagal memuat data awal admin menu:", errMsg);
      showAlert("Gagal memuat data dari server: " + errMsg, "Kesalahan Koneksi Server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pagination untuk daftar item menu
  const [itemPage, setItemPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setItemPage(1);
  }, [searchQuery, selectedCategoryFilter]);

  // Mengubah status ketersediaan (aktif/habis) suatu hidangan
  const handleToggleAvailability = async (item: ApiMenuItem) => {
    const updatedStatus = !item.isAvailable;
    const updatedItems = menuItems.map(m => m.id === item.id ? { ...m, isAvailable: updatedStatus } : m);
    setMenuItems(updatedItems);

    try {
      const res = await menuService.updateMenuItem(item.id, { isAvailable: updatedStatus });
      const resData = res.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal memperbarui status di server");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      console.error("Gagal mengubah ketersediaan:", errMsg);
      showAlert("Gagal mengubah ketersediaan menu di server: " + errMsg, "Gagal Update");
      setMenuItems(menuItems);
    }
  };

  // Aksi menghapus item menu
  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    const targetId = deletingItem.id;
    try {
      const res = await menuService.deleteMenuItem(targetId);
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

  // Membuka modal form item menu (tambah baru atau sunting)
  const openItemForm = (item: ApiMenuItem | null = null) => {
    setItemFormError(null);
    if (item) {
      setEditingItem(item);
      setItemFormName(item.name);
      setItemFormPrice(item.price.toString());
      setItemFormCategoryId(item.categoryId);
      setItemFormDescription(item.description || "");
      setItemFormImageUrl(item.imageUrl || "");
      setItemFormIsAvailable(item.isAvailable);
    } else {
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

  // Mengirimkan form item menu (simpan/buat baru)
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemFormError(null);

    if (!itemFormName.trim()) {
      setItemFormError("Nama menu wajib diisi");
      return;
    }
    const priceNum = parseFloat(itemFormPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setItemFormError("Harga menu harus berupa angka valid dan minimal 0");
      return;
    }
    if (!itemFormCategoryId) {
      setItemFormError("Pilih kategori menu");
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
      try {
        const res = await menuService.updateMenuItem(editingItem.id, payload);
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
      try {
        const res = await menuService.createMenuItem(payload);
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

  // Membuka form kategori (sunting atau tambah baru)
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

  // Mengirim data kategori (simpan/buat baru)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError(null);

    if (!categoryFormName.trim()) {
      setCategoryFormError("Nama kategori wajib diisi");
      return;
    }

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
      try {
        const res = await categoryService.updateCategory(editingCategory.id, payload);
        const resData = res.data;
        if (resData.success === false) {
          throw new Error(resData.message || "Gagal mengubah kategori di server");
        }
        const updatedCategory: ApiCategory = {
          id: editingCategory.id,
          name: categoryFormName.trim()
        };
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c));
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
      try {
        const res = await categoryService.createCategory(payload);
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

  // Aksi menghapus kategori menu
  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    const targetId = deletingCategory.id;

    try {
      const res = await categoryService.deleteCategory(targetId);
      const resData = res.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal menghapus kategori dari server");
      }

      const updatedCategories = categories.filter(c => c.id !== targetId);
      const fallbackCategory = updatedCategories[0];

      setCategories(updatedCategories);
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

  // Memfilter item berdasarkan input pencarian dan filter kategori
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategoryFilter === "Semua" || 
                            (item.category && item.category.name === selectedCategoryFilter) ||
                            (item.categoryId === selectedCategoryFilter);

    return matchesSearch && matchesCategory;
  });

  const totalItemPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((itemPage - 1) * itemsPerPage, itemPage * itemsPerPage);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    menuItems,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    viewMode,
    setViewMode,
    isItemModalOpen,
    setIsItemModalOpen,
    editingItem,
    setEditingItem,
    deletingItem,
    setDeletingItem,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    deletingCategory,
    setDeletingCategory,
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
    categoryFormName,
    setCategoryFormName,
    categoryFormError,
    setCategoryFormError,
    fetchInitialData,
    itemPage,
    setItemPage,
    handleToggleAvailability,
    handleDeleteItem,
    openItemForm,
    handleItemSubmit,
    openCategoryForm,
    handleCategorySubmit,
    handleDeleteCategory,
    totalItemPages,
    paginatedItems,
  };
}
