"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";

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
        setMessage("Welcome to the ÉLORA circle. Complimentary delivery privilege has been dispatched to your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Subscription could not be processed.");
      }
    } catch {
      setStatus("error");
      setMessage("Subscription temporarily unavailable.");
    }
  };

  return (
    <footer className="bg-elora-forest text-elora-ivory pt-16 pb-12 border-t border-elora-sand/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Newsletter Banner */}
        <div className="border-b border-elora-sand/20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
              The ÉLORA Dispatch
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-elora-ivory mt-2">
              A Little More Beauty in Your Inbox.
            </h3>
            <p className="text-xs text-elora-sand/80 mt-2.5 max-w-md leading-relaxed font-sans">
              Receive private salon invitations, breakthrough lipid research, and privileged access to small-batch seasonal harvests.
            </p>
          </div>

          <div>
            {status === "success" ? (
              <div className="p-4 bg-elora-sand/10 border border-elora-sand/30 rounded-sm flex items-center gap-3 text-xs text-elora-sand">
                <Check className="w-5 h-5 text-elora-sand flex-shrink-0" />
                <p>{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-elora-sand/30 px-4 py-3 text-xs text-elora-ivory placeholder:text-elora-sand/50 focus:outline-none focus:border-elora-sand rounded-sm"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-6 py-3 bg-elora-sand text-elora-forest text-xs uppercase tracking-luxury hover:bg-elora-ivory transition-colors duration-300 font-medium flex items-center gap-2 rounded-sm"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-300 text-[11px]">{message}</p>
                )}
                <p className="text-[10px] text-elora-sand/60">
                  By joining, you consent to receive curated dispatches. Unsubscribe unconditionally at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Multi-column Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-14 border-b border-elora-sand/20 text-xs">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <span className="font-editorial text-2xl tracking-[0.2em] font-normal text-elora-ivory uppercase block">
              ÉLORA
            </span>
            <p className="text-xs text-elora-sand/70 max-w-sm leading-relaxed">
              At the intersection of dermal physiology, cold-pressed botanicals, and meditative beauty rituals. Crafted with clinical precision for international complexions.
            </p>
            <div className="pt-2 text-[11px] text-elora-sand/60 space-y-1">
              <p>Ateliers: New York • London • Paris • Dubai</p>
              <p>Inquiries: concierge@elora.luxury</p>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-ultra text-elora-sand font-medium mb-4">
              Formulations
            </h4>
            <ul className="space-y-2.5 text-elora-sand/80">
              <li>
                <Link href="/collections/cleansing" className="hover:text-elora-ivory transition-colors">
                  Cleansing Elixirs
                </Link>
              </li>
              <li>
                <Link href="/collections/serums" className="hover:text-elora-ivory transition-colors">
                  Serums & Peptides
                </Link>
              </li>
              <li>
                <Link href="/collections/hydration" className="hover:text-elora-ivory transition-colors">
                  Barrier Crèmes
                </Link>
              </li>
              <li>
                <Link href="/collections/sun-protection" className="hover:text-elora-ivory transition-colors">
                  Mineral SPF 50+
                </Link>
              </li>
              <li>
                <Link href="/collections/rituals" className="hover:text-elora-ivory transition-colors">
                  Ritual Collections
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-elora-ivory transition-colors font-medium">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Science */}
          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-ultra text-elora-sand font-medium mb-4">
              Science & House
            </h4>
            <ul className="space-y-2.5 text-elora-sand/80">
              <li>
                <Link href="/philosophy" className="hover:text-elora-ivory transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/skin-discovery" className="hover:text-elora-ivory transition-colors text-elora-sand font-medium">
                  AI Skin Discovery
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-elora-ivory transition-colors">
                  The Clinical Journal
                </Link>
              </li>
              <li>
                <Link href="/ingredients" className="hover:text-elora-ivory transition-colors">
                  Ingredient Glossary
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-elora-ivory transition-colors">
                  Atelier Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-ultra text-elora-sand font-medium mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-elora-sand/80">
              <li>
                <Link href="/account" className="hover:text-elora-ivory transition-colors">
                  Your Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-elora-ivory transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-elora-ivory transition-colors">
                  Global Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-elora-ivory transition-colors">
                  30-Day Ritual Guarantee
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-elora-ivory transition-colors">
                  Frequently Answered
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Payment Security */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-elora-sand/60 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-elora-sand/80" />
            <span>256-Bit Encrypted International Commerce • PCI-DSS Level 1 Compliant</span>
          </div>

          <div className="flex flex-wrap gap-4 text-elora-sand/70">
            <span>© {new Date().getFullYear()} ÉLORA Haute Botanique. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-elora-ivory">Privacy</Link>
            <Link href="/terms" className="hover:text-elora-ivory">Terms of Service</Link>
            <Link href="/sustainability" className="hover:text-elora-ivory">Sourcing Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

