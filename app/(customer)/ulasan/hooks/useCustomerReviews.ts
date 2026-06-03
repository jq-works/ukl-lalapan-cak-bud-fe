"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { reviewService } from "@/lib/services";

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  suggestions?: string;
  date: string;
  role?: string;
  createdAt?: string;
}

const INITIAL_REVIEWS: Review[] = [];

// Hook kustom untuk memisahkan logika halaman tulis & lihat ulasan customer
export function useCustomerReviews() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Daftar ulasan dan statistika
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState("4.8");
  const [totalReviews, setTotalReviews] = useState(0);

  // Input form pembuatan ulasan baru
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sorting dan Pagination ulasan feed
  const [sortBy, setSortBy] = useState<"NEWEST" | "HIGHEST_RATING">("NEWEST");
  const [reviewPage, setReviewPage] = useState(1);
  const itemsPerPage = 5;

  // Mengurutkan ulasan terfilter
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "HIGHEST_RATING") {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date).getTime();
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date).getTime();
      return timeB - timeA;
    });
  }, [reviews, sortBy]);

  useEffect(() => {
    setReviewPage(1);
  }, [reviews.length, sortBy]);

  const totalReviewPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const paginatedReviews = sortedReviews.slice((reviewPage - 1) * itemsPerPage, reviewPage * itemsPerPage);

  // Mengambil ulasan-ulasan dari server
  const fetchReviews = async () => {
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
            year: "numeric", month: "short", day: "numeric"
          }),
          createdAt: r.createdAt || new Date().toISOString()
        }));
        setReviews(mapped.length > 0 ? mapped : INITIAL_REVIEWS);
      }
    } catch (e) {
      console.error("Gagal memuat ulasan dari API:", e);
      setReviews(INITIAL_REVIEWS);
    }
  };

  // Muat ulasan awal jika sudah terautentikasi
  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  // Melakukan pengalihan paksa jika belum masuk
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Mengirim ulasan baru ke server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await reviewService.createReview({
        rating,
        menuReview: comment.trim(),
        suggestions: suggestions.trim() || undefined
      });
      
      const resData = response.data;
      if (resData.success === false) {
        throw new Error(resData.message || "Gagal mengirim ulasan.");
      }

      setIsSuccess(true);
      setComment("");
      setSuggestions("");
      setRating(5);
      
      await fetchReviews();
      setTimeout(() => setIsSuccess(false), 4500);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Gagal mengirim ulasan.";
      console.error("Gagal mengirim ulasan ke server:", errMsg);
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = totalReviews > 0 ? averageRating : (reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0");
  const reviewsCount = totalReviews > 0 ? totalReviews : reviews.length;

  return {
    isAuthenticated,
    isLoading,
    reviews,
    averageRating,
    totalReviews,
    rating,
    setRating,
    comment,
    setComment,
    suggestions,
    setSuggestions,
    hoverRating,
    setHoverRating,
    isSubmitting,
    isSuccess,
    submitError,
    sortBy,
    setSortBy,
    reviewPage,
    setReviewPage,
    totalReviewPages,
    paginatedReviews,
    handleSubmit,
    avgRating,
    reviewsCount,
    router,
  };
}
