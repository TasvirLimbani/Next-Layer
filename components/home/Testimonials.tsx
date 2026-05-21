'use client'

import { motion } from 'framer-motion'
// import InstagramEmbed from '../insta'

export default function Portfolio() {
    // =========================
    // REVIEWS DATA
    // =========================
    const reviews = [
        {
            name: 'Rahul Patel',
            role: 'CEO, Fashion Brand',
            review:
                'Amazing website design and smooth development process. Highly recommended!',
            rating: '★★★★★',
        },
        {
            name: 'Priya Shah',
            role: 'Dental Clinic Owner',
            review:
                'Our clinic website looks premium and loads super fast. Great experience.',
            rating: '★★★★★',
        },
        {
            name: 'Amit Verma',
            role: 'Gym Owner',
            review:
                'Professional team with modern UI design. Clients love our new website.',
            rating: '★★★★★',
        },
        {
            name: 'Karan Mehta',
            role: 'Real Estate Agency',
            review:
                'Very clean design and mobile responsive website. Perfect work done.',
            rating: '★★★★★',
        },
        {
            name: 'Sneha Joshi',
            role: 'Beauty Store',
            review:
                'They created a beautiful ecommerce website for our brand.',
            rating: '★★★★★',
        },
    ]

    // =========================
    // INSTAGRAM REELS
    // =========================
    const reels = [
        {
            link: 'https://www.instagram.com/reel/DWq6zhzAsNr/',
        },
        {
            link: 'https://www.instagram.com/reel/DW8CSnigkxQ/',
        },
        {
            link: 'https://www.instagram.com/reel/DWk7VFcAtRw/',
        },
        {
            link: 'https://www.instagram.com/reel/DWgcgMtAkEI/',
        },
        {
            link: 'https://www.instagram.com/reel/DWdHxqmAl62/',
        }
    ]

    return (
        <section
            id="portfolio"
            className="py-20 bg-white overflow-hidden"
        >
            {/* HEADING */}
            <div className="text-center mb-14 px-4">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black">
                    Client
                    <span className="block bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                        Reviews & Reels
                    </span>
                </h2>
            </div>

            {/* ===================================== */}
            {/* REVIEWS ROW */}
            {/* ===================================== */}
            <div className="relative overflow-hidden mb-8">
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="flex gap-6 w-max"
                >
                    {[...reviews, ...reviews].map((review, index) => (
                        <div
                            key={index}
                            className="w-[320px] sm:w-[420px] md:w-[500px] min-h-[240px] rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white shrink-0 shadow-2xl"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-yellow-300 text-xl mb-4">
                                        {review.rating}
                                    </p>

                                    <p className="text-lg sm:text-xl leading-relaxed text-white/90">
                                        “{review.review}”
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold">
                                        {review.name}
                                    </h3>

                                    <p className="text-white/80 mt-1">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ===================================== */}
            {/* INSTAGRAM REELS ROW */}
            {/* ===================================== */}
            {/* ===================================== */}
            {/* INSTAGRAM REELS ROW */}
            {/* ===================================== */}
            <div className="relative overflow-hidden">
                <motion.div
                    animate={{ x: ['-50%', '0%'] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="flex gap-6 w-max"
                >
                    {[...reels, ...reels].map((reel, index) => (
                        <div
                            key={index}
                            className="relative w-[300px] sm:w-[340px] h-[480px] rounded-[35px] overflow-hidden bg-black shrink-0 shadow-2xl"
                        >
                            <iframe
                                src={`${reel.link}embed/captioned`}
                                className="absolute top-0 left-0 w-full h-[720px] border-0 scale-[1.02]"
                                scrolling="no"
                                allowTransparency={true}
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            />

                            {/* Glass Overlay */}
                            <div className="absolute inset-0 pointer-events-none rounded-[35px] ring-1 ring-white/10" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

