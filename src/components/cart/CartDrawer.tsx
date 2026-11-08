"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    discountAmount,
    finalTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { currency, formatPrice } = useCurrency();
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const currentCurrencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const freeThresholdUSD = currentCurrencyInfo.freeShippingThreshold / currentCurrencyInfo.rate;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThresholdUSD) * 100));
  const remainingForFreeShipping = Math.max(0, freeThresholdUSD - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode);
    setIsApplying(false);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-elora-charcoal/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-elora-ivory shadow-drawer flex flex-col border-l border-elora-border">
          {/* Header */}
          <div className="px-6 py-5 border-b border-elora-border flex items-center justify-between bg-elora-surface/60">
            <div>
              <h2 className="font-editorial text-2xl tracking-wide text-elora-charcoal">
                Shopping Bag
              </h2>
              <p className="text-xs text-elora-gray uppercase tracking-widest mt-0.5">
                {items.length} {items.length === 1 ? "Item" : "Items"} Selected
              </p>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 text-elora-charcoal/70 hover:text-elora-charcoal hover:bg-elora-cream/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="px-6 py-3.5 bg-elora-cream/40 border-b border-elora-border/60">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-elora-charcoal/90 mb-1.5 font-sans">
                Add <span className="font-semibold">{formatPrice(remainingForFreeShipping)}</span> more for{" "}
                <span className="font-medium text-elora-taupe">Complimentary Global Courier Shipping</span>
              </p>
            ) : (
              <p className="text-xs text-elora-forest font-medium mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-elora-forest" />
                You have unlocked Complimentary International Express Shipping!
              </p>
            )}
            <div className="w-full bg-elora-border/80 h-1 rounded-full overflow-hidden">
              <div
                className="bg-elora-taupe h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Body Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-elora-border/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-elora-cream/70 flex items-center justify-center mb-4">
                  <span className="font-editorial text-2xl text-elora-taupe italic">É</span>
                </div>
                <h3 className="font-editorial text-2xl text-elora-charcoal mb-2">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-elora-gray max-w-xs mb-6 leading-relaxed">
                  Explore our certified botanical formulations engineered for barrier resilience and enduring radiance.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors"
                >
                  <Link href="/shop">Discover Collection</Link>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-elora-cream/50 overflow-hidden rounded-sm flex-shrink-0 border border-elora-border/50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-elora-charcoal line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-elora-gray hover:text-red-600 transition-colors ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-elora-gray mt-0.5">{item.variantTitle}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-elora-border rounded-sm bg-elora-surface">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-elora-cream/50 text-elora-charcoal transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-elora-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-elora-cream/50 text-elora-charcoal transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-elora-charcoal">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.compareAtPrice && (
                          <p className="text-[11px] text-elora-gray line-through">
                            {formatPrice(item.compareAtPrice * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="border-t border-elora-border bg-elora-surface/80 px-6 py-5 space-y-4">
              {/* Coupon Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between bg-elora-cream/50 border border-elora-taupe/30 px-3 py-2 rounded-sm text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-elora-taupe" />
                      <span className="font-semibold text-elora-charcoal">{coupon.code}</span>
                      <span className="text-elora-gray">(-{formatPrice(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-elora-gray hover:text-elora-charcoal font-medium text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promotional Privilege Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-elora-ivory border border-elora-border px-3 py-2 text-xs uppercase tracking-wider text-elora-charcoal placeholder:text-elora-gray/70 focus:outline-none focus:border-elora-taupe"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponCode.trim()}
                      className="px-4 py-2 bg-elora-cream border border-elora-border text-elora-charcoal text-xs font-medium uppercase tracking-wider hover:bg-elora-taupe hover:text-white transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMsg.error ? "text-red-700" : "text-emerald-700 font-medium"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-elora-charcoal/80 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-elora-charcoal">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Privilege Savings</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Global Shipping</span>
                  <span className="text-elora-forest font-medium">
                    {remainingForFreeShipping === 0 ? "Complimentary" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-elora-charcoal pt-2 border-t border-elora-border/60">
                  <span>Estimated Total</span>
                  <span className="font-editorial text-lg tracking-wide text-elora-charcoal">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 font-medium group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-elora-gray mt-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-elora-taupe" />
                  <span>30-Day Ritual Guarantee & Encrypted Checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

