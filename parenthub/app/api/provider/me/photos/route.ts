/**
 * PROVIDER PHOTOS API - app/api/provider/me/photos/route.ts
 *
 * Purpose: Manage provider's photos (auth required)
 *
 * POST /api/provider/me/photos
 * - Upload new photo(s) via base64 or URL
 *
 * DELETE /api/provider/me/photos
 * - Delete a photo by URL
 *
 * PUT /api/provider/me/photos
 * - Reorder photos
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Upload schema - accepting URLs for now (actual file upload would use FormData)
const uploadSchema = z.object({
  photos: z.array(z.string().url()).min(1).max(5),
});

const deleteSchema = z.object({
  photoUrl: z.string().url(),
});

const reorderSchema = z.object({
  photos: z.array(z.string().url()),
});

export async function POST(request: NextRequest) {
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
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = uploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { photos: newPhotos } = validation.data;

    // Check max photos limit (10 total)
    const currentCount = provider.photos.length;
    if (currentCount + newPhotos.length > 10) {
      return NextResponse.json(
        { error: `Maximum 10 photos allowed. You have ${currentCount} photos.` },
        { status: 400 }
      );
    }

    // Add new photos to the end
    const updatedPhotos = [...provider.photos, ...newPhotos];

    // Update provider
    await prisma.provider.update({
      where: { id: provider.id },
      data: { photos: updatedPhotos },
    });

    return NextResponse.json({
      success: true,
      photos: updatedPhotos,
      message: `${newPhotos.length} photo(s) added successfully`,
    });
  } catch (error) {
    console.error("Upload photos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = deleteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { photoUrl } = validation.data;

    // Check if photo exists
    if (!provider.photos.includes(photoUrl)) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    // Remove photo
    const updatedPhotos = provider.photos.filter((p) => p !== photoUrl);

    // Update provider
    await prisma.provider.update({
      where: { id: provider.id },
      data: { photos: updatedPhotos },
    });

    // TODO: Delete from cloud storage (Cloudinary/S3)

    return NextResponse.json({
      success: true,
      photos: updatedPhotos,
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = reorderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { photos: reorderedPhotos } = validation.data;

    // Validate that all photos in the reorder exist
    const existingSet = new Set(provider.photos);
    const reorderedSet = new Set(reorderedPhotos);

    if (existingSet.size !== reorderedSet.size) {
      return NextResponse.json(
        { error: "Photo count mismatch" },
        { status: 400 }
      );
    }

    for (const photo of reorderedPhotos) {
      if (!existingSet.has(photo)) {
        return NextResponse.json(
          { error: "Invalid photo in reorder list" },
          { status: 400 }
        );
      }
    }

    // Update provider with new order
    await prisma.provider.update({
      where: { id: provider.id },
      data: { photos: reorderedPhotos },
    });

    return NextResponse.json({
      success: true,
      photos: reorderedPhotos,
    });
  } catch (error) {
    console.error("Reorder photos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
