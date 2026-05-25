'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { fetchBestSellerProducts } from '@/lib/products';
import { Product } from '@/lib/types';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadBestSellers = async () => {
      try {
        setLoading(true);
        const bestSellers = await fetchBestSellerProducts();

        if (isActive) {
          setProducts(bestSellers);
          setError('');
        }
      } catch {
        if (isActive) {
          setError('Failed to load best sellers.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadBestSellers();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Best Sellers</h2>
          <p className="text-gray-600 text-lg mb-8">
            Discover our most loved 3D printed products trusted by thousands
          </p>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: '#C4A57B' }} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-80 rounded-lg bg-gray-100 animate-pulse" />
            ))}

          {!loading && error && (
            <p className="col-span-full text-center text-sm text-gray-500">{error}</p>
          )}

          {!loading && !error && products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/shop">
            <button
              className="px-8 py-3 font-semibold rounded transition hover:opacity-90"
              style={{ backgroundColor: '#C4A57B', color: 'white' }}
            >
              VIEW ALL PRODUCTS
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
