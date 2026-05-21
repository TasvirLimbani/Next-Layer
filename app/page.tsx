import HeroCarousel from '@/components/home/HeroCarousel';
import BestSellers from '@/components/home/BestSellers';
import FeaturedSection from '@/components/home/FeaturedSection';
import AssuranceSection from '@/components/home/AssuranceSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import FAQSection from '@/components/home/FAQSection';
import NewArrivals from '@/components/home/NewArrivals';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <>
      {/* Hero Carousel */}
      <section className="w-full -mt-[80px] pt-[80px]">
        <HeroCarousel />
      </section>

      {/* Best Sellers */}
      <BestSellers />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Featured Section */}
      <FeaturedSection />

      {/* Assurance Section */}
      <AssuranceSection />

      {/* Reviews Section */}
      {/* <ReviewsSection /> */}

      <Testimonials />

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#E8DCC8' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 text-lg mb-8">
            Subscribe to get 10% off your first order and stay informed about new designs
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded border-0 focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 font-semibold rounded text-white transition hover:opacity-90"
              style={{ backgroundColor: '#C4A57B' }}
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
