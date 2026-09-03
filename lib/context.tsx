// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { CartItem, WishlistItem, UserProfile } from './types';

// interface AppContextType {
//   // Cart
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (productId: string) => void;
//   updateCartItem: (productId: string, quantity: number, customization?: any) => void;
//   clearCart: () => void;
//   cartTotal: number;

//   // Wishlist
//   wishlist: WishlistItem[];
//   addToWishlist: (productId: string) => void;
//   removeFromWishlist: (productId: string) => void;
//   isInWishlist: (productId: string) => boolean;

//   // User Profile
//   user: UserProfile | null;
//   setUser: (user: UserProfile | null) => void;

//   // Notifications
//   showNotification: (product: string, action: string) => void;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [mounted, setMounted] = useState(false);

//   // Initialize from localStorage
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     const savedWishlist = localStorage.getItem('wishlist');
//     const savedUser = localStorage.getItem('user');

//     if (savedCart) setCart(JSON.parse(savedCart));
//     if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
//     if (savedUser) setUser(JSON.parse(savedUser));

//     setMounted(true);
//   }, []);

//   // Persist cart to localStorage
//   useEffect(() => {
//     if (mounted) {
//       localStorage.setItem('cart', JSON.stringify(cart));
//     }
//   }, [cart, mounted]);

//   // Persist wishlist to localStorage
//   useEffect(() => {
//     if (mounted) {
//       localStorage.setItem('wishlist', JSON.stringify(wishlist));
//     }
//   }, [wishlist, mounted]);

//   // Persist user to localStorage
//   useEffect(() => {
//     if (!mounted) {
//       return;
//     }

//     if (user) {
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('user');
//     }
//   }, [user, mounted]);

//   const addToCart = (item: CartItem) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((ci) => ci.product.id === item.product.id);
//       if (existingItem) {
//         return prevCart.map((ci) =>
//           ci.product.id === item.product.id
//             ? { ...ci, quantity: ci.quantity + item.quantity }
//             : ci
//         );
//       }
//       return [...prevCart, item];
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
//   };

//   const updateCartItem = (productId: string, quantity: number, customization?: any) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.product.id === productId
//           ? { ...item, quantity, customization }
//           : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

//   const addToWishlist = (productId: string) => {
//     setWishlist((prev) => {
//       if (prev.some((item) => item.productId === productId)) return prev;
//       return [...prev, { productId, addedAt: Date.now() }];
//     });
//   };

//   const removeFromWishlist = (productId: string) => {
//     setWishlist((prev) => prev.filter((item) => item.productId !== productId));
//   };

//   const isInWishlist = (productId: string) => {
//     return wishlist.some((item) => item.productId === productId);
//   };

//   const showNotification = (product: string, action: string) => {
//     // This will be triggered for toast notifications
//   };

//   const value: AppContextType = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateCartItem,
//     clearCart,
//     cartTotal,
//     wishlist,
//     addToWishlist,
//     removeFromWishlist,
//     isInWishlist,
//     user,
//     setUser,
//     showNotification,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// export function useAppContext() {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useAppContext must be used within an AppProvider');
//   }
//   return context;
// }



'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { CartItem, WishlistItem, UserProfile } from './types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (
    productId: string,
    quantity: number,
    customization?: any
  ) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User Profile
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Notifications
  showNotification: (product: string, action: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  // =========================================================
  // Initialize from localStorage
  // =========================================================
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      const savedUser = localStorage.getItem('user');

      // -------------------------
      // Cart
      // -------------------------
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          // Remove invalid/old cart records
          const validCart = parsedCart.filter(
            (item) =>
              item &&
              item.product &&
              item.product.id !== undefined &&
              item.product.price !== undefined
          );

          setCart(validCart);

          // If invalid old data existed, immediately clean localStorage
          if (validCart.length !== parsedCart.length) {
            localStorage.setItem('cart', JSON.stringify(validCart));
          }
        } else {
          localStorage.removeItem('cart');
          setCart([]);
        }
      }

      // -------------------------
      // Wishlist
      // -------------------------
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        } else {
          localStorage.removeItem('wishlist');
          setWishlist([]);
        }
      }

      // -------------------------
      // User
      // -------------------------
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading localStorage:', error);

      // If cart data is corrupted, remove it
      localStorage.removeItem('cart');
      setCart([]);

      localStorage.removeItem('wishlist');
      setWishlist([]);
    }

    setMounted(true);
  }, []);

  // =========================================================
  // Persist cart
  // =========================================================
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // =========================================================
  // Persist wishlist
  // =========================================================
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  // =========================================================
  // Persist user
  // =========================================================
  useEffect(() => {
    if (!mounted) return;

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user, mounted]);

  // =========================================================
  // Add to cart
  // =========================================================
  const addToCart = (item: CartItem) => {
    // Prevent invalid cart items
    if (!item || !item.product) {
      console.error('Invalid cart item:', item);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (ci) =>
          ci?.product?.id !== undefined &&
          ci.product.id === item.product.id
      );

      if (existingItem) {
        return prevCart.map((ci) =>
          ci?.product?.id === item.product.id
            ? {
                ...ci,
                quantity: ci.quantity + item.quantity,
              }
            : ci
        );
      }

      return [...prevCart, item];
    });
  };

  // =========================================================
  // Remove from cart
  // =========================================================
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item?.product?.id !== productId
      )
    );
  };

  // =========================================================
  // Update cart
  // =========================================================
  const updateCartItem = (
    productId: string,
    quantity: number,
    customization?: any
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item?.product?.id === productId
          ? {
              ...item,
              quantity,
              customization,
            }
          : item
      )
    );
  };

  // =========================================================
  // Clear cart
  // =========================================================
  const clearCart = () => {
    setCart([]);
  };

  // =========================================================
  // Cart Total
  // =========================================================
  const cartTotal = cart.reduce((total, item) => {
    if (!item?.product) {
      return total;
    }

    const price = Number(item.product.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);

  // =========================================================
  // Wishlist
  // =========================================================
  const addToWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.productId === productId)) {
        return prev;
      }

      return [
        ...prev,
        {
          productId,
          addedAt: Date.now(),
        },
      ];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(
      (item) => item.productId === productId
    );
  };

  // =========================================================
  // Notification
  // =========================================================
  const showNotification = (
    product: string,
    action: string
  ) => {
    // Toast notification logic
  };

  const value: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    cartTotal,

    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,

    user,
    setUser,

    showNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      'useAppContext must be used within an AppProvider'
    );
  }

  return context;
}