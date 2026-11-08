"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "What distinguishes ÉLORA from conventional luxury cosmetic lines?",
    a: "Conventional cosmetics often rely on high concentrations of synthetic silicones and volatile artificial fragrances that create an instantaneous sensory illusion while gradually weakening the stratum corneum. ÉLORA formulates exclusively around physiological biomimetic lipids—ceramides, cholesterol, and essential fatty acids in our verified 3:1:1 ratio—combined with cold-extracted botanicals and stress-buffering extremolytes.",
  },
  {
    q: "How does the ÉLORA AI Skincare Concierge work?",
    a: "Our AI assistant is grounded strictly in verified dermatological literature, peer-reviewed botanical archives, and our actual atelier formulation database. It operates through retrieval-augmented generation (RAG) to compare active molecules, check product compatibility with your specific concerns, and suggest ritual sequencing without fabricating unsupported clinical claims.",
  },
  {
    q: "Can I use ÉLORA if I have sensitized or reactive skin?",
    a: "Yes. Every ÉLORA creation is formulated without synthetic fragrances, parabens, sulfates, phthalates, or drying alcohols. Our Barrier Restorative Crème was specifically engineered to extinguish redness and restore compromised lipid mantles.",
  },
  {
    q: "What is the recommended ritual sequencing?",
    a: "Our golden rule of physiological layering is: Cleanse &rarr; Treat &rarr; Hydrate &rarr; Protect. Begin with our transforming Cleansing Elixir, apply our Cellular Renewal Concentrate while skin is receptive, seal with our Barrier Restorative Crème, and conclude with our Invisible Silk Mineral Fluid SPF 50+ in the morning.",
  },
  {
    q: "Which international currencies and destinations do you support?",
    a: "ÉLORA natively supports USD ($), GBP (£), EUR (€), CAD (CA$), AUD (AU$), and AED (AED ). You can switch your destination currency seamlessly from the top announcement bar or navbar, and international taxes and customs are estimated transparently at checkout.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            House Knowledge
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal mt-1">
            Frequently Answered Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray mt-2 leading-relaxed">
            Everything you need to know about our scientific formulations, international dispatch, and personalized diagnostic ceremonies.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <h3 className="font-editorial text-xl text-elora-charcoal font-medium">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-elora-taupe transition-transform flex-shrink-0 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-elora-gray leading-relaxed font-sans border-t border-elora-border/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-8 bg-elora-forest text-elora-ivory rounded-sm shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 border border-elora-sand/20">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-editorial text-2xl text-elora-sand">
              Require Tailored Aesthetic Guidance?
            </h4>
            <p className="text-xs text-elora-sand/80 font-sans">
              Engage with our AI Skincare Concierge in the lower corner or consult our diagnostic questionnaire.
            </p>
          </div>
          <Link
            href="/skin-discovery"
            className="px-6 py-3 bg-elora-sand text-elora-forest hover:bg-elora-ivory text-xs uppercase tracking-luxury font-medium rounded-sm whitespace-nowrap"
          >
            Take Skin Discovery Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

