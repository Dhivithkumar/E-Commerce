import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service & Atelier Protocols | ÉLORA",
  description: "Official terms and protocols for engaging with the ÉLORA online flagship, AI concierge, and physical formulations.",
};

export default function TermsPage() {
  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Header */}
      <section className="relative py-20 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1800&q=85"
            alt="ÉLORA Legal Charter"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            House Protocols
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-ivory font-normal">
            Terms of Service & Atelier Protocols
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/80 max-w-lg mx-auto font-sans font-light">
            Last Revised: 2026 Protocol • International Commercial Governance
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-xs text-elora-gray leading-relaxed font-sans font-light">
        <div className="p-6 bg-elora-surface border border-elora-border rounded-sm shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-elora-forest font-medium">
            <Scale className="w-4 h-4 text-elora-taupe" />
            <span className="text-xs uppercase tracking-wider">Governing Agreement</span>
          </div>
          <p>
            By browsing, engaging with our AI Skincare Concierge, or acquiring formulations from the ÉLORA flagship, you agree to comply with and be bound by these Terms of Service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-2xl text-elora-charcoal font-normal">
            1. Cosmetic Intended Use & Medical Disclaimer
          </h2>
          <p>
            All ÉLORA products, algorithmic questionnaires, and AI concierge dialogues are intended strictly for topical cosmetic, aesthetic, and skincare ritual purposes. They do not constitute medical advice, clinical diagnosis, or prescriptive cures for pathological skin diseases. Individuals with chronic medical conditions should consult their dermatologist.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-2xl text-elora-charcoal font-normal">
            2. The 30-Day Ritual Guarantee
          </h2>
          <p>
            We provide a 30-day return window from parcel delivery on all standard orders. If any formulation causes irritation or does not meet your personal aesthetic standards, you may contact concierge@elora.luxury for a complimentary prepaid return label and 100% refund.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-2xl text-elora-charcoal font-normal">
            3. International Currency & Customs
          </h2>
          <p>
            Prices may be displayed in USD, GBP, EUR, CAD, AUD, or AED based on your currency selection. International customs duties and sales taxes are calculated transparently prior to order confirmation, ensuring zero surprise courier collection fees.
          </p>
        </div>

        <div className="pt-6 border-t border-elora-border/60">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Flagship</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
