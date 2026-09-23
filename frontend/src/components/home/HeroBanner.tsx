'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Laptop,
  Home,
  Shirt,
  Sparkles,
  ShoppingBag,
  Gamepad2,
  Trophy,
  Wrench,
  HeartPulse,
  BookOpen,
  Dog,
  Grid,
  ChevronRight,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { Category } from '@/types';

interface HeroBannerProps {
  categories: Category[];
}

const CATEGORY_ITEMS = [
  { name: 'Electronics', slug: 'electronics', icon: Laptop },
  { name: 'Home & Kitchen', slug: 'home', icon: Home },
  { name: 'Fashion & Apparel', slug: 'fashion', icon: Shirt },
  { name: 'Beauty & Personal Care', slug: 'beauty', icon: Sparkles },
  { name: 'Groceries & Daily Needs', slug: 'food', icon: ShoppingBag },
  { name: 'Toys, Kids & Baby', slug: 'toys', icon: Gamepad2 },
  { name: 'Sports & Outdoors', slug: 'sports', icon: Trophy },
  { name: 'Automotive & Tools', slug: 'automotive', icon: Wrench },
  { name: 'Health & Wellness', slug: 'health', icon: HeartPulse },
  { name: 'Stationery & Books', slug: 'books', icon: BookOpen },
  { name: 'Pets', slug: 'pets', icon: Dog },
  { name: 'More Categories', slug: 'shop', icon: Grid },
];

export default function HeroBanner({ categories }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Big Savings Brighter Living',
      subtext: 'Electronics, Home, Fashion, Beauty & more',
      subtext2: 'All in one place — mall.thyaga.lk',
      discount: 'UP TO 60% OFF',
      cta: 'Shop Now',
      link: '/shop',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Smarter Devices for a Better You',
      subtext: 'Premium Audio, Smartwatches & Gadgets',
      subtext2: 'Official Sri Lanka Warranty Guaranteed',
      discount: 'UP TO 50% OFF',
      cta: 'Explore Tech',
      link: '/shop?category=electronics',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Trending Styles For Everyone',
      subtext: 'Apparel, Footwear & Everyday Comfort',
      subtext2: 'Fresh Collections at Unbeatable Prices',
      discount: 'UP TO 40% OFF',
      cta: 'Shop Fashion',
      link: '/shop?category=fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Column: Vertical Category List (12 items) */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-2xs p-2 flex flex-col justify-between">
          <div className="space-y-0.5">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/shop?category=${cat.slug}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#36135d] hover:bg-purple-50 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#36135d]" />
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#36135d]" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center Column: Main Hero Promo Banner */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between bg-linear-to-r from-[#2c0b4d] via-[#3f106d] to-[#581596] text-white p-6 sm:p-8 min-h-[350px]">
          {/* Discount Badge Circle Top Right */}
          <div className="absolute top-5 right-5 sm:top-6 sm:right-6 bg-[#e11d48] w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 border-white/20 animate-pulse-subtle z-20">
            <span className="text-[9px] font-bold tracking-wider text-pink-100 uppercase leading-none">UP TO</span>
            <span className="text-sm sm:text-base font-black leading-tight text-white my-0.5">60%</span>
            <span className="text-[9px] font-bold tracking-wider text-pink-100 uppercase leading-none">OFF</span>
          </div>

          {/* Left Content */}
          <div className="relative z-10 max-w-sm mt-2">
            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight mb-2 drop-shadow-sm font-poppins">
              {activeSlide.title}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 font-medium mb-1">
              {activeSlide.subtext}
            </p>
            <p className="text-[11px] text-purple-300/80 mb-6">
              {activeSlide.subtext2}
            </p>

            <Link
              href={activeSlide.link}
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-[#e11d48] hover:text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              <span>{activeSlide.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Montage Background Mockup */}
          <div className="absolute -bottom-2 -right-4 w-60 sm:w-72 h-48 sm:h-56 pointer-events-none opacity-90">
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Carousel Dots */}
          <div className="relative z-10 flex items-center gap-1.5 mt-auto pt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: 2 Promo Cards (Download App Removed) */}
        <div className="lg:col-span-3 flex flex-col gap-3 justify-between">
          {/* Card 1: New User? Get Rs. 1,000 OFF */}
          <div className="bg-linear-to-br from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3] rounded-xl border border-pink-200 p-5 flex flex-col justify-between shadow-2xs group flex-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#e11d48] uppercase tracking-wider block">
                  New User?
                </span>
                <span className="bg-[#e11d48] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  Welcome Deal
                </span>
              </div>
              <h4 className="text-base font-black text-gray-900 font-poppins mt-1">Get Rs. 1,000 OFF</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Enjoy instant savings on your first online order with Thyaga voucher.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-black px-4 py-2 rounded-lg transition shadow-xs"
              >
                <span>Claim Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              {/* 3D Wrapped Gift Box Icon */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 64 64" className="w-13 h-13 drop-shadow-md transition-transform group-hover:scale-105 duration-300">
                  <path d="M12 24 L32 34 L52 24 L32 14 Z" fill="#f43f5e" />
                  <path d="M12 24 L32 34 L32 54 L12 44 Z" fill="#e11d48" />
                  <path d="M32 34 L52 24 L52 44 L32 54 Z" fill="#be123c" />
                  <path d="M28 16 L36 20 L36 54 L28 50 Z" fill="#fef08a" opacity="0.9" />
                  <path d="M12 33 L52 13 L52 17 L12 37 Z" fill="#fef08a" opacity="0.8" />
                  <circle cx="32" cy="18" r="4" fill="#fbbf24" />
                  <path d="M32 18 C28 10 20 14 28 20 Z" fill="#f59e0b" />
                  <path d="M32 18 C36 10 44 14 36 20 Z" fill="#f59e0b" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Fast Islandwide Delivery */}
          <div className="bg-linear-to-br from-[#f0f9ff] to-[#eff6ff] rounded-xl border border-blue-100 p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 leading-tight">Fast Islandwide Delivery</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Prompt 3 – 5 Working Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
