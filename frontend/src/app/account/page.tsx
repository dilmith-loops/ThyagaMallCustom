'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import {
  User,
  Package,
  ShoppingBag,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Shield,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, refreshProfile } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (token) {
      refreshProfile();
      setOrdersLoading(true);
      api.customerGetOrders(token)
        .then((res) => {
          if (res.success && res.data) {
            setOrders(res.data);
          }
        })
        .catch((err) => {
          setOrdersError(err.message || 'Could not load your orders');
        })
        .finally(() => {
          setOrdersLoading(false);
        });
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#36135d] animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  const formatPrice = (price: number | string) => {
    return `Rs. ${Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="py-6 sm:py-10 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#36135d] via-[#4a127a] to-[#a7144c] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-inner">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[10px] font-bold tracking-wider uppercase mb-1 border border-white/15">
                <Shield className="w-3 h-3 text-emerald-400" />
                Verified Thyaga Customer
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                {user?.name}
              </h1>
              <p className="text-xs text-purple-200/90 mt-0.5">
                {user?.email} {user?.phone ? `• ${user?.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="bg-white text-[#36135d] hover:bg-gray-100 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
            >
              Continue Shopping
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#36135d]" />
              Account Details
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase font-semibold">Email</span>
                  <span className="font-medium text-gray-800 break-all">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase font-semibold">Phone</span>
                  <span className="font-medium text-gray-800">
                    {user?.phone || 'No phone number provided'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase font-semibold">Member Since</span>
                  <span className="font-medium text-gray-800">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'Recently'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase font-semibold">Account Status</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {user?.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Perks Card */}
          <div className="bg-linear-to-br from-purple-50 via-white to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-xs">
            <h3 className="text-xs font-bold text-[#36135d] uppercase tracking-wider mb-2">
              Thyaga Perks &amp; Rewards
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Enjoy free islandwide delivery on orders over Rs. 2,999 and exclusive redeemable vouchers across all catalog categories.
            </p>
            <Link
              href="/flash-deals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a7144c] hover:underline"
            >
              <span>Explore Flash Deals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#36135d]" />
                <h2 className="text-base font-bold text-gray-900">My Orders</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
              </span>
            </div>

            {ordersLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#36135d]" />
                <p className="text-xs">Loading order history...</p>
              </div>
            ) : ordersError ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{ordersError}</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">No Orders Placed Yet</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  When you make a purchase on Thyaga Mall, your order history and live shipping updates will appear right here.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 inline-block bg-[#36135d] hover:bg-[#a7144c] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">
                            {order.order_number}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs font-extrabold text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          {order.payment_method?.toUpperCase()} • {order.payment_status}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-700 space-y-1.5">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <span className="truncate pr-4 text-gray-800">
                              {item.quantity}x {item.product_name}
                            </span>
                            <span className="font-semibold text-gray-900 shrink-0">
                              {formatPrice(item.total_price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
