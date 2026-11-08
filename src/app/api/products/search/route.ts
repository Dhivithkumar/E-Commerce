import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    if (!q) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
        OR: [
          { name: { contains: q } },
          { subtitle: { contains: q } },
          { description: { contains: q } },
          { skinTypes: { contains: q } },
          { primaryConcerns: { contains: q } },
          { category: { name: { contains: q } } },
        ],
      },
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      take: 8,
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle,
      basePrice: p.basePrice,
      categoryName: p.category.name,
      imageUrl:
        p.images[0]?.url ||
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
    }));

    return NextResponse.json({ products: formatted });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search formulations" }, { status: 500 });
  }
}
