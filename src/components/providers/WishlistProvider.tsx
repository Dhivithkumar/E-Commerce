"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  isInWishlist: () => false,
  toggleWishlist: () => {},
  wishlistCount: 0,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("elora_wishlist");
      if (saved) {
        setWishlistIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem("elora_wishlist", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

