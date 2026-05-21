'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/lib/constants';

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const goToReview = (index: number) => {
    setCurrent(index);
  };

  const nextReview = () => {
    setCurrent((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
  };

  const prevReview = () => {
    setCurrent((prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length);
  };

  const review = CUSTOMER_REVIEWS[current];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-600 text-lg">
            See what our customers are saying about their 3D printed products
          </p>
        </div>

        {/* Review Carousel */}
        <div className="relative bg-white rounded-lg p-8 md:p-12 shadow-sm border border-gray-100">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Review Text */}
          <p className="text-gray-700 text-lg text-center mb-6 italic leading-relaxed">
            "{review.text}"
          </p>

          {/* Author */}
          <div className="text-center mb-8">
            <p className="font-semibold text-gray-900">{review.name}</p>
            <p className="text-sm text-gray-600">{review.location}</p>
            <p className="text-xs text-gray-500 mt-1">{review.timeAgo}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevReview}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {CUSTOMER_REVIEWS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToReview(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? 'bg-gray-900 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
