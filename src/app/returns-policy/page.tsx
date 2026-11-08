import React from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck, HeartHandshake } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Client Reassurance
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal mt-1">
            The 30-Day Ritual Guarantee
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray mt-2 leading-relaxed">
            We invite you to experience our formulations with total peace of mind.
          </p>
        </div>

        <div className="bg-elora-surface border border-elora-border p-8 rounded-sm space-y-6 text-xs text-elora-gray leading-relaxed font-sans shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-elora-border/60">
            <ShieldCheck className="w-6 h-6 text-elora-forest" />
            <h3 className="font-editorial text-2xl text-elora-charcoal">
              Zero-Risk Skincare Exploration
            </h3>
          </div>

          <p>
            Skin cell turnover and barrier adaptation require time. We encourage you to incorporate your ÉLORA formulations into your daily ceremony for at least 14 to 21 consecutive days.
          </p>

          <p>
            If a formulation fails to harmonize seamlessly with your unique complexion, or if you experience any sensitivity, you may initiate a return within 30 days of parcel receipt. We will promptly issue a 100% refund to your original payment method.
          </p>

          <div className="p-4 bg-elora-cream/40 border border-elora-taupe/30 rounded-sm">
            <h4 className="font-semibold text-elora-charcoal uppercase tracking-wider mb-1">
              How to Initiate a Concierge Return
            </h4>
            <p>
              Simply email concierge@elora.luxury or consult your customer account portal with your order number. Our atelier will provide a prepaid carbon-neutral return shipping label.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

