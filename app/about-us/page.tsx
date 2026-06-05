'use client';

export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Us</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    We build beautiful, usable digital experiences. Our team blends design,
                    engineering, and product thinking to craft e‑commerce solutions that
                    delight customers and drive growth.
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                    <p className="text-gray-700">Deliver delightful shopping experiences through thoughtful design and reliable engineering.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                    <p className="text-gray-700">A seamless commerce layer that makes buying and selling online effortless.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Customer-first</li>
                        <li>Design-driven</li>
                        <li>Data-informed</li>
                    </ul>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Meet the team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600">AH</div>
                        <div>
                            <p className="font-semibold">Hardik Talaviya</p>
                            <p className="text-sm text-gray-600">Founder &amp; CEO</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600">JS</div>
                        <div>
                            <p className="font-semibold">Pankil Vaghani</p>
                            <p className="text-sm text-gray-600">Head of Design</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
                <p className="text-gray-700 mb-4">Have questions about our work or partnerships? Email us at <a href="mailto:talaviyahardik4@gmail.com" className="text-amber-600 font-medium">talaviyahardik4@gmail.com</a>.</p>
            </section>
        </div>
    );
}
