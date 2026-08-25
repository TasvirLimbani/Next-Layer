'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
} from 'lucide-react';
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
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ================= MAIN FOOTER ================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-10
            py-5
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-12
            lg:py-10
          "
        >
          {/* ================= COMPANY ================= */}
          <div>
            <h3 className="mb-4 text-lg font-bold tracking-wide">
              <span style={{ color: '#C4A57B' }}>NEXT</span>LAYERS
            </h3>

            <p className="mb-5 max-w-sm text-sm leading-6 text-gray-400">
              Premium 3D printed products crafted with precision and care.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full border border-gray-700
                  text-gray-400
                  transition
                  hover:border-[#C4A57B]
                  hover:text-[#C4A57B]
                "
              >
                <Facebook size={17} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full border border-gray-700
                  text-gray-400
                  transition
                  hover:border-[#C4A57B]
                  hover:text-[#C4A57B]
                "
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {/* ================= SHOP ================= */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider">
              SHOP
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 transition hover:text-[#C4A57B]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 transition hover:text-[#C4A57B]"
                >
                  All Products
                </Link>
              </li>


            </ul>
          </div>

          {/* ================= INFORMATION ================= */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider">
              INFORMATION
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-400 transition hover:text-[#C4A57B]"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 transition hover:text-[#C4A57B]"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-400 transition hover:text-[#C4A57B]"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 transition hover:text-[#C4A57B]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>



        </div>

        {/* ================= CONTACT INFORMATION ================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-7
            border-t border-gray-800
            py-4
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-10
          "
        >
          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone
              size={19}
              className="mt-0.5 shrink-0"
              style={{ color: '#C4A57B' }}
            />

            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold">
                Phone
              </p>

              <a
                href="tel:+919723553038"
                className="
                  text-sm text-gray-400
                  transition hover:text-[#C4A57B]
                "
              >
                +91 97235 53038
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail
              size={19}
              className="mt-0.5 shrink-0"
              style={{ color: '#C4A57B' }}
            />

            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold">
                Email
              </p>

              <a
                href="mailto:nextlayecreations.info@gmail.com"
                className="
                  block
                  break-all
                  text-sm
                  text-gray-400
                  transition
                  hover:text-[#C4A57B]
                "
              >
                nextlayercreations.info@gmail.com              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
            <MapPin
              size={19}
              className="mt-0.5 shrink-0"
              style={{ color: '#C4A57B' }}
            />

            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold">
                Address
              </p>

              <p className="text-sm leading-6 text-gray-400">
                C2-1215, Pragati IT Park, Mota Varachha,
                Surat-394101
              </p>
            </div>
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div
          className="
            border-t border-gray-800
            py-6
            text-center
          "
        >
          <p className="text-xs leading-5 text-gray-500 sm:text-sm">
            &copy; 2026 NEXTLAYERS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}