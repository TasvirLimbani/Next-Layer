'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { useAppContext } from '@/lib/context';
import { Product } from '@/lib/types';

type FilamentApiResponse = {
    status: boolean;
    data?: {
        id: number;
        title: string;
        slug: string;
        description: string;
        colour: string[];
        diameter: string;
        weight: string;
        price: string;
        images: string[];
    };
    message?: string;
};

type FilamentViewModel = {
    id: number;
    title: string;
    slug: string;
    description: string;
    diameter: string;
    weight: string;
    colours: string[];
    diameters: string[];
    weights: string[];
    price: number;
    images: string[];
};

function normalizeOptionArray(value: string[] | string | undefined) {
    if (!value) return [];

    const arr = Array.isArray(value) ? value : [value];

    const items = arr
        .flatMap((v) => (typeof v === 'string' ? v.split(',') : []))
        .map((s) => s.trim())
        .filter(Boolean);

    return Array.from(new Set(items));
}

function formatFilamentTitle(title: string) {
    return title.endsWith(' Filamentg') ? title.replace(' Filamentg', ' Filament') : title;
}

function colorFromString(name: string) {
    if (!name) return '#e5e7eb';

    const s = name.trim();

    // hex provided
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;

    const map: Record<string, string> = {
        'pitch black': '#0b0b0b',
        'fluorescent green': '#00e676',
        black: '#000000',
        white: '#ffffff',
        red: '#dc2626',
        orange: '#fb923c',
        yellow: '#fbbf24',
        green: '#16a34a',
        teal: '#14b8a6',
        blue: '#2563eb',
        purple: '#7c3aed',
        pink: '#ec4899',
        gray: '#9ca3af',
        grey: '#9ca3af',
    };

    const key = s.toLowerCase();
    if (map[key]) return map[key];

    // if it's a basic CSS color name, return as-is
    if (/^[a-z]+$/i.test(s)) return key;

    // fallback: hash string to color
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line no-bitwise
        const value = (hash >> (i * 8)) & 0xff;
        color += (`00${value.toString(16)}`).slice(-2);
    }

    return color;
}

