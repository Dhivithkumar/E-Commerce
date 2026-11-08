"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X, ArrowUpDown, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  badge?: string | null;
  volume?: string;
  skinTypes: string;
  primaryConcerns: string;
  routineStep: string;
  createdAt: Date | string;
  category: { id: string; name: string; slug: string };
  images: { url: string; alt: string; isPrimary: boolean }[];
  variants: { id: string; title: string; price: number; stock: number; sku: string }[];
  reviews: { rating: number }[];
}

interface ShopCatalogClientProps {
  products: ProductWithRelations[];
  categories: { id: string; name: string; slug: string }[];
  initialCategorySlug?: string;
}

export default function ShopCatalogClient({
  products,
  categories,
  initialCategorySlug,
}: ShopCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || "all");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("all");
  const [selectedConcern, setSelectedConcern] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const skinTypes = [
    { label: "All Skin Complexions", value: "all" },
    { label: "Dry / Depleted", value: "dry" },
    { label: "Sensitive / Reactive", value: "sensitive" },
    { label: "Combination", value: "combination" },
    { label: "Oily / Congested", value: "oily" },
  ];

  const skinConcerns = [
    { label: "All Concerns", value: "all" },
    { label: "Barrier Repair", value: "barrier" },
    { label: "Deep Hydration", value: "hydration" },
    { label: "Fine Lines & Renewal", value: "anti-aging" },
    { label: "Micro-Texture", value: "texture" },
    { label: "Photoprotection", value: "sun-protection" },
  ];

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under $100", value: "under-100" },
    { label: "$100 to $150", value: "100-150" },
    { label: "Over $150", value: "over-150" },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategory !== "all" && p.category.slug !== selectedCategory) {
          return false;
        }
        // Skin Type Filter
        if (selectedSkinType !== "all" && !p.skinTypes.toLowerCase().includes(selectedSkinType)) {
          return false;
        }
        // Skin Concern Filter
        if (selectedConcern !== "all" && !p.primaryConcerns.toLowerCase().includes(selectedConcern)) {
          return false;
        }
        // Price Filter
        if (priceRange === "under-100" && p.basePrice >= 100) return false;
        if (priceRange === "100-150" && (p.basePrice < 100 || p.basePrice > 150)) return false;
        if (priceRange === "over-150" && p.basePrice <= 150) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.basePrice - b.basePrice;
        if (sortBy === "price-high") return b.basePrice - a.basePrice;
        if (sortBy === "rating") {
          const aRating = a.reviews.length
            ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length
            : 5;
          const bRating = b.reviews.length
            ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length
            : 5;
          return bRating - aRating;
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0; // Default featured
      });
  }, [products, selectedCategory, selectedSkinType, selectedConcern, priceRange, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSkinType !== "all" ? 1 : 0) +
    (selectedConcern !== "all" ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSkinType("all");
    setSelectedConcern("all");
    setPriceRange("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Bar with Filter Count & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-elora-border gap-4">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Verified Archives
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
            Haute Skincare Atelier
          </h1>
          <p className="text-xs text-elora-gray mt-1">
            Displaying {filteredProducts.length} of {products.length} formulations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2 bg-elora-surface border border-elora-border text-xs uppercase tracking-wider text-elora-charcoal flex items-center gap-2 rounded-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-elora-taupe" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-elora-surface border border-elora-border px-3 py-2 rounded-sm text-xs text-elora-charcoal">
            <ArrowUpDown className="w-3.5 h-3.5 text-elora-gray" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-elora-charcoal cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-elora-border/60">
          {activeFiltersCount > 0 && (
            <div className="p-3 bg-elora-cream/40 border border-elora-border rounded-sm flex items-center justify-between">
              <span className="text-xs text-elora-charcoal font-medium">
                {activeFiltersCount} Active Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-elora-taupe hover:underline uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Category Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-ultra text-elora-charcoal font-semibold mb-3">
              Collection Tier
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-elora-charcoal text-elora-ivory font-medium"
                    : "text-elora-gray hover:text-elora-charcoal hover:bg-elora-cream/40"
                }`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-elora-charcoal text-elora-ivory font-medium"
                      : "text-elora-gray hover:text-elora-charcoal hover:bg-elora-cream/40"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-ultra text-elora-charcoal font-semibold mb-3">
              Skin Complexion
            </h4>
            <div className="space-y-1 text-xs">
              {skinTypes.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setSelectedSkinType(st.value)}
                  className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
                    selectedSkinType === st.value
                      ? "bg-elora-taupe text-white font-medium"
                      : "text-elora-gray hover:text-elora-charcoal hover:bg-elora-cream/40"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concern Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-ultra text-elora-charcoal font-semibold mb-3">
              Targeted Concern
            </h4>
            <div className="space-y-1 text-xs">
              {skinConcerns.map((sc) => (
                <button
                  key={sc.value}
                  onClick={() => setSelectedConcern(sc.value)}
                  className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
                    selectedConcern === sc.value
                      ? "bg-elora-taupe text-white font-medium"
                      : "text-elora-gray hover:text-elora-charcoal hover:bg-elora-cream/40"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-ultra text-elora-charcoal font-semibold mb-3">
              Price Range (USD)
            </h4>
            <div className="space-y-1 text-xs">
              {priceRanges.map((pr) => (
                <button
                  key={pr.value}
                  onClick={() => setPriceRange(pr.value)}
                  className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
                    priceRange === pr.value
                      ? "bg-elora-taupe text-white font-medium"
                      : "text-elora-gray hover:text-elora-charcoal hover:bg-elora-cream/40"
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-elora-surface border border-elora-border rounded-sm p-8">
              <Sparkles className="w-8 h-8 text-elora-taupe mx-auto mb-3" />
              <h3 className="font-editorial text-2xl text-elora-charcoal">
                No formulations matched your current filters
              </h3>
              <p className="text-xs text-elora-gray mt-2 max-w-sm mx-auto leading-relaxed">
                Try loosening your filter parameters or exploring our personalized AI Skin Discovery diagnostic.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors rounded-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-elora-ivory p-6 shadow-drawer border-l border-elora-border overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-elora-border">
              <span className="font-editorial text-xl text-elora-charcoal">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-elora-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-ultra text-elora-charcoal font-semibold mb-2">
                Collection
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left py-2 px-2.5 rounded-sm ${
                    selectedCategory === "all"
                      ? "bg-elora-charcoal text-white"
                      : "text-elora-charcoal hover:bg-elora-cream"
                  }`}
                >
                  All Collections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-2 px-2.5 rounded-sm ${
                      selectedCategory === cat.slug
                        ? "bg-elora-charcoal text-white"
                        : "text-elora-charcoal hover:bg-elora-cream"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-elora-border space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury rounded-sm"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2.5 bg-transparent border border-elora-border text-elora-charcoal text-xs uppercase tracking-luxury rounded-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

