'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Home, Laptop, Shirt } from 'lucide-react';

export default function FeaturedBanners() {
  return (
    <section className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Banner 1: Tech Essentials */}
        <div className="bg-linear-to-br from-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded text-indigo-200">
              Tech Essentials
            </span>
            <h3 className="text-xl font-bold mt-2 mb-1">Smart Gadgets & Accessories</h3>
            <p className="text-xs text-indigo-200 line-clamp-2 mb-4">
              Wireless earbuds, smartwatches, phone stands & daily digital necessities.
            </p>
          </div>
          <Link
            href="/shop?category=electronics"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition group-hover:gap-3"
          >
            <span>Shop Electronics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Laptop className="absolute -bottom-4 -right-4 w-28 h-28 text-white/10 group-hover:scale-110 transition-transform" />
        </div>

        {/* Banner 2: Must-Haves For Home */}
        <div className="bg-linear-to-br from-[#36135d] to-[#8c0f3f] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded text-pink-200">
              Everyday Comfort
            </span>
            <h3 className="text-xl font-bold mt-2 mb-1">Must-Haves For Home</h3>
            <p className="text-xs text-pink-200 line-clamp-2 mb-4">
              Kitchen roll dispensers, water pumps, drum graters & stylish storage sets.
            </p>
          </div>
          <Link
            href="/shop?category=home"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition group-hover:gap-3"
          >
            <span>Explore Kitchen & Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Home className="absolute -bottom-4 -right-4 w-28 h-28 text-white/10 group-hover:scale-110 transition-transform" />
        </div>

        {/* Banner 3: Fashion For Less */}
        <div className="bg-linear-to-br from-amber-700 to-rose-800 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded text-amber-200">
              Budget Finds
            </span>
            <h3 className="text-xl font-bold mt-2 mb-1">Fashion & Living for Less</h3>
            <p className="text-xs text-amber-100 line-clamp-2 mb-4">
              Personal care, watch boxes, facial hair trimmers & lifestyle accessories under Rs. 5,000.
            </p>
          </div>
          <Link
            href="/shop?category=fashion"
            className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-amber-200 transition group-hover:gap-3"
          >
            <span>View Fashion Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Shirt className="absolute -bottom-4 -right-4 w-28 h-28 text-white/10 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </section>
  );
}
