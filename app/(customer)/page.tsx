"use client";

import React, { useState, useEffect } from "react";
import CustomerNavbar from "@/components/customer/navbar";
import CustomerHero from "@/components/customer/hero";
import { useCart } from "@/context/CartContext";
import { FoodItem } from "@/lib/data";
import { FoodCard } from "@/components/customer/FoodCard";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { FloatingCartBtn } from "@/components/customer/FloatingCartBtn";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { BottomNav } from "@/components/customer/BottomNav";
import CustomerFooter from "@/components/customer/Footer";
import { PopularMarquee } from "@/components/customer/PopularMarquee";
import RestaurantReviews from "@/components/customer/RestaurantReviews";
import { Grid, List, UtensilsCrossed, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerHomePage() {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    foodItems,
    categories,
    isLoadingMenu,
  } = useCart();

  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset to page 1 whenever search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Compute which items match the active filter (for dimming)
  const isItemMatch = (item: FoodItem) => {
    const matchesCategory =
      activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  // Sort food items: available items first, out-of-stock (unavailable) items at the very end
  const sortedFoodItems = React.useMemo(() => {
    return [...foodItems].sort((a, b) => {
      const aAvail = a.isAvailable !== false ? 1 : 0;
      const bAvail = b.isAvailable !== false ? 1 : 0;
      return bAvail - aAvail; // 1 (available) comes before 0 (unavailable)
    });
  }, [foodItems]);

  const availableMatchCount = sortedFoodItems.filter(
    (item) => isItemMatch(item) && item.isAvailable !== false
  ).length;
  const totalAvailableCount = sortedFoodItems.filter(
    (item) => item.isAvailable !== false
  ).length;
  const hasFilter = searchQuery !== "" || activeCategory !== "Semua";

  // Always paginate ALL sorted items so every menu is visible, with out-of-stock items at the end
  const totalPages = Math.ceil(sortedFoodItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedFoodItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoadingMenu) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2d7a3e] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500">Memuat hidangan lezat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-start text-stone-850">
      {/* Top Glassmorphic Navigation Bar */}
      <CustomerNavbar />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-6 pb-32 flex-grow space-y-6">
        {/* Cozy Hero Banner */}
        <CustomerHero />

        {/* Spacing Compensation for Search Bar */}
        <div className="h-6"></div>

        {/* Popular Auto-Scroll Recommendation Marquee */}
        {searchQuery === "" && (
          <PopularMarquee />
        )}

        {/* ── Menu Search Bar ───────────────────────── */}
        <div id="menu-section" className="space-y-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Cari Menu
          </p>
          <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden focus-within:border-[#2d7a3e] focus-within:ring-2 focus-within:ring-[#2d7a3e]/15 transition-all duration-200">
            <Search className="absolute left-4 w-4 h-4 text-stone-400 flex-shrink-0 pointer-events-none" />
            <input
              id="menu-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama menu, bahan, atau kategori..."
              className="w-full pl-11 pr-10 py-3 text-sm text-stone-800 bg-transparent placeholder-stone-400 outline-none"
            />
            {searchQuery !== "" && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery !== "" && (
            <p className="text-[11px] text-stone-400 pt-0.5 px-1">
              Hasil untuk&nbsp;
              <span className="font-semibold text-[#2d7a3e]">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* ── Filter Bar: categories + view toggle + count — satu baris ── */}
        <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide pb-1">
          {/* Category Chips */}
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}

          {/* Separator */}
          <div className="flex-shrink-0 w-px h-6 bg-stone-200 mx-1" />

          {/* View Toggle — segmented pill */}
          <div className="flex-shrink-0 flex items-center bg-stone-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewType("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                viewType === "list"
                  ? "bg-[#2d7a3e] text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
              title="Tampilan List"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                viewType === "grid"
                  ? "bg-[#2d7a3e] text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
              title="Tampilan Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          {/* Item Count */}
          <span className="flex-shrink-0 text-xs font-semibold whitespace-nowrap">
            {hasFilter ? (
              <>
                <span className="text-[#2d7a3e]">{availableMatchCount}</span>
                <span className="text-stone-400"> dari {totalAvailableCount} menu tersedia</span>
              </>
            ) : (
              <span className="text-stone-400">{totalAvailableCount} menu tersedia</span>
            )}
          </span>
        </div>

        {/* Food Grid / List Display */}
        <div>
          <div className="space-y-4">
            {searchQuery === "" && activeCategory === "Semua" && (
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#2d7a3e]" />
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Semua Hidangan Lalapan
                </h3>
              </div>
            )}
            <div
              className={
                viewType === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-4"
              }
            >
              {paginatedItems.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  viewType={viewType}
                  isMatch={isItemMatch(item)}
                />
              ))}
            </div>

            {/* ── Pagination Controls ─────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-stone-200 text-stone-500 hover:border-[#2d7a3e] hover:text-[#2d7a3e] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === currentPage
                        ? "bg-[#2d7a3e] text-white shadow-md shadow-green-200/60"
                        : "bg-white border border-stone-200 text-stone-500 hover:border-[#2d7a3e] hover:text-[#2d7a3e]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-stone-200 text-stone-500 hover:border-[#2d7a3e] hover:text-[#2d7a3e] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Page info */}
            {totalPages > 1 && (
              <p className="text-center text-[11px] text-stone-400">
                Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedFoodItems.length)} dari {sortedFoodItems.length} menu
              </p>
            )}
          </div>
        </div>

        {/* Ulasan Pelanggan */}
        <RestaurantReviews />
      </main>

      {/* Footer */}
      <CustomerFooter />

      {/* Floating Cart Button */}
      <FloatingCartBtn />

      {/* Responsive Cart Drawer */}
      <CartDrawer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}