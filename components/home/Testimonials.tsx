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
            role: 'Engineering Student',
            review:
                'The 3D printed parts were highly accurate and matched the dimensions perfectly. Great quality and fast delivery.',
            rating: '★★★★★',
        },
        {
            name: 'Priya Shah',
            role: 'Product Designer',
            review:
                'Excellent print quality with smooth finishing. The custom prototype helped us speed up our product development.',
            rating: '★★★★★',
        },
        {
            name: 'Amit Verma',
            role: 'Robotics Enthusiast',
            review:
                'Ordered custom gears and brackets for my robotics project. The parts were durable and fit perfectly.',
            rating: '★★★★★',
        },
        {
            name: 'Karan Mehta',
            role: 'Architecture Consultant',
            review:
                'The 3D printed architectural model exceeded expectations. Fine details were captured beautifully.',
            rating: '★★★★★',
        },
        {
            name: 'Sneha Joshi',
            role: 'Small Business Owner',
            review:
                'Great experience ordering custom 3D printed products. Quality, packaging, and support were all excellent.',
            rating: '★★★★★',
        },
    ]

    // =========================
    // INSTAGRAM REELS
    // =========================
  

    return (
        <section
            id="portfolio"
            className="py-10 bg-white overflow-hidden"
        >
            {/* HEADING */}
            <div className="text-center mb-14 px-4">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black">
                    Client
                    <span className="block bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                        Reviews & Reels
                    </span>
                </h2>
            </div>

            {/* ===================================== */}
            {/* REVIEWS ROW */}
            {/* ===================================== */}
           <div className="relative mb-8 w-full overflow-hidden">
  <motion.div
    className="flex w-max gap-3 sm:gap-5 will-change-transform"
    animate={{
      x: ['0px', '-50%'],
    }}
    transition={{
      duration: 30,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    }}
  >
    {[...reviews, ...reviews].map((review, index) => (
      <div
        key={`${review.name}-${index}`}
        className="
          shrink-0
          w-[78vw]
          max-w-[290px]
          sm:w-[380px]
          sm:max-w-none
          md:w-[460px]

          min-h-[185px]
          sm:min-h-[220px]

          rounded-2xl
          sm:rounded-3xl

          bg-gradient-to-br
          from-purple-600
          to-pink-500

          px-4
          py-4
          sm:p-7

          text-white

          shadow-lg
        "
      >
        <div className="flex h-full flex-col justify-between">

          {/* Rating + Review */}
          <div>
            <div className="mb-2 sm:mb-4 text-sm sm:text-xl tracking-wide">
              {review.rating}
            </div>

            <p
              className="
                text-sm
                sm:text-lg
                leading-5
                sm:leading-7
                text-white/90
                line-clamp-4
              "
            >
              “{review.review}”
            </p>
          </div>

          {/* Customer */}
          <div className="mt-5 sm:mt-7">
            <h3 className="text-base sm:text-xl font-bold">
              {review.name}
            </h3>

            <p className="mt-0.5 text-xs sm:text-sm text-white/75">
              {review.role}
            </p>
          </div>

        </div>
      </div>
    ))}
  </motion.div>
</div>
        
            {/* <div className="relative overflow-hidden">
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
                                allowtransparency="true"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            />

                            <div className="absolute inset-0 pointer-events-none rounded-[35px] ring-1 ring-white/10" />
                        </div>
                    ))}
                </motion.div>
            </div> */}
        </section>
    )
}

