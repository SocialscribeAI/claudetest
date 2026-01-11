/**
 * ADMIN ANALYTICS API - app/api/admin/analytics/route.ts
 *
 * Purpose: Platform-wide analytics for admin
 *
 * GET - Get overview stats and trends
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// Helper to check admin role
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return { error: "Admin access required", status: 403 };
  }

  return { userId: session.user.id };
}

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

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Generate array of dates
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
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const { start, end } = getDateRange(period);
    const dateArray = getDateArray(start, end);

    // Get overview stats
    const [
      totalProviders,
      activeProviders,
      pendingProviders,
      totalUsers,
      newUsersThisPeriod,
      totalSearches,
      totalLeads,
      pendingReviews,
    ] = await Promise.all([
      prisma.provider.count({ where: { deletedAt: null } }),
      prisma.provider.count({ where: { status: "ACTIVE", deletedAt: null } }),
      prisma.provider.count({ where: { status: "PENDING", deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({
        where: { createdAt: { gte: start }, deletedAt: null },
      }),
      prisma.analyticsEvent.count({
        where: { event: "search", timestamp: { gte: start } },
      }),
      prisma.clickLedger.count({
        where: { timestamp: { gte: start } },
      }),
      prisma.review.count({
        where: { status: "PENDING" },
      }),
    ]);

    // Get trends data
    const [searchEvents, leadEvents, signupEvents] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: {
          event: "search",
          timestamp: { gte: start, lte: end },
        },
        select: { timestamp: true },
      }),
      prisma.clickLedger.findMany({
        where: {
          timestamp: { gte: start, lte: end },
        },
        select: { timestamp: true },
      }),
      prisma.user.findMany({
        where: {
          createdAt: { gte: start, lte: end },
        },
        select: { createdAt: true },
      }),
    ]);

    // Aggregate by day
    const searchesByDay = new Map<string, number>();
    const leadsByDay = new Map<string, number>();
    const signupsByDay = new Map<string, number>();

    dateArray.forEach((date) => {
      searchesByDay.set(date, 0);
      leadsByDay.set(date, 0);
      signupsByDay.set(date, 0);
    });

    searchEvents.forEach((e: { timestamp: Date }) => {
      const date = formatDate(e.timestamp);
      searchesByDay.set(date, (searchesByDay.get(date) || 0) + 1);
    });

    leadEvents.forEach((e: { timestamp: Date }) => {
      const date = formatDate(e.timestamp);
      leadsByDay.set(date, (leadsByDay.get(date) || 0) + 1);
    });

    signupEvents.forEach((e: { createdAt: Date }) => {
      const date = formatDate(e.createdAt);
      signupsByDay.set(date, (signupsByDay.get(date) || 0) + 1);
    });

    // Get top providers by views
    const topByViews = await prisma.analyticsEvent.groupBy({
      by: ["providerId"],
      where: {
        event: "provider_view",
        timestamp: { gte: start },
        providerId: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    // Get provider details
    type GroupByResult = { providerId: string | null; _count: { id: number } };
    const topProviderIds = topByViews
      .filter((p: GroupByResult) => p.providerId)
      .map((p: GroupByResult) => p.providerId as string);

    const topProviders = await prisma.provider.findMany({
      where: { id: { in: topProviderIds } },
      select: { id: true, name: true, city: true },
    });

    type ProviderInfo = { id: string; name: string; city: string };
    const topProvidersWithViews = topByViews.map((p: GroupByResult) => ({
      provider: topProviders.find((tp: ProviderInfo) => tp.id === p.providerId),
      views: p._count.id,
    })).filter((p: { provider: ProviderInfo | undefined; views: number }) => p.provider);

    // Get coverage by city
    const coverageByCity = await prisma.provider.groupBy({
      by: ["city"],
      where: { status: "ACTIVE", deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    // Get coverage by category
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { providers: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    type CategoryWithCount = {
      id: string;
      name: string;
      nameHe: string | null;
      _count: { providers: number };
    };
    type CategoryResult = { id: string; name: string; nameHe: string | null; count: number };
    const coverageByCategory = categories.map((cat: CategoryWithCount): CategoryResult => ({
      id: cat.id,
      name: cat.name,
      nameHe: cat.nameHe,
      count: cat._count.providers,
    })).sort((a: CategoryResult, b: CategoryResult) => b.count - a.count);

    return NextResponse.json({
      overview: {
        totalProviders,
        activeProviders,
        pendingProviders,
        totalUsers,
        newUsersThisPeriod,
        totalSearches,
        totalLeads,
        pendingReviews,
      },
      trends: {
        searches: dateArray.map((date) => ({
          date,
          count: searchesByDay.get(date) || 0,
        })),
        leads: dateArray.map((date) => ({
          date,
          count: leadsByDay.get(date) || 0,
        })),
        signups: dateArray.map((date) => ({
          date,
          count: signupsByDay.get(date) || 0,
        })),
      },
      topProviders: topProvidersWithViews,
      coverageByCity: coverageByCity.map((c: { city: string; _count: { id: number } }) => ({
        city: c.city,
        count: c._count.id,
      })),
      coverageByCategory,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
