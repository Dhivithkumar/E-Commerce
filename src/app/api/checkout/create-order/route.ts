import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      billingAddress,
      shippingMethod,
      items, // array of { variantId, quantity }
      couponCode,
      currency = "USD",
    } = body;

    if (!customerEmail || !customerName || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { message: "Please supply all required customer and address details." },
        { status: 400 }
      );
    }

    // 1. Server-side product & price verification from database
    let subtotalUSD = 0;
    const verifiedOrderItems: {
      productId: string;
      variantId: string;
      productName: string;
      variantTitle: string;
      unitPrice: number;
      quantity: number;
      total: number;
      imageUrl?: string;
    }[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      });

      if (!variant || !variant.isAvailable) {
        return NextResponse.json(
          { message: `Formulation variant is no longer available in our reserves.` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `Requested quantity for "${variant.product.name}" exceeds available allocation (${variant.stock} remaining).`,
          },
          { status: 400 }
        );
      }

      const itemTotalUSD = variant.price * item.quantity;
      subtotalUSD += itemTotalUSD;

      verifiedOrderItems.push({
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        variantTitle: variant.title,
        unitPrice: variant.price,
        quantity: item.quantity,
        total: itemTotalUSD,
        imageUrl: variant.product.images[0]?.url,
      });
    }

    // 2. Validate Coupon server-side
    let discountUSD = 0;
    let appliedCouponId: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        if (!coupon.minOrderValue || subtotalUSD >= coupon.minOrderValue) {
          if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
            appliedCouponId = coupon.id;
            if (coupon.discountType === "PERCENTAGE") {
              discountUSD = (subtotalUSD * coupon.discountValue) / 100;
            } else {
              discountUSD = Math.min(coupon.discountValue, subtotalUSD);
            }
          }
        }
      }
    }

    // 3. Currency and Shipping Calculations
    const currCode = (currency as CurrencyCode) in SUPPORTED_CURRENCIES ? (currency as CurrencyCode) : "USD";
    const currConfig = SUPPORTED_CURRENCIES[currCode];

    const freeThresholdUSD = currConfig.freeShippingThreshold / currConfig.rate;
    const isFreeShipping = subtotalUSD >= freeThresholdUSD || shippingMethod === "COMPLIMENTARY_EXPRESS";
    const shippingFeeUSD = isFreeShipping ? 0 : 15.0;

    // 4. International Tax Calculation
    const destCountry = shippingAddress.country?.toUpperCase() || "US";
    let taxRate = 0.08; // US default avg
    if (destCountry === "GB") taxRate = 0.20; // UK VAT
    if (destCountry === "AE") taxRate = 0.05; // UAE VAT
    if (destCountry === "CA") taxRate = 0.13; // Canada HST
    if (destCountry === "AU") taxRate = 0.10; // Australia GST

    const taxableAmountUSD = Math.max(0, subtotalUSD - discountUSD);
    const taxTotalUSD = Math.round(taxableAmountUSD * taxRate * 100) / 100;
    const totalUSD = Math.round((taxableAmountUSD + shippingFeeUSD + taxTotalUSD) * 100) / 100;

    // Generate unique luxury order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ELO-${new Date().getFullYear()}-${randomSuffix}-${destCountry}`;

    // 5. Execute Prisma Transaction (Create Order, update inventory, record movement)
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerEmail,
          customerName,
          customerPhone,
          shippingAddressJson: JSON.stringify(shippingAddress),
          billingAddressJson: JSON.stringify(billingAddress || shippingAddress),
          shippingMethod: isFreeShipping ? "COMPLIMENTARY_EXPRESS" : "PREMIUM_COURIER",
          subtotal: subtotalUSD,
          discountTotal: discountUSD,
          shippingTotal: shippingFeeUSD,
          taxTotal: taxTotalUSD,
          total: totalUSD,
          currency: currCode,
          paymentStatus: "PAID", // Test mode immediate payment approval
          fulfillmentStatus: "PROCESSING",
          trackingNumber: `ELR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          trackingCarrier: destCountry === "GB" ? "DHL Express UK" : destCountry === "AE" ? "Emirates Post Courier" : "FedEx International Priority",
          items: {
            create: verifiedOrderItems,
          },
          statusHistory: {
            create: [
              { status: "ORDER_PLACED", note: "Customer submitted checkout via ÉLORA Atelier" },
              { status: "PAYMENT_CONFIRMED", note: "Stripe test mode payment confirmed successfully" },
              { status: "PROCESSING", note: "Atelier packaging and compounding initiated" },
            ],
          },
          payments: {
            create: {
              provider: "STRIPE",
              transactionId: `pi_test_${Date.now()}_${randomSuffix}`,
              amount: totalUSD,
              currency: currCode,
              status: "SUCCEEDED",
            },
          },
        },
      });

      // Update Variant Stocks & Inventory Movements
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        const inv = await tx.inventory.findUnique({
          where: { variantId: item.variantId },
        });

        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          await tx.stockMovement.create({
            data: {
              inventoryId: inv.id,
              type: "ORDER_FULFILLED",
              quantity: -item.quantity,
              note: `Order ${orderNumber} allocation`,
            },
          });
        }
      }

      // Record coupon usage if applied
      if (appliedCouponId) {
        await tx.coupon.update({
          where: { id: appliedCouponId },
          data: { usageCount: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId: appliedCouponId,
            orderId: newOrder.id,
            discountApplied: discountUSD,
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while placing your order." },
      { status: 500 }
    );
  }
}

