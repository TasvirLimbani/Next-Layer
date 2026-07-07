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

export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
 const imageList =
  apiProduct.variants?.[0]?.image_urls?.length
    ? apiProduct.variants[0].image_urls
    : apiProduct.variants?.[0]?.images?.length
    ? apiProduct.variants[0].images
    : apiProduct.image_urls?.length
    ? apiProduct.image_urls
    : apiProduct.images?.length
    ? apiProduct.images
    : [DEFAULT_IMAGE];

  // Parse color - handle both JSON array string and plain string
const color =
  apiProduct.variants?.[0]?.color ||
  apiProduct.color ||
  "Natural"; 
 return {
  id: String(apiProduct.id),
  name: apiProduct.product_name,
  vendor: apiProduct.subcategory || apiProduct.category || "3D Print Store",
  category: apiProduct.category || "Uncategorized",
  price: Number(apiProduct.price) || 0,

  image: imageList[0] || DEFAULT_IMAGE,
  images: imageList,

  description: apiProduct.description || "",

  rating: 0,
  reviews: 0,

  inStock: Number(apiProduct.stock) > 0,

  tags: [apiProduct.category, apiProduct.subcategory].filter(Boolean) as string[],

  sku: apiProduct.sku,

  color,

  customizable: Boolean(apiProduct.customizable),

  image_customizable: Boolean(apiProduct.image_customizable),

  // ✅ ADD THIS
  variants:
    apiProduct.variants?.map((variant) => ({
      color: variant.color,
      images:
        variant.image_urls?.length
          ? variant.image_urls
          : variant.images ?? [],
      image_urls: variant.image_urls ?? variant.images ?? [],
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
