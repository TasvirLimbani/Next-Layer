'use client';

import { Product } from '@/lib/types';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/lib/context';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onWishlistChange?: () => void;
  showDeleteWishlistButton?: boolean;
  disableHoverEffects?: boolean;
}

export default function ProductCard({
  product,
  onWishlistChange,
  showDeleteWishlistButton = false,
  disableHoverEffects = false,
}: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  const getUserId = () => {
    try {
      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        return '';
      }

      const parsedUser = JSON.parse(savedUser) as UserProfile;
      return parsedUser?.id ? String(parsedUser.id) : '';
    } catch {
      return '';
    }
  };

  const toggleWishlistOnServer = async (nextWishlisted: boolean) => {
    const userId = getUserId();

    if (!userId) {
      return;
    }

    const response = await fetch('/api/wishlist', {
      method: nextWishlisted ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: product.id,
      }),
    });

    const data = await response.json();

    if (!response.ok || (!data?.status && !data?.success)) {
      throw new Error(data?.message || 'Failed to update wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdatingWishlist) {
      return;
    }

    const nextWishlisted = !isWishlisted;

    setIsUpdatingWishlist(true);

    Promise.resolve()
      .then(() => toggleWishlistOnServer(nextWishlisted))
      .then(() => {
        if (nextWishlisted) {
          addToWishlist(product.id);
        } else {
          removeFromWishlist(product.id);
        }

        setIsWishlisted(nextWishlisted);
        onWishlistChange?.();
      })
      .catch(() => {
        // keep local state unchanged if the server call fails
      })
      .finally(() => {
        setIsUpdatingWishlist(false);
      });
  };

  const handleRemoveWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdatingWishlist) {
      return;
    }

    setIsUpdatingWishlist(true);

    Promise.resolve()
      .then(() => toggleWishlistOnServer(false))
      .then(() => {
        removeFromWishlist(product.id);
        setIsWishlisted(false);
        onWishlistChange?.();
      })
      .catch(() => {
        // keep local state unchanged if the server call fails
      })
      .finally(() => {
        setIsUpdatingWishlist(false);
      });
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
            className={disableHoverEffects ? 'object-contain bg-white' : 'object-cover group-hover:scale-105 transition-transform duration-300'}
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
          <div
            className={`absolute bottom-0 left-0 right-0 flex gap-2 p-3 bg-white bg-opacity-95 ${disableHoverEffects
              ? 'translate-y-0'
              : 'translate-y-full group-hover:translate-y-0 transition-transform duration-300'
              }`}
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded hover:opacity-80 transition"
              disabled={!product.inStock}
            >
              <ShoppingCart size={16} />
              <span className="text-sm">ADD</span>
            </button>
            {showDeleteWishlistButton ? (
              <button
                onClick={handleRemoveWishlist}
                type="button"
                className="px-3 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition disabled:opacity-50"
                disabled={isUpdatingWishlist}
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <button
                onClick={handleWishlist}
                type="button"
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50"
                disabled={isUpdatingWishlist}
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? '#C4A57B' : 'none'}
                  color={isWishlisted ? '#C4A57B' : 'currentColor'}
                />
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">{product.vendor}</p>
          <h3
            className={`text-sm font-semibold text-gray-900 mb-2 line-clamp-2 ${disableHoverEffects ? '' : 'group-hover:text-amber-700 transition'
              }`}
          >
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
