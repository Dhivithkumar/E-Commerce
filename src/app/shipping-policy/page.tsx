import React from "react";
import Link from "next/link";
import { Truck, Globe, ShieldCheck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Delivery Standards
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-elora-charcoal mt-1">
            Complimentary International Courier Shipping
          </h1>
          <p className="text-xs sm:text-sm text-elora-gray mt-2 leading-relaxed">
            Every ÉLORA delivery is dispatched in insulated luxury presentation packaging with carbon-neutral transit tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-2">
            <h3 className="font-editorial text-xl text-elora-charcoal">United States & Canada</h3>
            <p className="text-xs text-elora-gray">
              Complimentary on orders over $100 USD (or CA$135). Transit: 2 to 4 business days via FedEx Priority.
            </p>
          </div>
          <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-2">
            <h3 className="font-editorial text-xl text-elora-charcoal">United Kingdom & Europe</h3>
            <p className="text-xs text-elora-gray">
              Complimentary on orders over £80 / €90. Transit: 2 to 4 business days via DHL Express Luxury.
            </p>
          </div>
          <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-2">
            <h3 className="font-editorial text-xl text-elora-charcoal">Australia & New Zealand</h3>
            <p className="text-xs text-elora-gray">
              Complimentary on orders over AU$150. Transit: 3 to 5 business days via International Courier.
            </p>
          </div>
          <div className="p-6 bg-elora-surface border border-elora-border rounded-sm space-y-2">
            <h3 className="font-editorial text-xl text-elora-charcoal">United Arab Emirates & Gulf</h3>
            <p className="text-xs text-elora-gray">
              Complimentary on orders over 370 AED. Transit: 2 to 4 business days via Emirates Express Courier.
            </p>
          </div>
        </div>

        <div className="p-6 bg-elora-cream/40 border border-elora-border rounded-sm text-xs text-elora-gray space-y-2">
          <h4 className="font-semibold text-elora-charcoal uppercase tracking-wider">
            Same-Day Atelier Compounding Guarantee
          </h4>
          <p>
            Orders confirmed prior to 2:00 PM EST on business days are inspected, packed, and handed to international courier networks on the same calendar day.
          </p>
        </div>
      </div>
    </div>
  );
}

