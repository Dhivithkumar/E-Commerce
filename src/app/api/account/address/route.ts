import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Address fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { firstName, lastName, street, apartment, city, state, postalCode, country, phone, isDefaultShipping } = body;

    if (!firstName || !lastName || !street || !city || !postalCode || !country) {
      return NextResponse.json({ message: "Please supply all required address fields." }, { status: 400 });
    }

    if (isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefaultShipping: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        street,
        apartment,
        city,
        state: state || "",
        postalCode,
        country: country.toUpperCase(),
        phone,
        isDefaultShipping: Boolean(isDefaultShipping),
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json({ message: "Failed to create address" }, { status: 500 });
  }
}

