'use client';

import { Product, UserProfile } from '@/lib/types';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/lib/context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useAppContext();

  const router = useRouter();

  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  /*
   * IMPORTANT:
   * Always use the same ID format everywhere.
   */
  const productId = String(product.id);

  const isWishlisted = isInWishlist(productId);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
        100
      )
      : 0;

  /* --------------------------------------------------
     USER ID
  -------------------------------------------------- */

  const getUserId = (): string => {
    try {
      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        return '';
      }

      const parsedUser = JSON.parse(savedUser) as UserProfile;

      return parsedUser?.id
        ? String(parsedUser.id)
        : '';
    } catch {
      return '';
    }
  };

  /* --------------------------------------------------
     UPDATE WISHLIST ON SERVER
  -------------------------------------------------- */

  const toggleWishlistOnServer = async (
    shouldAdd: boolean
  ): Promise<boolean> => {
    const userId = getUserId();

    if (!userId) {
      throw new Error('Please login first.');
    }

    /*
     * Do NOT force product.id through Number().
     *
     * If your backend expects numeric IDs it can still
     * convert them itself. Sending String prevents
     * accidental NaN / ID corruption.
     */
    const body = {
      user_id: userId,
      product_id: productId,
    };

    console.log('Wishlist request:', {
      method: shouldAdd ? 'POST' : 'DELETE',
      body,
    });

    const response = await fetch('/api/wishlist', {
      method: shouldAdd ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    console.log('Wishlist response:', {
      status: response.status,
      data,
    });

    /*
     * DELETE:
     *
     * If server says "Wishlist item not found",
     * it is already removed from wishlist.
     *
     * So we consider DELETE successful.
     */
    if (
      !shouldAdd &&
      (
        response.status === 404 ||
        data?.message
          ?.toLowerCase()
          ?.includes('wishlist item not found')
      )
    ) {
      return true;
    }

    if (
      !response.ok ||
      (
        data?.status === false &&
        data?.success !== true
      )
    ) {
      throw new Error(
        data?.message ||
        'Failed to update wishlist'
      );
    }

    return true;
  };

  /* --------------------------------------------------
     ADD TO CART
  -------------------------------------------------- */

  const handleAdd = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      return;
    }

    router.push(`/shop/${productId}`);
  };

  /* --------------------------------------------------
     WISHLIST
  -------------------------------------------------- */

  const handleWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdatingWishlist) {
      return;
    }

    const userId = getUserId();

    if (!userId) {
      alert('Please login first.');
      return;
    }

    /*
     * If local state says true -> remove.
     * If false -> add.
     */
    const shouldAdd = !isWishlisted;

    try {
      setIsUpdatingWishlist(true);

      await toggleWishlistOnServer(shouldAdd);

      /*
       * Update global context ONLY after
       * server operation succeeds.
       */
      if (shouldAdd) {
        addToWishlist(productId);
      } else {
        removeFromWishlist(productId);
      }

      /*
       * Tell parent page to refresh its data.
       */
      onWishlistChange?.();

      /*
       * Update header / other components.
       */
      window.dispatchEvent(
        new CustomEvent('wishlist-updated')
      );
    } catch (error) {
      console.error(
        'Wishlist Error:',
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update wishlist';

      alert(message);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  /* --------------------------------------------------
     REMOVE FROM WISHLIST PAGE
  -------------------------------------------------- */

  const handleRemoveWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdatingWishlist) {
      return;
    }

    try {
      setIsUpdatingWishlist(true);

      await toggleWishlistOnServer(false);

      /*
       * Always remove locally.
       *
       * Even if server said "not found",
       * it means the item is already gone.
       */
      removeFromWishlist(productId);

      onWishlistChange?.();

      window.dispatchEvent(
        new CustomEvent('wishlist-updated')
      );
    } catch (error) {
      console.error(
        'Remove wishlist error:',
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to remove wishlist item';

      alert(message);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  /* --------------------------------------------------
     RATING
  -------------------------------------------------- */

  const renderStars = (rating: number) => {
    const safeRating = Number(rating) || 0;

    return (
      <div
        className="flex items-center gap-0.5"
        aria-label={`Rating ${safeRating} out of 5`}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={`text-[15px] leading-none ${index < Math.floor(safeRating)
                ? 'text-yellow-400'
                : 'text-gray-300'
              }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  /* --------------------------------------------------
     IMAGE URL
  -------------------------------------------------- */

  const imageUrl = product.image
    ? `/api/image-proxy?url=${encodeURIComponent(
      product.image
    )}`
    : '/placeholder-product.png';

  return (
    <article className="group flex h-full min-w-0 flex-col">
      {/* ================================================
          IMAGE
      ================================================ */}

      <div
        className={`relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-[#f5f5f5] ${disableHoverEffects
            ? ''
            : 'transition-shadow duration-300 group-hover:shadow-md'
          }`}
      >
        <Link
          href={`/shop/${productId}`}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              25vw
            "
            className={`${disableHoverEffects
                ? 'object-contain p-2'
                : 'object-contain p-2 transition-transform duration-500 group-hover:scale-105'
              }`}
          />
        </Link>

        {/* DISCOUNT */}

        {discount > 0 && (
          <div
            className="absolute right-3 top-3 z-10 rounded-md px-2 py-1 text-[10px] font-bold text-white shadow-sm"
            style={{
              backgroundColor: '#C4A57B',
            }}
          >
            -{discount}%
          </div>
        )}

        {/* SOLD OUT */}

        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
            <span className="rounded-md bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow">
              SOLD OUT
            </span>
          </div>
        )}

        {/* ============================================
            ACTION BAR
        ============================================ */}

        <div
          className={`absolute bottom-0 left-0 right-0 z-20 flex gap-2 bg-white/95 p-3 backdrop-blur-sm ${disableHoverEffects
              ? 'translate-y-0'
              : 'translate-y-full transition-transform duration-300 group-hover:translate-y-0'
            }`}
        >
          {/* ADD */}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex min-h-[40px] flex-1 items-center justify-center gap-2 rounded-md bg-[#111827] px-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={15} />

            <span>ADD</span>
          </button>

          {/* WISHLIST */}

          {showDeleteWishlistButton ? (
            <button
              type="button"
              onClick={handleRemoveWishlist}
              disabled={isUpdatingWishlist}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
              aria-label={`Remove ${product.name} from wishlist`}
            >
              {isUpdatingWishlist ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleWishlist}
              disabled={isUpdatingWishlist}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-white transition-all duration-200 disabled:opacity-50 ${isWishlisted
                  ? 'border-[#C4A57B] text-[#C4A57B]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
            >
              {isUpdatingWishlist ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Heart
                  size={17}
                  fill={
                    isWishlisted
                      ? '#C4A57B'
                      : 'none'
                  }
                  strokeWidth={1.8}
                />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ================================================
          PRODUCT INFORMATION
      ================================================ */}

      <Link
        href={`/shop/${productId}`}
        className="flex min-w-0 flex-1 flex-col"
      >
        {/* VENDOR */}

        <p className="mb-1.5 truncate text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500 sm:text-xs">
          {product.vendor || '3D PRINT STORE'}
        </p>

        {/* NAME */}

        <h3
          className={`mb-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-gray-900 ${disableHoverEffects
              ? ''
              : 'transition-colors duration-200 group-hover:text-[#B17D42]'
            }`}
        >
          {product.name}
        </h3>

        {/* RATING */}

        {/* <div className="mb-3 flex items-center gap-2">
          {renderStars(product.rating)}

          <span className="text-[11px] text-gray-500">
            ({product.reviews || 0})
          </span>
        </div> */}

        {/* PRICE */}

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="text-base font-bold text-gray-900 sm:text-lg">
            ₹{Number(product.price || 0).toFixed(2)}
          </span>

          {product.originalPrice &&
            product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through sm:text-sm">
                ₹
                {Number(
                  product.originalPrice
                ).toFixed(2)}
              </span>
            )}
        </div>
      </Link>
    </article>
  );
}