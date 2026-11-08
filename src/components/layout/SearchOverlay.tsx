"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchProductResult {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  basePrice: number;
  imageUrl: string;
  categoryName: string;
}

const POPULAR_SEARCHES = [
  "Triple Hyaluronic Acid",
  "Ceramide Barrier Crème",
  "Mineral SPF 50",
  "Bio-Retinol Nectar",
  "Combination Skin",
  "Signature Ritual Set",
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-elora-charcoal/60 backdrop-blur-md"
          />

          {/* Search Stage Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-3xl mx-auto mt-12 sm:mt-20 px-4"
          >
            <div className="bg-elora-surface border border-elora-border rounded-sm shadow-2xl overflow-hidden">
              {/* Input Header */}
              <div className="p-4 sm:p-6 border-b border-elora-border flex items-center gap-3">
                <Search className="w-5 h-5 text-elora-taupe flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search formulations, cellular actives, concerns..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-base sm:text-lg text-elora-charcoal placeholder:text-elora-gray/70 focus:outline-none font-editorial"
                />
                {loading && <Loader2 className="w-5 h-5 text-elora-taupe animate-spin flex-shrink-0" />}
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="p-1.5 text-elora-charcoal/70 hover:text-elora-charcoal hover:bg-elora-cream rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                {!query.trim() && (
                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-elora-gray font-medium block mb-3">
                      Popular Inquiries
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3.5 py-1.5 bg-elora-cream/60 hover:bg-elora-sand/30 border border-elora-border text-xs text-elora-charcoal rounded-full transition-colors font-sans"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query.trim() && !loading && results.length === 0 && (
                  <div className="py-12 text-center text-elora-gray">
                    <Sparkles className="w-8 h-8 text-elora-taupe mx-auto mb-2 opacity-60" />
                    <p className="font-editorial text-xl text-elora-charcoal">No direct formulation match found</p>
                    <p className="text-xs text-elora-gray mt-1 font-light">
                      Try searching by active ingredient (e.g. Ceramide, Hyaluronic) or category.
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase tracking-ultra text-elora-gray font-medium">
                        Matching Formulations ({results.length})
                      </span>
                      <Link
                        href="/shop"
                        onClick={onClose}
                        className="text-xs text-elora-taupe hover:underline"
                      >
                        View All in Atelier &rarr;
                      </Link>
                    </div>

                    <div className="divide-y divide-elora-border">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          onClick={onClose}
                          className="py-3.5 flex items-center justify-between hover:bg-elora-cream/30 -mx-6 px-6 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-14 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0 border border-elora-border">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <span className="text-[9.5px] uppercase tracking-wider text-elora-taupe block font-sans">
                                {product.categoryName}
                              </span>
                              <h4 className="font-editorial text-base text-elora-charcoal group-hover:text-elora-taupe transition-colors font-normal">
                                {product.name}
                              </h4>
                              {product.subtitle && (
                                <p className="text-[11px] text-elora-gray line-clamp-1 font-light">
                                  {product.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-elora-charcoal">
                              {formatPrice(product.basePrice)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-elora-gray group-hover:text-elora-taupe group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
