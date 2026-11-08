"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  basePrice: number;
  imageUrl: string;
  categoryName: string;
  variantId?: string;
  stock: number;
}

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/products/search?q=");
        // Or fetch all products and filter
        const catalogRes = await fetch("/api/products/all");
        const data = await catalogRes.json();
        const matched = (data.products || []).filter((p: any) =>
          wishlistIds.includes(p.id)
        );
        setProducts(matched);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Saved Rituals
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal mt-1">
            Your Private Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray mt-2 font-sans">
            Formulations reserved for your future ceremonies and aesthetic transformations.
          </p>
        </div>

        {wishlistIds.length === 0 ? (
          <div className="py-20 text-center bg-elora-surface border border-elora-border rounded-sm p-8 max-w-xl mx-auto">
            <Heart className="w-10 h-10 text-elora-taupe mx-auto mb-3" />
            <h3 className="font-editorial text-2xl text-elora-charcoal">Your Wishlist is Empty</h3>
            <p className="text-xs text-elora-gray mt-2 leading-relaxed">
              Explore our verified clinical catalog and tap the heart icon on any formulation to save it here.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-8 py-3 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors rounded-sm font-medium"
            >
              Explore Formulations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/5] bg-elora-cream">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-red-600 rounded-full transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-elora-taupe">
                      {p.categoryName}
                    </span>
                    <Link href={`/shop/${p.slug}`}>
                      <h3 className="font-editorial text-xl text-elora-charcoal hover:text-elora-taupe transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    {p.subtitle && (
                      <p className="text-xs text-elora-gray mt-0.5 line-clamp-1">{p.subtitle}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-elora-border/60 flex items-center justify-between">
                    <span className="text-sm font-medium text-elora-charcoal">
                      {formatPrice(p.basePrice)}
                    </span>

                    <button
                      onClick={() =>
                        addItem({
                          id: p.variantId || p.id,
                          productId: p.id,
                          name: p.name,
                          subtitle: p.subtitle,
                          variantTitle: "Standard Volume",
                          sku: p.slug,
                          price: p.basePrice,
                          image: p.imageUrl,
                          maxStock: p.stock || 50,
                        })
                      }
                      className="px-4 py-2 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors flex items-center gap-1.5 rounded-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

