"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Lock,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, coupon, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Customer Contact
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Address
  const [country, setCountry] = useState("US");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState("COMPLIMENTARY_EXPRESS");

  // Payment Details
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  const currentCurrencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const freeThresholdUSD = currentCurrencyInfo.freeShippingThreshold / currentCurrencyInfo.rate;
  const isFreeShipping = subtotal >= freeThresholdUSD || shippingMethod === "COMPLIMENTARY_EXPRESS";
  const shippingFeeUSD = isFreeShipping ? 0 : 15.0;

  // Taxes
  const taxRate = country === "GB" ? 0.2 : country === "AE" ? 0.05 : country === "CA" ? 0.13 : 0.08;
  const taxableAmountUSD = Math.max(0, subtotal - discountAmount);
  const estimatedTaxUSD = taxableAmountUSD * taxRate;
  const estimatedTotalUSD = taxableAmountUSD + shippingFeeUSD + estimatedTaxUSD;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !firstName || !lastName || !street || !city || !postalCode) {
      setErrorMessage("Please complete all required contact and shipping fields.");
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          customerName: `${firstName} ${lastName}`.trim(),
          customerPhone: phone,
          shippingAddress: {
            firstName,
            lastName,
            street,
            apartment,
            city,
            state,
            postalCode,
            country,
          },
          shippingMethod,
          items: items.map((i) => ({ variantId: i.id, quantity: i.quantity })),
          couponCode: coupon?.code,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to finalize order.");
      }

      // Clear cart and redirect to order confirmation
      clearCart();
      router.push(`/checkout/confirmation/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-elora-ivory flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-editorial text-3xl text-elora-charcoal mb-2">Your bag is empty</h2>
        <p className="text-xs text-elora-gray mb-6">Select formulations prior to proceeding to checkout.</p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors"
        >
          Discover Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-elora-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between pb-8 border-b border-elora-border">
          <div>
            <span className="font-editorial text-2xl tracking-[0.2em] uppercase text-elora-charcoal">
              ÉLORA
            </span>
            <span className="text-[10px] tracking-ultra uppercase text-elora-gray ml-3 hidden sm:inline">
              Encrypted Checkout Atelier
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-elora-forest font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encryption</span>
          </div>
        </div>

        {/* Checkout Steps Progress */}
        <div className="flex items-center justify-center gap-3 sm:gap-8 py-6 text-xs uppercase tracking-luxury font-medium border-b border-elora-border/60">
          <span className={step >= 1 ? "text-elora-charcoal font-semibold" : "text-elora-gray"}>
            1. Contact
          </span>
          <ChevronRight className="w-3 h-3 text-elora-border" />
          <span className={step >= 2 ? "text-elora-charcoal font-semibold" : "text-elora-gray"}>
            2. Destination
          </span>
          <ChevronRight className="w-3 h-3 text-elora-border" />
          <span className={step >= 3 ? "text-elora-charcoal font-semibold" : "text-elora-gray"}>
            3. Courier
          </span>
          <ChevronRight className="w-3 h-3 text-elora-border" />
          <span className={step >= 4 ? "text-elora-charcoal font-semibold" : "text-elora-gray"}>
            4. Payment
          </span>
        </div>

        {/* Main Grid: Form Steps + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
          {/* Left: Interactive Multi-Step Form */}
          <div className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Step 1: Customer Identification */}
              <div className="bg-elora-surface border border-elora-border p-6 rounded-sm space-y-4">
                <div className="flex justify-between items-center border-b border-elora-border/60 pb-3">
                  <h3 className="font-editorial text-xl text-elora-charcoal">
                    1. Customer Information
                  </h3>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-elora-taupe underline uppercase tracking-wider"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Email for Order Protocol & Dispatch
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sophia.vane@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sophia"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Vane"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Phone Number (for Courier SMS Delivery Alert)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>
                </div>

                {step === 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (email && firstName && lastName) setStep(2);
                      else setErrorMessage("Please fill your email and name.");
                    }}
                    className="mt-3 px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury rounded-sm hover:bg-elora-taupe transition-colors"
                  >
                    Continue to Shipping Destination
                  </button>
                )}
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="bg-elora-surface border border-elora-border p-6 rounded-sm space-y-4">
                <div className="flex justify-between items-center border-b border-elora-border/60 pb-3">
                  <h3 className="font-editorial text-xl text-elora-charcoal">
                    2. Shipping Address
                  </h3>
                  {step > 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-elora-taupe underline uppercase tracking-wider"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Country / Territory
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    >
                      <option value="US">United States (USD)</option>
                      <option value="GB">United Kingdom (GBP)</option>
                      <option value="CA">Canada (CAD)</option>
                      <option value="AU">Australia (AUD)</option>
                      <option value="AE">United Arab Emirates (AED)</option>
                      <option value="FR">France (EUR)</option>
                      <option value="DE">Germany (EUR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 740 Park Avenue"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Apartment, Suite, or Penthouse (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Penthouse B"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        State / Region
                      </label>
                      <input
                        type="text"
                        placeholder="NY"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="10021"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (street && city && postalCode) setStep(3);
                      else setErrorMessage("Please complete street, city, and postal code.");
                    }}
                    className="mt-3 px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury rounded-sm hover:bg-elora-taupe transition-colors"
                  >
                    Continue to Courier Selection
                  </button>
                )}
              </div>

              {/* Step 3: Courier Selection */}
              <div className="bg-elora-surface border border-elora-border p-6 rounded-sm space-y-4">
                <div className="flex justify-between items-center border-b border-elora-border/60 pb-3">
                  <h3 className="font-editorial text-xl text-elora-charcoal">
                    3. Courier Method
                  </h3>
                  {step > 3 && (
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs text-elora-taupe underline uppercase tracking-wider"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod("COMPLIMENTARY_EXPRESS")}
                    className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === "COMPLIMENTARY_EXPRESS"
                        ? "border-elora-charcoal bg-elora-cream/30"
                        : "border-elora-border/60 bg-elora-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-elora-taupe" />
                      <div>
                        <p className="text-xs font-medium text-elora-charcoal">
                          Complimentary International Courier (2-4 Business Days)
                        </p>
                        <p className="text-[11px] text-elora-gray">
                          Climate-neutral transit in temperature-regulated insulated presentation box
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-elora-forest">Complimentary</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("PREMIUM_WHITE_GLOVE")}
                    className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === "PREMIUM_WHITE_GLOVE"
                        ? "border-elora-charcoal bg-elora-cream/30"
                        : "border-elora-border/60 bg-elora-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-elora-sand" />
                      <div>
                        <p className="text-xs font-medium text-elora-charcoal">
                          Signature Concierge Priority (1-2 Business Days)
                        </p>
                        <p className="text-[11px] text-elora-gray">
                          Priority morning dispatch with personal hand delivery confirmation
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-elora-charcoal">{formatPrice(25)}</span>
                  </label>
                </div>

                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="mt-3 px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury rounded-sm hover:bg-elora-taupe transition-colors"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>

              {/* Step 4: Secure Payment */}
              <div className="bg-elora-surface border border-elora-border p-6 rounded-sm space-y-4">
                <div className="border-b border-elora-border/60 pb-3">
                  <h3 className="font-editorial text-xl text-elora-charcoal">
                    4. Payment Authorization
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-sand/20 text-elora-forest font-semibold rounded-sm">
                      Stripe Test Mode
                    </span>
                    <span className="text-[11px] text-elora-gray">
                      Safe Sandbox: Mock or test cards supported
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal font-mono rounded-sm"
                      />
                      <CreditCard className="w-4 h-4 text-elora-taupe absolute right-3 top-3" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal font-mono rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                        Security CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal font-mono rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Submit Order Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white transition-all duration-300 text-xs uppercase tracking-luxury font-medium rounded-sm flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Authorizing Allocation...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order — {formatPrice(estimatedTotalUSD)}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-elora-gray mt-2.5">
                    By placing your order, you agree to our 30-Day Ritual Guarantee and Terms of Service.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-elora-surface border border-elora-border p-6 rounded-sm shadow-card space-y-4">
              <h3 className="font-editorial text-xl text-elora-charcoal pb-3 border-b border-elora-border/60">
                Order Summary ({items.length})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-elora-border/60 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3">
                    <div className="relative w-14 h-16 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0 border border-elora-border/50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-medium text-elora-charcoal line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-elora-gray">{item.variantTitle}</p>
                      <p className="text-[11px] text-elora-charcoal mt-1">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right text-xs font-semibold text-elora-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Privilege Applied */}
              {coupon && (
                <div className="p-3 bg-elora-cream/40 border border-elora-taupe/30 rounded-sm flex justify-between items-center text-xs text-elora-charcoal">
                  <span>Privilege: {coupon.code}</span>
                  <span className="font-semibold text-emerald-800">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Calculation Rows */}
              <div className="space-y-2 text-xs pt-3 border-t border-elora-border/60 text-elora-gray">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-elora-charcoal font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Privilege Savings</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>International Courier</span>
                  <span className="text-elora-forest font-medium">
                    {shippingFeeUSD === 0 ? "Complimentary" : formatPrice(shippingFeeUSD)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax ({country})</span>
                  <span className="text-elora-charcoal">{formatPrice(estimatedTaxUSD)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-elora-charcoal pt-3 border-t border-elora-border">
                  <span>Final Investment</span>
                  <span className="font-editorial text-2xl text-elora-charcoal">
                    {formatPrice(estimatedTotalUSD)}
                  </span>
                </div>
              </div>

              {/* Reassurance */}
              <div className="pt-2 text-[11px] text-elora-gray/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-elora-taupe" />
                  <span>Complimentary 30-Day Ritual Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-elora-taupe" />
                  <span>Insulated Luxury Presentation Packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

