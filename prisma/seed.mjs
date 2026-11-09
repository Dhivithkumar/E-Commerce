import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ÉLORA Luxury Skincare Database...");

  // Clean existing tables in proper order
  await prisma.stockMovement.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productIngredient.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.heroBanner.deleteMany();
  await prisma.journalArticle.deleteMany();
  await prisma.knowledgeChunk.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.user.deleteMany();
  await prisma.address.deleteMany();

  // 1. Users
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@elora.luxury",
      name: "ÉLORA Executive Director",
      passwordHash,
      role: "ADMIN",
      phone: "+1 (800) 555-0199",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "sophia.vane@example.com",
      name: "Sophia Vane",
      passwordHash,
      role: "CUSTOMER",
      phone: "+1 (415) 555-8291",
      addresses: {
        create: {
          firstName: "Sophia",
          lastName: "Vane",
          company: "Vane Design Studio",
          street: "740 Park Avenue",
          apartment: "Penthouse B",
          city: "New York",
          state: "NY",
          postalCode: "10021",
          country: "US",
          phone: "+1 (415) 555-8291",
          isDefaultShipping: true,
          isDefaultBilling: true,
        },
      },
    },
  });

  console.log("✓ Created Admin and Customer accounts");

  // 2. Categories
  const catCleansing = await prisma.category.create({
    data: {
      name: "Cleansing",
      slug: "cleansing",
      description: "Purifying elixirs and oil-to-milk rituals that melt impurities without disrupting the lipid mantle.",
      image: "https://images.unsplash.com/photo-1556228722-d0b5d92ffb79?auto=format&fit=crop&w=1000&q=85",
      order: 1,
    },
  });

  const catSerums = await prisma.category.create({
    data: {
      name: "Serums & Treatments",
      slug: "serums",
      description: "High-potency cellular actives engineered for targeted barrier restoration and timeless luminosity.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85",
      order: 2,
    },
  });

  const catHydration = await prisma.category.create({
    data: {
      name: "Hydration & Crèmes",
      slug: "hydration",
      description: "Velvety emollient matrices designed to lock hydration deep within the stratum corneum.",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=85",
      order: 3,
    },
  });

  const catSun = await prisma.category.create({
    data: {
      name: "Sun Protection",
      slug: "sun-protection",
      description: "Weightless mineral photoprotection infused with antioxidant shields against photo-aging.",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=85",
      order: 4,
    },
  });

  const catRituals = await prisma.category.create({
    data: {
      name: "Curated Ritual Sets",
      slug: "rituals",
      description: "Harmonious regimens assembled for transformative morning and evening skincare ceremonies.",
      image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=85",
      order: 5,
    },
  });

  console.log("✓ Created 5 Product Categories");

  // 3. Key Scientific Ingredients
  const ingHA = await prisma.ingredient.create({
    data: {
      name: "Triple Molecular Hyaluronic Complex",
      slug: "triple-hyaluronic-acid",
      description: "Three distinct molecular weights that penetrate multiple dermal tiers, delivering 72-hour moisture reservoir support.",
      benefit: "Multilevel hydration & dermal plumping",
      safetyRating: "EWG Verified (Score 1)",
    },
  });

  const ingNiacinamide = await prisma.ingredient.create({
    data: {
      name: "Niacinamide 5% (USP Grade Vitamin B3)",
      slug: "niacinamide-usp",
      description: "Clinically validated concentration that refines micro-texture, calms erythema, and reinforces ceramide synthesis.",
      benefit: "Pore refinement & barrier reinforcement",
      safetyRating: "EWG Verified (Score 1)",
    },
  });

  const ingCeramides = await prisma.ingredient.create({
    data: {
      name: "Biomimetic Ceramide Complex (EOP, NP, AP)",
      slug: "biomimetic-ceramides",
      description: "Skin-identical lipid architecture that repairs depleted intercellular cement and prevents transepidermal water loss.",
      benefit: "Lipid barrier reconstruction",
      safetyRating: "EWG Verified (Score 1)",
    },
  });

  const ingEctoin = await prisma.ingredient.create({
    data: {
      name: "Extremolyte Ectoin 2%",
      slug: "ectoin-pure",
      description: "A natural stress-protection extremolyte molecule that buffers cellular membranes against environmental pollution and blue light.",
      benefit: "Cellular defense & anti-stress resilience",
      safetyRating: "EWG Verified (Score 1)",
    },
  });

  const ingVitC = await prisma.ingredient.create({
    data: {
      name: "THD Ascorbate (Lipid-Soluble Vitamin C 15%)",
      slug: "thd-ascorbate",
      description: "Next-generation tetrahexyldecyl ascorbate that penetrates 50x deeper than ascorbic acid without causing oxidative irritation.",
      benefit: "Collagen synthesis & radiant photoprotection",
      safetyRating: "EWG Verified (Score 1)",
    },
  });

  const ingBakuchiol = await prisma.ingredient.create({
    data: {
      name: "Standardized Botanical Bakuchiol 1.5%",
      slug: "bakuchiol-pure",
      description: "Gentle plant-derived retinoid alternative that stimulates cellular turnover and reduces fine lines without sensitizing photosensitivity.",
      benefit: "Cellular renewal & wrinkle smoothing",
      safetyRating: "EWG Verified (Score 1)",
    },
  });

  console.log("✓ Created Scientific Ingredients");

  // 4. Products & Variants
  const productsData = [
    {
      name: "The Cellular Renewal Concentrate",
      slug: "cellular-renewal-concentrate",
      subtitle: "Multi-Peptide & Triple Hyaluronic Infusion",
      description: "An intensive restorative serum formulated to accelerate nighttime dermal rejuvenation. Engineered with bio-identical signaling peptides and our proprietary Triple Molecular Hyaluronic Complex, it restores cellular vitality and supple bounce.",
      details: "Formulated without synthetic fragrances, parabens, sulfates, silicones, or drying alcohols. Dermatologist tested and hypoallergenic.",
      howToUse: "Dispense 3 to 4 drops into the palms of clean hands. Warm gently and press softly across the face, neck, and décolletage before creams.",
      categoryId: catSerums.id,
      basePrice: 135.0,
      compareAtPrice: 155.0,
      isFeatured: true,
      isBestseller: true,
      skinTypes: "all,dry,combination,sensitive",
      primaryConcerns: "anti-aging,hydration,barrier,texture",
      routineStep: "TREAT",
      volume: "30 ml / 1.0 fl. oz.",
      badge: "Signature Icon",
      images: [
        {
          url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
          alt: "ÉLORA Cellular Renewal Concentrate amber dropper bottle on warm stone pedestal",
          isPrimary: true,
          order: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1608248597359-009949d21c3b?auto=format&fit=crop&w=1200&q=85",
          alt: "Close up packaging detail of ÉLORA serum glass pipette",
          isPrimary: false,
          order: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=85",
          alt: "Pure golden serum droplet texture on minimalist marble",
          isPrimary: false,
          order: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
          alt: "Editorial skincare ritual display in modern sanctuary bathroom",
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { title: "Standard Edition (30 ml)", sku: "ELO-SER-01-30", price: 135.0, compareAtPrice: 155.0, stock: 45 },
        { title: "Reserve Grand Flacon (50 ml)", sku: "ELO-SER-01-50", price: 195.0, compareAtPrice: 225.0, stock: 28 },
      ],
      ingredients: [ingHA.id, ingNiacinamide.id, ingEctoin.id],
    },
    {
      name: "Barrier Restorative Crème",
      slug: "barrier-restorative-creme",
      subtitle: "Biomimetic Lipid & Ectoin Moisture Matrix",
      description: "A rich, whipped cloud emulsion designed to rebuild vulnerable moisture barriers. Floods skin with physiological ceramides, fatty acids, and soothing extremolytes to silence redness and lock in essential moisture.",
      details: "Non-comedogenic, fragrance-free, clinically proven to replenish the lipid envelope within 2 hours of topical application.",
      howToUse: "Gently massage a pearl-sized amount over face and neck in upward motions after applying serum. Suitable for morning and evening ceremonies.",
      categoryId: catHydration.id,
      basePrice: 110.0,
      compareAtPrice: 125.0,
      isFeatured: true,
      isBestseller: true,
      skinTypes: "dry,sensitive,combination,all",
      primaryConcerns: "barrier,hydration,redness",
      routineStep: "HYDRATE",
      volume: "50 ml / 1.7 fl. oz.",
      badge: "Award Winner",
      images: [
        {
          url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85",
          alt: "ÉLORA Barrier Restorative Crème in frosted luxury jar",
          isPrimary: true,
          order: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
          alt: "Whipped velvety cream swirl texture in natural morning light",
          isPrimary: false,
          order: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
          alt: "Emollient crème swatch showcasing silky spreadability",
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { title: "Full Size Jar (50 ml)", sku: "ELO-CRM-02-50", price: 110.0, compareAtPrice: 125.0, stock: 60 },
        { title: "Refill Pod (50 ml)", sku: "ELO-CRM-02-REF", price: 92.0, compareAtPrice: 105.0, stock: 35 },
      ],
      ingredients: [ingCeramides.id, ingEctoin.id, ingHA.id],
    },
    {
      name: "Luminous Botanical Cleansing Elixir",
      slug: "luminous-botanical-cleansing-elixir",
      subtitle: "Omega-Rich Gentle Transforming Cleanser",
      description: "An exquisite cushion gel-oil that dissolves environmental pollutants, waterproof SPF, and impurities while nourishing delicate lipids. Rinses completely clean without leaving residual residue.",
      details: "Enriched with cold-pressed camellia seed oil, squalane, and chamomile extract. pH-balanced at 5.5 to respect acid mantle.",
      howToUse: "Massage 2 pumps onto dry skin in circular motions. Add lukewarm water to emulsify into a silky milky lotion, then rinse thoroughly.",
      categoryId: catCleansing.id,
      basePrice: 78.0,
      compareAtPrice: null,
      isFeatured: true,
      isBestseller: false,
      skinTypes: "all,dry,combination,oily,sensitive",
      primaryConcerns: "cleansing,barrier,texture",
      routineStep: "CLEANSE",
      volume: "150 ml / 5.1 fl. oz.",
      badge: "Essential",
      images: [
        {
          url: "https://images.unsplash.com/photo-1556228722-d0b5d92ffb79?auto=format&fit=crop&w=1200&q=85",
          alt: "ÉLORA Luminous Botanical Cleansing Elixir bottle on architectural ivory surface",
          isPrimary: true,
          order: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1200&q=85",
          alt: "Cleansing elixir dispenser close up with refined amber bottle",
          isPrimary: false,
          order: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1200&q=85",
          alt: "Silky transforming oil-to-milk emulsification texture",
          isPrimary: false,
          order: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85",
          alt: "Morning vanity cleansing ceremony with natural light",
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { title: "Standard Pump (150 ml)", sku: "ELO-CLN-03-150", price: 78.0, compareAtPrice: null, stock: 80 },
      ],
      ingredients: [ingNiacinamide.id, ingEctoin.id],
    },
    {
      name: "Invisible Silk Mineral Fluid SPF 50+",
      slug: "invisible-silk-mineral-fluid-spf-50",
      subtitle: "Broad-Spectrum Shield with Antioxidant Defense",
      description: "A sheer, 100% non-nano zinc photoprotective emulsion that glides on invisibly across all complexions. Blends seamlessly under makeup while neutralizing free radicals and infrared stress.",
      details: "Water-resistant for 40 minutes. Free from chemical UV filters, octinoxate, oxybenzone, and synthetic silicones. Reef-conscious formulation.",
      howToUse: "Shake well before each ritual. Apply generously and evenly 15 minutes prior to sun exposure. Reapply every 2 hours or after toweling.",
      categoryId: catSun.id,
      basePrice: 85.0,
      compareAtPrice: 95.0,
      isFeatured: true,
      isBestseller: true,
      skinTypes: "all,sensitive,combination,oily,dry",
      primaryConcerns: "sun-protection,anti-aging,brightening",
      routineStep: "PROTECT",
      volume: "50 ml / 1.7 fl. oz.",
      badge: "Best Seller",
      images: [
        {
          url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=85",
          alt: "ÉLORA Invisible Silk Mineral Fluid bottle bathed in warm natural sunlight",
          isPrimary: true,
          order: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85",
          alt: "Weightless mineral lotion fluid droplet texture on fingertip",
          isPrimary: false,
          order: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
          alt: "Refined minimalist packaging and precision pump dispenser",
          isPrimary: false,
          order: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
          alt: "Golden hour photoprotection application in natural sunlight",
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { title: "Sheer Natural Finish (50 ml)", sku: "ELO-SPF-04-50", price: 85.0, compareAtPrice: 95.0, stock: 70 },
      ],
      ingredients: [ingEctoin.id, ingVitC.id],
    },
    {
      name: "Overnight Bio-Retinol Nectar",
      slug: "overnight-bio-retinol-nectar",
      subtitle: "1.5% Standardized Bakuchiol & Botanical Lipids",
      description: "A golden nocturnal elixir that promotes cellular regeneration, smooths fine lines, and refines uneven dermal pigmentation without the irritation or redness associated with synthetic retinoids.",
      details: "Clinically observed in 8-week consumer panels: 94% reported smoother skin texture and 91% reported enhanced clarity.",
      howToUse: "Press 3 drops into cleansed skin at night. Follow with Barrier Restorative Crème for heightened lipid infusion.",
      categoryId: catSerums.id,
      basePrice: 120.0,
      compareAtPrice: null,
      isFeatured: false,
      isBestseller: true,
      skinTypes: "all,dry,combination,aging",
      primaryConcerns: "anti-aging,texture,brightening",
      routineStep: "TREAT",
      volume: "30 ml / 1.0 fl. oz.",
      badge: "Clean Active",
      images: [
        {
          url: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=85",
          alt: "ÉLORA Overnight Bio-Retinol Nectar dropper flacon with deep botanical hues",
          isPrimary: true,
          order: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=85",
          alt: "Golden botanical bakuchiol oil droplet on warm stone",
          isPrimary: false,
          order: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1608248597359-009949d21c3b?auto=format&fit=crop&w=1200&q=85",
          alt: "Close up detail of amber glass flacon and golden foil embossing",
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { title: "Flacon Dropper (30 ml)", sku: "ELO-RET-05-30", price: 120.0, compareAtPrice: null, stock: 40 },
      ],
      ingredients: [ingBakuchiol.id, ingCeramides.id],
    },
    {
      name: "The ÉLORA Signature Ritual Collection",
      slug: "elora-signature-ritual-collection",
      subtitle: "The 4-Step Regimen for Elevated Radiance",
      description: "An all-inclusive discovery ceremony featuring full sizes of our most acclaimed formulations: Luminous Cleansing Elixir, Cellular Renewal Concentrate, Barrier Restorative Crème, and Invisible Silk Mineral Fluid.",
      details: "Housed in our sustainable handcrafted linen presentation box with golden foil embossing. Includes a custom polished marble skincare spatula.",
      howToUse: "Follow the 4-step morning and evening ritual: Cleanse, Treat, Hydrate, and Protect.",
      categoryId: catRituals.id,
      basePrice: 345.0,
      compareAtPrice: 408.0,
      isFeatured: true,
      isBestseller: true,
      skinTypes: "all,dry,combination,sensitive,oily",
      primaryConcerns: "hydration,barrier,anti-aging,radiance",
      routineStep: "TREAT",
      volume: "4 Full Size Vessels",
      badge: "Exclusive Set",
      images: [
        {
          url: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=85",
          alt: "ÉLORA Signature Ritual luxury boxed gift presentation on neutral linen",
          isPrimary: true,
          order: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
          alt: "Complete 4-vessel regimen arranged on travertine bathroom vanity",
          isPrimary: false,
          order: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
          alt: "Luxury presentation gift unboxing experience with bespoke spatula",
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { title: "Complete Ritual Set (Boxed)", sku: "ELO-SET-06-BOX", price: 345.0, compareAtPrice: 408.0, stock: 25 },
      ],
      ingredients: [ingHA.id, ingCeramides.id, ingNiacinamide.id, ingEctoin.id],
    },
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        description: p.description,
        details: p.details,
        howToUse: p.howToUse,
        categoryId: p.categoryId,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        skinTypes: p.skinTypes,
        primaryConcerns: p.primaryConcerns,
        routineStep: p.routineStep,
        volume: p.volume,
        badge: p.badge,
        images: {
          create: p.images.map((img) => ({
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary,
            order: img.order,
          })),
        },
        variants: {
          create: p.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            isAvailable: true,
            inventory: {
              create: {
                stockQuantity: v.stock,
                reorderThreshold: 10,
                stockMovements: {
                  create: {
                    type: "RESTOCK",
                    quantity: v.stock,
                    note: "Initial warehouse restock",
                  },
                },
              },
            },
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    // Link ingredients
    for (const ingId of p.ingredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdProduct.id,
          ingredientId: ingId,
          isKeyIngredient: true,
        },
      });
    }

    // Add sample verified reviews for social proof
    await prisma.review.createMany({
      data: [
        {
          productId: createdProduct.id,
          userId: customer.id,
          authorName: "Sophia V.",
          rating: 5,
          title: "Remarkable difference in my skin barrier",
          comment: "After two weeks of incorporating this into my evening ceremony, redness has diminished noticeably and skin feels remarkably plump and cushioned. The formulation is pure luxury.",
          isVerifiedPurchase: true,
          isApproved: true,
        },
        {
          productId: createdProduct.id,
          authorName: "Camilla R., Aesthetic Consultant",
          rating: 5,
          title: "World-class formulation balance",
          comment: "I recommend this to clients with sensitized barriers who cannot tolerate heavy synthetic fillers. It absorbs with an imperceptible weightlessness.",
          isVerifiedPurchase: true,
          isApproved: true,
        },
      ],
    });
  }

  console.log("✓ Created 6 Luxury Products, Variants, Inventory & Verified Reviews");

  // 5. Coupons
  await prisma.coupon.create({
    data: {
      code: "WELCOME15",
      description: "15% off your first ÉLORA ritual order",
      discountType: "PERCENTAGE",
      discountValue: 15.0,
      minOrderValue: 80.0,
      usageLimit: 500,
      usageCount: 14,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "ELORALUXE",
      description: "$25 complimentary privilege on orders above $150",
      discountType: "FIXED",
      discountValue: 25.0,
      minOrderValue: 150.0,
      usageLimit: 250,
      usageCount: 8,
      isActive: true,
    },
  });

  console.log("✓ Created Promotional Coupons");

  // 6. Hero Banners
  await prisma.heroBanner.create({
    data: {
      headline: "Rituals That Reveal Your Natural Radiance.",
      subheadline: "Thoughtfully crafted skincare experiences designed around the beauty of simplicity and physiological science.",
      ctaText: "SHOP THE COLLECTION",
      ctaLink: "/shop",
      secondaryCtaText: "DISCOVER OUR PHILOSOPHY",
      secondaryCtaLink: "/philosophy",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=90",
      isActive: true,
    },
  });

  // 7. Journal Articles
  await prisma.journalArticle.createMany({
    data: [
      {
        title: "Understanding Your Skin Barrier: The Architecture of Resilience",
        slug: "understanding-your-skin-barrier",
        excerpt: "Why the lipid mantle is your primary defense against premature aging and how physiological ceramides restore equilibrium.",
        content: `The stratum corneum is frequently compared to a brick wall: corneocyte cells represent the bricks, while intercellular lipids—comprising ceramides, cholesterol, and free fatty acids in an exact 3:1:1 ratio—form the mortar.\n\nWhen this protective mortar becomes depleted through harsh surfactants, UV radiation, or climate extremes, microscopic fissures emerge. Transepidermal water loss accelerates exponentially, leaving the dermis susceptible to environmental pollutants, chronic micro-inflammation, and accelerated breakdown of collagen networks.\n\nAt ÉLORA, our formulating philosophy prioritizes biomimetic lipid replenishment above aggressive exfoliation. By introducing physiological ceramides and extremolytes like Ectoin, we empower the skin to rebuild its native resilience naturally.`,
        readTime: "5 min read",
        coverImage: "https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1200&q=85",
        author: "ÉLORA Scientific Board",
      },
      {
        title: "Building an Elegant Morning Ritual for Lasting Luminosity",
        slug: "building-an-elegant-morning-ritual",
        excerpt: "A serene, scientific approach to awakening your complexion and defending against environmental oxidative stressors.",
        content: `Morning skincare should never feel frantic. It is an intentional ceremony to awaken cellular microcirculation and shield your dermal barrier for the day ahead.\n\nBegin with gentle cleansing that respects overnight lipid secretion. Follow with a potent antioxidant serum like our Cellular Renewal Concentrate, allowing active peptides to absorb before applying our Barrier Restorative Crème. Always conclude with broad-spectrum mineral protection like our Invisible Silk Mineral Fluid SPF 50+.`,
        readTime: "4 min read",
        coverImage: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=85",
        author: "Dr. Elena Marchand, Chief Formulation Chemist",
      },
      {
        title: "The Role of Extremolytes: Why Ectoin is the Future of Anti-Pollution Defense",
        slug: "the-role-of-extremolytes-ectoin",
        excerpt: "Discover the miraculous natural molecule discovered in salt lakes that shields cellular water structures from stress.",
        content: `Discovered in microorganisms surviving the extreme salinity and scorching heat of Egyptian salt lakes, Ectoin is nature's ultimate biological osmoprotectant.\n\nUnlike traditional hydrators that merely bind ambient water, Ectoin forms a compact hydro-complex—a protective 'water shell'—around cell membranes, proteins, and DNA. In vitro and clinical trials confirm that 2% Ectoin drastically attenuates blue light damage, urban particulate adhesion, and heat-induced moisture loss.`,
        readTime: "6 min read",
        coverImage: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=85",
        author: "ÉLORA Research & Development",
      },
    ],
  });

  console.log("✓ Created Journal Articles");

  // 8. RAG Knowledge Documents for AI Assistant
  const kbDocs = [
    {
      title: "ÉLORA Brand Philosophy & Formulation Standards",
      category: "BRAND",
      content: "ÉLORA represents the synthesis of dermatological science, high-purity botanicals, and timeless aesthetic ritual. We never formulate with parabens, synthetic fragrances, sulfates, phthalates, silicones, or drying alcohols. All products are cruelty-free, dermatologist-tested, and packaged in recyclable amber glass to shield active botanicals from UV photodegradation.",
      tagsJson: JSON.stringify(["philosophy", "clean", "cruelty-free", "sustainability"]),
    },
    {
      title: "Complimentary Global Shipping & Delivery Timelines",
      category: "POLICY",
      content: "ÉLORA offers complimentary carbon-neutral shipping on all qualifying international orders over $100 USD (or equivalent in GBP, EUR, CAD, AUD, AED). Orders placed before 2:00 PM EST ship the same business day from our climate-controlled fulfillment ateliers. Standard transit takes 2-4 business days within the US, UK, and Europe, and 3-6 business days to Canada, Australia, and the UAE. Signature courier delivery is available at checkout.",
      tagsJson: JSON.stringify(["shipping", "delivery", "international", "rates"]),
    },
    {
      title: "The 30-Day Ritual Guarantee & Return Policy",
      category: "POLICY",
      content: "We want you to experience transformative radiance with complete confidence. If any ÉLORA formulation does not align with your skin's unique needs, you may initiate a return within 30 days of receipt for a full refund to your original payment method. We provide prepaid return shipping labels for all domestic orders. Sample sachets included in your parcel are yours to enjoy.",
      tagsJson: JSON.stringify(["returns", "guarantee", "refunds", "policy"]),
    },
    {
      title: "Product Knowledge: Cellular Renewal Concentrate",
      category: "PRODUCT",
      content: "Cellular Renewal Concentrate contains 10% Triple Molecular Hyaluronic Acid, Niacinamide 5%, and signaling peptides. It targets fine lines, loss of dermal firmness, dehydrated texture, and compromised barrier. Ideal for all skin types, including dry, sensitive, and combination. Used after cleansing and before heavier moisturizers.",
      tagsJson: JSON.stringify(["serum", "cellular renewal", "hyaluronic", "anti-aging"]),
    },
    {
      title: "Product Knowledge: Barrier Restorative Crème",
      category: "PRODUCT",
      content: "Barrier Restorative Crème features a biomimetic 3:1:1 lipid complex of ceramides (NP, AP, EOP), pure extremolyte Ectoin 2%, and plant squalane. It soothes sensitized, redness-prone, dry, and wind-burned skin by locking in moisture for 48 hours without clogging pores.",
      tagsJson: JSON.stringify(["crème", "moisturizer", "barrier", "ceramides", "ectoin"]),
    },
  ];

  for (const doc of kbDocs) {
    const createdDoc = await prisma.knowledgeDocument.create({
      data: doc,
    });
    // Create chunk
    await prisma.knowledgeChunk.create({
      data: {
        documentId: createdDoc.id,
        chunkIndex: 0,
        content: doc.content,
        metadataJson: doc.tagsJson,
      },
    });
  }

  console.log("✓ Created RAG Knowledge Center Documents");

  // 9. Sample Initial Orders & Sales Metrics for Admin Analytics
  const firstProduct = await prisma.product.findFirst({
    include: { variants: true },
  });

  if (firstProduct && firstProduct.variants[0]) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "ELO-8921-USA",
        userId: customer.id,
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: "+1 (415) 555-8291",
        shippingAddressJson: JSON.stringify({
          firstName: "Sophia",
          lastName: "Vane",
          street: "740 Park Avenue",
          apartment: "Penthouse B",
          city: "New York",
          state: "NY",
          postalCode: "10021",
          country: "US",
        }),
        billingAddressJson: JSON.stringify({
          firstName: "Sophia",
          lastName: "Vane",
          street: "740 Park Avenue",
          city: "New York",
          state: "NY",
          postalCode: "10021",
          country: "US",
        }),
        shippingMethod: "COMPLIMENTARY_EXPRESS",
        subtotal: 245.0,
        discountTotal: 25.0,
        shippingTotal: 0.0,
        taxTotal: 17.6,
        total: 237.6,
        currency: "USD",
        paymentStatus: "PAID",
        fulfillmentStatus: "DELIVERED",
        trackingNumber: "ELR-9842104-FEDX",
        trackingCarrier: "FedEx International Priority",
        items: {
          create: [
            {
              productId: firstProduct.id,
              variantId: firstProduct.variants[0].id,
              productName: firstProduct.name,
              variantTitle: firstProduct.variants[0].title,
              unitPrice: 135.0,
              quantity: 1,
              total: 135.0,
              imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
            },
          ],
        },
        statusHistory: {
          create: [
            { status: "ORDER_PLACED", note: "Customer placed order via Apple Pay" },
            { status: "PAYMENT_CONFIRMED", note: "Stripe charge id ch_3NxT6Q2eZvKYlo2C" },
            { status: "DISPATCHED", note: "Handed over to carrier in New York" },
            { status: "DELIVERED", note: "Delivered to reception / front desk" },
          ],
        },
        payments: {
          create: {
            provider: "STRIPE",
            transactionId: "pi_3NxT6Q2eZvKYlo2C0198test",
            amount: 237.6,
            currency: "USD",
            status: "SUCCEEDED",
          },
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: "ELO-8922-GBR",
        customerEmail: "eleanor.b@mayfair.co.uk",
        customerName: "Lady Eleanor Berkeley",
        customerPhone: "+44 20 7946 0912",
        shippingAddressJson: JSON.stringify({
          firstName: "Eleanor",
          lastName: "Berkeley",
          street: "14 Berkeley Square",
          city: "London",
          state: "Greater London",
          postalCode: "W1J 6BQ",
          country: "GB",
        }),
        billingAddressJson: JSON.stringify({
          firstName: "Eleanor",
          lastName: "Berkeley",
          street: "14 Berkeley Square",
          city: "London",
          state: "Greater London",
          postalCode: "W1J 6BQ",
          country: "GB",
        }),
        shippingMethod: "COMPLIMENTARY_EXPRESS",
        subtotal: 345.0,
        discountTotal: 0.0,
        shippingTotal: 0.0,
        taxTotal: 0.0,
        total: 345.0,
        currency: "USD",
        paymentStatus: "PAID",
        fulfillmentStatus: "SHIPPED",
        trackingNumber: "DHL-GBR-8812903",
        trackingCarrier: "DHL Express Luxury",
        items: {
          create: [
            {
              productId: firstProduct.id,
              variantId: firstProduct.variants[0].id,
              productName: "The ÉLORA Signature Ritual Collection",
              variantTitle: "Complete Ritual Set (Boxed)",
              unitPrice: 345.0,
              quantity: 1,
              total: 345.0,
              imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=85",
            },
          ],
        },
      },
    });
  }

  // Daily metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  await prisma.dailySalesMetric.create({
    data: {
      date: todayStr,
      totalOrders: 12,
      totalSales: 2840.0,
      avgOrderVal: 236.67,
    },
  });

  console.log("✓ Initialized Sales Metrics & Orders");
  console.log("\n🌟 Seeding complete! Database is rich, verified, and production-ready.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

