'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/services/api';
import { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    sku: '',
    regular_price: '',
    sale_price: '',
    stock_quantity: '50',
    short_description: '',
    description: '',
    image_url: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchProducts = async (page = 1) => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await api.getAdminProducts(token, {
        page,
        search: search || undefined,
        category_id: selectedCategory,
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
  };

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
    fetchProducts(1);
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id.toString() || '',
      sku: '',
      regular_price: '',
      sale_price: '',
      stock_quantity: '50',
      short_description: '',
      description: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category_id: p.category_id ? p.category_id.toString() : '',
      sku: p.sku || '',
      regular_price: p.regular_price.toString(),
      sale_price: p.sale_price ? p.sale_price.toString() : '',
      stock_quantity: p.stock_quantity.toString(),
      short_description: p.short_description || '',
      description: p.description || '',
      image_url: p.primary_image || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setModalLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        sku: formData.sku || undefined,
        regular_price: parseFloat(formData.regular_price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: parseInt(formData.stock_quantity, 10),
        short_description: formData.short_description || undefined,
        description: formData.description || undefined,
        image_url: formData.image_url || undefined,
      };

      if (editingProduct) {
        await api.updateAdminProduct(token, editingProduct.id, payload);
        setFeedback('Product updated successfully!');
      } else {
        await api.createAdminProduct(token, payload);
        setFeedback('Product added to catalog successfully!');
      }

      setIsModalOpen(false);
      fetchProducts(pagination.current_page);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    try {
      await api.deleteAdminProduct(token, id);
      setFeedback('Product deleted.');
      fetchProducts(pagination.current_page);
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Product Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Product Management</h1>
          <p className="text-xs text-gray-500">Manage 400+ real Thyaga Mall catalog items, prices & inventory</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#36135d] hover:bg-[#a7144c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
          />
          <button
            type="submit"
            className="bg-gray-100 hover:bg-[#36135d] hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Category:</span>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
              <span className="text-xs font-semibold">Loading catalog items...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400">
              No products found matching your search.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3 w-16">Image</th>
                  <th className="p-3">Product Name & SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Regular Price</th>
                  <th className="p-3">Sale Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3">
                      <div className="relative w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <Image
                          src={p.primary_image || 'https://placehold.co/100x100?text=Item'}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-gray-400">SKU: {p.sku || `THY-${p.id}`}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-purple-50 text-[#36135d] font-semibold px-2 py-0.5 rounded text-[10px]">
                        {p.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-gray-700">
                      Rs. {Number(p.regular_price).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {p.sale_price ? (
                        <span className="text-[#a7144c] font-bold">
                          Rs. {Number(p.sale_price).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`font-bold ${p.stock_quantity <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {p.stock_quantity} units
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-gray-600 hover:text-[#36135d] hover:bg-purple-50 rounded transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Page {pagination.current_page} of {pagination.last_page} ({pagination.total} total items)
            </span>
            <div className="flex gap-1">
              <button
                disabled={pagination.current_page <= 1}
                onClick={() => fetchProducts(pagination.current_page - 1)}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => fetchProducts(pagination.current_page + 1)}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                  placeholder="e.g. Stainless Steel Food Chopper 2L"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase"
                    placeholder="THY-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Regular Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={formData.regular_price}
                    onChange={(e) => setFormData({ ...formData, regular_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sale Price (Rs.)</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Product specs and details..."
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-[#36135d] hover:bg-[#a7144c] text-white rounded-lg font-bold transition disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
