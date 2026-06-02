import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "../api";
import { FoodItem } from "../data";

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
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  date: string;
  time: string;
  estimatedTime: string;
  phone?: string;
  customerName?: string;
}

interface CartState {
  cart: CartItem[];
  orders: Order[];
  activeTab: "home" | "orders" | "account";
  isCartOpen: boolean;
  searchQuery: string;
  activeCategory: string;
  foodItems: FoodItem[];
  categories: string[];
  isLoadingMenu: boolean;
  
  setActiveTab: (tab: "home" | "orders" | "account") => void;
  setIsCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (guestDetails?: { name: string; phone: string }, note?: string, initialStatus?: Order["status"]) => Promise<boolean>;
  reorder: (order: Order) => void;
  refreshMenu: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}

// Map API response to local FoodItem structure
const mapApiMenuItemToFoodItem = (apiItem: any): FoodItem => {
  return {
    id: apiItem.id,
    name: apiItem.name,
    price: Number(apiItem.price),
    desc: apiItem.description || "",
    category: apiItem.category?.name || "Lalapan",
    image: apiItem.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
    rating: apiItem.rating || 4.8,
    sold: apiItem.sold || "10+",
    isTerlaris: apiItem.isTerlaris || false,
    isAvailable: apiItem.isAvailable !== false,
  };
};

const getInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const savedCart = localStorage.getItem("cakbud_cart");
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export const useCartStore = create<CartState>((set) => ({
  cart: getInitialCart(),
  orders: [],
  activeTab: "home",
  isCartOpen: false,
  searchQuery: "",
  activeCategory: "Semua",
  foodItems: [],
  categories: ["Semua"],
  isLoadingMenu: true,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...state.cart, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cakbud_cart", JSON.stringify(updatedCart));
      }
      return { cart: updatedCart };
    });
  },

  removeFromCart: (id) => {
    set((state) => {
      const updatedCart = state.cart.filter((i) => i.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("cakbud_cart", JSON.stringify(updatedCart));
      }
      return { cart: updatedCart };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      useCartStore.getState().removeFromCart(id);
      return;
    }
    set((state) => {
      const updatedCart = state.cart.map((i) => (i.id === id ? { ...i, quantity } : i));
      if (typeof window !== "undefined") {
        localStorage.setItem("cakbud_cart", JSON.stringify(updatedCart));
      }
      return { cart: updatedCart };
    });
  },

  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cakbud_cart", JSON.stringify([]));
    }
    set({ cart: [] });
  },

  checkout: async (guestDetails, note, initialStatus) => {
    const { cart, clearCart, fetchOrders } = useCartStore.getState();
    if (cart.length === 0) return false;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceFee = 0;
    const total = subtotal + serviceFee;
    
    const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("cakbud_user") : null;
    let savedUser = null;
    if (savedUserStr) {
      try { savedUser = JSON.parse(savedUserStr); } catch (e) {}
    }

    const phone = guestDetails ? guestDetails.phone : (savedUser?.phone || "");
    const customerName = guestDetails ? guestDetails.name : (savedUser?.name || "Member");

    const apiItems = cart.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity
    }));

    try {
      let response;
      const savedToken = Cookies.get("cakbud_token") || (typeof window !== "undefined" ? localStorage.getItem("cakbud_token") : null);

      if (guestDetails) {
        response = await api.post("/orders/guest", {
          guestName: guestDetails.name,
          guestPhone: guestDetails.phone,
          items: apiItems,
          note: note || ""
        });
      } else if (savedToken) {
        response = await api.post("/orders", {
          items: apiItems,
          note: note || ""
        });
      } else {
        throw new Error("Pemesanan membutuhkan data tamu atau akun member.");
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Gagal melakukan pemesanan di server.");
      }

      const resData = response.data;
      const createdOrder = resData.order || resData.data || {};

      clearCart();
      set({ isCartOpen: false });

      if (savedToken) {
        await fetchOrders();
      } else {
        const dateObj = new Date();
        const guestOrderObj: Order = {
          id: createdOrder.id || `CB-${Math.floor(1000 + Math.random() * 9000)}`,
          items: [...cart],
          total: total,
          status: createdOrder.status === "CANCELED" ? "CANCELLED" : (createdOrder.status || "PENDING"),
          date: dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          time: dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          estimatedTime: "20-30 Menit",
          phone,
          customerName,
        };
        set((state) => ({ orders: [guestOrderObj, ...state.orders] }));

        if (typeof window !== "undefined") {
          const savedGuests = localStorage.getItem("cakbud_guest_order_ids");
          let guestList = [];
          if (savedGuests) {
            try { guestList = JSON.parse(savedGuests); } catch (e) {}
          }
          guestList.push(guestOrderObj.id);
          localStorage.setItem("cakbud_guest_order_ids", JSON.stringify(guestList));
        }
      }

      set({ activeTab: "orders" });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Gagal melakukan checkout.";
      console.error("Connection to checkout API failed:", errMsg);
      throw new Error(errMsg);
    }
  },

  reorder: (order) => {
    set((state) => {
      const newCart = [...state.cart];
      order.items.forEach((orderedItem) => {
        const existing = newCart.find((i) => i.id === orderedItem.id);
        if (existing) {
          existing.quantity += orderedItem.quantity;
        } else {
          newCart.push({ ...orderedItem });
        }
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("cakbud_cart", JSON.stringify(newCart));
      }
      return { cart: newCart, isCartOpen: true };
    });
  },

  refreshMenu: async () => {
    set({ isLoadingMenu: true });
    try {
      const catRes = await api.get("/categories");
      let fetchedCategories: string[] = ["Semua"];
      if (catRes.status === 200) {
        const catData = catRes.data;
        const cats = catData.data || [];
        cats.forEach((c: any) => {
          if (c.name && !fetchedCategories.includes(c.name)) {
            fetchedCategories.push(c.name);
          }
        });
      }
      set({ categories: fetchedCategories });

      const menuRes = await api.get("/menu-items");
      if (menuRes.status === 200) {
        const menuData = menuRes.data;
        const items = menuData.data || [];
        set({ foodItems: items.map(mapApiMenuItemToFoodItem) });
      }
    } catch (e) {
      console.error("Gagal mengambil menu dari API:", e);
    } finally {
      set({ isLoadingMenu: false });
    }
  },

  fetchOrders: async () => {
    const savedToken = Cookies.get("cakbud_token") || (typeof window !== "undefined" ? localStorage.getItem("cakbud_token") : null);
    if (!savedToken) {
      set({ orders: [] });
      return;
    }
    try {
      const response = await api.get("/orders/me");
      if (response.status === 200) {
        const resData = response.data;
        const apiOrders = resData.data || resData.orders || [];
        const mappedOrders: Order[] = apiOrders.map((o: any) => {
          const apiItems = o.orderItems || o.items || [];
          const mappedItems: CartItem[] = apiItems.map((item: any) => ({
            id: item.menuItem?.id || item.menuItemId || "",
            name: item.menuItem?.name || item.name || "Menu",
            price: Number(item.menuItem?.price || item.price || 0),
            quantity: Number(item.quantity || 1),
            image: item.menuItem?.imageUrl || item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
          }));
          const dateObj = new Date(o.createdAt || o.date);
          return {
            id: o.id,
            items: mappedItems,
            total: Number(o.total || o.totalPrice || 0),
            status: o.status === "CANCELED" ? "CANCELLED" : (o.status || "PENDING"),
            date: dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
            time: dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            estimatedTime: "20-30 Menit",
            phone: o.phone || o.customerPhone || "",
            customerName: o.user?.name || o.customerName || "Member"
          };
        });
        set({ orders: mappedOrders });
      }
    } catch (err) {
      console.error("Gagal mengambil orders member dari API:", err);
    }
  },
}));
