'use client';

import { FormEvent, useState } from 'react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const data = new FormData(form);

        setLoading(true);
        setSubmitted(false);

        // Temporary frontend acknowledgement.
        // Connect this form to your backend/email service here.
        await new Promise((resolve) => setTimeout(resolve, 800));

        console.log({
            name: data.get('name'),
            email: data.get('email'),
            phone: data.get('phone'),
            subject: data.get('subject'),
            orderNumber: data.get('orderNumber'),
            message: data.get('message'),
        });

        setLoading(false);
        setSubmitted(true);
        form.reset();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gray-50 py-10 sm:py-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-700 mb-3">
                        NextLayer Creations
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
                        Have a question about an order, a product, or a custom
                        3D-printed creation? We&apos;re here to help.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Contact Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 h-full border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Get in touch
                            </h2>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                Whether you need help with an existing order,
                                want to know more about one of our products, or
                                have an idea for a custom 3D print, feel free
                                to contact us.
                            </p>

                            {/* Email */}
                            <div className="mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-amber-700"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.8}
                                                d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Email
                                        </p>

                                        <a
                                            href="mailto:nextlayercreations.info@gmail.com"
                                            className="text-gray-900 font-medium hover:text-amber-700 transition break-all"
                                        >
                                            nextlayercreations.info@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-amber-700"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.8}
                                                d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515L10 8a2 2 0 01-.5 1.86l-1.27 1.27a16 16 0 006.64 6.64l1.27-1.27A2 2 0 0118 16l3.485.78A2 2 0 0123 18.72V21a2 2 0 01-2 2C10.507 23 1 13.493 1 3a2 2 0 012-2z"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Phone
                                        </p>

                                        <a
                                            href="tel:+919723553038"
                                            className="text-gray-900 font-medium hover:text-amber-700 transition"
                                        >
                                            +91 97235 53038
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-amber-700"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.8}
                                                d="M12 21s7-5.25 7-12a7 7 0 10-14 0c0 6.75 7 12 7 12z"
                                            />
                                            <circle
                                                cx="12"
                                                cy="9"
                                                r="2.2"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Address
                                        </p>

                                        <p className="text-gray-900 font-medium leading-relaxed">
                                            C-1215, Pragati IT Park,
                                            <br />
                                            Mota Varachha,
                                            <br />
                                            Surat, Gujarat, India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Printing Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Looking for a custom 3D print?
                                </h3>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Tell us what you have in mind. Share your
                                    requirements, dimensions, preferred color,
                                    or design details and our team can help
                                    you explore the possibilities.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                            <div className="mb-7">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Send us a message
                                </h2>

                                <p className="text-gray-600">
                                    Fill out the form below and tell us how we
                                    can help.
                                </p>
                            </div>

                            {/* Success Message */}
                            {submitted && (
                                <div
                                    role="alert"
                                    className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4"
                                >
                                    <div className="flex gap-3">
                                        <div className="shrink-0">
                                            <svg
                                                className="w-5 h-5 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <p className="font-medium text-green-800">
                                                Message received!
                                            </p>

                                            <p className="text-sm text-green-700 mt-1">
                                                Thank you for contacting
                                                NextLayer Creations. We&apos;ll
                                                get back to you as soon as
                                                possible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-800 mb-1.5"
                                        >
                                            Name
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-800 mb-1.5"
                                        >
                                            Email
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Phone + Order Number */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-800 mb-1.5"
                                        >
                                            Phone
                                            <span className="text-gray-400 ml-1">
                                                (optional)
                                            </span>
                                        </label>

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="orderNumber"
                                            className="block text-sm font-medium text-gray-800 mb-1.5"
                                        >
                                            Order Number
                                            <span className="text-gray-400 ml-1">
                                                (optional)
                                            </span>
                                        </label>

                                        <input
                                            id="orderNumber"
                                            name="orderNumber"
                                            type="text"
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                            placeholder="e.g. NLC-1024"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium text-gray-800 mb-1.5"
                                    >
                                        What can we help you with?
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        defaultValue=""
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                    >
                                        <option value="" disabled>
                                            Select a topic
                                        </option>
                                        <option value="order">
                                            Order / Delivery
                                        </option>
                                        <option value="product">
                                            Product Question
                                        </option>
                                        <option value="custom">
                                            Custom 3D Printing
                                        </option>
                                        <option value="return">
                                            Return / Replacement
                                        </option>
                                        <option value="payment">
                                            Payment
                                        </option>
                                        <option value="other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-800 mb-1.5"
                                    >
                                        Message
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        required
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition resize-y focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                {/* Submit */}
                                <div className="pt-1">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#C4A57B] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#A88C6A] focus:outline-none focus:ring-2 focus:ring-[#C4A57B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="w-4 h-4 animate-spin"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                    />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By submitting this form, you agree that
                                    NextLayer Creations may use the information
                                    you provide to respond to your inquiry.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}