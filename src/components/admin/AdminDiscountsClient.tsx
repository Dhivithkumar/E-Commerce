"use client";

import React, { useState } from "react";
import { Tag, Plus, Check, X } from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderValue?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
}

export default function AdminDiscountsClient({
  initialCoupons,
}: {
  initialCoupons: CouponItem[];
}) {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("15");
  const [minOrderValue, setMinOrderValue] = useState("100");
  const [usageLimit, setUsageLimit] = useState("200");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue,
          minOrderValue,
          usageLimit,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create coupon.");

      setCoupons([data.coupon, ...coupons]);
      setSuccess(`Privilege code "${data.coupon.code}" activated.`);
      setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
        setCode("");
        setDescription("");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-elora-border gap-4">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Privilege Incentives
          </span>
          <h1 className="font-editorial text-3xl text-elora-charcoal mt-0.5">
            Promotional Privilege Coupons
          </h1>
          <p className="text-xs text-elora-gray">Active promotional codes and customer usage allocations</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white text-xs uppercase tracking-luxury font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-sm h-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Privilege Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="p-6 bg-elora-surface border border-elora-border rounded-sm shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-elora-taupe" />
                <span className="font-mono text-sm font-semibold text-elora-charcoal">{c.code}</span>
              </div>
              <span className="text-[10px] uppercase px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full font-semibold">
                {c.isActive ? "Active" : "Archived"}
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-xl text-elora-charcoal font-medium">
                {c.discountType === "PERCENTAGE"
                  ? `${c.discountValue}% Off Entire Order`
                  : `$${c.discountValue} Off Subtotal`}
              </h3>
              <p className="text-xs text-elora-gray mt-1">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-elora-border/60 text-xs text-elora-gray space-y-1">
              <div className="flex justify-between">
                <span>Total Redemptions</span>
                <span className="font-medium text-elora-charcoal">
                  {c.usageCount} / {c.usageLimit || "Unlimited"}
                </span>
              </div>
              {c.minOrderValue && (
                <div className="flex justify-between">
                  <span>Minimum Threshold</span>
                  <span>${c.minOrderValue.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-elora-ivory border border-elora-border shadow-luxury rounded-sm p-6 sm:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-elora-border">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium">
                  Atelier Commercial Privileges
                </span>
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Create Promotional Code
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-elora-charcoal hover:text-elora-taupe">
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
                    Privilege Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RADIANCE20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs font-mono uppercase rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Value {discountType === "PERCENTAGE" ? "(%)" : "($)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                  Description / Customer Privilege Note
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% off for verified salon members"
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
                  {loading ? "Activating..." : "Activate Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

