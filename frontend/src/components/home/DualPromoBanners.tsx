'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function DualPromoBanners() {
  return (
    <section className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Banner 1: Upgrade Your Tech */}
      <div className="bg-linear-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[195px] border border-purple-500/20 group">
        {/* Discount Circle (Top-Right, z-20, Never Covered) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-linear-to-br from-amber-400 to-amber-500 text-gray-950 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center text-center shadow-lg font-black border-2 border-white/60 group-hover:scale-105 transition-transform">
          <span className="text-[7px] sm:text-[7.5px] font-extrabold uppercase tracking-wider leading-none text-gray-800">UP TO</span>
          <span className="text-xs sm:text-sm font-black leading-tight text-gray-950">50%</span>
          <span className="text-[7px] sm:text-[7.5px] font-extrabold uppercase tracking-wider leading-none text-gray-800">OFF</span>
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-[60%] sm:max-w-xs flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block mb-1">
              Upgrade Your Tech
            </span>
            <h3 className="text-lg sm:text-xl font-black leading-tight tracking-tight mb-4 font-poppins">
              Smarter Devices<br />for a Better You
            </h3>
          </div>

          <div>
            <Link
              href="/shop?category=electronics"
              className="inline-flex items-center gap-1.5 bg-white text-gray-900 hover:bg-purple-50 px-4 py-2 rounded-full font-bold text-xs transition shadow-xs group-hover:shadow"
            >
              <span>Shop Electronics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Laptop Image: Full height right side with seamless soft-gradient blend */}
        <div
          className="absolute inset-y-0 right-0 w-[48%] sm:w-[46%] pointer-events-none overflow-hidden rounded-r-2xl"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
            alt="Electronics"
            fill
            className="object-cover object-left-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#6d28d9]/70 via-transparent to-transparent" />
        </div>
      </div>

      {/* Banner 2: Style Your Everyday */}
      <div className="bg-linear-to-r from-[#ffe4e6] via-[#fecdd3] to-[#fed7aa] text-gray-900 rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[195px] border border-rose-200/60 group">
        {/* New Collection Tag (Top-Right, z-20, Never Colliding) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-[#e11d48] text-white text-[9px] sm:text-[9.5px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md group-hover:scale-105 transition-transform">
          NEW COLLECTION
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-[60%] sm:max-w-xs flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48] block mb-1">
              Style Your Everyday
            </span>
            <h3 className="text-lg sm:text-xl font-black leading-tight tracking-tight mb-4 font-poppins text-gray-900">
              Fashion for<br />Every You
            </h3>
          </div>

          <div>
            <Link
              href="/shop?category=fashion"
              className="inline-flex items-center gap-1.5 bg-white text-gray-900 hover:bg-rose-50 px-4 py-2 rounded-full font-bold text-xs transition shadow-xs group-hover:shadow border border-rose-200/50"
            >
              <span>Shop Fashion</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Fashion Image: Full height right side with seamless soft-gradient blend */}
        <div
          className="absolute inset-y-0 right-0 w-[48%] sm:w-[46%] pointer-events-none overflow-hidden rounded-r-2xl"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
            alt="Fashion"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#fecdd3]/70 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
