'use client';

export default function ContactPage() {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        // For now do a simple client-side acknowledgement
        alert('Thanks for your message — we will reply to ' + (data.get('email') || '') + ' soon.');
        e.currentTarget.reset();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-600 mb-8">
                Have questions or need assistance? Email us at{' '}
                <a href="mailto:talaviyahardik4@gmail.com" className="text-amber-600 font-medium">
                    talaviyahardik4@gmail.com
                </a>
                .
            </p>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 border-b md:border-b-0 md:border-r">
                        <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
                        <p className="text-gray-700 mb-2">
                            <strong>Email:</strong>{' '}
                            <a href="mailto:talaviyahardik4@gmail.com" className="text-amber-600">
                                talaviyahardik4@gmail.com
                            </a>
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Phone:</strong>+91 97235 53038
                        </p>
                        <p className="text-gray-700">
                            <strong>Address:</strong> 123 Design Street, Creative City
                        </p>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    id="name"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 p-2"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 p-2"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows={5}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 p-2"
                                    placeholder="Your message"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-2 bg-[#C4A57B] hover:bg-[#A88C6A] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4A57B]"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
