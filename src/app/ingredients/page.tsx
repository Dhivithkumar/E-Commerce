import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Droplets, Shield, ArrowRight, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export const metadata = {
  title: "Ingredient Transparency Glossary — Clinical Actives | ÉLORA",
  description:
    "Explore our complete formulation index: Triple Hyaluronic Acid, Biomimetic Ceramides, USP Niacinamide, and Extremolyte Ectoin.",
};

const INGREDIENT_IMAGES: Record<string, string> = {
  "triple-hyaluronic-acid": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85",
  "niacinamide-usp": "https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1000&q=85",
  "biomimetic-ceramides": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85",
  "ectoin-pure": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1000&q=85",
  "thd-ascorbate": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=85",
  "bakuchiol-pure": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85",
};

export default async function IngredientsGlossaryPage() {
  const ingredients = await prisma.ingredient.findMany({
    include: {
      productIngredients: {
        include: {
          product: { select: { id: true, name: true, slug: true, basePrice: true } },
        },
      },
    },
  });

  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Hero Header */}
      <section className="relative py-24 sm:py-32 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=2000&q=85"
            alt="ÉLORA Formulation Laboratory"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-elora-sand/15 border border-elora-sand/30 rounded-full text-elora-sand text-xs tracking-ultra uppercase font-sans">
            <Sparkles className="w-3.5 h-3.5 text-elora-sand" />
            <span>100% Formulation Integrity</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl text-elora-ivory font-normal leading-tight">
            The Formulation Glossary
          </h1>

          <p className="text-sm sm:text-base text-elora-sand/90 max-w-2xl mx-auto font-sans leading-relaxed font-light">
            Every molecule in the ÉLORA archive is selected for physiological compatibility, purity score, and cellular efficacy. We publish our standards with absolute transparency.
          </p>
        </div>
      </section>

      {/* Main Ingredient Cards Grid with Real Macro Photography */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ingredients.map((ing) => {
            const ingImage =
              INGREDIENT_IMAGES[ing.slug] ||
              "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85";

            return (
              <div
                key={ing.id}
                className="bg-elora-surface border border-elora-border hover:border-elora-taupe/40 rounded-sm overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Real Macro Active Photography */}
                <div className="relative aspect-[16/10] bg-elora-cream overflow-hidden">
                  <Image
                    src={ingImage}
                    alt={ing.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-elora-surface/90 backdrop-blur-sm text-[10px] uppercase tracking-wider text-elora-forest font-semibold rounded-sm border border-elora-border">
                    {ing.safetyRating}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-editorial text-2xl text-elora-charcoal font-medium">
                      {ing.name}
                    </h3>
                    <p className="text-xs text-elora-taupe font-medium mt-1">{ing.benefit}</p>
                    <p className="text-xs text-elora-gray leading-relaxed font-sans font-light mt-2.5">
                      {ing.description}
                    </p>
                  </div>

                  {/* Products utilizing this active */}
                  {ing.productIngredients.length > 0 && (
                    <div className="pt-4 border-t border-elora-border">
                      <span className="text-[10px] uppercase tracking-ultra text-elora-gray block mb-2 font-medium">
                        Formulations Powered by this Molecule:
                      </span>
                      <div className="space-y-1.5">
                        {ing.productIngredients.map(({ product }) => (
                          <Link
                            key={product.id}
                            href={`/shop/${product.slug}`}
                            className="text-xs text-elora-charcoal hover:text-elora-taupe flex items-center justify-between group/link py-1"
                          >
                            <span className="group-hover/link:underline">{product.name}</span>
                            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform text-elora-taupe" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
