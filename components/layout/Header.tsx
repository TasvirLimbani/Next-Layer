'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import { fetchProductSearch } from '@/lib/products';
import { fetchUserCart } from '@/lib/cart';
import { Product } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

type FilamentMenuBadge = {
  label: string;
  color: 'green' | 'violet';
};

type FilamentMenuItem = {
  name: string;
  slug: string;
  description: string;
  badge?: FilamentMenuBadge;
};

type FilamentMenuColumn = {
  title: string;
  items: FilamentMenuItem[];
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilamentsOpen, setIsFilamentsOpen] = useState(false);
  const [isMobileFilamentsOpen, setIsMobileFilamentsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [filamentColumns, setFilamentColumns] = useState<FilamentMenuColumn[]>([]);

  const { user } = useAppContext();
  const [wishlistCount, setWishlistCount] = useState(0);

  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  /* -------------------------------------------------
     WISHLIST COUNT
  ------------------------------------------------- */

  useEffect(() => {
    let isActive = true;

    const refreshWishlistCount = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;

        const userId = user?.id || parsedUser?.id;

        if (!userId) {
          if (isActive) {
            setWishlistCount(0);
          }
          return;
        }

        const response = await fetch(
          `/api/wishlist?user_id=${encodeURIComponent(String(userId))}`,
          {
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (isActive) {
            setWishlistCount(0);
          }
          return;
        }

        const data = await response.json();

        const items =
          data?.wishlist ||
          data?.products ||
          data?.data?.wishlist ||
          data?.data?.products ||
          data?.result?.wishlist ||
          data?.result?.products ||
          data?.result?.data ||
          [];

        if (isActive) {
          setWishlistCount(
            Array.isArray(items) ? items.length : 0
          );
        }
      } catch {
        if (isActive) {
          setWishlistCount(0);
        }
      }
    };

    refreshWishlistCount();

    /* Wishlist updated from another component */
    const handleWishlistUpdate = () => {
      refreshWishlistCount();
    };

    window.addEventListener(
      'wishlist-updated',
      handleWishlistUpdate
    );

    /* Refresh when returning to the tab */
    const handleVisibility = () => {
      if (!document.hidden) {
        refreshWishlistCount();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibility
    );

    window.addEventListener('focus', handleWishlistUpdate);

    return () => {
      isActive = false;

      window.removeEventListener(
        'wishlist-updated',
        handleWishlistUpdate
      );

      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      );

      window.removeEventListener(
        'focus',
        handleWishlistUpdate
      );
    };
  }, [user?.id]);

  /* -------------------------------------------------
     CART COUNT
  ------------------------------------------------- */

  useEffect(() => {
    let isActive = true;

    const refreshCartCount = async () => {
      try {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) {
          if (isActive) setCartCount(0);
          return;
        }

        const user = JSON.parse(savedUser);

        if (!user?.id) {
          if (isActive) setCartCount(0);
          return;
        }

        const remoteCart = await fetchUserCart(String(user.id));

        const count = Array.isArray(remoteCart?.items)
          ? remoteCart.items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
          )
          : 0;

        if (isActive) {
          setCartCount(count);
        }
      } catch {
        if (isActive) {
          setCartCount(0);
        }
      }
    };

    refreshCartCount();

    const handleRefresh = () => {
      refreshCartCount();
    };

    window.addEventListener('cart-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    const handleVisibility = () => {
      if (!document.hidden) {
        refreshCartCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isActive = false;

      window.removeEventListener('cart-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  /* -------------------------------------------------
     LIVE SEARCH
  ------------------------------------------------- */

  useEffect(() => {
    let isActive = true;

    const keyword = searchQuery.trim();

    if (!isSearchOpen || keyword.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError('');

      return () => {
        isActive = false;
      };
    }

    setSearchLoading(true);
    setSearchError('');

    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchProductSearch(keyword);

        if (!isActive) return;

        setSearchResults(results);
      } catch (error) {
        if (!isActive) return;

        setSearchResults([]);
        setSearchError(
          error instanceof Error
            ? error.message
            : 'Failed to search products'
        );
      } finally {
        if (isActive) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [isSearchOpen, searchQuery]);

  /* -------------------------------------------------
     FILAMENT MENU DATA
  ------------------------------------------------- */

  useEffect(() => {
    let isActive = true;

    const loadFilamentMenu = async () => {
      try {
        const response = await fetch('/api/filament', {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load filament menu');
        }

        const payload = await response.json();
        const rows = Array.isArray(payload?.data) ? payload.data : [];

        if (!isActive) return;

        const grouped = new Map<string, FilamentMenuColumn>();

        rows.forEach((item: Record<string, unknown>) => {
          const category = String(item?.category || 'Other').trim() || 'Other';
          const title = String(item?.title || 'Untitled').trim() || 'Untitled';
          const slug = String(item?.slug || item?.id || title).trim();
          const description = String(item?.description || '').trim();

          const existing = grouped.get(category) || {
            title: category,
            items: [],
          };

          existing.items.push({
            name: title,
            slug,
            description,
          });

          grouped.set(category, existing);
        });

        const nextColumns = Array.from(grouped.values()).map((column) => ({
          title: column.title,
          items: column.items,
        }));

        setFilamentColumns(nextColumns);
      } catch {
        if (isActive) {
          setFilamentColumns([]);
        }
      }
    };

    loadFilamentMenu();

    return () => {
      isActive = false;
    };
  }, []);

  /* -------------------------------------------------
     CLOSE MOBILE MENU ON DESKTOP
  ------------------------------------------------- */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* -------------------------------------------------
     SEARCH RESULT CLICK
  ------------------------------------------------- */

  const handleResultClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/shop/${productId}`);
  };

  /* -------------------------------------------------
     HIGHLIGHT SEARCH MATCH
  ------------------------------------------------- */

  const highlightMatch = (text: string, query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return text;
    }

    const lowerText = text.toLowerCase();
    const lowerQuery = trimmedQuery.toLowerCase();

    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex < 0) {
      return text;
    }

    const before = text.slice(0, matchIndex);
    const match = text.slice(
      matchIndex,
      matchIndex + trimmedQuery.length
    );
    const after = text.slice(
      matchIndex + trimmedQuery.length
    );

    return (
      <>
        {before}
        <span className="rounded bg-amber-100 px-1 py-0.5 text-amber-900">
          {match}
        </span>
        {after}
      </>
    );
  };

  /* -------------------------------------------------
     FILAMENT DATA
  ------------------------------------------------- */

  const fallbackFilamentColumns: FilamentMenuColumn[] = [
    {
      title: 'Functional PLA',
      items: [
        {
          name: 'PLA',
          slug: 'pla',
          description: 'Affordable everyday prototyping',
        },
        {
          name: 'PLA+',
          slug: 'pla-plus',
          description: '37 colors · everyday printing',
          badge: {
            label: 'NEW COLORS',
            color: 'violet',
          },
        },
        {
          name: 'PLA Matte',
          slug: 'pla-matte',
          description: 'Smooth non-reflective finish',
        },
        {
          name: 'PLA CF',
          slug: 'pla-cf',
          description: 'Carbon fiber reinforced',
        },
      ],
    },
    {
      title: 'Aesthetic PLA',
      items: [
        {
          name: 'PLA Metallic',
          slug: 'pla-metallic',
          description: 'Real metal finish',
          badge: {
            label: 'NEW',
            color: 'green',
          },
        },
        {
          name: 'PLA Silk',
          slug: 'pla-silk',
          description: 'Luxurious sheen',
        },
        {
          name: 'Dual/Tri-Color Silk',
          slug: 'dual-tri-color-silk',
          description: 'Multi-tone color shift silk',
        },
        {
          name: 'PLA Marble',
          slug: 'pla-marble',
          description: 'Stone texture effect',
        },
        {
          name: 'PLA Starlight',
          slug: 'pla-starlight',
          description: 'Sparkle glitter effect',
        },
        {
          name: 'PLA Glow in the Dark',
          slug: 'pla-glow-in-the-dark',
          description: 'Photoluminescent',
        },
        {
          name: 'PLA Wood',
          slug: 'pla-wood',
          description: 'Real wood fiber texture',
        },
      ],
    },
    {
      title: 'PETG',
      items: [
        {
          name: 'PETG-HS',
          slug: 'petg-hs',
          description: 'High speed · functional parts',
        },
        {
          name: 'PETG Translucent',
          slug: 'petg-translucent',
          description: 'Light-transmitting clarity',
        },
        {
          name: 'PETG CF',
          slug: 'petg-cf',
          description: 'Rigid & heat-resistant · structural parts',
          badge: {
            label: 'NEW',
            color: 'green',
          },
        },
      ],
    },
    {
      title: 'ABS / ASA',
      items: [
        {
          name: 'ABS',
          slug: 'abs',
          description: 'Heat resistant · enclosure needed',
        },
        {
          name: 'ASA',
          slug: 'asa',
          description: 'UV stable · outdoor use',
        },
      ],
    },
  ];

  const visibleFilamentColumns: FilamentMenuColumn[] = filamentColumns.length > 0 ? filamentColumns : fallbackFilamentColumns;

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-gray-200">

      {/* =================================================
          ANNOUNCEMENT BAR
      ================================================= */}

      <div className="bg-gray-100 px-3 py-2 text-center text-[11px] sm:text-xs md:text-sm text-gray-700">
        Free shipping for all orders over ₹999
      </div>

      {/* =================================================
          MAIN HEADER
      ================================================= */}

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6">

        <div className="flex min-h-[64px] items-center justify-between gap-3 sm:min-h-[72px]">

          {/* LOGO */}

          <Link
            href="/"
            className="shrink-0 text-[18px] font-bold tracking-[0.12em] sm:text-xl lg:text-2xl"
          >
            <span style={{ color: '#C4A57B' }}>
              NEXT
            </span>
            LAYERS
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden lg:flex items-center gap-6 xl:gap-9">

            <Link
              href="/"
              className="text-sm font-medium tracking-wide transition hover:text-amber-700"
            >
              HOME
            </Link>

            <Link
              href="/shop"
              className="text-sm font-medium tracking-wide transition hover:text-amber-700"
            >
              SHOP
            </Link>

            {/* FILAMENTS */}

            <div
              className="relative"
              onMouseEnter={() => setIsFilamentsOpen(true)}
              onMouseLeave={() => setIsFilamentsOpen(false)}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 py-4 text-sm font-medium tracking-wide transition hover:text-amber-700"
              >
                FILAMENTS
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isFilamentsOpen ? 'rotate-180' : ''
                    }`}
                />
              </Link>

              {/* MEGA MENU */}

              <div
                className={`absolute left-1/2 top-full w-[min(94vw,1100px)] -translate-x-1/2 pt-2 transition-all duration-200 ${isFilamentsOpen
                  ? 'visible pointer-events-auto opacity-100'
                  : 'invisible pointer-events-none opacity-0'
                  }`}
              >
                <div className="rounded-2xl border border-gray-200 bg-[#f7f7f7] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.16)]">

                  <div className="grid grid-cols-4 gap-7">

                    {visibleFilamentColumns.map((column) => (
                      <div key={column.title}>

                        <h3 className="text-base font-semibold text-gray-900">
                          {column.title}
                        </h3>

                        <div className="mt-3 space-y-5 border-t border-gray-300 pt-4">

                          {column.items.map((item) => (
                            <Link
                              key={item.name}
                              href={`/filament/${item.slug}`}
                              className="group block"
                            >

                              <p className="flex items-center gap-2 text-sm font-semibold leading-tight text-gray-900 transition group-hover:text-amber-700">

                                {item.name}

                                {item.badge && (
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white ${item.badge.color === 'green'
                                      ? 'bg-emerald-600'
                                      : 'bg-violet-600'
                                      }`}
                                  >
                                    {item.badge.label}
                                  </span>
                                )}

                              </p>

                              <p className="mt-1 text-[11px] text-gray-500">
                                {item.description}
                              </p>

                            </Link>
                          ))}

                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              </div>
            </div>
          </nav>

          {/* =================================================
              RIGHT SIDE ICONS
          ================================================= */}

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

            {/* SEARCH */}

            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((open) => !open);
                setIsMenuOpen(false);
              }}
              className="hidden rounded-full p-2 transition hover:bg-gray-100 sm:flex"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* ACCOUNT */}

            <Link
              href="/profile"
              className="hidden rounded-full p-2 transition hover:bg-gray-100 sm:flex"
              aria-label="Account"
            >
              <User size={19} />
            </Link>

            {/* WISHLIST */}

            <Link
              href="/wishlist"
              className="relative rounded-full p-2 transition hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <Heart size={19} />

              {wishlistCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white sm:h-5 sm:min-w-5 sm:text-[10px]"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}

            <Link
              href="/cart"
              className="relative rounded-full p-2 transition hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart size={19} />

              {cartCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white sm:h-5 sm:min-w-5 sm:text-[10px]"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((open) => !open);
                setIsSearchOpen(false);
              }}
              className="rounded-full p-2 transition hover:bg-gray-100 lg:hidden"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>
        </div>

        {/* =================================================
            SEARCH PANEL
        ================================================= */}

        {isSearchOpen && (
          <div className="border-t border-gray-100 py-3 sm:py-4">

            <div className="relative">

              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">

                <Search
                  size={17}
                  className="shrink-0 text-gray-500"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search products..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  autoFocus
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                  >
                    <X size={15} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                >
                  <X size={17} />
                </button>

              </div>

              {/* SEARCH RESULTS */}

              {searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full z-[120] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]">

                  <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500 sm:px-4">
                    <div className="flex items-center justify-between gap-2">

                      <span>
                        Search results
                      </span>

                      {!searchLoading &&
                        searchResults.length > 0 && (
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-800">
                            <Sparkles size={11} />
                            {searchResults.length}
                          </span>
                        )}

                    </div>
                  </div>

                  {searchLoading && (
                    <div className="px-4 py-5 text-sm text-gray-600">
                      Searching products...
                    </div>
                  )}

                  {!searchLoading && searchError && (
                    <div className="px-4 py-5 text-sm text-red-600">
                      {searchError}
                    </div>
                  )}

                  {!searchLoading &&
                    !searchError &&
                    searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <Search
                          size={20}
                          className="mx-auto mb-2 text-gray-400"
                        />
                        <p className="text-sm font-semibold text-gray-900">
                          No matching products
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Try another keyword
                        </p>
                      </div>
                    )}

                  {!searchLoading &&
                    !searchError &&
                    searchResults.length > 0 && (
                      <ScrollArea className="max-h-[60vh]">
                        <div className="p-2">

                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() =>
                                handleResultClick(product.id)
                              }
                              className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-amber-50"
                            >

                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-16 sm:w-16">
                                <img
                                  src={`/api/image-proxy?url=${encodeURIComponent(
                                    product.image
                                  )}`}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="line-clamp-2 text-xs font-semibold text-gray-900 sm:text-sm">
                                  {highlightMatch(
                                    product.name,
                                    searchQuery
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {product.category}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                  ₹{product.price.toFixed(2)}
                                </p>

                              </div>

                              <ArrowRight
                                size={15}
                                className="shrink-0 text-amber-700"
                              />

                            </button>
                          ))}

                        </div>
                      </ScrollArea>
                    )}

                </div>
              )}

            </div>
          </div>
        )}

        {/* =================================================
            MOBILE NAVIGATION
        ================================================= */}

        {isMenuOpen && (
          <div className="border-t border-gray-100 py-3 lg:hidden">

            <nav className="space-y-1">

              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                HOME
              </Link>

              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                SHOP
              </Link>

              {/* MOBILE FILAMENTS */}

              <div>

                <button
                  type="button"
                  onClick={() =>
                    setIsMobileFilamentsOpen(
                      (open) => !open
                    )
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50"
                >
                  <span>FILAMENTS</span>

                  <ChevronDown
                    size={17}
                    className={`transition-transform ${isMobileFilamentsOpen
                      ? 'rotate-180'
                      : ''
                      }`}
                  />
                </button>

                {isMobileFilamentsOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3">

                    {visibleFilamentColumns.map((column) => (
                      <div key={column.title} className="pb-2">

                        <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {column.title}
                        </p>

                        {column.items.map((item) => (
                          <Link
                            key={item.name}
                            href={`/filament/${item.slug}`}
                            onClick={() =>
                              setIsMenuOpen(false)
                            }
                            className="block rounded-lg px-2 py-2.5 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">

                              <span className="text-sm font-medium text-gray-800">
                                {item.name}
                              </span>

                              {item.badge && (
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[8px] font-bold text-white ${item.badge.color ===
                                    'green'
                                    ? 'bg-emerald-600'
                                    : 'bg-violet-600'
                                    }`}
                                >
                                  {item.badge.label}
                                </span>
                              )}

                            </div>

                            <p className="mt-0.5 text-[10px] text-gray-500">
                              {item.description}
                            </p>
                          </Link>
                        ))}

                      </div>
                    ))}

                  </div>
                )}

              </div>

              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50 sm:hidden"
              >
                <User size={17} />
                ACCOUNT
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50 sm:hidden"
              >
                <span className="flex items-center gap-3">
                  <Heart size={17} />
                  WISHLIST
                </span>

                {wishlistCount > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: '#C4A57B' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

            </nav>
          </div>
        )}

      </div>
    </header>
  );
}