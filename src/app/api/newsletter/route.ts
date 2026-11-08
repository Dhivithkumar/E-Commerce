import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({
        message: "You are already a valued recipient of the ÉLORA private dispatch.",
        status: "already_subscribed",
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: cleanEmail },
    });

    return NextResponse.json({
      message: "Subscription confirmed. Welcome to ÉLORA.",
      status: "subscribed",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ message: "Unable to process subscription at this time." }, { status: 500 });
  }
}

