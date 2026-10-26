'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';

const BRANDS = [
  { name: 'SAMSUNG', fontClass: 'font-black tracking-widest text-blue-900 text-sm' },
  { name: ' Apple', fontClass: 'font-bold text-gray-900 text-base' },
  { name: 'hp', fontClass: 'font-black italic text-blue-600 text-lg tracking-tighter' },
  { name: 'mi', fontClass: 'font-black bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs tracking-wider' },
  { name: 'Lenovo', fontClass: 'font-black text-red-600 tracking-tight text-sm' },
  { name: 'NIKE', fontClass: 'font-black italic tracking-tighter text-gray-900 text-base' },
  { name: 'adidas', fontClass: 'font-bold tracking-tight text-gray-900 text-sm' },
  { name: 'Tefal', fontClass: 'font-black text-red-700 tracking-wider text-sm' },
  { name: 'PHILIPS', fontClass: 'font-black tracking-widest text-blue-800 text-xs' },
  { name: 'LEGO', fontClass: 'font-black bg-red-600 text-yellow-300 px-2 py-0.5 rounded text-xs tracking-wider' },
];

export default function TopBrands() {
  return (
    <section className="my-6 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#36135d]" />
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight font-poppins">
            Top Brands You Love
          </h2>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-[#6d28d9] hover:text-[#5b21b6] flex items-center gap-1 group"
        >
          <span>View All Brands</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Infinite brand marquee — pauses on hover */}
      <div className="marquee-wrap relative overflow-hidden -mx-1 py-1 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max gap-3">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <Link
              key={`${b.name}-${i}`}
              href={`/shop?search=${encodeURIComponent(b.name.replace(' ', ''))}`}
              aria-hidden={i >= BRANDS.length}
              tabIndex={i >= BRANDS.length ? -1 : undefined}
              className="h-14 w-32 sm:w-36 shrink-0 rounded-xl border border-gray-100 hover:border-purple-300 bg-gray-50/50 hover:bg-white flex items-center justify-center p-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50 hover:-translate-y-1 group"
            >
              <span className={`${b.fontClass} group-hover:scale-110 transition-transform duration-300 select-none`}>
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
