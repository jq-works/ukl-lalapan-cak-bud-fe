"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem } from "@/lib/data";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "PENDING" | "PAID" | "PROCESSING" | "READY" | "COMPLETED" | "CANCELLED";
  date: string;
  time: string;
  estimatedTime: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  activeTab: "home" | "orders" | "account";
  isCartOpen: boolean;
  searchQuery: string;
  activeCategory: string;
  setActiveTab: (tab: "home" | "orders" | "account") => void;
  setIsCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
  reorder: (order: Order) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTabState] = useState<"home" | "orders" | "account">("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Load cart and orders from localStorage on mount (client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem("cakbud_cart");
    const savedOrders = localStorage.getItem("cakbud_orders");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    localStorage.setItem("cakbud_cart", JSON.stringify(cart));
  }, [cart]);

  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem("cakbud_orders", JSON.stringify(orders));
  }, [orders]);

  const setActiveTab = (tab: "home" | "orders" | "account") => {
    setActiveTabState(tab);
    // Auto-scroll to top when shifting tabs
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (item: FoodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Simulate Order Lifecycle Updates
  const startOrderSimulation = (orderId: string) => {
    const updateStatus = (nextStatus: Order["status"], delay: number) => {
      setTimeout(() => {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          )
        );
      }, delay);
    };

    // PAID after 4 seconds
    updateStatus("PAID", 4000);
    // PROCESSING after 9 seconds
    updateStatus("PROCESSING", 9000);
    // READY after 15 seconds
    updateStatus("READY", 15000);
    // COMPLETED after 22 seconds
    updateStatus("COMPLETED", 22000);
  };

  const checkout = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const now = new Date();
    const orderId = `CB-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: total + 4000, // Include flat delivery/service fee of 4000
      status: "PENDING",
      date: now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      estimatedTime: "20-30 Menit",
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    setIsCartOpen(false);
    setActiveTab("orders"); // Redirect to orders tab immediately

    // Begin async simulation of order stages
    startOrderSimulation(orderId);
  };

  const reorder = (order: Order) => {
    setCart(() => {
      // Re-populate cart with items from the previous order
      const newCart = [...cart];
      order.items.forEach((orderedItem) => {
        const existing = newCart.find((i) => i.id === orderedItem.id);
        if (existing) {
          existing.quantity += orderedItem.quantity;
        } else {
          newCart.push({ ...orderedItem });
        }
      });
      return newCart;
    });
    // Open cart drawer for review
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        activeTab,
        isCartOpen,
        searchQuery,
        activeCategory,
        setActiveTab,
        setIsCartOpen,
        setSearchQuery,
        setActiveCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        reorder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
