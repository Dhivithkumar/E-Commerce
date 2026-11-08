"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Droplets,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import ProductCard from "@/components/product/ProductCard";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    subtitle?: string | null;
    description: string;
    details?: string | null;
    howToUse?: string | null;
    basePrice: number;
    compareAtPrice?: number | null;
    badge?: string | null;
    volume?: string;
    skinTypes: string;
    primaryConcerns: string;
    routineStep: string;
    category: { id: string; name: string; slug: string };
    images: { id: string; url: string; alt: string; isPrimary: boolean; order: number }[];
    variants: { id: string; title: string; price: number; compareAtPrice?: number | null; stock: number; sku: string }[];
    productIngredients: {
      ingredient: { name: string; slug: string; description: string; benefit: string; safetyRating: string };
    }[];
    reviews: { id: string; authorName: string; rating: number; title: string; comment: string; createdAt: Date | string }[];
  };
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "howToUse" | "skinTypes">("benefits");
  const [isAdding, setIsAdding] = useState(false);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const images = product.images.length > 0
    ? product.images
    : [
        {
          id: "default-img",
          url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
          alt: product.name,
          isPrimary: true,
          order: 0,
        },
      ];

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const currentPrice = currentVariant ? currentVariant.price : product.basePrice;
  const currentCompareAt = currentVariant ? currentVariant.compareAtPrice : product.compareAtPrice;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (shouldRedirectToCheckout = false) => {
    if (!currentVariant) return;

    setIsAdding(true);
    addItem(
      {
        id: currentVariant.id,
        productId: product.id,
        name: product.name,
        subtitle: product.subtitle,
        variantTitle: currentVariant.title,
        sku: currentVariant.sku,
        price: currentPrice,
        compareAtPrice: currentCompareAt,
        image: images[0]?.url,
        maxStock: currentVariant.stock,
      },
      quantity
    );

    setTimeout(() => {
      setIsAdding(false);
      if (shouldRedirectToCheckout) {
        router.push("/checkout");
      }
    }, 400);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewTitle || !reviewComment) return;

    setReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewAuthor,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setReviewLoading(false);
    }
  };

  const totalReviews = product.reviews.length;
  const avgRating = totalReviews > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  return (
    <div className="bg-elora-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-gray mb-8">
          <Link href="/" className="hover:text-elora-charcoal">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-elora-charcoal">Atelier</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/collections/${product.category.slug}`} className="hover:text-elora-charcoal">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-elora-charcoal font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Showcase (Gallery + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] bg-elora-cream rounded-sm overflow-hidden border border-elora-border shadow-luxury">
              <Image
                src={images[selectedImageIndex]?.url || images[0]?.url}
                alt={images[selectedImageIndex]?.alt || product.name}
                fill
                priority
                className="object-cover object-center transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-elora-forest/90 text-elora-sand text-xs uppercase tracking-luxury font-medium backdrop-blur-sm rounded-sm">
                    {product.badge}
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all ${
                  inWishlist
                    ? "bg-elora-taupe text-white"
                    : "bg-white/80 text-elora-charcoal hover:bg-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 flex-shrink-0 bg-elora-cream rounded-sm overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? "border-elora-charcoal ring-1 ring-elora-charcoal"
                        : "border-elora-border/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Commerce & Configuration Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                <span>{product.category.name}</span>
                <span className="text-elora-gray">{product.volume}</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-elora-charcoal font-normal mt-2 leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-elora-gray mt-1.5 font-sans">
                  {product.subtitle}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 text-xs text-elora-charcoal">
                <div className="flex text-elora-sand">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">{avgRating}</span>
                <a href="#reviews" className="text-elora-gray underline hover:text-elora-charcoal">
                  ({totalReviews} Verified Client Reviews)
                </a>
              </div>
            </div>

            {/* Price Row */}
            <div className="py-4 border-y border-elora-border/60 flex items-baseline gap-3">
              <span className="font-editorial text-3xl text-elora-charcoal font-medium">
                {formatPrice(currentPrice)}
              </span>
              {currentCompareAt && (
                <span className="text-sm text-elora-gray line-through">
                  {formatPrice(currentCompareAt)}
                </span>
              )}
              <span className="text-[11px] text-elora-forest font-sans ml-auto">
                Taxes & International Duties Calculated at Checkout
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-ultra text-elora-charcoal font-medium block">
                  Select Presentation & Volume
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`p-3 text-left border rounded-sm transition-all ${
                        selectedVariantId === variant.id
                          ? "border-elora-charcoal bg-elora-surface shadow-sm"
                          : "border-elora-border/70 hover:border-elora-border bg-elora-surface/50"
                      }`}
                    >
                      <p className="text-xs font-medium text-elora-charcoal">{variant.title}</p>
                      <p className="text-xs text-elora-taupe mt-0.5">{formatPrice(variant.price)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-elora-gray uppercase tracking-wider">
                <span>Quantity</span>
                <span className="text-elora-forest">
                  {currentVariant && currentVariant.stock > 0
                    ? `In Stock (${currentVariant.stock} available)`
                    : "Temporarily Allocation Reserved"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-elora-border rounded-sm bg-elora-surface">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-elora-charcoal hover:bg-elora-cream/40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-medium text-elora-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(quantity + 1, currentVariant?.stock || 10))
                    }
                    className="px-3.5 py-2.5 text-elora-charcoal hover:bg-elora-cream/40 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding || !currentVariant || currentVariant.stock <= 0}
                  className="flex-1 py-3.5 px-6 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 rounded-sm font-medium flex items-center justify-center gap-2 group shadow-sm disabled:opacity-50"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 text-elora-sand" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Bag — {formatPrice(currentPrice * quantity)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={() => handleAddToCart(true)}
              disabled={isAdding || !currentVariant || currentVariant.stock <= 0}
              className="w-full py-3 px-6 bg-elora-forest text-elora-sand hover:bg-elora-ivory hover:text-elora-forest border border-elora-forest text-xs uppercase tracking-luxury transition-all duration-300 rounded-sm font-medium flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Express Checkout</span>
            </button>

            {/* Luxury Assurance Strip */}
            <div className="pt-4 border-t border-elora-border/60 grid grid-cols-2 gap-4 text-xs text-elora-gray">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-elora-taupe flex-shrink-0" />
                <span>Complimentary Carbon-Neutral Courier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-elora-taupe flex-shrink-0" />
                <span>30-Day Ritual Return Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-elora-taupe flex-shrink-0" />
                <span>100% Synthetic Fragrance-Free</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-elora-taupe flex-shrink-0" />
                <span>Dermatologist Formulated & Tested</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Formulation Tabs */}
        <div className="mt-20 border-t border-elora-border pt-12">
          {/* Tab Headers */}
          <div className="flex gap-8 border-b border-elora-border/60 pb-3 overflow-x-auto scrollbar-none text-xs uppercase tracking-luxury font-medium">
            <button
              onClick={() => setActiveTab("benefits")}
              className={`pb-3 transition-colors ${
                activeTab === "benefits"
                  ? "text-elora-charcoal border-b-2 border-elora-charcoal font-semibold"
                  : "text-elora-gray hover:text-elora-charcoal"
              }`}
            >
              Benefits & Science
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`pb-3 transition-colors ${
                activeTab === "ingredients"
                  ? "text-elora-charcoal border-b-2 border-elora-charcoal font-semibold"
                  : "text-elora-gray hover:text-elora-charcoal"
              }`}
            >
              Ingredient Profile ({product.productIngredients.length})
            </button>
            <button
              onClick={() => setActiveTab("howToUse")}
              className={`pb-3 transition-colors ${
                activeTab === "howToUse"
                  ? "text-elora-charcoal border-b-2 border-elora-charcoal font-semibold"
                  : "text-elora-gray hover:text-elora-charcoal"
              }`}
            >
              Ritual Ceremony
            </button>
            <button
              onClick={() => setActiveTab("skinTypes")}
              className={`pb-3 transition-colors ${
                activeTab === "skinTypes"
                  ? "text-elora-charcoal border-b-2 border-elora-charcoal font-semibold"
                  : "text-elora-gray hover:text-elora-charcoal"
              }`}
            >
              Skin Compatibility
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8 text-xs sm:text-sm text-elora-gray font-sans leading-relaxed max-w-4xl">
            {activeTab === "benefits" && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Stratum Corneum Cellular Support
                </h3>
                <p>
                  {product.details ||
                    "This advanced formulation is bio-engineered to replenish depleted lipid envelopes without occlusive synthetic silicones. By leveraging cellular signaling peptides and extremolytes, it empowers skin to defend against daily oxidative exposure while preserving optimal barrier elasticity."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-elora-surface border border-elora-border/60 rounded-sm">
                    <p className="font-semibold text-elora-charcoal mb-1">Barrier Fortification</p>
                    <p className="text-xs">Reconstructs depleted intercellular cement in a physiological 3:1:1 lipid ratio.</p>
                  </div>
                  <div className="p-4 bg-elora-surface border border-elora-border/60 rounded-sm">
                    <p className="font-semibold text-elora-charcoal mb-1">Cellular Osmoprotection</p>
                    <p className="text-xs">Shields native enzymes and proteins against urban pollution and blue-light oxidative stress.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="space-y-6">
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Transparency Formulation Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.productIngredients.map(({ ingredient }) => (
                    <div
                      key={ingredient.slug}
                      className="p-5 bg-elora-surface border border-elora-border/70 rounded-sm space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-editorial text-lg text-elora-charcoal font-medium">
                          {ingredient.name}
                        </h4>
                        <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-forest/10 text-elora-forest rounded-sm font-medium">
                          {ingredient.safetyRating}
                        </span>
                      </div>
                      <p className="text-xs text-elora-taupe font-medium">{ingredient.benefit}</p>
                      <p className="text-xs text-elora-gray leading-relaxed">{ingredient.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "howToUse" && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Application Ceremony & Protocol
                </h3>
                <p>
                  {product.howToUse ||
                    "Dispense 3 to 4 drops into the palms of clean hands. Inhale the subtle botanical notes to center your senses. Warm gently between palms and press lightly across forehead, cheeks, jawline, and décolletage."}
                </p>
                <div className="p-4 bg-elora-cream/50 border border-elora-border/60 rounded-sm space-y-2">
                  <p className="font-medium text-elora-charcoal text-xs uppercase tracking-wider">
                    Routine Placement: Step {product.routineStep}
                  </p>
                  <p className="text-xs text-elora-gray">
                    Cleanse &rarr; Treat ({product.routineStep}) &rarr; Hydrate &rarr; Protect
                  </p>
                </div>
              </div>
            )}

            {activeTab === "skinTypes" && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Suitability & Tolerance Matrix
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong className="text-elora-charcoal font-medium">Tested Complexions: </strong>
                    <span className="capitalize">{product.skinTypes.split(",").join(" • ")}</span>
                  </p>
                  <p>
                    <strong className="text-elora-charcoal font-medium">Primary Concerns: </strong>
                    <span className="capitalize">{product.primaryConcerns.split(",").join(" • ")}</span>
                  </p>
                  <p className="pt-2 text-xs text-elora-gray">
                    Dermatologically validated for daily morning and nighttime application. If you have known botanical allergies, consult our full ingredient index prior to first ritual.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-20 border-t border-elora-border pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                Client Reflections
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
                Verified Ritual Reviews
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-xs">
              <div className="flex text-elora-sand">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-elora-charcoal">{avgRating} out of 5</span>
              <span className="text-elora-gray">({totalReviews} Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="p-8 bg-elora-surface border border-elora-border text-center rounded-sm">
                  <p className="font-editorial text-xl text-elora-charcoal">Be the first to reflect</p>
                  <p className="text-xs text-elora-gray mt-1">Share your experience with this formulation.</p>
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 bg-elora-surface border border-elora-border/70 rounded-sm space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex text-elora-sand">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-elora-gray">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h4 className="font-editorial text-lg text-elora-charcoal">{rev.title}</h4>
                    <p className="text-xs text-elora-gray leading-relaxed font-sans">{rev.comment}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-elora-forest font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{rev.authorName} • Verified Ritual Order</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-elora-surface border border-elora-border p-6 rounded-sm space-y-4 h-fit">
              <h3 className="font-editorial text-2xl text-elora-charcoal">
                Submit Your Impression
              </h3>
              <p className="text-xs text-elora-gray leading-relaxed">
                Provide feedback to our formulation chemists and assist fellow skincare seekers.
              </p>

              {reviewSubmitted ? (
                <div className="p-4 bg-elora-cream/60 border border-elora-taupe/30 text-xs text-elora-forest rounded-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-elora-forest flex-shrink-0" />
                  <span>Thank you. Your reflection has been registered into our client archives.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Charlotte M."
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? "fill-elora-sand text-elora-sand"
                                : "text-elora-border"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Exceptional barrier soothing"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Your Detailed Observations
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the texture, absorption, and results observed on your complexion..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full py-3 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 font-medium rounded-sm"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Related Formulations Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-elora-border pt-16">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                Ritual Harmonizers
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
                Complementary Formulations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

