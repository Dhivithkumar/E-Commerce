import React from "react";
import prisma from "@/lib/prisma";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { select: { id: true, title: true, price: true, stock: true } },
      images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <AdminProductsClient
      initialProducts={products}
      categories={categories}
    />
  );
}
