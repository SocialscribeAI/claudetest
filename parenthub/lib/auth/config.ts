/**
 * AUTH CONFIGURATION - lib/auth/config.ts
 *
 * Purpose: NextAuth.js configuration
 *
 * Providers:
 * - Credentials (phone + OTP)
 * - Credentials (email + OTP)
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
 */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

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
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        // TODO: Implement OTP verification
        // 1. Look up OTP by phone
        // 2. Verify code matches and not expired
        // 3. Find or create user
        // 4. Return user
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore - custom fields
        token.role = user.role;
        // @ts-ignore
        token.providerId = user.providerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.providerId = token.providerId;
      }
      return session;
    },
  },
});
