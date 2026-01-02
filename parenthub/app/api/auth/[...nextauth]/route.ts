/**
 * NEXTAUTH API ROUTE - app/api/auth/[...nextauth]/route.ts
 *
 * Purpose: NextAuth.js authentication handler
 *
 * Features:
 * - Handles all NextAuth routes (/api/auth/*)
 * - Session management
 * - JWT token handling
 * - Callback URLs
 *
 * Auth providers configured:
 * - Credentials (phone + OTP)
 * - Credentials (email + OTP)
 * - (Future: Google, Apple)
 *
 * Callbacks:
 * - jwt: Add user role and provider status to token
 * - session: Expose role and provider status in session
 *
 * Database:
 * - Uses Prisma adapter for user storage
 *
 * Configuration:
 * - See lib/auth/config.ts for full NextAuth config
 */

import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;
