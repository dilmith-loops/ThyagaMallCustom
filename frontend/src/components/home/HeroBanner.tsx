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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { Category } from '@/types';

interface HeroBannerProps {
  categories?: Category[];
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
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      titleLine1: 'Big Savings',
      titleLine2: 'Brighter Living',
      subtext: 'Electronics, Home, Fashion, Beauty & more',
      subtext2: 'All in one place – mall.thyaga.lk',
      discountUpTo: 'UP TO',
      discountValue: '60%',
      discountOff: 'OFF',
      cta: 'Shop Now',
      link: '/shop',
      image: '/banners/hero_slide_1.jpg',
      alt: 'Big Savings Brighter Living - Electronics, Home & Fashion',
    },
    {
      id: 2,
      titleLine1: 'Smarter Devices',
      titleLine2: 'Better Everyday',
      subtext: 'Premium Audio, Smartwatches & Gadgets',
      subtext2: 'Official Sri Lanka Warranty Guaranteed',
      discountUpTo: 'UP TO',
      discountValue: '50%',
      discountOff: 'OFF',
      cta: 'Shop Now',
      link: '/shop?category=electronics',
      image: '/banners/hero_slide_2.jpg',
      alt: 'Smarter Devices for a Better You - Premium Audio & Smart Gadgets',
    },
    {
      id: 3,
      titleLine1: 'Trending Styles',
      titleLine2: 'Modern Living',
      subtext: 'Designer Apparel, Fragrances & Accessories',
      subtext2: 'Fresh Collections at Unbeatable Prices',
      discountUpTo: 'UP TO',
      discountValue: '45%',
      discountOff: 'OFF',
      cta: 'Shop Now',
      link: '/shop?category=fashion',
      image: '/banners/hero_slide_3.jpg',
      alt: 'Trending Styles For Everyone - Fashion, Footwear & Accessories',
    },
    {
      id: 4,
      titleLine1: 'Home & Living',
      titleLine2: 'Smart Essentials',
      subtext: 'Cookware, Bedding, Decor & Appliances',
      subtext2: 'Transform Your Home – mall.thyaga.lk',
      discountUpTo: 'UP TO',
      discountValue: '55%',
      discountOff: 'OFF',
      cta: 'Shop Now',
      link: '/shop?category=home',
      image: '/banners/hero_slide_1.jpg',
      alt: 'Home & Kitchen Smart Essentials',
    },
    {
      id: 5,
      titleLine1: 'Exclusive Deals',
      titleLine2: 'Mega Savings',
      subtext: 'Daily Essentials & Groceries Delivered Fast',
      subtext2: 'Direct to your doorstep across Sri Lanka',
      discountUpTo: 'UP TO',
      discountValue: '40%',
      discountOff: 'OFF',
      cta: 'Shop Now',
      link: '/shop',
      image: '/banners/hero_slide_2.jpg',
      alt: 'Exclusive Deals and Mega Savings',
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Column: Vertical Category List (12 items) */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-2xs p-2.5 flex flex-col justify-between h-[425px]">
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

        {/* Center Column: Main Hero Promo Banner (Fixed Locked Height) */}
        <div
          className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between bg-[#240046] text-white p-6 sm:p-7 md:p-8 h-[380px] sm:h-[405px] lg:h-[425px] group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Image of 3D Podium & Tech Products */}
          <div className="absolute inset-0 z-0">
            <Image
              key={activeSlide.image}
              src={activeSlide.image}
              alt={activeSlide.alt}
              fill
              priority
              className="object-cover object-right transition-all duration-700 ease-out scale-100 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            {/* Seamless Left Gradient Overlay ensuring crisp typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#20003e] via-[#20003e]/85 sm:via-[#20003e]/65 via-45% to-transparent pointer-events-none" />
          </div>

          {/* Scalloped Starburst Rosette Badge Top Right */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 z-20 transition-transform duration-300 hover:scale-105 drop-shadow-lg animate-pulse-subtle">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-[#ff007f]"
              aria-hidden="true"
            >
              <path d="M 90.00 50.00 Q 97.08 59.36 86.96 65.31 Q 89.91 76.67 78.28 78.28 Q 76.67 89.91 65.31 86.96 Q 59.36 97.08 50.00 90.00 Q 40.64 97.08 34.69 86.96 Q 23.33 89.91 21.72 78.28 Q 10.09 76.67 13.04 65.31 Q 2.92 59.36 10.00 50.00 Q 2.92 40.64 13.04 34.69 Q 10.09 23.33 21.72 21.72 Q 23.33 10.09 34.69 13.04 Q 40.64 2.92 50.00 10.00 Q 59.36 2.92 65.31 13.04 Q 76.67 10.09 78.28 21.72 Q 89.91 23.33 86.96 34.69 Q 97.08 40.64 90.00 50.00 Z" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none select-none px-1">
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider uppercase leading-none opacity-95">
                {activeSlide.discountUpTo}
              </span>
              <span className="text-base sm:text-xl md:text-2xl font-black leading-tight tracking-tight my-0.5 text-white drop-shadow-xs">
                {activeSlide.discountValue}
              </span>
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider uppercase leading-none opacity-95">
                {activeSlide.discountOff}
              </span>
            </div>
          </div>

          {/* Left Typography & CTA Content */}
          <div className="relative z-10 max-w-xs sm:max-w-sm mt-2 sm:mt-4 md:mt-5">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[36px] font-black tracking-tight text-white mb-3 sm:mb-4 drop-shadow-xs font-poppins space-y-1 sm:space-y-1.5 leading-tight">
              <span className="block">{activeSlide.titleLine1}</span>
              <span className="block">{activeSlide.titleLine2}</span>
            </h1>

            <div className="space-y-1 sm:space-y-1.5 mb-9 sm:mb-11 md:mb-12">
              <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                {activeSlide.subtext}
              </p>
              <p className="text-[11px] sm:text-xs text-purple-200/80 font-normal leading-normal">
                {activeSlide.subtext2}
              </p>
            </div>

            <Link
              href={activeSlide.link}
              className="inline-flex items-center gap-3 bg-white text-[#2b0054] hover:bg-purple-50 hover:text-[#3c096c] px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-[14px] font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group/btn cursor-pointer"
            >
              <span className="tracking-tight">{activeSlide.cta}</span>
              <ArrowRight className="w-4 h-4 text-[#2b0054] group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Navigation Arrows on Hover (Desktop Bottom Right - completely clear of text) */}
          <div className="hidden sm:flex absolute bottom-4 right-5 sm:bottom-5 sm:right-6 z-20 items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-7 h-7 rounded-full bg-black/35 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center transition backdrop-blur-xs cursor-pointer shadow-xs"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-7 h-7 rounded-full bg-black/35 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center transition backdrop-blur-xs cursor-pointer shadow-xs"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Carousel Dots at Bottom Left (Matching Mockup with 5 Dots) */}
          <div className="relative z-10 flex items-center gap-2 mt-auto pt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-2.5 h-2.5 bg-white shadow-xs ring-2 ring-white/30'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: 2 Promo Cards (Download App Removed) */}
        <div className="lg:col-span-3 flex flex-col gap-3 justify-between h-[425px]">
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
