/**
 * SESSION UTILITIES - lib/auth/session.ts
 *
 * Purpose: Server-side session helpers
 *
 * Functions:
 * - getSession: Get current session (server components)
 * - requireAuth: Require authentication (throws if not)
 * - requireRole: Require specific role (throws if not)
 * - requireProvider: Require provider role
 * - requireAdmin: Require admin role
 *
 * Usage:
 * // In server component or API route
 * const session = await getSession();
 * const user = await requireAuth(); // throws if not authenticated
 * const admin = await requireAdmin(); // throws if not admin
 *
 * Types:
 * - Session: NextAuth session with custom fields
 * - User: User with role and providerId
 */

import { auth } from "./config";
import { redirect } from "next/navigation";

export type UserRole = "USER" | "PROVIDER" | "ADMIN";

export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  providerId?: string;
}

/**
 * Get current session
 */
export async function getSession() {
  return auth();
}

/**
 * Get session or redirect to login
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user as SessionUser;
}

/**
 * Require specific role or redirect
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect("/");
  }
  return user;
}

/**
 * Require provider role
 */
export async function requireProvider() {
  const user = await requireAuth();
  if (user.role !== "PROVIDER" || !user.providerId) {
    redirect("/");
  }
  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole("ADMIN");
}
