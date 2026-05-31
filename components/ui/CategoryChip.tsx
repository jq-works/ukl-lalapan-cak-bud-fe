"use client";

import React from "react";

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryChip({ label, isActive, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 flex items-center justify-center ${
        isActive
          ? "bg-[#2d7a3e] text-white font-semibold shadow-md shadow-green-200"
          : "bg-white border border-stone-200 text-stone-500 hover:text-stone-700 hover:bg-stone-50 font-medium"
      }`}
    >
      {label}
    </button>
  );
}
