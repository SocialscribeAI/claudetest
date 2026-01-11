/**
 * ANALYTICS EVENT API - app/api/analytics/event/route.ts
 *
 * Purpose: Track user analytics events
 *
 * POST /api/analytics/event
 *
 * Tracks events like:
 * - app_open, search_submit, profile_view
 * - call_click, whatsapp_click, navigate_click
 * - favorite_add, favorite_remove
 * - review_submit, etc.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Valid event types
const validEvents = [
  "app_open",
  "search_submit",
  "search_zero_results",
  "results_shown",
  "map_view",
  "map_move",
  "search_this_area",
  "result_click",
  "profile_view",
  "call_click",
  "whatsapp_click",
  "navigate_click",
  "address_copy",
  "website_click",
  "review_submit",
  "favorite_add",
  "favorite_remove",
  "supplier_signup_start",
  "supplier_signup_complete",
  "filter_apply",
  "sort_change",
  "category_click",
] as const;

// Validation schema
const eventSchema = z.object({
  event: z.enum(validEvents),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  sessionId: z.string().min(1),
  timestamp: z.string().datetime().optional(),
  providerId: z.string().optional(),
  categoryId: z.string().optional(),
});

const batchEventSchema = z.object({
  events: z.array(eventSchema).max(50),
  sessionId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if batch or single event
    if (body.events && Array.isArray(body.events)) {
      // Batch events
      const parsed = batchEventSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid batch event data", details: parsed.error.errors },
          { status: 400 }
        );
      }

      const { events, sessionId } = parsed.data;

      // Create all events
      await prisma.analyticsEvent.createMany({
        data: events.map((e) => ({
          event: e.event,
          properties: e.properties || {},
          sessionId: e.sessionId || sessionId,
          providerId: e.providerId,
          timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
        })),
      });

      // Track lead events in click ledger
      const leadEvents = events.filter((e) =>
        ["call_click", "whatsapp_click", "navigate_click", "website_click"].includes(e.event)
      );

      if (leadEvents.length > 0) {
        await prisma.clickLedger.createMany({
          data: leadEvents
            .filter((e) => e.providerId)
            .map((e) => ({
              providerId: e.providerId!,
              eventType: e.event.replace("_click", ""),
              sessionId: e.sessionId || sessionId,
              isBillable: true,
              timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
            })),
        });
      }

      return NextResponse.json({ success: true, count: events.length });
    } else {
      // Single event
      const parsed = eventSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid event data", details: parsed.error.errors },
          { status: 400 }
        );
      }

      const { event, properties, sessionId, timestamp, providerId } = parsed.data;

      // Store event
      await prisma.analyticsEvent.create({
        data: {
          event,
          properties: properties || {},
          sessionId,
          providerId,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
      });

      // Track lead events in click ledger
      if (
        providerId &&
        ["call_click", "whatsapp_click", "navigate_click", "website_click"].includes(event)
      ) {
        await prisma.clickLedger.create({
          data: {
            providerId,
            eventType: event.replace("_click", ""),
            sessionId,
            isBillable: true,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
          },
        });
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error tracking event:", error);
    // Don't return error to client - analytics shouldn't break the app
    return NextResponse.json({ success: true });
  }
}

// GET - Get event counts (for debugging/admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since");

    const where = since
      ? { timestamp: { gte: new Date(since) } }
      : { timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };

    const events = await prisma.analyticsEvent.groupBy({
      by: ["event"],
      where,
      _count: { event: true },
    });

    const result = events.reduce(
      (acc, e) => {
        acc[e.event] = e._count.event;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({ events: result, since: since || "24h" });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
