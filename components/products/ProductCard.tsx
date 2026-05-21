'use client';

import { Product } from '@/lib/types';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/lib/context';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      product,
      quantity: 1,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product.id);
      setIsWishlisted(true);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/shop/${product.id}`}>
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge */}
          {product.originalPrice && (
            <div
              className="absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: '#C4A57B' }}
            >
              -{discount}%
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SOLD OUT</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 p-3 bg-white bg-opacity-95">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded hover:opacity-80 transition"
              disabled={!product.inStock}
            >
              <ShoppingCart size={16} />
              <span className="text-sm">ADD</span>
            </button>
            <button
              onClick={handleWishlist}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              <Heart
                size={16}
                fill={isWishlisted ? '#C4A57B' : 'none'}
                color={isWishlisted ? '#C4A57B' : 'currentColor'}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">{product.vendor}</p>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
