'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { Home, Laptop, Sparkles, Shirt, Utensils, Gamepad2, Coffee, Layers } from 'lucide-react';

interface CategoryShowcaseProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="w-6 h-6 text-[#36135d]" />,
  electronics: <Laptop className="w-6 h-6 text-[#2563eb]" />,
  beauty: <Sparkles className="w-6 h-6 text-[#a7144c]" />,
  fashion: <Shirt className="w-6 h-6 text-[#ea580c]" />,
  food: <Utensils className="w-6 h-6 text-[#16a34a]" />,
  toys: <Gamepad2 className="w-6 h-6 text-[#9333ea]" />,
  kitchen: <Coffee className="w-6 h-6 text-[#d97706]" />,
};

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Browse Categories</h2>
          <p className="text-xs text-gray-500">Explore curated collections directly from Thyaga Mall</p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-[#36135d] hover:text-[#a7144c] hover:underline"
        >
          View All &gt;
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.slice(0, 8).map((cat) => {
          const icon = CATEGORY_ICONS[cat.slug] || <Layers className="w-6 h-6 text-purple-600" />;

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200/80 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors mb-2.5">
                {icon}
              </div>
              <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#36135d] transition line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {cat.products_count ? `${cat.products_count} items` : 'Explore'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
