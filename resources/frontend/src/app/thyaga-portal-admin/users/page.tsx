'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Loader2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { api } from '@/services/api';
import { CustomerUser } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    total_orders: 0,
    suspended_customers: 0,
  });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerUser | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for Add Customer
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as CustomerUser['status'],
    password: '',
  });

  // Form state for Edit Customer
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as CustomerUser['status'],
    password: '',
  });

  const fetchCustomers = async (page = 1) => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await api.getAdminUsers(token, {
        page,
        status: selectedStatus || undefined,
        search: search || undefined,
      });

      if (res.success) {
        setCustomers(res.data);
        if (res.stats) {
          setStats({
            total_customers: res.stats.total_customers ?? 0,
            active_customers: res.stats.active_users ?? 0,
            total_orders: (res.stats as unknown as { total_orders?: number }).total_orders ?? 0,
            suspended_customers: (res.stats as unknown as { suspended_customers?: number }).suspended_customers ?? 0,
          });
        }
        if (res.pagination) setPagination(res.pagination);
      }
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [selectedStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(1);
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await api.createAdminUser(token, {
        ...formData,
        role: 'customer',
      });
      if (res.success) {
        showFeedback('success', `Customer '${formData.name}' created successfully`);
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          status: 'active',
          password: '',
        });
        fetchCustomers(1);
      }
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Could not create customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<CustomerUser> & { password?: string } = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        status: editFormData.status,
      };
      if (editFormData.password.trim()) {
        payload.password = editFormData.password.trim();
      }

      const res = await api.updateAdminUser(token, editingCustomer.id, payload);
      if (res.success) {
        showFeedback('success', `Customer '${editFormData.name}' updated successfully`);
        setEditingCustomer(null);
        fetchCustomers(pagination.current_page);
      }
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Could not update customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await api.deleteAdminUser(token, deletingCustomer.id);
      if (res.success) {
        showFeedback('success', `Customer '${deletingCustomer.name}' removed successfully`);
        setDeletingCustomer(null);
        fetchCustomers(pagination.current_page);
      } else {
        showFeedback('error', res.message || 'Could not delete customer');
      }
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Failed to delete customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (customer: CustomerUser) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      status: customer.status,
      password: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>Customer Management</span>
          </h1>
          <p className="text-xs text-gray-500">
            Monitor registered shoppers, contact profiles, and store purchase histories
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#36135d] hover:bg-[#a7144c] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#36135d] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Customers
            </span>
            <span className="text-lg font-black text-gray-900">{stats.total_customers}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Active Accounts
            </span>
            <span className="text-lg font-black text-emerald-600">{stats.active_customers}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-lg font-black text-blue-600">{stats.total_orders}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Suspended Accounts
            </span>
            <span className="text-lg font-black text-amber-600">{stats.suspended_customers}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
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
          <span className="text-xs text-gray-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
              <span className="text-xs font-semibold">Loading customers...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400">
              No customer records found.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3">Customer Profile</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Orders Placed</th>
                  <th className="p-3">Registration Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => {
                  const initials = c.name
                    ? c.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'C';

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#36135d] font-black text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{c.name}</div>
                            <div className="text-[10px] text-gray-400">Customer ID: #{c.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{c.email}</div>
                        <div className="text-[10px] text-gray-400">{c.phone || 'No phone recorded'}</div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-gray-900">{c.orders_count ?? 0} orders</span>
                      </td>

                      <td className="p-3 text-[11px] text-gray-500">
                        {new Date(c.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(c)}
                            className="p-1.5 text-gray-500 hover:text-[#36135d] hover:bg-purple-50 rounded-lg transition cursor-pointer"
                            title="Edit customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCustomer(c)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Page {pagination.current_page} of {pagination.last_page} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.current_page <= 1}
                onClick={() => fetchCustomers(pagination.current_page - 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg font-bold transition"
              >
                Previous
              </button>
              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => fetchCustomers(pagination.current_page + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg font-bold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#36135d] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-gray-900">Add New Customer</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nimal Perera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="nimal@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="077 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as CustomerUser['status'] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-hidden"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-white bg-[#36135d] hover:bg-[#a7144c] rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                  <span>Create Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#36135d] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-gray-900">Edit Customer Details</h3>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="077 123 4567"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value as CustomerUser['status'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-hidden"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Reset Password (Leave blank to keep existing)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-white bg-[#36135d] hover:bg-[#a7144c] rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">Remove Customer</h3>
                <p className="text-xs text-gray-500">Confirm customer account removal</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete customer{' '}
              <strong className="text-gray-900">{deletingCustomer.name}</strong> ({deletingCustomer.email})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteCustomer}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
