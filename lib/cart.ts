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
  images?: string[] | string | Record<string, unknown>[];
  image?: string | string[];
  image_url?: string | string[];
  image_urls?: string[] | string;

  extra?: {
    colour?: string | null;
    diameter?: string | null;
    weight?: string | null;
    customization?: string | null;
    customer_image?: string | null;
  };

  product?: ApiProduct;
  id?: string | number;
  subcategory?: string | null;
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
  customer_image?: string | null;
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

function asImageArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((entry) => asImageArray(entry));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        return asImageArray(JSON.parse(trimmed));
      } catch {
        // Ignore malformed JSON strings and keep the raw string value below.
      }
    }

    return [sanitizeImageUrl(trimmed)];
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const direct = asImageArray(record.image ?? record.image_url ?? record.url ?? '');
    if (direct.length) return direct;

    return asImageArray(record.images ?? record.image_urls ?? '');
  }

  return [];
}

function collectCartImages(item: CartApiItem): string[] {
  const seen = new Set<string>();
  const stack: unknown[] = [item];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    if (typeof current === 'string' || typeof current === 'number' || typeof current === 'boolean') {
      const values = asImageArray(String(current));
      values.forEach((value) => {
        if (value && !seen.has(value)) seen.add(value);
      });
      continue;
    }

    if (Array.isArray(current)) {
      current.forEach((entry) => stack.push(entry));
      continue;
    }

    if (typeof current === 'object') {
      const record = current as Record<string, unknown>;

      if (typeof record.image === 'string' || typeof record.image_url === 'string' || typeof record.url === 'string') {
        const values = asImageArray(record.image ?? record.image_url ?? record.url ?? '');
        values.forEach((value) => {
          if (value && !seen.has(value)) seen.add(value);
        });
      }

      Object.values(record).forEach((value) => stack.push(value));
    }
  }

  return Array.from(seen);
}

function normalizePriceValue(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const cleaned = value
      .replace(/[^0-9.-]/g, '')
      .trim();

    if (!cleaned || cleaned === '-' || cleaned === '.') return 0;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const parsed = normalizePriceValue(entry);
      if (parsed > 0) return parsed;
    }
    return 0;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of ['price', 'amount', 'total_amount', 'sale_price', 'final_price']) {
      const parsed = normalizePriceValue(record[key]);
      if (parsed > 0) return parsed;
    }
  }

  return 0;
}

function mapCartApiItemToCartItem(item: CartApiItem): RemoteCartItem {
  const nestedProduct: any = (item as any).product;
  const fallbackPrice = normalizePriceValue(item.price ?? nestedProduct?.price ?? item.total_amount ?? nestedProduct?.total_amount ?? 0);
  const fallbackName = item.product_name || nestedProduct?.product_name || 'Product';
  const fallbackSku = item.sku || nestedProduct?.sku || '';
  const fallbackCategory = item.category || nestedProduct?.category || 'Uncategorized';
  const fallbackSubcategory = item.subcategory || nestedProduct?.subcategory || fallbackCategory;

  const productSource: ApiProduct = nestedProduct || {
    id: item.product_id ?? item.id ?? '',
    product_name: fallbackName,
    category: fallbackCategory,
    subcategory: fallbackSubcategory,
    sku: fallbackSku,
    price: String(fallbackPrice),
    stock: item.stock ?? 0,
    description: item.description || nestedProduct?.description || '',
    images: collectCartImages(item),
    image_urls: collectCartImages(item),
    customizable: Boolean(item.customizable ?? nestedProduct?.customizable),
    image_customizable: Boolean(nestedProduct?.image_customizable ?? false),
  };

  const mappedProduct = mapApiProductToProduct(productSource);
  const imageList = collectCartImages(item);
  const resolvedPrice = normalizePriceValue(item.price ?? nestedProduct?.price ?? item.total_amount ?? nestedProduct?.total_amount ?? mappedProduct.price ?? 0);
  const qty = Number(item.quantity) || 1;

  return {
    cartId: String(item.cart_id ?? item.id ?? item.product_id ?? mappedProduct.id),
    product: {
      ...mappedProduct,
      price: resolvedPrice,
      image: imageList[0] || mappedProduct.image,
      images: imageList.length ? imageList : mappedProduct.images,
    },
    quantity: qty,
    extra: item.extra,
    totalAmount: normalizePriceValue(item.total_amount ?? resolvedPrice * qty),
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
