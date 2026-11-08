import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ reply: "How may I assist your skincare ritual today?" });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";
    const lowerQuery = latestUserMessage.toLowerCase();

    // 1. Retrieve real products from database for grounding
    const allProducts = await prisma.product.findMany({
      where: { isArchived: false },
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
        variants: { take: 1 },
      },
    });

    // 2. Retrieve verified RAG knowledge documents
    const knowledgeDocs = await prisma.knowledgeDocument.findMany({
      where: { isActive: true },
      take: 6,
    });

    // Determine relevant products based on query keywords
    const matchedProducts = allProducts.filter((p) => {
      const text = `${p.name} ${p.subtitle || ""} ${p.description} ${p.skinTypes} ${p.primaryConcerns}`.toLowerCase();
      const words = lowerQuery.split(" ").filter((w) => w.length > 3);
      return words.some((w) => text.includes(w));
    });

    // Products to return in response
    const recommendedProducts = (matchedProducts.length > 0 ? matchedProducts : allProducts.slice(0, 2)).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle || undefined,
      price: p.variants[0]?.price || p.basePrice,
      imageUrl: p.images[0]?.url || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
      variantId: p.variants[0]?.id,
    }));

    // Check if Gemini API Key is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const catalogSummary = allProducts
          .map(
            (p) =>
              `- ${p.name} ($${p.basePrice}): ${p.subtitle}. Suitable for: ${p.skinTypes}. Concerns: ${p.primaryConcerns}. Routine step: ${p.routineStep}.`
          )
          .join("\n");

        const knowledgeSummary = knowledgeDocs
          .map((k) => `[${k.category}] ${k.title}: ${k.content}`)
          .join("\n\n");

        const systemPrompt = `You are the ÉLORA Senior Skincare Concierge, an expert in dermatological science, cellular physiology, and haute botanical beauty rituals.
Brand Tagline: "The Science of Beautiful Skin."
Brand Tone: Sophisticated, scientific, empathetic, calm, and reassuring.

STRICT ACCURACY RULES:
1. ONLY recommend products that exist in our verified catalog:
${catalogSummary}
2. ONLY cite brand policies and science from our knowledge base:
${knowledgeSummary}
3. Never make unsupported medical claims or diagnose clinical skin conditions (eczema, cystic acne, melanoma). Always advise consulting a board-certified dermatologist for clinical conditions.
4. Keep replies concise, elegant, and directly helpful.

Customer Query: "${latestUserMessage}"`;

        const result = await model.generateContent(systemPrompt);
        const replyText = result.response.text();

        return NextResponse.json({
          reply: replyText,
          products: recommendedProducts.slice(0, 3),
        });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to deterministic RAG engine:", geminiError);
      }
    }

    // High-fidelity Deterministic RAG Fallback
    let fallbackReply = "";

    if (lowerQuery.includes("moisturizer") || lowerQuery.includes("cream") || lowerQuery.includes("crème") || lowerQuery.includes("dry")) {
      fallbackReply = `For deep hydration and barrier fortification, our Barrier Restorative Crème is engineered with a biomimetic 3:1:1 lipid complex (physiological ceramides, cholesterol, and free fatty acids) paired with 2% pure Ectoin.\n\nIt soothes irritation, locks in essential hydration for 48 hours without heavy pore occlusion, and accelerates native stratum corneum resilience.`;
    } else if (lowerQuery.includes("serum") || lowerQuery.includes("renewal") || lowerQuery.includes("peptide") || lowerQuery.includes("aging")) {
      fallbackReply = `Our acclaimed Cellular Renewal Concentrate combines 10% Triple Molecular Hyaluronic Acid with bio-identical signaling peptides. It targets fine line depth, restores dermal bounce, and reinforces moisture reservoirs across multiple skin tiers.`;
    } else if (lowerQuery.includes("sun") || lowerQuery.includes("spf") || lowerQuery.includes("protect")) {
      fallbackReply = `Our Invisible Silk Mineral Fluid SPF 50+ utilizes non-nano zinc oxide combined with antioxidant extremolytes. It glides on completely sheer across all complexions, leaves zero chalky cast, and shields against UVA/UVB, blue light, and urban airborne oxidants.`;
    } else if (lowerQuery.includes("shipping") || lowerQuery.includes("deliver") || lowerQuery.includes("international")) {
      fallbackReply = `ÉLORA provides complimentary carbon-neutral international courier shipping on qualifying orders over $100 USD (or equivalent in GBP, EUR, CAD, AUD, AED). Orders placed by 2:00 PM EST dispatch same business day with tracking supplied via email.`;
    } else if (lowerQuery.includes("return") || lowerQuery.includes("guarantee")) {
      fallbackReply = `Every ÉLORA creation is protected by our 30-Day Ritual Guarantee. If any formulation does not align harmoniously with your skin's unique needs, you may initiate a return within 30 days for a full refund.`;
    } else {
      fallbackReply = `At ÉLORA, every formulation is developed to support skin barrier integrity through physiological science. Based on your inquiry, we have highlighted our verified formulations below. Press any item to inspect its complete active ingredient profile and ritual ceremony.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      products: recommendedProducts.slice(0, 3),
    });
  } catch (error) {
    console.error("AI Chat handler error:", error);
    return NextResponse.json(
      {
        reply: "Our atelier archives are momentarily synchronizing. Please browse our curated collection or inquire about our clinical formulations.",
        products: [],
      },
      { status: 500 }
    );
  }
}

