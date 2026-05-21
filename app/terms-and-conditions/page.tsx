'use client';

import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: May 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="prose prose-sm sm:prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the 3DPRINTS website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on 3DPRINTS website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information and Pricing</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Descriptions</h3>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate descriptions of our 3D printed products. However, we do not warrant that product descriptions, pricing, or other content of this site is accurate, complete, reliable, current, or error-free. If a product offered by 3DPRINTS is not as described, your sole remedy is to return it in unused condition.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing</h3>
            <p className="text-gray-700 mb-4">
              All prices are subject to change without notice. We reserve the right to limit quantities and correct any errors in pricing or product information. We also reserve the right to refuse any order placed on our website.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Customization</h3>
            <p className="text-gray-700 mb-4">
              Products with customization options (such as engraved names) cannot be returned once production has begun. Please verify all customization details before finalizing your order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              When you place an order through our website, you are offering to purchase products at the stated price and terms. We reserve the right to refuse or cancel any order. Payment must be received before your order is processed and shipped. We accept all major credit cards and secure payment methods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping Information</h3>
            <p className="text-gray-700 mb-4">
              We offer worldwide shipping with various shipping options. Delivery times are estimates and not guaranteed. Delays may occur due to customs, weather, or other unforeseen circumstances.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">International Orders</h3>
            <p className="text-gray-700 mb-4">
              For international orders, you are responsible for paying any applicable import duties, taxes, and customs fees. We are not responsible for any issues caused by customs clearance or delays.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Risk of Loss</h3>
            <p className="text-gray-700 mb-4">
              Risk of loss and title for all products pass to you upon delivery to the carrier. We recommend purchasing shipping insurance for valuable orders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Return Policy</h3>
            <p className="text-gray-700 mb-4">
              We offer a 30-day money-back guarantee for unused, non-customized products in original condition. Customized products cannot be returned once production has begun. To initiate a return, please contact our customer service team.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Defective Products</h3>
            <p className="text-gray-700 mb-4">
              If you receive a defective or damaged product, please notify us within 14 days of delivery with photos documenting the damage. We will replace the product at no additional cost or issue a full refund.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Process</h3>
            <p className="text-gray-700 mb-4">
              Refunds will be processed within 7-10 business days of receiving and inspecting the returned item. Refunds will be issued to the original payment method. Shipping costs are non-refundable unless the return is due to our error.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Warranty Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              ALL MATERIALS ON THIS SITE ARE PROVIDED ON AN &quot;AS IS&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 3DPRINTS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. 3DPRINTS DOES NOT WARRANT THAT THE MATERIALS OR SERVICES WILL MEET YOUR REQUIREMENTS OR THAT OPERATION WILL BE UNINTERRUPTED OR ERROR-FREE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              IN NO EVENT SHALL 3DPRINTS OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE MATERIALS ON 3DPRINTS WEBSITE, EVEN IF 3DPRINTS OR AN AUTHORIZED REPRESENTATIVE HAS BEEN NOTIFIED ORALLY OR IN WRITING OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              All content included on this site, such as text, graphics, logos, images, and software, is the property of 3DPRINTS or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of 3DPRINTS and protected by copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Conduct</h2>
            <p className="text-gray-700 mb-4">
              You agree not to use this website for any unlawful purpose or in violation of any applicable law. Prohibited behavior includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Obscene or abusive messages or images</li>
              <li>Disrupting the normal flow of dialogue within our website</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with the proper working of the website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless 3DPRINTS and its officers, directors, employees, and agents from and against all claims, damages, costs, and expenses, including legal fees, arising out of your violation of these terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modification of Terms</h2>
            <p className="text-gray-700 mb-4">
              3DPRINTS may revise these terms and conditions for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which 3DPRINTS operates, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-semibold">3DPRINTS Customer Support</p>
              <p className="text-gray-700">Email: support@3dprints.com</p>
              <p className="text-gray-700">Phone: 1-800-3D-PRINTS</p>
              <p className="text-gray-700">Address: 123 Innovation Street, Tech City, TC 12345</p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-amber-700 hover:text-amber-800 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
