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
  const [checkoutCart, setCheckoutCart] = useState<RemoteCartItem[]>([]);

  useEffect(() => {
    if (remoteCart.length > 0) {
      setCheckoutCart(remoteCart);
    } else if (cart.length > 0) {
      setCheckoutCart(cart as any);
    }
  }, [remoteCart, cart]);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    phone: '',
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
      phone: user.phone || prev.phone,
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
      console.log("Cart Data:::::::::::::::::", remote.items);
      console.log(JSON.stringify(remote.items, null, 2));
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

  const visibleCart = checkoutCart;
  const subtotal = visibleCart.reduce((sum, item) => {
    const price = Number(item.product.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return sum + price * quantity;
  }, 0);

  const total = subtotal;


  const clearServerCart = async () => {
    try {

      const savedUser = localStorage.getItem('user');

      if (!savedUser) {
        setRemoteCart([]);
        return;
      }
      const user = JSON.parse(savedUser) as UserProfile;

      await Promise.all(
        visibleCart.map(async (item: any) => {
          // item.id = cart table id
          if (!item.id) return;

          await fetch("http://nextlayer.soon.it/api/Cart/clear.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id,
            }),
          });
        })
      );

      clearCart();
      setRemoteCart([]);
      setCheckoutCart([]);

    } catch (err) {
      console.error(err);
    }
  };
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
      // clearCart();
    }, 2000);
  };




  const handleWhatsAppCheckout = async () => {
    try {
      setIsProcessing(true);
      setCartError("");

      // ==============================
      // 1. Get logged-in user
      // ==============================
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setCartError("Please log in to place an order.");
        return;
      }

      const user = JSON.parse(savedUser) as UserProfile;

      if (!user?.id) {
        setCartError("Invalid user. Please log in again.");
        return;
      }

      // ==============================
      // 2. Validate shipping details
      // ==============================
      const shippingName = formData.firstName.trim() || user.name?.trim() || "";
      const shippingPhone = formData.phone.trim() || user.phone?.trim() || "";

      if (
        !shippingName ||
        !shippingPhone ||
        !formData.address.trim() ||
        !formData.city.trim() ||
        !formData.state.trim() ||
        !formData.zipCode.trim()
      ) {
        setCartError("Please fill all shipping information.");
        return;
      }

      // ==============================
      // 3. Validate cart
      // ==============================
      if (!visibleCart || visibleCart.length === 0) {
        setCartError("Your cart is empty.");
        return;
      }

      if (total <= 0) {
        setCartError(
          "Unable to place order because the product price is ₹0. Please refresh the cart and try again."
        );
        return;
      }

      // ==============================
      // 4. Generate Order ID
      // ==============================
      const orderId = `ORD-${Date.now()}`;

      // ==============================
      // 5. Create order payload
      // ==============================
      const payload = {
        user_id: Number(user.id),

        payment_id: orderId,

        total_amount: Number(total.toFixed(2)),

        order_status: "Pending",

        tracking_id: null,

        shipping_address: {
          name: shippingName,
          phone: shippingPhone,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.zipCode.trim(),
        },

        items: visibleCart.map((item: any, index: number) => {
          const product = item?.product || {};

          const productId = Number(
            product?.id ??
            product?.product_id ??
            item?.product_id ??
            item?.productId ??
            item?.id ??
            0
          );

          const productName = String(
            product?.name ??
            product?.product_name ??
            product?.title ??
            product?.productName ??
            item?.product_name ??
            item?.productName ??
            item?.name ??
            item?.title ??
            item?.product_title ??
            ""
          ).trim();

          const sku = String(
            product?.sku ??
            product?.SKU ??
            item?.sku ??
            item?.SKU ??
            productId
          ).trim();

          const price = Number(
            product?.price ??
            item?.price ??
            0
          );

          const quantity = Number(item?.quantity ?? 1);

          console.log(`ORDER ITEM ${index + 1}:`, {
            item,
            product,
            productId,
            productName,
            sku,
            price,
            quantity,
          });

        const productType =
  String(
    item?.type ??
    product?.type ??
    ""
  ).toLowerCase() === "filament"
    ? "filament"
    : "product";

return {
  product_id: productId,
  product_name: productName,
  sku,
  quantity,
  price,

  product_type: productType,

  customization:
    item?.extra?.customization ??
    item?.customization ??
    product?.customization ??
    "",

  customer_image:
    item?.extra?.customer_image ??
    item?.customer_image ??
    product?.customer_image ??
    "",
};
        }),
      };
      console.log("Creating Order:", payload);

      // ==============================
      // 6. ADD ORDER API
      // ==============================
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const orderData = await orderResponse.json();

      console.log("Order API Response:", orderData);

      // ==============================
      // 7. Check API response
      // ==============================
      if (!orderResponse.ok || !orderData?.status) {
        throw new Error(
          orderData?.message || "Failed to create order"
        );
      }

      // ==============================
      // 8. Create WhatsApp message
      // ==============================
      let message = `🛍️ *NEW ORDER*\n\n`;

      message += `📦 *Order ID:* ${orderId}\n\n`;

      message += `👤 *CUSTOMER DETAILS*\n`;
      message += `Name: ${shippingName}\n`;
      message += `Email: ${formData.email}\n`;
      message += `Phone: ${shippingPhone}\n`;
      message += `Address: ${formData.address}\n`;
      message += `City: ${formData.city}\n`;
      message += `State: ${formData.state}\n`;
      message += `Zip Code: ${formData.zipCode}\n\n`;

      message += `🛒 *ORDER ITEMS*\n\n`;

      visibleCart.forEach((item: any, index: number) => {
        message += `${index + 1}. ${item.product.name}\n`;
        message += `SKU: ${item.product.sku || item.product.id || "N/A"}\n`;
        message += `Qty: ${item.quantity}\n`;
        message += `Price: ₹${Number(item.product.price).toFixed(2)}\n`;

        const customization =
          item.extra?.customization ||
          item.customization ||
          "";

        if (customization) {
          message += `Customization: ${customization}\n`;
        }

        if (item.extra?.customer_image) {
          message += `Image: ${item.extra.customer_image}\n`;
        }

        message += `\n`;
      });

      message += `📌 *Subtotal:* ₹${subtotal.toFixed(2)}\n`;
      message += `💰 *TOTAL:* ₹${total.toFixed(2)}\n`;

      // ==============================
      // 9. Clear server cart
      // ==============================
      const deleteResponse = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });

      const deleteResult = await deleteResponse.json();

      if (deleteResult?.status) {
        clearCart();
        setRemoteCart([]);
        setCheckoutCart([]);

        localStorage.removeItem("cart");

        window.dispatchEvent(
          new Event("cart-updated")
        );
      }

      // ==============================
      // 10. Open WhatsApp
      // ==============================
      const phoneNumber = "919723553038";

      const whatsappUrl =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");

      // ==============================
      // 11. Show success page
      // ==============================
      setOrderPlaced(true);

    } catch (error) {
      console.error("Checkout Error:", error);

      setCartError(
        error instanceof Error
          ? error.message
          : "Unable to place order."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!loadingCart && !orderPlaced && visibleCart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your cart is empty</h1>
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
          <div className="text-4xl sm:text-5xl mb-4">✓</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">Order Placed Successfully!</h1>
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Step Indicator */}
          {/* <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
            {(['shipping', 'payment', 'review'] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${step === s
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
                <span className="font-semibold capitalize text-sm sm:text-base">{s}</span>
              </div>
            ))}
          </div> */}

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
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                disabled={isProcessing}
                className="w-full py-3 text-white font-semibold rounded hover:opacity-90 transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#C4A57B" }}
              >
                {isProcessing ? "PLACING ORDER..." : "CONFIRM ORDER"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
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

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 lg:sticky lg:top-24">
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