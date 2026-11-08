"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Badge } from "@/components/ui/Badge";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    subtitle?: string | null;
    basePrice: number;
    compareAtPrice?: number | null;
    badge?: string | null;
    volume?: string;
    category?: { name: string; slug: string };
    images: { url: string; alt: string; isPrimary: boolean }[];
    variants?: { id: string; title: string; price: number; stock: number; sku: string }[];
    reviews?: { rating: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85";

  const secondaryImage = product.images?.[1]?.url || primaryImage;
  const inWishlist = isInWishlist(product.id);

  // Review calculations
  const totalReviews = product.reviews?.length || 0;
  const avgRating =
    totalReviews > 0
      ? (product.reviews!.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const defaultVariant = product.variants?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) return;

    setIsAdding(true);
    addItem(
      {
        id: defaultVariant.id,
        productId: product.id,
        name: product.name,
        subtitle: product.subtitle,
        variantTitle: defaultVariant.title,
        sku: defaultVariant.sku,
        price: defaultVariant.price || product.basePrice,
        compareAtPrice: product.compareAtPrice,
        image: primaryImage,
        maxStock: defaultVariant.stock,
      },
      1
    );

    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div className="group relative flex flex-col bg-elora-surface border border-elora-border hover:border-elora-taupe/40 transition-all duration-500 rounded-sm overflow-hidden hover:shadow-luxury">
      {/* Top Image Vessel */}
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] bg-elora-cream/40 overflow-hidden">
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Secondary Image for crossfade */}
        <Image
          src={secondaryImage}
          alt={`${product.name} detail`}
          fill
          className="object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="bestseller">{product.badge}</Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 shadow-sm ${
            inWishlist
              ? "bg-elora-taupe text-white opacity-100"
              : "bg-white/85 text-elora-charcoal hover:bg-white hover:text-elora-taupe opacity-90 sm:opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Desktop Quick Add Slide-up bar */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2.5 px-4 bg-elora-forest hover:bg-elora-forest/90 text-elora-ivory text-[11px] uppercase tracking-luxury backdrop-blur-sm transition-colors flex items-center justify-center gap-2 rounded-sm font-medium shadow-sm active:scale-[0.99]"
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 text-elora-sand" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-elora-sand" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile quick add floating button */}
        <div className="absolute right-3 bottom-3 z-10 sm:hidden">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            aria-label="Quick add to bag"
            className="p-2.5 bg-elora-forest text-elora-ivory rounded-full shadow-md active:scale-95"
          >
            {isAdding ? (
              <Check className="w-4 h-4 text-elora-sand" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-elora-sand" />
            )}
          </button>
        </div>
      </Link>

      {/* Product Details Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Volume */}
          <div className="flex items-center justify-between text-[10.5px] text-elora-gray uppercase tracking-wider mb-1 font-sans">
            <span>{product.category?.name || "Haute Formule"}</span>
            {product.volume && <span>{product.volume}</span>}
          </div>

          {/* Title */}
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-editorial text-lg sm:text-xl text-elora-charcoal hover:text-elora-taupe transition-colors line-clamp-1 font-normal">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle */}
          {product.subtitle && (
            <p className="text-xs text-elora-gray line-clamp-1 mt-0.5 font-sans font-light">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Price & Rating */}
        <div className="pt-2 border-t border-elora-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-elora-charcoal">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-elora-gray line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-elora-charcoal">
            <Star className="w-3 h-3 fill-elora-sand text-elora-sand" />
            <span className="font-medium text-[11px]">{avgRating}</span>
            <span className="text-elora-gray text-[10px]">({totalReviews || 12})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
