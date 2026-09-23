'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  Zap,
  ShoppingBag,
  Users,
  Activity,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { Admin } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [adminUser, setAdminUser] = useState<Admin | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isLoginPage = pathname === '/thyaga-portal-admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    const token = localStorage.getItem('thyaga_admin_token');
    const userStr = localStorage.getItem('thyaga_admin_user');

    if (!token) {
      router.push('/thyaga-portal-admin/login');
      return;
    }

    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch {
        // ignore
      }
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('thyaga_admin_token');
    localStorage.removeItem('thyaga_admin_user');
    setShowLogoutModal(false);
    router.push('/thyaga-portal-admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center w-full">{children}</div>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/thyaga-portal-admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/thyaga-portal-admin/products', icon: Package },
    { label: 'Flash Sales', href: '/thyaga-portal-admin/flash-sales', icon: Zap, badge: 'HOT' },
    { label: 'Orders', href: '/thyaga-portal-admin/orders', icon: ShoppingBag },
    { label: 'Users', href: '/thyaga-portal-admin/users', icon: Users },
    { label: 'Activity Logs', href: '/thyaga-portal-admin/activity-logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/thyaga-portal-admin/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="thyāga mall"
              width={100}
              height={51}
              className="h-7 w-auto object-contain"
              priority
            />
            <span className="font-extrabold text-[11px] text-[#a7144c] tracking-wider uppercase bg-pink-50 border border-pink-100 px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#36135d] font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Admin User Chip */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
            <ShieldCheck className="w-4 h-4 text-[#36135d]" />
            <span className="hidden sm:inline">{adminUser?.name || 'Administrator'}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Admin Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 pt-16 md:pt-4 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Management
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#36135d] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-[#36135d]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Admin Page Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">Confirm Sign Out</h3>
                <p className="text-xs text-gray-500">End your administrative session</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to log out of Thyaga Mall Admin Portal? You will need to sign in again to access store management.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
