"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    a: "Our golden rule of physiological layering is: Cleanse → Treat → Hydrate → Protect. Begin with our transforming Cleansing Elixir, apply our Cellular Renewal Concentrate while skin is receptive, seal with our Barrier Restorative Crème, and conclude with our Invisible Silk Mineral Fluid SPF 50+ in the morning.",
  },
  {
    q: "Which international currencies and destinations do you support?",
    a: "ÉLORA natively supports USD ($), GBP (£), EUR (€), CAD (CA$), AUD (AU$), and AED (AED ). You can switch your destination currency seamlessly from the top announcement bar or navbar, and international taxes and customs are estimated transparently at checkout.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Hero */}
      <section className="relative py-20 sm:py-28 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1800&q=85"
            alt="ÉLORA Formulation Science & House Knowledge"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            House Knowledge Archive
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-elora-ivory font-normal leading-tight">
            Frequently Answered Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/90 max-w-xl mx-auto font-sans leading-relaxed font-light">
            Everything you need to know about our physiological lipid formulations, international dispatch, and personalized diagnostic ceremonies.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-elora-cream/20"
                aria-expanded={openIndex === idx}
              >
                <h3 className="font-editorial text-xl text-elora-charcoal font-medium">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-elora-taupe transition-transform duration-300 flex-shrink-0 ${
                    openIndex === idx ? "rotate-180 text-elora-forest" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light border-t border-elora-border/60 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-8 bg-elora-forest text-elora-ivory rounded-sm shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 border border-elora-sand/20">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-editorial text-2xl text-elora-sand font-normal">
              Require Tailored Aesthetic Guidance?
            </h4>
            <p className="text-xs text-elora-sand/80 font-sans font-light">
              Engage with our AI Skincare Concierge in the lower corner or consult our diagnostic questionnaire.
            </p>
          </div>
          <Link href="/skin-discovery">
            <Button variant="primary" size="md" className="whitespace-nowrap">
              <span>Take Skin Discovery Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
