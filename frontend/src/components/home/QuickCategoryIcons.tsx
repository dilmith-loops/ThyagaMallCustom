'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  Flame,
  Smartphone,
  Laptop,
  Armchair,
  Shirt,
  Sparkles,
  ShoppingBag,
  Gamepad2,
  Trophy,
  Car,
  Heart,
  BookOpen,
} from 'lucide-react';

const ICONS = [
  { label: 'Top Deals', slug: 'flash-deals', icon: Flame, bg: 'bg-orange-50', text: 'text-orange-500' },
  { label: 'Mobiles', slug: 'shop?category=electronics', icon: Smartphone, bg: 'bg-blue-50', text: 'text-blue-500' },
  { label: 'Laptops', slug: 'shop?category=electronics', icon: Laptop, bg: 'bg-cyan-50', text: 'text-cyan-500' },
  { label: 'Home & Living', slug: 'shop?category=home', icon: Armchair, bg: 'bg-teal-50', text: 'text-teal-600' },
  { label: 'Fashion', slug: 'shop?category=fashion', icon: Shirt, bg: 'bg-purple-50', text: 'text-purple-500' },
  { label: 'Beauty', slug: 'shop?category=beauty', icon: Sparkles, bg: 'bg-pink-50', text: 'text-pink-500' },
  { label: 'Groceries', slug: 'shop?category=food', icon: ShoppingBag, bg: 'bg-emerald-50', text: 'text-emerald-500' },
  { label: 'Toys & Kids', slug: 'shop?category=toys', icon: Gamepad2, bg: 'bg-amber-50', text: 'text-amber-500' },
  { label: 'Sports', slug: 'shop?category=electronics', icon: Trophy, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { label: 'Automotive', slug: 'shop?category=electronics', icon: Car, bg: 'bg-rose-50', text: 'text-rose-500' },
  { label: 'Health', slug: 'shop?category=beauty', icon: Heart, bg: 'bg-red-50', text: 'text-red-500' },
  { label: 'Books', slug: 'shop?category=toys', icon: BookOpen, bg: 'bg-blue-50', text: 'text-blue-600' },
];

export default function QuickCategoryIcons() {
  const reduce = useReducedMotion();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs py-4 px-2 my-4 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2 px-2">
        {ICONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="flex-1"
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: idx * 0.04 }}
            >
            <Link
              href={`/${item.slug}`}
              className="flex flex-col items-center gap-1.5 text-center group cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -6, rotate: [0, -12, 10, -6, 0], scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`relative w-11 h-11 rounded-full ${item.bg} flex items-center justify-center shadow-2xs group-hover:shadow-lg transition-shadow`}
              >
                {/* Pulsing ring on hover */}
                <span aria-hidden className={`absolute inset-0 rounded-full ${item.bg} opacity-0 group-hover:opacity-100 group-hover:animate-ping`} />
                <Icon className={`relative w-5 h-5 ${item.text}`} />
              </motion.div>
              <span className="text-[11px] font-semibold text-gray-700 group-hover:text-[#36135d] transition whitespace-nowrap">
                {item.label}
              </span>
            </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
