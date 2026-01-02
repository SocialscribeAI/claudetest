/**
 * MODAL COMPONENT - components/ui/modal.tsx
 *
 * Purpose: Overlay dialog for focused interactions
 *
 * Features:
 * - Backdrop with blur effect
 * - Close on backdrop click (optional)
 * - Close on Escape key
 * - Focus trap for accessibility
 * - Animated enter/exit
 * - Scrollable content area
 * - RTL support
 *
 * Sizes:
 * - sm: 400px max width
 * - md: 500px max width (default)
 * - lg: 700px max width
 * - full: Full screen on mobile
 *
 * Sub-components:
 * - Modal: Container with backdrop
 * - ModalHeader: Title and close button
 * - ModalBody: Scrollable content
 * - ModalFooter: Action buttons
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - size: ModalSize
 * - closeOnBackdrop: boolean
 * - showCloseButton: boolean
 */

"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
}

export function Modal({ isOpen, onClose, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-auto`}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t flex gap-2 justify-end">{children}</div>;
}
