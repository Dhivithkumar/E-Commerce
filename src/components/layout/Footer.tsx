"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Welcome to the ÉLORA circle. Your privileged discovery welcome code has been sent to your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Subscription could not be processed at this moment.");
      }
    } catch {
      setStatus("error");
      setMessage("Subscription service temporarily unavailable.");
    }
  };

  return (
    <footer className="bg-elora-forest text-elora-ivory pt-20 pb-12 border-t border-elora-sand/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION 4.12: NEWSLETTER INVITATION */}
        <div className="border-b border-elora-sand/20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
              Private Circle
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-elora-ivory mt-2">
              An Invitation to Discover More.
            </h3>
            <p className="text-xs sm:text-sm text-elora-sand/80 mt-2.5 max-w-lg leading-relaxed font-sans font-light">
              Receive private salon invitations, breakthrough lipid research, formulation reveals, and complimentary delivery privileges.
            </p>
          </div>

          <div className="lg:col-span-6">
            {status === "success" ? (
              <div className="p-4 bg-elora-sand/10 border border-elora-sand/30 rounded-sm flex items-center gap-3 text-xs text-elora-sand">
                <Check className="w-5 h-5 text-elora-sand flex-shrink-0" />
                <p>{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-elora-sand/30 px-4 py-3.5 text-xs text-elora-ivory placeholder:text-elora-sand/50 focus:outline-none focus:border-elora-sand focus:ring-1 focus:ring-elora-sand/50 rounded-sm transition-all"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-7 py-3.5 bg-elora-sand text-elora-forest text-xs uppercase tracking-luxury hover:bg-elora-ivory transition-colors duration-300 font-medium flex items-center justify-center gap-2 rounded-sm shadow-sm active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{status === "loading" ? "Joining..." : "Subscribe"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-[11px] text-rose-300">{message}</p>
                )}
                <p className="text-[10px] text-elora-sand/60">
                  By subscribing, you agree to receive ÉLORA communications. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* SECTION 4.13: LUXURY MULTI-COLUMN NAVIGATION */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 text-xs">
          {/* Brand Philosophy Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-editorial text-2xl sm:text-3xl tracking-[0.22em] font-normal uppercase text-elora-ivory group-hover:text-elora-sand transition-colors">
                ÉLORA
              </span>
              <span className="block text-[8px] tracking-[0.38em] uppercase text-elora-sand/80 -mt-1 font-sans">
                The Science of Beautiful Skin
              </span>
            </Link>
            <p className="text-elora-sand/80 text-xs leading-relaxed max-w-sm font-sans font-light">
              Haute botanical skincare formulated at the intersection of cellular lipid science, dermatological restraint, and sustainable luxury.
            </p>
            <div className="pt-2 flex items-center gap-3 text-elora-sand/70 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-elora-sand" />
                <span>100% Certified Cruelty-Free</span>
              </span>
              <span>•</span>
              <span>Cold-Pressed Actives</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
              Curated Shop
            </h4>
            <ul className="space-y-2 text-elora-ivory/80">
              <li>
                <Link href="/shop" className="hover:text-elora-sand transition-colors">
                  Complete Catalog
                </Link>
              </li>
              <li>
                <Link href="/collections/cleansing" className="hover:text-elora-sand transition-colors">
                  The Cleansing Ritual
                </Link>
              </li>
              <li>
                <Link href="/collections/serums" className="hover:text-elora-sand transition-colors">
                  The Serum Edit
                </Link>
              </li>
              <li>
                <Link href="/collections/hydration" className="hover:text-elora-sand transition-colors">
                  Deep Hydration
                </Link>
              </li>
              <li>
                <Link href="/collections/sun-protection" className="hover:text-elora-sand transition-colors">
                  Daily Photoprotection
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-elora-sand transition-colors text-elora-sand">
                  All Collections &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison & Knowledge */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
              Maison
            </h4>
            <ul className="space-y-2 text-elora-ivory/80">
              <li>
                <Link href="/philosophy" className="hover:text-elora-sand transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/ingredients" className="hover:text-elora-sand transition-colors">
                  Verified Ingredients
                </Link>
              </li>
              <li>
                <Link href="/skin-discovery" className="hover:text-elora-sand transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-elora-sand" />
                  <span>Skin Discovery</span>
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-elora-sand transition-colors">
                  Skincare Journal
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-elora-sand transition-colors">
                  Sustainability Mandate
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Legal */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
              Client Care
            </h4>
            <ul className="space-y-2 text-elora-ivory/80">
              <li>
                <Link href="/account" className="hover:text-elora-sand transition-colors">
                  Client Account
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-elora-sand transition-colors">
                  International Courier
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-elora-sand transition-colors">
                  30-Day Guarantee & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-elora-sand transition-colors">
                  Consultation & FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-elora-sand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-elora-sand transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Integrity */}
        <div className="border-t border-elora-sand/20 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-elora-sand/70 gap-4">
          <p>© {new Date().getFullYear()} ÉLORA Haute Botanique. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>American Express</span>
            <span>Apple Pay</span>
            <span>Stripe Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
