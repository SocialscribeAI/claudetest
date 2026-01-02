/**
 * ADMIN CATEGORY DETAIL API - app/api/admin/categories/[id]/route.ts
 *
 * Purpose: Admin management of single category
 *
 * GET /api/admin/categories/[id]
 * - Get category details
 *
 * ---
 *
 * PUT /api/admin/categories/[id]
 * - Update category
 *
 * Request body:
 * {
 *   name?: string,
 *   nameHe?: string,
 *   slug?: string,
 *   icon?: string,
 *   description?: string,
 *   parentId?: string | null,
 *   isActive?: boolean
 * }
 *
 * Response:
 * - 200: { category: Category }
 * - 400: { error: "Slug already exists" }
 *
 * ---
 *
 * DELETE /api/admin/categories/[id]
 * - Delete category
 *
 * Query params:
 * - reassignTo?: string (category ID to move providers to)
 *
 * Response:
 * - 200: { success: true, movedProviders: number }
 * - 400: { error: "Category has providers" } (if no reassignTo)
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Implement admin get category
  return NextResponse.json({ category: null, id });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Implement admin update category
  return NextResponse.json({ message: "Not implemented", id }, { status: 501 });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Implement admin delete category
  return NextResponse.json({ message: "Not implemented", id }, { status: 501 });
}
