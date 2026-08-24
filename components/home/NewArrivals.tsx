'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { fetchLatestProducts } from '@/lib/products';
import { Product } from '@/lib/types';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadLatestProducts = async () => {
      try {
        setLoading(true);

        const latestProducts = await fetchLatestProducts();

        if (isActive) {
          setProducts(latestProducts);
          setError('');
        }
      } catch (error) {
        console.error('Failed to load new arrivals:', error);

        if (isActive) {
          setError('Failed to load new arrivals.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadLatestProducts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-1">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}
        <div className="mb-7 text-center sm:mb-9 md:mb-12">
          <h2
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-gray-900
              sm:text-3xl
              md:text-4xl
            "
          >
            New Arrivals
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-2xl
              px-2
              text-sm
              leading-5
              text-gray-600
              sm:mt-3
              sm:text-base
              md:text-lg
              md:leading-7
            "
          >
            Discover our latest 3D printed products trusted by thousands
          </p>

          {/* Decorative line */}
          <div
            className="
              mx-auto
              mt-4
              h-1
              w-12
              rounded-full
              sm:mt-5
              sm:w-16
            "
            style={{ backgroundColor: '#C4A57B' }}
          />
        </div>

        {/* =========================
            PRODUCTS GRID

            Mobile  : 2 columns
            Tablet  : 2 columns
            Desktop : 4 columns
        ========================== */}
        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-7
            sm:gap-x-4
            sm:gap-y-9
            md:grid-cols-2
            md:gap-6
            lg:grid-cols-4
            lg:gap-6
          "
        >
          {/* Loading Skeletons */}
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-full min-w-0 overflow-hidden rounded-xl bg-white"
              >
                {/* Image skeleton */}
                <div
                  className="
                    aspect-square
                    w-full
                    animate-pulse
                    rounded-xl
                    bg-gray-100
                  "
                />

                {/* Text skeleton */}
                <div className="pt-3 sm:pt-4">
                  <div className="h-3 w-11/12 animate-pulse rounded bg-gray-100" />

                  <div className="mt-2 h-3 w-8/12 animate-pulse rounded bg-gray-100" />

                  <div className="mt-3 h-4 w-6/12 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}

          {/* Error */}
          {!loading && error && (
            <div className="col-span-2 py-10 text-center lg:col-span-4">
              <p className="text-sm text-gray-500">
                {error}
              </p>
            </div>
          )}

          {/* Products */}
          {!loading &&
            !error &&
            products.map((product) => (
              <div
                key={product.id}
                className="w-full min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}