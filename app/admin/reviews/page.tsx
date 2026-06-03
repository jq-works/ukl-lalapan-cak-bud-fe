"use client";

import React, { useState, useEffect } from "react";
import { reviewService } from "@/lib/services";
import { 
  FiSearch, FiStar, FiMessageSquare, FiTrash2, 
  FiAlertCircle, FiRefreshCw, FiArrowLeft,
  FiArrowRight, FiSmile
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

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  suggestions?: string;
  date: string;
  createdAt?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState("0.0");
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL"); // "ALL", "5", "4", "3", "2", "1"
  const [sortBy, setSortBy] = useState<"NEWEST" | "HIGHEST_RATING">("NEWEST");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Alert Dialog Control
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const fetchReviews = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const response = await reviewService.getReviews();
      const resData = response.data;
      if (resData.success) {
        const stats = resData.data?.stats;
        if (stats) {
          setAverageRating(Number(stats.averageRating || 0).toFixed(1));
          setTotalReviews(stats.totalReviews || 0);
        }
        
        const apiReviews = resData.data?.reviews || [];
        const mapped: Review[] = apiReviews.map((r: any) => ({
          id: r.id,
          name: r.user?.name || "Pelanggan",
          rating: Number(r.rating || 5),
          comment: r.menuReview || "",
          suggestions: r.suggestions || "",
          date: new Date(r.createdAt || Date.now()).toLocaleDateString("id-ID", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
          }),
          createdAt: r.createdAt || new Date().toISOString()
        }));
        setReviews(mapped);
      } else {
        throw new Error(resData.message || "Gagal memuat ulasan.");
      }
    } catch (err: any) {
      console.error("Gagal mengambil data ulasan:", err);
      setError(err.response?.data?.message || err.message || "Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Reset page to 1 when search, rating filter, or sort updates
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, sortBy]);

  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    setIsDeleting(true);
    try {
      const response = await reviewService.deleteReview(deletingReview.id);
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal menghapus ulasan dari server.");
      }
      // Remove from list local state
      setReviews(prev => prev.filter(r => r.id !== deletingReview.id));
      // Re-fetch to update metrics
      await fetchReviews(true);
      setAlertOpen(false);
      setDeletingReview(null);
    } catch (err: any) {
      console.error("Gagal menghapus ulasan:", err);
      alert(err.response?.data?.message || err.message || "Gagal menghapus ulasan.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter list
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.suggestions && r.suggestions.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRating = ratingFilter === "ALL" || r.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  const sortedReviews = React.useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortBy === "HIGHEST_RATING") {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date).getTime();
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date).getTime();
      return timeB - timeA;
    });
  }, [filteredReviews, sortBy]);

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const paginatedReviews = sortedReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fade-in text-stone-850">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Ulasan & Masukan</h2>
          <p className="text-stone-500 text-sm mt-1">Pantau dan kelola ulasan, rating, serta kritik & saran dari pelanggan warung.</p>
        </div>

        {/* Action buttons */}
        <button
          onClick={() => fetchReviews(true)}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95 border border-stone-200/50 self-start sm:self-auto"
          title="Refresh Data Ulasan"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Memperbarui..." : "Refresh Ulasan"}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white border border-stone-100 rounded-3xl p-16 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-500">Memuat data masukan pelanggan...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-stone-100 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Gagal Mengambil Data</h3>
            <p className="text-stone-500 text-xs mt-1 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => fetchReviews(false)}
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-md shadow-green-200/50"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Rata-rata */}
            <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                <FiStar className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Rating Rata-rata</p>
                <p className="text-2xl font-black text-stone-900">{averageRating}</p>
                <div className="flex text-amber-400 gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FiStar 
                      key={idx} 
                      className={`w-3 h-3 ${idx < Math.round(Number(averageRating)) ? "fill-current" : ""}`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Total Ulasan */}
            <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-primary-500/5 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-750">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Jumlah Masukan</p>
                <p className="text-2xl font-black text-stone-900">{totalReviews} Ulasan</p>
                <p className="text-[9px] text-stone-450 font-semibold mt-0.5">Kritik & Saran terkirim</p>
              </div>
            </div>

            {/* Kepuasan Pelanggan */}
            <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FiSmile className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tingkat Kepuasan</p>
                <p className="text-2xl font-black text-stone-900">
                  {totalReviews > 0
                    ? `${Math.round(
                        (reviews.filter(r => r.rating >= 4).length / reviews.length) * 100
                      )}%`
                    : "100%"}
                </p>
                <p className="text-[9px] text-stone-450 font-semibold mt-0.5">Ulasan bernilai bintang 4-5</p>
              </div>
            </div>
          </div>

          {/* Filtering Section */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari ulasan, saran, nama pemesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {/* Sort By Selector */}
              <div className="flex items-center gap-1 bg-stone-100/80 p-0.5 border border-stone-200/40 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-hide select-none">
                <button
                  type="button"
                  onClick={() => setSortBy("NEWEST")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    sortBy === "NEWEST"
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-stone-500 hover:text-stone-750"
                  }`}
                >
                  Terbaru
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("HIGHEST_RATING")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    sortBy === "HIGHEST_RATING"
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-stone-500 hover:text-stone-750"
                  }`}
                >
                  Rating Tertinggi
                </button>
              </div>

              {/* Rating Filter Selector */}
              <div className="flex items-center gap-1.5 bg-stone-50 p-1 border border-stone-100 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-hide select-none">
                {[
                  { key: "ALL", label: "Semua Rating" },
                  { key: "5", label: "⭐ 5" },
                  { key: "4", label: "⭐ 4" },
                  { key: "3", label: "⭐ 3" },
                  { key: "2", label: "⭐ 2" },
                  { key: "1", label: "⭐ 1" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setRatingFilter(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      ratingFilter === item.key
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-stone-500 hover:text-stone-750"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List Feed */}
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="space-y-4">
                    {/* Header: Customer Info & Rating */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-750 font-bold text-xs flex items-center justify-center border border-primary-100 shadow-sm">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{rev.name}</h4>
                          <span className="text-[9px] text-stone-400 font-semibold">{rev.date}</span>
                        </div>
                      </div>

                      {/* Display Star Rating */}
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <FiStar 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${idx < rev.rating ? "fill-current" : ""}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-wider">Ulasan Menu:</span>
                      <p className="text-xs text-stone-600 leading-relaxed font-semibold">{rev.comment}</p>
                    </div>

                    {/* Suggestions (if exists) */}
                    {rev.suggestions && (
                      <div className="bg-primary-50/50 border-l-2 border-primary-500 p-3 rounded-r-2xl space-y-1">
                        <span className="text-[9px] text-primary-750 font-extrabold uppercase tracking-wider block">Kritik & Saran:</span>
                        <p className="text-xs text-stone-600 leading-relaxed font-semibold">{rev.suggestions}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions / Delete Button */}
                  <div className="border-t border-stone-100 mt-5 pt-3.5 flex justify-end">
                    <button
                      onClick={() => {
                        setDeletingReview(rev);
                        setAlertOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 hover:border-red-600 transition-all active:scale-95 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                      title="Hapus Ulasan Ini"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      Hapus Masukan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 bg-white border border-stone-200 rounded-3xl text-center text-stone-400 font-bold uppercase tracking-wider text-xs shadow-sm">
              Tidak ada ulasan ditemukan.
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-150 pt-5 mt-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-sm animate-fade-in select-none">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Sebelumnya
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                        : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5"
              >
                Selanjutnya
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Review Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-stone-900">Hapus Masukan Pelanggan</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500 text-xs">
              Apakah Anda yakin ingin menghapus ulasan dan kritik/saran dari <span className="font-bold text-stone-900">{deletingReview?.name}</span>? Tindakan ini permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="cursor-pointer border-stone-200 text-stone-600 rounded-xl text-xs py-2 px-4" 
              onClick={() => {
                setAlertOpen(false);
                setDeletingReview(null);
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReview}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded-xl text-xs py-2 px-4 shadow-none flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <span>Ya, Hapus</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
