'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Category } from '@/types';
import { useFlashSale } from '@/context/FlashSaleContext';
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
import { Reveal } from '@/components/motion/Reveal';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { flashSale, isActive } = useFlashSale();

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch {
        // Handled gracefully
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Hero Promotional Area with Category Sidebar & App/Promo Widgets */}
      <HeroBanner categories={categories} />

      {/* 2. 12 Quick Category Circular Badges */}
      <Reveal>
        <QuickCategoryIcons />
      </Reveal>

      {/* 3. ⚡ Flash Deals Section with Real-Time Countdown & Sold Bars (Strictly hidden when turned off in Admin) */}
      {isActive && flashSale && (
        <Reveal>
          <FlashSaleSection flashSale={flashSale} />
        </Reveal>
      )}

      {/* 4. Trending Right Now 🔥 Product Carousel/Grid */}
      <Reveal>
        <TrendingSection />
      </Reveal>

      {/* 5. Shop by Category Pastel Showcase Tiles */}
      <Reveal>
        <CategoryTiles />
      </Reveal>

      {/* 6. Dual Split Promo Banners (Smarter Tech & Fashion New Collection) */}
      <DualPromoBanners />

      {/* 7. Top Brands You Love Badges Bar */}
      <Reveal>
        <TopBrands />
      </Reveal>

      {/* 8. Best Sellers with Filter Tabs (All, Electronics, Home, Fashion, Beauty) */}
      <Reveal>
        <BestSellersSection />
      </Reveal>

      {/* 9. Value Badges & Mobile App Download Showcase */}
      <Reveal>
        <AppDownloadAndTrust />
      </Reveal>

      {/* 10. Newsletter Subscription Bar with Social Media Links */}
      <Reveal>
        <NewsletterBar />
      </Reveal>
    </div>
  );
}
