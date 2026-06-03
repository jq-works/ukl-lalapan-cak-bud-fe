"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { reviewService } from "@/lib/services";

export interface Review {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  rating: number;
  date: string;
  text: string;
  orderItem: string;
  likes: number;
  isVerified: boolean;
}

// Hook kustom untuk memisahkan logika marquee ulasan dan event scroll
export function useRestaurantReviews() {
  const [isPaused, setIsPaused] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState("0.0");
  const [totalCount, setTotalCount] = useState(0);
  const [distribution, setDistribution] = useState([
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ]);

  // Mengambil ulasan pelanggan dan menghitung statistik rating
  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviews();
      const resData = res.data;
      if (resData.success) {
        const apiReviews = resData.data?.reviews || [];
        const stats = resData.data?.stats;
        
        const colors = ["bg-primary-500", "bg-accent-500", "bg-blue-500", "bg-amber-500", "bg-emerald-600", "bg-purple-500"];
        const mapped: Review[] = apiReviews.map((r: any) => {
          const index = Math.abs(r.user?.name?.charCodeAt(0) || 0) % colors.length;
          return {
            id: r.id,
            name: r.user?.name || "Pelanggan",
            avatar: (r.user?.name || "P").slice(0, 2).toUpperCase(),
            avatarColor: colors[index],
            rating: Number(r.rating || 5),
            date: new Date(r.createdAt || Date.now()).toLocaleDateString("id-ID", {
              day: "numeric", month: "short", year: "numeric"
            }),
            text: r.menuReview || "",
            orderItem: r.suggestions ? "Saran: " + r.suggestions : "Ulasan Kuliner",
            likes: Math.floor(Math.random() * 12) + 2,
            isVerified: true
          };
        });
        
        setReviewsList(mapped);
        
        let total = 0;
        let avg = "0.0";
        if (stats) {
          total = stats.totalReviews || 0;
          avg = Number(stats.averageRating || 0).toFixed(1);
        } else {
          total = apiReviews.length;
          const sum = apiReviews.reduce((acc: number, val: any) => acc + Number(val.rating || 5), 0);
          avg = total > 0 ? (sum / total).toFixed(1) : "0.0";
        }
        
        setAvgRating(avg);
        setTotalCount(total);
        
        const starCounts = [0, 0, 0, 0, 0];
        apiReviews.forEach((r: any) => {
          const rating = Math.min(5, Math.max(1, Math.round(Number(r.rating || 5))));
          starCounts[rating - 1]++;
        });
        
        setDistribution([
          { stars: 5, count: starCounts[4] },
          { stars: 4, count: starCounts[3] },
          { stars: 3, count: starCounts[2] },
          { stars: 2, count: starCounts[1] },
          { stars: 1, count: starCounts[0] },
        ]);
      }
    } catch (e) {
      console.error("Gagal mengambil ulasan di RestaurantReviews:", e);
      setReviewsList([]);
      setAvgRating("0.0");
      setTotalCount(0);
      setDistribution([
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Referensi & Ref untuk scroll geser mouse/touch
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    setIsPaused(true);
  }, []);

  const onMouseUp = useCallback(() => {
    if (!trackRef.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = "grab";
  }, []);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    setIsPaused(false);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const touchStart = useRef(0);
  const touchScrollLeft = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    touchStart.current = e.touches[0].clientX;
    touchScrollLeft.current = trackRef.current.scrollLeft;
    setIsPaused(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const diff = touchStart.current - e.touches[0].clientX;
    trackRef.current.scrollLeft = touchScrollLeft.current + diff;
  }, []);

  const onTouchEnd = useCallback(() => setIsPaused(false), []);

  const duplicatedReviews = reviewsList.length > 0
    ? (reviewsList.length < 3
        ? [...reviewsList, ...reviewsList, ...reviewsList, ...reviewsList]
        : [...reviewsList, ...reviewsList, ...reviewsList])
    : [];

  return {
    isPaused,
    setIsPaused,
    reviewsList,
    avgRating,
    totalCount,
    distribution,
    trackRef,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    duplicatedReviews,
  };
}
