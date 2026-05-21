'use client';

import { useState } from 'react';

interface CustomizationFormProps {
  productName: string;
  onCustomize: (customName: string) => void;
}

export default function CustomizationForm({ productName, onCustomize }: CustomizationFormProps) {
  const [customName, setCustomName] = useState('');
  const maxLength = 30;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, maxLength);
    setCustomName(value);
  };

  const handleApply = () => {
    onCustomize(customName);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Customize Your Product</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Custom Name (Optional)
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Personalize this product with your own name or text (up to {maxLength} characters)
        </p>

        <input
          type="text"
          value={customName}
          onChange={handleChange}
          placeholder="e.g., Sarah's 3D Print"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent mb-2"
          maxLength={maxLength}
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {customName.length} / {maxLength} characters
          </span>
          {customName && (
            <button
              onClick={() => setCustomName('')}
              className="text-xs text-gray-600 hover:text-gray-900 transition underline"
            >
              Clear
            </button>
          )}
        </div>

        {customName && (
          <button
            onClick={handleApply}
            className="w-full mt-4 py-2 text-white rounded-lg font-semibold transition hover:opacity-90"
            style={{ backgroundColor: '#C4A57B' }}
          >
            Apply Customization
          </button>
        )}
      </div>
    </div>
  );
}
