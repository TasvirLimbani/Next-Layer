'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface Notification {
  id: string;
  productImage: string;
  productName: string;
  buyerName: string;
  location: string;
  timeAgo: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    productImage: '/products/castle.jpg',
    productName: 'Intricate 3D Castle',
    buyerName: 'Sarah M.',
    location: 'California',
    timeAgo: 'Just now',
  },
  {
    id: '2',
    productImage: '/products/dragon.jpg',
    productName: 'Dragon Wall Mount',
    buyerName: 'James K.',
    location: 'New York',
    timeAgo: '2 minutes ago',
  },
  {
    id: '3',
    productImage: '/products/organizer.jpg',
    productName: 'Desk Organizer',
    buyerName: 'Emma L.',
    location: 'Texas',
    timeAgo: '5 minutes ago',
  },
  {
    id: '4',
    productImage: '/products/keychain.jpg',
    productName: 'Custom Keychain',
    buyerName: 'Michael R.',
    location: 'Florida',
    timeAgo: '10 minutes ago',
  },
];

export default function PurchaseNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show a notification after a delay
    const timer = setTimeout(() => {
      setVisible(true);
      setNotifications([SAMPLE_NOTIFICATIONS[0]]);

      // Cycle through notifications
      let index = 1;
      const interval = setInterval(() => {
        if (index < SAMPLE_NOTIFICATIONS.length) {
          setNotifications([SAMPLE_NOTIFICATIONS[index]]);
          index++;
        } else {
          setNotifications([]);
          setVisible(false);
          clearInterval(interval);
        }
      }, 4000);

      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible || notifications.length === 0) return null;

  const notification = notifications[0];

  return (
    <div className="fixed bottom-4 left-4 z-40 animate-slide-in-left">
      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4" style={{ borderColor: '#C4A57B' }}>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition"
        >
          <X size={16} />
        </button>

        <div className="flex gap-3 pr-6">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={`/api/image-proxy?url=${encodeURIComponent(notification.productImage)}`}
              alt={notification.productName}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Someone purchased
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-2">{notification.productName}</p>
            <p className="text-xs text-gray-600">
              {notification.buyerName} from {notification.location}
            </p>
            <p className="text-xs text-gray-500 mt-1">{notification.timeAgo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
