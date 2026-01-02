/**
 * ADMIN USERS API - app/api/admin/users/route.ts
 *
 * Purpose: Admin management of user accounts
 *
 * GET /api/admin/users
 * - List all users
 *
 * Query parameters:
 * - role: "user" | "provider" | "admin" | "all"
 * - status: "active" | "suspended" | "all"
 * - search: string (name, email, phone)
 * - sort: "created" | "name" | "lastActive"
 * - order: "asc" | "desc"
 * - page: number
 * - limit: number
 *
 * Response:
 * {
 *   users: [
 *     {
 *       id, name, email, phone,
 *       role, status,
 *       providerId?: string,
 *       createdAt, lastActiveAt,
 *       reviewCount, favoriteCount
 *     }
 *   ],
 *   total: number,
 *   page: number
 * }
 *
 * ---
 *
 * PUT /api/admin/users/[id]
 * - Update user (role, status)
 *
 * Request body:
 * {
 *   role?: "user" | "provider" | "admin",
 *   status?: "active" | "suspended"
 * }
 *
 * Response:
 * - 200: { user: User }
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement admin users list
  return NextResponse.json({ users: [], total: 0 });
}
