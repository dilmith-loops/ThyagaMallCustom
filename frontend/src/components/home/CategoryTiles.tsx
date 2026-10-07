'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Folder } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Electronics',
    subtitle: 'Latest Gadgets',
    slug: 'electronics',
    bg: 'bg-[#e0f2fe]',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Home & Kitchen',
    subtitle: 'Make it a Home',
    slug: 'home',
    bg: 'bg-[#ccfbf1]',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Fashion',
    subtitle: 'Trendy Styles',
    slug: 'fashion',
    bg: 'bg-[#fce7f3]',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Beauty & Care',
    subtitle: 'Feel Your Best',
    slug: 'beauty',
    bg: 'bg-[#ffedd5]',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Groceries',
    subtitle: 'Daily Essentials',
    slug: 'food',
    bg: 'bg-[#e0f2fe]',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Toys & Kids',
    subtitle: 'Play & Learn',
    slug: 'toys',
    bg: 'bg-[#fef3c7]',
    image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=400&q=80',
  },
];

export default function CategoryTiles() {
  return (
    <section className="my-6 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-[#36135d]" />
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight font-poppins">
            Shop by Category
          </h2>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-[#6d28d9] hover:text-[#5b21b6] flex items-center gap-1 group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 6 Category Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={`/shop?category=${cat.slug}`}
            className={`${cat.bg} rounded-2xl p-3.5 flex flex-col justify-between h-44 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-black/5`}
          >
            {/* Text details */}
            <div className="relative z-10">
              <h3 className="text-xs font-extrabold text-gray-900 leading-tight">
                {cat.title}
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">
                {cat.subtitle}
              </p>
            </div>

            {/* Product Image preview (Framed rounded squircle with white border and soft shadow) */}
            <div className="absolute bottom-2.5 right-2.5 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Circular white action arrow */}
            <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center text-gray-700 group-hover:bg-[#36135d] group-hover:text-white group-hover:translate-x-0.5 transition-all relative z-10 border border-white/80">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
