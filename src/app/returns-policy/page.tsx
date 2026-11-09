import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCcw, ShieldCheck, HeartHandshake, ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "The 30-Day Ritual Guarantee & Concierge Returns | ÉLORA",
  description:
    "Experience ÉLORA formulations with complete peace of mind. Complimentary 30-day global returns and instant reimbursement if your skin is not delighted.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Hero */}
      <section className="relative py-20 sm:py-28 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=85"
            alt="The ÉLORA Reassurance Experience"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            Client Reassurance
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-elora-ivory font-normal leading-tight">
            The 30-Day Ritual Guarantee
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/90 max-w-xl mx-auto font-sans leading-relaxed font-light">
            We invite you to experience our formulations with total peace of mind. Skincare is deeply physiological, and we want you to feel entirely confident in every step of your journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Reassurance Feature Card */}
        <div className="bg-elora-surface border border-elora-border p-8 sm:p-12 rounded-sm shadow-luxury grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-elora-forest" />
              </div>
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                Zero-Risk Dermal Exploration
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              A Complete Dermal Cycle to Evaluate Compatibility
            </h2>

            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
              Skin cell turnover and cellular lipid adaptation require time. We encourage you to incorporate your ÉLORA formulations into your daily ceremony for at least 14 to 21 consecutive days.
            </p>

            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
              If a formulation fails to harmonize seamlessly with your unique complexion, or if you experience any sensitivity, you may initiate a return within 30 days of parcel receipt. We will promptly issue a 100% refund to your original payment method.
            </p>
          </div>

          <div className="relative aspect-[4/5] bg-elora-cream rounded-sm overflow-hidden border border-elora-border shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85"
              alt="Mindful Skincare Ritual"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 3 Step Concierge Return Process */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Effortless Simplicity
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              How to Initiate a Concierge Return
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3">
              <span className="font-editorial text-3xl text-elora-sand font-normal">01</span>
              <h4 className="font-editorial text-xl text-elora-charcoal">Notify The Concierge</h4>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                Simply sign in to your client account portal or email our concierge desk at <strong className="text-elora-charcoal font-medium">concierge@elora.luxury</strong> with your order reference number.
              </p>
            </div>

            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3">
              <span className="font-editorial text-3xl text-elora-sand font-normal">02</span>
              <h4 className="font-editorial text-xl text-elora-charcoal">Complimentary Courier Pickup</h4>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                We will email you a prepaid, carbon-neutral shipping label. You can either schedule a complimentary courier door pickup or drop the parcel at any local courier station.
              </p>
            </div>

            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3">
              <span className="font-editorial text-3xl text-elora-sand font-normal">03</span>
              <h4 className="font-editorial text-xl text-elora-charcoal">Immediate Reimbursement</h4>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                Once scanned by the courier, our system automatically initiates your 100% refund back to your original payment card within 48 hours. No restocking fees or hidden deductions.
              </p>
            </div>
          </div>
        </div>

        {/* Concierge Contact Banner */}
        <div className="p-8 bg-elora-cream/40 border border-elora-taupe/30 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-editorial text-2xl text-elora-charcoal font-medium">
              Have Questions Regarding Your Order?
            </h4>
            <p className="text-xs text-elora-gray font-sans font-light">
              Our master aesthetic team is on standby to assist with formulation guidance or return arrangements.
            </p>
          </div>
          <Link
            href="/account"
            className="px-6 py-3 bg-elora-forest text-elora-sand hover:bg-elora-forest/90 text-xs uppercase tracking-luxury font-medium rounded-sm transition-colors whitespace-nowrap"
          >
            Access Client Portal
          </Link>
        </div>
      </section>
    </div>
  );
}
