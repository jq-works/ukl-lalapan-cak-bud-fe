"use client";

import React, { useState, useEffect } from "react";
import CustomerNavbar from "@/components/customer/navbar";
import CustomerHero from "@/components/customer/hero";
import { useCart } from "@/context/CartContext";
import { FOOD_ITEMS, CATEGORIES } from "@/lib/data";
import { FoodCard } from "@/components/customer/FoodCard";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { FloatingCartBtn } from "@/components/customer/FloatingCartBtn";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { BottomNav } from "@/components/customer/BottomNav";
import { OrderHistory } from "@/components/customer/OrderHistory";
import { AccountSection } from "@/components/customer/AccountSection";
import { PopularMarquee } from "@/components/customer/PopularMarquee";
import { Grid, List, UtensilsCrossed, AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerHomePage() {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
  } = useCart();

  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset to page 1 whenever search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Compute which items match the active filter (for dimming)
  const isItemMatch = (item: (typeof FOOD_ITEMS)[0]) => {
    const matchesCategory =
      activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const matchCount = FOOD_ITEMS.filter(isItemMatch).length;
  const hasFilter = searchQuery !== "" || activeCategory !== "Semua";

  // Always paginate ALL items so every menu is visible
  const totalPages = Math.ceil(FOOD_ITEMS.length / ITEMS_PER_PAGE);
  const paginatedItems = FOOD_ITEMS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-start pb-24 md:pb-16 text-stone-850">
      {/* Top Glassmorphic Navigation Bar */}
      <CustomerNavbar />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex-grow">
        {activeTab === "home" && (
          <div className="fade-in space-y-6">
            {/* Cozy Hero Banner */}
            <CustomerHero />

            {/* Spacing Compensation for Search Bar */}
            <div className="h-6"></div>

            {/* Popular Auto-Scroll Recommendation Marquee */}
            {searchQuery === "" && (
              <PopularMarquee />
            )}

            {/* ── Menu Search Bar ───────────────────────── */}
            <div className="space-y-1">
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
              {CATEGORIES.map((cat) => (
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
                    <span className="text-[#2d7a3e]">{matchCount}</span>
                    <span className="text-stone-400"> dari {FOOD_ITEMS.length} menu tersedia</span>
                  </>
                ) : (
                  <span className="text-stone-400">{FOOD_ITEMS.length} menu tersedia</span>
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
                    Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, FOOD_ITEMS.length)} dari {FOOD_ITEMS.length} menu
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="fade-in max-w-2xl mx-auto">
            <OrderHistory />
          </div>
        )}

        {activeTab === "account" && (
          <div className="fade-in max-w-2xl mx-auto">
            <AccountSection />
          </div>
        )}
      </main>

      {/* Floating Cart Button (Available on both screens, positioned responsively) */}
      <FloatingCartBtn />

      {/* Responsive Cart Drawer slide/sheet overlay */}
      <CartDrawer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}