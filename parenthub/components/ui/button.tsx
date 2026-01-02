/**
 * BUTTON COMPONENT - components/ui/button.tsx
 *
 * Purpose: Reusable button component with variants
 *
 * Variants:
 * - primary: Main CTA buttons (coral/pink brand color)
 * - secondary: Secondary actions (outlined)
 * - ghost: Minimal style for less prominent actions
 * - destructive: Delete/danger actions (red)
 *
 * Sizes:
 * - sm: Small buttons (icons, compact UI)
 * - md: Default size
 * - lg: Large CTAs (contact buttons)
 *
 * Props:
 * - variant: ButtonVariant
 * - size: ButtonSize
 * - isLoading: boolean (shows spinner)
 * - leftIcon: ReactNode
 * - rightIcon: ReactNode
 * - fullWidth: boolean
 * - disabled: boolean
 * - ...native button props
 *
 * Uses:
 * - class-variance-authority for variant styles
 * - tailwind-merge for class merging
 */

import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button ref={ref} className={className} {...props}>
        {isLoading ? "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
