'use client';

import { useAppContext } from '@/lib/context';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag } from 'lucide-react';
import { TAX_RATE, STANDARD_SHIPPING, SHIPPING_FREE_THRESHOLD } from '@/lib/constants';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem } = useAppContext();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > SHIPPING_FREE_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-sm transition"
              >
                {/* Image */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.product.id}`}>
                    <h3 className="font-semibold hover:text-amber-700 transition line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{item.product.vendor}</p>

                  {item.customization?.customName && (
                    <p className="text-xs bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                      Customized: {item.customization.customName}
                    </p>
                  )}

                  <p className="font-semibold text-gray-900">₹{item.product.price.toFixed(2)}</p>
                </div>

                {/* Quantity and Total */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 hover:bg-red-50 rounded transition text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateCartItem(item.product.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartItem(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
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

        {/* Order Summary */}
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
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
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
