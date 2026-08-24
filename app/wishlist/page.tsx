'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { mapApiProductToProduct, type ApiProduct } from '@/lib/products';
import { useAppContext } from '@/lib/context';
import { UserProfile } from '@/lib/types';
import type { Product } from '@/lib/types';

type WishlistResponse = {
    status?: boolean;
    success?: boolean;
    wishlist?: ApiProduct[];
    products?: ApiProduct[];
    message?: string;
};

export default function WishlistPage() {
    const { user } = useAppContext();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const extractWishlistItems = (payload: unknown): ApiProduct[] => {
        if (!payload || typeof payload !== 'object') {
            return [];
        }

        const data = payload as WishlistResponse & {
            data?: { wishlist?: ApiProduct[]; products?: ApiProduct[]; result?: ApiProduct[] };
            result?: { wishlist?: ApiProduct[]; products?: ApiProduct[]; data?: ApiProduct[] };
        };

        const candidates = [
            data.wishlist,
            data.products,
            data.data?.wishlist,
            data.data?.products,
            data.data?.result,
            data.result?.wishlist,
            data.result?.products,
            data.result?.data,
        ];

        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return candidate;
            }
        }

        return [];
    };

    const fetchWishlistJson = async (url: string) => {
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                Accept: 'application/json',
            },
        });

        const contentType = response.headers.get('content-type') || '';
        const rawBody = await response.text();

        if (!response.ok) {
            throw new Error(rawBody || 'Failed to load wishlist');
        }

        if (!contentType.includes('application/json') || rawBody.includes('$Sreact.fragment') || rawBody.includes('_rsc=')) {
            throw new Error('Non-JSON wishlist response');
        }

        return JSON.parse(rawBody) as WishlistResponse;
    };

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError('');

            const savedUser = localStorage.getItem('user');
            const parsedUser = savedUser ? JSON.parse(savedUser) : null;

            const userId = user?.id || parsedUser?.id;

            if (!userId) {
                setProducts([]);
                setError('Please login first.');
                return;
            }

            const response = await fetch(`/api/wishlist?user_id=${userId}`, {
                cache: 'no-store',
            });

            const data = await response.json();

            if (!data?.status && !data?.success) {
                throw new Error(data?.message || 'Failed to load wishlist');
            }

            const items: ApiProduct[] =
                data.wishlist || data.products || data.data?.wishlist || [];

            setProducts(items.map(mapApiProductToProduct));
        } catch (err) {
            setProducts([]);
            setError(err instanceof Error ? err.message : 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadWishlist();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="space-y-4">
                    <div className="h-10 w-48 rounded bg-gray-100 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="text-center">
                    <Heart size={48} className="mx-auto mb-4 text-gray-400" />
                    <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
                    <p className="text-gray-600 mb-8">
                        Start adding your favorite products to your wishlist
                    </p>
                    <Link href="/shop">
                        <button
                            className="px-8 py-3 text-white font-semibold rounded hover:opacity-90 transition"
                            style={{ backgroundColor: '#C4A57B' }}
                        >
                            CONTINUE SHOPPING
                        </button>
                    </Link>
                    {error ? <p className="mt-4 text-sm text-amber-700">{error}</p> : null}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Wishlist</h1>
                    <p className="text-gray-600">
                        {products.length} item{products.length !== 1 ? 's' : ''} in your wishlist
                    </p>
                </div>
                <Link href="/cart">
                    <button
                        className="px-5 py-2 text-white font-semibold rounded hover:opacity-90 transition flex items-center gap-2"
                        style={{ backgroundColor: '#C4A57B' }}
                    >
                        <ShoppingBag size={18} />
                        GO TO CART
                    </button>
                </Link>
            </div>

            {error ? <p className="mb-6 text-sm text-amber-700">{error}</p> : null}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onWishlistChange={() => loadWishlist()}
                        showDeleteWishlistButton
                        disableHoverEffects
                    />
                ))}
            </div>
        </div>
    );
}
