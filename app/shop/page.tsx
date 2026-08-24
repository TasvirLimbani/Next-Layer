'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  ArrowRight,
  Menu,
} from 'lucide-react';

import ProductCard from '@/components/products/ProductCard';
import { fetchProducts } from '@/lib/products';
import { Product } from '@/lib/types';

type FilterType = 'availability' | 'price' | null;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [availability, setAvailability] = useState<
    'all' | 'in-stock' | 'out-of-stock'
  >('all');

  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const [sortBy, setSortBy] = useState('alphabetical');

  const [openFilter, setOpenFilter] =
    useState<FilterType>(null);

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await fetchProducts();

        if (!isActive) return;

        setProducts(data);
      } catch (err) {
        if (!isActive) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load products'
        );
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

  /* -----------------------------------------
     PRICE
  ----------------------------------------- */

  const highestPrice = useMemo(() => {
    if (!products.length) return 0;

    return Math.max(
      ...products.map((product) =>
        Number(product.price) || 0
      )
    );
  }, [products]);

  /* -----------------------------------------
     STOCK COUNTS
  ----------------------------------------- */

  const inStockCount = useMemo(
    () =>
      products.filter(
        (product) => product.inStock
      ).length,
    [products]
  );

  const outOfStockCount = useMemo(
    () =>
      products.filter(
        (product) => !product.inStock
      ).length,
    [products]
  );

  /* -----------------------------------------
     FILTER + SORT
  ----------------------------------------- */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Availability */
    if (availability === 'in-stock') {
      result = result.filter(
        (product) => product.inStock
      );
    }

    if (availability === 'out-of-stock') {
      result = result.filter(
        (product) => !product.inStock
      );
    }

    /* Price */
    const from =
      priceFrom.trim() === ''
        ? 0
        : Number(priceFrom);

    const to =
      priceTo.trim() === ''
        ? highestPrice
        : Number(priceTo);

    result = result.filter((product) => {
      const price = Number(product.price);

      return price >= from && price <= to;
    });

    /* Sort */
    switch (sortBy) {
      case 'alphabetical':
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'price-low':
        result.sort(
          (a, b) => a.price - b.price
        );
        break;

      case 'price-high':
        result.sort(
          (a, b) => b.price - a.price
        );
        break;

      case 'rating':
        result.sort(
          (a, b) => b.rating - a.rating
        );
        break;

      case 'latest':
      default:
        break;
    }

    return result;
  }, [
    products,
    availability,
    priceFrom,
    priceTo,
    highestPrice,
    sortBy,
  ]);

  /* -----------------------------------------
     RESET
  ----------------------------------------- */

  const resetFilters = () => {
    setAvailability('all');
    setPriceFrom('');
    setPriceTo('');
    setSortBy('alphabetical');
    setOpenFilter(null);
  };

  /* -----------------------------------------
     LOADING
  ----------------------------------------- */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto mb-12 h-4 w-32 animate-pulse rounded bg-gray-100" />

          <div className="mb-8 flex justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div key={index}>
                  <div className="aspect-square animate-pulse rounded-xl bg-gray-100" />
                  <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="mt-3 h-5 w-32 animate-pulse rounded bg-gray-100" />
                </div>
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  /* -----------------------------------------
     ERROR
  ----------------------------------------- */

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="mb-4 text-2xl font-medium text-gray-900">
            Unable to load products
          </h1>

          <p className="mb-8 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-6 sm:px-8 lg:px-12">

        {/* =====================================
            BREADCRUMB
        ====================================== */}

        <div className="mb-10 flex justify-center">
          <div className="flex items-center gap-2 text-[13px] tracking-wide">
            <span className="text-gray-500">
              Home
            </span>

            <span className="text-gray-400">
              &gt;
            </span>

            <span className="font-medium text-gray-900">
              Products
            </span>
          </div>
        </div>

        {/* =====================================
            DESKTOP FILTER BAR
        ====================================== */}

        <div className="mb-8 hidden items-center justify-between lg:flex">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            <span className="text-sm text-gray-500">
              Filter:
            </span>

            {/* Availability */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFilter(
                    openFilter === 'availability'
                      ? null
                      : 'availability'
                  )
                }
                className={`flex items-center gap-2 text-sm transition ${
                  openFilter === 'availability'
                    ? 'text-gray-900 underline underline-offset-4'
                    : 'text-gray-600'
                }`}
              >
                Availability

                {openFilter ===
                'availability' ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </button>

              {openFilter ===
                'availability' && (
                <AvailabilityPopover
                  value={availability}
                  inStockCount={inStockCount}
                  outOfStockCount={
                    outOfStockCount
                  }
                  onChange={setAvailability}
                  onReset={() =>
                    setAvailability('all')
                  }
                />
              )}
            </div>

            {/* Price */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFilter(
                    openFilter === 'price'
                      ? null
                      : 'price'
                  )
                }
                className={`flex items-center gap-2 text-sm transition ${
                  openFilter === 'price'
                    ? 'text-gray-900 underline underline-offset-4'
                    : 'text-gray-600'
                }`}
              >
                Price

                {openFilter === 'price' ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </button>

              {openFilter === 'price' && (
                <PricePopover
                  highestPrice={highestPrice}
                  priceFrom={priceFrom}
                  priceTo={priceTo}
                  setPriceFrom={
                    setPriceFrom
                  }
                  setPriceTo={setPriceTo}
                  onReset={() => {
                    setPriceFrom('');
                    setPriceTo('');
                  }}
                />
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-8">

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Sort by:
              </span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="cursor-pointer appearance-none border-none bg-transparent pr-6 text-sm text-gray-600 outline-none"
              >
                <option value="alphabetical">
                  Alphabetically, A-Z
                </option>

                <option value="price-low">
                  Price, low to high
                </option>

                <option value="price-high">
                  Price, high to low
                </option>

                <option value="rating">
                  Rating
                </option>

                <option value="latest">
                  Latest
                </option>
              </select>

              <ChevronDown
                size={15}
                className="-ml-7 pointer-events-none text-gray-500"
              />
            </div>

            <span className="text-sm text-gray-500">
              {filteredProducts.length}{' '}
              products
            </span>
          </div>
        </div>

        {/* =====================================
            MOBILE FILTER HEADER
        ====================================== */}

        <div className="mb-6 flex items-center justify-between lg:hidden">

          <button
            type="button"
            onClick={() =>
              setMobileFilterOpen(true)
            }
            className="flex items-center gap-3 text-sm text-gray-700"
          >
            <SlidersHorizontal
              size={16}
              strokeWidth={1.5}
            />

            <span>Filter and sort</span>
          </button>

          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>

        {/* =====================================
            PRODUCT GRID
        ====================================== */}

        {filteredProducts.length > 0 ? (
          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-9
              sm:gap-x-5
              sm:gap-y-10
              lg:grid-cols-4
              lg:gap-x-4
              lg:gap-y-12
            "
          >
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="mb-3 text-xl font-medium text-gray-900">
              No products found
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Try adjusting your filters.
            </p>

            <button
              onClick={resetFilters}
              className="text-sm font-medium text-gray-900 underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* =====================================
          MOBILE FILTER DRAWER
      ====================================== */}

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Overlay */}
          <button
            type="button"
            aria-label="Close filter"
            onClick={() =>
              setMobileFilterOpen(false)
            }
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-[390px] flex-col bg-white shadow-2xl">

            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">

              <div className="flex items-center gap-3">
                <Menu
                  size={20}
                  strokeWidth={1.5}
                />

                <span className="text-sm font-medium text-gray-800">
                  Filter and sort
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center"
              >
                <X
                  size={25}
                  strokeWidth={1.2}
                />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-5">

              {/* Availability */}
              <div className="border-b border-gray-100">

                <button
                  type="button"
                  onClick={() =>
                    setOpenFilter(
                      openFilter ===
                        'availability'
                        ? null
                        : 'availability'
                    )
                  }
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-sm text-gray-600">
                    Availability
                  </span>

                  {openFilter ===
                  'availability' ? (
                    <ChevronUp
                      size={18}
                      className="text-gray-500"
                    />
                  ) : (
                    <ArrowRight
                      size={18}
                      className="text-gray-500"
                    />
                  )}
                </button>

                {openFilter ===
                  'availability' && (
                  <div className="pb-5">
                    <MobileAvailability
                      value={availability}
                      inStockCount={
                        inStockCount
                      }
                      outOfStockCount={
                        outOfStockCount
                      }
                      onChange={
                        setAvailability
                      }
                    />
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-b border-gray-100">

                <button
                  type="button"
                  onClick={() =>
                    setOpenFilter(
                      openFilter === 'price'
                        ? null
                        : 'price'
                    )
                  }
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-sm text-gray-600">
                    Price
                  </span>

                  {openFilter === 'price' ? (
                    <ChevronUp
                      size={18}
                      className="text-gray-500"
                    />
                  ) : (
                    <ArrowRight
                      size={18}
                      className="text-gray-500"
                    />
                  )}
                </button>

                {openFilter === 'price' && (
                  <div className="pb-6">
                    <MobilePrice
                      highestPrice={
                        highestPrice
                      }
                      priceFrom={priceFrom}
                      priceTo={priceTo}
                      setPriceFrom={
                        setPriceFrom
                      }
                      setPriceTo={
                        setPriceTo
                      }
                    />
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="py-6">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Sort by:
                  </span>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value
                        )
                      }
                      className="appearance-none bg-transparent pr-6 text-sm text-gray-500 outline-none"
                    >
                      <option value="alphabetical">
                        Alphabetically, A-Z
                      </option>

                      <option value="price-low">
                        Price, low to high
                      </option>

                      <option value="price-high">
                        Price, high to low
                      </option>

                      <option value="rating">
                        Rating
                      </option>

                      <option value="latest">
                        Latest
                      </option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 p-5">

              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-gray-600 underline underline-offset-4"
              >
                Remove all
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileFilterOpen(
                    false
                  );
                  setOpenFilter(null);
                }}
                className="rounded-xl bg-[#2f9fb7] py-3 text-sm font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =====================================================
   DESKTOP AVAILABILITY POPOVER
===================================================== */

function AvailabilityPopover({
  value,
  inStockCount,
  outOfStockCount,
  onChange,
  onReset,
}: {
  value: 'all' | 'in-stock' | 'out-of-stock';
  inStockCount: number;
  outOfStockCount: number;
  onChange: (
    value:
      | 'all'
      | 'in-stock'
      | 'out-of-stock'
  ) => void;
  onReset: () => void;
}) {
  const selectedCount =
    value === 'all' ? 0 : 1;

  return (
    <div className="absolute left-[-12px] top-8 z-50 w-[350px] rounded-2xl border border-gray-200 bg-white shadow-lg">

      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <span className="text-sm text-gray-500">
          {selectedCount} selected
        </span>

        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-600 underline underline-offset-4"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="availability"
            checked={value === 'in-stock'}
            onChange={() =>
              onChange('in-stock')
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-600">
            In stock ({inStockCount})
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="availability"
            checked={
              value === 'out-of-stock'
            }
            onChange={() =>
              onChange('out-of-stock')
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-600">
            Out of stock ({outOfStockCount})
          </span>
        </label>
      </div>
    </div>
  );
}

/* =====================================================
   DESKTOP PRICE POPOVER
===================================================== */

function PricePopover({
  highestPrice,
  priceFrom,
  priceTo,
  setPriceFrom,
  setPriceTo,
  onReset,
}: {
  highestPrice: number;
  priceFrom: string;
  priceTo: string;
  setPriceFrom: (value: string) => void;
  setPriceTo: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute left-[-12px] top-8 z-50 w-[350px] rounded-2xl border border-gray-200 bg-white shadow-lg">

      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <span className="text-sm text-gray-500">
          The highest price is Rs.{' '}
          {highestPrice.toLocaleString(
            'en-IN',
            {
              minimumFractionDigits: 2,
            }
          )}
        </span>

        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-600 underline underline-offset-4"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-4 px-5 py-5">

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={priceFrom}
            onChange={(e) =>
              setPriceFrom(e.target.value)
            }
            placeholder="From"
            className="h-12 w-[130px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={priceTo}
            onChange={(e) =>
              setPriceTo(e.target.value)
            }
            placeholder="To"
            className="h-12 w-[130px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-500"
          />
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   MOBILE AVAILABILITY
===================================================== */

function MobileAvailability({
  value,
  inStockCount,
  outOfStockCount,
  onChange,
}: {
  value: 'all' | 'in-stock' | 'out-of-stock';
  inStockCount: number;
  outOfStockCount: number;
  onChange: (
    value:
      | 'all'
      | 'in-stock'
      | 'out-of-stock'
  ) => void;
}) {
  return (
    <div className="space-y-4">

      <label className="flex items-center gap-3">
        <input
          type="radio"
          checked={value === 'in-stock'}
          onChange={() =>
            onChange('in-stock')
          }
          className="h-4 w-4"
        />

        <span className="text-sm text-gray-600">
          In stock ({inStockCount})
        </span>
      </label>

      <label className="flex items-center gap-3">
        <input
          type="radio"
          checked={
            value === 'out-of-stock'
          }
          onChange={() =>
            onChange('out-of-stock')
          }
          className="h-4 w-4"
        />

        <span className="text-sm text-gray-600">
          Out of stock ({outOfStockCount})
        </span>
      </label>
    </div>
  );
}

/* =====================================================
   MOBILE PRICE
===================================================== */

function MobilePrice({
  highestPrice,
  priceFrom,
  priceTo,
  setPriceFrom,
  setPriceTo,
}: {
  highestPrice: number;
  priceFrom: string;
  priceTo: string;
  setPriceFrom: (value: string) => void;
  setPriceTo: (value: string) => void;
}) {
  return (
    <div>

      <p className="mb-4 text-sm text-gray-500">
        The highest price is Rs.{' '}
        {highestPrice.toLocaleString(
          'en-IN',
          {
            minimumFractionDigits: 2,
          }
        )}
      </p>

      <div className="flex items-center gap-3">

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={priceFrom}
            onChange={(e) =>
              setPriceFrom(e.target.value)
            }
            placeholder="From"
            className="h-12 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={priceTo}
            onChange={(e) =>
              setPriceTo(e.target.value)
            }
            placeholder="To"
            className="h-12 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          />
        </div>
      </div>
    </div>
  );
}