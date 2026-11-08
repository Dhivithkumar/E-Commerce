import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { productId, authorName, rating, title, comment } = await req.json();

    if (!productId || !authorName || !rating || !title || !comment) {
      return NextResponse.json({ message: "Please supply all required review fields." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        authorName,
        rating: Math.max(1, Math.min(5, parseInt(rating, 10))),
        title,
        comment,
        isVerifiedPurchase: true,
        isApproved: true,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ message: "Failed to register review." }, { status: 500 });
  }
}

