import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = (searchParams.get("code") || "").trim().toUpperCase();
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");

    if (!code) {
      return NextResponse.json({ valid: false, message: "Please supply a promotional code." });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, message: "Promotional privilege is invalid or has expired." });
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        message: `This privilege requires a minimum order of $${coupon.minOrderValue.toFixed(2)}.`,
      });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: "Promotional allocation limit has been reached." });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ valid: false, message: "Server error validating coupon." }, { status: 500 });
  }
}
