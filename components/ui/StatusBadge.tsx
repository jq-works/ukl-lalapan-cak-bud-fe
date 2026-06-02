"use client";

import React from "react";

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export const statusConfig = {
  PENDING: { label: "Menunggu", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  PROCESSING: { label: "Diproses", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  COMPLETED: { label: "Selesai", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  CANCELLED: { label: "Dibatalkan", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} transition-colors duration-200`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
