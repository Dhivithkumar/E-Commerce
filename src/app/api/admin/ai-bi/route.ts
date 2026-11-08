import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ message: "Please provide an analytics inquiry." }, { status: 400 });
    }

    const lowerQuery = query.toLowerCase();

    // 1. Execute authorized read-only database aggregations
    const totalOrdersCount = await prisma.order.count();
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      include: { items: true },
    });

    const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // Top selling products by order count
    const itemSalesCount: Record<string, { name: string; qty: number; revenue: number }> = {};
    for (const order of paidOrders) {
      for (const item of order.items) {
        if (!itemSalesCount[item.productName]) {
          itemSalesCount[item.productName] = { name: item.productName, qty: 0, revenue: 0 };
        }
        itemSalesCount[item.productName].qty += item.quantity;
        itemSalesCount[item.productName].revenue += item.total;
      }
    }

    const topSelling = Object.values(itemSalesCount).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // Low stock items
    const lowStockVariants = await prisma.productVariant.findMany({
      where: { stock: { lte: 30 } },
      include: { product: { select: { name: true } } },
      orderBy: { stock: "asc" },
      take: 6,
    });

    // Orders by fulfillment status
    const unfulfilledCount = await prisma.order.count({ where: { fulfillmentStatus: "UNFULFILLED" } });
    const processingCount = await prisma.order.count({ where: { fulfillmentStatus: "PROCESSING" } });
    const shippedCount = await prisma.order.count({ where: { fulfillmentStatus: "SHIPPED" } });
    const deliveredCount = await prisma.order.count({ where: { fulfillmentStatus: "DELIVERED" } });

    // Aggregate summary for AI reasoning
    const metricsContext = {
      totalRevenueUSD: totalRevenue.toFixed(2),
      paidOrdersCount: paidOrders.length,
      averageOrderValueUSD: avgOrderValue.toFixed(2),
      topSellingProducts: topSelling,
      lowStockAlerts: lowStockVariants.map((v) => ({
        product: v.product.name,
        variant: v.title,
        stockRemaining: v.stock,
      })),
      fulfillmentBreakdown: {
        unfulfilled: unfulfilledCount,
        processing: processingCount,
        shipped: shippedCount,
        delivered: deliveredCount,
      },
    };

    // Use Gemini if available, or generate verified structured response
    const apiKey = process.env.GEMINI_API_KEY;
    let executiveAnswer = "";

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are the ÉLORA Executive Business Intelligence AI Assistant.
You have real-time access to our verified commerce database:
${JSON.stringify(metricsContext, null, 2)}

User Question: "${query}"

RULES:
1. State exact numbers from the metrics above. Never invent transactions or financial metrics.
2. Provide a 2-3 sentence executive answer with actionable business suggestions (e.g. restock thresholds, average order value expansion).
3. Be professional, concise, and analytical.`;

        const result = await model.generateContent(prompt);
        executiveAnswer = result.response.text();
      } catch (geminiError) {
        console.warn("AI BI Gemini call failed, using deterministic aggregation:", geminiError);
      }
    }

    if (!executiveAnswer) {
      if (lowerQuery.includes("revenue") || lowerQuery.includes("sales") || lowerQuery.includes("money")) {
        executiveAnswer = `Total realized revenue across verified paid transactions stands at $${metricsContext.totalRevenueUSD} across ${metricsContext.paidOrdersCount} orders. Our Average Order Value (AOV) is performing strongly at $${metricsContext.averageOrderValueUSD}.`;
      } else if (lowerQuery.includes("top") || lowerQuery.includes("bestseller") || lowerQuery.includes("popular")) {
        const topList = topSelling.map((t) => `${t.name} (${t.qty} units sold)`).join(", ");
        executiveAnswer = `Our top-performing formulation by volume is: ${topList || "The ÉLORA Signature Ritual Collection"}. This indicates strong customer adoption of complete regimen routines.`;
      } else if (lowerQuery.includes("stock") || lowerQuery.includes("inventory") || lowerQuery.includes("reorder")) {
        const lowList = lowStockVariants.map((v) => `${v.product.name} (${v.stock} units)`).join("; ");
        executiveAnswer = `Current inventory surveillance flags ${lowStockVariants.length} allocations requiring attention: ${lowList}. We recommend initiating atelier restock for batches under 30 units.`;
      } else if (lowerQuery.includes("order") || lowerQuery.includes("fulfillment") || lowerQuery.includes("shipping")) {
        executiveAnswer = `Fulfillment status breakdown: ${processingCount} orders in atelier compounding/processing, ${shippedCount} in transit with international couriers, and ${deliveredCount} delivered.`;
      } else {
        executiveAnswer = `Atelier Business Overview: Realized revenue is $${metricsContext.totalRevenueUSD} with an Average Order Value of $${metricsContext.averageOrderValueUSD}. Current top formulation is "${topSelling[0]?.name || "Cellular Renewal Concentrate"}".`;
      }
    }

    return NextResponse.json({
      success: true,
      query,
      answer: executiveAnswer,
      metrics: metricsContext,
    });
  } catch (error) {
    console.error("AI BI API error:", error);
    return NextResponse.json({ message: "Failed to process analytics query." }, { status: 500 });
  }
}

