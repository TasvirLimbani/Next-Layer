'use client';

import { BEST_SELLERS } from '@/lib/mockData';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

export default function NewArrivals() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">New Arrivals</h2>
          <p className="text-gray-600 text-lg mb-8">
            Discover our latest 3D printed products trusted by thousands
          </p>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: '#C4A57B' }} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="text-center">
          <Link href="/shop">
            <button
              className="px-8 py-3 font-semibold rounded transition hover:opacity-90"
              style={{ backgroundColor: '#C4A57B', color: 'white' }}
            >
              VIEW ALL PRODUCTS
            </button>
          </Link>
        </div> */}
      </div>
    </section>
  );
}
