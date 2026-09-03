
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductImageGallery from '@/components/products/ProductImageGallery';

type FilamentApiResponse = {
    status: boolean;
    data?: {
        id: number;
        sku: string;
        title: string;
        slug: string;
        description: string;
        colour: string[] | string;
        diameter: string[] | string;
        weight: string[] | string;
        price: string;
        images: string[];
    };
    message?: string;
};

type FilamentViewModel = {
    id: number;
    sku: string;
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

function normalizeOptionArray(
    value: string[] | string | undefined
) {
    if (!value) return [];

    const arr = Array.isArray(value) ? value : [value];

    const items = arr
        .flatMap((v) =>
            typeof v === 'string'
                ? v.split(',')
                : []
        )
        .map((s) => s.trim())
        .filter(Boolean);

    return Array.from(new Set(items));
}

function formatFilamentTitle(title: string) {
    return title.endsWith(' Filamentg')
        ? title.replace(' Filamentg', ' Filament')
        : title;
}

function colorFromString(name: string) {
    if (!name) return '#e5e7eb';

    const s = name.trim();

    // Hex color
    if (
        /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)
    ) {
        return s;
    }

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

    if (map[key]) {
        return map[key];
    }

    // Basic CSS color name
    if (/^[a-z]+$/i.test(s)) {
        return key;
    }

    // Fallback generated color
    let hash = 0;

    for (let i = 0; i < s.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash =
            s.charCodeAt(i) +
            ((hash << 5) - hash);
    }

    let color = '#';

    for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line no-bitwise
        const value =
            (hash >> (i * 8)) & 0xff;

        color += (
            `00${value.toString(16)}`
        ).slice(-2);
    }

    return color;
}

