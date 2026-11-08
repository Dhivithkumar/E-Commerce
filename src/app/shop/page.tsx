import React from "react";
import prisma from "@/lib/prisma";
import ShopCatalogClient from "@/components/shop/ShopCatalogClient";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
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
      <ShopCatalogClient products={products} categories={categories} />
    </div>
  );
}

