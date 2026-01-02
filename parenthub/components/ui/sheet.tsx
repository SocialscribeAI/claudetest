/**
 * SHEET COMPONENT - components/ui/sheet.tsx
 *
 * Purpose: Slide-in panel for filters, menus, etc.
 *
 * Features:
 * - Slides in from bottom (mobile) or side (desktop)
 * - Drag to close on mobile
 * - Backdrop with blur
 * - Partial height options
 * - Snap points for drag
 *
 * Directions:
 * - bottom: Slide up from bottom (default on mobile)
 * - right: Slide in from right
 * - left: Slide in from left (RTL default)
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - side: "bottom" | "right" | "left"
 * - snapPoints: number[] (heights in %)
 *
 * Use cases:
 * - Filter sheet on search
 * - Mobile navigation menu
 * - Provider quick actions
 */

"use client";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "bottom" | "right" | "left";
}

export function Sheet({ isOpen, onClose, children, side = "bottom" }: SheetProps) {
  if (!isOpen) return null;

  const sideClasses = {
    bottom: "inset-x-0 bottom-0 rounded-t-xl",
    right: "right-0 top-0 h-full rounded-l-xl",
    left: "left-0 top-0 h-full rounded-r-xl",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`absolute bg-white shadow-xl ${sideClasses[side]}`}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="pb-4 border-b mb-4">{children}</div>;
}

export function SheetContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
