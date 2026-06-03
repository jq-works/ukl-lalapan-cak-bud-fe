"use client";

import React, { useEffect } from "react";
import { useCartStore, CartItem, Order } from "../lib/store/cartStore";
import { useAuthStore } from "../lib/store/authStore";

export type { CartItem, Order };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const refreshMenu = useCartStore((state) => state.refreshMenu);
  const fetchOrders = useCartStore((state) => state.fetchOrders);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Load menu and categories on mount
  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  // Fetch orders automatically on mount/auth changes and poll every 10 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [token, isAuthenticated, fetchOrders]);

  return <>{children}</>;
}

export function useCart() {
  return useCartStore();
}
