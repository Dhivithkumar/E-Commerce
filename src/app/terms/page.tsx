import React from "react";

export default function TermsPage() {
  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-elora-gray leading-relaxed font-sans">
        <h1 className="font-editorial text-4xl text-elora-charcoal">Terms of Service & Atelier Protocols</h1>
        <p className="text-[11px] uppercase tracking-wider text-elora-taupe">Last Revised: 2026</p>
        <p>
          By browsing, engaging with our AI Skincare Concierge, or acquiring formulations from the ÉLORA atelier, you agree to these Terms of Service.
        </p>
        <h2 className="font-editorial text-2xl text-elora-charcoal pt-4">1. Cosmetic Intended Use</h2>
        <p>
          All ÉLORA products, diagnostic questionnaires, and AI concierge dialogues are intended strictly for topical cosmetic, aesthetic, and skincare ritual purposes. They do not constitute medical advice, diagnosis, or clinical cures for dermatological diseases.
        </p>
        <h2 className="font-editorial text-2xl text-elora-charcoal pt-4">2. The 30-Day Ritual Guarantee</h2>
        <p>
          We provide a 30-day return window from parcel delivery on all standard orders. If any formulation causes irritation or does not meet your aesthetic standards, contact concierge@elora.luxury for a full refund.
        </p>
      </div>
    </div>
  );
}