export default function FilamentDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { addToCart } = useAppContext();

    const [filament, setFilament] = useState<FilamentViewModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedDiameter, setSelectedDiameter] = useState('');
    const [selectedWeight, setSelectedWeight] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showNotification, setShowNotification] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        let isActive = true;

        const loadFilament = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await fetch(`/api/filament/${encodeURIComponent(slug)}`, {
                    cache: 'no-store',
                });

                const payload = (await response.json()) as FilamentApiResponse;

                if (!isActive) {
                    return;
                }

                if (!response.ok || !payload?.status || !payload.data) {
                    throw new Error(payload?.message || 'Failed to load filament details');
                }

                const colours = normalizeOptionArray(payload.data.colour as any);
                const diameters = normalizeOptionArray((payload.data as any).diameter);
                const weights = normalizeOptionArray((payload.data as any).weight);

                const normalized: FilamentViewModel = {
                    id: payload.data.id,
                    title: formatFilamentTitle(payload.data.title),
                    slug: payload.data.slug,
                    description: payload.data.description,
                    diameter: diameters[0] || (payload.data.diameter as any) || '',
                    weight: weights[0] || (payload.data.weight as any) || '',
                    colours,
                    diameters,
                    weights,
                    price: Number.parseFloat(payload.data.price),
                    images: payload.data.images,
                };

                setFilament(normalized);
                setSelectedColor(colours[0] || '');
                setSelectedDiameter(diameters[0] || '');
                setSelectedWeight(weights[0] || '');
                setQuantity(1);
            } catch (loadError) {
                if (!isActive) {
                    return;
                }

                setError(loadError instanceof Error ? loadError.message : 'Failed to load filament details');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadFilament();

        return () => {
            isActive = false;
        };
    }, [slug]);

    const selectedImageSet = useMemo(() => filament?.images || [], [filament]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="h-5 w-40 rounded bg-gray-100 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square rounded bg-gray-100" />
                    <div className="space-y-4">
                        <div className="h-8 w-40 rounded bg-gray-100" />
                        <div className="h-10 w-3/4 rounded bg-gray-100" />
                        <div className="h-24 rounded bg-gray-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Unable to load filament</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/shop" className="inline-flex items-center px-6 py-2 text-white rounded font-semibold" style={{ backgroundColor: '#C4A57B' }}>
                    Back to Shop
                </Link>
            </div> 
        );
    }

    if (!filament) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Filament not found</h1>
                <Link href="/shop" className="inline-flex items-center px-6 py-2 text-white rounded font-semibold" style={{ backgroundColor: '#C4A57B' }}>
                    Back to Shop
                </Link>
            </div>
        );
    }

    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);

            const savedUser = localStorage.getItem('user');

            if (!savedUser) {
                throw new Error('Please sign in before adding items to cart.');
            }

            const user = JSON.parse(savedUser) as { id?: string | number };

            if (!user?.id) {
                throw new Error('Please sign in before adding items to cart.');
            }

            const requestBody: {
                user_id: number;
                product_id: number;
                quantity: number;
                customization?: string;
            } = {
                user_id: Number(user.id),
                product_id: Number(filament.id),
                quantity,
            };

            const customization = {
                diameter: selectedDiameter || filament.diameter,
                weight: selectedWeight || filament.weight,
                colour: selectedColor || '',
            };

            if (customization) {
                requestBody.customization = JSON.stringify(customization);
            }

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to add product to cart');
            }

            const cartProduct: Product = {
                id: `filament-${filament.id}-${selectedDiameter || 'nodiam'}-${selectedWeight || 'nowt'}-${selectedColor || 'default'}`,
                name: `${filament.title} ${selectedDiameter ? `(${selectedDiameter}` : ''}${selectedWeight ? `, ${selectedWeight}` : ''}${selectedColor ? `, ${selectedColor})` : selectedDiameter ? ')' : ''}`,
                vendor: 'NEXTLAYERS',
                category: 'Filaments',
                price: filament.price,
                originalPrice: undefined,
                image: filament.images[0],
                images: filament.images,
                description: `${filament.description} Diameter: ${selectedDiameter || filament.diameter}. Weight: ${selectedWeight || filament.weight}. Colour: ${selectedColor || 'N/A'}.`,
                rating: 4.8,
                reviews: 120,
                inStock: true,
                tags: [filament.slug, selectedDiameter || filament.diameter, selectedWeight || filament.weight, selectedColor || ''],
                sku: `FLM-${String(filament.id).padStart(4, '0')}`,
                customizable: false,
            };

            addToCart({ product: cartProduct, quantity, customization: { customName: undefined } });

            window.dispatchEvent(new Event('cart-updated'));
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 2500);
        } catch (addError) {
            setError(addError instanceof Error ? addError.message : 'Failed to add product to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-sm text-gray-600 mb-8">
                <Link href="/shop" className="hover:text-amber-700">
                    Shop
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-semibold">{filament.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <ProductImageGallery images={selectedImageSet} productName={filament.title} />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-4">{filament.title}</h1>

                    <p className="text-gray-700 text-base leading-relaxed mb-6">{filament.description}</p>

                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Diameter</p>
                        <div className="flex flex-wrap gap-2">
                            {filament.diameters.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setSelectedDiameter(d)}
                                    className={`px-4 py-2 rounded border text-sm font-medium transition ${selectedDiameter === d ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-300 hover:border-amber-500'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Net Weight</p>
                        <div className="flex flex-wrap gap-2">
                            {filament.weights.map((w) => (
                                <button
                                    key={w}
                                    type="button"
                                    onClick={() => setSelectedWeight(w)}
                                    className={`px-4 py-2 rounded border text-sm font-medium transition ${selectedWeight === w ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-300 hover:border-amber-500'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Colour</p>
                        <div className="flex flex-wrap gap-3 items-center">
                            {filament.colours.map((color) => {
                                const isSelected = selectedColor === color;
                                const bg = colorFromString(color);

                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                        aria-label={color}
                                        className={`inline-flex items-center justify-center rounded-full p-0.5 transition focus:outline-none ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
                                    >
                                        <span
                                            className={`block w-9 h-9 rounded-full border ${isSelected ? 'border-white' : 'border-gray-200'}`}
                                            style={{ backgroundColor: bg }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">₹{filament.price.toFixed(2)}</span>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                            >
                                −
                            </button>
                            <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="w-full py-3 px-6 text-white font-semibold rounded flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#C4A57B' }}
                    >
                        <ShoppingCart size={20} />
                        {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
                    </button>

                    {showNotification && (
                        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
                            Added to cart: {filament.title}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
