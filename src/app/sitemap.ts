import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://elora.luxury";

  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/collections/cleansing",
    "/collections/serums",
    "/collections/hydration",
    "/collections/sun-protection",
    "/collections/rituals",
    "/skin-discovery",
    "/philosophy",
    "/journal",
    "/ingredients",
    "/faq",
    "/shipping-policy",
    "/returns-policy",
    "/privacy",
    "/terms",
    "/sustainability",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const articles = await prisma.journalArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true },
    });

    const articleRoutes = articles.map((a) => ({
      url: `${baseUrl}/journal/${a.slug}`,
      lastModified: a.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}

