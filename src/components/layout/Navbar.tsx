"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";
import SearchOverlay from "@/components/layout/SearchOverlay";

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency } = useCurrency();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [collectionsMegaOpen, setCollectionsMegaOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsMegaOpen(false);
    setCurrencyMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    {
      label: "Collections",
      href: "/collections",
      hasMegaMenu: true,
    },
    { label: "Our Philosophy", href: "/philosophy" },
    { label: "Journal", href: "/journal" },
    {
      label: "Skin Discovery",
      href: "/skin-discovery",
      highlight: true,
    },
  ];

  const megaMenuCollections = [
    {
      name: "The Cleansing Ritual",
      slug: "cleansing",
      tagline: "Oil-to-milk lipid balms",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "The Serum Edit",
      slug: "serums",
      tagline: "High-potency cellular actives",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Deep Hydration",
      slug: "hydration",
      tagline: "Biomimetic barrier crèmes",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Daily Protection",
      slug: "sun-protection",
      tagline: "Invisible 100% mineral SPF 50+",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* SECTION 4.1: ANNOUNCEMENT BAR */}
        {!announcementDismissed && (
          <div className="bg-elora-forest text-elora-ivory text-[11px] py-2 px-4 transition-all border-b border-elora-sand/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-elora-sand/90 font-sans uppercase tracking-ultra text-[10px]">
                  Haute Skincare Formulation
                </span>
              </div>

              <div className="flex-1 text-center font-sans tracking-wide">
                <span>
                  Complimentary international express shipping on qualifying orders over{" "}
                  <strong className="text-elora-sand font-medium">
                    {SUPPORTED_CURRENCIES[currency]?.symbol}
                    {SUPPORTED_CURRENCIES[currency]?.freeShippingThreshold}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Currency selector quick link */}
                <div className="relative">
                  <button
                    onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                    aria-label="Change currency"
                    className="flex items-center gap-1.5 hover:text-elora-sand transition-colors uppercase tracking-wider text-[10px] py-0.5 px-1.5 rounded hover:bg-white/5"
                  >
                    <span>{SUPPORTED_CURRENCIES[currency]?.flag}</span>
                    <span className="font-medium">{currency}</span>
                    <ChevronDown className="w-3 h-3 text-elora-sand" />
                  </button>

                  {currencyMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-elora-surface text-elora-charcoal border border-elora-border shadow-luxury py-1.5 z-50 rounded-sm animate-fade-in">
                      <div className="px-3 py-1 text-[9px] uppercase tracking-ultra text-elora-gray border-b border-elora-border/60">
                        Select Destination Currency
                      </div>
                      {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-elora-cream/50 transition-colors ${
                            currency === code ? "font-semibold text-elora-taupe bg-elora-cream/30" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{SUPPORTED_CURRENCIES[code].flag}</span>
                            <span>{SUPPORTED_CURRENCIES[code].code}</span>
                          </span>
                          <span className="text-elora-gray font-mono">{SUPPORTED_CURRENCIES[code].symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setAnnouncementDismissed(true)}
                  aria-label="Dismiss announcement"
                  className="text-elora-ivory/60 hover:text-elora-ivory p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4.2: MAIN NAVIGATION BAR */}
        <nav
          className={`w-full transition-all duration-300 border-b ${
            isScrolled
              ? "bg-elora-ivory/95 backdrop-blur-md border-elora-border shadow-sm py-3.5"
              : "bg-elora-ivory border-elora-border/70 py-4 sm:py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile menu toggle */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-1.5 text-elora-charcoal hover:text-elora-taupe"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Left: ÉLORA Brand Identity */}
            <div className="flex items-center">
              <Link href="/" className="group flex flex-col items-center">
                <span className="font-editorial text-2xl sm:text-3xl tracking-[0.22em] font-normal text-elora-charcoal uppercase group-hover:text-elora-taupe transition-colors">
                  ÉLORA
                </span>
                <span className="text-[8.5px] tracking-[0.38em] uppercase text-elora-gray/90 -mt-1 font-sans">
                  The Science of Beautiful Skin
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                if (link.hasMegaMenu) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setCollectionsMegaOpen(true)}
                      onMouseLeave={() => setCollectionsMegaOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-1.5 text-[11px] uppercase tracking-luxury hover:text-elora-taupe transition-colors py-2 ${
                          pathname.startsWith(link.href)
                            ? "text-elora-taupe font-semibold"
                            : "text-elora-charcoal"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-300 ${
                            collectionsMegaOpen ? "rotate-180 text-elora-taupe" : ""
                          }`}
                        />
                      </Link>

                      {/* Editorial Mega-Menu */}
                      {collectionsMegaOpen && (
                        <div className="absolute top-full -left-48 w-[720px] bg-elora-surface border border-elora-border shadow-luxury p-6 rounded-sm mt-0.5 animate-fade-in z-50">
                          <div className="flex justify-between items-center pb-4 mb-4 border-b border-elora-border">
                            <div>
                              <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium">
                                Curated Catalog
                              </span>
                              <h4 className="font-editorial text-lg text-elora-charcoal">
                                Skincare by Ritual & Formulation
                              </h4>
                            </div>
                            <Link
                              href="/collections"
                              className="text-xs text-elora-taupe hover:text-elora-forest uppercase tracking-wider flex items-center gap-1 group font-medium"
                            >
                              <span>View All Collections</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-4 gap-4">
                            {megaMenuCollections.map((col) => (
                              <Link
                                key={col.slug}
                                href={`/collections/${col.slug}`}
                                className="group/item flex flex-col"
                              >
                                <div className="relative aspect-[4/5] bg-elora-cream rounded-sm overflow-hidden mb-2.5 border border-elora-border">
                                  <Image
                                    src={col.image}
                                    alt={col.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-elora-charcoal/10 group-hover/item:bg-transparent transition-colors" />
                                </div>
                                <h5 className="font-editorial text-sm text-elora-charcoal group-hover/item:text-elora-taupe transition-colors">
                                  {col.name}
                                </h5>
                                <p className="text-[10.5px] text-elora-gray leading-tight mt-0.5">
                                  {col.tagline}
                                </p>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-elora-border flex items-center justify-between text-xs text-elora-gray bg-elora-ivory/60 -mx-6 -mb-6 px-6 py-3 rounded-b-sm">
                            <span className="flex items-center gap-1.5 text-elora-forest">
                              <Sparkles className="w-3.5 h-3.5 text-elora-taupe" />
                              <strong className="font-medium text-elora-charcoal">Need guidance?</strong> Take our 2-minute diagnostic consultation.
                            </span>
                            <Link
                              href="/skin-discovery"
                              className="text-elora-forest font-medium underline uppercase tracking-wider text-[10px] hover:text-elora-taupe"
                            >
                              Start Skin Discovery &rarr;
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[11px] uppercase tracking-luxury hover:text-elora-taupe transition-colors py-2 flex items-center gap-1.5 ${
                      link.highlight
                        ? "text-elora-forest font-medium px-3 py-1 bg-elora-sand/20 rounded-full border border-elora-sand/40 hover:bg-elora-sand/30"
                        : pathname === link.href
                        ? "text-elora-taupe font-semibold"
                        : "text-elora-charcoal"
                    }`}
                  >
                    {link.highlight && <Sparkles className="w-3 h-3 text-elora-taupe" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions (Search, Account, Wishlist, Bag) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors"
                aria-label="Search ÉLORA products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Customer Account */}
              <Link
                href="/account"
                className="p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors hidden sm:inline-block"
                aria-label="Customer Account"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-elora-taupe text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag with live count badge */}
              <button
                onClick={openCart}
                className="relative p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors"
                aria-label={`Shopping Bag (${itemCount} items)`}
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-elora-forest text-elora-sand text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-elora-ivory shadow-drawer flex flex-col border-r border-elora-border p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-5 border-b border-elora-border">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-2xl tracking-widest uppercase text-elora-charcoal"
              >
                ÉLORA
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-elora-charcoal hover:text-elora-taupe"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-4 overflow-y-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-luxury text-elora-charcoal py-2 hover:text-elora-taupe"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-luxury text-elora-charcoal py-2 hover:text-elora-taupe"
              >
                Shop All
              </Link>
              <div className="py-2">
                <span className="block text-[11px] uppercase tracking-ultra text-elora-gray mb-2">
                  Collections
                </span>
                <div className="pl-3 space-y-2.5 border-l border-elora-border">
                  <Link
                    href="/collections/cleansing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs text-elora-charcoal hover:text-elora-taupe"
                  >
                    The Cleansing Ritual
                  </Link>
                  <Link
                    href="/collections/serums"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs text-elora-charcoal hover:text-elora-taupe"
                  >
                    The Serum Edit
                  </Link>
                  <Link
                    href="/collections/hydration"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs text-elora-charcoal hover:text-elora-taupe"
                  >
                    Deep Hydration
                  </Link>
                  <Link
                    href="/collections/sun-protection"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs text-elora-charcoal hover:text-elora-taupe"
                  >
                    Daily Protection
                  </Link>
                  <Link
                    href="/collections"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs text-elora-taupe font-medium"
                  >
                    View All Collections &rarr;
                  </Link>
                </div>
              </div>
              <Link
                href="/philosophy"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-luxury text-elora-charcoal py-2 hover:text-elora-taupe"
              >
                Our Philosophy
              </Link>
              <Link
                href="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-luxury text-elora-charcoal py-2 hover:text-elora-taupe"
              >
                Journal
              </Link>
              <Link
                href="/skin-discovery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm uppercase tracking-luxury text-elora-forest font-semibold py-2 px-3 bg-elora-sand/20 rounded border border-elora-sand/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-elora-taupe" />
                <span>Skin Discovery Diagnostic</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-elora-border space-y-3">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe"
              >
                <User className="w-4 h-4" />
                <span>Customer Account</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe"
              >
                <Heart className="w-4 h-4" />
                <span>Saved Wishlist ({wishlistCount})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
