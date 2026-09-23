'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { FlashSale } from '@/types';
import { useCart } from '@/context/CartContext';

interface FlashSaleSectionProps {
  flashSale?: FlashSale | null;
}

// Exact 6 Flash Deal items from the reference design
const FLASH_DEAL_ITEMS = [
  {
    id: 101,
    name: 'Samsung Galaxy A15 128GB – Blue',
    slug: 'samsung-galaxy-a15',
    discount: 30,
    price: 49990,
    regularPrice: 71990,
    sold: 120,
    total: 180,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 102,
    name: 'Philips Air Fryer 4.1L',
    slug: 'philips-air-fryer-4l',
    discount: 45,
    price: 27990,
    regularPrice: 50990,
    sold: 86,
    total: 120,
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 103,
    name: 'JBL Wave Beam True Wireless',
    slug: 'jbl-wave-beam-wireless',
    discount: 38,
    price: 16990,
    regularPrice: 27500,
    sold: 64,
    total: 100,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 104,
    name: 'Haylou Smart Watch 2 Pro',
    slug: 'haylou-smart-watch-2-pro',
    discount: 52,
    price: 9990,
    regularPrice: 20990,
    sold: 91,
    total: 150,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 105,
    name: 'Travel Laptop Backpack (15.6")',
    slug: 'travel-laptop-backpack',
    discount: 40,
    price: 5990,
    regularPrice: 9990,
    sold: 67,
    total: 100,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 106,
    name: 'Non-Stick Cookware Set 7pcs',
    slug: 'non-stick-cookware-set-7pcs',
    discount: 33,
    price: 11900,
    regularPrice: 17990,
    sold: 52,
    total: 80,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
  },
];

export default function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('All Deals');
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 21, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 21, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="my-6 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-5">
      {/* Flash Deals Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          {/* Lightning Icon & Title */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-5 h-5 text-[#dc2626] fill-[#dc2626]" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight font-poppins">
              Flash Deals
            </h2>
          </div>

          {/* Ends In Countdown Badges */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span>Ends in</span>
            <div className="flex items-center gap-1 font-bold">
              <span className="bg-[#dc2626] text-white px-1.5 py-0.5 rounded text-[11px] font-black">
                {formatDigit(timeLeft.hours)}
              </span>
              <span className="text-[#dc2626] font-bold">:</span>
              <span className="bg-[#dc2626] text-white px-1.5 py-0.5 rounded text-[11px] font-black">
                {formatDigit(timeLeft.minutes)}
              </span>
              <span className="text-[#dc2626] font-bold">:</span>
              <span className="bg-[#dc2626] text-white px-1.5 py-0.5 rounded text-[11px] font-black">
                {formatDigit(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-gray-500 ml-2">
            {['All Deals', 'Electronics', 'Home', 'Fashion', 'Beauty'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition cursor-pointer pb-0.5 ${
                  activeTab === tab
                    ? 'text-[#36135d] border-b-2 border-[#36135d] font-bold'
                    : 'hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <Link
          href="/flash-deals"
          className="text-xs font-bold text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 group self-start md:self-auto"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 6 Flash Deal Cards in a Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {FLASH_DEAL_ITEMS.map((item) => {
          const percentClaimed = Math.min(100, Math.round((item.sold / item.total) * 100));

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200/90 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Product Thumbnail */}
              <Link href={`/product/${item.slug}`} className="block relative aspect-square bg-[#fbfbfe] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Red Discount Tag */}
                <div className="absolute top-2 left-2 bg-[#dc2626] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                  -{item.discount}%
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </Link>

              {/* Product Info */}
              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#36135d] transition mb-1.5 h-8">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="mb-2">
                    <div className="text-sm font-black text-[#dc2626]">
                      Rs. {item.price.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-400 line-through">
                      Rs. {item.regularPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1 mb-2.5">
                  <div className="text-[10px] font-bold text-gray-500">
                    {item.sold} sold
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-orange-500 to-red-600 h-1.5 rounded-full"
                      style={{ width: `${percentClaimed}%` }}
                    />
                  </div>
                </div>

                {/* Solid Purple Add to Cart Button */}
                <button
                  onClick={() => {
                    addToCart(
                      {
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        regular_price: item.regularPrice,
                        sale_price: item.price,
                        stock_quantity: 50,
                        primary_image: item.image,
                        is_active: true,
                      } as any,
                      1,
                      item.price
                    );
                  }}
                  className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
