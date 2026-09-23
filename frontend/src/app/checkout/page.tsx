'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';
import { ShieldCheck, Truck, CreditCard, Ticket, CheckCircle2, ChevronRight, Lock, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    shippingFee,
    total,
    appliedVoucher,
    voucherDiscount,
    applyVoucherCode,
    removeVoucher,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: 'Colombo',
    shipping_postal_code: '',
    payment_method: 'cod',
    notes: '',
  });

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="bg-[#36135d] hover:bg-[#a7144c] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleVoucherApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;
    const res = await applyVoucherCode(voucherCodeInput.trim());
    if (res.success) {
      setVoucherMessage({ text: res.message, isError: false });
      setVoucherCodeInput('');
    } else {
      setVoucherMessage({ text: res.message, isError: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city,
        shipping_postal_code: formData.shipping_postal_code || undefined,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        voucher_code: appliedVoucher ? appliedVoucher.code : undefined,
        payment_method: formData.payment_method,
        notes: formData.notes || undefined,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        clearCart();
        router.push(`/order-success/${res.data.order_number}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#36135d]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/cart" className="hover:text-[#36135d]">Cart</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-gray-800">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer & Delivery Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#36135d] text-white flex items-center justify-center text-xs">1</span>
                <span>Delivery & Contact Details</span>
              </h2>
              <span className="text-[11px] text-gray-400">All fields required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Perera"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 077 123 4567"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. kasun@example.com (for order updates)"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                placeholder="House / Apartment number, Street name"
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colombo, Kandy, Galle"
                  value={formData.shipping_city}
                  onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 00500"
                  value={formData.shipping_postal_code}
                  onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Notes / Instructions</label>
              <textarea
                rows={2}
                placeholder="e.g. Call before delivery, drop at gate"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
              />
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#36135d] text-white flex items-center justify-center text-xs">2</span>
                <span>Select Payment Method</span>
              </h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                  formData.payment_method === 'cod' ? 'border-[#36135d] bg-purple-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={formData.payment_method === 'cod'}
                  onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                  className="mt-0.5 text-[#36135d] focus:ring-[#36135d]"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</div>
                  <p className="text-[11px] text-gray-500">Pay cash upon safe delivery to your doorstep.</p>
                </div>
              </label>

              {/* Option 2: Card Payment */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                  formData.payment_method === 'card' ? 'border-[#36135d] bg-purple-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={formData.payment_method === 'card'}
                  onChange={() => setFormData({ ...formData, payment_method: 'card' })}
                  className="mt-0.5 text-[#36135d] focus:ring-[#36135d]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Credit / Debit Card (Visa, Mastercard)</span>
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-[11px] text-gray-500">Instant and encrypted online card transaction.</p>
                </div>
              </label>

              {/* Option 3: Thyaga Gift Voucher */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                  formData.payment_method === 'voucher' ? 'border-[#36135d] bg-purple-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="voucher"
                  checked={formData.payment_method === 'voucher'}
                  onChange={() => setFormData({ ...formData, payment_method: 'voucher' })}
                  className="mt-0.5 text-[#36135d] focus:ring-[#36135d]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Thyaga Gift Voucher Only</span>
                    <Ticket className="w-4 h-4 text-[#a7144c]" />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Use when your voucher fully covers the order amount.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#a7144c] hover:bg-[#8c0f3f] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order (Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Summary */}
        <aside className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Order Summary ({items.length} items)
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={item.product.primary_image || 'https://placehold.co/100x100/f3f4f6/36135d?text=Item'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{item.product.name}</h4>
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Voucher Redemption Form */}
            <div className="pt-4 border-t border-gray-100 mb-4">
              {appliedVoucher ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{appliedVoucher.code} (-Rs. {voucherDiscount.toLocaleString()})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeVoucher}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Thyaga Voucher Code"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg uppercase focus:outline-hidden focus:border-[#36135d]"
                    />
                    <button
                      type="button"
                      onClick={handleVoucherApply}
                      className="bg-[#36135d] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition hover:bg-[#a7144c]"
                    >
                      Apply
                    </button>
                  </div>
                  {voucherMessage && (
                    <p className={`text-[11px] font-medium ${voucherMessage.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                      {voucherMessage.text}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-gray-100 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Thyaga Voucher Discount</span>
                  <span>- Rs. {voucherDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase">FREE DELIVERY</span>
                ) : (
                  <span className="font-semibold text-gray-900">
                    Rs. {shippingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-[#36135d]">
                  Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure 256-bit encrypted checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#36135d]" />
              <span>Official islandwide delivery via tracked courier</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
