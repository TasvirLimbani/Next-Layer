'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Share2, Eye } from 'lucide-react';
import Link from 'next/link';
import CustomizationForm from '@/components/products/CustomizationForm';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { useAppContext } from '@/lib/context';
import { useParams } from 'next/navigation';
import { fetchProductById } from '@/lib/products';
import { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 50) + 5);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError('');
        const matchedProduct = await fetchProductById(id);

        if (!isActive) {
          return;
        }

        setProduct(matchedProduct);
        setIsWishlisted(isInWishlist(matchedProduct.id));
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

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      customization: customName ? { customName } : undefined,
    });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleWishlist = () => {
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
            images={product.images || [product.image]}
            productName={product.name}
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
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
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
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded">
            <Eye size={16} style={{ color: '#C4A57B' }} />
            {viewers} people are viewing this right now
          </div>

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

          {/* Description */}
          <p className="text-gray-700 text-base leading-relaxed mb-8">{product.description}</p>

          {/* Customization Form */}
          {product.customizable && (
            <CustomizationForm
              productName={product.name}
              onCustomize={(name) => setCustomName(name)}
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
              disabled={!product.inStock}
              className={`w-full py-3 px-6 text-white font-semibold rounded flex items-center justify-center gap-2 transition ${product.inStock ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                }`}
              style={{ backgroundColor: product.inStock ? '#C4A57B' : '#ccc' }}
            >
              <ShoppingCart size={20} />
              {product.inStock ? 'ADD TO CART' : 'SOLD OUT'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleWishlist}
                className="flex-1 py-3 border-2 border-gray-300 font-semibold rounded hover:border-amber-600 transition flex items-center justify-center gap-2"
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? '#C4A57B' : 'none'}
                  color={isWishlisted ? '#C4A57B' : 'currentColor'}
                />
                {isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
              </button>
              <button className="flex-1 py-3 border-2 border-gray-300 font-semibold rounded hover:border-gray-400 transition flex items-center justify-center gap-2">
                <Share2 size={20} />
                SHARE
              </button>
            </div>
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
          {showNotification && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
              Added to cart! {customName && `(${customName})`}
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
