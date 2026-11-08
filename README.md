# ÉLORA — The Science of Beautiful Skin
## Haute Skincare & Beauty E-Commerce Platform

[![Next.js 14 App Router](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io)
[![Stripe Test Mode](https://img.shields.io/badge/Stripe-Test_Mode_Ready-635BFF?style=flat&logo=stripe)](https://stripe.com)

**Commercial Positioning:** Professional $1,000 Luxury E-Commerce Development Package  
**Target Markets:** USA, United Kingdom, Canada, Australia, United Arab Emirates, European Union  
**Design Direction:** Luxury Editorial + Modern Dermal Physiology

---

## 1. Executive Summary & Brand Identity

**ÉLORA** represents the synthesis of dermatological science, high-potency cellular actives, and timeless beauty ceremonies. Engineered with a biomimetic 3:1:1 lipid ratio (skin-identical ceramides, cholesterol, and essential fatty acids), our formulations support native stratum corneum resilience without synthetic fillers.

### Visual Design Tokens

| Purpose | Name | Hex Code | Visual Application |
|---|---|---|---|
| Primary Background | Warm Ivory | `#F4F0E8` | Overall page backgrounds & smooth canvases |
| Secondary Background | Soft Cream | `#EAE2D6` | Cards, subtle accents, and secondary tiers |
| Surface Canvas | Pure White | `#FFFFFF` | Product cards, dialogs, drawers |
| Primary Typography | Deep Charcoal | `#24211F` | High-contrast editorial titles and headings |
| Secondary Typography | Warm Gray | `#77716A` | Subtitles, specifications, and volume labels |
| Accent Tone | Muted Taupe | `#9A806B` | Buttons, focus rings, hover transitions |
| Secondary Accent | Sand | `#D7C8B2` | Stars, badge backgrounds, subtle highlights |
| Dark Contrast | Forest Green | `#26372F` | Announcement bar, newsletter, AI concierge |
| Borders & Dividers | Soft Beige | `#DED7CC` | Refined minimalist hairline dividers |

---

## 2. Complete Architectural Features

### Storefront & Customer Experience
- **13 Homepage Editorial Sections:**
  1. Sticky Announcement Bar with live dismiss and international currency selector preview.
  2. Luxury Navigation Bar with brand monogram, mega-menu, cart drawer trigger, and search modal.
  3. Immersive Editorial Hero with high-resolution campaign photography and animated CTAs.
  4. Brand Introduction split-layout detailing cellular stratum corneum science.
  5. Curated Collection Showcase (Cleansing, Serums & Actives, Hydration & Crèmes, Sun Protection, Ritual Sets).
  6. Bestselling Formulations with star ratings, badges, quick add, and wishlist toggles.
  7. Interactive Skin Discovery CTA leading to the 2-minute diagnostic questionnaire.
  8. Scientific Ingredients Matrix (Triple Hyaluronic, Ceramides, USP Niacinamide, Ectoin).
  9. Editorial Campaign Banner with atmospheric laboratory visuals.
  10. Verified Customer Testimonials with sample demonstration badge.
  11. The Clinical Journal showcasing peer-reviewed investigations.
  12. Newsletter Dispatch Subscription with real database persistence.
  13. 5-Column Luxury Footer with trust badges and legal guarantees.

- **Shop Catalog & Semantic Discovery:**
  - Dynamic category, skin type, concern, and price range filtering.
  - Client-side instant sorting (Featured, Newest, Price: Low-to-High, Price: High-to-Low, Highest Rated).
  - Responsive mobile bottom filter drawer.
  - Search modal overlay with live query suggestions.

- **Product Detail Page (PDP):**
  - High-resolution gallery with thumbnail crossfades and packaging close-ups.
  - Multi-variant selector (e.g. Standard 30ml vs Grand Flacon 50ml vs Refill Pod) with live stock updates.
  - Quantity selector respecting warehouse inventory ceilings.
  - Instant "Buy Now" express checkout.
  - Tabbed scientific accordions: Benefits, Ingredients, Ritual Protocol, Skin Compatibility.
  - Customer review submission form submitting directly to the database.
  - Related formulation recommendations.

- **Shopping Bag & Multi-Step Checkout:**
  - Slide-out cart drawer with dynamic international free-shipping progress meter.
  - Promotional privilege code validation (`WELCOME15`, `ELORALUXE`).
  - Multi-step checkout (Contact &rarr; Destination &rarr; Courier Method &rarr; Payment Authorization).
  - Server-side price calculation and database stock decrements via atomic transactions.
  - Order Confirmation page with itemized breakdown and tracking carrier reference.

- **International Multi-Currency Support:**
  - Supported currencies: **USD ($)**, **GBP (£)**, **EUR (€)**, **CAD (CA$)**, **AUD (AU$)**, and **AED (AED )**.
  - Currency switcher with territory flag indicators and localized number formatting.
  - Country-specific tax calculation (UK 20% VAT, UAE 5% VAT, Canada 13% HST, US 8% avg).

---

## 3. Advanced AI Capabilities

### 1. AI Skin Discovery Diagnostic Engine (`/skin-discovery`)
- Multi-step questionnaire evaluating skin type, concerns, living climate, and ritual preferences.
- Algorithmic compatibility scoring eliminating incompatible formulas.
- Synthesizes a bespoke 4-step morning and evening ceremony (Cleanse &rarr; Treat &rarr; Hydrate &rarr; Protect).
- AI scientific explanation detailing cellular lipid restoration.
- 1-click "Add Entire Ritual to Bag" with automatic `WELCOME15` privilege application.

### 2. AI Skincare Concierge Chat Drawer (Storefront)
- Floating luxury button opening the conversational advisor.
- Grounded strictly on verified product archives and RAG knowledge documents.
- Automatically suggests matching catalog products with live prices and thumbnail links.
- Graceful deterministic fallback when offline or without external API keys.

### 3. AI Business Intelligence Assistant (Admin Dashboard)
- Natural language query interface for store executives and managers.
- Selects authorized read-only database query aggregation tools (never unrestricted raw SQL).
- Provides instant answers for revenue, AOV, top sellers, low stock alerts, and fulfillment velocity.

### 4. RAG Knowledge Center (`/admin/knowledge`)
- Ingestion pipeline storing verified formulation standards, shipping rules, and return policies.
- Semantic chunking for precise context injection.

---

## 4. Admin Management Dashboard (`/admin`)

- **Commercial Overview:** Real-time KPI revenue metrics, orders count, AOV, and low stock warnings.
- **Product Management:** Catalog table with variant counts and public links.
- **Order Management:** Fulfillment status changer (Processing &rarr; Shipped &rarr; Delivered &rarr; Cancelled) with tracking numbers.
- **Inventory Ledger:** Real-time stock audit trails and 1-click `+25` restock actions.
- **Promotional Discounts:** Active coupon tracking and usage limits.
- **Review Moderation:** Social proof verification and moderation.

### Demo Credentials

| Role | Email | Password | Access URL |
|---|---|---|---|
| **Administrator** | `admin@elora.luxury` | `Password123!` | `/admin` or `/account/login` |
| **Customer** | `sophia.vane@example.com` | `Password123!` | `/account/login` |

---

## 5. Quick Start & Local Execution

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- `pnpm` (recommended), `npm`, or `yarn`

### Setup Instructions

```bash
# 1. Install dependencies
pnpm install

# 2. Push database schema to local SQLite database (dev.db)
pnpm prisma db push

# 3. Seed database with luxury products, ingredients, reviews, and admin accounts
node prisma/seed.mjs

# 4. Start Next.js development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Environment Variables (`.env`)

```env
# Database Connection (SQLite for local dev, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Session Authentication
AUTH_SECRET="elora_luxury_super_secret_jwt_key_2026_beauty_science"

# Stripe Test Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sample_publishable_key_placeholder"
STRIPE_SECRET_KEY="sk_test_placeholder_secret_key_not_real"
STRIPE_WEBHOOK_SECRET="whsec_test_secret_for_webhook_signature_verification"

# AI Provider Configuration (Optional - has high-fidelity deterministic fallback)
GEMINI_API_KEY=""
AI_PRIMARY_PROVIDER="gemini"

# Store Configuration
NEXT_PUBLIC_STORE_NAME="ÉLORA"
NEXT_PUBLIC_STORE_TAGLINE="The Science of Beautiful Skin"
NEXT_PUBLIC_DEFAULT_CURRENCY="USD"
```

---

## 7. Automated Testing & Verification

Run the test suite:
```bash
node --test tests/commerce.test.mjs
```

**Verified Test Scenarios:**
- Currency exchange rate conversions across 6 international markets.
- Complimentary shipping thresholds calculation.
- Coupon percentage and fixed amount calculations.
- International destination tax calculation (UK, UAE, US, Canada).
- AI Skin Discovery compatibility scoring algorithm.

---

## 8. Sourcing & Legal Disclosures

- **Photographic Assets:** High-resolution editorial beauty assets curated from Unsplash under commercial license.
- **Clinical Statement:** All formulation claims, ingredient descriptions, and diagnostic consultations are intended for cosmetic skincare and aesthetic ceremonies.
- **Copyright:** © 2026 ÉLORA Haute Botanique. All rights reserved.

