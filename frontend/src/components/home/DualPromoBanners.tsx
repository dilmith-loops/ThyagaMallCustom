'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function DualPromoBanners() {
  return (
    <section className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Banner 1: Upgrade Your Tech */}
      <div className="bg-linear-to-r from-[#581c87] via-[#6d28d9] to-[#7c3aed] text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[190px]">
        {/* Discount Circle */}
        <div className="absolute top-4 right-28 sm:right-36 bg-[#4c1d95] border border-purple-400/40 w-14 h-14 rounded-full flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[8px] font-bold text-purple-200">UP TO</span>
          <span className="text-xs font-black text-white leading-none">50%</span>
          <span className="text-[8px] font-bold text-purple-200">OFF</span>
        </div>

        <div className="relative z-10 max-w-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block mb-1">
            Upgrade Your Tech
          </span>
          <h3 className="text-lg sm:text-xl font-black leading-tight tracking-tight mb-4 font-poppins">
            Smarter Devices<br />for a Better You
          </h3>

          <Link
            href="/shop?category=electronics"
            className="inline-flex items-center gap-1.5 bg-white text-gray-900 hover:bg-purple-100 px-4 py-2 rounded-full font-bold text-xs transition shadow-xs"
          >
            <span>Shop Electronics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Laptop & Gadget Mockup on Right */}
        <div className="absolute -bottom-2 -right-4 w-44 sm:w-56 h-36 sm:h-44 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
            alt="Electronics"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Banner 2: Style Your Everyday */}
      <div className="bg-linear-to-r from-[#ffe4e6] via-[#fecdd3] to-[#fed7aa] text-gray-900 rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[190px]">
        {/* Tag */}
        <div className="absolute top-4 right-28 sm:right-36 bg-[#e11d48] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
          NEW COLLECTION
        </div>

        <div className="relative z-10 max-w-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48] block mb-1">
            Style Your Everyday
          </span>
          <h3 className="text-lg sm:text-xl font-black leading-tight tracking-tight mb-4 font-poppins text-gray-900">
            Fashion for Every You
          </h3>

          <Link
            href="/shop?category=fashion"
            className="inline-flex items-center gap-1.5 bg-white text-gray-900 hover:bg-rose-50 px-4 py-2 rounded-full font-bold text-xs transition shadow-xs"
          >
            <span>Shop Fashion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Fashion Model Mockup on Right */}
        <div className="absolute -bottom-1 -right-2 w-40 sm:w-48 h-40 sm:h-48 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80"
            alt="Fashion"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
