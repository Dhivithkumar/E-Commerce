import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
        variants: { take: 1 },
      },
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
      variantId: p.variants[0]?.id,
      stock: p.variants[0]?.stock || 50,
    }));

    return NextResponse.json({ products: formatted });
  } catch (error) {
    console.error("All products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

