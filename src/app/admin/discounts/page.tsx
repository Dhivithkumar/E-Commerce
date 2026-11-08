import React from "react";
import prisma from "@/lib/prisma";
import AdminDiscountsClient from "@/components/admin/AdminDiscountsClient";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminDiscountsClient initialCoupons={coupons} />;
}
