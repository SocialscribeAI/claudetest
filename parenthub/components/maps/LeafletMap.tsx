"use client";

/**
 * LEAFLET MAP COMPONENT - components/maps/LeafletMap.tsx
 *
 * Purpose: Free, open-source map using Leaflet + OpenStreetMap
 * No API key required!
 *
 * Features:
 * - Interactive map with markers
 * - Marker clustering
 * - Custom marker icons
 * - Info popups
 * - Geolocation
 *
 * Usage:
 * <LeafletMap markers={providers} onMarkerClick={handleClick} />
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Types
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  category?: string;
  icon?: string;
  rating?: number;
  price?: string;
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

// Default center (Tel Aviv)
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 };
const DEFAULT_ZOOM = 13;

export default function LeafletMap({
  markers,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onMarkerClick,
  className,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const markersRef = useRef<any[]>([]);

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      const L = await import("leaflet");

      // Fix default marker icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setLeaflet(L);
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapRef.current || mapInstance) return;

    const map = leaflet.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // Add OpenStreetMap tiles (FREE!)
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      })
      .addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [leaflet, center.lat, center.lng, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapInstance || !leaflet) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      // Create custom icon with emoji
      const iconHtml = `
        <div style="
          background: white;
          border: 2px solid #ec4899;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">
          ${markerData.icon || "📍"}
        </div>
      `;

      const customIcon = leaflet.divIcon({
        html: iconHtml,
        className: "custom-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = leaflet
        .marker([markerData.lat, markerData.lng], { icon: customIcon })
        .addTo(mapInstance);

      // Add popup
      const popupContent = `
        <div style="min-width: 150px; text-align: center;">
          <strong>${markerData.name}</strong>
          ${markerData.category ? `<br><span style="color: #666; font-size: 12px;">${markerData.category}</span>` : ""}
          ${markerData.rating ? `<br>⭐ ${markerData.rating}` : ""}
        </div>
      `;
      marker.bindPopup(popupContent);

      // Handle click
      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(markerData);
        }
      });

      markersRef.current.push(marker);
    });
  }, [mapInstance, leaflet, markers, onMarkerClick]);

  // Handle map center change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setView([center.lat, center.lng], zoom);
    }
  }, [mapInstance, center.lat, center.lng, zoom]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <div ref={mapRef} className={cn("w-full h-full min-h-[400px]", className)} />
    </>
  );
}