export default function FilamentDetailPage() {
    const params = useParams();

    const slug = params.slug as string;

    const [filament, setFilament] =
        useState<FilamentViewModel | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [selectedColor, setSelectedColor] =
        useState('');

    const [selectedDiameter, setSelectedDiameter] =
        useState('');

    const [selectedWeight, setSelectedWeight] =
        useState('');

    const [quantity, setQuantity] =
        useState(1);

    const [isPlacingOrder, setIsPlacingOrder] =
        useState(false);

    useEffect(() => {
        let isActive = true;

        const loadFilament = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await fetch(
                    `/api/filament/${encodeURIComponent(slug)}`,
                    {
                        cache: 'no-store',
                    }
                );

                const payload =
                    (await response.json()) as FilamentApiResponse;

                if (!isActive) {
                    return;
                }

                if (
                    !response.ok ||
                    !payload?.status ||
                    !payload.data
                ) {
                    throw new Error(
                        payload?.message ||
                        'Failed to load filament details'
                    );
                }

                const colours =
                    normalizeOptionArray(
                        payload.data.colour
                    );

                const diameters =
                    normalizeOptionArray(
                        payload.data.diameter
                    );

                const weights =
                    normalizeOptionArray(
                        payload.data.weight
                    );

                const normalized: FilamentViewModel = {
                    id: payload.data.id,

                    sku: payload.data.sku,

                    title: formatFilamentTitle(
                        payload.data.title
                    ),

                    slug: payload.data.slug,

                    description:
                        payload.data.description,

                    diameter:
                        diameters[0] ||
                        String(
                            payload.data.diameter || ''
                        ),

                    weight:
                        weights[0] ||
                        String(
                            payload.data.weight || ''
                        ),

                    colours,

                    diameters,

                    weights,

                    price:
                        Number.parseFloat(
                            payload.data.price
                        ) || 0,

                    images:
                        Array.isArray(
                            payload.data.images
                        )
                            ? payload.data.images
                            : [],
                };

                setFilament(normalized);

                setSelectedColor(
                    colours[0] || ''
                );

                setSelectedDiameter(
                    diameters[0] || ''
                );

                setSelectedWeight(
                    weights[0] || ''
                );

                setQuantity(1);
            } catch (loadError) {
                if (!isActive) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'Failed to load filament details'
                );
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

    const selectedImageSet = useMemo(
        () => filament?.images || [],
        [filament]
    );

    /**
     * PLACE ORDER ON WHATSAPP
     */
    const handlePlaceOrder = () => {
        if (!filament) {
            return;
        }

        try {
            setIsPlacingOrder(true);

       

            /**
             * IMPORTANT:
             * Replace this with your WhatsApp number.
             *
             * Example:
             * +91 98765 43210
             *
             * should be:
             * 919876543210
             */
            const WHATSAPP_NUMBER =
                '9723553038';

            const message = `
Hello, I want to place an order.

*Product Details*
Product: ${filament.title}
SKU: ${filament.sku}
Quantity: ${quantity}


*Selected Options*
Colour: ${selectedColor || 'N/A'}
Diameter: ${selectedDiameter || 'N/A'}
Weight: ${selectedWeight || 'N/A'}

Please confirm my order and let me know the next steps.
            `.trim();

            const whatsappUrl =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    message
                )}`;

            window.open(
                whatsappUrl,
                '_blank',
                'noopener,noreferrer'
            );
        } catch (orderError) {
            console.error(
                'WhatsApp order error:',
                orderError
            );
        } finally {
            setIsPlacingOrder(false);
        }
    };

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
                <h1 className="text-3xl font-bold mb-4">
                    Unable to load filament
                </h1>

                <p className="text-gray-600 mb-6">
                    {error}
                </p>

                <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-2 text-white rounded font-semibold"
                    style={{
                        backgroundColor: '#C4A57B',
                    }}
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    if (!filament) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Filament not found
                </h1>

                <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-2 text-white rounded font-semibold"
                    style={{
                        backgroundColor: '#C4A57B',
                    }}
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-8">
                <Link
                    href="/shop"
                    className="hover:text-amber-700"
                >
                    Shop
                </Link>

                <span className="mx-2">
                    /
                </span>

                <span className="text-gray-900 font-semibold">
                    {filament.title}
                </span>
            </div>

            {/* Product */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images */}
                <div>
                    <ProductImageGallery
                        images={selectedImageSet}
                        productName={filament.title}
                    />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">
                        {filament.title}
                    </h1>

                    <p className="text-gray-700 text-base leading-relaxed mb-6">
                        {filament.description}
                    </p>

                    {/* Diameter */}
                    {filament.diameters.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Diameter
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {filament.diameters.map(
                                    (diameter) => (
                                        <button
                                            key={diameter}
                                            type="button"
                                            onClick={() =>
                                                setSelectedDiameter(
                                                    diameter
                                                )
                                            }
                                            className={`px-4 py-2 rounded border text-sm font-medium transition ${
                                                selectedDiameter ===
                                                diameter
                                                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                                                    : 'border-gray-300 hover:border-amber-500'
                                            }`}
                                        >
                                            {diameter}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Weight */}
                    {filament.weights.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Net Weight
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {filament.weights.map(
                                    (weight) => (
                                        <button
                                            key={weight}
                                            type="button"
                                            onClick={() =>
                                                setSelectedWeight(
                                                    weight
                                                )
                                            }
                                            className={`px-4 py-2 rounded border text-sm font-medium transition ${
                                                selectedWeight ===
                                                weight
                                                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                                                    : 'border-gray-300 hover:border-amber-500'
                                            }`}
                                        >
                                            {weight}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Colour */}
                    {filament.colours.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Colour
                            </p>

                            <div className="flex flex-wrap gap-3 items-center">
                                {filament.colours.map(
                                    (color) => {
                                        const isSelected =
                                            selectedColor ===
                                            color;

                                        const bg =
                                            colorFromString(
                                                color
                                            );

                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedColor(
                                                        color
                                                    )
                                                }
                                                title={color}
                                                aria-label={color}
                                                className={`inline-flex items-center justify-center rounded-full p-0.5 transition focus:outline-none ${
                                                    isSelected
                                                        ? 'ring-2 ring-amber-500'
                                                        : ''
                                                }`}
                                            >
                                                <span
                                                    className={`block w-9 h-9 rounded-full border ${
                                                        isSelected
                                                            ? 'border-white'
                                                            : 'border-gray-200'
                                                    }`}
                                                    style={{
                                                        backgroundColor:
                                                            bg,
                                                    }}
                                                />
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}

                    {/* WhatsApp Order Button */}
                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className="w-full py-3 px-6 text-white font-semibold rounded flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor:
                                '#25D366',
                        }}
                    >
                        {/* WhatsApp Icon */}
                        <svg
                            width="21"
                            height="21"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M20.52 3.48A11.86 11.86 0 0012.05 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.15 1.6 5.95L.06 24l6.3-1.65a11.86 11.86 0 005.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.18-1.24-6.17-3.42-8.43zM12.06 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.88 9.88 0 01-1.52-5.28C2.17 6.42 6.6 1.99 12.06 1.99c2.64 0 5.12 1.03 6.98 2.9a9.87 9.87 0 012.89 7c0 5.46-4.43 9.91-9.87 9.91zm5.43-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
                        </svg>

                        {isPlacingOrder
                            ? 'OPENING WHATSAPP...'
                            : 'PLACE ORDER ON WHATSAPP'}
                    </button>

                    {/* Small information */}
                    <p className="text-sm text-gray-500 text-center mt-3">
                        You will be redirected to WhatsApp
                        to confirm your order.
                    </p>
                </div>
            </div>
        </div>
    );
}
