"use client";

import React, { useState, useEffect, useMemo } from "react";
import { reviewService } from "@/lib/services";

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  suggestions?: string;
  date: string;
  createdAt?: string;
}

// Hook kustom untuk memisahkan logika halaman manajemen ulasan admin
export function useAdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState("0.0");
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL"); // "ALL", "5", "4", "3", "2", "1"
  const [sortBy, setSortBy] = useState<"NEWEST" | "HIGHEST_RATING">("NEWEST");

  // Halaman aktif pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Kontrol dialog konfirmasi hapus
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // Mengambil data ulasan dari backend server
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

  // Efek samping memuat ulasan saat awal load
  useEffect(() => {
    fetchReviews();
  }, []);

  // Mereset halaman ke 1 bila pencarian/filter diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, sortBy]);

  // Aksi menghapus ulasan oleh admin
  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    setIsDeleting(true);
    try {
      const response = await reviewService.deleteReview(deletingReview.id);
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal menghapus ulasan dari server.");
      }
      setReviews(prev => prev.filter(r => r.id !== deletingReview.id));
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

  // Memfilter ulasan berdasarkan input pencarian dan nilai bintang
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.suggestions && r.suggestions.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRating = ratingFilter === "ALL" || r.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // Mengurutkan ulasan terfilter berdasarkan opsi sort
  const sortedReviews = useMemo(() => {
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

  return {
    reviews,
    averageRating,
    totalReviews,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    deletingReview,
    setDeletingReview,
    isDeleting,
    alertOpen,
    setAlertOpen,
    fetchReviews,
    handleDeleteReview,
    totalPages,
    paginatedReviews,
  };
}
