# 🚀 ÉLORA — Production Deployment Guide (Vercel & Render)

This document provides step-by-step instructions for deploying the **ÉLORA Luxury Beauty & E-Commerce Platform** to **Vercel** and **Render**.

---

## 🏗️ Architecture Overview

- **Framework:** Next.js 14 App Router (React 18, TypeScript, Tailwind CSS)
- **Database Layer:** Prisma ORM 5 with unified dual-engine compatibility (`scripts/db-prep.mjs`)
  - **Local:** SQLite (`file:./dev.db`)
  - **Cloud Production:** PostgreSQL (Neon, Supabase, Vercel Postgres, or Render Postgres)
- **Authentication:** Custom JWT-based cookie sessions with bcrypt password hashing
- **Payments:** Stripe Checkout & Webhooks
- **AI Engine:** Google Gemini RAG with deterministic botanical archive fallback

---

## Part 1: Deploying to Vercel (Recommended for Next.js)

Vercel provides native edge hosting, automatic SSL, global CDN asset delivery, and instant CI/CD for Next.js.

### Step 1: Import Your Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository: `https://github.com/Dhivithkumar/E-Commerce.git`.
4. Ensure **Framework Preset** is set to `Next.js`.
5. Root directory: `./` (leave default).

### Step 2: Configure Production Database (Vercel Postgres / Neon / Supabase)
Because Vercel functions run in serverless, read-only containers, a persistent PostgreSQL database is required for production order processing, accounts, and reviews:

- **Option A (Vercel Postgres - 1 Click):**
  1. In your Vercel Project view, go to the **Storage** tab.
  2. Click **Create Database** → select **Postgres (powered by Neon)**.
  3. Click **Connect to Project**. Vercel will automatically inject `DATABASE_URL` and `POSTGRES_URL` into your environment variables!

- **Option B (External Postgres - Supabase, Neon, or Render Postgres):**
  1. Create a free PostgreSQL instance on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Render](https://render.com).
  2. Copy your connection URI (e.g. `postgresql://user:password@host/database?sslmode=require`).
  3. In Vercel Project Settings → **Environment Variables**, add:
     - `DATABASE_URL`: your PostgreSQL connection string.

### Step 3: Add Essential Environment Variables
In Vercel's **Environment Variables** section, add the following:

| Variable | Value / Description | Required? |
|---|---|---|
| `DATABASE_URL` | Your PostgreSQL connection URI | **Yes** |
| `AUTH_SECRET` | A secure random 32+ character string (e.g., `elora_prod_secret_auth_token_982347219`) | **Yes** |
| `NEXT_PUBLIC_STORE_NAME` | `ÉLORA` | No (default set) |
| `NEXT_PUBLIC_STORE_TAGLINE` | `The Science of Beautiful Skin` | No (default set) |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | `USD` | No (default set) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (`pk_test_...`) | Optional (mock fallback active) |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...`) | Optional (mock fallback active) |
| `GEMINI_API_KEY` | Your Google Gemini API key | Optional (RAG literature fallback active) |

### Step 4: Deploy
1. Click **"Deploy"**.
2. The automated build pipeline runs `node scripts/db-prep.mjs && next build`:
   - Prisma automatically converts to PostgreSQL provider.
   - Pushes schema and establishes indexes via `prisma db push`.
   - Automatically seeds all 6 luxury products, 4 categories, verified reviews, and customer accounts.
   - Pre-renders all 34 routes statically.
3. Your live production URL (e.g. `https://e-commerce-elora.vercel.app`) is now online!

---

## Part 2: Deploying to Render (render.com)

Render allows long-running Node.js server instances and managed PostgreSQL databases.

### Method A: 1-Click Blueprint Deployment (Automated with `render.yaml`)

This repository includes a pre-configured `render.yaml` file that automatically provisions both the PostgreSQL database and the Web Service together.

1. Log in to [Render](https://dashboard.render.com).
2. Click **"New +"** in the top navigation → Select **"Blueprint"**.
3. Connect your GitHub repository: `https://github.com/Dhivithkumar/E-Commerce.git`.
4. Render will read `render.yaml` and display:
   - **Service:** `elora-luxury-skincare` (Node Web Service)
   - **Database:** `elora-postgres` (Managed PostgreSQL Instance)
5. Click **"Apply"**.
6. Render will:
   - Provision the managed PostgreSQL database.
   - Automatically bind `DATABASE_URL` between the database and web service.
   - Run `pnpm install && pnpm run build`.
   - Seed the catalog and launch `pnpm start`.
7. Once the build completes, click the generated `.onrender.com` link to visit your store!

---

### Method B: Manual Service Deployment on Render

If you prefer to configure the services manually:

#### Step 1: Create PostgreSQL Database on Render
1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**.
2. Name: `elora-postgres`
3. Database Name: `elora`
4. User: `elora_user`
5. Plan: **Free** (or Starter)
6. Click **"Create Database"**.
7. Once created, copy the **Internal Database URL** (if deploying the web service on Render) or **External Database URL**.

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**.
2. Connect `https://github.com/Dhivithkumar/E-Commerce.git`.
3. Configuration:
   - **Name:** `elora-luxury-skincare`
   - **Runtime:** `Node`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm start`
   - **Plan:** Free / Starter
4. In **Environment Variables**, add:
   - `DATABASE_URL`: Paste the PostgreSQL URL from Step 1.
   - `AUTH_SECRET`: Generate a random 32+ character string.
   - `NODE_ENV`: `production`
5. Click **"Create Web Service"**.

---

## 🔑 Default Seed Accounts & Credentials

Once deployed, the database is pre-seeded with verified test accounts:

### Executive Administrator (Full Atelier Control)
- **URL:** `/admin` or `/account/login`
- **Email:** `admin@elora.luxury`
- **Password:** `Password123!`
- **Capabilities:** Live inventory restocking, AI business intelligence, order fulfillment dispatch, discount coupon generator, and customer review moderation.

### Verified Client Profile (Sample Customer)
- **URL:** `/account/login`
- **Email:** `sophia.vane@example.com`
- **Password:** `Password123!`
- **Capabilities:** Past order history, saved addresses, saved skin discovery diagnostics.

---

## 🧪 Post-Deployment Verification Checklist

1. [ ] **Storefront:** Visit homepage and verify high-resolution imagery, hero banners, and Section 4.12 Instagram/Atelier Visual Grid.
2. [ ] **Catalog & Filter:** Navigate to `/shop` and filter by category (Serums, Crèmes, Cleansers, Sun Care).
3. [ ] **Product Detail:** Open `/shop/cellular-renewal-concentrate` and verify variant selector, ingredient list, and 30-Day Ritual Guarantee.
4. [ ] **Cart & Currency:** Switch currency (USD, GBP, EUR, CAD, AUD, AED) in the navbar and add an item to the cart drawer.
5. [ ] **Skin Discovery:** Complete the 4-step diagnostic at `/skin-discovery` and add recommended routine with code `WELCOME15`.
6. [ ] **Checkout:** Complete a test checkout protocol at `/checkout` and view the generated `/checkout/confirmation/[orderNumber]`.
7. [ ] **Admin Portal:** Sign in as `admin@elora.luxury` at `/admin` and confirm live analytics, orders, and inventory tables.

