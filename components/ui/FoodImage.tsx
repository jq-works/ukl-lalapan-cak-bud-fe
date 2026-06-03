"use client";

import React, { useState } from "react";

interface FoodImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function FoodImage({ src, alt, className = "" }: FoodImageProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "/images/logo_cakbud.png";

  return (
    <img
      src={(!src || hasError) ? fallbackSrc : src}
      alt={alt}
      onError={() => {
        if (!hasError) setHasError(true);
      }}
      className={`object-cover select-none ${className}`}
      loading="lazy"
    />
  );
}
