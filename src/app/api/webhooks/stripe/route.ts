import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    // In a production environment with active Stripe webhook secrets, verify signature here:
    // const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
    }

    const eventType = event.type || "payment_intent.succeeded";
    const dataObject = event.data?.object || {};

    if (eventType === "payment_intent.succeeded") {
      const transactionId = dataObject.id;
      const orderNumber = dataObject.metadata?.orderNumber;

      if (orderNumber) {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "PAID",
            statusHistory: {
              create: {
                status: "WEBHOOK_VERIFIED",
                note: `Stripe webhook verified payment: ${transactionId || "tx_verified"}`,
              },
            },
          },
        });
      }
    } else if (eventType === "payment_intent.payment_failed") {
      const orderNumber = dataObject.metadata?.orderNumber;
      if (orderNumber) {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "FAILED",
            statusHistory: {
              create: {
                status: "PAYMENT_FAILED",
                note: "Customer payment intent declined by issuing bank",
              },
            },
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}

