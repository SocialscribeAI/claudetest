/**
 * AUTH CONFIGURATION - lib/auth/config.ts
 *
 * Purpose: NextAuth.js configuration
 *
 * Providers:
 * - Credentials (phone + OTP verified flag)
 * - (Future: Google, Apple)
 *
 * Callbacks:
 * - jwt: Add role and providerId to token
 * - session: Expose role and providerId
 *
 * Pages:
 * - signIn: /login
 * - signUp: /signup
 * - error: /login?error=
 *
 * Session:
 * - Strategy: JWT
 * - Max age: 30 days
 *
 * Events:
 * - signIn: Log analytics
 * - signOut: Log analytics
 *
 * Flow:
 * 1. User calls /api/auth/login or /api/auth/signup to get OTP
 * 2. User calls /api/auth/verify-otp to verify OTP
 * 3. verify-otp returns verified=true
 * 4. Client calls NextAuth signIn with phone and verified=true
 * 5. NextAuth looks up user and creates session
 */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
    providerId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      providerId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    providerId?: string | null;
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        verified: { label: "Verified", type: "text" },
      },
      async authorize(credentials) {
        // This is called AFTER the client has verified OTP via /api/auth/verify-otp
        // The verified flag indicates OTP was already verified
        if (credentials?.verified !== "true") {
          return null;
        }

        const phone = credentials.phone as string;
        if (!phone) {
          return null;
        }

        // Find user by phone
        const user = await prisma.user.findUnique({
          where: { phone },
          include: {
            provider: {
              select: { id: true },
            },
          },
        });

        if (!user || !user.phoneVerified) {
          return null;
        }

        // Update last active
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        // Return user for session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          providerId: user.provider?.id || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.providerId = user.providerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.providerId = token.providerId;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Log analytics event
      try {
        await prisma.analyticsEvent.create({
          data: {
            event: "auth_signin",
            properties: { userId: user.id },
            sessionId: `auth_${Date.now()}`,
            userId: user.id,
            timestamp: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to log signin event:", error);
      }
    },
    async signOut(message) {
      // Log analytics event
      try {
        const token = "token" in message ? message.token : null;
        const userId = token?.id as string | undefined;
        if (userId) {
          await prisma.analyticsEvent.create({
            data: {
              event: "auth_signout",
              properties: { userId },
              sessionId: `auth_${Date.now()}`,
              userId,
              timestamp: new Date(),
            },
          });
        }
      } catch (error) {
        console.error("Failed to log signout event:", error);
      }
    },
  },
});
