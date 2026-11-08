import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Droplets, Leaf, Sparkles } from "lucide-react";

export const metadata = {
  title: "Our Philosophy — Haute Formulation & Dermal Science | ÉLORA",
  description:
    "Discover the biological foundations of ÉLORA: Biomimetic lipids, ethical active sourcing, and the art of physiological skin ceremonies.",
};

export default function PhilosophyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=85"
            alt="ÉLORA Skincare Atelier"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            Brand Manifesto
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl text-elora-ivory font-normal leading-tight">
            The Science of Beautiful Skin.
          </h1>
          <p className="text-sm sm:text-base text-elora-sand/90 max-w-2xl mx-auto font-sans leading-relaxed">
            We believe that true dermal radiance is not born from aggressive chemical peeling or superficial masking, but from the deep physiological restoration of your skin&apos;s natural barrier.
          </p>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] bg-elora-cream rounded-sm overflow-hidden shadow-luxury border border-elora-border">
            <Image
              src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=85"
              alt="Golden Active Dew"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Cellular Architecture
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              The Stratum Corneum as a Living Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans">
              The outermost layer of the epidermis is less than the thickness of a single sheet of paper, yet it constitutes your body&apos;s primary immunological and moisture defense against environmental decay.
            </p>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans">
              When cosmetics introduce volatile fragrances, synthetic emulsifiers, or harsh alcohol bases, microscopic fractures propagate across the intercellular matrix. Transepidermal water loss surges, collagen degradative enzymes awaken, and premature cellular aging accelerates.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="pt-12 border-t border-elora-border/60">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Foundational Tenets
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              Our Formulation Charter
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs text-elora-gray">
            <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                Biomimetic Lipid Equilibrium
              </h4>
              <p className="leading-relaxed">
                Formulated exclusively in the physiological 3:1:1 lipid molar ratio of ceramides, cholesterol, and essential fatty acids matching human sebum.
              </p>
            </div>

            <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                Enzymatic Cold-Extraction
              </h4>
              <p className="leading-relaxed">
                Living botanical extracts are cold-harvested without heat denaturation, preserving thermo-sensitive enzymes and polyphenols.
              </p>
            </div>

            <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                Full Formulation Transparency
              </h4>
              <p className="leading-relaxed">
                100% free from synthetic perfumes, parabens, phthalates, silicones, and microplastics. Never tested on animals.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 rounded-sm font-medium"
          >
            <span>Experience The Atelier Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

