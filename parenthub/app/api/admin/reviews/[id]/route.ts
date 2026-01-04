/**
 * ADMIN REVIEW MODERATION API - app/api/admin/reviews/[id]/route.ts
 *
 * Purpose: Admin moderation of reviews
 *
 * GET - Get full review details
 * PUT - Moderate (approve/reject)
 * DELETE - Delete permanently
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

// Moderation schema
const moderateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().optional(),
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

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            _count: {
              select: { reviews: true },
            },
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      review: {
        ...review,
        user: {
          ...review.user,
          reviewCount: review.user._count.reviews,
        },
      },
    });
  } catch (error) {
    console.error("Admin get review error:", error);
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

    // Check review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = moderateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { status, reason } = validation.data;

    // Require reason for rejection
    if (status === "REJECTED" && !reason) {
      return NextResponse.json(
        { error: "Reason required for rejection" },
        { status: 400 }
      );
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        status,
        moderatedBy: authResult.userId,
        moderatedAt: new Date(),
        moderationReason: reason || null,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        provider: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Admin moderate review error:", error);
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

    // Check review exists
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Delete permanently
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
