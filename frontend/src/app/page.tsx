'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Category, FlashSale } from '@/types';
import HeroBanner from '@/components/home/HeroBanner';
import QuickCategoryIcons from '@/components/home/QuickCategoryIcons';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import TrendingSection from '@/components/home/TrendingSection';
import CategoryTiles from '@/components/home/CategoryTiles';
import DualPromoBanners from '@/components/home/DualPromoBanners';
import TopBrands from '@/components/home/TopBrands';
import BestSellersSection from '@/components/home/BestSellersSection';
import AppDownloadAndTrust from '@/components/home/AppDownloadAndTrust';
import NewsletterBar from '@/components/home/NewsletterBar';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, flashRes] = await Promise.allSettled([
          api.getCategories(),
          api.getActiveFlashSale(),
        ]);

        if (catRes.status === 'fulfilled' && catRes.value.success) {
          setCategories(catRes.value.data);
        }
        if (flashRes.status === 'fulfilled' && flashRes.value.success) {
          setFlashSale(flashRes.value.data);
        }
      } catch {
        // Handled gracefully with fallback mock data
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Hero Promotional Area with Category Sidebar & App/Promo Widgets */}
      <HeroBanner categories={categories} />

      {/* 2. 12 Quick Category Circular Badges */}
      <QuickCategoryIcons />

      {/* 3. ⚡ Flash Deals Section with Real-Time Countdown & Sold Bars */}
      <FlashSaleSection flashSale={flashSale} />

      {/* 4. Trending Right Now 🔥 Product Carousel/Grid */}
      <TrendingSection />

      {/* 5. Shop by Category Pastel Showcase Tiles */}
      <CategoryTiles />

      {/* 6. Dual Split Promo Banners (Smarter Tech & Fashion New Collection) */}
      <DualPromoBanners />

      {/* 7. Top Brands You Love Badges Bar */}
      <TopBrands />

      {/* 8. Best Sellers with Filter Tabs (All, Electronics, Home, Fashion, Beauty) */}
      <BestSellersSection />

      {/* 9. Value Badges & Mobile App Download Showcase */}
      <AppDownloadAndTrust />

      {/* 10. Newsletter Subscription Bar with Social Media Links */}
      <NewsletterBar />
    </div>
  );
}
