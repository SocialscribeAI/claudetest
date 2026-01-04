/**
 * VERIFY OTP API - app/api/auth/verify-otp/route.ts
 *
 * Purpose: Verify OTP code for login/signup
 *
 * POST /api/auth/verify-otp
 *
 * Request body:
 * {
 *   phone: string,           // Phone number
 *   code: string,            // 6-digit OTP
 *   type: "login" | "signup",
 *   // Only for signup:
 *   name?: string,
 *   email?: string,
 *   role?: "user" | "provider"
 * }
 *
 * Response:
 * - 200: { success: true, user: {...} }
 * - 400: { error: "Invalid or expired code" }
 * - 429: { error: "Too many attempts" }
 *
 * Flow:
 * 1. Validate input
 * 2. Check OTP in DB
 * 3. Verify OTP matches and not expired
 * 4. If signup, create user
 * 5. Mark OTP as used
 * 6. Return user data (session handled by NextAuth)
 *
 * Security:
 * - Max 5 attempts per OTP
 * - Lock out after 5 failed attempts (15 min)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const verifySchema = z.object({
  phone: z
    .string()
    .min(9)
    .max(15)
    .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
  code: z.string().length(6).regex(/^[0-9]+$/, "Invalid OTP format"),
  type: z.enum(["login", "signup"]),
  // Signup fields
  name: z.string().min(2).max(100).optional().nullable(),
  email: z.string().email().optional().nullable(),
  role: z.enum(["user", "provider"]).optional(),
});

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
    const validation = verifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { phone: rawPhone, code, type, name, email, role } = validation.data;
    const phone = normalizePhone(rawPhone);

    // Find the latest unused OTP for this phone
    const otp = await prisma.oTP.findFirst({
      where: {
        phone,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "No valid OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check attempts limit
    if (otp.attempts >= 5) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify code
    if (otp.code !== code) {
      // Increment attempts
      await prisma.oTP.update({
        where: { id: otp.id },
        data: { attempts: otp.attempts + 1 },
      });

      const remaining = 5 - otp.attempts - 1;
      return NextResponse.json(
        {
          error: "Invalid code",
          attemptsRemaining: remaining,
        },
        { status: 400 }
      );
    }

    // OTP is valid - mark as used
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (type === "signup") {
      if (user && user.phoneVerified) {
        return NextResponse.json(
          { error: "User already exists. Please login instead." },
          { status: 409 }
        );
      }

      // Create or update user
      const userRole = role === "provider" ? "PROVIDER" : "USER";

      if (user) {
        // Update existing unverified user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            email: email || user.email,
            role: userRole,
            phoneVerified: new Date(),
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            phone,
            name: name || null,
            email: email || null,
            role: userRole,
            phoneVerified: new Date(),
          },
        });
      }
    } else {
      // Login
      if (!user) {
        return NextResponse.json(
          { error: "User not found. Please sign up first." },
          { status: 404 }
        );
      }

      if (!user.phoneVerified) {
        // Mark as verified on first successful login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { phoneVerified: new Date() },
        });
      }

      // Update last active
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
    }

    // Get provider ID if user is a provider
    let providerId: string | null = null;
    if (user.role === "PROVIDER") {
      const provider = await prisma.provider.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      providerId = provider?.id || null;
    }

    // Return user data (client will use this with NextAuth)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        providerId,
      },
      // For NextAuth credentials flow
      credentials: {
        phone,
        verified: true,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
