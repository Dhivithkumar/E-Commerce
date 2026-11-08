import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function CollectionsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 space-y-2">
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Archival Catalog
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal">
            The ÉLORA Collections
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans">
            Each collection addresses targeted dermal tiers through biologically compatible actives, ensuring physiological harmony and lasting radiant health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group flex flex-col bg-elora-surface border border-elora-border hover:border-elora-taupe/40 rounded-sm overflow-hidden shadow-card transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-elora-cream overflow-hidden">
                <Image
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85"
                  }
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-elora-forest/80 backdrop-blur-sm text-elora-sand text-[10px] uppercase tracking-wider rounded-sm">
                  {cat._count.products} Formulations
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-2xl text-elora-charcoal group-hover:text-elora-taupe transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-elora-gray mt-2 leading-relaxed font-sans">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-elora-border/60 flex items-center justify-between text-xs font-medium text-elora-charcoal group-hover:text-elora-taupe">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

