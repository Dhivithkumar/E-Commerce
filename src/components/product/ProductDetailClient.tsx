"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Layers,
  Sun,
  Shield,
  ZoomIn,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const purchaseSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (purchaseSectionRef.current) {
        const rect = purchaseSectionRef.current.getBoundingClientRect();
        // Show sticky bar when user scrolls past the main buy action
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <nav className="flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-gray mb-8 font-sans">
          <Link href="/" className="hover:text-elora-charcoal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-elora-border" />
          <Link href="/shop" className="hover:text-elora-charcoal transition-colors">Atelier</Link>
          <ChevronRight className="w-3 h-3 text-elora-border" />
          <Link href={`/collections/${product.category.slug}`} className="hover:text-elora-charcoal transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-elora-border" />
          <span className="text-elora-charcoal font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Showcase (Gallery + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image with Zoom Toggle */}
            <div
              onClick={() => setIsZoomed(!isZoomed)}
              className="relative aspect-[4/5] bg-elora-cream rounded-sm overflow-hidden border border-elora-border shadow-luxury cursor-zoom-in group"
            >
              <Image
                src={images[selectedImageIndex]?.url || images[0]?.url}
                alt={images[selectedImageIndex]?.alt || product.name}
                fill
                priority
                className={`object-cover object-center transition-all duration-700 ease-out ${
                  isZoomed ? "scale-125" : "scale-100 group-hover:scale-105"
                }`}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="bestseller">{product.badge}</Badge>
                </div>
              )}

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Toggle zoom preview"
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white text-elora-charcoal shadow-sm transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  aria-label="Wishlist"
                  className={`p-2.5 rounded-full transition-all shadow-sm ${
                    inWishlist
                      ? "bg-elora-taupe text-white"
                      : "bg-white/80 text-elora-charcoal hover:bg-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 z-10 bg-elora-charcoal/80 text-elora-ivory text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {isZoomed ? "Click to Reset View" : "Click to Magnify"}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-20 h-24 flex-shrink-0 bg-elora-cream rounded-sm overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? "border-elora-charcoal ring-1 ring-elora-charcoal"
                        : "border-elora-border opacity-70 hover:opacity-100"
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
          <div ref={purchaseSectionRef} className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                <span>{product.category.name}</span>
                <span className="text-elora-gray">{product.volume}</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-elora-charcoal font-normal mt-2 leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-elora-gray mt-1.5 font-sans font-light">
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
                <a href="#reviews" className="text-elora-gray underline hover:text-elora-charcoal transition-colors">
                  ({totalReviews} Verified Client Reflections)
                </a>
              </div>
            </div>

            {/* Price Row */}
            <div className="py-4 border-y border-elora-border flex items-baseline gap-3">
              <span className="font-editorial text-3xl sm:text-4xl text-elora-charcoal font-medium">
                {formatPrice(currentPrice)}
              </span>
              {currentCompareAt && (
                <span className="text-sm text-elora-gray line-through">
                  {formatPrice(currentCompareAt)}
                </span>
              )}
              <span className="text-[11px] text-elora-forest font-sans ml-auto">
                Taxes & Duties Calculated at Checkout
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
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
                          ? "border-elora-charcoal bg-elora-surface shadow-sm ring-1 ring-elora-charcoal"
                          : "border-elora-border hover:border-elora-taupe/40 bg-elora-surface/60"
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
              <div className="flex items-center justify-between text-[11px] text-elora-gray uppercase tracking-wider font-sans">
                <span>Quantity</span>
                <span className="text-elora-forest font-medium">
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
                    aria-label="Decrease quantity"
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
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <Button
                  variant="forest"
                  size="lg"
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding || !currentVariant || currentVariant.stock <= 0}
                  className="flex-1 shadow-luxury"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 text-elora-sand mr-2" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-elora-sand mr-2" />
                      <span>Add To Bag — {formatPrice(currentPrice * quantity)}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Instant Express Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleAddToCart(true)}
              disabled={isAdding || !currentVariant || currentVariant.stock <= 0}
              className="w-full shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Instant Express Checkout</span>
            </Button>

            {/* Luxury Assurance Strip */}
            <div className="pt-4 border-t border-elora-border grid grid-cols-2 gap-4 text-xs text-elora-gray">
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
          <div className="flex gap-8 border-b border-elora-border pb-3 overflow-x-auto scrollbar-none text-xs uppercase tracking-luxury font-medium font-sans">
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
            <AnimatePresence mode="wait">
              {activeTab === "benefits" && (
                <motion.div
                  key="benefits"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-editorial text-2xl text-elora-charcoal font-normal">
                    Stratum Corneum Cellular Support
                  </h3>
                  <p className="font-light">
                    {product.details ||
                      "This advanced formulation is bio-engineered to replenish depleted lipid envelopes without occlusive synthetic silicones. By leveraging cellular signaling peptides and extremolytes, it empowers skin to defend against daily oxidative exposure while preserving optimal barrier elasticity."}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-5 bg-elora-surface border border-elora-border rounded-sm shadow-sm">
                      <p className="font-semibold text-elora-charcoal mb-1">Barrier Fortification</p>
                      <p className="text-xs font-light">Reconstructs depleted intercellular cement in a physiological 3:1:1 lipid ratio.</p>
                    </div>
                    <div className="p-5 bg-elora-surface border border-elora-border rounded-sm shadow-sm">
                      <p className="font-semibold text-elora-charcoal mb-1">Cellular Osmoprotection</p>
                      <p className="text-xs font-light">Shields native enzymes and proteins against urban pollution and blue-light oxidative stress.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "ingredients" && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="font-editorial text-2xl text-elora-charcoal font-normal">
                    Transparency Formulation Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.productIngredients.map(({ ingredient }) => (
                      <div
                        key={ingredient.slug}
                        className="p-5 bg-elora-surface border border-elora-border rounded-sm space-y-2 shadow-sm"
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
                        <p className="text-xs text-elora-gray leading-relaxed font-light">{ingredient.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "howToUse" && (
                <motion.div
                  key="howToUse"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-editorial text-2xl text-elora-charcoal font-normal">
                    Application Ceremony & Protocol
                  </h3>
                  <p className="font-light">
                    {product.howToUse ||
                      "Dispense 3 to 4 drops into the palms of clean hands. Inhale the subtle botanical notes to center your senses. Warm gently between palms and press lightly across forehead, cheeks, jawline, and décolletage."}
                  </p>
                  <div className="p-5 bg-elora-cream/50 border border-elora-border rounded-sm space-y-2 shadow-sm">
                    <p className="font-medium text-elora-charcoal text-xs uppercase tracking-wider">
                      Routine Placement: Step {product.routineStep}
                    </p>
                    <p className="text-xs text-elora-gray font-light">
                      Cleanse &rarr; Treat ({product.routineStep}) &rarr; Hydrate &rarr; Protect
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "skinTypes" && (
                <motion.div
                  key="skinTypes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-editorial text-2xl text-elora-charcoal font-normal">
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
                    <p className="pt-2 text-xs text-elora-gray font-light">
                      Dermatologically validated for daily morning and nighttime application. If you have known botanical allergies, consult our full ingredient index prior to first ritual.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-20 border-t border-elora-border pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                Client Reflections
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1 font-normal">
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
                    className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-3 shadow-sm"
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
                    <h4 className="font-editorial text-lg text-elora-charcoal font-normal">{rev.title}</h4>
                    <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">{rev.comment}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-elora-forest font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{rev.authorName} • Verified Ritual Order</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-elora-surface border border-elora-border p-6 rounded-sm space-y-4 h-fit shadow-luxury">
              <h3 className="font-editorial text-2xl text-elora-charcoal font-normal">
                Submit Your Impression
              </h3>
              <p className="text-xs text-elora-gray leading-relaxed font-light">
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
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
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
                          className="p-1 hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
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
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
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
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="forest"
                    size="md"
                    isLoading={reviewLoading}
                    className="w-full"
                  >
                    <span>Submit Impression</span>
                  </Button>
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
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1 font-normal">
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

      {/* Floating Sticky Purchase Bar on Scroll */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-elora-surface/95 backdrop-blur-md border-t border-elora-border py-3 px-4 sm:px-8 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-13 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0 border border-elora-border hidden sm:block">
                  <Image
                    src={images[0]?.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-editorial text-base sm:text-lg text-elora-charcoal truncate font-normal">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-elora-gray truncate font-sans">
                    {currentVariant?.title} • {formatPrice(currentPrice)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Button
                  variant="forest"
                  size="md"
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding || !currentVariant || currentVariant.stock <= 0}
                  className="shadow-md whitespace-nowrap"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-elora-sand" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-elora-sand" />
                      <span>Add to Bag — {formatPrice(currentPrice * quantity)}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
