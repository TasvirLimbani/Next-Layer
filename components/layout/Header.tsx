'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import { fetchProductSearch } from '@/lib/products';
import { fetchUserCart } from '@/lib/cart';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilamentsOpen, setIsFilamentsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const { wishlist } = useAppContext();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const wishlistCount = wishlist.length;

  useEffect(() => {
    let isActive = true;

    const refreshCartCount = async () => {
      try {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) {
          if (isActive) {
            setCartCount(0);
          }
          return;
        }

        const user = JSON.parse(savedUser) as { id?: string | number };

        if (!user?.id) {
          if (isActive) {
            setCartCount(0);
          }
          return;
        }

        const remoteCart = await fetchUserCart(String(user.id));

        if (isActive) {
          setCartCount(remoteCart.totalQuantity);
        }
      } catch {
        if (isActive) {
          setCartCount(0);
        }
      }
    };

    refreshCartCount();

    const handleCartUpdate = () => {
      refreshCartCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      isActive = false;
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

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

        if (!isActive) {
          return;
        }

        setSearchResults(results);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setSearchResults([]);
        setSearchError(error instanceof Error ? error.message : 'Failed to search products');
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

  const handleResultClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/shop/${productId}`);
  };

  const handleFilamentClick = () => {
    setIsFilamentsOpen(false);
  };

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
    const match = text.slice(matchIndex, matchIndex + trimmedQuery.length);
    const after = text.slice(matchIndex + trimmedQuery.length);

    return (
      <>
        {before}
        <span className="rounded px-1 py-0.5 bg-amber-100 text-amber-900">{match}</span>
        {after}
      </>
    );
  };

  const filamentColumns = [
    {
      title: 'Functional PLA',
      items: [
        { name: 'PLA', slug: 'pla', description: 'Affordable everyday prototyping' },
        { name: 'PLA+', slug: 'pla-plus', description: '37 colors · everyday printing', badge: { label: 'NEW COLORS', color: 'violet' as const } },
        { name: 'PLA Matte', slug: 'pla-matte', description: 'Smooth non-reflective finish' },
        { name: 'PLA CF', slug: 'pla-cf', description: 'Carbon fiber reinforced' },
      ],
    },
    {
      title: 'Aesthetic PLA',
      items: [
        { name: 'PLA Metallic', slug: 'pla-metallic', description: 'Real metal finish', badge: { label: 'NEW', color: 'green' as const } },
        { name: 'PLA Silk', slug: 'pla-silk', description: 'Luxurious sheen' },
        { name: 'Dual/Tri-Color Silk', slug: 'dual-tri-color-silk', description: 'Multi-tone color shift silk' },
        { name: 'PLA Marble', slug: 'pla-marble', description: 'Stone texture effect' },
        { name: 'PLA Starlight', slug: 'pla-starlight', description: 'Sparkle glitter effect' },
        { name: 'PLA Glow in the Dark', slug: 'pla-glow-in-the-dark', description: 'Photoluminescent' },
        { name: 'PLA Wood', slug: 'pla-wood', description: 'Real wood fiber texture' },
      ],
    },
    {
      title: 'PETG',
      items: [
        { name: 'PETG-HS', slug: 'petg-hs', description: 'High speed · functional parts' },
        { name: 'PETG Translucent', slug: 'petg-translucent', description: 'Light-transmitting clarity' },
        { name: 'PETG CF', slug: 'petg-cf', description: 'Rigid & heat-resistant · structural parts', badge: { label: 'NEW', color: 'green' as const } },
      ],
    },
    {
      title: 'ABS / ASA',
      items: [
        { name: 'ABS', slug: 'abs', description: 'Heat resistant · enclosure needed' },
        { name: 'ASA', slug: 'asa', description: 'UV stable · outdoor use' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top banner */}
      <div className="bg-gray-100 text-center py-2 text-sm text-gray-700">
        Free shipping  for all orders over ₹99
      </div>

      {/* Main header */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-wider">
            <span style={{ color: '#C4A57B' }}>NEXT</span>LAYERS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 relative">
            <Link href="/" className="text-xs xl:text-sm font-medium hover:text-amber-700 transition whitespace-nowrap">
              HOME
            </Link>
            <Link href="/shop" className="text-xs xl:text-sm font-medium hover:text-amber-700 transition whitespace-nowrap">
              SHOP
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsFilamentsOpen(true)}
              onMouseLeave={() => setIsFilamentsOpen(false)}
            >
              <Link
                href="/shop"
                className="text-xs xl:text-sm font-medium hover:text-amber-700 transition whitespace-nowrap inline-flex items-center gap-1 py-1"
              >
                <span>FILAMENTS</span>
                <ChevronDown size={14} className="text-gray-500 transition" aria-hidden="true" />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-40 w-[min(95vw,1100px)] -translate-x-1/2 pt-3 transition-all duration-200 ${isFilamentsOpen
                  ? 'pointer-events-auto visible opacity-100'
                  : 'pointer-events-none invisible opacity-0'
                  }`}
              >
                <div className="rounded-2xl border border-gray-200 bg-[#f6f6f6] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
                  <div className="grid grid-cols-4 gap-7">
                    {filamentColumns.map((column) => (
                      <div key={column.title}>
                        <h3 className="text-[1.06rem] font-semibold text-gray-900">{column.title}</h3>
                        <div className="mt-3 border-t border-gray-300 pt-4 space-y-6">
                          {column.items.map((item) => (
                            <Link
                              key={item.name}
                              href={`/filament/${item.slug}`}
                              className="block group/item"
                              onClick={handleFilamentClick}
                            >
                              <p className="flex items-center gap-2 text-[1.06rem] font-semibold text-gray-900 leading-tight group-hover/item:text-amber-700 transition-colors">
                                <span>{item.name}</span>
                                {item.badge && (
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide text-white ${item.badge.color === 'green' ? 'bg-emerald-600' : 'bg-violet-600'
                                      }`}
                                  >
                                    {item.badge.label}
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 text-[0.72rem] text-gray-500">{item.description}</p>
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

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search - hidden on small mobile */}
            <button
              onClick={() => setIsSearchOpen((open) => !open)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Account - hidden on mobile */}
            <Link href="/profile" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block">
              <User size={18} className="sm:w-5 sm:h-5" />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition">
              <Heart size={18} className="sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar (when open) */}
        {isSearchOpen && (
          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-full z-50 -mt-1 sm:-mt-2">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.12)] overflow-hidden">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-linear-to-r from-amber-50 to-white">
                <Search size={16} className="text-amber-700 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products, categories, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                    setSearchError('');
                  }}
                  className="ml-1 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Close search panel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
                <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2 text-xs text-gray-500 border-b border-gray-100 bg-gray-50/80">
                  <span>Type at least 2 characters to search the live catalog</span>
                  {searchQuery.trim().length >= 2 && !searchLoading && searchResults.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">
                      <Sparkles size={12} />
                      {searchResults.length} results
                    </span>
                  )}
                </div>

                {searchLoading && (
                  <div className="flex items-center gap-3 px-4 py-4 text-sm text-gray-600">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-600" />
                    Searching products...
                  </div>
                )}

                {!searchLoading && searchError && (
                  <div className="px-4 py-4 text-sm text-red-600">{searchError}</div>
                )}

                {!searchLoading && !searchError && searchResults.length === 0 && (
                  <div className="px-4 py-10 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <Search size={18} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">No matching products</p>
                    <p className="mt-1 text-xs text-gray-500">Try a different keyword or category</p>
                  </div>
                )}

                {!searchLoading && !searchError && searchResults.length > 0 && (
                  <ScrollArea className="max-h-96">
                    <div className="p-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleResultClick(product.id)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-amber-200 hover:bg-amber-50/60"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
                            <img
                              src={`/api/image-proxy?url=${encodeURIComponent(product.image)}`}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {highlightMatch(product.name, searchQuery)}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                                    {product.category}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                                    {product.vendor}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                ₹{product.price.toFixed(2)}
                                <ArrowRight size={14} className="text-amber-700 transition group-hover:translate-x-0.5" />
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <p className="line-clamp-1 text-xs text-gray-500">{product.description}</p>
                              <span className="shrink-0 text-xs font-medium text-amber-700 opacity-0 transition group-hover:opacity-100">
                                View details
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
            <Link href="/" className="block text-sm font-medium hover:text-amber-700 transition py-2 px-2">
              HOME
            </Link>
            <Link href="/shop" className="block text-sm font-medium hover:text-amber-700 transition py-2 px-2">
              SHOP
            </Link>
            <div className="px-2 py-2">
              <p className="text-xs font-semibold text-gray-600 mb-2">Categories</p>
              <div className="space-y-1 pl-2">
                <Link href="/shop?category=Miniatures" className="block text-xs hover:text-amber-700 transition">
                  Miniatures
                </Link>
                <Link href="/shop?category=Home%20Decor" className="block text-xs hover:text-amber-700 transition">
                  Home Decor
                </Link>
                <Link href="/shop?category=Jewelry" className="block text-xs hover:text-amber-700 transition">
                  Jewelry
                </Link>
              </div>
            </div>
            <Link href="#" className="block text-sm font-medium hover:text-amber-700 transition py-2 px-2">
              COLLECTIONS
            </Link>
            <Link href="#" className="block text-sm font-medium hover:text-amber-700 transition py-2 px-2">
              CONTACT
            </Link>
            <Link href="#" className="block text-sm font-medium hover:text-amber-700 transition py-2 px-2">
              BLOG
            </Link>
            <hr className="my-2" />
            <Link href="/profile" className="block text-sm font-medium hover:text-amber-700 transition py-2 px-2 lg:hidden">
              ACCOUNT
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
