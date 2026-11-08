import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // variantId
) {
  try {
    const { quantity, note = "Manual Atelier Restock" } = await req.json();

    if (!quantity || isNaN(quantity)) {
      return NextResponse.json({ message: "Please supply valid restock quantity." }, { status: 400 });
    }

    const restockQty = parseInt(quantity, 10);

    const variant = await prisma.productVariant.update({
      where: { id: params.id },
      data: {
        stock: { increment: restockQty },
      },
    });

    const inventory = await prisma.inventory.upsert({
      where: { variantId: params.id },
      create: {
        variantId: params.id,
        stockQuantity: variant.stock,
        stockMovements: {
          create: {
            type: "RESTOCK",
            quantity: restockQty,
            note,
          },
        },
      },
      update: {
        stockQuantity: { increment: restockQty },
        lastRestockedAt: new Date(),
        stockMovements: {
          create: {
            type: "RESTOCK",
            quantity: restockQty,
            note,
          },
        },
      },
    });

    return NextResponse.json({ success: true, newStock: variant.stock });
  } catch (error) {
    console.error("Inventory restock error:", error);
    return NextResponse.json({ message: "Failed to update inventory." }, { status: 500 });
  }
}

