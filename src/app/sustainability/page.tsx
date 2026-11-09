import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, ShieldCheck, Globe, Recycle, ArrowRight, Droplets } from "lucide-react";

export const metadata = {
  title: "Sourcing Charter & Sustainability — Ecological Stewardship | ÉLORA",
  description:
    "Explore ÉLORA's commitment to circular amber glass packaging, regenerative botanical wildcrafting, and carbon-neutral global delivery.",
};

export default function SustainabilityPage() {
  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Hero */}
      <section className="relative py-24 sm:py-32 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=85"
            alt="Pristine Botanical Ecosystem"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            Ecological Stewardship
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-elora-ivory font-normal leading-tight">
            Preserving Nature as We Preserve Your Skin.
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/90 max-w-2xl mx-auto font-sans leading-relaxed font-light">
            At ÉLORA, environmental preservation is inseparable from physiological skin health. We formulate with absolute respect for biodiversity, botanical renewal cycles, and circular material cycles.
          </p>
        </div>
      </section>

      {/* Main Narrative & Visual Cards */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Core Pillars Grid with Editorial Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Amber Glass */}
          <div className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden shadow-card group hover:shadow-luxury transition-all duration-300 flex flex-col">
            <div className="relative aspect-[4/3] bg-elora-cream overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85"
                alt="Amber Glass Packaging"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-elora-forest/85 backdrop-blur-sm text-elora-sand text-[10px] uppercase tracking-wider rounded-sm font-sans">
                Infinite Circularity
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                  <Recycle className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  High-Density Amber Glass
                </h3>
                <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                  All active serums and crèmes are housed in 100% infinitely recyclable apothecary amber glass. Amber glass naturally filters 99% of blue light and UV radiation, preserving thermo-labile botanical enzymes without endocrine-disrupting plasticizers or chemical leaching.
                </p>
              </div>
              <div className="pt-3 border-t border-elora-border/60 text-[11px] text-elora-taupe font-medium uppercase tracking-wider">
                0% Single-Use Plastics
              </div>
            </div>
          </div>

          {/* Card 2: Wildcrafted Actives */}
          <div className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden shadow-card group hover:shadow-luxury transition-all duration-300 flex flex-col">
            <div className="relative aspect-[4/3] bg-elora-cream overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1000&q=85"
                alt="Regenerative Botanical Wildcrafting"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-elora-forest/85 backdrop-blur-sm text-elora-sand text-[10px] uppercase tracking-wider rounded-sm font-sans">
                Bio-Regenerative
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Regenerative Wildcrafting
                </h3>
                <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                  Our cold-pressed botanicals—such as organic camellia seed, sea buckthorn, and squalane—are ethically harvested in partnership with small regional agricultural cooperatives. We adhere strictly to natural biological seasonal renewal cycles, guaranteeing zero ecosystem depletion.
                </p>
              </div>
              <div className="pt-3 border-t border-elora-border/60 text-[11px] text-elora-taupe font-medium uppercase tracking-wider">
                100% Ethical Co-Op Sourcing
              </div>
            </div>
          </div>

          {/* Card 3: Carbon-Neutral Courier */}
          <div className="bg-elora-surface border border-elora-border rounded-sm overflow-hidden shadow-card group hover:shadow-luxury transition-all duration-300 flex flex-col">
            <div className="relative aspect-[4/3] bg-elora-cream overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=85"
                alt="Carbon-Neutral Global Transit"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-elora-forest/85 backdrop-blur-sm text-elora-sand text-[10px] uppercase tracking-wider rounded-sm font-sans">
                Net-Zero Certified
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-elora-cream text-elora-taupe flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Carbon-Neutral Global Transit
                </h3>
                <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                  Every parcel dispatched to our clients across the United States, United Kingdom, Canada, Australia, and the UAE has its freight carbon footprint rigorously calculated and neutralized via audited agroforestry and peatland restoration initiatives.
                </p>
              </div>
              <div className="pt-3 border-t border-elora-border/60 text-[11px] text-elora-taupe font-medium uppercase tracking-wider">
                100% Carbon-Neutral Dispatch
              </div>
            </div>
          </div>
        </div>

        {/* The Clean Formulation Manifesto */}
        <div className="bg-elora-surface border border-elora-border p-8 sm:p-12 rounded-sm shadow-luxury grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              The ÉLORA Purity Guarantee
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              What We Exclude is as Vital as What We Include
            </h2>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
              We never utilize synthetic fragrances, endocrine-disrupting phthalates, parabens, sodium lauryl sulfates, silicones, microplastic binders, or animal by-products. Our formulations are 100% Leaping Bunny certified cruelty-free.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              {[
                "No Artificial Fragrances",
                "No Silicones",
                "No Microplastics",
                "No Parabens",
                "Cruelty-Free Certified",
                "Vegan Biomimetics",
              ].map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-elora-cream border border-elora-border text-elora-charcoal rounded-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-elora-cream rounded-sm overflow-hidden border border-elora-border">
            <Image
              src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1000&q=85"
              alt="Clean Laboratory Compounding"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 rounded-sm font-medium"
          >
            <span>Explore Sustainable Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
