/**
 * INPUT COMPONENT - components/ui/input.tsx
 *
 * Purpose: Reusable text input with variants
 *
 * Features:
 * - Label integration
 * - Error state with message
 * - Helper text
 * - Left/right icons or addons
 * - RTL support
 * - Disabled state
 *
 * Props:
 * - label: string
 * - error: string
 * - helperText: string
 * - leftIcon: ReactNode
 * - rightIcon: ReactNode
 * - leftAddon: string (like currency symbol)
 * - rightAddon: string
 * - ...native input props
 *
 * Specialized variants (separate components):
 * - PhoneInput: With country code selector
 * - SearchInput: With search icon and clear button
 * - OTPInput: 6-digit code input
 */

import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          ref={ref}
          className={`border rounded-lg px-3 py-2 ${error ? "border-red-500" : "border-gray-300"} ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
