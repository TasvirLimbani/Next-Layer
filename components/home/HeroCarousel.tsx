'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_SLIDES = [
  {
    image: '/Hero1.png',
    title: 'Premium 3D Printing',
    description1: 'High-quality models for your projects',
    description2: 'Precision crafted with advanced technology',
    buttonText: 'Explore Now',
  },
  {
    image: '/Hero2.png',
    title: 'Custom Solutions',
    description1: 'Tailored designs for your needs',
    description2: 'From concept to creation',
    buttonText: 'Get Started',
  },
  {
    image: '/Hero3.png',
    title: 'Innovation & Quality',
    description1: 'Cutting-edge 3D printing technology',
    description2: 'Perfect for prototyping and production',
    buttonText: 'Learn More',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoplay(false);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    setAutoplay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setAutoplay(false);
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[75vh] overflow-hidden">
      {/* Slides */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Overlay with content */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <div className="text-center px-4 sm:px-8 max-w-2xl">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {slide.title}
              </h1>

              {/* Descriptions */}
              <p className="text-lg sm:text-xl text-white mb-2 drop-shadow-md">
                {slide.description1}
              </p>
              <p className="text-base sm:text-lg text-white mb-8 drop-shadow-md">
                {slide.description2}
              </p>

              {/* Button */}
              <Button
                className="px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform"
                size="lg"
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setAutoplay(false)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 p-1 sm:p-2 rounded-full transition"
      >
        <ChevronLeft size={16} className="sm:size-6 text-gray-900" />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setAutoplay(false)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 p-1 sm:p-2 rounded-full transition"
      >
        <ChevronRight size={16} className="sm:size-6 text-gray-900" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1 sm:gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index === current ? 'bg-white sm:w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
