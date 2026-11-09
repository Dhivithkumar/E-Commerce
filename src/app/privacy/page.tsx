import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy & Diagnostic Data Charter | ÉLORA",
  description: "Learn how ÉLORA protects client skin diagnostic data, payment tokens, and international order confidentiality.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Header */}
      <section className="relative py-20 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=85"
            alt="ÉLORA Data Protection Charter"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            Confidentiality Standards
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-ivory font-normal">
            Privacy & Diagnostic Data Charter
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/80 max-w-lg mx-auto font-sans font-light">
            Effective: 2026 Protocol • Verified 256-Bit SSL Transport Security
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-xs text-elora-gray leading-relaxed font-sans font-light">
        <div className="p-6 bg-elora-surface border border-elora-border rounded-sm shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-elora-forest font-medium">
            <ShieldCheck className="w-4 h-4 text-elora-taupe" />
            <span className="text-xs uppercase tracking-wider">Client Commitment</span>
          </div>
          <p>
            At ÉLORA (&ldquo;the Atelier&rdquo;), we treat your personal information with the same rigorous care we dedicate to our cold-pressed formulations. Your skin health metrics, diagnostic results, and correspondence are held in strict privacy.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-2xl text-elora-charcoal font-normal">
            1. Skin Diagnostic Data Protection
          </h2>
          <p>
            Answers provided during your AI Skin Discovery questionnaire are utilized solely to calculate formulation compatibility scores and synthesize personalized morning and evening rituals. We never monetize, sell, or disclose your skin diagnostic responses to third-party advertising networks or commercial data aggregators.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-2xl text-elora-charcoal font-normal">
            2. International Payment Security
          </h2>
          <p>
            All monetary transactions are processed through tokenized 256-bit SSL encrypted sessions via Stripe. ÉLORA servers never store raw credit card numbers, CVV codes, or bank details. All transaction records comply with strict PCI-DSS Level 1 international security requirements.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-2xl text-elora-charcoal font-normal">
            3. Client Rights & Account Portability
          </h2>
          <p>
            Under GDPR, CCPA, and international data protection laws, you retain the absolute right to view, export, or permanently erase your client account profile and diagnostic archives at any time by contacting our concierge desk at <strong className="text-elora-charcoal font-medium">concierge@elora.luxury</strong>.
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
