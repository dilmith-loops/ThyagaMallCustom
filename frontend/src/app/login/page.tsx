'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#36135d] via-[#a7144c] to-[#e11d48]" />

          {/* Header */}
          <div className="text-center mb-6 pt-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="relative w-9 h-9">
                <Image
                  src="/logo.png"
                  alt="Thyaga Mall"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-black tracking-tight text-[#36135d]">
                thyaga<span className="text-[#a7144c]">mall</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Customer Sign In
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Sign in to manage your orders, wishlist, and vouchers
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:bg-white focus:border-[#36135d] focus:ring-2 focus:ring-[#36135d]/10 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:bg-white focus:border-[#36135d] focus:ring-2 focus:ring-[#36135d]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#36135d] focus:ring-[#36135d] w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <span className="text-gray-400 text-[11px]">Protected by SSL</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#36135d] hover:bg-[#a7144c] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Pill Bar */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2.5">
              Quick Demo Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('nimal.perera@gmail.com')}
                className="text-left px-2.5 py-1.5 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-gray-200/80 rounded-lg transition text-[11px] group cursor-pointer"
              >
                <div className="font-bold text-gray-700 group-hover:text-[#36135d] truncate">Nimal Perera</div>
                <div className="text-[10px] text-gray-400 truncate">Customer Demo</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('sanduni.j@yahoo.com')}
                className="text-left px-2.5 py-1.5 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-gray-200/80 rounded-lg transition text-[11px] group cursor-pointer"
              >
                <div className="font-bold text-gray-700 group-hover:text-[#36135d] truncate">Sanduni J.</div>
                <div className="text-[10px] text-gray-400 truncate">Customer Demo</div>
              </button>
            </div>
          </div>

          {/* Register Prompt */}
          <div className="mt-6 text-center text-xs text-gray-500">
            Don&apos;t have an account yet?{' '}
            <Link
              href={redirectUrl !== '/account' ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'}
              className="font-bold text-[#36135d] hover:text-[#a7144c] underline transition"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-gray-400 text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Customer Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#36135d] animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
