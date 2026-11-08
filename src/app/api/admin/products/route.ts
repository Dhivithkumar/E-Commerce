import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      subtitle,
      description,
      details,
      howToUse,
      categoryId,
      basePrice,
      compareAtPrice,
      volume,
      routineStep = "TREAT",
      skinTypes = "all,dry,combination,sensitive",
      primaryConcerns = "barrier,hydration",
      badge,
      imageUrl,
      stock = 50,
      variantTitle = "Standard Edition",
    } = body;

    if (!name || !slug || !categoryId || !basePrice || !description) {
      return NextResponse.json(
        { message: "Please supply all required product fields (name, slug, category, price, description)." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Check if slug exists
    const existing = await prisma.product.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ message: "A product with this URL slug already exists." }, { status: 409 });
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: cleanSlug,
          subtitle,
          description,
          details,
          howToUse,
          categoryId,
          basePrice: parseFloat(basePrice),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          volume: volume || "50 ml / 1.7 fl. oz.",
          routineStep,
          skinTypes,
          primaryConcerns,
          badge,
          images: {
            create: [
              {
                url:
                  imageUrl ||
                  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
                alt: name,
                isPrimary: true,
                order: 0,
              },
            ],
          },
          variants: {
            create: [
              {
                title: variantTitle,
                sku: `ELO-${cleanSlug.slice(0, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
                price: parseFloat(basePrice),
                compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                stock: parseInt(stock, 10) || 50,
                isAvailable: true,
                inventory: {
                  create: {
                    stockQuantity: parseInt(stock, 10) || 50,
                    reorderThreshold: 10,
                    stockMovements: {
                      create: {
                        type: "RESTOCK",
                        quantity: parseInt(stock, 10) || 50,
                        note: "Initial atelier compounding allocation",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        include: {
          category: true,
          variants: true,
          images: true,
        },
      });

      return product;
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ message: "Failed to create formulation." }, { status: 500 });
  }
}

