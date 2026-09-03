// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// interface ProductImageGalleryProps {
//   images: string[];
//   productName: string;
//   defaultImageIndex?: number;
// }

// export default function ProductImageGallery({ images, productName, defaultImageIndex = 0 }: ProductImageGalleryProps) {
//   const [currentIndex, setCurrentIndex] = useState(defaultImageIndex);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   useEffect(() => {
//     setCurrentIndex(defaultImageIndex);
//   }, [defaultImageIndex]);

//   // Handle keyboard events in fullscreen
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!isFullscreen) return;
//       if (e.key === 'Escape') setIsFullscreen(false);
//       if (e.key === 'ArrowLeft') goToPrevious();
//       if (e.key === 'ArrowRight') goToNext();
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [isFullscreen, currentIndex]);

//   if (images.length === 0) {
//     return (
//       <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square" />
//     );
//   }

//   const goToPrevious = () => {
//     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const goToNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % images.length);
//   };

//   const currentImage = images[currentIndex];

//   return (
//     <div className="flex items-start gap-4">
//       {/* Thumbnails */}
//       {images.length > 1 && (
//         <div className="flex w-[110px] shrink-0 flex-col gap-2 overflow-y-auto pb-2">
//           {images.map((image, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentIndex(idx)}
//               className={`relative h-20 w-full overflow-hidden rounded-lg border-2 transition ${idx === currentIndex ? 'border-amber-600' : 'border-gray-300 hover:border-amber-400'}`}
//             >
//               <Image
//                 src={`/api/image-proxy?url=${encodeURIComponent(image)}`}
//                 alt={`Thumbnail ${idx + 1}`}
//                 fill
//                 className="object-cover"
//               />
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Main Image */}
//       <div className="relative min-w-0 flex-1 overflow-hidden rounded-lg bg-white aspect-square group cursor-pointer" onClick={() => setIsFullscreen(true)}>
//         <Image
//           src={`/api/image-proxy?url=${encodeURIComponent(currentImage)}`}
//           alt={`${productName} - view ${currentIndex + 1}`}
//           fill
//           className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
//           priority
//           sizes="(max-width: 1024px) 100vw, 50vw"
//         />

//         {/* Navigation Arrows */}
//         {images.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 goToPrevious();
//               }}
//               className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition z-10"
//             >
//               <ChevronLeft size={20} className="text-gray-900" />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 goToNext();
//               }}
//               className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition z-10"
//             >
//               <ChevronRight size={20} className="text-gray-900" />
//             </button>
//           </>
//         )}

//         {/* Image Counter */}
//         {images.length > 1 && (
//           <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
//             {currentIndex + 1} / {images.length}
//           </div>
//         )}
//       </div>

//       {/* Fullscreen Modal */}
//       {isFullscreen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setIsFullscreen(false)}>
//           <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
//             <button
//               onClick={() => setIsFullscreen(false)}
//               className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg ring-2 ring-black/5 transition hover:scale-105"
//               aria-label="Close image view"
//             >
//               <X size={20} />
//             </button>

//             <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#f4f4f4] p-3 shadow-2xl">
//               <div className="relative h-[72vh] w-full overflow-hidden rounded-xl bg-white">
//                 <Image
//                   src={`/api/image-proxy?url=${encodeURIComponent(currentImage)}`}
//                   alt={`${productName} - fullscreen view ${currentIndex + 1}`}
//                   fill
//                   className="object-contain p-6"
//                   priority
//                   sizes="100vw"
//                 />
//               </div>

//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       goToPrevious();
//                     }}
//                     className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md transition hover:bg-white"
//                   >
//                     <ChevronLeft size={24} className="text-gray-900" />
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       goToNext();
//                     }}
//                     className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md transition hover:bg-white"
//                   >
//                     <ChevronRight size={24} className="text-gray-900" />
//                   </button>

//                   <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
//                     {currentIndex + 1} / {images.length}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  defaultImageIndex?: number;
}

export default function ProductImageGallery({
  images,
  productName,
  defaultImageIndex = 0,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(defaultImageIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      images.length > 0
        ? (prev - 1 + images.length) % images.length
        : 0
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      images.length > 0
        ? (prev + 1) % images.length
        : 0
    );
  };

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(
      Math.min(defaultImageIndex, images.length - 1)
    );
  }, [defaultImageIndex, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      }

      if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100" />
    );
  }

  const currentImage = images[currentIndex];

  const getImageUrl = (image: string) => {
    return `/api/image-proxy?url=${encodeURIComponent(image)}`;
  };

  return (
    <div className="flex items-start gap-4 bg-white">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex w-[110px] shrink-0 flex-col gap-2 overflow-y-auto pb-2 pt-2">
          {images.map((image, idx) => (
            <button
              key={`${image}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-20 w-full overflow-hidden rounded-lg border-2 transition ${idx === currentIndex
                ? 'border-amber-600'
                : 'border-gray-300 hover:border-amber-400'
                }`}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="110px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div
        className="group relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-lg bg-white aspect-square"
        onClick={() => setIsFullscreen(true)}
      >
        <Image
          src={getImageUrl(currentImage)}
          alt={`${productName} - view ${currentIndex + 1}`}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Previous */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-900" />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {/* Fullscreen */}
      {isFullscreen && (
        <div
          className="fixed left-0 right-0 top-[87px] bottom-0 z-[9999] flex items-center justify-center bg-black/70 p-2 sm:p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative h-full w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:scale-105"
              aria-label="Close image view"
            >
              <X size={20} />
            </button>

            {/* Full image */}
            <div className="relative h-full w-full bg-white">
              <Image
                src={getImageUrl(currentImage)}
                alt={`${productName} - fullscreen view ${currentIndex + 1}`}
                fill
                className="object-contain p-4 sm:p-8"
                priority
                sizes="100vw"
              />
            </div>

            {/* Previous button */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="text-gray-900" />
                </button>

                {/* Next button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="text-gray-900" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}