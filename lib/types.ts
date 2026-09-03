export interface Product {
  id: string;
  name: string;
  vendor: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  similar?: string[];
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  sku: string;
  color: string;
  variants?: ProductVariant[];
  customizable: boolean;
  image_customizable: boolean;
}

export interface ProductVariant {
  color: string;
  images: string[];
  image_urls: string[];
}
export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    customName?: string;
  };
  image_customizable?: {
    customImage?: string;
  }
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  date: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}
