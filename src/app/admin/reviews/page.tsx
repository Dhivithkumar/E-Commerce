import React from "react";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Star, ShieldCheck, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: {
        select: {
          name: true,
          slug: true,
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-elora-border">
        <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
          Reputation & Social Proof
        </span>
        <h1 className="font-editorial text-3xl text-elora-charcoal mt-0.5">
          Client Review Moderation
        </h1>
        <p className="text-xs text-elora-gray">Verified buyer testimonials and formulation feedback</p>
      </div>

      <div className="bg-elora-surface border border-elora-border rounded-sm shadow-sm overflow-hidden divide-y divide-elora-border/60">
        {reviews.map((r) => {
          const productImg =
            r.product.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80";

          return (
            <div key={r.id} className="p-6 space-y-3 hover:bg-elora-cream/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex text-elora-sand">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-editorial text-lg text-elora-charcoal font-medium">
                    {r.title}
                  </h4>
                </div>
                <span className="text-[11px] text-elora-gray">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-elora-gray leading-relaxed font-sans">{r.comment}</p>

              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-10 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0 border border-elora-border/50">
                    <Image
                      src={productImg}
                      alt={r.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-elora-charcoal">{r.authorName}</span>
                    <span className="text-elora-gray mx-1.5">•</span>
                    <Link
                      href={`/shop/${r.product.slug}`}
                      className="text-elora-taupe hover:underline font-medium"
                    >
                      {r.product.name}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified & Approved</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
