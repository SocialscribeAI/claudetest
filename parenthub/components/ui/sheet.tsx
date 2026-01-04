/**
 * SHEET COMPONENT - components/ui/sheet.tsx
 *
 * Purpose: Slide-in panel for filters, menus, etc.
 *
 * Sides: bottom, right, left
 * Features: Escape to close, backdrop click, animation
 */

"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "bottom" | "right" | "left";
  title?: string;
}

export function Sheet({
  isOpen,
  onClose,
  children,
  side = "bottom",
  title,
}: SheetProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sideClasses = {
    bottom: "inset-x-0 bottom-0 rounded-t-3xl max-h-[85vh] animate-in slide-in-from-bottom duration-300",
    right: "right-0 top-0 h-full w-full max-w-md rounded-s-3xl animate-in slide-in-from-right duration-300",
    left: "left-0 top-0 h-full w-full max-w-md rounded-e-3xl animate-in slide-in-from-left duration-300",
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "absolute bg-white shadow-2xl overflow-hidden",
          sideClasses[side]
        )}
      >
        {/* Drag handle for bottom sheet */}
        {side === "bottom" && (
          <div className="flex justify-center py-3">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetHeader({ children, className }: SheetHeaderProps) {
  return (
    <div className={cn("pb-4 border-b border-gray-100 mb-4", className)}>
      {children}
    </div>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetContent({ children, className }: SheetContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

interface SheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetFooter({ children, className }: SheetFooterProps) {
  return (
    <div
      className={cn(
        "pt-4 mt-4 border-t border-gray-100 flex gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
