import { Layers3, Printer, Rocket, Mail } from "lucide-react";

export const metadata = {
  title: "Coming Soon | 3D Print Store",
  description: "Custom 3D printed products launching soon.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2">
            <Printer className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-300">
              Premium 3D Printed Products
            </span>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <Layers3 className="h-16 w-16 text-cyan-400" />
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            We're Printing
            <span className="block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Something Amazing
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl">
            Our online store for custom 3D printed products is launching soon.
            Discover unique designs, prototypes, home décor, miniatures, gifts,
            and personalized creations made with precision.
          </p>

          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <Printer className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
              <p className="font-medium">Custom Designs</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <Layers3 className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
              <p className="font-medium">High-Quality Prints</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <Rocket className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
              <p className="font-medium">Fast Delivery</p>
            </div>
          </div>

          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Mail className="h-4 w-4" />
            Contact 
          </a>
        </div>
      </div>
    </main>
  );
}