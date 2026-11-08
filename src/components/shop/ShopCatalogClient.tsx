"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X, ArrowUpDown, Sparkles, Filter } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

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
          <h1 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1 font-normal">
            Haute Skincare Atelier
          </h1>
          <p className="text-xs text-elora-gray mt-1 font-sans font-light">
            Displaying {filteredProducts.length} of {products.length} clinical formulations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-elora-taupe" />
            <span>Filters ({activeFiltersCount})</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-elora-surface border border-elora-border px-3.5 py-2.5 rounded-sm text-xs text-elora-charcoal shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-elora-gray" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-elora-charcoal cursor-pointer font-sans"
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

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="py-4 border-b border-elora-border flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-ultra text-elora-gray mr-1">
            Active Filters:
          </span>
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-elora-cream text-elora-charcoal text-xs rounded-full border border-elora-border">
              <span>Collection: {categories.find((c) => c.slug === selectedCategory)?.name}</span>
              <button onClick={() => setSelectedCategory("all")} className="hover:text-elora-taupe">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSkinType !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-elora-cream text-elora-charcoal text-xs rounded-full border border-elora-border">
              <span>Skin: {skinTypes.find((s) => s.value === selectedSkinType)?.label}</span>
              <button onClick={() => setSelectedSkinType("all")} className="hover:text-elora-taupe">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedConcern !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-elora-cream text-elora-charcoal text-xs rounded-full border border-elora-border">
              <span>Concern: {skinConcerns.find((c) => c.value === selectedConcern)?.label}</span>
              <button onClick={() => setSelectedConcern("all")} className="hover:text-elora-taupe">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {priceRange !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-elora-cream text-elora-charcoal text-xs rounded-full border border-elora-border">
              <span>Price: {priceRanges.find((p) => p.value === priceRange)?.label}</span>
              <button onClick={() => setPriceRange("all")} className="hover:text-elora-taupe">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-elora-taupe hover:underline uppercase tracking-wider ml-2 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-elora-border">
          {/* Category Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-ultra text-elora-charcoal font-semibold mb-3">
              Collection Tier
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left py-1.5 px-2.5 rounded-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-elora-forest text-elora-sand font-medium"
                    : "text-elora-gray hover:text-elora-charcoal hover:bg-elora-cream/40"
                }`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-elora-forest text-elora-sand font-medium"
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
                  className={`w-full text-left py-1.5 px-2.5 rounded-sm transition-colors ${
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
                  className={`w-full text-left py-1.5 px-2.5 rounded-sm transition-colors ${
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
                  className={`w-full text-left py-1.5 px-2.5 rounded-sm transition-colors ${
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
            <EmptyState
              icon={Sparkles}
              title="No formulations matched your current filters"
              description="Try loosening your filter parameters or exploring our personalized AI Skin Discovery consultation."
              actionText="Reset All Filters"
              onAction={resetFilters}
            />
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
                aria-label="Close filters"
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
                      ? "bg-elora-forest text-elora-sand font-medium"
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
                        ? "bg-elora-forest text-elora-sand font-medium"
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
              <Button
                variant="forest"
                size="md"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full"
              >
                <span>Apply Filters ({filteredProducts.length})</span>
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={resetFilters}
                className="w-full"
              >
                <span>Reset All</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
