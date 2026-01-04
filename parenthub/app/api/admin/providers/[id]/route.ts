/**
 * ADMIN PROVIDER DETAIL API - app/api/admin/providers/[id]/route.ts
 *
 * Purpose: Admin management of single provider
 *
 * GET - Full provider details with admin fields
 * PUT - Update provider and status
 * DELETE - Soft delete provider
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

// Update provider schema
const updateProviderSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  bio: z.string().max(500).optional().nullable(),
  phone: z.string().min(9).optional(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  serviceRadius: z.number().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  priceBand: z.enum(["BUDGET", "MIDRANGE", "PREMIUM"]).optional(),
  languages: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
  schedule: z.record(z.any()).optional().nullable(),
  isAvailable: z.boolean().optional(),
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]).optional(),
  isVerified: z.boolean().optional(),
  featuredRank: z.number().optional(),
  sponsorBadge: z.boolean().optional(),
  adminNotes: z.string().optional().nullable(),
  statusReason: z.string().optional(), // Reason for status change
});

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        categories: {
          select: { id: true, name: true, nameHe: true, slug: true, icon: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            createdAt: true,
            lastActiveAt: true,
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
            clickLedger: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Get analytics summary
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [viewsThisMonth, leadsThisMonth] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          providerId: id,
          event: "provider_view",
          timestamp: { gte: monthAgo },
        },
      }),
      prisma.clickLedger.count({
        where: {
          providerId: id,
          timestamp: { gte: monthAgo },
        },
      }),
    ]);

    // Calculate rating
    const allReviews = await prisma.review.findMany({
      where: { providerId: id, status: "APPROVED" },
      select: { rating: true },
    });

    const avgRating = allReviews.length > 0
      ? Math.round((allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length) * 10) / 10
      : null;

    return NextResponse.json({
      provider: {
        ...provider,
        rating: avgRating,
        stats: {
          totalReviews: provider._count.reviews,
          totalFavorites: provider._count.favorites,
          totalLeads: provider._count.clickLedger,
          viewsThisMonth,
          leadsThisMonth,
        },
      },
    });
  } catch (error) {
    console.error("Admin get provider error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    // Check provider exists
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateProviderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Build update object
    const updateData: Record<string, unknown> = {};

    // Copy simple fields
    const simpleFields = [
      "name", "description", "bio", "phone", "whatsapp", "email", "website",
      "address", "city", "lat", "lng", "serviceRadius", "services",
      "priceBand", "languages", "photos", "schedule", "isAvailable",
      "isVerified", "featuredRank", "sponsorBadge", "adminNotes"
    ];

    for (const field of simpleFields) {
      if (data[field as keyof typeof data] !== undefined) {
        updateData[field] = data[field as keyof typeof data];
      }
    }

    // Handle status change
    if (data.status !== undefined && data.status !== existingProvider.status) {
      updateData.status = data.status;

      if (data.status === "ACTIVE" && existingProvider.status === "PENDING") {
        updateData.approvedBy = authResult.userId;
        updateData.approvedAt = new Date();
      }

      // Log status change reason
      if (data.statusReason) {
        const currentNotes = existingProvider.adminNotes || "";
        const timestamp = new Date().toISOString();
        updateData.adminNotes = `${currentNotes}\n[${timestamp}] Status changed to ${data.status}: ${data.statusReason}`.trim();
      }
    }

    // Update provider
    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          select: { id: true, name: true, nameHe: true, slug: true },
        },
        user: {
          select: { id: true, email: true, phone: true, name: true },
        },
      },
    });

    // Update categories if provided
    if (data.categoryIds !== undefined) {
      await prisma.provider.update({
        where: { id },
        data: {
          categories: {
            set: data.categoryIds.map((catId) => ({ id: catId })),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("Admin update provider error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    // Check provider exists
    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.provider.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "SUSPENDED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete provider error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
