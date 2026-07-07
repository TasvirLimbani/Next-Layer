'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Share2, Eye } from 'lucide-react';
import Link from 'next/link';
import CustomizationForm from '@/components/products/CustomizationForm';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { useAppContext } from '@/lib/context';
import { useParams } from 'next/navigation';
import { fetchProductById } from '@/lib/products';
import { Product, UserProfile } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 50) + 5);
  const [showNotification, setShowNotification] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [wishlistError, setWishlistError] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
const [notificationMessage, setNotificationMessage] = useState('');
const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');




  // Map color names to hex values
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#10B981',
      'yellow': '#FCD34D',
      'purple': '#A855F7',
      'pink': '#EC4899',
      'orange': '#F97316',
      'black': '#1F2937',
      'white': '#F5F5F5',
      'gray': '#9CA3AF',
      'brown': '#92400E',
      'gold': '#D97706',
      'silver': '#D1D5DB',
      'rose pink': '#F43F5E',
      'sky blue': '#06B6D4',
      'lavender': '#C084FC',
      'coffee brown': '#78350F',
      'jet black': '#000000',
      'terracotta': '#EA580C',
      'bronze': '#92400E',
      'natural': '#C4A57B',
    };
    return colorMap[colorName.toLowerCase()] || '#9CA3AF';
  };

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError('');
        const matchedProduct = await fetchProductById(id);

        console.log("matchedProduct", matchedProduct);

        if (!isActive) {
          return;
        }

        console.log('Matched Product:::::::::::::::::::::     ', fetchProductById(id));
        setProduct(matchedProduct);
        (isInWishlist(matchedProduct.id));
        // Set default selected color to first color
        if (matchedProduct.variants?.length) {
          setSelectedColor(matchedProduct.variants[0].color);
          setSelectedColorIndex(0);
          setSelectedImages(matchedProduct.variants[0].images);
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load product');
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

  // Ensure we reflect server-side wishlist state (in case context is stale)
  useEffect(() => {
    if (!product) return;

    const checkServerWishlist = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return;
        const user = JSON.parse(savedUser) as { id?: string | number };
        if (!user?.id) return;

        const res = await fetch(`/api/wishlist?user_id=${Number(user.id)}`);
        if (!res.ok) return;
        const data = await res.json();

        // Normalized response includes `products` or `wishlist` with product ids
        const products = data?.products || data?.wishlist || [];
        const has = Array.isArray(products)
          ? products.some((p: any) => String(p.id ?? p.product_id ?? p.productId) === String(product.id))
          : false;



        setIsWishlisted(Boolean(has));
      } catch (err) {
        // silently ignore server check errors; UI will fall back to local context
      }
    };

    checkServerWishlist();
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [product]);
  
  

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-5 w-40 rounded bg-gray-100 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded bg-gray-100" />
          <div className="space-y-4">
            <div className="h-8 w-40 rounded bg-gray-100" />
            <div className="h-10 w-3/4 rounded bg-gray-100" />
            <div className="h-6 w-56 rounded bg-gray-100" />
            <div className="h-24 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Unable to load product</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/shop">
          <button
            className="px-6 py-2 text-white rounded font-semibold"
            style={{ backgroundColor: '#C4A57B' }}
          >
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/shop">
            <button
              className="px-6 py-2 text-white rounded font-semibold"
              style={{ backgroundColor: '#C4A57B' }}
            >
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // const handleAddToCart = async () => {
  //   try {
  //     setIsAddingToCart(true);

  //     const savedUser = localStorage.getItem('user');

  //     if (!savedUser) {
  //       throw new Error('Please sign in before adding items to cart.');
  //     }

  //     const user = JSON.parse(savedUser) as { id?: string | number };

  //     if (!user?.id) {
  //       throw new Error('Please sign in before adding items to cart.');
  //     }

  //     const requestBody: {
  //       user_id: number;
  //       sku: string;
  //       customization: string;
  //       quantity: number;
  //     } = {
  //       user_id: Number(user.id),
  //       sku: product.sku,
  //       customization: customName.trim(),
  //       quantity,
  //     };

  //     // const response = await fetch('/api/cart', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //   body: JSON.stringify(requestBody),
  //     // });

  //     const formData = new FormData();

  //     formData.append("user_id", String(user.id));
  //     formData.append("sku", product.sku);
  //     formData.append("quantity", String(quantity));
  //     formData.append("customization", customName);

  //     if (selectedColor) {
  //       formData.append("colour", selectedColor);
  //     }

  //     if (customImage) {
  //       formData.append("customer_image", customImage);
  //     }

  //     const response = await fetch("/api/cart", {
  //       method: "POST",
  //       body: formData,

  //     }
  //     );

  //     for (const pair of formData.entries()) {
  //       console.log(pair[0], pair[1]);
  //     }

  //     const text = await response.text();

  //     console.log(text);

  //     const data = JSON.parse(text);

  //     if (!response.ok || !data?.success) {
  //       throw new Error(data?.message || 'Failed to add product to cart');
  //     }

  //     addToCart({
  //       product,
  //       quantity,
  //       customization: customName.trim() ? { customName: customName.trim() } : undefined,
  //     });

  //     window.dispatchEvent(new Event('cart-updated'));

  //     setShowNotification(true);
  //     setTimeout(() => setShowNotification(false), 3000);
  //   } catch (addError) {
  //     setError(addError instanceof Error ? addError.message : 'Failed to add product to cart');
  //   } finally {
  //     setIsAddingToCart(false);
  //   }
  // };





  const handleAddToCart = async () => {
      // Require custom text
  if (
    Number(product.customizable) === 1 &&
    customName.trim() === ""
  ) {
    setNotificationType("error");
    setNotificationMessage("Please enter custom text.");
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000);
    return;
  }

  // Require custom image
  if (
    Number(product.image_customizable) === 1 &&
    !customImage
  ) {
    setNotificationType("error");
    setNotificationMessage("Please upload a custom image.");
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000);
    return;
  }
    try {
      setIsAddingToCart(true);

      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        throw new Error('Please sign in before adding items to cart.');
      }

      const user = JSON.parse(savedUser) as { id?: string | number };

      if (!user?.id) {
        throw new Error('Please sign in before adding items to cart.');
      }

      const requestBody: {
        user_id: number;
        sku: string;
        customization: string;
        quantity: number;
      } = {
        user_id: Number(user.id),
        sku: product.sku,
        customization: customName.trim(),
        quantity,
      };

      const formData = new FormData();

      formData.append("user_id", Number(user.id).toString());
      formData.append("sku", product.sku);
      formData.append("quantity", String(quantity));
      formData.append("customization", customName);

      if (selectedColor) {
        formData.append("colour", selectedColor);
      }

      if (customImage) {
        formData.append("customer_image", customImage);
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        body: formData,

      }
      );

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const text = await response.text();

      console.log(text);

      const data = JSON.parse(text);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to add product to cart');
      }

      addToCart({
        product,
        quantity,
        customization: customName.trim() ? { customName: customName.trim() } : undefined,
      });

      window.dispatchEvent(new Event('cart-updated'));

  setNotificationType("success");
