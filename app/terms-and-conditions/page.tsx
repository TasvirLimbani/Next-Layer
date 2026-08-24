'use client';

import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms and Conditions
          </h1>
          <p className="text-gray-600">
            Last updated: August 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="prose prose-sm sm:prose max-w-none">

          {/* 1. Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>

            <p className="text-gray-700 mb-4">
              Welcome to NextLayer Creations. We design, manufacture, and
              sell 3D-printed products through our online store.
            </p>

            <p className="text-gray-700 mb-4">
              These Terms and Conditions explain the rules that apply when
              you access our website, purchase our products, request
              customized products, or otherwise use our services.
            </p>

            <p className="text-gray-700 mb-4">
              By using our website or placing an order, you agree to these
              Terms and Conditions. If you do not agree with these terms,
              please do not use our website or place an order.
            </p>
          </section>

          {/* 2. About Our Products */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. About Our 3D-Printed Products
            </h2>

            <p className="text-gray-700 mb-4">
              Our products are manufactured using 3D printing technology.
              Because 3D printing creates products layer by layer, minor
              variations may occur between individual products.
            </p>

            <p className="text-gray-700 mb-4">
              Minor differences in layer lines, surface texture, color,
              finish, dimensions, or appearance may occur and are considered
              normal characteristics of the 3D-printing process.
            </p>

            <p className="text-gray-700 mb-4">
              Product photographs are provided for reference. Actual product
              colors may appear slightly different depending on lighting,
              photography, manufacturing conditions, and your device or
              screen settings.
            </p>
          </section>

          {/* 3. Product Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Product Information and Pricing
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Product Details
            </h3>

            <p className="text-gray-700 mb-4">
              We make reasonable efforts to provide accurate information
              about our products, including photographs, dimensions,
              materials, colors, features, and descriptions.
            </p>

            <p className="text-gray-700 mb-4">
              However, we do not guarantee that every product description,
              photograph, specification, or measurement will always be
              completely accurate or free from minor errors.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Product Availability
            </h3>

            <p className="text-gray-700 mb-4">
              Product availability may change without notice. We may
              discontinue, modify, or temporarily suspend the availability
              of any product.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Pricing
            </h3>

            <p className="text-gray-700 mb-4">
              Product prices are displayed on our website and may change from
              time to time. Any applicable shipping charges, taxes, or other
              charges will be shown where applicable.
            </p>

            <p className="text-gray-700 mb-4">
              If an obvious pricing or product information error occurs, we
              reserve the right to correct the error and, where necessary,
              contact the customer before fulfilling the order.
            </p>
          </section>

          {/* 4. Custom Products */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Custom and Personalized Products
            </h2>

            <p className="text-gray-700 mb-4">
              Some products may be customized according to customer
              requirements, including names, text, colors, sizes, designs,
              or other specifications.
            </p>

            <p className="text-gray-700 mb-4">
              Customers are responsible for checking all customization
              information before submitting an order. This includes spelling,
              names, numbers, dimensions, colors, and any other information
              provided to us.
            </p>

            <p className="text-gray-700 mb-4">
              Once production has started, customized or personalized
              products may not be eligible for cancellation, return, or
              exchange unless the product is defective or the error was
              caused by NextLayer Creations.
            </p>
          </section>

          {/* 5. Customer Files */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Customer-Provided Designs and Files
            </h2>

            <p className="text-gray-700 mb-4">
              If you request a custom 3D-printed product using a file, image,
              logo, model, or other design supplied by you, you confirm that
              you have the necessary rights or permission to use that
              material.
            </p>

            <p className="text-gray-700 mb-4">
              You must not provide designs or files that infringe copyrights,
              trademarks, patents, design rights, or other intellectual
              property rights belonging to another person or organization.
            </p>

            <p className="text-gray-700 mb-4">
              We reserve the right to refuse a custom order if we reasonably
              believe the requested product or submitted material may violate
              applicable laws or third-party rights.
            </p>
          </section>

          {/* 6. Orders */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Orders and Order Acceptance
            </h2>

            <p className="text-gray-700 mb-4">
              Placing an order through our website constitutes a request to
              purchase the selected products. An order is subject to
              confirmation and acceptance by NextLayer Creations.
            </p>

            <p className="text-gray-700 mb-4">
              We reserve the right to cancel or refuse an order in
              circumstances including product unavailability, incorrect
              pricing, payment problems, suspected fraud, inaccurate
              customer information, or other legitimate business reasons.
            </p>

            <p className="text-gray-700 mb-4">
              If we cancel an order after payment has been received, the
              applicable amount will be refunded through the original or
              appropriate payment method.
            </p>
          </section>

          {/* 7. Payment */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Payment
            </h2>

            <p className="text-gray-700 mb-4">
              Payment must be successfully completed using one of the payment
              methods available during checkout unless we have specifically
              agreed to another payment arrangement.
            </p>

            <p className="text-gray-700 mb-4">
              Payment information may be processed by third-party payment
              providers. We do not intentionally store complete payment card
              details on our own systems.
            </p>
          </section>

          {/* 8. Production */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Production and Processing
            </h2>

            <p className="text-gray-700 mb-4">
              Many of our products are produced after an order is placed.
              Production time may vary depending on the product, quantity,
              customization, material availability, and current order volume.
            </p>

            <p className="text-gray-700 mb-4">
              Any production or processing time shown on our website is an
              estimate and should not be considered a guaranteed delivery
              date.
            </p>
          </section>

          {/* 9. Shipping */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Shipping and Delivery
            </h2>

            <p className="text-gray-700 mb-4">
              Orders will be shipped to the address provided by the customer
              during checkout. Customers are responsible for ensuring that
              their shipping information is accurate and complete.
            </p>

            <p className="text-gray-700 mb-4">
              Delivery times depend on the selected shipping service,
              destination, courier operations, holidays, weather, and other
              circumstances. Estimated delivery dates are not guaranteed.
            </p>

            <p className="text-gray-700 mb-4">
              Once an order has been handed over to the shipping carrier,
              delays caused by the carrier may be outside our direct control.
              We will nevertheless make reasonable efforts to assist with
              shipping-related issues.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Incorrect Address
            </h3>

            <p className="text-gray-700 mb-4">
              If an order cannot be delivered because an incorrect or
              incomplete address was provided, additional shipping charges may
              apply if the order needs to be reshipped.
            </p>
          </section>

          {/* 10. Returns */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Returns, Replacements, and Refunds
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Standard Products
            </h3>

            <p className="text-gray-700 mb-4">
              Eligible non-customized products may be considered for return
              according to our applicable return policy. Returned products
              must be unused and in acceptable condition.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Customized Products
            </h3>

            <p className="text-gray-700 mb-4">
              Customized, personalized, or made-to-order products may not be
              eligible for return or cancellation after production has begun,
              except where required by applicable law or where the product is
              defective or incorrectly produced by us.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Damaged or Defective Products
            </h3>

            <p className="text-gray-700 mb-4">
              If your order arrives damaged or you believe the product has a
              manufacturing defect, please contact us as soon as reasonably
              possible after delivery.
            </p>

            <p className="text-gray-700 mb-4">
              Please provide photographs or other relevant information so
              that we can assess the issue. Depending on the circumstances,
              we may provide a replacement, repair, refund, or another
              appropriate resolution.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Refunds
            </h3>

            <p className="text-gray-700 mb-4">
              Where a refund is approved, it will normally be issued using
              the original payment method or another appropriate method.
              Processing times may depend on the payment provider or bank.
            </p>
          </section>

          {/* 11. Product Safety */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Product Use and Safety
            </h2>

            <p className="text-gray-700 mb-4">
              Our products should be used only for their intended or
              reasonably foreseeable purpose.
            </p>

            <p className="text-gray-700 mb-4">
              Unless a product is specifically described as suitable for a
              particular application, our 3D-printed products should not be
              assumed to be suitable for food contact, medical use,
              structural applications, high-temperature environments, or
              other specialized uses.
            </p>

            <p className="text-gray-700 mb-4">
              Customers are responsible for following any product-specific
              instructions, warnings, and recommendations provided with the
              product.
            </p>
          </section>

          {/* 12. Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Intellectual Property
            </h2>

            <p className="text-gray-700 mb-4">
              All original content on our website, including product designs,
              photographs, graphics, logos, text, branding, illustrations,
              and other materials, is owned by or licensed to NextLayer
              Creations and is protected by applicable intellectual property
              laws.
            </p>

            <p className="text-gray-700 mb-4">
              You may not copy, reproduce, modify, distribute, resell, or
              commercially use our original product designs, photographs,
              branding, or website content without our prior written
              permission.
            </p>
          </section>

          {/* 13. Website Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Acceptable Use of Our Website
            </h2>

            <p className="text-gray-700 mb-4">
              You agree to use our website only for lawful purposes and in a
              manner that does not interfere with the operation, security, or
              availability of our services.
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Do not use the website for fraudulent or unlawful activities.</li>
              <li>Do not attempt to gain unauthorized access to our systems.</li>
              <li>Do not upload malicious files, code, or harmful content.</li>
              <li>Do not interfere with the normal operation of the website.</li>
              <li>Do not misuse our products, services, or customer support.</li>
            </ul>
          </section>

          {/* 14. Website Availability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Website Availability
            </h2>

            <p className="text-gray-700 mb-4">
              We aim to keep our website available and functioning properly,
              but we cannot guarantee uninterrupted access at all times.
            </p>

            <p className="text-gray-700 mb-4">
              The website may occasionally be unavailable because of
              maintenance, technical problems, updates, hosting issues, or
              circumstances outside our reasonable control.
            </p>
          </section>

          {/* 15. Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. Limitation of Liability
            </h2>

            <p className="text-gray-700 mb-4">
              To the extent permitted by applicable law, NextLayer Creations
              will not be liable for indirect, incidental, special, or
              consequential losses arising from the use of our website,
              products, or services.
            </p>

            <p className="text-gray-700 mb-4">
              Nothing in these Terms is intended to exclude or limit any
              liability that cannot legally be excluded or limited under
              applicable law.
            </p>
          </section>

          {/* 16. Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. Changes to These Terms
            </h2>

            <p className="text-gray-700 mb-4">
              We may update these Terms and Conditions from time to time to
              reflect changes to our products, services, business practices,
              or applicable legal requirements.
            </p>

            <p className="text-gray-700 mb-4">
              Any updated version will be published on this page with a
              revised &quot;Last updated&quot; date. We encourage you to review
              these Terms periodically.
            </p>
          </section>

          {/* 17. Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              17. Governing Law
            </h2>

            <p className="text-gray-700 mb-4">
              These Terms and Conditions are governed by the applicable laws
              of India. Any disputes arising in connection with these Terms,
              our website, or our products will be subject to the jurisdiction
              of the appropriate courts, subject to applicable law.
            </p>
          </section>

          {/* 18. Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              18. Contact Us
            </h2>

            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions,
              products, orders, returns, or our services, please contact us:
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-semibold">
                NextLayer Creations
              </p>

              <p className="text-gray-700">
                Email:{' '}
                <a
                  href="mailto:nextlayecreations.info@gmail.com"
                  className="text-amber-700 hover:text-amber-800 hover:underline"
                >
                  nextlayecreations.info@gmail.com
                </a>
              </p>

              <p className="text-gray-700">
                Phone: +91 97235 53038
              </p>

              <p className="text-gray-700">
                Address: C2-1215, Pragati IT Park, Mota Varachha,
                Surat - 394101, Gujarat, India
              </p>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-amber-700 hover:text-amber-800 font-medium transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

