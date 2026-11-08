"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // variantId
  productId: string;
  name: string;
  subtitle?: string | null;
  variantTitle: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  discountAmount: 0,
  finalTotal: 0,
  coupon: null,
  applyCoupon: async () => ({ success: false, message: "" }),
  removeCoupon: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("elora_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem("elora_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("elora_cart", JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.id === item.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      const newQty = Math.min(updated[existingIndex].quantity + quantity, item.maxStock || 99);
      updated[existingIndex].quantity = newQty;
    } else {
      updated = [...items, { ...item, quantity: Math.min(quantity, item.maxStock || 99) }];
    }

    saveItems(updated);
    setIsOpen(true);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    const updated = items.map((i) => {
      if (i.id === variantId) {
        return { ...i, quantity: Math.min(quantity, i.maxStock || 99) };
      }
      return i;
    });
    saveItems(updated);
  };

  const removeItem = (variantId: string) => {
    const updated = items.filter((i) => i.id !== variantId);
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
    setCoupon(null);
    localStorage.removeItem("elora_coupon");
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.valid && data.coupon) {
        setCoupon(data.coupon);
        localStorage.setItem("elora_coupon", JSON.stringify(data.coupon));
        return { success: true, message: `Privilege applied: ${data.coupon.description}` };
      } else {
        return { success: false, message: data.message || "Invalid promotional privilege." };
      }
    } catch {
      // Fallback client validation for offline/seed
      if (cleanCode === "WELCOME15") {
        const c: AppliedCoupon = {
          code: "WELCOME15",
          discountType: "PERCENTAGE",
          discountValue: 15,
          description: "15% off first ritual order",
        };
        setCoupon(c);
        localStorage.setItem("elora_coupon", JSON.stringify(c));
        return { success: true, message: "15% Welcome privilege applied." };
      }
      if (cleanCode === "ELORALUXE" && subtotal >= 100) {
        const c: AppliedCoupon = {
          code: "ELORALUXE",
          discountType: "FIXED",
          discountValue: 25,
          description: "$25 luxury privilege",
        };
        setCoupon(c);
        localStorage.setItem("elora_coupon", JSON.stringify(c));
        return { success: true, message: "$25 luxury privilege applied." };
      }
      return { success: false, message: "Promotional code is unrecognised or conditions not met." };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem("elora_coupon");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        discountAmount,
        finalTotal,
        coupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

