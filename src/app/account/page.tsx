import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  MapPin,
  Heart,
  Sparkles,
  LogOut,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrencyAmount, CurrencyCode } from "@/lib/currency";
import AccountAddressManager from "@/components/account/AccountAddressManager";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account/login");
  }

  // Fetch customer orders
  const orders = await prisma.order.findMany({
    where: {
      OR: [{ userId: user.id }, { customerEmail: user.email }],
    },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch customer addresses
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
  });

  // Fetch skin discovery profile
  const skinProfile = await prisma.skinProfile.findFirst({
    where: { OR: [{ userId: user.id }, { user: { email: user.email } }] },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-elora-ivory min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Profile & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-elora-border gap-4">
          <div>
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Client Portal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-elora-gray mt-1 font-sans">
              {user.email} • {user.role === "ADMIN" ? "Executive Administrator" : "Privileged Client"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-elora-forest text-elora-sand text-xs uppercase tracking-wider hover:bg-elora-taupe transition-colors rounded-sm"
              >
                Access Admin Atelier
              </Link>
            )}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-elora-surface border border-elora-border text-elora-charcoal hover:bg-elora-cream text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-sm transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-elora-taupe" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
          <div className="p-6 bg-elora-surface border border-elora-border/70 rounded-sm shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Active Orders</p>
              <h3 className="font-editorial text-2xl text-elora-charcoal font-medium">
                {orders.length}
              </h3>
            </div>
          </div>

          <div className="p-6 bg-elora-surface border border-elora-border/70 rounded-sm shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Saved Ateliers</p>
              <h3 className="font-editorial text-2xl text-elora-charcoal font-medium">
                {addresses.length || 1}
              </h3>
            </div>
          </div>

          <div className="p-6 bg-elora-surface border border-elora-border/70 rounded-sm shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-elora-cream flex items-center justify-center text-elora-sand">
              <Sparkles className="w-6 h-6 text-elora-forest" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Skin Diagnostics</p>
              <h3 className="font-editorial text-2xl text-elora-charcoal font-medium">
                {skinProfile ? "Active Profile" : "Unanalyzed"}
              </h3>
            </div>
          </div>
        </div>

        {/* Main Grid: Orders & Client Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Order Archives */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl text-elora-charcoal">
                Order Archives
              </h2>
              <span className="text-xs text-elora-gray font-sans">
                {orders.length} Total Submissions
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 bg-elora-surface border border-elora-border text-center rounded-sm space-y-3">
                <p className="font-editorial text-xl text-elora-charcoal">No past orders registered</p>
                <p className="text-xs text-elora-gray max-w-sm mx-auto">
                  Begin your cellular skincare journey by browsing our curated collection.
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-2 px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury rounded-sm"
                >
                  Discover Formulations
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const currencyCode = (ord.currency as CurrencyCode) || "USD";
                  return (
                    <div
                      key={ord.id}
                      className="bg-elora-surface border border-elora-border/80 p-6 rounded-sm shadow-sm space-y-4 hover:border-elora-taupe/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-elora-border/60 gap-2">
                        <div>
                          <span className="font-mono text-xs font-semibold text-elora-charcoal">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-elora-gray ml-3">
                            {new Date(ord.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium bg-elora-forest/10 text-elora-forest">
                            {ord.fulfillmentStatus}
                          </span>
                          <span className="text-xs font-semibold text-elora-charcoal">
                            {formatCurrencyAmount(ord.total, currencyCode)}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-2">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-xs">
                            <div className="relative w-10 h-12 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  item.imageUrl ||
                                  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80"
                                }
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-elora-charcoal">{item.productName}</p>
                              <p className="text-[11px] text-elora-gray">{item.variantTitle} × {item.quantity}</p>
                            </div>
                            <span className="text-xs font-medium text-elora-charcoal">
                              {formatCurrencyAmount(item.total, currencyCode)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking / Confirmation Action */}
                      <div className="pt-3 border-t border-elora-border/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-elora-gray">
                          Carrier: {ord.trackingCarrier} • {ord.trackingNumber}
                        </span>
                        <Link
                          href={`/checkout/confirmation/${ord.orderNumber}`}
                          className="text-elora-taupe hover:text-elora-charcoal font-medium flex items-center gap-1 group"
                        >
                          <span>Inspect Receipt</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Diagnostic & Preferences */}
          <div className="lg:col-span-4 space-y-6">
            {/* Saved Delivery Addresses Manager */}
            <AccountAddressManager initialAddresses={addresses} />

            {/* Skin Profile Card */}
            <div className="bg-elora-surface border border-elora-border p-6 rounded-sm shadow-card space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Diagnostic</span>
              </div>
              <h3 className="font-editorial text-xl text-elora-charcoal">
                Your Skin Matrix
              </h3>
              {skinProfile ? (
                <div className="space-y-2 text-xs text-elora-gray">
                  <p>
                    <strong className="text-elora-charcoal">Primary Type: </strong>
                    <span className="capitalize">{skinProfile.skinType}</span>
                  </p>
                  <p>
                    <strong className="text-elora-charcoal">Focus Concerns: </strong>
                    <span className="capitalize">
                      {JSON.parse(skinProfile.primaryConcernsJson || "[]").join(", ") || "Hydration"}
                    </span>
                  </p>
                  <Link
                    href="/skin-discovery"
                    className="inline-block mt-3 text-xs text-elora-taupe font-medium underline"
                  >
                    Retake Diagnostic Questionnaire &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-elora-gray">
                  <p>
                    You have not yet completed your AI skin diagnostic questionnaire.
                  </p>
                  <Link
                    href="/skin-discovery"
                    className="inline-block mt-3 px-4 py-2 bg-elora-forest text-elora-sand text-xs uppercase tracking-wider rounded-sm font-medium"
                  >
                    Take Skin Discovery Quiz
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Sourcing & Philosophy Card */}
            <div className="bg-elora-forest text-elora-ivory p-6 rounded-sm shadow-card space-y-3 border border-elora-sand/20">
              <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
                Privilege Concierge
              </span>
              <h3 className="font-editorial text-xl text-elora-ivory">
                The ÉLORA Guarantee
              </h3>
              <p className="text-xs text-elora-sand/80 leading-relaxed font-sans">
                Every formulation is protected by our 30-Day Ritual Guarantee. Inquire anytime via our AI Concierge or email concierge@elora.luxury for complimentary aesthetic consultations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

