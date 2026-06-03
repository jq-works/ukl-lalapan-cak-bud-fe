"use client";

import React, { useState, useEffect } from "react";

import { useAlert } from "@/context/AlertContext";
import { api } from "@/lib/api";
import { 
  FiSearch, FiPlus, FiFolder, FiCoffee, 
  FiGrid, FiList, FiRefreshCw
} from "react-icons/fi";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { MenuItemModal } from "@/components/admin/MenuItemModal";
import { MenuItemsList } from "@/components/admin/MenuItemsList";



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
  const { showAlert } = useAlert();
  
  // Tabs state: "items" (Kelola Menu) or "categories" (Kelola Kategori)
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");
  
  // Connection state
  const [isLoading, setIsLoading] = useState(true);


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
  const fetchInitialData = async () => {
    setIsLoading(true);
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
        throw new Error(menuData.message || "Gagal mengambil data menu");
      }
      const loadedMenuItems: ApiMenuItem[] = menuData.data || [];
 
      setCategories(loadedCategories);
      setMenuItems(loadedMenuItems);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      console.error("Connection to production API failed:", errMsg);
      showAlert("Gagal memuat data dari server: " + errMsg, "Kesalahan Koneksi Server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [itemPage, setItemPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setItemPage(1);
  }, [searchQuery, selectedCategoryFilter]);



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

  const totalItemPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((itemPage - 1) * itemsPerPage, itemPage * itemsPerPage);

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
            Daftar Menu
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
            Tambah Menu Baru
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
          {/* TAB 1: KELOLA MENU */}
          {activeTab === "items" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                {/* Search Bar */}
                <div className="relative w-full lg:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari nama menu atau deskripsi..."
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
              <MenuItemsList
                items={paginatedItems}
                viewMode={viewMode}
                handleToggleAvailability={handleToggleAvailability}
                openItemForm={openItemForm}
                setDeletingItem={setDeletingItem}
              />

              {/* Pagination Controls */}
              {totalItemPages > 1 && (
                <div className="flex items-center justify-between border-t border-stone-150 pt-5 mt-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-sm animate-fade-in select-none">
                  <button
                    onClick={() => setItemPage(p => Math.max(1, p - 1))}
                    disabled={itemPage === 1}
                    className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    &larr; Seb.
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalItemPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setItemPage(page)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                          itemPage === page
                            ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                            : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setItemPage(p => Math.min(totalItemPages, p + 1))}
                    disabled={itemPage === totalItemPages}
                    className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    Sel. &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KELOLA KATEGORI */}
          {activeTab === "categories" && (
            <CategoryTable
              categories={categories}
              menuItems={menuItems}
              openCategoryForm={openCategoryForm}
              setDeletingCategory={setDeletingCategory}
            />
          )}
        </>
      )}

      {/* DIALOGS & CONFIRMATIONS */}
      <MenuItemModal
        isItemModalOpen={isItemModalOpen}
        setIsItemModalOpen={setIsItemModalOpen}
        editingItem={editingItem}
        itemFormName={itemFormName}
        setItemFormName={setItemFormName}
        itemFormPrice={itemFormPrice}
        setItemFormPrice={setItemFormPrice}
        itemFormCategoryId={itemFormCategoryId}
        setItemFormCategoryId={setItemFormCategoryId}
        itemFormDescription={itemFormDescription}
        setItemFormDescription={setItemFormDescription}
        itemFormImageUrl={itemFormImageUrl}
        setItemFormImageUrl={setItemFormImageUrl}
        itemFormIsAvailable={itemFormIsAvailable}
        setItemFormIsAvailable={setItemFormIsAvailable}
        itemFormError={itemFormError}
        setItemFormError={setItemFormError}
        categories={categories}
        handleItemSubmit={handleItemSubmit}
        deletingItem={deletingItem}
        setDeletingItem={setDeletingItem}
        handleDeleteItem={handleDeleteItem}
      />

      <CategoryModal
        isCategoryModalOpen={isCategoryModalOpen}
        setIsCategoryModalOpen={setIsCategoryModalOpen}
        editingCategory={editingCategory}
        categoryFormName={categoryFormName}
        setCategoryFormName={setCategoryFormName}
        categoryFormError={categoryFormError}
        handleCategorySubmit={handleCategorySubmit}
        deletingCategory={deletingCategory}
        setDeletingCategory={setDeletingCategory}
        handleDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
