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

        {/* Narrative Section 2 - The Daily Ceremony */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-8 border-t border-elora-border/60">
          <div className="space-y-6 order-2 md:order-1">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Sensory Mindfulness
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              The Daily Ceremony as a Sacred Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
              We reject the hurried, mechanized approach of mass-market cosmetic routines. To apply an ÉLORA formulation is to engage in a deliberate sensory pauses—inhaling cold-pressed camellia essences, warming active lipids between your fingertips, and gently pressing them into the dermis.
            </p>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
              Clinical measurements demonstrate that gentle micro-effleurage paired with biomimetic lipid structures accelerates epidermal absorption by up to 34% while modulating systemic cortisol levels that degrade dermal collagen.
            </p>
          </div>

          <div className="relative aspect-[4/5] bg-elora-cream rounded-sm overflow-hidden shadow-luxury border border-elora-border order-1 md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85"
              alt="The ÉLORA Skincare Ceremony"
              fill
              className="object-cover"
            />
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
            <p className="text-xs text-elora-gray font-light">
              Three uncompromising tenets guiding every laboratory formulation, small-batch synthesis, and cold extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs text-elora-gray">
            <div className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden shadow-card group hover:shadow-luxury transition-all duration-300">
              <div className="relative aspect-[16/10] bg-elora-cream overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85"
                  alt="Biomimetic Lipid Equilibrium"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                  Biomimetic Lipid Equilibrium
                </h4>
                <p className="leading-relaxed font-light">
                  Formulated exclusively in the physiological 3:1:1 lipid molar ratio of ceramides, cholesterol, and essential fatty acids matching human sebum.
                </p>
              </div>
            </div>

            <div className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden shadow-card group hover:shadow-luxury transition-all duration-300">
              <div className="relative aspect-[16/10] bg-elora-cream overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=85"
                  alt="Enzymatic Cold-Extraction"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                  Enzymatic Cold-Extraction
                </h4>
                <p className="leading-relaxed font-light">
                  Living botanical extracts are cold-harvested without heat denaturation, preserving thermo-sensitive enzymes and polyphenols.
                </p>
              </div>
            </div>

            <div className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden shadow-card group hover:shadow-luxury transition-all duration-300">
              <div className="relative aspect-[16/10] bg-elora-cream overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=800&q=85"
                  alt="Full Formulation Transparency"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                  Full Formulation Transparency
                </h4>
                <p className="leading-relaxed font-light">
                  100% free from synthetic perfumes, parabens, phthalates, silicones, and microplastics. Never tested on animals.
                </p>
              </div>
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

