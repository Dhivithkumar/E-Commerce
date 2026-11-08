import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Truck, Package, ShieldCheck, ArrowRight, Printer } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrencyAmount, CurrencyCode } from "@/lib/currency";

interface ConfirmationPageProps {
  params: { orderNumber: string };
}

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddr = JSON.parse(order.shippingAddressJson || "{}");
  const currencyCode = (order.currency as CurrencyCode) || "USD";

  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-elora-surface border border-elora-border p-8 sm:p-12 rounded-sm shadow-luxury text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-elora-forest/10 border border-elora-forest/20 text-elora-forest flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium block">
            Protocol Authorized & Confirmed
          </span>

          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal font-normal">
            Thank You, {order.customerName}.
          </h1>

          <p className="text-xs sm:text-sm text-elora-gray max-w-md mx-auto leading-relaxed font-sans">
            Your ÉLORA ritual order <strong className="text-elora-charcoal font-semibold">{order.orderNumber}</strong> has been received by our compounding atelier. A formal delivery dispatch confirmation has been sent to <span className="text-elora-charcoal font-medium">{order.customerEmail}</span>.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 px-3.5 py-1.5 bg-elora-cream/50 border border-elora-border rounded-full text-xs text-elora-charcoal">
            <Package className="w-4 h-4 text-elora-taupe" />
            <span>Tracking Reference: {order.trackingNumber || "Pending Courier Scan"}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Dispatch & Delivery Destination */}
          <div className="bg-elora-surface border border-elora-border p-6 rounded-sm space-y-3 text-xs">
            <h3 className="font-editorial text-lg text-elora-charcoal pb-2 border-b border-elora-border/60">
              Courier Delivery Protocol
            </h3>
            <div className="space-y-1 text-elora-gray">
              <p className="font-medium text-elora-charcoal">{order.customerName}</p>
              <p>{shippingAddr.street}</p>
              {shippingAddr.apartment && <p>{shippingAddr.apartment}</p>}
              <p>
                {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}
              </p>
              <p className="uppercase font-semibold text-elora-taupe pt-1">{shippingAddr.country}</p>
            </div>
            <div className="pt-3 border-t border-elora-border/60 flex items-center gap-2 text-elora-forest font-medium">
              <Truck className="w-4 h-4" />
              <span>Carrier: {order.trackingCarrier}</span>
            </div>
          </div>

          {/* Payment & Guarantees */}
          <div className="bg-elora-surface border border-elora-border p-6 rounded-sm space-y-3 text-xs">
            <h3 className="font-editorial text-lg text-elora-charcoal pb-2 border-b border-elora-border/60">
              Payment & Guarantee Status
            </h3>
            <div className="space-y-2 text-elora-gray">
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="font-semibold text-emerald-800">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span>Stripe Encrypted Token</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment Status</span>
                <span className="font-medium text-elora-charcoal">{order.fulfillmentStatus}</span>
              </div>
              <div className="pt-2 border-t border-elora-border/60 flex items-center gap-1.5 text-[11px] text-elora-forest">
                <ShieldCheck className="w-4 h-4 text-elora-taupe" />
                <span>Protected by the 30-Day Ritual Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Order Receipt */}
        <div className="bg-elora-surface border border-elora-border p-6 sm:p-8 rounded-sm mt-8 space-y-4">
          <h3 className="font-editorial text-xl text-elora-charcoal pb-3 border-b border-elora-border/60">
            Formulations Included
          </h3>

          <div className="divide-y divide-elora-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <div className="relative w-16 h-20 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0 border border-elora-border/50">
                  <Image
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=85"
                    }
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-editorial text-base text-elora-charcoal">{item.productName}</h4>
                  <p className="text-xs text-elora-gray">{item.variantTitle}</p>
                  <p className="text-xs text-elora-gray mt-1">
                    Qty: {item.quantity} × {formatCurrencyAmount(item.unitPrice, currencyCode)}
                  </p>
                </div>
                <div className="text-right text-sm font-medium text-elora-charcoal">
                  {formatCurrencyAmount(item.total, currencyCode)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-elora-border space-y-2 text-xs text-elora-gray max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-elora-charcoal">{formatCurrencyAmount(order.subtotal, currencyCode)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Privilege Discount</span>
                <span>-{formatCurrencyAmount(order.discountTotal, currencyCode)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Courier Delivery</span>
              <span className="text-elora-forest">
                {order.shippingTotal === 0 ? "Complimentary" : formatCurrencyAmount(order.shippingTotal, currencyCode)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>International Taxes & Duties</span>
              <span className="text-elora-charcoal">{formatCurrencyAmount(order.taxTotal, currencyCode)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-elora-charcoal pt-2 border-t border-elora-border">
              <span>Total Paid</span>
              <span className="font-editorial text-2xl text-elora-charcoal">
                {formatCurrencyAmount(order.total, currencyCode)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 text-center rounded-sm font-medium"
          >
            Continue Exploring Atelier
          </Link>
          <Link
            href="/account"
            className="px-8 py-3.5 bg-elora-surface border border-elora-border text-elora-charcoal text-xs uppercase tracking-luxury hover:bg-elora-cream transition-colors duration-300 text-center rounded-sm font-medium"
          >
            View In Client Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

