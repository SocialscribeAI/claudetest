/**
 * CARD COMPONENT - components/ui/card.tsx
 *
 * Purpose: Container component for content sections
 *
 * Variants:
 * - default: White background with shadow
 * - outlined: Border only, no shadow
 * - elevated: Stronger shadow for emphasis
 *
 * Sub-components:
 * - Card: Main container
 * - CardHeader: Top section with title/actions
 * - CardTitle: Title text
 * - CardDescription: Subtitle/description
 * - CardContent: Main content area
 * - CardFooter: Bottom section with actions
 *
 * Props:
 * - variant: CardVariant
 * - padding: "none" | "sm" | "md" | "lg"
 * - onClick: Makes card clickable with hover state
 */

import { forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border bg-white shadow-sm ${className}`}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-4 ${className}`} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={`text-lg font-semibold ${className}`} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-4 pt-0 ${className}`} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex items-center p-4 pt-0 ${className}`} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
