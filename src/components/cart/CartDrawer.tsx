"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { Button } from "@/components/ui/Button";

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-elora-ivory shadow-drawer flex flex-col border-l border-elora-border"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-elora-border flex items-center justify-between bg-elora-surface/70">
                <div>
                  <h2 className="font-editorial text-2xl tracking-wide text-elora-charcoal">
                    Shopping Bag
                  </h2>
                  <p className="text-[11px] text-elora-gray uppercase tracking-ultra mt-0.5 font-sans">
                    {items.length} {items.length === 1 ? "Ritual Selection" : "Ritual Selections"}
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
              <div className="px-6 py-3.5 bg-elora-cream/40 border-b border-elora-border">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-xs text-elora-charcoal/90 mb-1.5 font-sans">
                    Add <span className="font-semibold text-elora-forest">{formatPrice(remainingForFreeShipping)}</span> more for{" "}
                    <span className="font-medium text-elora-taupe">Complimentary Global Express Courier</span>
                  </p>
                ) : (
                  <p className="text-xs text-elora-forest font-medium mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-elora-forest" />
                    <span>Unlocked: Complimentary Carbon-Neutral Express Shipping</span>
                  </p>
                )}
                <div className="w-full bg-elora-border/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-elora-forest h-full transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Body Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-elora-border">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="w-16 h-16 rounded-full bg-elora-cream flex items-center justify-center mb-4 border border-elora-border">
                      <Sparkles className="w-6 h-6 text-elora-taupe" />
                    </div>
                    <h3 className="font-editorial text-2xl text-elora-charcoal mb-2 font-normal">
                      Your bag is currently empty
                    </h3>
                    <p className="text-xs text-elora-gray max-w-xs mb-6 leading-relaxed font-sans font-light">
                      Explore our certified physiological formulations engineered for barrier resilience and enduring radiance.
                    </p>
                    <Link href="/shop" onClick={closeCart}>
                      <Button variant="forest" size="md">
                        <span>Discover Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 bg-elora-cream overflow-hidden rounded-sm flex-shrink-0 border border-elora-border">
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
                              className="text-elora-gray hover:text-red-600 transition-colors ml-2 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-elora-gray mt-0.5">{item.variantTitle}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-elora-border rounded-sm bg-elora-surface">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-elora-cream text-elora-charcoal transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-medium text-elora-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-elora-cream text-elora-charcoal transition-colors"
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
                <div className="border-t border-elora-border bg-elora-surface px-6 py-5 space-y-4">
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
                          className="flex-1 bg-elora-ivory border border-elora-border px-3 py-2 text-xs uppercase tracking-wider text-elora-charcoal placeholder:text-elora-gray/70 focus:outline-none focus:border-elora-taupe rounded-sm"
                        />
                        <button
                          type="submit"
                          disabled={isApplying || !couponCode.trim()}
                          className="px-4 py-2 bg-elora-cream border border-elora-border text-elora-charcoal text-xs font-medium uppercase tracking-wider hover:bg-elora-taupe hover:text-white transition-colors rounded-sm disabled:opacity-50"
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
                      <span>Global Express Courier</span>
                      <span className="text-elora-forest font-medium">
                        {remainingForFreeShipping === 0 ? "Complimentary" : "Calculated at checkout"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-elora-charcoal pt-2 border-t border-elora-border">
                      <span>Estimated Total</span>
                      <span className="font-editorial text-lg tracking-wide text-elora-charcoal">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <div className="pt-1">
                    <Link href="/checkout" onClick={closeCart} className="block w-full">
                      <Button variant="forest" size="lg" className="w-full shadow-luxury">
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-[10.5px] text-elora-gray mt-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-elora-taupe" />
                      <span>30-Day Ritual Guarantee • Encrypted Checkout</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
