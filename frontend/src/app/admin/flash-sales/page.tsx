'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Zap,
  Clock,
  Plus,
  Trash2,
  Check,
  Flame,
  AlertCircle,
  Loader2,
  Power,
} from 'lucide-react';
import { api } from '@/services/api';
import { FlashSale, Product } from '@/types';

export default function AdminFlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Add Item to Flash Sale Form State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [flashPrice, setFlashPrice] = useState('');
  const [quantityLimit, setQuantityLimit] = useState('20');
  const [isAdding, setIsAdding] = useState(false);

  const fetchFlashSales = async () => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    try {
      const res = await api.getAdminFlashSales(token);
      if (res.success) {
        setFlashSales(res.data);
      }
    } catch {
      // error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSales();
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (token) {
      api.getAdminProducts(token, { per_page: 50 }).then((res) => {
        if (res.success) setAllProducts(res.data);
      });
    }
  }, []);

  const activeSale = flashSales[0];

  const handleToggleActive = async () => {
    if (!activeSale) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    try {
      await api.updateAdminFlashSale(token, activeSale.id, {
        is_active: !activeSale.is_active,
      });
      setFeedback(`Flash Sale is now ${!activeSale.is_active ? 'ACTIVE' : 'INACTIVE'}`);
      fetchFlashSales();
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Failed to update campaign state');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSale || !selectedProduct || !flashPrice) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsAdding(true);
    try {
      await api.addAdminFlashSaleItem(token, activeSale.id, {
        product_id: parseInt(selectedProduct, 10),
        flash_price: parseFloat(flashPrice),
        quantity_limit: parseInt(quantityLimit, 10),
      });

      setFeedback('Product added to flash sale!');
      setSelectedProduct('');
      setFlashPrice('');
      fetchFlashSales();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error adding flash item');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!activeSale) return;
    if (!confirm('Remove this product from the flash sale?')) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    try {
      await api.removeAdminFlashSaleItem(token, activeSale.id, itemId);
      setFeedback('Item removed from flash sale.');
      fetchFlashSales();
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#dc2626] mb-2" />
        <span className="text-xs font-semibold">Loading flash sale events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Campaign Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 text-red-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <Flame className="w-3 h-3 fill-current" />
              <span>Flash Sales Control</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeSale?.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {activeSale?.is_active ? '● LIVE ON STORE' : '○ PAUSED'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            {activeSale?.title || '⚡ Flash Deals Campaign'}
          </h1>
          <p className="text-xs text-gray-500">
            Manage real-time countdown deals, allocated flash stock, and custom discount rates
          </p>
        </div>

        {activeSale && (
          <button
            onClick={handleToggleActive}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-xs ${
              activeSale.is_active
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{activeSale.is_active ? 'Pause Campaign' : 'Publish Flash Sale'}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Campaign Details & Schedule */}
      {activeSale && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Start Timestamp
            </span>
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{new Date(activeSale.start_time).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              End Timestamp (Countdown Target)
            </span>
            <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{new Date(activeSale.end_time).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Active Flash Products
            </span>
            <div className="text-base font-black text-[#36135d]">
              {activeSale.items?.length || 0} Deals Scheduled
            </div>
          </div>
        </div>
      )}

      {/* Add New Item Form */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#36135d]" />
          <span>Add Product to Active Flash Sale</span>
        </h3>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Select Product *</label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                const p = allProducts.find((item) => item.id.toString() === e.target.value);
                if (p) {
                  // Pre-fill a 30% discount suggestion
                  const reg = Number(p.regular_price);
                  setFlashPrice(Math.round(reg * 0.7).toString());
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
            >
              <option value="">Choose item from catalog...</option>
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Reg: Rs. {Number(p.regular_price).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Flash Deal Price (Rs.) *</label>
            <input
              type="number"
              required
              placeholder="e.g. 1500"
              value={flashPrice}
              onChange={(e) => setFlashPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Quantity Limit *</label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                value={quantityLimit}
                onChange={(e) => setQuantityLimit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
              />
              <button
                type="submit"
                disabled={isAdding || !selectedProduct}
                className="bg-[#dc2626] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isAdding ? 'Adding...' : 'Add Deal'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Items List Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Flash Sale Products List</h3>
          <span className="text-xs text-gray-500">{activeSale?.items?.length || 0} items</span>
        </div>

        <div className="overflow-x-auto">
          {!activeSale || !activeSale.items || activeSale.items.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              No items currently assigned to this flash sale.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3 w-16">Item</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Regular Price</th>
                  <th className="p-3">Flash Price</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Allocation & Claim</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeSale.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  const regPrice = Number(product.regular_price);
                  const flPrice = Number(item.flash_price);
                  const discount = item.discount_percentage || Math.round(((regPrice - flPrice) / regPrice) * 100);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3">
                        <div className="relative w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={product.primary_image || 'https://placehold.co/100x100?text=Flash'}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-900 max-w-xs">
                        <div className="line-clamp-1">{product.name}</div>
                        <span className="text-[10px] text-gray-400 font-normal">SKU: {product.sku}</span>
                      </td>
                      <td className="p-3 text-gray-500 line-through">
                        Rs. {regPrice.toLocaleString()}
                      </td>
                      <td className="p-3 font-bold text-red-600">
                        Rs. {flPrice.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="bg-red-100 text-red-700 font-black px-2 py-0.5 rounded text-[10px]">
                          -{discount}%
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] font-semibold text-gray-700">
                          {item.quantity_sold} sold / {item.quantity_limit} limit
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-red-600 h-1.5 rounded-full"
                            style={{ width: `${item.percentage_sold || 50}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Remove item from flash sale"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
