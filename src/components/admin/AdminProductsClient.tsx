"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Tag, Star, Eye, X, Check, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  basePrice: number;
  volume?: string;
  category: { name: string };
  images: { url: string }[];
  variants: { id: string; title: string; price: number; stock: number }[];
  reviews: { rating: number }[];
}

export default function AdminProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: ProductItem[];
  categories: Category[];
}) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [basePrice, setBasePrice] = useState("120.00");
  const [volume, setVolume] = useState("50 ml / 1.7 fl. oz.");
  const [routineStep, setRoutineStep] = useState("TREAT");
  const [skinTypes, setSkinTypes] = useState("all,dry,combination,sensitive");
  const [primaryConcerns, setPrimaryConcerns] = useState("barrier,hydration");
  const [badge, setBadge] = useState("New Release");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85");
  const [stock, setStock] = useState("50");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          subtitle,
          categoryId,
          basePrice,
          volume,
          routineStep,
          skinTypes,
          primaryConcerns,
          badge,
          description,
          imageUrl,
          stock,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create formulation.");

      setProducts([data.product, ...products]);
      setSuccess(`Formulation "${data.product.name}" created and allocated.`);
      setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-elora-border gap-4">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Formulation Atelier
          </span>
          <h1 className="font-editorial text-3xl text-elora-charcoal mt-0.5">
            Products & Active Formulations
          </h1>
          <p className="text-xs text-elora-gray">
            Manage catalog, pricing, volume allocations, and warehouse tiers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search formulations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-elora-surface border border-elora-border px-3 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm w-52"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white text-xs uppercase tracking-luxury font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Formulation</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-elora-surface border border-elora-border rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-elora-charcoal">
            <thead className="bg-elora-cream/40 uppercase text-[10px] tracking-wider text-elora-gray border-b border-elora-border/60">
              <tr>
                <th className="py-3 px-4">Formulation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Variants & Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-elora-border/50">
              {filtered.map((p) => {
                const totalStock = p.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                const avgRating = p.reviews?.length
                  ? (p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1)
                  : "5.0";

                return (
                  <tr key={p.id} className="hover:bg-elora-cream/20">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0 border border-elora-border/50">
                        <Image
                          src={
                            p.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=85"
                          }
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-editorial text-base text-elora-charcoal font-medium line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-elora-gray">{p.volume}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-cream text-elora-charcoal rounded-sm font-medium">
                        {p.category.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{formatPrice(p.basePrice)}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium">{p.variants?.length || 1} Variant(s)</p>
                      <p className="text-[11px] text-elora-gray">{totalStock} Units in Reserve</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-elora-sand text-elora-sand" />
                        <span className="font-medium">{avgRating}</span>
                        <span className="text-elora-gray text-[10px]">({p.reviews?.length || 0})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/shop/${p.slug}`}
                        className="text-xs text-elora-taupe hover:underline uppercase tracking-wider"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-elora-ivory border border-elora-border shadow-luxury rounded-sm max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-elora-border">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium">
                  Atelier Formulation Studio
                </span>
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Compound New Formulation
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-elora-charcoal hover:text-elora-taupe"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Formulation Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cellular Eye Rejuvenating Elixir"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Category Tier
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Subtitle / Actives Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Multi-Peptide & Ectoin Infusion"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Base Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Initial Stock Allocation
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                  Product Image URL (High Resolution)
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                  Formulation Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the cellular mechanism and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                />
              </div>

              <div className="pt-4 border-t border-elora-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-elora-border text-elora-charcoal uppercase tracking-wider text-xs rounded-sm hover:bg-elora-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white uppercase tracking-luxury text-xs font-medium rounded-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? "Compounding..." : "Publish Formulation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

