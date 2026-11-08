import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { skinType, concerns, routinePreference, sensitivities, environment } = await req.json();

    if (!skinType || !concerns || concerns.length === 0) {
      return NextResponse.json({ message: "Please supply skin type and primary concerns." }, { status: 400 });
    }

    // 1. Fetch available products from database
    const allProducts = await prisma.product.findMany({
      where: { isArchived: false },
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isAvailable: true }, take: 1 },
        productIngredients: { include: { ingredient: true } },
      },
    });

    // 2. Deterministic Scoring Algorithm
    const scoredProducts = allProducts.map((product) => {
      let score = 0;
      const lowerSkinTypes = product.skinTypes.toLowerCase();
      const lowerConcerns = product.primaryConcerns.toLowerCase();

      // Match skin type
      if (lowerSkinTypes.includes(skinType.toLowerCase()) || lowerSkinTypes.includes("all")) {
        score += 30;
      }

      // Match concerns
      for (const concern of concerns) {
        if (lowerConcerns.includes(concern.toLowerCase())) {
          score += 25;
        }
      }

      // Preference bonus
      if (product.isBestseller) score += 10;
      if (product.isFeatured) score += 5;

      return { product, score };
    });

    // Sort by highest score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Pick top items according to routine steps: CLEANSE, TREAT, HYDRATE, PROTECT
    const selectedSteps: Record<string, any> = {};

    for (const item of scoredProducts) {
      const step = item.product.routineStep; // "CLEANSE", "TREAT", "HYDRATE", "PROTECT"
      if (!selectedSteps[step]) {
        selectedSteps[step] = item.product;
      }
    }

    // Format recommended products
    const routine = Object.entries(selectedSteps).map(([stepName, p]) => ({
      step: stepName,
      id: p.id,
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle,
      price: p.variants[0]?.price || p.basePrice,
      variantId: p.variants[0]?.id,
      volume: p.volume,
      imageUrl: p.images[0]?.url || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
      keyActives: p.productIngredients.map((pi: any) => pi.ingredient.name).slice(0, 2),
    }));

    // 3. AI Generated Explanation (via Gemini or deterministic template)
    let routineRationale = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are the Lead Dermatological Scientist at ÉLORA Luxury Skincare.
Diagnose a customer with:
- Skin Complexion: ${skinType}
- Target Concerns: ${concerns.join(", ")}
- Lifestyle/Climate: ${environment || "Urban Temperate"}
- Formulations Selected: ${routine.map((r) => r.name).join(", ")}

Write an elegant, 3-paragraph scientific consultation:
1. Explain the biological cellular state of their skin barrier.
2. How the chosen formulations synergize in sequence.
3. Realistic timeline for radiance and barrier replenishment.
Keep the tone luxurious, calm, and scientifically authoritative without medical diagnosis.`;

        const result = await model.generateContent(prompt);
        routineRationale = result.response.text();
      } catch (e) {
        console.warn("Gemini generation failed, using scientific fallback:", e);
      }
    }

    if (!routineRationale) {
      routineRationale = `Based on your ${skinType} complexion and focus on ${concerns.join(
        " and "
      )}, your stratum corneum requires physiological lipid support to reinforce cellular cohesive junctions.\n\nYour prescribed ceremony utilizes non-stripping botanical cleansers followed by signaling peptides and our biomimetic 3:1:1 lipid matrix. In this sequence, active molecules penetrate deeply to stimulate moisture reservoirs before being locked in with protective extremolytes.\n\nWithin 7 to 14 days of consistent morning and evening adherence, you will observe enhanced barrier suppleness, decreased trans-epidermal moisture loss, and a refined luminous finish.`;
    }

    // Save profile if user is authenticated
    const user = await getCurrentUser();
    if (user) {
      await prisma.skinProfile.create({
        data: {
          userId: user.id,
          skinType,
          primaryConcernsJson: JSON.stringify(concerns),
          routinePreferencesJson: JSON.stringify(routinePreference),
          sensitivitiesJson: JSON.stringify(sensitivities || []),
          resultsJson: JSON.stringify(routine),
        },
      });
    }

    return NextResponse.json({
      success: true,
      skinType,
      concerns,
      routine,
      rationale: routineRationale,
      suggestedCoupon: "WELCOME15",
    });
  } catch (error) {
    console.error("Skin discovery error:", error);
    return NextResponse.json({ message: "Failed to process skin diagnostic." }, { status: 500 });
  }
}

