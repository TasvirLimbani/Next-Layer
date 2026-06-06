import { Product } from './types';
import { mapApiProductToProduct, ApiProduct } from './products';

export interface CartApiItem {
  cart_id?: string | number;
  product_id?: string | number;
  product_name?: string;
  sku?: string;
  price?: string | number;
  description?: string;
  category?: string;
  stock?: string | number;
  quantity?: number;
  total_amount?: string | number;
  images?: string[];

  extra?: {
    colour?: string | null;
    diameter?: string | null;
    weight?: string | null;
    customization?: string | null;
  };

  product?: ApiProduct;
  id?: string | number;
  subcategory?: string | null;
  image_urls?: string[];
  customizable?: boolean | number;
}

export interface CartApiResponse {
  success?: boolean;
  status?: boolean;
  cart?: CartApiItem[];
  grand_total?: number | string;
  total_quantity?: number | string;
  message?: string;
}

export interface CartExtra {
  colour?: string | null;
  diameter?: string | null;
  weight?: string | null;
  customization?: string | null;
}

export interface RemoteCartItem {
  cartId: string;
  product: Product;
  quantity: number;
  extra?: CartExtra;
  totalAmount: number;
}

function sanitizeImageUrl(image: string): string {
  return image
    .replace(/[\[\]"]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function mapCartApiItemToCartItem(item: CartApiItem): RemoteCartItem {
  const productSource = item.product || {
    id: item.product_id ?? item.id ?? '',
    product_name: item.product_name || 'Product',
    category: item.category || 'Uncategorized',
    subcategory: item.subcategory || item.category || '3D Print Store',
    sku: item.sku || '',
    price: String(item.price ?? '0'),
    stock: item.stock ?? 0,
    description: item.description || '',
    images: item.images,
    image_urls: item.image_urls,
    customizable: item.customizable,
  };

  const mappedProduct = mapApiProductToProduct(productSource);
  const imageList = (item.image_urls?.length ? item.image_urls : item.images || [])
    .map(sanitizeImageUrl)
    .filter(Boolean);

  return {
    cartId: String(item.cart_id ?? item.id ?? item.product_id ?? mappedProduct.id),
    product: {
      ...mappedProduct,
      image: imageList[0] || mappedProduct.image,
      images: imageList.length ? imageList : mappedProduct.images,
    },
    quantity: Number(item.quantity) || 1,
    extra: item.extra,
    totalAmount: Number(item.total_amount) || mappedProduct.price * (Number(item.quantity) || 1),
  };
}

export async function fetchUserCart(userId: string): Promise<{ items: RemoteCartItem[]; grandTotal: number; totalQuantity: number }> {
  const response = await fetch(`/api/cart?user_id=${encodeURIComponent(userId)}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load cart');
  }

  const data = (await response.json()) as CartApiResponse;

  if (!data.success && !data.status) {
    throw new Error(data.message || 'Invalid cart response');
  }

  if (!Array.isArray(data.cart)) {
    return { items: [], grandTotal: Number(data.grand_total) || 0, totalQuantity: Number(data.total_quantity) || 0 };
  }

  return {
    items: data.cart.map(mapCartApiItemToCartItem),
    grandTotal: Number(data.grand_total) || 0,
    totalQuantity: Number(data.total_quantity) || 0,
  };
}
