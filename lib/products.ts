import { Product } from './types';

// export interface ApiProduct {
//   id: string | number;
//   product_name: string;
//   category: string;
//   subcategory?: string | null;
//   sku: string;
//   price: string;
//   stock: string | number;
//   description: string;
//   images?: string[];
//   status?: string;
//   created_at?: string;
//   customizable?: boolean;
//   image_urls?: string[];
//   color?: string;
// }

export interface ProductVariant {
  color: string;
  images: string[];
  image_urls: string[];
}

export interface ApiProduct {
  id: string | number;
  product_name: string;
  category: string;
  subcategory?: string | null;
  sku: string;
  price: string;
  stock: string | number;
  description: string;

  images?: string[];
  image_urls?: string[];
  similar?: Array<{
    image?: string;
    image_url?: string;
    url?: string;
  }>;

  variants?: ProductVariant[];

  status?: string;
  created_at?: string;
  customizable?: boolean;
  image_customizable?: boolean;
  color?: string;
}

export interface ProductsApiResponse {
  status: boolean;
  products: ApiProduct[];
  message?: string;
}

export interface LatestProductsApiResponse {
  status: boolean;
  total?: number;
  products?: ApiProduct[];
  message?: string;
}

export interface BestSellerProductsApiResponse {
  status: boolean;
  total?: number;
  products?: ApiProduct[];
  message?: string;
}

export interface ProductDetailApiResponse {
  status: boolean;
  product?: ApiProduct;
  message?: string;
}

export interface ProductSearchApiResponse {
  status: boolean;
  total?: number;
  products?: ApiProduct[];
  message?: string;
}

const DEFAULT_IMAGE = 'https://placehold.co/800x800?text=Product';
const BASE_IMAGE_HOST = 'http://nextlayer.soon.it';

function normalizeImageUrl(input: string): string {
  let value = input.trim();

  if (!value) {
    return '';
  }

  value = value
    .replace(/^['\"]+|['\"]+$/g, '')
    .replace(/\\/g, '')
    .trim();

  value = value
    .replace(/^https?:\/\/localhost(?::\d+)?/i, BASE_IMAGE_HOST)
    .replace(/^https?:\/\/nextlayer\.soon\.it/i, BASE_IMAGE_HOST);

  if (value.startsWith('//')) {
    return `http:${value}`;
  }

  if (value.startsWith('/')) {
    return `${BASE_IMAGE_HOST}${value}`;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  const cleanedPath = value.replace(/^images\//i, '').replace(/^\/+/, '');
  return `${BASE_IMAGE_HOST}/images/${cleanedPath}`;
}

function parseImageField(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => parseImageField(item)).filter(Boolean);
  }

  if (typeof value === 'object') {
    const obj = value as { image?: unknown; url?: unknown; image_url?: unknown };
    return parseImageField(obj.image ?? obj.url ?? obj.image_url ?? '');
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      return parseImageField(parsed);
    } catch {
      // Keep string fallback when backend returns invalid JSON-like strings.
    }
  }

  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map((part) => normalizeImageUrl(part))
      .filter(Boolean);
  }

  const normalized = normalizeImageUrl(trimmed);
  return normalized ? [normalized] : [];
}

function pickFirstImageList(candidates: unknown[]): string[] {
  for (const candidate of candidates) {
    const parsed = parseImageField(candidate);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  return [];
}

function uniqueImageList(images: string[]): string[] {
  return [...new Set(images.filter(Boolean))];
}

export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const similarImages = uniqueImageList(
    (apiProduct.similar ?? []).flatMap((item) =>
      parseImageField(item?.image_url ?? item?.image ?? item?.url ?? '')
    )
  );

  const firstVariantImages = uniqueImageList(
    pickFirstImageList([
      apiProduct.variants?.[0]?.image_urls,
      apiProduct.variants?.[0]?.images,
    ])
  );

  const baseProductImages = uniqueImageList(
    pickFirstImageList([
      apiProduct.image_urls,
      apiProduct.images,
    ])
  );

  const productImages = uniqueImageList([
    ...firstVariantImages,
    ...baseProductImages,
    ...similarImages,
  ]);

  const imageList = productImages.length ? productImages : [DEFAULT_IMAGE];

  const color =
    apiProduct.variants?.[0]?.color ||
    apiProduct.color ||
    'Natural';

  return {
    id: String(apiProduct.id),
    name: apiProduct.product_name,
    vendor: apiProduct.subcategory || apiProduct.category || '3D Print Store',
    category: apiProduct.category || 'Uncategorized',
    price: Number(apiProduct.price) || 0,

    image: productImages[0],
    images: productImages,
    similar: similarImages,

    description: apiProduct.description || '',

    rating: 0,
    reviews: 0,

    inStock: Number(apiProduct.stock) > 0,

    tags: [apiProduct.category, apiProduct.subcategory].filter(Boolean) as string[],

    sku: apiProduct.sku,

    color,

    customizable: Boolean(apiProduct.customizable),

    image_customizable: Boolean(apiProduct.image_customizable),

    variants:
      apiProduct.variants?.map((variant) => ({
        color: variant.color,
        images: uniqueImageList(
          pickFirstImageList([variant.image_urls, variant.images])
        ),
        image_urls: uniqueImageList(
          pickFirstImageList([variant.image_urls, variant.images])
        ),
      })) ?? [],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  const data = (await response.json()) as ProductsApiResponse;

  if (!data.status || !Array.isArray(data.products)) {
    throw new Error(data.message || 'Invalid product response');
  }

  return data.products.map(mapApiProductToProduct);
}

export async function fetchLatestProducts(): Promise<Product[]> {
  const response = await fetch('/api/products/latest', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load latest products');
  }

  const data = (await response.json()) as LatestProductsApiResponse;

  if (!data.status || !Array.isArray(data.products)) {
    throw new Error(data.message || 'Invalid latest products response');
  }

  return data.products.map(mapApiProductToProduct);
}

export async function fetchBestSellerProducts(): Promise<Product[]> {
  const response = await fetch('/api/products/best-seller', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load best sellers');
  }

  const data = (await response.json()) as BestSellerProductsApiResponse;

  if (!data.status || !Array.isArray(data.products)) {
    throw new Error(data.message || 'Invalid best sellers response');
  }

  return data.products.map(mapApiProductToProduct);
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load product');
  }

  const data = (await response.json()) as ProductDetailApiResponse;

  if (!data.status || !data.product) {
    throw new Error(data.message || 'Product not found');
  }

  return mapApiProductToProduct(data.product);
}

export async function fetchProductSearch(keyword: string): Promise<Product[]> {
  const response = await fetch(`/api/products/search?keyword=${encodeURIComponent(keyword)}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to search products');
  }

  const data = (await response.json()) as ProductSearchApiResponse;

  if (!data.status || !Array.isArray(data.products)) {
    throw new Error(data.message || 'Invalid search response');
  }

  return data.products.map(mapApiProductToProduct);
}