setNotificationMessage(
  `Added to cart! ${customName ? `(${customName})` : ""}`
);
setShowNotification(true);

setTimeout(() => setShowNotification(false), 3000);
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : 'Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

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
      throw new Error("User not logged in");
    }

    const response = await fetch("/api/wishlist", {
      method: nextWishlisted ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: Number(userId),
        product_id: Number(product.id),
      }),
    });

    const data = await response.json();
    nextWishlisted ? null : removeFromWishlist(product.id);

    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return;
      const user = JSON.parse(savedUser) as { id?: string | number };
      if (!user?.id) return;

      const res = await fetch(`/api/wishlist?user_id=${Number(user.id)}`);
      if (!res.ok) return;
      const data = await res.json();

      // Normalized response includes `products` or `wishlist` with product ids
      const products = data?.products || data?.wishlist || [];
      const has = Array.isArray(products)
        ? products.some((p: any) => String(p.id ?? p.product_id ?? p.productId) === String(product.id))
        : false;

      setIsWishlisted(Boolean(has));
    } catch (err) {
      // silently ignore server check errors; UI will fall back to local context
    }


    if (!response.ok || (!data.success && !data.status)) {
      throw new Error(data.message || "Failed to update wishlist");
    }

    return data;
  };
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-8">
        <Link href="/shop" className="hover:text-amber-700">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="relative">
          <ProductImageGallery
            images={
              selectedImages.length
                ? selectedImages
                : product.variants?.[0]?.images || []
            }
            productName={product.name}
            defaultImageIndex={0}
          />
          {discount > 0 && (
            <div
              className="absolute top-4 right-4 text-white font-bold px-4 py-2 rounded"
              style={{ backgroundColor: '#C4A57B' }}
            >
              -{discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Badge */}
          <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase tracking-widest text-gray-700 mb-4">
            {product.vendor}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-sm font-semibold" style={{ color: '#C4A57B' }}>
                Save ₹{(product.originalPrice! - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Viewers Count */}
          {/* <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded">
            <Eye size={16} style={{ color: '#C4A57B' }} />
            {viewers} people are viewing this right now
          </div> */}

          {/* Stock Status */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Availability:</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Color */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Color:</p>
              <div className="flex gap-4 flex-wrap items-center">
                {product.variants.map((variant, index) => {
                  const trimmedColor = variant.color;
                  const colorHex = getColorHex(trimmedColor);
                  const isSelected = selectedColor === trimmedColor;
                  return (
                    <div key={trimmedColor} className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedColor(variant.color);
                          setSelectedColorIndex(index);
                          setSelectedImages(variant.images);
                        }}
                        className={`w-12 h-12 rounded-full border-3 transition ${isSelected ? 'border-amber-600 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        style={{ backgroundColor: colorHex }}
                        title={trimmedColor}
                      />
                      <span className="text-xs font-medium text-gray-600">{trimmedColor}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <p
            className="text-gray-700 text-base leading-relaxed mb-8"
            dangerouslySetInnerHTML={{
              __html: product.description.replace(/\\r\\n|\r\n|\n/g, "<br />"),
            }}
          />

          {/* Customization Form */}
          {/* {product.customizable && (
            <CustomizationForm
              productName={product.name}
              onCustomize={(name) => setCustomName(name)}
            />
          )} */}

          {(Number(product.customizable) === 1 ||
            Number(product.image_customizable) === 1) && (
              <CustomizationForm
                productName={product.name}
                customizable={Number(product.customizable) === 1}
                imageCustomizable={Number(product.image_customizable) === 1}
                onCustomize={(text, image) => {
                  setCustomName(text);
                  setCustomImage(image);
                }}
              />
            )}


          {/* Quantity Selector */}
          <div className="mb-6 mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                disabled={!product.inStock}
              >
                −
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                disabled={!product.inStock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`w-full py-3 px-6 text-white font-semibold rounded flex items-center justify-center gap-2 transition ${product.inStock ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                }`}
              style={{ backgroundColor: product.inStock ? '#C4A57B' : '#ccc' }}
            >
              <ShoppingCart size={20} />
              {isAddingToCart ? 'ADDING...' : product.inStock ? 'ADD TO CART' : 'SOLD OUT'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => toggleWishlistOnServer(!isWishlisted)}
                disabled={isTogglingWishlist}
                className="flex-1 py-3 border-2 border-gray-300 font-semibold rounded hover:border-amber-600 transition flex items-center justify-center gap-2"
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? '#C4A57B' : 'none'}
                  color={isWishlisted ? '#C4A57B' : 'currentColor'}
                />
                {isTogglingWishlist ? 'PROCESSING...' : isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
              </button>
              <button className="flex-1 py-3 border-2 border-gray-300 font-semibold rounded hover:border-gray-400 transition flex items-center justify-center gap-2">
                <Share2 size={20} />
                SHARE
              </button>
            </div>
            {wishlistError ? <p className="mt-3 text-sm text-red-600">{wishlistError}</p> : null}
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">SKU:</span>
              <span className="font-semibold">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold">{product.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Tags:</span>
              <div className="flex gap-2 mt-2 flex-wrap">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
            <p className="font-semibold mb-1">Shipping & Returns</p>
            <p>Free shipping on orders over ₹100. Returns accepted within 30 days.</p>
          </div>

          {/* Notification */}
          {/* {showNotification && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
              Added to cart! {customName && `(${customName})`}
            </div>
          )} */}

          {showNotification && (
  <div
    className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
      notificationType === "success"
        ? "bg-green-500"
        : "bg-red-500"
    }`}
  >
    {notificationMessage}
  </div>
)}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        {/* Add related products here */}
      </div>
    </div>
  );
}
