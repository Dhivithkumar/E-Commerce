"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Globe,
  Sparkles,
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
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
    setCurrencyMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    {
      label: "Collections",
      href: "/collections",
      hasDropdown: true,
    },
    { label: "Our Philosophy", href: "/philosophy" },
    { label: "Journal", href: "/journal" },
    {
      label: "Skin Discovery",
      href: "/skin-discovery",
      highlight: true,
    },
  ];

  const collections = [
    {
      name: "Cleansing Elixirs",
      slug: "cleansing",
      desc: "Gentle oil-to-milk rituals that protect the lipid mantle",
    },
    {
      name: "Serums & Actives",
      slug: "serums",
      desc: "Cellular renewal peptides and high-potency bio-retinols",
    },
    {
      name: "Hydration & Crèmes",
      slug: "hydration",
      desc: "Biomimetic ceramides and 48-hour moisture shields",
    },
    {
      name: "Sun Photoprotection",
      slug: "sun-protection",
      desc: "100% invisible mineral SPF 50+ with extremolytes",
    },
    {
      name: "Curated Ritual Sets",
      slug: "rituals",
      desc: "Complete luxury discovery regimens housed in linen presentation boxes",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Section 1: Announcement Bar */}
        {!announcementDismissed && (
          <div className="bg-elora-forest text-elora-ivory text-[11px] py-2 px-4 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-elora-sand/80 font-editorial uppercase tracking-luxury">
                  Haute Skincare Formulation
                </span>
              </div>
              <div className="flex-1 text-center font-sans tracking-wide">
                <span>
                  Complimentary carbon-neutral express courier on orders over{" "}
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
                    className="flex items-center gap-1 hover:text-elora-sand transition-colors uppercase tracking-wider text-[10px]"
                  >
                    <span>{SUPPORTED_CURRENCIES[currency]?.flag}</span>
                    <span>{currency}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {currencyMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-elora-surface text-elora-charcoal border border-elora-border shadow-luxury py-1 z-50 rounded-sm">
                      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-elora-gray border-b border-elora-border/60">
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
                            currency === code ? "font-semibold text-elora-taupe" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{SUPPORTED_CURRENCIES[code].flag}</span>
                            <span>{SUPPORTED_CURRENCIES[code].code}</span>
                          </span>
                          <span className="text-elora-gray">{SUPPORTED_CURRENCIES[code].symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setAnnouncementDismissed(true)}
                  aria-label="Dismiss announcement"
                  className="text-elora-ivory/60 hover:text-elora-ivory"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Main Navigation Bar */}
        <nav
          className={`w-full transition-all duration-300 border-b ${
            isScrolled
              ? "bg-elora-ivory/95 backdrop-blur-md border-elora-border/80 shadow-sm py-3.5"
              : "bg-elora-ivory border-elora-border/50 py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-elora-charcoal hover:text-elora-taupe"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Left/Center: ÉLORA Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="group flex flex-col items-center">
                <span className="font-editorial text-2xl sm:text-3xl tracking-[0.2em] font-normal text-elora-charcoal uppercase group-hover:text-elora-taupe transition-colors">
                  ÉLORA
                </span>
                <span className="text-[9px] tracking-[0.38em] uppercase text-elora-gray/90 -mt-1 font-sans">
                  Haute Botanique
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setCollectionsDropdownOpen(true)}
                      onMouseLeave={() => setCollectionsDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center gap-1 text-xs uppercase tracking-luxury hover:text-elora-taupe transition-colors py-2 ${
                          pathname.startsWith(link.href)
                            ? "text-elora-taupe font-semibold"
                            : "text-elora-charcoal"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="w-3 h-3 transition-transform" />
                      </button>

                      {/* Mega Menu Dropdown */}
                      {collectionsDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-elora-surface border border-elora-border shadow-luxury p-6 rounded-sm mt-1 grid grid-cols-2 gap-4 animate-fade-in z-50">
                          <div className="col-span-2 border-b border-elora-border/60 pb-3 mb-1 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-ultra text-elora-gray">
                              Archival Collections
                            </span>
                            <Link
                              href="/collections"
                              className="text-xs text-elora-taupe hover:underline"
                            >
                              Explore All Collections &rarr;
                            </Link>
                          </div>
                          {collections.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/collections/${cat.slug}`}
                              className="p-2.5 rounded hover:bg-elora-cream/40 transition-colors group/item"
                            >
                              <h4 className="font-editorial text-sm font-medium text-elora-charcoal group-hover/item:text-elora-taupe">
                                {cat.name}
                              </h4>
                              <p className="text-[11px] text-elora-gray mt-0.5 line-clamp-2">
                                {cat.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative text-xs uppercase tracking-luxury transition-colors py-2 ${
                      link.highlight
                        ? "text-elora-forest font-semibold flex items-center gap-1.5"
                        : pathname === link.href
                        ? "text-elora-taupe font-semibold"
                        : "text-elora-charcoal hover:text-elora-taupe"
                    }`}
                  >
                    {link.highlight && (
                      <Sparkles className="w-3.5 h-3.5 text-elora-taupe" />
                    )}
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="bg-elora-forest text-elora-sand text-[9px] px-1.5 py-0.5 rounded-full font-sans tracking-normal ml-0.5">
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors"
                aria-label="Search formulations"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors"
                aria-label="Customer Account"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-elora-taupe text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag */}
              <button
                onClick={openCart}
                className="relative p-1.5 text-elora-charcoal hover:text-elora-taupe transition-colors"
                aria-label={`Shopping Bag (${itemCount} items)`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-elora-charcoal text-elora-ivory text-[9px] font-semibold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/40 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-elora-ivory shadow-drawer border-r border-elora-border p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-elora-border">
                <span className="font-editorial text-2xl tracking-widest text-elora-charcoal">
                  ÉLORA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-elora-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe font-medium py-1.5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-elora-border pt-6 space-y-3 text-xs">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-elora-gray"
                >
                  <span>Your Wishlist</span>
                  <span className="font-semibold text-elora-charcoal">{wishlistCount}</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-elora-gray"
                >
                  <span>Atelier Management Portal</span>
                  <span className="text-[10px] uppercase text-elora-taupe tracking-wider">
                    Staff
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-elora-border text-center text-xs text-elora-gray">
              <p className="font-editorial text-sm text-elora-charcoal italic">
                &ldquo;The Science of Beautiful Skin.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

