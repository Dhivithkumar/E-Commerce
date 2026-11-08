import React from "react";
import prisma from "@/lib/prisma";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const formatted = orders.map((o) => {
    let country = "US";
    try {
      const addr = JSON.parse(o.shippingAddressJson);
      country = addr.country || "US";
    } catch {
      // ignore
    }

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      subtotal: o.subtotal,
      total: o.total,
      currency: o.currency,
      paymentStatus: o.paymentStatus,
      fulfillmentStatus: o.fulfillmentStatus,
      trackingNumber: o.trackingNumber,
      trackingCarrier: o.trackingCarrier,
      createdAt: o.createdAt.toISOString(),
      itemsCount: o.items.length,
      shippingCountry: country,
    };
  });

  return <AdminOrdersClient initialOrders={formatted} />;
}

