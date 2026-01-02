/**
 * LIST MAP TOGGLE - components/discovery/list-map-toggle.tsx
 *
 * Purpose: Toggle between list and map views
 *
 * Display:
 * - Two-button toggle (List | Map)
 * - Active state indication
 * - Icons for each mode
 *
 * Props:
 * - activeView: "list" | "map"
 * - onChange: (view: "list" | "map") => void
 *
 * Behavior:
 * - Persists preference in localStorage
 * - Animates transition
 *
 * Analytics:
 * - view_toggle on change
 */

"use client";

interface ListMapToggleProps {
  activeView: "list" | "map";
  onChange: (view: "list" | "map") => void;
}

export function ListMapToggle({ activeView, onChange }: ListMapToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
          activeView === "list" ? "bg-white shadow-sm" : ""
        }`}
      >
        <span>☰</span>
        <span className="text-sm">List</span>
      </button>
      <button
        onClick={() => onChange("map")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
          activeView === "map" ? "bg-white shadow-sm" : ""
        }`}
      >
        <span>🗺️</span>
        <span className="text-sm">Map</span>
      </button>
    </div>
  );
}
