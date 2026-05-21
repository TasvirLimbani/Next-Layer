'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import Link from 'next/link';
import { TAX_RATE, STANDARD_SHIPPING, SHIPPING_FREE_THRESHOLD } from '@/lib/constants';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, clearCart } = useAppContext();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > SHIPPING_FREE_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
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

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center border border-green-200 rounded-lg p-8 bg-green-50">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4 text-green-700">Order Placed Successfully!</h1>
          <p className="text-gray-700 mb-4">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-600 mb-8">
            Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <Link href="/">
            <button
              className="px-8 py-3 text-white font-semibold rounded hover:opacity-90 transition"
              style={{ backgroundColor: '#C4A57B' }}
            >
              BACK TO HOME
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Step Indicator */}
          <div className="flex gap-4 mb-8">
            {(['shipping', 'payment', 'review'] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step === s
                      ? 'text-white'
                      : idx < (['shipping', 'payment', 'review'] as const).indexOf(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  style={
                    step === s
                      ? { backgroundColor: '#C4A57B' }
                      : idx < (['shipping', 'payment', 'review'] as const).indexOf(step)
                      ? { backgroundColor: '#4CAF50' }
                      : {}
                  }
                >
                  {idx < (['shipping', 'payment', 'review'] as const).indexOf(step) ? '✓' : idx + 1}
                </div>
                <span className="font-semibold capitalize">{s}</span>
              </div>
            ))}
          </div>

          {/* Shipping Form */}
          {step === 'shipping' && (
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full py-3 text-white font-semibold rounded hover:opacity-90 transition mt-6"
                style={{ backgroundColor: '#C4A57B' }}
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}

          {/* Payment Form */}
          {step === 'payment' && (
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>

              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                maxLength="19"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  maxLength="5"
                  required
                />
                <input
                  type="text"
                  name="cardCVC"
                  placeholder="CVC"
                  value={formData.cardCVC}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  maxLength="4"
                  required
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep('shipping')}
                  className="flex-1 py-3 border-2 border-gray-300 font-semibold rounded hover:bg-gray-50 transition"
                >
                  BACK
                </button>
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 py-3 text-white font-semibold rounded hover:opacity-90 transition"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  REVIEW ORDER
                </button>
              </div>
            </div>
          )}

          {/* Review Order */}
          {step === 'review' && (
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold mb-4">Review Your Order</h2>

              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping To</p>
                  <p className="font-semibold">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold">
                    •••• {formData.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 py-3 border-2 border-gray-300 font-semibold rounded hover:bg-gray-50 transition"
                >
                  BACK
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 py-3 text-white font-semibold rounded hover:opacity-90 transition disabled:opacity-50"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm pb-3 border-b">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    {item.customization?.customName && (
                      <p className="text-xs text-amber-700">Custom: {item.customization.customName}</p>
                    )}
                  </div>
                  <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-3">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
