import HeroCarousel from '@/components/home/HeroCarousel';
import BestSellers from '@/components/home/BestSellers';
import FeaturedSection from '@/components/home/FeaturedSection';
import AssuranceSection from '@/components/home/AssuranceSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import FAQSection from '@/components/home/FAQSection';
import NewArrivals from '@/components/home/NewArrivals';
import Testimonials from '@/components/home/Testimonials';
import { Layers3, Mail, Printer, Rocket } from 'lucide-react';

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
      {/* <FeaturedSection /> */}

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



// export default function Home() {
//   return (
//   <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//   {/* Background Effects */}
//   <div className="absolute inset-0 -z-10">
//     <div className="absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl sm:left-1/4 sm:h-72 sm:w-72 sm:translate-x-0" />

//     <div className="absolute bottom-10 right-1/2 h-48 w-48 translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl sm:right-1/4 sm:h-72 sm:w-72 sm:translate-x-0" />
//   </div>

//   <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
//     <div className="w-full max-w-3xl text-center">
//       {/* Badge */}
//       <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2">
//         <Printer className="h-4 w-4 shrink-0 text-cyan-400" />

//         <span className="text-xs text-slate-300 sm:text-sm">
//           Premium 3D Printed Products
//         </span>
//       </div>

//       {/* Logo */}
//       <div className="mb-6 flex justify-center">
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:rounded-3xl sm:p-6">
//           <Layers3 className="h-12 w-12 text-cyan-400 sm:h-16 sm:w-16" />
//         </div>
//       </div>

//       {/* Heading */}
//       <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
//         We're Printing

//         <span className="block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
//           Something Amazing
//         </span>
//       </h1>

//       {/* Description */}
//       <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
//         Our online store for custom 3D printed products is launching soon.
//         Discover unique designs, prototypes, home décor, miniatures, gifts,
//         and personalized creations made with precision.
//       </p>

//       {/* Features */}
//       <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
//           <Printer className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
//           <p className="font-medium">Custom Designs</p>
//         </div>

//         <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
//           <Layers3 className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
//           <p className="font-medium">High-Quality Prints</p>
//         </div>

//         <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:col-span-2 lg:col-span-1">
//           <Rocket className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
//           <p className="font-medium">Fast Delivery</p>
//         </div>
//       </div>

//       {/* Button */}
//       <a
//         href="mailto:nextlayercreations.info@gmail.com"
//         className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
//       >
//         <Mail className="h-4 w-4" />
//         Contact
//       </a>
//     </div>
//   </div>
// </main>
//   );
// }