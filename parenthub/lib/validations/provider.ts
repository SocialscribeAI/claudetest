/**
 * PROVIDER VALIDATIONS - lib/validations/provider.ts
 *
 * Purpose: Zod schemas for provider data validation
 *
 * Schemas:
 * - providerCreateSchema: New provider signup
 * - providerUpdateSchema: Provider profile update
 * - providerSearchSchema: Search query params
 * - providerFilterSchema: Filter params
 *
 * Usage:
 * import { providerCreateSchema } from "@/lib/validations/provider";
 * const result = providerCreateSchema.safeParse(data);
 *
 * Integration:
 * - Used in API routes for request validation
 * - Used in forms for client-side validation
 */

import { z } from "zod";

/**
 * Phone number validation (Israeli format)
 */
const phoneSchema = z.string().regex(/^(\+972|0)[0-9]{9}$/, "Invalid phone number");

/**
 * Schedule schema for a single day
 */
const dayScheduleSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
}).nullable();

/**
 * Weekly schedule schema
 */
const weeklyScheduleSchema = z.object({
  sunday: dayScheduleSchema,
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
});

/**
 * Location schema
 */
const locationSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  serviceRadius: z.number().min(1).max(100).optional(),
});

/**
 * Provider creation schema
 */
export const providerCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  phone: phoneSchema,
  email: z.string().email().optional(),
  whatsapp: phoneSchema.optional(),
  categories: z.array(z.string()).min(1).max(5),
  priceBand: z.enum(["1", "2", "3"]),
  languages: z.array(z.string()).min(1),
  location: locationSchema,
});

/**
 * Provider update schema (all fields optional)
 */
export const providerUpdateSchema = providerCreateSchema.partial();

/**
 * Search query params schema
 */
export const providerSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().min(1).max(100).optional(),
  price: z.string().optional(),
  sort: z.enum(["distance", "rating", "featured"]).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
});

export type ProviderCreateInput = z.infer<typeof providerCreateSchema>;
export type ProviderUpdateInput = z.infer<typeof providerUpdateSchema>;
export type ProviderSearchParams = z.infer<typeof providerSearchSchema>;
