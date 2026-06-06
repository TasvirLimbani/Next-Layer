'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag } from 'lucide-react';
import { TAX_RATE, STANDARD_SHIPPING, SHIPPING_FREE_THRESHOLD } from '@/lib/constants';
import { fetchUserCart, RemoteCartItem } from '@/lib/cart';
import { UserProfile } from '@/lib/types';

export default function CartPage() {
  const [cart, setCart] = useState<RemoteCartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const loadCart = useCallback(async () => {
    let isActive = true;

    try {
      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        if (isActive) {
          setCart([]);
          setGrandTotal(0);
          setError('No user found in localStorage.');
        }
        return;
      }

      const user = JSON.parse(savedUser) as UserProfile;

      if (!user?.id) {
        if (isActive) {
          setCart([]);
          setGrandTotal(0);
          setError('No valid user id found in localStorage.');
        }
        return;
      }

      const remoteCart = await fetchUserCart(String(user.id));

      if (isActive) {
        setCart(remoteCart.items);
        setGrandTotal(remoteCart.grandTotal);
        setError('');
      }
    } catch {
      if (isActive) {
        setCart([]);
        setGrandTotal(0);
        setError('Failed to load your cart.');
      }
    } finally {
      if (isActive) {
        setLoading(false);
      }
    }

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleDelete = async (cartId: string) => {
    try {
      setDeletingId(cartId);

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: Number(cartId) }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to delete cart item');
      }

      window.dispatchEvent(new Event('cart-updated'));

      setLoading(true);
      await loadCart();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete cart item');
    } finally {
      setDeletingId('');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalAmount, 0);
  const shipping = grandTotal > SHIPPING_FREE_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = (grandTotal || subtotal) * TAX_RATE;
  const total = grandTotal || subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="space-y-4">
          <div className="h-10 w-48 rounded bg-gray-100 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="h-32 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
            <div className="h-80 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Start shopping and add some amazing 3D printed products to your cart
          </p>
          <Link href="/shop">
            <button
              className="px-8 py-3 text-white font-semibold rounded hover:opacity-90 transition"
              style={{ backgroundColor: '#C4A57B' }}
            >
              CONTINUE SHOPPING
            </button>
          </Link>
          {error && <p className="mt-4 text-sm text-amber-700">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      {error && <p className="mb-6 text-sm text-amber-700">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-sm transition"
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                  <Image
                    src={`/api/image-proxy?url=${encodeURIComponent(item.product.image)}`}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.product.id}`}>
                    <h3 className="font-semibold hover:text-amber-700 transition line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{item.product.vendor}</p>

                  {item.extra && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.extra.customization && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Custom: {item.extra.customization}
                        </span>
                      )}

                      {item.extra.colour && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Colour: {item.extra.colour}
                        </span>
                      )}

                      {item.extra.diameter && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Diameter: {item.extra.diameter}
                        </span>
                      )}

                      {item.extra.weight && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Weight: {item.extra.weight}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="font-semibold text-gray-900">₹{item.product.price.toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold">Qty</span>
                    <span className="w-6 text-center font-semibold text-gray-900">{item.quantity}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(item.cartId)}
                    className="p-1 hover:bg-red-50 rounded transition text-red-600 disabled:opacity-50"
                    disabled={deletingId === item.cartId}
                    aria-label={`Delete ${item.product.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>

                  <p className="font-bold">₹{item.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/shop">
            <button className="mt-6 text-amber-700 hover:text-amber-800 font-semibold transition">
              ← Continue Shopping
            </button>
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Free shipping on orders over ₹{SHIPPING_FREE_THRESHOLD}
                </p>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <button
                className="w-full py-3 text-white font-semibold rounded hover:opacity-90 transition mb-2"
                style={{ backgroundColor: '#C4A57B' }}
              >
                PROCEED TO CHECKOUT
              </button>
            </Link>

            <button className="w-full py-3 border-2 border-gray-300 font-semibold rounded hover:bg-gray-50 transition">
              CONTINUE SHOPPING
            </button>

            <div className="mt-6 pt-6 border-t text-xs text-gray-600 space-y-2">
              <p>✓ Secure checkout</p>
              <p>✓ Money-back guarantee</p>
              <p>✓ Fast shipping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
