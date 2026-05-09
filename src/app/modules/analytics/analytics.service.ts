import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../../lib/prisma";
import logger from "../../utils/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(
  prompt: string,
  options: { maxRetries?: number; baseDelayMs?: number } = {},
) {
  const { maxRetries = 3, baseDelayMs = 1000 } = options;
  const primaryModel = "gemini-2.5-flash";
  const fallbackModel = "gemini-2.0-flash";

  const attempt = async (modelName: string, isFallback: boolean) => {
    logger.info("Calling Gemini AI", { model: modelName, isFallback });
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  // Try primary model with retries
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await attempt(primaryModel, false);
    } catch (err: any) {
      const isOverloaded =
        err?.message?.includes("503 Service Unavailable") ||
        err?.status === 503 ||
        err?.statusCode === 503;

      if (!isOverloaded || i === maxRetries) {
        if (i === maxRetries) break;
        throw err;
      }

      const delay = baseDelayMs * Math.pow(2, i);
      logger.warn("Gemini overloaded (503). Retrying after delay...", {
        attempt: i + 1,
        maxRetries,
        delayMs: delay,
        model: primaryModel,
      });
      await sleep(delay);
    }
  }

  // Fallback model attempt
  try {
    logger.warn("Falling back to secondary model", { fallbackModel });
    return await attempt(fallbackModel, true);
  } catch (err: any) {
    logger.error("AI service unavailable after retries and fallback", {
      err: err.message,
      maxRetries,
    });
    throw new Error(
      `AI service is temporarily unavailable after ${maxRetries} retries and fallback. Please try again later.`,
    );
  }
}

const getAdminAiAnalyticsFromDB = async () => {
  logger.info("Generating AI analytics...");

  // ── 1. Fetch dashboard statistics via Prisma ──────────────────────────────

  const [totalProducts, totalRevenueResult, lowStockItems, allProducts] =
    await Promise.all([
      // Total product count
      prisma.product.count(),

      // Total revenue: sum of price from completed orders
      // Adjust the relation/field name to match your Order model
      prisma.orderItem.aggregate({
        _sum: { price: true },
        where: { order: { status: "COMPLETED" } },
      }),

      // Low stock: products with stockLevel <= 10
      prisma.product.findMany({
        where: { stockLevel: { lte: 10 } },
        select: {
          title: true,
          stockLevel: true,
          category: true,
        },
        orderBy: { stockLevel: "asc" },
      }),

      // Category distribution: since category is a plain string,
      // we fetch all products and group manually
      prisma.product.findMany({
        select: { category: true },
      }),
    ]);

  const totalRevenue = totalRevenueResult._sum.price ?? 0;

  // ── 2. Group category distribution manually ───────────────────────────────
  const categoryMap: Record<string, number> = {};
  for (const product of allProducts) {
    const cat = product.category ?? "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] ?? 0) + 1;
  }

  const categoryDistribution = Object.entries(categoryMap).map(
    ([category, productCount]) => ({ category, productCount }),
  );

  // ── 3. Build structured context payload for Gemini ────────────────────────
  const inventoryContext = {
    totalProducts,
    totalRevenue,
    lowStockItems: lowStockItems.map((p) => ({
      name: p.title, // mapped from title
      stockLevel: p.stockLevel,
      category: p.category ?? "Uncategorized",
    })),
    categoryDistribution,
  };

  // ── 4. Craft the Gemini prompt ────────────────────────────────────────────
  const prompt = `
You are a senior Business Analyst specializing in inventory management and retail operations.
Analyze the following real-time inventory and sales data from the Eco-Track system and provide
actionable strategic insights.

--- INVENTORY & SALES DATA ---
${JSON.stringify(inventoryContext, null, 2)}
------------------------------

Based on this data, provide a structured analysis in the following three sections.
Return ONLY valid JSON — no markdown, no code fences, no extra text.

{
  "businessHealthSummary": {
    "overallStatus": "<Healthy | At Risk | Critical>",
    "summary": "<2-3 sentence overview of the current business health>",
    "keyMetrics": {
      "totalProducts": <number>,
      "totalRevenue": <number>,
      "lowStockCount": <number>,
      "totalCategories": <number>
    }
  },
  "criticalInventoryAlerts": [
    {
      "severity": "<High | Medium | Low>",
      "productName": "<string>",
      "currentStock": <number>,
      "category": "<string>",
      "recommendation": "<specific restocking action>"
    }
  ],
  "salesGrowthSuggestions": [
    {
      "title": "<suggestion title>",
      "description": "<actionable 2-3 sentence strategy>",
      "expectedImpact": "<High | Medium | Low>",
      "timeframe": "<e.g. 1-2 weeks, 1 month>"
    }
  ]
}
`;

  // ── 5. Call Gemini AI (with retry + fallback) ─────────────────────────────
  const rawText = await generateWithRetry(prompt);

  // Strip any accidental markdown fences before parsing
  const cleanJson = rawText.replace(/```(?:json)?|```/g, "").trim();
  const aiInsights = JSON.parse(cleanJson);

  logger.info("AI analytics generated successfully");

  return {
    generatedAt: new Date().toISOString(),
    dataSnapshot: inventoryContext,
    aiInsights,
  };
};

