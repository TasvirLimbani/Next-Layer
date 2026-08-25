'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: August 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="prose prose-sm sm:prose max-w-none">

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Introduction
            </h2>

            <p className="text-gray-700 mb-4">
              Welcome to NextLayer Creations. We value your privacy and are
              committed to protecting the information you provide when using
              our website and purchasing our 3D-printed products.
            </p>

            <p className="text-gray-700 mb-4">
              This Privacy Policy explains what information we may collect,
              how we use it, how we protect it, and the choices you may have
              regarding your personal information.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Information You Provide
            </h3>

            <p className="text-gray-700 mb-4">
              When you place an order, contact us, create an account, or
              otherwise interact with our website, we may collect information
              such as:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Your name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and shipping address</li>
              <li>Order and purchase information</li>
              <li>Product preferences and customization details</li>
              <li>Information you provide when contacting customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Payment Information
            </h3>

            <p className="text-gray-700 mb-4">
              Payments may be processed through third-party payment providers.
              Depending on the payment method used, your payment information
              may be collected and processed directly by the relevant payment
              provider. We do not intentionally store your complete credit or
              debit card details on our own servers.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Automatically Collected Information
            </h3>

            <p className="text-gray-700 mb-4">
              When you browse our website, certain technical information may
              be collected automatically, such as:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited on our website</li>
              <li>Date and time of visits</li>
              <li>Website usage information</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Your Information
            </h2>

            <p className="text-gray-700 mb-4">
              We may use the information we collect for purposes including:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Processing and fulfilling your orders</li>
              <li>Preparing and shipping your 3D-printed products</li>
              <li>Processing payments through authorized payment providers</li>
              <li>Sending order confirmations and shipping updates</li>
              <li>Responding to questions and customer support requests</li>
              <li>Handling custom product or personalization requests</li>
              <li>Improving our products, website, and shopping experience</li>
              <li>Preventing fraudulent or unauthorized activity</li>
              <li>Maintaining website security</li>
              <li>Complying with applicable laws and legal obligations</li>
            </ul>
          </section>

          {/* Order & Custom Product Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Custom and 3D-Printed Products
            </h2>

            <p className="text-gray-700 mb-4">
              If you request a customized or made-to-order 3D-printed
              product, we may need to collect additional information required
              to create your product, such as design requirements,
              personalization details, measurements, images, or other files
              you voluntarily provide.
            </p>

            <p className="text-gray-700 mb-4">
              Such information will be used only as reasonably necessary to
              fulfill your order, communicate with you about the product, and
              provide customer support.
            </p>
          </section>

          {/* Sharing Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Share Your Information
            </h2>

            <p className="text-gray-700 mb-4">
              We do not sell or rent your personal information to third
              parties.
            </p>

            <p className="text-gray-700 mb-4">
              We may share limited information with trusted third parties when
              necessary to operate our business and fulfill your orders,
              including:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                <strong>Payment Providers:</strong> To securely process
                payments and transactions.
              </li>

              <li>
                <strong>Shipping and Delivery Partners:</strong> To deliver
                your orders to the address you provide.
              </li>

              <li>
                <strong>Technology and Hosting Providers:</strong> To operate
                and maintain our website and online services.
              </li>

              <li>
                <strong>Legal Authorities:</strong> When disclosure is
                required by applicable law or legal process.
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookies and Similar Technologies
            </h2>

            <p className="text-gray-700 mb-4">
              Our website may use cookies and similar technologies to support
              essential website functions, remember preferences, understand
              website usage, and improve the overall shopping experience.
            </p>

            <p className="text-gray-700 mb-4">
              You can manage or disable cookies through your browser settings.
              However, disabling certain cookies may affect some website
              functionality.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Security
            </h2>

            <p className="text-gray-700 mb-4">
              We take reasonable measures to protect the personal information
              we handle against unauthorized access, misuse, alteration, or
              disclosure.
            </p>

            <p className="text-gray-700 mb-4">
              Where appropriate, we use secure technologies and trusted
              third-party service providers to help protect information during
              online transactions and communications.
            </p>

            <p className="text-gray-700 mb-4">
              However, no method of transmitting or storing information online
              can be guaranteed to be completely secure.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Retention
            </h2>

            <p className="text-gray-700 mb-4">
              We retain personal information only for as long as reasonably
              necessary to provide our services, fulfill orders, maintain
              business and transaction records, resolve disputes, prevent
              fraud, and comply with applicable legal and accounting
              requirements.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Privacy Rights
            </h2>

            <p className="text-gray-700 mb-4">
              Depending on applicable law and your location, you may have
              certain rights regarding your personal information, including:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Requesting access to personal information we hold about you</li>
              <li>Requesting correction of inaccurate information</li>
              <li>Requesting deletion of personal information where applicable</li>
              <li>Withdrawing consent where processing is based on consent</li>
              <li>Requesting information about how your data is used</li>
            </ul>

            <p className="text-gray-700 mb-4">
              To make a privacy-related request, please contact us using the
              contact details provided below. We may need to verify your
              identity before completing certain requests.
            </p>
          </section>

          {/* Marketing Communications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Marketing Communications
            </h2>

            <p className="text-gray-700 mb-4">
              If we send promotional emails or other marketing communications,
              you may opt out by following the unsubscribe instructions
              included in those communications or by contacting us directly.
            </p>

            <p className="text-gray-700 mb-4">
              You may still receive important transactional communications,
              such as order confirmations, payment information, and shipping
              updates.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Children&apos;s Privacy
            </h2>

            <p className="text-gray-700 mb-4">
              Our website and products are intended for general consumers and
              are not specifically directed toward children. We do not
              knowingly collect personal information from children in
              circumstances where such collection is prohibited by applicable
              law.
            </p>

            <p className="text-gray-700 mb-4">
              If you believe that a child has provided us with personal
              information, please contact us so that we can review and take
              appropriate action.
            </p>
          </section>

          {/* Third Party Links */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Third-Party Websites and Services
            </h2>

            <p className="text-gray-700 mb-4">
              Our website may contain links to third-party websites or use
              third-party services such as payment and shipping providers.
              These third parties have their own privacy policies and terms.
            </p>

            <p className="text-gray-700 mb-4">
              We are not responsible for the privacy practices or content of
              third-party websites and services.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to This Privacy Policy
            </h2>

            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our business, website, services, or applicable legal
              requirements.
            </p>

            <p className="text-gray-700 mb-4">
              When changes are made, we will update the &quot;Last updated&quot;
              date shown at the top of this page. We encourage you to review
              this page periodically for the latest information.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>

            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, your
              personal information, or our privacy practices, please contact
              NextLayer Creations:
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
                  nextlayercreations.info@gmail.com                </a>
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

