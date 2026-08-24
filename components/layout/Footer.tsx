'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span style={{ color: '#C4A57B' }}>NEXT</span>LAYERS
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Premium 3D printed products crafted with precision and care.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-600 transition">
                <Facebook size={18} />
              </a>
              {/* <a href="#" className="hover:text-amber-600 transition">
                <Twitter size={18} />
              </a> */}
              <a href="#" className="hover:text-amber-600 transition">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">SHOP</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-amber-600 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/filament" className="text-gray-400 hover:text-amber-600 transition">
                  Filaments
                </Link>
              </li>

            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4">INFORMATION</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-amber-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-amber-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-amber-600 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-600 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">NEWSLETTER</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe for exclusive offers and updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2 sm:flex-row sm:gap-0">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:outline-none sm:rounded-r-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-white text-sm font-medium rounded transition sm:rounded-l-none"
                style={{ backgroundColor: '#C4A57B' }}
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-800">
          <div className="flex items-start gap-3">
            <Phone size={18} style={{ color: '#C4A57B' }} className="mt-1" />
            <div>
              <p className="font-semibold text-sm">Phone</p>
              <p className="text-sm text-gray-400">+91 97235 53038</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} style={{ color: '#C4A57B' }} className="mt-1" />
            <div>
              <p className="font-semibold text-sm">Email</p>
              <p className="text-sm text-gray-400 break-all">nextlayecreations.info@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} style={{ color: '#C4A57B' }} className="mt-1" />
            <div>
              <p className="font-semibold text-sm">Address</p>
              <p className="text-sm text-gray-400">C2-1215, Pragati IT Park, Mota Varachha, Surat-394101</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 NEXTLAYERS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
