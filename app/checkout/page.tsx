'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { fetchUserCart, RemoteCartItem } from '@/lib/cart';
import { UserProfile } from '@/lib/types';

type AddressRecord = {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type AddressResponse = {
  status?: boolean;
  addresses?: AddressRecord[];
  message?: string;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useAppContext();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [remoteCart, setRemoteCart] = useState<RemoteCartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState('');
  const [savedAddress, setSavedAddress] = useState<AddressRecord | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const applyUserProfile = useCallback((user: UserProfile, address?: AddressRecord | null) => {
    setFormData((prev) => ({
      ...prev,
      email: user.email || prev.email,
      firstName: (user.name || '').trim() || prev.firstName,
      address: address?.address || user.address || prev.address,
      city: address?.city || prev.city,
      state: address?.state || prev.state,
      zipCode: address?.pincode || prev.zipCode,
    }));
  }, []);

  const loadCart = useCallback(async () => {
    try {
      setLoadingCart(true);
      setCartError('');

      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        setRemoteCart([]);
        return;
      }

      const user = JSON.parse(savedUser) as UserProfile;

      if (!user?.id) {
        setRemoteCart([]);
        setCartError('No valid user id found in localStorage.');
        return;
      }

      const remote = await fetchUserCart(String(user.id));
      setRemoteCart(remote.items);

      applyUserProfile(user, null);


      try {
        const addressResponse = await fetch(`/api/address?user_id=${encodeURIComponent(String(user.id))}`, {
          cache: 'no-store',
        });

        const addressData = (await addressResponse.json()) as AddressResponse;

        if (addressResponse.ok && addressData.status) {
          const nextAddress = Array.isArray(addressData.addresses) ? addressData.addresses[0] ?? null : null;
          setSavedAddress(nextAddress);
          applyUserProfile(user, nextAddress);
        }
      } catch {
        setSavedAddress(null);
      }
    } catch {
      setRemoteCart([]);
      setCartError('Failed to load your cart.');
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const visibleCart = remoteCart.length > 0 ? remoteCart : cart;
  const subtotal = visibleCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

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

  const handleWhatsAppCheckout = () => {
    const orderId = `ORD-${Date.now()}`;

    let message = `🛍️ *New Order*\n\n`;

    message += `📦 Order ID: ${orderId}\n\n`;

    message += `👤 Customer Details\n`;
    message += `Name: ${formData.firstName}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Address: ${formData.address}\n`;
    message += `City: ${formData.city}\n`;
    message += `State: ${formData.state}\n`;
    message += `Zip Code: ${formData.zipCode}\n\n`;

    message += `🛒 Order Items\n`;

    // visibleCart.forEach((item, index) => {
    //   message += `${index + 1}. ${item.product.name}\n`;
    //   message += `   Qty: ${item.quantity}\n`;
    //   message += `   Price: ₹${item.product.price}\n`;

    //   if (
    //     typeof item.customization === "string" &&
    //     item.customization.trim()
    //   ) {
    //     message += `   Custom: ${item.customization}\n`;
    //   }

    //   message += `\n`;
    // });
    visibleCart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;

      message += `SKU: ${item.product.sku || 'N/A'}\n`;
      message += `Qty: ${item.quantity}\n`;
      message += `Price: ₹${item.product.price}\n`;

      if (
        typeof item.customization === "string" &&
        item.customization.trim()
      ) {
        message += `Custom: ${item.customization}\n`;
      }

      message += `\n`;
    });

    message += `💰 Total: ₹${total.toFixed(2)}\n`;

    const phoneNumber = "919723553038"; // Your WhatsApp Number

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (!loadingCart && visibleCart.length === 0 && !orderPlaced) {
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

  if (loadingCart && !orderPlaced) {
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step === s
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

              <input
                type="text"
                name="firstName"
                placeholder="Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />

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
              </div>

              {/* <button
                onClick={() => setStep('payment')}
                className="w-full py-3 text-white font-semibold rounded hover:opacity-90 transition mt-6"
                style={{ backgroundColor: '#C4A57B' }}
              >
                CONTINUE TO PAYMENT
              </button> */}

              <button
                onClick={handleWhatsAppCheckout}
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
                maxLength={19}
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
                  maxLength={5}
                  required
                />
                <input
                  type="text"
                  name="cardCVC"
                  placeholder="CVC"
                  value={formData.cardCVC}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  maxLength={4}
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
                    {formData.firstName}
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
              {visibleCart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm pb-3 border-b">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    {typeof item.customization === 'string' && item.customization.trim() && (
                      <p className="text-xs text-amber-700">Custom: {item.customization}</p>
                    )}
                  </div>
                  <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {cartError ? <p className="mb-4 text-xs text-amber-700">{cartError}</p> : null}

            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
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
