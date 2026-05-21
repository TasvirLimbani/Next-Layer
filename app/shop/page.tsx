'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/products/FilterSidebar';
import SortDropdown from '@/components/products/SortDropdown';
import { fetchProducts } from '@/lib/products';
import { Product } from '@/lib/types';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('latest');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await fetchProducts();

        if (!isActive) {
          return;
        }

        setProducts(data);

        if (data.length > 0) {
          const maxPrice = Math.ceil(Math.max(...data.map((product) => product.price)));
          setPriceRange([0, maxPrice]);
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load products');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  const availableCategories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  const maxPrice = useMemo(
    () => (products.length > 0 ? Math.ceil(Math.max(...products.map((product) => product.price))) : 200),
    [products]
  );

  const filteredAndSortedProducts = useMemo(() => {
    // Filter by category
    let filtered = products.filter((product) => {
      if (selectedCategory === 'All Products') return true;
      return product.category === selectedCategory;
    });

    // Filter by price
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    const sorted = [...filtered];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'best-sellers':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
      default:
        // Keep original order (latest)
        break;
    }

    return sorted;
  }, [products, selectedCategory, priceRange, sortBy]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Shop Our Products</h1>
          <p className="text-gray-600 text-lg">Loading products from the live catalog...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-6 w-32 rounded bg-gray-100 mb-6" />
            <div className="h-28 rounded bg-gray-100 mb-4" />
            <div className="h-40 rounded bg-gray-100" />
          </aside>
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="aspect-square rounded bg-gray-100 mb-4" />
                  <div className="h-4 w-20 rounded bg-gray-100 mb-2" />
                  <div className="h-5 w-full rounded bg-gray-100 mb-2" />
                  <div className="h-4 w-28 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Unable to load products</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded bg-gray-900 text-white font-semibold hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Shop Our Products</h1>
        <p className="text-gray-600 text-lg">
          Browse our collection of premium 3D printed products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <FilterSidebar
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            maxPrice={maxPrice}
            categories={availableCategories}
            onCategoryChange={setSelectedCategory}
            onPriceChange={setPriceRange}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredAndSortedProducts.length}</span> products
            </div>
            <SortDropdown selectedSort={sortBy} onSortChange={setSortBy} />
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <p className="text-gray-500">
                Try adjusting your filters to find what you&apos;re looking for
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Products');
                  setPriceRange([0, maxPrice]);
                }}
                className="mt-6 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition font-semibold text-sm"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