const getStaffAnalyticsFromDB = async (staffId: string) => {
  logger.info("Generating Staff AI analytics...", { staffId });

  // ── 1. Fetch staff-specific data ──────────────────────────────────────────
  const [
    myOrders,
    totalSalesResult,
    recentOrders,
    topProductsSold,
    dailySalesThisWeek,
  ] = await Promise.all([
    // Total orders created by this staff
    prisma.order.count({
      where: { userId: staffId },
    }),

    // Total revenue from this staff's orders
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdById: staffId,
        status: "COMPLETED",
      },
    }),

    // Last 5 orders by this staff
    prisma.order.findMany({
      where: { userId: staffId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    }),

    // Top 5 products this staff sold most
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: { userId: staffId },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),

    // Daily sales count this week (last 7 days)
    prisma.order.findMany({
      where: {
        createdById: staffId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { createdAt: true, totalAmount: true },
    }),
  ]);

  // ── 2. Resolve product titles for top products ────────────────────────────
  const productIds = topProductsSold.map((t) => t.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, title: true, category: true },
  });

  const topProducts = topProductsSold.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productName: product?.title ?? "Unknown",
      category: product?.category ?? "Uncategorized",
      totalQuantitySold: item._sum.quantity ?? 0,
    };
  });

  // ── 3. Group daily sales by date ──────────────────────────────────────────
  const dailyMap: Record<string, { orders: number; revenue: number }> = {};
  for (const order of dailySalesThisWeek) {
    const date = order.createdAt.toISOString().split("T")[0];
    if (!dailyMap[date]) dailyMap[date] = { orders: 0, revenue: 0 };
    dailyMap[date].orders += 1;
    dailyMap[date].revenue += order.totalAmount ?? 0;
  }
  const dailySales = Object.entries(dailyMap)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // ── 4. Build context for Gemini ───────────────────────────────────────────
  const staffContext = {
    staffId,
    totalOrdersCreated: myOrders,
    totalRevenue: totalSalesResult._sum.totalAmount ?? 0,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      status: o.status,
      amount: o.totalAmount,
      date: o.createdAt,
    })),
    topProductsSold: topProducts,
    dailySalesThisWeek: dailySales,
  };

  // ── 5. Gemini prompt for Staff ────────────────────────────────────────────
  const prompt = `
You are a supportive Sales Performance Coach analyzing a staff member's individual sales data
from the Eco-Track inventory management system.

--- STAFF PERFORMANCE DATA ---
${JSON.stringify(staffContext, null, 2)}
------------------------------

Analyze this data and provide personalized insights. 
Return ONLY valid JSON — no markdown, no code fences, no extra text.

{
  "performanceSummary": {
    "performanceLevel": "<Excellent | Good | Average | Needs Improvement>",
    "summary": "<2-3 sentence personalized overview of this staff member's performance>",
    "keyMetrics": {
      "totalOrders": <number>,
      "totalRevenue": <number>,
      "avgOrderValue": <number>,
      "activeDaysThisWeek": <number>
    }
  },
  "strengths": [
    {
      "title": "<strength title>",
      "description": "<1-2 sentence description of what they are doing well>"
    }
  ],
  "improvementTips": [
    {
      "title": "<tip title>",
      "description": "<actionable 1-2 sentence tip to improve sales>",
      "priority": "<High | Medium | Low>"
    }
  ],
  "dailyGoalSuggestion": {
    "recommendedDailyOrders": <number>,
    "recommendedDailyRevenue": <number>,
    "reasoning": "<1-2 sentence explanation of why these targets make sense>"
  }
}
`;

  // ── 6. Call Gemini with retry ─────────────────────────────────────────────
  const rawText = await generateWithRetry(prompt);
  const cleanJson = rawText.replace(/```(?:json)?|```/g, "").trim();
  const aiInsights = JSON.parse(cleanJson);

  logger.info("Staff AI analytics generated successfully", { staffId });

  return {
    generatedAt: new Date().toISOString(),
    dataSnapshot: staffContext,
    aiInsights,
  };
};

export const analyticsService = {
  getAdminAiAnalyticsFromDB,
  getStaffAnalyticsFromDB,
};
