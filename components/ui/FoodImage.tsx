"use client";

import React, { useState } from "react";

interface FoodImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function FoodImage({ src, alt, className = "" }: FoodImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`bg-stone-50 border border-stone-100 flex items-center justify-center select-none ${className}`}>
        <span className="text-3xl filter drop-shadow-sm">🍽️</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`object-cover select-none ${className}`}
      loading="lazy"
    />
  );
}
