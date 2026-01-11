/**
 * MARKETING LAYOUT - app/(marketing)/layout.tsx
 *
 * Layout for marketing pages (landing, about, blog, etc.)
 * Sets LTR direction for English-focused marketing content
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ParentHub - Find Trusted Childcare Near You",
    template: "%s | ParentHub",
  },
  description:
    "Connect with verified babysitters, tutors, and childcare providers. ParentHub makes finding trusted care for your children easy and safe.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="bg-white">
      {children}
    </div>
  );
}
