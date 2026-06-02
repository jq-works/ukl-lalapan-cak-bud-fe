"use client";

import React from "react";
import { useAuthStore, UserProfile } from "../lib/store/authStore";

export type { UserProfile };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  return useAuthStore();
}
