/**
 * SIGNUP API - app/api/auth/signup/route.ts
 *
 * Purpose: Handle new user registration
 *
 * POST /api/auth/signup
 *
 * Request body:
 * {
 *   phone: string,      // Phone number with country code
 *   email?: string,     // Optional email
 *   name?: string,      // Optional name
 *   role: "user" | "provider"  // Account type
 * }
 *
 * Response:
 * - 200: { success: true, message: "OTP sent" }
 * - 400: { error: "Validation error" }
 * - 409: { error: "User already exists" }
 *
 * Flow:
 * 1. Validate input
 * 2. Check if user already exists
 * 3. Generate OTP
 * 4. Store OTP in Redis/DB with expiry
 * 5. Send OTP via SMS
 * 6. Return success
 *
 * Security:
 * - Rate limiting (5 requests per phone per hour)
 * - OTP expires in 5 minutes
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Implement signup
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
