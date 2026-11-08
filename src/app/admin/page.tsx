import React from "react";
import prisma from "@/lib/prisma";
import AdminOverviewClient from "@/components/admin/AdminOverviewClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Aggregate real database stats
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 10,
  });

  const totalOrdersCount = await prisma.order.count();
  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
  });

  const totalRevenueUSD = paidOrders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValueUSD = paidOrders.length > 0 ? totalRevenueUSD / paidOrders.length : 0;

  const totalProductsCount = await prisma.product.count({
    where: { isArchived: false },
  });

  const totalCustomersCount = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });

  // Low stock variants
  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lte: 40 } },
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { stock: "asc" },
  });

  return (
    <AdminOverviewClient
      stats={{
        totalRevenue: totalRevenueUSD,
        totalOrders: totalOrdersCount,
        avgOrderValue: avgOrderValueUSD,
        totalProducts: totalProductsCount,
        totalCustomers: totalCustomersCount,
        lowStockCount: lowStockVariants.length,
      }}
      recentOrders={orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        total: o.total,
        currency: o.currency,
        fulfillmentStatus: o.fulfillmentStatus,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt.toISOString(),
        itemsCount: o.items.length,
      }))}
      lowStockVariants={lowStockVariants.map((v) => ({
        id: v.id,
        title: v.title,
        productName: v.product.name,
        stock: v.stock,
        sku: v.sku,
      }))}
    />
  );
}

