'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Category, Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Filter, SlidersHorizontal, ChevronRight, Loader2, Sparkles, Check } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const res = await api.getProducts({
          category: currentCategory || undefined,
          search: currentSearch || undefined,
          sort: currentSort,
          page: currentPage,
          min_price: minPrice ? parseFloat(minPrice) : undefined,
          max_price: maxPrice ? parseFloat(maxPrice) : undefined,
          per_page: 24,
        });

        if (res.success) {
          setProducts(res.data);
          setPagination(res.pagination);
        }
      } catch {
        // error handled
      } finally {
        setIsLoading(false);
      }
    }

    fetchCatalog();
  }, [currentCategory, currentSearch, currentSort, currentPage, minPrice, maxPrice]);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.set('page', '1'); // reset page on filter
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/shop');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <a href="/" className="hover:text-[#36135d]">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-gray-800">
              {currentCategory ? `Category: ${currentCategory}` : currentSearch ? `Search: "${currentSearch}"` : 'All Products'}
            </span>
          </div>
          <h1 className="text-xl font-black text-gray-900">
            {currentCategory
              ? categories.find((c) => c.slug === currentCategory)?.name || currentCategory
              : currentSearch
              ? `Results for "${currentSearch}"`
              : 'Thyaga Mall Catalog'}
          </h1>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing <strong>{products.length}</strong> of <strong>{pagination.total}</strong> products
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <SlidersHorizontal className="w-4 h-4 text-[#36135d]" />
                <span>Filters</span>
              </div>
              {(currentCategory || minPrice || maxPrice || currentSearch) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Categories
              </h4>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilters({ category: '' })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex justify-between items-center ${
                    !currentCategory ? 'bg-purple-50 text-[#36135d] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters({ category: cat.slug })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex justify-between items-center ${
                      currentCategory === cat.slug ? 'bg-purple-50 text-[#36135d] font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {cat.products_count || ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Price Range (Rs.)
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-hidden focus:border-[#36135d]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-hidden focus:border-[#36135d]"
                />
              </div>
              <button
                onClick={() => updateFilters({ min_price: minPrice, max_price: maxPrice })}
                className="w-full bg-gray-100 hover:bg-[#36135d] hover:text-white text-gray-700 text-xs font-bold py-1.5 rounded-md transition cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <main className="lg:col-span-9 space-y-4">
          {/* Sorting Bar */}
          <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-medium text-gray-600">
              Sorted by:{' '}
              <strong className="text-gray-900 capitalize">
                {currentSort.replace('_', ' ')}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-[#36135d] cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Customer Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-gray-400 border border-gray-200">
              <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
              <span className="text-xs font-medium">Filtering catalog items...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-3">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">No products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#36135d] text-white px-5 py-2 rounded-lg text-xs font-bold transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateFilters({ page: p.toString() })}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition cursor-pointer ${
                    p === pagination.current_page
                      ? 'bg-[#36135d] text-white shadow-sm'
                      : 'bg-white hover:bg-purple-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
