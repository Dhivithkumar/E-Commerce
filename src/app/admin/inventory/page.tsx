import React from "react";
import prisma from "@/lib/prisma";
import AdminInventoryClient from "@/components/admin/AdminInventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: { select: { name: true } },
      inventory: true,
    },
    orderBy: { stock: "asc" },
  });

  const movements = await prisma.stockMovement.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      inventory: {
        include: {
          variant: {
            include: { product: { select: { name: true } } },
          },
        },
      },
    },
  });

  const formattedVariants = variants.map((v) => ({
    id: v.id,
    productName: v.product.name,
    variantTitle: v.title,
    sku: v.sku,
    price: v.price,
    stock: v.stock,
    reorderThreshold: v.inventory?.reorderThreshold || 10,
  }));

  const formattedMovements = movements.map((m) => ({
    id: m.id,
    productName: m.inventory.variant.product.name,
    type: m.type,
    quantity: m.quantity,
    note: m.note,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <AdminInventoryClient
      initialVariants={formattedVariants}
      movements={formattedMovements}
    />
  );
}

