import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export const metadata = {
  title: "The Clinical Journal — Skincare Science & Barrier Rituals | ÉLORA",
  description:
    "Investigations, peer-reviewed botanical research, and morning-to-night ceremonial protocols from the ÉLORA Scientific Board.",
};

export default async function JournalIndexPage() {
  const articles = await prisma.journalArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 space-y-2">
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Atelier Dispatches
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal">
            The ÉLORA Clinical Journal
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans">
            In-depth scientific investigations on stratum corneum physiology, lipid synthesis, and the chemistry of timeless botanical actives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/journal/${art.slug}`}
              className="group flex flex-col bg-elora-surface border border-elora-border hover:border-elora-taupe/40 rounded-sm overflow-hidden shadow-card transition-all duration-300"
            >
              <div className="relative aspect-[16/10] bg-elora-cream overflow-hidden">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-elora-gray uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3 text-elora-taupe" />
                    <span>{art.readTime}</span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>

                  <h3 className="font-editorial text-2xl text-elora-charcoal group-hover:text-elora-taupe transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-elora-gray line-clamp-3 mt-2 leading-relaxed font-sans">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-elora-border/60 flex items-center justify-between text-xs font-medium text-elora-charcoal group-hover:text-elora-taupe">
                  <span>Read Full Article</span>
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

