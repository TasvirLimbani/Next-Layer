'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SortDropdown({ selectedSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel =
    SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sort By';

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 sm:w-auto sm:justify-start"
      >
        {selectedLabel}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-56">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${selectedSort === option.value ? 'bg-amber-50 text-amber-700 font-semibold' : ''
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
