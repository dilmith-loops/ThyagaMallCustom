'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Zap,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { api } from '@/services/api';
import { Order, Category } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    total_sales: number;
    total_orders: number;
    pending_orders: number;
    total_products: number;
    low_stock_products: number;
    active_flash_sales: number;
    recent_orders: Order[];
    top_categories: Category[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    api.getAdminStats(token).then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
        <span className="text-xs font-semibold">Loading store analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Store Performance Overview</h1>
          <p className="text-xs text-gray-500">Live analytics, order tracking, and inventory status for Thyaga Mall</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/thyaga-portal-admin/flash-sales"
            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-red-200 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Manage Flash Sales</span>
          </Link>
          <Link
            href="/thyaga-portal-admin/products"
            className="bg-[#36135d] hover:bg-[#a7144c] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Sales</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-gray-900">
            Rs. {(stats?.total_sales || 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Live store revenue</span>
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-gray-900">{stats?.total_orders || 0}</div>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Recorded checkouts</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Pending Orders</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-amber-600">{stats?.pending_orders || 0}</div>
          <span className="text-[10px] text-amber-600 font-medium block mt-1">Requires dispatch</span>
        </div>

        {/* Active Flash Deals */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Flash Events</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-red-600">{stats?.active_flash_sales || 1} Active</div>
          <span className="text-[10px] text-red-500 font-medium block mt-1">Live countdown active</span>
        </div>

        {/* Total Catalog Items */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Catalog</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-[#36135d]">{stats?.total_products || 406} Items</div>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Imported & synced</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Low Stock</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-rose-600">{stats?.low_stock_products || 0}</div>
          <span className="text-[10px] text-rose-500 font-medium block mt-1">&le; 5 units left</span>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Customer Orders</h3>
              <p className="text-[11px] text-gray-400">Latest orders placed through Thyaga Mall</p>
            </div>
            <Link
              href="/thyaga-portal-admin/orders"
              className="text-xs font-bold text-[#36135d] hover:text-[#a7144c] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {!stats?.recent_orders || stats.recent_orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No orders registered yet. Test checkouts from the storefront will populate here!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recent_orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 font-bold text-[#36135d]">
                        <Link href={`/thyaga-portal-admin/orders`}>{ord.order_number}</Link>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{ord.customer_name}</div>
                        <div className="text-[10px] text-gray-400">{ord.customer_phone}</div>
                      </td>
                      <td className="p-3 font-bold text-gray-900">
                        Rs. {Number(ord.total).toLocaleString()}
                      </td>
                      <td className="p-3 uppercase text-[11px] font-semibold text-gray-600">
                        {ord.payment_method}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          ord.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          ord.order_status === 'processing' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Top Categories */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Top Catalog Categories</h3>
          <p className="text-[11px] text-gray-400 mb-4">Largest product inventories by department</p>

          <div className="space-y-3">
            {stats?.top_categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{cat.name}</h4>
                  <span className="text-[10px] text-gray-400">/{cat.slug}</span>
                </div>
                <span className="bg-purple-100 text-[#36135d] font-bold text-xs px-2.5 py-1 rounded-lg">
                  {cat.products_count} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
