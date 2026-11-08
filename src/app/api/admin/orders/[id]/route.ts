import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { fulfillmentStatus, trackingNumber, trackingCarrier, note } = await req.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(fulfillmentStatus && { fulfillmentStatus }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(trackingCarrier !== undefined && { trackingCarrier }),
        statusHistory: {
          create: {
            status: fulfillmentStatus || "STATUS_UPDATE",
            note: note || `Updated to ${fulfillmentStatus} by Atelier Staff`,
          },
        },
      },
      include: { statusHistory: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ message: "Failed to update order status." }, { status: 500 });
  }
}

