import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Sparkles,
  BookOpen,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Inventory", href: "/admin/inventory", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Discounts", href: "/admin/discounts", icon: Tag },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "AI Business Intelligence", href: "/admin#ai-bi", icon: Sparkles },
    { label: "Knowledge Center", href: "/admin/knowledge", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-elora-charcoal">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-elora-forest text-elora-ivory border-r border-elora-sand/20 flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div>
          {/* Logo & Portal title */}
          <div className="p-6 border-b border-elora-sand/20">
            <Link href="/" className="group block">
              <span className="font-editorial text-2xl tracking-[0.2em] font-normal text-elora-ivory uppercase group-hover:text-elora-sand transition-colors">
                ÉLORA
              </span>
              <span className="text-[9px] tracking-ultra uppercase text-elora-sand block mt-0.5 font-sans">
                Atelier Administration
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-elora-sand/80 hover:text-elora-ivory hover:bg-white/10 transition-colors uppercase tracking-wider text-[11px]"
                >
                  <Icon className="w-4 h-4 text-elora-sand" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Back to storefront */}
        <div className="p-4 border-t border-elora-sand/20">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-elora-sand/80 hover:text-elora-ivory transition-colors uppercase tracking-wider px-3.5 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-elora-surface border-b border-elora-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden font-editorial text-xl text-elora-charcoal font-semibold">
              ÉLORA Atelier
            </Link>
            <span className="hidden md:inline text-xs uppercase tracking-luxury text-elora-gray">
              Commercial Operations Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Commerce Engine Active</span>
            </div>
            <Link
              href="/"
              className="text-xs text-elora-taupe hover:underline uppercase tracking-wider hidden sm:inline"
            >
              Storefront &rarr;
            </Link>
          </div>
        </header>

        {/* Child Pages */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

