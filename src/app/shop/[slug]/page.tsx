import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductDetailClient from "@/components/product/ProductDetailClient";

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, category: true },
  });

  if (!product) {
    return {
      title: "Product Not Found | ÉLORA Skincare",
    };
  }

  const primaryImage = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;

  return {
    title: `${product.name} — ${product.subtitle || "Haute Skincare"} | ÉLORA`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | ÉLORA Haute Skincare`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { order: "asc" } },
      variants: { where: { isAvailable: true } },
      productIngredients: {
        include: { ingredient: true },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || product.isArchived) {
    notFound();
  }

  // Fetch related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isArchived: false,
    },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" } },
      variants: { where: { isAvailable: true } },
      reviews: { where: { isApproved: true }, select: { rating: true } },
    },
    take: 3,
  });

  // Schema.org JSON-LD structured data for rich search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.variants[0]?.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: "ÉLORA",
    },
    offers: {
      "@type": "Offer",
      url: `https://elora.luxury/shop/${product.slug}`,
      priceCurrency: "USD",
      price: product.basePrice,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}

