import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Droplets, Leaf, Star, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch real bestsellers and featured products from the database
  const bestsellers = await prisma.product.findMany({
    where: { isArchived: false, isBestseller: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" } },
      variants: { where: { isAvailable: true } },
      reviews: { where: { isApproved: true }, select: { rating: true } },
    },
    take: 6,
  });

  // Fetch real categories
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  // Fetch real journal articles
  const articles = await prisma.journalArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Fetch verified ingredients
  const ingredients = await prisma.ingredient.findMany({
    take: 4,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 3: EDITORIAL HERO */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center bg-elora-forest text-elora-ivory overflow-hidden">
        {/* Background Editorial Image with subtle gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=90"
            alt="ÉLORA Haute Skincare Sanctuary and Amber Bottles"
            fill
            priority
            className="object-cover object-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-elora-forest via-elora-forest/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-elora-sand/10 border border-elora-sand/30 rounded-full text-elora-sand text-xs tracking-ultra uppercase font-sans">
              <Sparkles className="w-3.5 h-3.5 text-elora-sand" />
              <span>Haute Formulation • Clinical Precision</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-elora-ivory">
              Rituals That Reveal Your Natural Radiance.
            </h1>

            <p className="text-sm sm:text-base text-elora-sand/90 font-sans max-w-xl leading-relaxed">
              Thoughtfully crafted skincare experiences designed around the beauty of simplicity and physiological science. Free from synthetic fillers, bio-engineered for restorative dermal barrier resilience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-elora-sand text-elora-forest hover:bg-elora-ivory text-xs uppercase tracking-luxury font-medium transition-all duration-300 flex items-center justify-center gap-3 rounded-sm group shadow-lg"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/philosophy"
                className="px-8 py-4 bg-transparent border border-elora-sand/40 hover:border-elora-sand text-elora-ivory hover:text-elora-sand text-xs uppercase tracking-luxury font-medium transition-all duration-300 flex items-center justify-center rounded-sm"
              >
                Discover Our Philosophy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Badge */}
        <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-6 z-10 text-[11px] text-elora-sand/70 tracking-widest uppercase">
          <span>Cold-Pressed Active Botanicals</span>
          <span>•</span>
          <span>Physiological Biomimetic Lipids</span>
          <span>•</span>
          <span>Cruelty-Free Certified</span>
        </div>
      </section>

      {/* SECTION 4: BRAND INTRODUCTION (Split Editorial Layout) */}
      <section className="py-24 bg-elora-ivory border-b border-elora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] bg-elora-cream overflow-hidden rounded-sm shadow-luxury border border-elora-border">
                <Image
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85"
                  alt="ÉLORA Frosted Glass Jar on Natural Stone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-44 sm:w-56 aspect-square bg-elora-forest text-elora-sand p-6 rounded-sm shadow-xl hidden sm:flex flex-col justify-between border border-elora-sand/20">
                <span className="text-[10px] uppercase tracking-ultra">Formulation Index</span>
                <p className="font-editorial text-2xl text-elora-ivory leading-snug">
                  100% Physiological Compatibility
                </p>
                <span className="text-[10px] text-elora-sand/80">Stratum Corneum Science</span>
              </div>
            </div>

            {/* Right Brand Introduction */}
            <div className="lg:col-span-7 space-y-6 lg:pl-6">
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                The ÉLORA Standard
              </span>

              <h2 className="font-editorial text-3xl sm:text-5xl text-elora-charcoal font-normal leading-tight">
                Beauty Begins With Understanding.
              </h2>

              <p className="text-sm text-elora-gray leading-relaxed font-sans">
                For decades, modern cosmetics prioritized superficial sensory illusions over dermatological equilibrium. Harsh surfactants, volatile synthetic perfumes, and high-abrasion peelings strip the fragile stratum corneum, inciting chronic low-grade inflammation.
              </p>

              <p className="text-sm text-elora-gray leading-relaxed font-sans">
                At ÉLORA, our formulating principles honor cellular architecture. By replenishing identical skin lipids—ceramides, cholesterol, and essential fatty acids in our verified 3:1:1 ratio—we rebuild your barrier&apos;s natural shield, locking in pure hydration and preventing trans-epidermal moisture dissipation.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-elora-border/60">
                <div>
                  <h4 className="font-editorial text-2xl sm:text-3xl text-elora-charcoal font-medium">
                    100%
                  </h4>
                  <p className="text-[11px] text-elora-gray uppercase tracking-wider mt-1">
                    Synthetic Fragrance-Free
                  </p>
                </div>
                <div>
                  <h4 className="font-editorial text-2xl sm:text-3xl text-elora-charcoal font-medium">
                    3:1:1
                  </h4>
                  <p className="text-[11px] text-elora-gray uppercase tracking-wider mt-1">
                    Biomimetic Lipid Ratio
                  </p>
                </div>
                <div>
                  <h4 className="font-editorial text-2xl sm:text-3xl text-elora-charcoal font-medium">
                    48h
                  </h4>
                  <p className="text-[11px] text-elora-gray uppercase tracking-wider mt-1">
                    Cellular Hydration Reservoir
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/philosophy"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-charcoal font-semibold hover:text-elora-taupe group transition-colors"
                >
                  <span>Read our Clinical Manifesto</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED COLLECTIONS */}
      <section className="py-24 bg-elora-cream/40 border-b border-elora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                Targeted Care
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
                Curated Collections
              </h2>
            </div>
            <Link
              href="/collections"
              className="mt-4 md:mt-0 text-xs uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe font-medium flex items-center gap-2 group"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/collections/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-elora-charcoal shadow-md border border-elora-border"
              >
                <Image
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85"
                  }
                  alt={cat.name}
                  fill
                  className="object-cover opacity-85 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elora-charcoal/90 via-elora-charcoal/20 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 text-elora-ivory space-y-1">
                  <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
                    Collection
                  </span>
                  <h3 className="font-editorial text-2xl text-elora-ivory group-hover:text-elora-sand transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-elora-sand/80 line-clamp-2 font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: BESTSELLING PRODUCTS */}
      <section className="py-24 bg-elora-ivory border-b border-elora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Proven Formulations
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-elora-charcoal font-normal">
              Most Acclaimed Formulations
            </h2>
            <p className="text-xs sm:text-sm text-elora-gray max-w-lg mx-auto leading-relaxed">
              Dermatologist approved and celebrated by beauty editors worldwide for transformative barrier renewal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 rounded-sm font-medium"
            >
              <span>View Complete Skincare Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: SKIN DISCOVERY CTA */}
      <section className="py-24 bg-elora-forest text-elora-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1800&q=80"
            alt="Pure Dew Texture"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-elora-sand/15 border border-elora-sand/30 rounded-full text-elora-sand text-xs tracking-ultra uppercase font-sans">
            <Sparkles className="w-3.5 h-3.5 text-elora-sand" />
            <span>AI Skin Diagnostic Engine</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-elora-ivory leading-tight font-normal">
            Your Skin. Your Ritual. Your ÉLORA.
          </h2>

          <p className="text-sm sm:text-base text-elora-sand/90 max-w-2xl mx-auto leading-relaxed font-sans">
            Every complexion holds unique cellular memory and barrier requirements. Take our 2-minute diagnostic questionnaire to receive a personalized, biologically compatible ritual tailored to your skin concerns.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/skin-discovery"
              className="px-8 py-4 bg-elora-sand text-elora-forest hover:bg-elora-ivory text-xs uppercase tracking-luxury font-medium transition-all duration-300 flex items-center justify-center gap-3 rounded-sm group shadow-lg"
            >
              <span>Discover Your Skincare Routine</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-elora-sand/20 max-w-2xl mx-auto">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-elora-sand uppercase tracking-wider block">Duration</span>
              <span className="text-xs text-elora-ivory font-medium">2 Minutes</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-elora-sand uppercase tracking-wider block">Analysis</span>
              <span className="text-xs text-elora-ivory font-medium">Stratum Barrier</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-elora-sand uppercase tracking-wider block">Privacy</span>
              <span className="text-xs text-elora-ivory font-medium">Zero Diagnostic Ad-Tracking</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-elora-sand uppercase tracking-wider block">Privilege</span>
              <span className="text-xs text-elora-ivory font-medium">15% Welcome Gift</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: SCIENTIFIC INGREDIENTS SECTION */}
      <section className="py-24 bg-elora-ivory border-b border-elora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
              Ingredient Philosophy
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
              Active Molecules of Botanical Precision
            </h2>
            <p className="text-xs sm:text-sm text-elora-gray leading-relaxed">
              We reject fleeting cosmetic fads in favor of clinically validated molecules with proven biomimetic compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="p-6 bg-elora-surface border border-elora-border/70 hover:border-elora-taupe/50 transition-all rounded-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe mb-4">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-lg text-elora-charcoal">
                    {ing.name}
                  </h3>
                  <p className="text-xs text-elora-taupe font-medium mt-1">
                    {ing.benefit}
                  </p>
                  <p className="text-xs text-elora-gray mt-2.5 leading-relaxed font-sans">
                    {ing.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-elora-border/50 text-[10px] uppercase tracking-wider text-elora-forest font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-elora-taupe" />
                  <span>{ing.safetyRating}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/ingredients"
              className="text-xs uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe font-medium underline underline-offset-4"
            >
              Explore our full transparency ingredient index &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: EDITORIAL CAMPAIGN (Large Banner) */}
      <section className="relative py-32 bg-elora-charcoal text-elora-ivory overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=2000&q=85"
            alt="ÉLORA Editorial Laboratory and Pure Glass Dropper"
            fill
            className="object-cover opacity-35 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
            Editorial Manifesto
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl text-elora-ivory font-normal leading-tight">
            &ldquo;Thoughtful Formulations. Timeless Rituals.&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-elora-sand/80 max-w-lg mx-auto font-sans leading-relaxed">
            Crafted in small, meticulous batches to preserve the enzymatic potency of living botanicals. Designed for those who treat skincare as an art form.
          </p>
        </div>
      </section>

      {/* SECTION 10: CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-elora-cream/30 border-b border-elora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                  Verified Client Impressions
                </span>
                <span className="text-[9px] uppercase px-2 py-0.5 bg-elora-border/60 text-elora-charcoal/70 rounded-full font-sans tracking-normal">
                  Sample Demonstration Reviews
                </span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
                Reflections of Radiance
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-xs text-elora-charcoal">
              <div className="flex text-elora-taupe">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-elora-sand" />
                ))}
              </div>
              <span className="font-semibold">4.9 / 5.0</span>
              <span className="text-elora-gray">(Based on 480+ Global Rituals)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-elora-surface border border-elora-border/70 rounded-sm shadow-card space-y-4">
              <div className="flex text-elora-sand">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <h4 className="font-editorial text-xl text-elora-charcoal">
                &ldquo;My fragile moisture barrier has never felt this cushioned.&rdquo;
              </h4>
              <p className="text-xs text-elora-gray leading-relaxed font-sans">
                After enduring years of over-exfoliation, the Barrier Restorative Crème healed my chronic facial redness within ten days. The texture is sheer alchemy—rich without being suffocating.
              </p>
              <div className="pt-4 border-t border-elora-border/50 text-xs">
                <p className="font-medium text-elora-charcoal">Sophia Vane</p>
                <p className="text-[11px] text-elora-gray">Verified Purchaser • New York, NY</p>
              </div>
            </div>

            <div className="p-8 bg-elora-surface border border-elora-border/70 rounded-sm shadow-card space-y-4">
              <div className="flex text-elora-sand">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <h4 className="font-editorial text-xl text-elora-charcoal">
                &ldquo;A clean alternative to retinol that actually performs.&rdquo;
              </h4>
              <p className="text-xs text-elora-gray leading-relaxed font-sans">
                The Overnight Bio-Retinol Nectar with bakuchiol delivered visible pore refinement and smoothing without any peeling or flaking. It has become non-negotiable in my evening protocol.
              </p>
              <div className="pt-4 border-t border-elora-border/50 text-xs">
                <p className="font-medium text-elora-charcoal">Eleanor Berkeley</p>
                <p className="text-[11px] text-elora-gray">Verified Purchaser • London, UK</p>
              </div>
            </div>

            <div className="p-8 bg-elora-surface border border-elora-border/70 rounded-sm shadow-card space-y-4">
              <div className="flex text-elora-sand">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <h4 className="font-editorial text-xl text-elora-charcoal">
                &ldquo;Invisible SPF that leaves zero chalky sheen.&rdquo;
              </h4>
              <p className="text-xs text-elora-gray leading-relaxed font-sans">
                Mineral sunscreens typically pill or leave a ghostly cast under makeup. The Invisible Silk Mineral Fluid absorbs like water and leaves a velvet, lit-from-within finish all day.
              </p>
              <div className="pt-4 border-t border-elora-border/50 text-xs">
                <p className="font-medium text-elora-charcoal">Nour Al-Sabah</p>
                <p className="text-[11px] text-elora-gray">Verified Purchaser • Dubai, UAE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: JOURNAL */}
      <section className="py-24 bg-elora-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
                The Scientific Journal
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
                Notes on Dermal Health
              </h2>
            </div>
            <Link
              href="/journal"
              className="mt-4 md:mt-0 text-xs uppercase tracking-luxury text-elora-charcoal hover:text-elora-taupe font-medium flex items-center gap-2 group"
            >
              <span>View All Dispatches</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/journal/${art.slug}`}
                className="group flex flex-col bg-elora-surface border border-elora-border/60 hover:border-elora-taupe/40 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-luxury"
              >
                <div className="relative aspect-[16/10] bg-elora-cream overflow-hidden">
                  <Image
                    src={art.coverImage}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-elora-gray uppercase tracking-wider mb-2">
                      <Clock className="w-3 h-3 text-elora-taupe" />
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="font-editorial text-xl text-elora-charcoal group-hover:text-elora-taupe transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-elora-gray line-clamp-2 mt-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-elora-border/50 text-[11px] font-medium text-elora-charcoal group-hover:text-elora-taupe flex items-center gap-1">
                    <span>Read Investigation</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

