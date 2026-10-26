'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
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
import { Category, HeroSlide } from '@/types';
import { api } from '@/services/api';
import TiltCard from '@/components/motion/TiltCard';
import HeroStage, { DEFAULT_HERO_SLIDES } from '@/components/home/HeroStage';

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const reduce = useReducedMotion();

  // Slides are managed in Admin → Hero Slides; keep the built-in ones if the API is unavailable.
  useEffect(() => {
    let cancelled = false;
    api.getHeroSlides()
      .then((res) => {
        if (!cancelled && res.success && res.data.length > 0) setSlides(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Column: Vertical Category List (12 items) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-2xs p-2.5 flex flex-col justify-between h-[425px]"
        >
          <div className="space-y-0.5">
            {CATEGORY_ITEMS.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.035, duration: 0.45, ease: EASE }}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="relative flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#36135d] transition group overflow-hidden"
                  >
                    {/* Sliding highlight */}
                    <span className="absolute inset-0 bg-linear-to-r from-purple-100 to-purple-50/0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out rounded-lg" />
                    <div className="relative flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#36135d] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-300">{cat.name}</span>
                    </div>
                    <ChevronRight className="relative w-3 h-3 text-gray-300 group-hover:text-[#36135d] group-hover:translate-x-0.5 transition" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Center Column: 3D Hero Stage */}
        <HeroStage
          slides={slides}
          className="lg:col-span-6 min-h-[230px] h-[260px] sm:h-[340px] lg:h-[425px]"
        />

        {/* Right Column: 2 Promo Cards */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3 justify-between h-auto lg:h-[425px]"
        >
          {/* Card 1: New User? Get Rs. 1,000 OFF */}
          <TiltCard className="flex-1" max={8}>
            <div className="h-full bg-linear-to-br from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3] rounded-xl border border-pink-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xl hover:shadow-pink-300/40 transition-shadow group relative overflow-hidden">
              {/* Confetti dots */}
              <span aria-hidden className="confetti absolute top-6 right-10 w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span aria-hidden className="confetti confetti-2 absolute top-14 right-4 w-1 h-1 rounded-full bg-[#e11d48]" />
              <span aria-hidden className="confetti confetti-3 absolute bottom-16 right-16 w-1.5 h-1.5 rounded-sm bg-purple-500" />
              <div className="[transform:translateZ(30px)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#e11d48] uppercase tracking-wider block">
                    New User?
                  </span>
                  <span className="bg-[#e11d48] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse-subtle">
                    Welcome Deal
                  </span>
                </div>
                <h4 className="text-base font-black text-gray-900 font-poppins mt-1">Get Rs. 1,000 OFF</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Enjoy instant savings on your first online order with Thyaga voucher.
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 [transform:translateZ(40px)]">
                <Link
                  href="/shop"
                  className="btn-shine relative overflow-hidden inline-flex items-center gap-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-black px-4 py-2 rounded-lg transition shadow-md shadow-rose-500/30"
                >
                  <span>Claim Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {/* Floating 3D Wrapped Gift Box Icon */}
                <motion.div
                  className="relative w-14 h-14 shrink-0 flex items-center justify-center"
                  animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, -6, 4, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg viewBox="0 0 64 64" className="w-13 h-13 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <path d="M12 24 L32 34 L52 24 L32 14 Z" fill="#f43f5e" />
                    <path d="M12 24 L32 34 L32 54 L12 44 Z" fill="#e11d48" />
                    <path d="M32 34 L52 24 L52 44 L32 54 Z" fill="#be123c" />
                    <path d="M28 16 L36 20 L36 54 L28 50 Z" fill="#fef08a" opacity="0.9" />
                    <path d="M12 33 L52 13 L52 17 L12 37 Z" fill="#fef08a" opacity="0.8" />
                    <circle cx="32" cy="18" r="4" fill="#fbbf24" />
                    <path d="M32 18 C28 10 20 14 28 20 Z" fill="#f59e0b" />
                    <path d="M32 18 C36 10 44 14 36 20 Z" fill="#f59e0b" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Fast Islandwide Delivery */}
          <TiltCard max={6}>
            <div className="bg-linear-to-br from-[#f0f9ff] to-[#eff6ff] rounded-xl border border-blue-100 p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-lg hover:shadow-blue-200/50 transition-shadow overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 overflow-hidden [transform:translateZ(24px)]">
                <Truck className="w-6 h-6 truck-drive" />
              </div>
              <div className="[transform:translateZ(16px)]">
                <h4 className="text-xs font-black text-gray-900 leading-tight">Fast Islandwide Delivery</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Prompt 3 – 5 Working Days</p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </div>
  );
}
