'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
} from 'lucide-react';

import {
  TAX_RATE,
  STANDARD_SHIPPING,
  SHIPPING_FREE_THRESHOLD,
} from '@/lib/constants';

import {
  fetchUserCart,
  RemoteCartItem,
} from '@/lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState<RemoteCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  /* --------------------------------------------------
     LOAD CART
  -------------------------------------------------- */

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        setCart([]);
        setError('Please login first.');
        return;
      }

      const user = JSON.parse(savedUser);

      const userId = user?.id || user?.user_id;

      if (!userId) {
        setCart([]);
        setError('User ID not found.');
        return;
      }

      const remoteCart = await fetchUserCart(String(userId));

      setCart(Array.isArray(remoteCart?.items) ? remoteCart.items : []);
    } catch (err) {
      console.error('Cart loading error:', err);

      setCart([]);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load your cart.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* --------------------------------------------------
     DELETE ITEM
  -------------------------------------------------- */

  const handleDelete = async (cartId: string) => {
    if (deletingId) return;

    try {
      setDeletingId(cartId);
      setError('');

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(cartId),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || 'Failed to delete cart item'
        );
      }

      window.dispatchEvent(new Event('cart-updated'));

      setCart((current) =>
        current.filter(
          (item) => item.cartId !== cartId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete cart item'
      );
    } finally {
      setDeletingId('');
    }
  };

  /* --------------------------------------------------
     TOTALS
  -------------------------------------------------- */

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const shipping =
    subtotal >= SHIPPING_FREE_THRESHOLD
      ? 0
      : STANDARD_SHIPPING;

  const tax = subtotal * TAX_RATE;

  const total = subtotal + shipping + tax;

  /* --------------------------------------------------
     LOADING
  -------------------------------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-100" />

            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">

            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-100 p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-28 shrink-0 animate-pulse rounded-xl bg-gray-100 sm:h-36 sm:w-36" />

                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-1/4 animate-pulse rounded bg-gray-100" />
                      <div className="h-6 w-1/4 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[420px] animate-pulse rounded-2xl bg-gray-100" />

          </div>
        </div>
      </main>
    );
  }

  /* --------------------------------------------------
     EMPTY CART
  -------------------------------------------------- */

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-16">

          <div className="w-full text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <ShoppingBag
                size={34}
                className="text-gray-400"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Looks like you haven't added anything to your
              cart yet. Explore our products and find something
              you love.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: '#C4A57B',
              }}
            >
              CONTINUE SHOPPING
            </Link>

            {error && (
              <p className="mt-5 text-sm text-amber-700">
                {error}
              </p>
            )}

          </div>
        </div>
      </main>
    );
  }

  /* --------------------------------------------------
     CART PAGE
  -------------------------------------------------- */

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* HEADER */}

        <div className="mb-7 sm:mb-10">

          <Link
            href="/shop"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {cart.length}{' '}
                {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            {/* <div className="hidden text-sm text-gray-500 sm:block">
              Free shipping on orders over ₹
              {SHIPPING_FREE_THRESHOLD}
            </div> */}

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">

          {/* ==============================================
              PRODUCTS
          ============================================== */}

          <section className="min-w-0">

            <div className="space-y-4 sm:space-y-5">

              {cart.map((item, index) => (

                <article
                  key={item.cartId}
                  className={`
                    group relative overflow-hidden rounded-2xl
                    border border-gray-200 bg-white
                    p-3 shadow-sm
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-lg
                    sm:p-5
                    ${deletingId === item.cartId
                      ? 'pointer-events-none opacity-50 scale-[0.98]'
                      : ''
                    }
                  `}
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">

                    {/* PRODUCT IMAGE */}

                    <Link
                      href={`/shop/${item.product.id}`}
                      className="relative block w-full shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-36 sm:w-36"
                    >

                      <div className="relative aspect-square w-full sm:h-full sm:aspect-auto">

                        <Image
                          src={`/api/image-proxy?url=${encodeURIComponent(
                            item.product.image
                          )}`}
                          alt={item.product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, 144px"
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        />

                      </div>

                    </Link>

                    {/* PRODUCT CONTENT */}

                    <div className="flex min-w-0 flex-1 flex-col">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400 sm:text-xs">
                            {item.product.vendor}
                          </p>

                          <Link
                            href={`/shop/${item.product.id}`}
                          >
                            <h2 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition-colors hover:text-amber-700 sm:text-lg">
                              {item.product.name}
                            </h2>
                          </Link>

                        </div>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.cartId)
                          }
                          disabled={
                            deletingId === item.cartId
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                          aria-label={`Delete ${item.product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                      {/* CUSTOM OPTIONS */}

                      {item.extra && (
                        <div className="mt-3">

                          <div className="flex flex-wrap gap-1.5">

                            {item.extra.customization && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                Custom: {item.extra.customization}
                              </span>
                            )}

                            {item.extra.colour && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                Colour: {item.extra.colour}
                              </span>
                            )}

                            {item.extra.diameter && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                Diameter: {item.extra.diameter}
                              </span>
                            )}

                            {item.extra.weight && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                Weight: {item.extra.weight}
                              </span>
                            )}

                          </div>

                          {/* CUSTOMER IMAGE */}

                          {item.extra.customer_image && (
                            <div className="mt-3 flex items-center gap-3">

                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                <Image
                                  src={`/api/image-proxy?url=${encodeURIComponent(
                                    item.extra.customer_image
                                  )}`}
                                  alt="Customer uploaded image"
                                  fill
                                  unoptimized
                                  className="object-contain p-1"
                                />
                              </div>

                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                                  Customer Image
                                </p>

                                <p className="mt-0.5 text-xs text-gray-600">
                                  Custom uploaded design
                                </p>
                              </div>

                            </div>
                          )}

                        </div>
                      )}

                      {/* BOTTOM */}

                      <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-3 sm:mt-auto sm:flex-row sm:items-end sm:justify-between">

                        {/* PRICE */}

                        <div>
                          <p className="text-xs text-gray-400">
                            Price
                          </p>

                          <p className="mt-0.5 text-lg font-bold text-gray-950">
                            ₹
                            {Number(
                              item.product.price
                            ).toFixed(2)}
                          </p>
                        </div>

                        {/* QTY */}

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
{/* 
                          <span className="text-xs font-medium text-gray-500">
                            Quantity
                          </span> */}

                          {/* <div className="flex h-9 items-center rounded-lg border border-gray-200 bg-gray-50">

                            <button
                              type="button"
                              disabled
                              className="flex h-full w-9 items-center justify-center text-gray-300"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="flex h-full min-w-8 items-center justify-center border-x border-gray-200 bg-white px-2 text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              disabled
                              className="flex h-full w-9 items-center justify-center text-gray-300"
                            >
                              <Plus size={14} />
                            </button>

                          </div> */}

                          <div className="text-right">

                            <p className="text-[10px] text-gray-400">
                              Item Total
                            </p>

                            <p className="text-base font-bold text-gray-950">
                              ₹
                              {Number(
                                item.totalAmount
                              ).toFixed(2)}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>

              ))}

            </div>

            {/* CONTINUE SHOPPING */}

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-amber-700"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>

          </section>

          {/* ==============================================
              ORDER SUMMARY
          ============================================== */}

          <aside className="lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">

              {/* SUMMARY HEADER */}

              <div className="border-b border-gray-200 bg-white px-5 py-5 sm:px-6">

                <h2 className="text-xl font-bold text-gray-950">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your order before checkout
                </p>

              </div>

              {/* SUMMARY CONTENT */}

              <div className="px-5 py-5 sm:px-6">

                <div className="space-y-4 text-sm">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-semibold text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">
                          FREE
                        </span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>

                  </div>

                  {shipping > 0 && (
                    <div className="rounded-lg bg-white px-3 py-2.5 text-xs leading-5 text-gray-500">
                      Add ₹
                      {Math.max(
                        0,
                        SHIPPING_FREE_THRESHOLD - subtotal
                      ).toFixed(2)}{' '}
                      more to get free shipping.
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-gray-500">
                      Tax ({Math.round(TAX_RATE * 100)}%)
                    </span>

                    <span className="font-semibold text-gray-900">
                      ₹{tax.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* TOTAL */}

                <div className="my-5 border-t border-gray-200" />

                <div className="flex items-center justify-between gap-4">

                  <span className="text-base font-bold text-gray-950">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-950">
                    ₹{total.toFixed(2)}
                  </span>

                </div>

                {/* CHECKOUT */}

                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  style={{
                    backgroundColor: '#C4A57B',
                  }}
                >
                  CONTINUE TO CHECKOUT
                </Link>

                <Link
                  href="/shop"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 hover:border-gray-300 hover:bg-gray-100"
                >
                  CONTINUE SHOPPING
                </Link>

              </div>

              {/* BENEFITS */}

              <div className="border-t border-gray-200 bg-white px-5 py-5 sm:px-6">

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50">
                      <ShieldCheck
                        size={17}
                        className="text-gray-700"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Secure Checkout
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-500">
                        Your payment is protected
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50">
                      <Truck
                        size={17}
                        className="text-gray-700"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Fast Shipping
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-500">
                        Reliable delivery
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50">
                      <RotateCcw
                        size={17}
                        className="text-gray-700"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Easy Support
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-500">
                        We're here to help
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}