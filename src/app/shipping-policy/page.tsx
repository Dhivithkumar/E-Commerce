import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, Globe, ShieldCheck, Clock, ArrowRight, PackageCheck } from "lucide-react";

export const metadata = {
  title: "Delivery Standards & International Shipping | ÉLORA",
  description:
    "Complimentary express international courier delivery to the United States, United Kingdom, Canada, Australia, and the UAE with carbon-neutral tracking.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen">
      {/* Editorial Hero */}
      <section className="relative py-20 sm:py-28 bg-elora-forest text-elora-ivory overflow-hidden border-b border-elora-sand/20">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=2000&q=85"
            alt="ÉLORA Luxury Presentation Box"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-ultra text-elora-sand font-medium">
            International Delivery Standards
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-elora-ivory font-normal leading-tight">
            Complimentary Courier Delivery
          </h1>
          <p className="text-xs sm:text-sm text-elora-sand/90 max-w-xl mx-auto font-sans leading-relaxed font-light">
            Every ÉLORA delivery is dispatched in temperature-buffered luxury presentation packaging with audited carbon-neutral courier transit tracking.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Destination Courier Tiers */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Global Destinations
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              Regional Delivery Charters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3 shadow-card hover:shadow-luxury transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-editorial text-2xl text-elora-charcoal">United States & Canada</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-cream text-elora-forest font-semibold rounded-sm">
                  FedEx Express
                </span>
              </div>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                Complimentary on orders over $100 USD (or CA$135). Orders under threshold ship via Flat Courier rate ($12 USD). Estimated transit: 2 to 4 business days.
              </p>
              <div className="pt-2 text-[11px] text-elora-taupe font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>2-4 Business Days with Direct Signature</span>
              </div>
            </div>

            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3 shadow-card hover:shadow-luxury transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-editorial text-2xl text-elora-charcoal">United Kingdom & Europe</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-cream text-elora-forest font-semibold rounded-sm">
                  DHL Luxury Express
                </span>
              </div>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                Complimentary on orders over £80 / €90. Standard express shipping £9 / €10. Import duties & VAT are fully prepaid at checkout with zero unexpected courier customs fees.
              </p>
              <div className="pt-2 text-[11px] text-elora-taupe font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>2-4 Business Days • Duties Included</span>
              </div>
            </div>

            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3 shadow-card hover:shadow-luxury transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-editorial text-2xl text-elora-charcoal">Australia & New Zealand</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-cream text-elora-forest font-semibold rounded-sm">
                  Priority Air
                </span>
              </div>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                Complimentary on orders over AU$150. Standard air courier AU$18. Fully insulated packaging prevents thermal degradation during equatorial transit.
              </p>
              <div className="pt-2 text-[11px] text-elora-taupe font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>3-5 Business Days • Climate Sealed</span>
              </div>
            </div>

            <div className="p-7 bg-elora-surface border border-elora-border rounded-sm space-y-3 shadow-card hover:shadow-luxury transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-editorial text-2xl text-elora-charcoal">United Arab Emirates & Gulf</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-cream text-elora-forest font-semibold rounded-sm">
                  Emirates Priority
                </span>
              </div>
              <p className="text-xs text-elora-gray leading-relaxed font-sans font-light">
                Complimentary on orders over 370 AED. Express courier 35 AED. Dispatched with active thermal lining to maintain biological efficacy in desert temperatures.
              </p>
              <div className="pt-2 text-[11px] text-elora-taupe font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>2-4 Business Days • Cold-Chain Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Compounding & Unboxing Experience */}
        <div className="bg-elora-surface border border-elora-border p-8 sm:p-10 rounded-sm shadow-luxury grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] bg-elora-cream rounded-sm overflow-hidden border border-elora-border">
            <Image
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85"
              alt="ÉLORA Unboxing Presentation"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Atelier Protocol
            </span>
            <h3 className="font-editorial text-3xl text-elora-charcoal">
              Same-Day Compounding Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed font-sans font-light">
              Orders confirmed prior to 2:00 PM EST on business days are inspected, packed in embossed unbleached linen cartons, and handed to international courier networks on the same calendar day.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-elora-forest font-medium">
              <PackageCheck className="w-5 h-5 text-elora-taupe" />
              <span>Complimentary ritual samples included in every package</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 rounded-sm font-medium"
          >
            <span>Begin Your Curated Ritual</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
