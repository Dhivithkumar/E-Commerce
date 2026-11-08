"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
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
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative max-w-3xl mx-auto mt-16 px-4 sm:px-6">
        <div className="bg-elora-ivory border border-elora-border shadow-luxury overflow-hidden">
          {/* Search Header */}
          <div className="p-6 border-b border-elora-border flex items-center gap-4 bg-elora-surface/80">
            <Search className="w-5 h-5 text-elora-taupe flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search formulations, ingredients, or skin concerns..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-editorial text-xl sm:text-2xl text-elora-charcoal placeholder:text-elora-gray/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-elora-gray hover:text-elora-charcoal text-xs uppercase"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-elora-charcoal/70 hover:text-elora-charcoal rounded-full hover:bg-elora-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="py-8 text-center text-xs uppercase tracking-luxury text-elora-taupe">
                Consulting verified archives...
              </div>
            )}

            {!loading && results.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-elora-gray mb-4">
                  Matching Formulations ({results.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={onClose}
                      className="flex gap-3 p-3 bg-elora-surface/60 hover:bg-elora-surface border border-elora-border/60 hover:border-elora-taupe/40 transition-all group"
                    >
                      <div className="relative w-16 h-20 bg-elora-cream flex-shrink-0 overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-wider text-elora-taupe">
                          {product.categoryName}
                        </span>
                        <h4 className="font-editorial text-base text-elora-charcoal group-hover:text-elora-taupe transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-xs font-medium text-elora-charcoal mt-1">
                          {formatPrice(product.basePrice)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-editorial text-xl text-elora-charcoal">
                  No formulations matched &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-elora-gray mt-2">
                  Try searching for ingredients such as &ldquo;Hyaluronic&rdquo;, &ldquo;Ceramides&rdquo;, or &ldquo;Serum&rdquo;.
                </p>
              </div>
            )}

            {!query && (
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-elora-gray mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-elora-taupe" />
                  <span>Popular Discoveries</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3.5 py-1.5 bg-elora-surface hover:bg-elora-cream border border-elora-border text-xs text-elora-charcoal transition-colors rounded-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-elora-border/60 flex items-center justify-between text-xs text-elora-gray">
                  <span>Looking for tailored guidance?</span>
                  <Link
                    href="/skin-discovery"
                    onClick={onClose}
                    className="text-elora-taupe hover:text-elora-charcoal font-medium flex items-center gap-1 group"
                  >
                    <span>Take our AI Skin Discovery Diagnostic</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

