// 'use client';

// import { useState } from 'react';

// interface CustomizationFormProps {
//   productName: string;
//   customizable: boolean;
//   imageCustomizable: boolean;
//   onCustomize: (customText: string, customImage: File | null) => void;
// }

// export default function CustomizationForm({
//   productName,
//   onCustomize,
// }: CustomizationFormProps) {
//   const maxLength = 30;

//   const [customText, setCustomText] = useState('');
//   const [customImage, setCustomImage] = useState<File | null>(null);

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCustomText(e.target.value.slice(0, maxLength));
//   };

//   const handleImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setCustomImage(e.target.files[0]);
//     }
//   };

//   const handleApply = () => {
//     onCustomize(customText, customImage);
//   };

//   return (
//     <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
//       <h3 className="text-lg font-semibold mb-5">
//         Customize Your Product
//       </h3>

//       <p className="text-sm text-gray-600 mb-6">
//         Personalize <strong>{productName}</strong> with your own text and image.
//       </p>

//       {/* Custom Text */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Custom Text
//         </label>

//         <input
//           type="text"
//           value={customText}
//           onChange={handleTextChange}
//           maxLength={maxLength}
//           placeholder="Enter your name or text"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//         />

//         <div className="flex justify-between mt-2">
//           <span className="text-xs text-gray-500">
//             {customText.length}/{maxLength} Characters
//           </span>

//           {customText && (
//             <button
//               type="button"
//               onClick={() => setCustomText('')}
//               className="text-xs text-blue-600 hover:underline"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Upload Image */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Upload Image
//         </label>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="block w-full border border-gray-300 rounded-lg p-2"
//         />

//         {customImage && (
//           <div className="mt-4">
//             <img
//               src={URL.createObjectURL(customImage)}
//               alt="Preview"
//               className="w-40 h-40 object-cover rounded-lg border"
//             />

//             <p className="mt-2 text-sm text-gray-600">
//               {customImage.name}
//             </p>

//             <button
//               type="button"
//               onClick={() => setCustomImage(null)}
//               className="mt-2 text-sm text-red-600 hover:underline"
//             >
//               Remove Image
//             </button>
//           </div>
//         )}
//       </div>

//       <button
//         type="button"
//         onClick={handleApply}
//         className="w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90"
//         style={{ backgroundColor: '#C4A57B' }}
//       >
//         Apply Customization
//       </button>
//     </div>
//   );
// }




'use client';


import { useEffect, useState } from 'react';

interface CustomizationFormProps {
  productName: string;
  customizable: boolean;
  imageCustomizable: boolean;
  onCustomize: (customText: string, customImage: File | null) => void;
}

export default function CustomizationForm({
  productName,
  customizable,
  imageCustomizable,
  onCustomize,
}: CustomizationFormProps) {
  const maxLength = 30;

  const [customText, setCustomText] = useState('');
  const [customImage, setCustomImage] = useState<File | null>(null);
const [successMessage, setSuccessMessage] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomText(e.target.value.slice(0, maxLength));
  };
const [errorMessage, setErrorMessage] = useState('');


  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setCustomImage(e.target.files[0]);
    }
  };

const handleApply = () => {
  setErrorMessage('');
  setSuccessMessage('');

  // Nothing entered
  if (
    (customizable && customText.trim() === '') &&
    (imageCustomizable && !customImage)
  ) {
    setErrorMessage('Please enter custom text or upload an image.');
    return;
  }

  // Text required
  if (customizable && !imageCustomizable && customText.trim() === '') {
    setErrorMessage('Please enter custom text.');
    return;
  }

  // Image required
  if (!customizable && imageCustomizable && !customImage) {
    setErrorMessage('Please upload an image.');
    return;
  }

  onCustomize(customText.trim(), customImage);

  setSuccessMessage('✅ Customization applied successfully!');

  setTimeout(() => {
    setSuccessMessage('');
  }, 3000);
};

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-5">
        Customize Your Product
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Personalize <strong>{productName}</strong>
        {customizable && imageCustomizable
          ? ' with your own text and image.'
          : customizable
          ? ' with your own text.'
          : ' with your own image.'}
      </p>

      {/* Custom Text */}
      {customizable && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Text
          </label>

          <input
            type="text"
            value={customText}
            onChange={handleTextChange}
            maxLength={maxLength}
            placeholder="Enter your name or text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              {customText.length}/{maxLength} Characters
            </span>

            {customText && (
              <button
                type="button"
                onClick={() => setCustomText('')}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Image */}
      {imageCustomizable && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full border border-gray-300 rounded-lg p-2"
          />

          {customImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(customImage)}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border"
              />

              <p className="mt-2 text-sm text-gray-600">
                {customImage.name}
              </p>

              <button
                type="button"
                onClick={() => setCustomImage(null)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
      )}

  <button
  type="button"
  onClick={handleApply}
  className="w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90"
  style={{ backgroundColor: '#C4A57B' }}
>
  Apply Customization
</button>

{successMessage && (
  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
    {successMessage}
  </div>
)}
    </div>
    
  );
}