/**
 * ADMIN CATEGORIES API - app/api/admin/categories/route.ts
 *
 * Purpose: Admin CRUD for categories
 *
 * GET /api/admin/categories
 * - List all categories (including inactive)
 *
 * Response:
 * {
 *   categories: [
 *     {
 *       id, slug, name, nameHe, icon, description,
 *       parentId, sortOrder, isActive,
 *       providerCount, createdAt, updatedAt
 *     }
 *   ]
 * }
 *
 * ---
 *
 * POST /api/admin/categories
 * - Create new category
 *
 * Request body:
 * {
 *   name: string,
 *   nameHe: string,
 *   slug: string,
 *   icon?: string,
 *   description?: string,
 *   parentId?: string,
 *   sortOrder?: number
 * }
 *
 * Response:
 * - 201: { category: Category }
 * - 400: { error: "Slug already exists" }
 *
 * ---
 *
 * PUT /api/admin/categories/reorder
 * - Reorder categories
 *
 * Request body:
 * { categoryIds: string[] } // Ordered list
 *
 * Response:
 * - 200: { success: true }
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement admin categories list
  return NextResponse.json({ categories: [] });
}

export async function POST(request: NextRequest) {
  // TODO: Implement admin create category
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function PUT(request: NextRequest) {
  // TODO: Implement admin reorder categories
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
