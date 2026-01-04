/**
 * PROVIDER INSIGHTS API - app/api/provider/me/insights/route.ts
 *
 * Purpose: Get analytics for own provider profile (auth required)
 *
 * GET /api/provider/me/insights
 *
 * Query parameters:
 * - period: "7d" | "30d" | "90d" (default: "30d")
 *
 * Returns:
 * - Views by day
 * - Leads by day and type
 * - Search appearances
 * - Category comparison
 * - Top cities
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// Helper to get date range
function getDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "30d":
    default:
      start.setDate(start.getDate() - 30);
  }

  return { start, end };
}

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Generate array of dates between start and end
function getDateArray(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Find provider
    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
      include: {
        categories: {
          select: { id: true },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const { start, end } = getDateRange(period);
    const dateArray = getDateArray(start, end);

    // Get previous period for trend calculation
    const periodDays = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - periodDays);

    // Fetch analytics data
    const [viewEvents, leadEvents, prevViewEvents, prevLeadEvents, searchEvents] =
      await Promise.all([
        // Current period views
        prisma.analyticsEvent.findMany({
          where: {
            providerId: provider.id,
            event: "provider_view",
            timestamp: { gte: start, lte: end },
          },
          select: { timestamp: true, city: true },
        }),
        // Current period leads
        prisma.clickLedger.findMany({
          where: {
            providerId: provider.id,
            timestamp: { gte: start, lte: end },
          },
          select: { timestamp: true, eventType: true },
        }),
        // Previous period views (for trend)
        prisma.analyticsEvent.count({
          where: {
            providerId: provider.id,
            event: "provider_view",
            timestamp: { gte: prevStart, lt: start },
          },
        }),
        // Previous period leads (for trend)
        prisma.clickLedger.count({
          where: {
            providerId: provider.id,
            timestamp: { gte: prevStart, lt: start },
          },
        }),
        // Search appearances
        prisma.analyticsEvent.findMany({
          where: {
            providerId: provider.id,
            event: "search_result_shown",
            timestamp: { gte: start, lte: end },
          },
          select: {
            properties: true,
          },
        }),
      ]);

    // Calculate views by day
    const viewsByDay = new Map<string, number>();
    dateArray.forEach((date) => viewsByDay.set(date, 0));

    viewEvents.forEach((event) => {
      const date = formatDate(event.timestamp);
      viewsByDay.set(date, (viewsByDay.get(date) || 0) + 1);
    });

    // Calculate leads by day and type
    const leadsByDay = new Map<string, number>();
    const leadsByType = { call: 0, whatsapp: 0, navigate: 0, website: 0 };
    dateArray.forEach((date) => leadsByDay.set(date, 0));

    leadEvents.forEach((event) => {
      const date = formatDate(event.timestamp);
      leadsByDay.set(date, (leadsByDay.get(date) || 0) + 1);

      const type = event.eventType as keyof typeof leadsByType;
      if (type in leadsByType) {
        leadsByType[type]++;
      }
    });

    // Calculate trends
    const totalViews = viewEvents.length;
    const totalLeads = leadEvents.length;
    const viewsTrend = prevViewEvents > 0
      ? Math.round(((totalViews - prevViewEvents) / prevViewEvents) * 100)
      : totalViews > 0 ? 100 : 0;
    const leadsTrend = prevLeadEvents > 0
      ? Math.round(((totalLeads - prevLeadEvents) / prevLeadEvents) * 100)
      : totalLeads > 0 ? 100 : 0;

    // Calculate top cities from views
    const cityMap = new Map<string, number>();
    viewEvents.forEach((event) => {
      if (event.city) {
        cityMap.set(event.city, (cityMap.get(event.city) || 0) + 1);
      }
    });

    const topCities = Array.from(cityMap.entries())
      .map(([city, views]) => ({ city, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Calculate search queries
    const queryMap = new Map<string, number>();
    searchEvents.forEach((event) => {
      const props = event.properties as Record<string, unknown>;
      const query = props?.query as string;
      if (query) {
        queryMap.set(query, (queryMap.get(query) || 0) + 1);
      }
    });

    const topQueries = Array.from(queryMap.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get category comparison
    const categoryIds = provider.categories.map((c) => c.id);
    let categoryAvgViews = 0;
    let categoryAvgLeads = 0;
    let percentile = 50; // Default to middle

    if (categoryIds.length > 0) {
      // Get all providers in same categories
      const categoryProviders = await prisma.provider.findMany({
        where: {
          categories: {
            some: { id: { in: categoryIds } },
          },
          status: "ACTIVE",
        },
        select: { id: true },
      });

      const providerIds = categoryProviders.map((p) => p.id);

      if (providerIds.length > 1) {
        // Get views for category
        const categoryViews = await prisma.analyticsEvent.groupBy({
          by: ["providerId"],
          where: {
            providerId: { in: providerIds },
            event: "provider_view",
            timestamp: { gte: start, lte: end },
          },
          _count: { id: true },
        });

        const categoryLeads = await prisma.clickLedger.groupBy({
          by: ["providerId"],
          where: {
            providerId: { in: providerIds },
            timestamp: { gte: start, lte: end },
          },
          _count: { id: true },
        });

        // Calculate averages
        const viewCounts = categoryViews.map((v) => v._count.id);
        const leadCounts = categoryLeads.map((l) => l._count.id);

        categoryAvgViews = viewCounts.length > 0
          ? Math.round(viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length)
          : 0;

        categoryAvgLeads = leadCounts.length > 0
          ? Math.round(leadCounts.reduce((a, b) => a + b, 0) / leadCounts.length)
          : 0;

        // Calculate percentile (based on views)
        const sortedViews = viewCounts.sort((a, b) => a - b);
        const myPosition = sortedViews.filter((v) => v < totalViews).length;
        percentile = Math.round((myPosition / sortedViews.length) * 100);
      }
    }

    return NextResponse.json({
      period: { start, end },
      views: {
        total: totalViews,
        trend: viewsTrend,
        byDay: dateArray.map((date) => ({
          date,
          count: viewsByDay.get(date) || 0,
        })),
      },
      leads: {
        total: totalLeads,
        trend: leadsTrend,
        byType: leadsByType,
        byDay: dateArray.map((date) => ({
          date,
          count: leadsByDay.get(date) || 0,
        })),
      },
      searchAppearances: {
        total: searchEvents.length,
        topQueries,
      },
      comparison: {
        categoryAvgViews,
        categoryAvgLeads,
        percentile,
      },
      topCities,
    });
  } catch (error) {
    console.error("Provider insights error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
