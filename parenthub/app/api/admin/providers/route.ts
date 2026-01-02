/**
 * ADMIN PROVIDERS API - app/api/admin/providers/route.ts
 *
 * Purpose: Admin management of all providers
 *
 * GET /api/admin/providers
 * - List all providers with filters
 *
 * Query parameters:
 * - status: "pending" | "active" | "suspended" | "all"
 * - category: string (category slug)
 * - city: string
 * - search: string (name, phone, email)
 * - sort: "created" | "name" | "views" | "leads"
 * - order: "asc" | "desc"
 * - page: number
 * - limit: number
 *
 * Response:
 * {
 *   providers: Provider[],
 *   total: number,
 *   page: number,
 *   totalPages: number,
 *   statusCounts: { pending: n, active: n, suspended: n }
 * }
 *
 * ---
 *
 * POST /api/admin/providers
 * - Create new provider (admin seeding)
 *
 * Request body:
 * { ...providerData }
 *
 * Response:
 * - 201: { provider: Provider }
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement admin providers list
  return NextResponse.json({ providers: [], total: 0 });
}

export async function POST(request: NextRequest) {
  // TODO: Implement admin create provider
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
