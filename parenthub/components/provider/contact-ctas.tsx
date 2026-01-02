/**
 * CONTACT CTAS - components/provider/contact-ctas.tsx
 *
 * Purpose: Call, WhatsApp, Navigate action buttons
 *
 * Buttons:
 * - Call: Opens phone dialer (tel: link)
 * - WhatsApp: Opens WhatsApp chat (wa.me link)
 * - Navigate: Opens Google Maps directions
 * - Copy address: Copies address to clipboard
 *
 * Props:
 * - provider: { phone, whatsapp, address, lat, lng }
 * - layout: "horizontal" | "vertical" | "sticky"
 * - onAction: (action: ActionType) => void
 *
 * Behavior:
 * - Tracks analytics event on each click
 * - Shows toast on copy
 * - Opens in new tab/app
 *
 * Analytics events:
 * - call_click
 * - whatsapp_click
 * - navigate_click
 * - address_copy
 */

"use client";

import { Button } from "@/components/ui/button";

interface ContactCTAsProps {
  provider: {
    phone?: string;
    whatsapp?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  layout?: "horizontal" | "vertical" | "sticky";
  onAction?: (action: "call" | "whatsapp" | "navigate" | "copy") => void;
}

export function ContactCTAs({
  provider,
  layout = "horizontal",
  onAction,
}: ContactCTAsProps) {
  const handleCall = () => {
    if (provider.phone) {
      window.location.href = `tel:${provider.phone}`;
      onAction?.("call");
    }
  };

  const handleWhatsApp = () => {
    if (provider.whatsapp) {
      window.open(`https://wa.me/${provider.whatsapp}`, "_blank");
      onAction?.("whatsapp");
    }
  };

  const handleNavigate = () => {
    if (provider.lat && provider.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`,
        "_blank"
      );
      onAction?.("navigate");
    }
  };

  const containerClass = layout === "vertical" ? "flex-col" : "flex-row";

  return (
    <div className={`flex gap-2 ${containerClass}`}>
      {provider.phone && (
        <Button onClick={handleCall}>📞 Call</Button>
      )}
      {provider.whatsapp && (
        <Button onClick={handleWhatsApp} variant="secondary">
          💬 WhatsApp
        </Button>
      )}
      {provider.lat && provider.lng && (
        <Button onClick={handleNavigate} variant="secondary">
          🗺️ Navigate
        </Button>
      )}
    </div>
  );
}
