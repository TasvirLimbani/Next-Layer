'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Heart,
    ShoppingBag,
    ShoppingCart,
    Star,
} from 'lucide-react';

import {
    mapApiProductToProduct,
    type ApiProduct,
} from '@/lib/products';

import { useAppContext } from '@/lib/context';
import type { Product } from '@/lib/types';

type WishlistResponse = {
    status?: boolean;
    success?: boolean;
    wishlist?: ApiProduct[];
    products?: ApiProduct[];
    message?: string;

    data?: {
        wishlist?: ApiProduct[];
        products?: ApiProduct[];
    };
};

export default function WishlistPage() {
    const { user } = useAppContext();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* =====================================================
       LOAD WISHLIST
    ===================================================== */

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError('');

            const savedUser = localStorage.getItem('user');

            const parsedUser = savedUser
                ? JSON.parse(savedUser)
                : null;

            const userId = user?.id || parsedUser?.id;

            /* ---------------------------------------------
               USER NOT LOGGED IN
            --------------------------------------------- */

            if (!userId) {
                setProducts([]);
                setError('Please login first.');

                // Update header wishlist badge
                window.dispatchEvent(
                    new Event('wishlist-updated')
                );

                return;
            }

            /* ---------------------------------------------
               API REQUEST
            --------------------------------------------- */

            const response = await fetch(
                `/api/wishlist?user_id=${encodeURIComponent(
                    String(userId)
                )}`,
                {
                    method: 'GET',
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            const data: WishlistResponse =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    'Failed to load wishlist'
                );
            }

            if (!data?.status && !data?.success) {
                throw new Error(
                    data?.message ||
                    'Failed to load wishlist'
                );
            }

            /* ---------------------------------------------
               EXTRACT PRODUCTS
            --------------------------------------------- */

           const items: ApiProduct[] =
  data.wishlist ||
  data.products ||
  data.data?.wishlist ||
  data.data?.products ||
  [];

const mappedProducts = items.map(mapApiProductToProduct);

setProducts(mappedProducts);

window.dispatchEvent(new Event('wishlist-updated')
            );
        } catch (err) {
            setProducts([]);

            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load wishlist'
            );

            /*
             * If wishlist failed / is empty,
             * tell Header to refresh its count.
             */
            window.dispatchEvent(
                new Event('wishlist-updated')
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        loadWishlist();
    }, [user?.id]);

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <main className="w-full bg-white">

                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

                    {/* HEADER SKELETON */}

                    <div className="mb-10">

                        <div className="mb-3 h-[3px] w-16 animate-pulse rounded bg-gray-200" />

                        <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />

                        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-100" />

                    </div>


                    {/* PRODUCT SKELETON */}

                    <div
                        className="
              grid
              grid-cols-2
              gap-x-4
              gap-y-10

              sm:grid-cols-2
              sm:gap-x-6
              sm:gap-y-12

              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-14
            "
                    >

                        {Array.from({ length: 8 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="min-w-0"
                                >

                                    {/* IMAGE */}

                                    <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-100" />

                                    {/* CATEGORY */}

                                    <div className="mt-5 h-3 w-24 animate-pulse rounded bg-gray-100" />

                                    {/* NAME */}

                                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-100" />

                                    {/* RATING */}

                                    <div className="mt-3 h-4 w-28 animate-pulse rounded bg-gray-100" />

                                    {/* PRICE */}

                                    <div className="mt-4 h-5 w-20 animate-pulse rounded bg-gray-100" />

                                </div>
                            )
                        )}

                    </div>

                </div>

            </main>
        );
    }

    /* =====================================================
       EMPTY WISHLIST
    ===================================================== */

    if (products.length === 0) {
        return (
            <main className="w-full bg-white">

                <div className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-4 py-16">

                    <div className="w-full max-w-md text-center">

                        {/* HEART */}

                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">

                            <Heart
                                size={30}
                                strokeWidth={1.5}
                                className="text-gray-400"
                            />

                        </div>


                        {/* TITLE */}

                        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">

                            Your wishlist is empty

                        </h1>


                        {/* DESCRIPTION */}

                        <p className="mt-3 text-sm text-gray-500 sm:text-base">

                            Start adding your favorite products
                            to your wishlist.

                        </p>


                        {/* BUTTON */}

                        <Link
                            href="/shop"
                            className="
                mt-7
                inline-flex
                items-center
                justify-center
                rounded-md
                px-7
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
                            style={{
                                backgroundColor: '#C4A57B',
                            }}
                        >

                            CONTINUE SHOPPING

                        </Link>


                        {/* ERROR */}

                        {error && (
                            <p className="mt-5 text-sm text-amber-700">

                                {error}

                            </p>
                        )}

                    </div>

                </div>

            </main>
        );
    }

    /* =====================================================
       MAIN WISHLIST
    ===================================================== */

    return (
        <main className="w-full bg-white">

            <div
                className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-8

          sm:px-6
          sm:py-12

          lg:px-8
        "
            >

                {/* =================================================
            PAGE HEADER
        ================================================= */}

                <div
                    className="
            mb-8
            flex
            flex-col
            gap-5

            sm:mb-12
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
                >

                    <div>

                        {/* GOLD LINE */}

                        <div className="mb-3 h-[3px] w-16 bg-[#C4A57B]" />

                        {/* TITLE */}

                        <h1
                            className="
                text-2xl
                font-semibold
                tracking-tight
                text-gray-900

                sm:text-3xl
              "
                        >
                            My Wishlist
                        </h1>

                        {/* COUNT */}

                        <p className="mt-2 text-sm text-gray-500">

                            {products.length}{' '}

                            {products.length === 1
                                ? 'item'
                                : 'items'}

                            {' '}in your wishlist

                        </p>

                    </div>


                    {/* CART BUTTON */}

                    <Link
                        href="/cart"
                        className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-md
              bg-[#111827]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-black

              sm:w-auto
            "
                    >

                        <ShoppingBag size={17} />

                        GO TO CART

                    </Link>

                </div>


                {/* ERROR */}

                {error && (
                    <div
                        className="
              mb-6
              rounded-md
              border
              border-amber-200
              bg-amber-50
              px-4
              py-3
              text-sm
              text-amber-800
            "
                    >

                        {error}

                    </div>
                )}


                {/* =================================================
            PRODUCT GRID
        ================================================= */}

                <section className="w-full bg-white">

                    <div
                        className="
              grid

              grid-cols-2
              gap-x-4
              gap-y-10

              sm:grid-cols-2
              sm:gap-x-6
              sm:gap-y-12

              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-14
            "
                    >

                        {products.map((product) => (

                            <WishlistProductCard
                                key={product.id}
                                product={product}
                                onWishlistChange={loadWishlist}
                            />

                        ))}

                    </div>

                </section>

            </div>

        </main>
    );
}


