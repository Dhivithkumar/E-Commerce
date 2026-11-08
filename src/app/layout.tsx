import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AiChatDrawer from "@/components/ai/AiChatDrawer";

export const metadata: Metadata = {
  title: "ÉLORA — The Science of Beautiful Skin | Haute Skincare",
  description:
    "ÉLORA represents the intersection of dermal physiology, cold-pressed botanicals, and personalized beauty rituals. Discover high-potency cellular actives and personalized AI skincare discovery.",
  keywords: [
    "luxury skincare",
    "botanical formulations",
    "cellular renewal serum",
    "ceramide moisturizer",
    "mineral SPF 50",
    "dermatological science",
    "AI skincare diagnosis",
  ],
  authors: [{ name: "ÉLORA Haute Botanique" }],
  openGraph: {
    title: "ÉLORA — The Science of Beautiful Skin",
    description:
      "Award-winning skincare formulations engineered around the beauty of simplicity and physiological science.",
    url: "https://elora.luxury",
    siteName: "ÉLORA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "ÉLORA Luxury Skincare Rituals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-elora-ivory text-elora-charcoal min-h-screen flex flex-col selection:bg-elora-taupe selection:text-white">
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <AiChatDrawer />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
