'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function TrendingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTrending() {
      try {
        const res = await api.getProducts({ sort: 'popular', per_page: 6 });
        if (isMounted && res.success && res.data) {
          setProducts(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load trending products:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTrending();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="my-6 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">💥</span>
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight font-poppins flex items-center gap-1.5">
            <span>Trending Right Now</span>
            <span>🔥</span>
          </h2>
        </div>

        <Link
          href="/shop?sort=popular"
          className="text-xs font-bold text-[#6d28d9] hover:text-[#5b21b6] flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid of 6 items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200/80 p-3 flex flex-col justify-between animate-pulse aspect-[3/4]"
              >
                <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                  <div className="h-3 bg-gray-100 rounded w-3/5" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
                </div>
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
