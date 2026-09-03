'use client';

import { useState, useEffect } from 'react';

import {
  Heart,
  ShoppingCart,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import Link from 'next/link';
import CustomizationForm from '@/components/products/CustomizationForm';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { useAppContext } from '@/lib/context';
import { useParams } from 'next/navigation';
import { fetchProductById } from '@/lib/products';
import { Product, UserProfile } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : String(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useAppContext();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [customName, setCustomName] = useState('');
  const [customImage, setCustomImage] = useState<File | null>(null);

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const resolveGalleryImages = (
    variantImages?: string[],
    fallbackImages: string[] = [],
    additionalImages: string[] = []
  ) => {
    const preferred = [...new Set((variantImages ?? []).filter(Boolean))];
    const fallback = [...new Set((fallbackImages ?? []).filter(Boolean))];
    const extra = [...new Set((additionalImages ?? []).filter(Boolean))];

    const baseList = preferred.length ? preferred : fallback;
    const merged = [...baseList, ...extra];
    const uniqueMerged = merged.filter(
      (image, index) => merged.indexOf(image) === index
    );

    return uniqueMerged.length ? uniqueMerged : [];
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] =
    useState<'success' | 'error'>('success');

  const [wishlistError, setWishlistError] = useState('');

  /*
   * -----------------------------------------
   * COLOR HELPERS
   * -----------------------------------------
   */

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      red: '#EF4444',
      blue: '#3B82F6',
      green: '#10B981',
      yellow: '#FCD34D',
      purple: '#A855F7',
      pink: '#EC4899',
      orange: '#F97316',
      black: '#1F2937',
      white: '#F5F5F5',
      gray: '#9CA3AF',
      brown: '#92400E',
      gold: '#D97706',
      silver: '#D1D5DB',
      'rose pink': '#F43F5E',
      'sky blue': '#06B6D4',
      lavender: '#C084FC',
      'coffee brown': '#78350F',
      'jet black': '#000000',
      terracotta: '#EA580C',
      bronze: '#92400E',
      natural: '#C4A57B',
    };

    return (
      colorMap[colorName.toLowerCase()] || '#9CA3AF'
    );
  };

  /*
   * -----------------------------------------
   * LOAD PRODUCT
   * -----------------------------------------
   */

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError('');

        const matchedProduct = await fetchProductById(id);

        if (!isActive) return;

        setProduct(matchedProduct);

        setIsWishlisted(
          Boolean(isInWishlist(matchedProduct.id))
        );

        const firstVariant = matchedProduct.variants?.[0];
        const defaultFallbackImages = matchedProduct.images || [];

        const defaultGalleryImages = resolveGalleryImages(
          firstVariant?.image_urls?.length
            ? firstVariant.image_urls
            : firstVariant?.images,
          defaultFallbackImages,
          matchedProduct.similar || []
        );

        if (firstVariant) {
          setSelectedColor(firstVariant.color);
        }

        setSelectedImages(defaultGalleryImages);
      } catch (loadError) {
        if (!isActive) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load product'
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id, isInWishlist]);

  /*
   * -----------------------------------------
   * SERVER WISHLIST CHECK
   * -----------------------------------------
   */

  useEffect(() => {
    if (!product) return;

    const activeVariant =
      product.variants?.find(
        (variant) => variant.color === selectedColor
      ) || product.variants?.[0];

    const activeVariantImages = activeVariant?.image_urls?.length
      ? activeVariant.image_urls
      : activeVariant?.images || [];

    const nextGalleryImages = resolveGalleryImages(
      activeVariantImages,
      product.images || [],
      product.similar || []
    );

    setSelectedImages(nextGalleryImages);
  }, [product, selectedColor]);

  useEffect(() => {
    if (!product) return;

    const checkServerWishlist = async () => {
      try {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) return;

        const user = JSON.parse(savedUser) as {
          id?: string | number;
        };

        if (!user?.id) return;

        const res = await fetch(
          `/api/wishlist?user_id=${Number(user.id)}`
        );

        if (!res.ok) return;

        const data = await res.json();

        const products =
          data?.products ||
          data?.wishlist ||
          [];

        const has = Array.isArray(products)
          ? products.some(
            (p: any) =>
              String(
                p.id ??
                p.product_id ??
                p.productId
              ) === String(product.id)
          )
          : false;

        setIsWishlisted(Boolean(has));
      } catch {
        // Ignore wishlist check errors
      }
    };

    checkServerWishlist();
  }, [product]);

  /*
   * -----------------------------------------
   * NOTIFICATION
   * -----------------------------------------
   */

  const showMessage = (
    message: string,
    type: 'success' | 'error'
  ) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  /*
   * -----------------------------------------
   * ADD TO CART
   * -----------------------------------------
   */

  const handleAddToCart = async () => {
    if (
      Number(product?.customizable) === 1 &&
      customName.trim() === ''
    ) {
      showMessage(
        'Please enter custom text.',
        'error'
      );
      return;
    }

    if (
      Number(product?.image_customizable) === 1 &&
      !customImage
    ) {
      showMessage(
        'Please upload a custom image.',
        'error'
      );
      return;
    }

    if (!product) return;

    try {
      setIsAddingToCart(true);

      const savedUser =
        localStorage.getItem('user');

      if (!savedUser) {
        throw new Error(
          'Please sign in before adding items to cart.'
        );
      }

      const user = JSON.parse(savedUser) as {
        id?: string | number;
      };

      if (!user?.id) {
        throw new Error(
          'Please sign in before adding items to cart.'
        );
      }

      const formData = new FormData();

      formData.append(
        'user_id',
        Number(user.id).toString()
      );

      formData.append('sku', product.sku);
      formData.append(
        'quantity',
        String(quantity)
      );

      formData.append(
        'customization',
        customName
      );

      if (selectedColor) {
        formData.append(
          'colour',
          selectedColor
        );
      }

      if (customImage) {
        formData.append(
          'customer_image',
          customImage
        );
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
          'Failed to add product to cart'
        );
      }

      addToCart({
        product,
        quantity,
        customization: customName.trim()
          ? {
            customName: customName.trim(),
          }
          : undefined,
      });

      window.dispatchEvent(
        new Event('cart-updated')
      );

      showMessage(
        `Added to cart! ${customName
          ? `(${customName})`
          : ''
        }`,
        'success'
      );
    } catch (addError) {
      showMessage(
        addError instanceof Error
          ? addError.message
          : 'Failed to add product to cart',
        'error'
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  /*
   * -----------------------------------------
   * USER ID
   * -----------------------------------------
   */

  const getUserId = () => {
    try {
      const savedUser =
        localStorage.getItem('user');

      if (!savedUser) return '';

      const parsedUser =
        JSON.parse(savedUser) as UserProfile;

      return parsedUser?.id
        ? String(parsedUser.id)
        : '';
    } catch {
      return '';
    }
  };

  /*
   * -----------------------------------------
   * WISHLIST
   * -----------------------------------------
   */

  const toggleWishlistOnServer = async (
    nextWishlisted: boolean
  ) => {
    if (!product) return;

    const userId = getUserId();

    if (!userId) {
      setWishlistError(
        'Please sign in to use wishlist.'
      );
      return;
    }

    setIsTogglingWishlist(true);
    setWishlistError('');

    try {
      const response = await fetch(
        '/api/wishlist',
        {
          method: nextWishlisted
            ? 'POST'
            : 'DELETE',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            user_id: Number(userId),
            product_id: Number(product.id),
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        (!data.success && !data.status)
      ) {
        throw new Error(
          data.message ||
          'Failed to update wishlist'
        );
      }

      if (nextWishlisted) {
        addToWishlist(product.id);
      } else {
        removeFromWishlist(product.id);
      }

      setIsWishlisted(nextWishlisted);
    } catch (wishlistErr) {
      setWishlistError(
        wishlistErr instanceof Error
          ? wishlistErr.message
          : 'Failed to update wishlist'
      );
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  /*
   * -----------------------------------------
   * SHARE
   * -----------------------------------------
   */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            product?.name || 'Product',

          text:
            product?.name ||
            'Check out this product',

          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        showMessage(
          'Product link copied!',
          'success'
        );
      }
    } catch {
      // User cancelled native share
    }
  };

  /*
   * -----------------------------------------
   * LOADING
   * -----------------------------------------
   */

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-100" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="aspect-square animate-pulse rounded-xl bg-gray-100" />

          <div className="space-y-5">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />

            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />

            <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />

            <div className="h-24 animate-pulse rounded bg-gray-100" />

            <div className="h-12 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * ERROR
   * -----------------------------------------
   */

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
          Unable to load product
        </h1>

        <p className="mb-6 text-gray-600">
          {error}
        </p>

        <Link
          href="/shop"
          className="inline-flex rounded px-6 py-2 font-semibold text-white"
          style={{
            backgroundColor: '#C4A57B',
          }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">
            Product not found
          </h1>

          <Link
            href="/shop"
            className="inline-flex rounded px-6 py-2 font-semibold text-white"
            style={{
              backgroundColor: '#C4A57B',
            }}
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * DISCOUNT
   * -----------------------------------------
   */

  const discount = product.originalPrice
    ? Math.round(
      ((product.originalPrice -
        product.price) /
        product.originalPrice) *
      100
    )
    : 0;

  const colorVariants = product.variants ?? [];

  /*
   * -----------------------------------------
   * RENDER
   * -----------------------------------------
   */

  return (
    <main className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* Breadcrumb */}
        <div className="mb-6 hidden text-sm text-gray-500 lg:block">
          <Link
            href="/shop"
            className="transition hover:text-amber-700"
          >
            Shop
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-900">
            {product.name}
          </span>
        </div>

        {/* Main Product Area */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12">

          {/* Product Image */}
          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-xl">
              <ProductImageGallery
                images={
                  selectedImages.length
                    ? selectedImages
                    : resolveGalleryImages(
                      product.variants?.[0]?.images,
                      product.images || product.similar || []
                    )
                }
                productName={product.name}
                defaultImageIndex={0}
              />
            </div>

            {discount > 0 && (
              <div
                className="absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold text-white sm:right-4 sm:top-4 sm:px-4 sm:py-2"
                style={{
                  backgroundColor: '#C4A57B',
                }}
              >
                -{discount}%
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="min-w-0">

            {/* Vendor */}
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
              {product.vendor || 'CRIVON3D'}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-2xl font-normal leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-normal tracking-wide text-gray-900 sm:text-3xl">
                Rs. {product.price.toFixed(2)} INR
              </span>

              {!product.inStock && (
                <span className="rounded-full bg-gray-800 px-3 py-1 text-[11px] font-medium text-white">
                  Sold out
                </span>
              )}

              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  Rs. {product.originalPrice.toFixed(2)} INR
                </span>
              )}
            </div>

            {/* Description */}
            <div
              className="mb-6 text-sm leading-6 text-gray-600 sm:text-base"
            // dangerouslySetInnerHTML={{
            //   __html:
            //     product.description?.replace(
            //       /\r\n|\n/g,
            //       '<br />'
            //     ) || '',
            // }}
            />

            {/* Rating */}
            {product.rating > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-base ${i <
                        Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-sm text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Availability */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Availability
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${product.inStock
                    ? 'bg-green-500'
                    : 'bg-red-500'
                    }`}
                />

                <span
                  className={`text-sm ${product.inStock
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}
                >
                  {product.inStock
                    ? 'In Stock'
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Colors */}
            {colorVariants.length > 0 && (
              <div className="mb-7">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Color
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {colorVariants.map(
                    (variant, index) => {
                      const colorHex =
                        getColorHex(
                          variant.color
                        );

                      const isSelected =
                        selectedColor ===
                        variant.color;

                      return (
                        <div
                          key={`${variant.color}-${index}`}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedColor(variant.color);
                            }}
                            className={`h-10 w-10 rounded-full border-2 transition sm:h-11 sm:w-11 ${isSelected
                              ? 'border-gray-900 ring-2 ring-gray-300'
                              : 'border-gray-300 hover:border-gray-500'
                              }`}
                            style={{
                              backgroundColor:
                                colorHex,
                            }}
                            title={
                              variant.color
                            }
                          />

                          <span className="text-[11px] text-gray-500">
                            {variant.color}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* =================================
                QUANTITY
            ================================== */}

            <div className="mb-6">
              <p className="mb-2 text-sm text-gray-500">
                Quantity
              </p>

              <div className="flex h-12 w-fit items-center overflow-hidden rounded-xl border border-gray-300">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        1,
                        quantity - 1
                      )
                    )
                  }
                  disabled={!product.inStock}
                  className="flex h-full w-12 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  −
                </button>

                <span className="flex h-full w-12 items-center justify-center text-sm text-gray-700">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      quantity + 1
                    )
                  }
                  disabled={!product.inStock}
                  className="flex h-full w-12 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* =================================
                CUSTOMIZE YOUR PRODUCT
            ================================== */}

            {(Number(product.customizable) === 1 ||
              Number(product.image_customizable) === 1) && (
                <div className="mb-6 border-t border-gray-200">

                  <button
                    type="button"
                    onClick={() =>
                      setCustomizeOpen(
                        !customizeOpen
                      )
                    }
                    className="flex w-full items-center justify-between border-b border-gray-200 py-4 text-left text-sm font-medium text-gray-700"
                  >
                    <span>
                      Customize Your Product
                    </span>

                    {customizeOpen ? (
                      <ChevronUp
                        size={18}
                        className="text-gray-500"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className="text-gray-500"
                      />
                    )}
                  </button>

                  {customizeOpen && (
                    <div className="border-b border-gray-200 pb-5 pt-4">
                      <CustomizationForm
                        productName={product.name}
                        customizable={
                          Number(
                            product.customizable
                          ) === 1
                        }
                        imageCustomizable={
                          Number(
                            product.image_customizable
                          ) === 1
                        }
                        onCustomize={(
                          text,
                          image
                        ) => {
                          setCustomName(text);
                          setCustomImage(image);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

            {/* Add To Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                !product.inStock ||
                isAddingToCart
              }
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-semibold tracking-wide transition sm:py-4"
              style={{
                backgroundColor:
                  product.inStock
                    ? '#C4A57B'
                    : '#f5f5f5',

                color: product.inStock
                  ? '#ffffff'
                  : '#c8c8c8',

                borderColor:
                  product.inStock
                    ? '#C4A57B'
                    : '#9ed8eb',
              }}
            >
              {product.inStock && (
                <ShoppingCart size={18} />
              )}

              {isAddingToCart
                ? 'ADDING...'
                : product.inStock
                  ? 'ADD TO CART'
                  : 'SOLD OUT'}
            </button>

            {/* Wishlist + Share */}
            <div className="mb-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  toggleWishlistOnServer(
                    !isWishlisted
                  )
                }
                disabled={
                  isTogglingWishlist
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-medium transition hover:border-gray-500 disabled:opacity-50"
              >
                <Heart
                  size={18}
                  fill={
                    isWishlisted
                      ? '#C4A57B'
                      : 'none'
                  }
                  color={
                    isWishlisted
                      ? '#C4A57B'
                      : 'currentColor'
                  }
                />

                {isTogglingWishlist
                  ? 'PROCESSING...'
                  : isWishlisted
                    ? 'WISHLISTED'
                    : 'WISHLIST'}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-medium transition hover:border-gray-500"
              >
                <Share2 size={18} />
                SHARE
              </button>
            </div>

            {wishlistError && (
              <p className="mb-5 text-sm text-red-600">
                {wishlistError}
              </p>
            )}

            {/* =================================
                ACCORDIONS
            ================================== */}

            <div className="border-t border-gray-200">

              {/* About Product */}
              <div className="border-b border-gray-200">
                <button
                  type="button"
                  onClick={() =>
                    setAboutOpen(
                      !aboutOpen
                    )
                  }
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-700"
                >
                  <span>
                    About Product
                  </span>

                  {aboutOpen ? (
                    <ChevronUp
                      size={18}
                      className="text-gray-500"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-gray-500"
                    />
                  )}
                </button>

                {aboutOpen && (
                  <div className="pb-5 text-sm leading-6 text-gray-600">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          product.description?.replace(
                            /\r\n|\n/g,
                            '<br />'
                          ) || '',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="border-b border-gray-200">
                <button
                  type="button"
                  onClick={() =>
                    setFeaturesOpen(
                      !featuresOpen
                    )
                  }
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-700"
                >
                  <span>
                    Key Features
                  </span>

                  {featuresOpen ? (
                    <ChevronUp
                      size={18}
                      className="text-gray-500"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-gray-500"
                    />
                  )}
                </button>

                {featuresOpen && (
                  <div className="pb-5 text-sm text-gray-600">
                    <div className="space-y-3">

                      <div className="flex justify-between gap-4">
                        <span>
                          SKU
                        </span>

                        <span className="font-medium text-gray-900">
                          {product.sku}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>
                          Category
                        </span>

                        <span className="font-medium text-gray-900">
                          {product.category}
                        </span>
                      </div>

                      {product.tags?.length > 0 && (
                        <div>
                          <span className="mb-2 block">
                            Tags
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {product.tags.map(
                              (tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Shipping */}

          </div>
        </div>

        {/* Related Products */}
        <section className="mt-14 border-t border-gray-100 pt-12 sm:mt-16 sm:pt-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Related Products
          </h2>

          <div className="py-4 text-center text-sm text-gray-400">
            Related products can be rendered here
          </div>
        </section>
      </div>

      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed bottom-4 left-4 right-4 z-50 rounded-xl px-4 py-3 text-center text-sm font-medium text-white shadow-lg sm:left-auto sm:right-5 sm:w-auto ${notificationType === 'success'
            ? 'bg-green-500'
            : 'bg-red-500'
            }`}
        >
          {notificationMessage}
        </div>
      )}
    </main>
  );
}