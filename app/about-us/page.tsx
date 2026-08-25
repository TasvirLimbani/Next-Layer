'use client';

export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                    About Us
                </h1>

                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    We create unique, functional, and creative products using
                    modern 3D printing technology. From everyday essentials to
                    customized designs, we turn ideas into real products that
                    people can use, enjoy, and make their own.
                </p>
            </header>

            {/* Mission / Vision / Values */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">
                        Our Mission
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        Our mission is to make innovative and thoughtfully
                        designed 3D-printed products accessible to everyone.
                        We focus on creating products that are useful,
                        creative, and made with care.
                    </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">
                        Our Vision
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        We envision a world where ideas can be transformed
                        into real, useful products quickly and creatively
                        through the power of 3D printing.
                    </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">
                        Our Values
                    </h3>

                    <ul className="text-gray-700 list-disc list-inside space-y-1">
                        <li>Quality &amp; attention to detail</li>
                        <li>Creative and practical designs</li>
                        <li>Customer satisfaction</li>
                        <li>Continuous innovation</li>
                    </ul>
                </div>
            </section>

            {/* Who We Are */}
            <section className="mb-12">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">
                        What We Do
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-4">
                        We specialize in designing and selling 3D-printed
                        products made for everyday life, hobbies, gifting,
                        organization, decoration, and more. Each product is
                        carefully designed, printed, inspected, and prepared
                        before it reaches you.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        3D printing allows us to experiment with new ideas,
                        create unique shapes, produce small batches, and offer
                        products that are difficult to manufacture using
                        traditional methods. Whether it is a simple useful
                        accessory or a creative custom design, we love turning
                        concepts into something tangible.
                    </p>
                </div>
            </section>

            {/* Team */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                    Meet the Team
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600 shrink-0">
                            RG
                        </div>

                        <div>
                            <p className="font-semibold">
                                Rushita Ginoya
                            </p>
                            <p className="text-sm text-gray-600">
                                Founder &amp; CEO
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600 shrink-0">
                            NG
                        </div>

                        <div>
                            <p className="font-semibold">
                                Nilay Ginoya
                            </p>
                            <p className="text-sm text-gray-600">
                                Design &amp; Production
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600 shrink-0">
                            HT
                        </div>

                        <div>
                            <p className="font-semibold">
                                Hardik Talaviya
                            </p>
                            <p className="text-sm text-gray-600">
                                3D Printing &amp; Production
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="mb-12">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">
                        Why Choose Us?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Carefully Designed
                            </h3>
                            <p className="text-gray-700">
                                We focus on designs that balance appearance,
                                functionality, and usability.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Quality Printing
                            </h3>
                            <p className="text-gray-700">
                                Every product goes through our printing and
                                quality-checking process before shipping.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Unique Products
                            </h3>
                            <p className="text-gray-700">
                                3D printing gives us the freedom to create
                                products that are different from ordinary
                                mass-produced items.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Made With Passion
                            </h3>
                            <p className="text-gray-700">
                                We love experimenting with new ideas and
                                bringing creative products to life.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">
                    Get in Touch
                </h2>

                <p className="text-gray-700 mb-4 leading-relaxed">
                    Have a question about our products, want to discuss a
                    custom 3D-printed product, or simply want to know more
                    about us? We would love to hear from you.
                </p>

                <p className="text-gray-700">
                    Email us at{' '}
                    <a
                        href="mailto:nextlayecreations.info@gmail.com"
                        className="text-amber-600 font-medium hover:underline"
                    >
                        nextlayercreations.info@gmail.com                    </a>
                </p>
            </section>
        </div>
    );
}