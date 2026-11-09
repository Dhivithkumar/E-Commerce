# 🚀 ÉLORA — Zero-Database Production Deployment Guide (Vercel & Render)

**You do NOT need to set up, provision, or connect any external database!**

ÉLORA includes a complete pre-seeded local database (`prisma/dev.db`) bundled right into the project. When you deploy, both **Vercel** and **Render** will run out of the box with zero external database configuration.

---

## ⚡ 1. Deploying to Vercel (Zero Database Required)

Deploy to Vercel in under 60 seconds:

### Step 1: Import Project in Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository: **`https://github.com/Dhivithkumar/E-Commerce.git`** (or import `Dhivithkumar/E-Commerce`).
4. Framework Preset will automatically detect **Next.js**.

### Step 2: Add Only 1 Environment Variable
Under **Environment Variables**, you only need to add:
- **`AUTH_SECRET`**: Any random text string (e.g. `elora_luxury_secret_session_key_2026`)

*(Leave all other fields default — do NOT connect any database).*

### Step 3: Click "Deploy"
1. Click **"Deploy"**.
2. Vercel will install dependencies, build the 34 static and dynamic routes with the pre-seeded catalog, and deploy!
3. Your storefront is live at your `.vercel.app` URL.

> **How Vercel Works with Zero External DB:**  
> Our serverless bridge in `src/lib/prisma.ts` automatically copies the bundled SQLite database to `/tmp/dev.db` in Vercel's runtime environment, allowing both fast catalog browsing and write operations (such as placing orders and client logins) without throwing read-only filesystem errors.

---

## ⚡ 2. Deploying to Render (Zero Database Required)

Deploy to Render on their **Free Tier** without provisioning any database:

### Option A: Using Render Blueprint (1-Click)
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **"New +"** in the top navigation → Select **"Blueprint"**.
3. Connect your repository: **`https://github.com/Dhivithkumar/E-Commerce.git`**.
4. Render will read `render.yaml` and create a single Web Service (`elora-luxury-skincare`) on the **Free** plan.
5. Click **"Apply"**. Render will build and launch your application!

### Option B: Manual Web Service on Render
1. In Render Dashboard, click **"New +"** → **"Web Service"**.
2. Connect `https://github.com/Dhivithkumar/E-Commerce.git`.
3. Set the following settings:
   - **Name:** `elora-luxury-skincare`
   - **Runtime:** `Node`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm start`
   - **Instance Type:** `Free`
4. In **Environment Variables**, add:
   - `AUTH_SECRET`: Any random string (e.g. `elora_secret_key_123456`)
5. Click **"Create Web Service"**.

---

## 🔑 Pre-Seeded Demonstration Logins

Once deployed, the store is already fully populated with 6 luxury formulations, reviews, and test accounts:

### Executive Administrator (Director)
- **URL:** `/admin` or `/account/login`
- **Email:** `admin@elora.luxury`
- **Password:** `Password123!`
- *Capabilities: Live inventory restocking, order fulfillment dispatch, discount coupon generator, and customer review moderation.*

### Customer Profile
- **URL:** `/account/login`
- **Email:** `sophia.vane@example.com`
- **Password:** `Password123!`
- *Capabilities: Order history archives, saved addresses, and skin discovery results.*

---

## 🌐 Optional: Connecting an External Database Later
If in the future you wish to scale to a managed cloud database (e.g., Supabase, Neon, or Render PostgreSQL), simply add the standard `DATABASE_URL="postgresql://..."` variable in Vercel or Render settings. The platform's automated engine will detect it and switch over with zero code changes!