/* =========================================================
   PRODUCT CARD
   BEST SELLERS STYLE
========================================================= */

function WishlistProductCard({
    product,
    onWishlistChange,
}: {
    product: Product;
    onWishlistChange: () => void;
}) {

    const [removing, setRemoving] =
        useState(false);

    /*
     * IMAGE URL
     */

    const imageUrl = product.image
        ? `/api/image-proxy?url=${encodeURIComponent(
            product.image
        )}`
        : '/placeholder-product.png';


    /*
     * RATING
     */

    const rating =
        Number(product.rating || 0);

    const reviews =
        Number(product.reviews || 0);


    /* =====================================================
       REMOVE WISHLIST
    ===================================================== */

    const removeFromWishlist = async () => {

        try {

            setRemoving(true);

            const savedUser =
                localStorage.getItem('user');

            const parsedUser =
                savedUser
                    ? JSON.parse(savedUser)
                    : null;

            const userId =
                parsedUser?.id;

            if (!userId) {

                alert('Please login first.');

                return;
            }


            const response =
                await fetch('/api/wishlist', {
                    method: 'DELETE',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Accept:
                            'application/json',
                    },

                    body: JSON.stringify({
                        user_id:
                            String(userId),

                        product_id:
                            String(product.id),
                    }),
                });


            if (!response.ok) {

                throw new Error(
                    'Failed to remove product from wishlist'
                );

            }


            /*
             * Refresh wishlist page
             */

            await onWishlistChange();


            /*
             * Tell header to refresh
             */

            window.dispatchEvent(
                new Event('wishlist-updated')
            );

        } catch (error) {

            console.error(error);

            alert(
                'Unable to remove product from wishlist.'
            );

        } finally {

            setRemoving(false);

        }

    };


    return (

        <article
            className="
        group
        min-w-0
        bg-white
      "
        >

            {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

            <Link
                href={`/shop/${product.id}`}
                className="
          relative
          block
          aspect-square
          w-full
          overflow-hidden
          rounded-xl
          bg-[#f3f4f6]
        "
            >

                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"

                    className="
            absolute
            inset-0
            h-full
            w-full
            object-contain

            p-3
            sm:p-5
            lg:p-6

            transition-transform
            duration-500
            group-hover:scale-[1.03]
          "

                    onError={(event) => {

                        const image =
                            event.currentTarget;

                        if (
                            !image.src.endsWith(
                                '/placeholder-product.png'
                            )
                        ) {

                            image.src =
                                '/placeholder-product.png';

                        }

                    }}
                />


                {/* =================================================
            WISHLIST HEART
        ================================================= */}

                <button
                    type="button"

                    disabled={removing}

                    onClick={(event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        removeFromWishlist();

                    }}

                    aria-label="Remove from wishlist"

                    className="
            absolute
            right-2
            top-2

            flex
            h-8
            w-8
            items-center
            justify-center

            rounded-full

            border
            border-gray-200

            bg-white

            text-gray-800

            shadow-sm

            transition

            hover:bg-gray-50

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:right-3
            sm:top-3
            sm:h-9
            sm:w-9
          "
                >

                    <Heart
                        size={16}
                        fill="currentColor"
                        strokeWidth={1.7}
                        className="sm:h-[17px] sm:w-[17px]"
                    />

                </button>

            </Link>


            {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

            <div className="pt-4">

                {/* CATEGORY */}

                <p
                    className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-gray-500

            sm:text-xs
          "
                >
                    {product.category ||
                        'NAME KEYCHAIN'}
                </p>


                {/* PRODUCT NAME */}

                <Link
                    href={`/shop/${product.id}`}
                >

                    <h3
                        className="
              mt-2
              line-clamp-2
              min-h-[36px]

              text-sm
              font-semibold
              leading-5
              text-gray-900

              transition-colors
              group-hover:text-gray-600

              sm:min-h-[40px]
              sm:text-base
            "
                    >

                        {product.name}

                    </h3>

                </Link>


                {/* =================================================
            RATING
        ================================================= */}

                <div
                    className="
            mt-3
            flex
            items-center
            gap-1
          "
                >

                    <div className="flex items-center">

                        {[1, 2, 3, 4, 5].map(
                            (star) => (

                                <Star
                                    key={star}
                                    size={14}

                                    className={
                                        star <=
                                            Math.round(rating)
                                            ? `
                        fill-[#C4A57B]
                        text-[#C4A57B]
                      `
                                            : `
                        text-gray-300
                      `
                                    }
                                />

                            )
                        )}

                    </div>


                    <span
                        className="
              ml-1
              text-[11px]
              text-gray-500

              sm:text-xs
            "
                    >
                        ({reviews})
                    </span>

                </div>


                {/* =================================================
            PRICE + ADD BUTTON
        ================================================= */}

                <div
                    className="
            mt-4
            flex
            items-center
            justify-between
            gap-2
          "
                >

                    {/* PRICE */}

                    <p
                        className="
              text-base
              font-bold
              text-gray-900

              sm:text-lg
            "
                    >

                        ₹
                        {Number(
                            product.price || 0
                        ).toFixed(2)}

                    </p>


                    {/* ADD BUTTON */}

                    <Link
                        href={`/shop/${product.id}`}

                        className="
              hidden
              items-center
              gap-1.5
              rounded-md
              bg-[#111827]
              px-3
              py-2
              text-xs
              font-medium
              text-white
              transition
              hover:bg-black

              sm:inline-flex
            "
                    >

                        <ShoppingCart size={14} />

                        ADD

                    </Link>

                </div>

            </div>

        </article>

    );
}