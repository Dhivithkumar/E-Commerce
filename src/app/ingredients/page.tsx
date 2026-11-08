import React from "react";
import Link from "next/link";
import { Droplets, Shield, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export const metadata = {
  title: "Ingredient Transparency Glossary — Clinical Actives | ÉLORA",
  description:
    "Explore our complete formulation index: Triple Hyaluronic Acid, Biomimetic Ceramides, USP Niacinamide, and Extremolyte Ectoin.",
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
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 space-y-2">
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Biomimetic Transparency
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal">
            The Formulation Glossary
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans">
            Every molecule in the ÉLORA archive is selected for physiological compatibility, purity score, and cellular efficacy. We publish our standards with absolute transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="bg-elora-surface border border-elora-border p-8 rounded-sm shadow-card space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase tracking-ultra text-elora-forest font-semibold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-elora-taupe" />
                    <span>{ing.safetyRating}</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe">
                    <Droplets className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-editorial text-2xl text-elora-charcoal font-medium">
                  {ing.name}
                </h3>
                <p className="text-xs text-elora-taupe font-medium mt-1">{ing.benefit}</p>
                <p className="text-xs text-elora-gray leading-relaxed font-sans mt-3">
                  {ing.description}
                </p>
              </div>

              {/* Products utilizing this active */}
              {ing.productIngredients.length > 0 && (
                <div className="pt-4 border-t border-elora-border/60">
                  <span className="text-[10px] uppercase tracking-ultra text-elora-gray block mb-2 font-medium">
                    Formulations Powered by this Molecule:
                  </span>
                  <div className="space-y-1.5">
                    {ing.productIngredients.map(({ product }) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="text-xs text-elora-charcoal hover:text-elora-taupe flex items-center justify-between group"
                      >
                        <span className="group-hover:underline">{product.name}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-elora-taupe" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

