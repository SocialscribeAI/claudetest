/**
 * LOGIN API - app/api/auth/login/route.ts
 *
 * Purpose: Send OTP to existing user for login
 *
 * POST /api/auth/login
 *
 * Request body:
 * {
 *   phone: string   // Phone number with country code
 * }
 *
 * Response:
 * - 200: { success: true, message: "OTP sent" }
 * - 400: { error: "Validation error" }
 * - 404: { error: "User not found" }
 * - 429: { error: "Too many requests" }
 *
 * Flow:
 * 1. Validate input
 * 2. Check if user exists
 * 3. Generate 6-digit OTP
 * 4. Store OTP in DB with 5-minute expiry
 * 5. Send OTP via SMS (stubbed for now)
 * 6. Return success
 *
 * Security:
 * - Rate limiting (5 requests per phone per hour)
 * - OTP expires in 5 minutes
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(9)
    .max(15)
    .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
});

// Rate limiting: track requests per phone
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(phone);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(phone, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count++;
  return true;
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Normalize phone number
function normalizePhone(phone: string): string {
  let normalized = phone.replace(/[\s\-\(\)]/g, "");
  if (normalized.startsWith("0")) {
    normalized = "+972" + normalized.slice(1);
  } else if (!normalized.startsWith("+")) {
    normalized = "+" + normalized;
  }
  return normalized;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { phone: rawPhone } = validation.data;
    const phone = normalizePhone(rawPhone);

    // Check rate limit
    if (!checkRateLimit(phone)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    // Delete any existing unused OTPs for this phone
    await prisma.oTP.deleteMany({
      where: {
        phone,
        usedAt: null,
      },
    });

    // Generate and store OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.oTP.create({
      data: {
        phone,
        code,
        expiresAt,
        attempts: 0,
      },
    });

    // TODO: Send SMS with OTP
    console.log(`[DEV] OTP for ${phone}: ${code}`);

    // In development, also return the code (REMOVE IN PRODUCTION!)
    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      phone,
      userName: user.name, // Show name for confirmation
      ...(isDev && { devCode: code }), // Only in development
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
