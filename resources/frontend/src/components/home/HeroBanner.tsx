'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
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
import TiltCard from '@/components/motion/TiltCard';

// three.js is heavy — load the 3D scene only in the browser, after first paint.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

const SLIDE_MS = 5500;
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();

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
      alt: 'Big Savings Brighter Living - Electronics, Home & Fashion',
      boxColor: '#7c3aed',
      accent: '#f472b6',
      gradient: 'from-[#1a0033] via-[#2e0a5c] to-[#5b1a8f]',
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
      alt: 'Smarter Devices for a Better You - Premium Audio & Smart Gadgets',
      boxColor: '#2563eb',
      accent: '#22d3ee',
      gradient: 'from-[#030a2e] via-[#0b1f5c] to-[#3b0a6b]',
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
      alt: 'Trending Styles For Everyone - Fashion, Footwear & Accessories',
      boxColor: '#e11d48',
      accent: '#fbbf24',
      gradient: 'from-[#2a0018] via-[#5c0a33] to-[#8f1a4f]',
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
      alt: 'Home & Kitchen Smart Essentials',
      boxColor: '#0d9488',
      accent: '#a3e635',
      gradient: 'from-[#001f1c] via-[#063d3a] to-[#2e0a5c]',
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
      alt: 'Exclusive Deals and Mega Savings',
      boxColor: '#f59e0b',
      accent: '#fb7185',
      gradient: 'from-[#240046] via-[#4a0a3d] to-[#8f2a0a]',
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];

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
        <motion.div
          ref={heroRef}
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-lg shadow-purple-900/20 flex flex-col justify-between bg-[#1a0033] text-white p-4 sm:p-7 md:p-8 min-h-[230px] h-[260px] sm:h-[340px] lg:h-[425px] group select-none isolate"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cross-fading gradient backdrop per slide */}
          <AnimatePresence initial={false}>
            <motion.div
              key={activeSlide.id}
              className={`absolute inset-0 -z-20 bg-linear-to-br ${activeSlide.gradient}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
            />
          </AnimatePresence>

          {/* Drifting aurora glows */}
          <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
            <div className="hero-aurora absolute -top-24 -left-16 w-72 h-72 rounded-full blur-3xl opacity-50" style={{ background: activeSlide.boxColor, transition: 'background 1s' }} />
            <div className="hero-aurora-2 absolute -bottom-28 right-0 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ background: activeSlide.accent, transition: 'background 1s' }} />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[18px_18px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          </div>

          {/* Interactive 3D gift scene */}
          <div className="absolute inset-y-0 right-0 w-[62%] sm:w-[60%] -z-0 pointer-events-none">
            <HeroScene color={activeSlide.boxColor} accent={activeSlide.accent} paused={!heroInView || !!reduce} />
          </div>

          {/* Scalloped Starburst Rosette Badge Top Right */}
          <AnimatePresence>
            <motion.div
              key={activeSlide.id}
              initial={{ scale: 0, rotate: -160, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute top-3 right-3 sm:top-5 sm:right-6 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 z-20 drop-shadow-[0_8px_18px_rgba(255,0,127,0.45)]"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#ff007f] badge-spin" aria-hidden="true">
                <path d="M 90.00 50.00 Q 97.08 59.36 86.96 65.31 Q 89.91 76.67 78.28 78.28 Q 76.67 89.91 65.31 86.96 Q 59.36 97.08 50.00 90.00 Q 40.64 97.08 34.69 86.96 Q 23.33 89.91 21.72 78.28 Q 10.09 76.67 13.04 65.31 Q 2.92 59.36 10.00 50.00 Q 2.92 40.64 13.04 34.69 Q 10.09 23.33 21.72 21.72 Q 23.33 10.09 34.69 13.04 Q 40.64 2.92 50.00 10.00 Q 59.36 2.92 65.31 13.04 Q 76.67 10.09 78.28 21.72 Q 89.91 23.33 86.96 34.69 Q 97.08 40.64 90.00 50.00 Z" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none select-none px-1">
                <span className="text-[7px] sm:text-[9px] font-black tracking-wider uppercase leading-none opacity-95">
                  {activeSlide.discountUpTo}
                </span>
                <span className="text-sm sm:text-xl md:text-2xl font-black leading-tight tracking-tight my-0.5 text-white drop-shadow-xs">
                  {activeSlide.discountValue}
                </span>
                <span className="text-[7px] sm:text-[9px] font-black tracking-wider uppercase leading-none opacity-95">
                  {activeSlide.discountOff}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Typography & CTA Content */}
          <div className="relative z-10 max-w-[200px] xs:max-w-[230px] sm:max-w-[280px] md:max-w-sm my-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{ show: { transition: { staggerChildren: 0.09 } }, exit: { transition: { staggerChildren: 0.04 } } }}
              >
                <h1 className="text-xl sm:text-2xl md:text-[32px] lg:text-[36px] font-black tracking-tight text-white mb-1.5 sm:mb-2.5 font-poppins leading-[1.15]">
                  {[activeSlide.titleLine1, activeSlide.titleLine2].map((line, i) => (
                    <span key={line} className="block overflow-hidden pb-0.5">
                      <motion.span
                        className={`block ${i === 1 ? 'bg-linear-to-r from-white via-pink-200 to-amber-200 bg-clip-text text-transparent' : ''}`}
                        variants={{
                          hidden: { y: '110%', rotateX: -60, opacity: 0 },
                          show: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
                          exit: { y: '-60%', opacity: 0, transition: { duration: 0.3 } },
                        }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                  className="text-xs sm:text-sm text-purple-100 font-medium leading-snug mb-3.5 sm:mb-5"
                >
                  {activeSlide.subtext}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
                    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
                  }}
                >
                  <Link
                    href={activeSlide.link}
                    className="btn-shine relative overflow-hidden inline-flex items-center gap-2 bg-white text-[#2b0054] hover:text-[#3c096c] px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_8px_24px_-6px_rgba(255,255,255,0.55)] hover:shadow-[0_10px_30px_-4px_rgba(255,255,255,0.75)] hover:-translate-y-0.5 active:scale-95 group/btn cursor-pointer w-fit"
                  >
                    <span className="tracking-tight">{activeSlide.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2b0054] group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows on Hover (Desktop Bottom Right) */}
          <div className="hidden sm:flex absolute bottom-4 right-5 sm:bottom-5 sm:right-6 z-20 items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition backdrop-blur-md cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition backdrop-blur-md cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress dots — the active one fills over the slide duration */}
          <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 md:left-8 z-10 flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-500 cursor-pointer ${
                  currentSlide === idx ? 'w-8 sm:w-10 bg-white/30' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {currentSlide === idx && (
                  <span
                    key={currentSlide}
                    className="hero-progress absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: isPaused ? 'paused' : 'running' }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

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
