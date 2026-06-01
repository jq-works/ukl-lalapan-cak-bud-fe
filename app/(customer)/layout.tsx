"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // While loading or if admin is about to redirect, show spinner
  if (!isLoading && isAuthenticated && user?.role === "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Mengalihkan ke Dashboard Admin...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
