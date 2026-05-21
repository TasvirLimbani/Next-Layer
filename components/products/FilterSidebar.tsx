'use client';

import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterSidebarProps {
  selectedCategory: string;
  priceRange: [number, number];
  maxPrice?: number;
  categories?: string[];
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
}

export default function FilterSidebar({
  selectedCategory,
  priceRange,
  maxPrice = 200,
  categories,
  onCategoryChange,
  onPriceChange,
}: FilterSidebarProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const handlePriceChange = (index: number, value: string) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    if (newRange[0] <= newRange[1]) {
      onPriceChange(newRange);
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b pb-6">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 hover:text-amber-700 transition"
        >
          CATEGORIES
          <ChevronDown
            size={18}
            className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isCategoryOpen && (
          <div className="space-y-2">
            {(categories && categories.length > 0 ? ['All Products', ...categories] : PRODUCT_CATEGORIES).map((category) => (
              <label key={category} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 hover:text-amber-700 transition"
        >
          PRICE RANGE
          <ChevronDown
            size={18}
            className={`transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isPriceOpen && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Min Price: ₹{priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Max Price: ₹{priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full"
              />
            </div>
            <button
              onClick={() => onPriceChange([0, maxPrice])}
              className="text-xs text-amber-700 hover:text-amber-800 transition font-semibold"
            >
              RESET PRICE
            </button>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onCategoryChange('All Products');
          onPriceChange([0, maxPrice]);
        }}
        className="w-full py-2 border border-gray-300 rounded font-semibold text-sm hover:bg-gray-50 transition"
      >
        CLEAR FILTERS
      </button>
    </div>
  );
}
