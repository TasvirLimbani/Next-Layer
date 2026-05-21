'use client';

import { useAppContext } from '@/lib/context';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useAppContext();

  const wishlistProducts = MOCK_PRODUCTS.filter((product) =>
    wishlist.some((item) => item.productId === product.id)
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">
            Start adding your favorite 3D printed products to your wishlist
          </p>
          <Link href="/shop">
            <button
              className="px-8 py-3 text-white font-semibold rounded hover:opacity-90 transition"
              style={{ backgroundColor: '#C4A57B' }}
            >
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Ready to check out?</p>
        <Link href="/cart">
          <button
            className="px-8 py-3 text-white font-semibold rounded hover:opacity-90 transition flex items-center gap-2 mx-auto"
            style={{ backgroundColor: '#C4A57B' }}
          >
            <ShoppingBag size={20} />
            GO TO CART
          </button>
        </Link>
      </div>
    </div>
  );
}
