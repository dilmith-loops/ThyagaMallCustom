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
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
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
            className={`${cat.bg} rounded-2xl p-3.5 flex flex-col justify-between h-44 relative overflow-hidden group hover:shadow-md transition-all duration-300`}
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

            {/* Product Image preview */}
            <div className="absolute -bottom-1 -right-1 w-24 h-24 sm:w-28 sm:h-28">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Circular white action arrow */}
            <div className="w-6 h-6 rounded-full bg-white shadow-2xs flex items-center justify-center text-gray-700 group-hover:bg-[#36135d] group-hover:text-white transition-colors relative z-10">
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
