'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  defaultImageIndex?: number;
}

export default function ProductImageGallery({ images, productName, defaultImageIndex = 0 }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(defaultImageIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(defaultImageIndex);
  }, [defaultImageIndex]);

  // Handle keyboard events in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex]);

  if (images.length === 0) {
    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square" />
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div>
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square group cursor-pointer" onClick={() => setIsFullscreen(true)}>
        <Image
          src={`/api/image-proxy?url=${encodeURIComponent(currentImage)}`}
          alt={`${productName} - view ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition z-10"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition z-10"
            >
              <ChevronRight size={20} className="text-gray-900" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${idx === currentIndex ? 'border-amber-600' : 'border-gray-300 hover:border-amber-400'
                }`}
            >
              <Image
                src={`/api/image-proxy?url=${encodeURIComponent(image)}`}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition z-50"
          >
            <X size={24} className="text-gray-900" />
          </button>

          {/* Fullscreen Image */}
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`/api/image-proxy?url=${encodeURIComponent(currentImage)}`}
              alt={`${productName} - fullscreen view ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-3 rounded-full transition"
              >
                <ChevronLeft size={28} className="text-gray-900" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-3 rounded-full transition"
              >
                <ChevronRight size={28} className="text-gray-900" />
              </button>
            )}

            {/* Image Counter in Fullscreen */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
