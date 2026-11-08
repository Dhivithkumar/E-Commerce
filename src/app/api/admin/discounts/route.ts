import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      include: { usages: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Admin coupons fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch coupons." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, description, discountType, discountValue, minOrderValue, usageLimit } = body;

    if (!code || !description || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { message: "Please supply code, description, discount type, and value." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if code exists
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ message: "A privilege with this code already exists." }, { status: 409 });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        isActive: true,
      },
      include: { usages: true },
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ message: "Failed to create coupon." }, { status: 500 });
  }
}

