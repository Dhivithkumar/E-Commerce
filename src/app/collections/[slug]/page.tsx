import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import ShopCatalogClient from "@/components/shop/ShopCatalogClient";

interface CollectionPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { isArchived: false, categoryId: category.id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { order: "asc" } },
      variants: { where: { isAvailable: true } },
      reviews: { where: { isApproved: true }, select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Header */}
      <div className="relative py-20 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={category.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=85"}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-sand hover:text-elora-ivory transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-ivory font-normal">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/80 max-w-xl font-sans leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <ShopCatalogClient
        products={products}
        categories={categories}
        initialCategorySlug={category.slug}
      />
    </div>
  );
}

