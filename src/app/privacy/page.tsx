import React from "react";

export default function PrivacyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-elora-gray leading-relaxed font-sans">
        <h1 className="font-editorial text-4xl text-elora-charcoal">Privacy & Diagnostic Data Charter</h1>
        <p className="text-[11px] uppercase tracking-wider text-elora-taupe">Effective: 2026 Protocol</p>
        <p>
          At ÉLORA (&ldquo;the Atelier&rdquo;), we treat your personal information with the same rigorous care we dedicate to our cold-pressed formulations.
        </p>
        <h2 className="font-editorial text-2xl text-elora-charcoal pt-4">1. Skin Diagnostic Data Protection</h2>
        <p>
          Answers provided during your AI Skin Discovery questionnaire are utilized solely to calculate formulation compatibility scores and synthesize personalized morning and evening rituals. We never monetize, sell, or disclose your skin diagnostic responses to third-party advertising networks.
        </p>
        <h2 className="font-editorial text-2xl text-elora-charcoal pt-4">2. International Payment Security</h2>
        <p>
          All monetary transactions are processed through tokenized 256-bit SSL encrypted sessions via Stripe. ÉLORA servers never store raw credit card numbers, CVV codes, or bank details.
        </p>
      </div>
    </div>
  );
}

