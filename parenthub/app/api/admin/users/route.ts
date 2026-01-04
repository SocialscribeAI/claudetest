/**
 * ADMIN USERS API - app/api/admin/users/route.ts
 *
 * Purpose: Admin management of user accounts
 *
 * GET - List all users with filters
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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

    // Parse query params
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "created";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    // Build where clause
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (role !== "all") {
      where.role = role.toUpperCase() as "USER" | "PROVIDER" | "ADMIN";
    }

    if (status === "suspended") {
      where.deletedAt = { not: null };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    // Build orderBy
    let orderBy: Prisma.UserOrderByWithRelationInput = {};
    switch (sort) {
      case "name":
        orderBy = { name: order as "asc" | "desc" };
        break;
      case "lastActive":
        orderBy = { lastActiveAt: order as "asc" | "desc" };
        break;
      case "created":
      default:
        orderBy = { createdAt: order as "asc" | "desc" };
        break;
    }

    // Get users with pagination
    const [users, total, roleCounts] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          provider: {
            select: { id: true, name: true, status: true },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
      prisma.user.groupBy({
        by: ["role"],
        where: { deletedAt: null },
        _count: { id: true },
      }),
    ]);

    // Format role counts
    const counts = {
      user: 0,
      provider: 0,
      admin: 0,
    };
    roleCounts.forEach((rc) => {
      counts[rc.role.toLowerCase() as keyof typeof counts] = rc._count.id;
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      reviewCount: user._count.reviews,
      favoriteCount: user._count.favorites,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    }));

    return NextResponse.json({
      users: formattedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      roleCounts: counts,
    });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
