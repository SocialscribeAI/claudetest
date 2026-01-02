/**
 * PROVIDER PHOTOS API - app/api/provider/me/photos/route.ts
 *
 * Purpose: Manage provider's photos (auth required)
 *
 * POST /api/provider/me/photos
 * - Upload new photo(s)
 *
 * Request:
 * - Content-Type: multipart/form-data
 * - files: File[] (max 5 files, max 5MB each)
 *
 * Response:
 * - 200: { photos: [{ id, url, thumbnailUrl }] }
 * - 400: { error: "File too large" | "Invalid format" }
 * - 401: { error: "Not authenticated" }
 *
 * Processing:
 * 1. Validate file type (jpg, png, webp)
 * 2. Validate file size (max 5MB)
 * 3. Resize to standard sizes (thumbnail, medium, large)
 * 4. Upload to Cloudinary/S3
 * 5. Store URLs in database
 * 6. Return photo records
 *
 * ---
 *
 * DELETE /api/provider/me/photos
 * - Delete a photo
 *
 * Request body:
 * { photoId: string }
 *
 * Response:
 * - 200: { success: true }
 * - 404: { error: "Photo not found" }
 *
 * ---
 *
 * PUT /api/provider/me/photos
 * - Reorder photos
 *
 * Request body:
 * { photoIds: string[] } // Ordered list of photo IDs
 *
 * Response:
 * - 200: { success: true }
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Implement photo upload
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE(request: NextRequest) {
  // TODO: Implement photo delete
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function PUT(request: NextRequest) {
  // TODO: Implement photo reorder
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
