"use client";

import React from "react";
import CustomerNavbar from "@/components/customer/navbar";
import { FloatingCartBtn } from "@/components/customer/FloatingCartBtn";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { BottomNav } from "@/components/customer/BottomNav";
import CustomerFooter from "@/components/customer/Footer";
import { FiStar, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useCustomerReviews } from "./hooks/useCustomerReviews";

export default function UlasanPage() {
  const {
    isLoading,
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
  } = useCustomerReviews();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Memeriksa hak akses ulasan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-start text-stone-850">
      <CustomerNavbar />

      <main className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-6 pb-32 flex-grow">
        <div className="fade-in space-y-8">
          
          {/* Header Title */}
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Ulasan Pelanggan</h1>
            <p className="text-stone-500 text-xs mt-1">Bagikan ulasan pengalaman makan serta kritik & saran untuk Lalapan Cak Bud.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Review Stats & Form */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Rating Stats Card */}
              <div className="bg-white border border-stone-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">Performa Warung</h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-[#2d7a3e]">{avgRating}</span>
                  <div>
                    <div className="flex text-amber-500 gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FiStar key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-[10px] text-stone-400 font-bold mt-1 uppercase">Berdasarkan {reviewsCount} Ulasan</p>
                  </div>
                </div>
              </div>

              {/* Form Tulis Ulasan */}
              <div className="bg-white border border-stone-150 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="text-primary-500 w-4.5 h-4.5" />
                  <h3 className="text-xs font-bold text-stone-900">Bagikan Ulasan & Saran</h3>
                </div>

                {isSuccess ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                      <FiCheckCircle className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Ulasan & Kritik Dikirim!</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Terima kasih atas masukan berharga Anda.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Star Rating Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Rating Anda</label>
                      <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const starVal = idx + 1;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="text-2xl transition-transform hover:scale-115 cursor-pointer text-amber-400"
                            >
                              <FiStar 
                                className={`w-6 h-6 ${
                                  starVal <= (hoverRating ?? rating) ? "fill-current" : ""
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Comment Field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Ulasan Hidangan</label>
                      <textarea
                        required
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Rasa masakan, sambal, porsi hidangan..."
                        className="w-full p-3 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Suggestions / Criticisms Field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Kritik & Saran (Opsional)</label>
                      <textarea
                        rows={3}
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Saran pelayanan, kecepatan saji, atau sistem pemesanan..."
                        className="w-full p-3 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
                      />
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[11px] flex items-center gap-2">
                        <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-stone-300 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-green-200/50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-3.5 h-3.5" />
                          <span>Kirim Masukan</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Right Column: Review Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3">
                <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Feed Ulasan & Masukan Pelanggan</h3>
                
                {/* Sort Controls */}
                <div className="flex items-center gap-1 bg-stone-100/80 p-0.5 border border-stone-200/40 rounded-xl self-start sm:self-auto shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => setSortBy("NEWEST")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
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
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === "HIGHEST_RATING"
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-stone-500 hover:text-stone-750"
                    }`}
                  >
                    Rating Tertinggi
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 pt-1">
                {paginatedReviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-stone-150 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-700 font-bold text-xs flex items-center justify-center border border-primary-100">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{rev.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-stone-400 mt-1 font-semibold">{rev.date}</p>
                      </div>
                    </div>
                    
                    {/* Dish Review Comment */}
                    <div className="pl-1">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Review Menu:</p>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium mt-0.5">{rev.comment}</p>
                    </div>

                    {/* Criticism & Suggestions */}
                    {rev.suggestions && (
                      <div className="bg-primary-50/50 border-l-2 border-primary-500 p-2.5 rounded-r-xl mt-2.5 ml-1">
                        <p className="text-[10px] text-primary-700 font-bold uppercase">Kritik & Saran:</p>
                        <p className="text-xs text-stone-600 font-semibold mt-0.5 leading-relaxed">{rev.suggestions}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalReviewPages > 1 && (
                  <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-4 bg-white select-none">
                    <button
                      type="button"
                      onClick={() => setReviewPage(prev => Math.max(prev - 1, 1))}
                      disabled={reviewPage === 1}
                      className="px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-xl text-[11px] font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1"
                    >
                      &larr; Seb.
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setReviewPage(page)}
                          className={`w-8 h-8 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                            reviewPage === page
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
                      onClick={() => setReviewPage(prev => Math.min(prev + 1, totalReviewPages))}
                      disabled={reviewPage === totalReviewPages}
                      className="px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-xl text-[11px] font-bold text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1"
                    >
                      Sel. &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <CustomerFooter />
      <FloatingCartBtn />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
