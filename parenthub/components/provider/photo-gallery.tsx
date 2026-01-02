/**
 * PHOTO GALLERY - components/provider/photo-gallery.tsx
 *
 * Purpose: Swipeable photo gallery for provider profile
 *
 * Features:
 * - Swipeable carousel
 * - Thumbnail navigation
 * - Full-screen mode on tap
 * - Pinch to zoom
 * - Dot indicators
 * - Lazy loading
 *
 * Props:
 * - photos: string[] (URLs)
 * - aspectRatio: "square" | "landscape" | "portrait"
 * - showThumbnails: boolean
 * - onPhotoView: (index: number) => void
 *
 * Analytics:
 * - photo_view on swipe/tap
 */

"use client";

import { useState } from "react";

interface PhotoGalleryProps {
  photos: string[];
  aspectRatio?: "square" | "landscape" | "portrait";
  showThumbnails?: boolean;
}

export function PhotoGallery({
  photos,
  aspectRatio = "landscape",
  showThumbnails = false,
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No photos</span>
      </div>
    );
  }

  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  return (
    <div className="relative">
      <div className={`w-full ${aspectClasses[aspectRatio]} bg-gray-200 overflow-hidden`}>
        <img
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
