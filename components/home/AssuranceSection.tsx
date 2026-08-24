'use client';

import { CheckCircle, Truck, Clock } from 'lucide-react';

const ASSURANCES = [
  {
    icon: CheckCircle,
    title: 'Money Back Guarantee',
    description: 'Unsatisfied? Get your money back within 30 days',
  },
  {
    icon: Truck,
    title: 'Fast & Free Shipping',
    description: 'Free shipping on orders over ₹999',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our team is here to help anytime',
  },
];

export default function AssuranceSection() {
  return (
    <section className="py-16 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ASSURANCES.map((assurance, index) => {
            const Icon = assurance.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div
                  className="mb-4 p-4 rounded-full"
                  style={{ backgroundColor: '#E8DCC8' }}
                >
                  <Icon size={32} style={{ color: '#C4A57B' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{assurance.title}</h3>
                <p className="text-gray-600 text-sm">{assurance.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
