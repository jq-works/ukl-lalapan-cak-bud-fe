"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { FOOD_ITEMS } from "@/lib/data";
import { FoodImage } from "@/components/ui/FoodImage";

export default function CustomerHero() {
  const { searchQuery, setSearchQuery, addToCart } = useCart();
  const [isFocused, setIsFocused] = useState(false);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter food items based on current search input
  const suggestions = searchQuery.trim() === "" 
    ? [] 
    : FOOD_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleAddToCardFromSearch = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    addToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-8 mb-16">
      
      {/* Container Utama Banner (Original Large Dimension with Vignette) */}
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[420px] flex items-center shadow-lg bg-gradient-to-b from-primary-500 to-primary-700">
        
        {/* Background Image Utama (Premium Dark Rustic Food Vignette) */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.12] pointer-events-none select-none z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')" }}
        />

        {/* Pattern Overlay (Subtle Dot Grid Pattern for modern UI texture) */}
        <div 
          className="absolute inset-0 opacity-[0.08] z-0 select-none pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        {/* Overlay Cozy Radial/Linear Vignette untuk Keterbacaan Teks */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-primary-600/40 to-primary-700/80 z-0" />

        {/* Premium Radial Background Glow */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, var(--color-primary-400) 0%, transparent 60%), " +
              "radial-gradient(circle at 90% 80%, var(--color-primary-500) 0%, transparent 50%)",
          }}
        />

        {/* Teks Konten Utama (Centered - Original Larger Typography) */}
        <div className="relative z-10 w-full max-w-2xl md:max-w-3xl pt-8 pb-16 px-6 sm:py-10 sm:px-10 md:py-14 md:px-14 lg:py-16 lg:px-16 flex flex-col justify-center items-center text-center mx-auto space-y-3 sm:space-y-4">
          
          {/* Logo Cak Bud - Large Logo Size */}
          <img 
            src="/images/logo_cakbud.png" 
            alt="Logo Cak Bud" 
            className="w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-md select-none pointer-events-none"
          />

          <h1 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-2xl drop-shadow-sm">
            Lapar? Lalapan Cak Bud Aja!
          </h1>
          <p className="text-stone-200 text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-md md:max-w-xl drop-shadow-sm">
            Nikmati Lalapan & Sambal khas Cak Bud, tanpa menunggu antrian.
          </p>
        </div>

      </div>

      {/* FLOATING FOOD SEARCH BAR OVERLAY (CENTERED) */}
      <div 
        ref={containerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[calc(100%-3rem)] max-w-md md:max-w-xl z-30"
      >
        <div className="relative bg-white/95 backdrop-blur-md border border-stone-200/40 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-2">
          <div className="relative flex-grow flex items-center">
            <Search className="absolute left-3.5 h-5 w-5 text-stone-400 flex-shrink-0 z-10" />
            
            <Input 
              type="text" 
              value={searchQuery}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsFocused(true);
              }}
              placeholder="Cari makanan favoritmu..." 
              className="pl-11 pr-10 h-11 sm:h-12 w-full bg-stone-50 hover:bg-stone-100/50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 transition-colors"
            />

            {/* Clear Button */}
            {searchQuery !== "" && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <button className="h-11 sm:h-12 px-5 sm:px-6 bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center transition-all hover:shadow-md hover:shadow-green-200/30 active:scale-95 whitespace-nowrap cursor-pointer">
            Cari
          </button>

          {/* Dynamic Suggestion Search Dropdown Overlay */}
          <AnimatePresence>
            {isFocused && searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-stone-200/50 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto p-2 space-y-1 z-50"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        // Keep search term but trigger page scroll or blur
                        setIsFocused(false);
                      }}
                      className="flex justify-between items-center gap-3 p-2 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100 bg-stone-50">
                          <FoodImage src={item.image} alt={item.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-800 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-semibold text-stone-400">
                            {item.category} · Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      {/* Quick Add Button */}
                      <button
                        onClick={(e) => handleAddToCardFromSearch(e, item)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          addedItemId === item.id 
                            ? "bg-emerald-500 border-emerald-500 text-white scale-105" 
                            : "border-stone-200 hover:border-[#2d7a3e] hover:bg-[#2d7a3e]/5 text-stone-600 hover:text-[#2d7a3e] active:scale-90"
                        }`}
                        title="Tambah ke Pesanan"
                      >
                        {addedItemId === item.id ? (
                          <Check className="w-3.5 h-3.5 font-bold" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-stone-400">
                    <p className="text-xs font-bold">Menu tidak ditemukan</p>
                    <p className="text-[10px]">Coba cari "Ayam", "Bebek" atau "Dawet"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Foods Outside the Card (Desktop only to prevent viewport overflow) */}
      <div className="absolute inset-0 pointer-events-none select-none hidden md:block z-20 overflow-visible">
        
        {/* Top-Left: Risoles / Pastel */}
        <motion.div 
          className="absolute -top-6 left-2 lg:-left-6 w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-cover bg-center shadow-2xl border-4 border-white cursor-pointer pointer-events-auto"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80')" }}
          animate={{ 
            y: [0, -10, 0],
            rotate: [-6, 0, -6]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1, rotate: -12 }}
        />

        {/* Bottom-Left: Es Dawet/Cendol */}
        <motion.div 
          className="absolute -bottom-8 left-6 lg:left-2 w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-cover bg-center shadow-2xl border-4 border-white cursor-pointer pointer-events-auto"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80')" }}
          animate={{ 
            y: [0, -12, 0],
            rotate: [12, 6, 12]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
          whileHover={{ scale: 1.1, rotate: 18 }}
        />

        {/* Top-Right: Ayam Goreng Lalapan */}
        <motion.div 
          className="absolute -top-8 right-2 lg:-right-6 w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-cover bg-center shadow-2xl border-4 border-white cursor-pointer pointer-events-auto"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80')" }}
          animate={{ 
            y: [0, -14, 0],
            rotate: [6, 12, 6]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
          whileHover={{ scale: 1.1, rotate: 0 }}
        />

        {/* Bottom-Right: Sate */}
        <motion.div 
          className="absolute -bottom-10 right-6 lg:right-2 w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-cover bg-center shadow-2xl border-4 border-white cursor-pointer pointer-events-auto"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80')" }}
          animate={{ 
            y: [0, -16, 0],
            rotate: [-12, -6, -12]
          }}
          transition={{ 
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
          whileHover={{ scale: 1.1, rotate: -18 }}
        />

      </div>
    </section>
  );
}