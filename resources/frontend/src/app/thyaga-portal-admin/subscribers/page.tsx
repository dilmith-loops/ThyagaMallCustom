'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Mail,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  Loader2,
  Download,
  Calendar,
  Send,
  UserCheck,
  UserX,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/services/api';
import { NewsletterSubscriber } from '@/types';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState({
    total_subscribers: 0,
    active_subscribers: 0,
    unsubscribed_subscribers: 0,
    recent_subscribers_7d: 0,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingSub, setDeletingSub] = useState<NewsletterSubscriber | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Form State
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState<'subscribed' | 'unsubscribed'>('subscribed');
  const [newSource, setNewSource] = useState('admin_manual');

  const fetchSubscribers = useCallback(async (page = 1) => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await api.getAdminNewsletterSubscribers(token, {
        page,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
        sort_by: sortBy,
        per_page: 20,
      });

      if (res.success) {
        setSubscribers(res.data);
        if (res.stats) setStats(res.stats);
        if (res.pagination) {
          setPagination({
            current_page: res.pagination.current_page,
            last_page: res.pagination.last_page,
            per_page: res.pagination.per_page,
            total: res.pagination.total,
          });
        }
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to fetch subscribers',
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, sourceFilter, sortBy]);

  useEffect(() => {
    fetchSubscribers(1);
  }, [fetchSubscribers]);

  // Handle Add Subscriber
  const handleCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await api.createAdminNewsletterSubscriber(token, {
        email: newEmail.trim().toLowerCase(),
        status: newStatus,
        source: newSource,
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Subscriber email registered successfully!' });
        setIsAddModalOpen(false);
        setNewEmail('');
        fetchSubscribers(1);
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error adding subscriber email',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (sub: NewsletterSubscriber) => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    const targetStatus = sub.status === 'subscribed' ? 'unsubscribed' : 'subscribed';
    try {
      const res = await api.toggleAdminNewsletterSubscriberStatus(token, sub.id, targetStatus);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Subscriber marked as ${targetStatus.toUpperCase()}`,
        });
        fetchSubscribers(pagination.current_page);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      alert('Failed to update status');
    }
  };

  // Handle Delete Subscriber
  const handleDeleteSubscriber = async () => {
    if (!deletingSub) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await api.deleteAdminNewsletterSubscriber(token, deletingSub.id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Subscriber removed successfully!' });
        setDeletingSub(null);
        fetchSubscribers(pagination.current_page);
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete subscriber',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle CSV Export
  const handleExportCSV = async () => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsExporting(true);
    try {
      const res = await api.getAdminNewsletterSubscribers(token, { all: true });
      if (res.success && res.data) {
        const rows = [
          ['ID', 'Email', 'Status', 'Source', 'Subscribed At', 'Unsubscribed At'],
          ...res.data.map((s) => [
            s.id.toString(),
            s.email,
            s.status,
            s.source || 'N/A',
            s.subscribed_at ? new Date(s.subscribed_at).toLocaleString() : '',
            s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleString() : '',
          ]),
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `thyaga_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setFeedback({ type: 'success', message: `Exported ${res.data.length} subscriber emails to CSV!` });
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {
      alert('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Main Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-[#36135d] font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <Mail className="w-3 h-3" />
              <span>Newsletter Marketing</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {stats.active_subscribers} Active Subscribers
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-gray-500">
            Monitor customer mailing lists, track newsletter signups, and export audience databases for email campaigns
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-purple-700" />}
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setNewEmail('');
              setNewStatus('subscribed');
              setNewSource('admin_manual');
              setIsAddModalOpen(true);
            }}
            className="bg-[#36135d] hover:bg-[#a7144c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Subscribers
            </span>
            <Mail className="w-4 h-4 text-[#36135d]" />
          </div>
          <div className="text-xl font-black text-gray-900">{stats.total_subscribers}</div>
          <span className="text-[10px] text-gray-400">Total collected audience</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Active Subscribers
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xl font-black text-emerald-700">{stats.active_subscribers}</div>
          <span className="text-[10px] text-emerald-600/80 font-medium">Delivering promotional mail</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Recent (7 Days)
            </span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-700">+{stats.recent_subscribers_7d}</div>
          <span className="text-[10px] text-amber-600/80 font-medium">New signups this week</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Unsubscribed
            </span>
            <UserX className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-black text-gray-600">{stats.unsubscribed_subscribers}</div>
          <span className="text-[10px] text-gray-400">Opted out from emails</span>
        </div>
      </div>

      {/* Search, Filter & Toolbar Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subscriber email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#36135d] focus:ring-1 focus:ring-[#36135d]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
          {/* Status Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('subscribed')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'subscribed' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-emerald-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('unsubscribed')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'unsubscribed' ? 'bg-white text-gray-800 shadow-xs' : 'hover:text-gray-800'
              }`}
            >
              Unsubscribed
            </button>
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-medium focus:outline-hidden bg-white cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="home_banner">Home Banner</option>
            <option value="footer">Footer Bar</option>
            <option value="checkout">Checkout</option>
            <option value="admin">Admin Manual</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-medium focus:outline-hidden bg-white cursor-pointer"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="email_asc">Email (A-Z)</option>
            <option value="email_desc">Email (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
              <span className="text-xs font-semibold">Loading subscribers database...</span>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-12 bg-purple-50 text-[#36135d] rounded-2xl flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Subscribers Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {search || statusFilter !== 'all'
                  ? 'No subscriber matches your current filters.'
                  : 'No customer emails have subscribed yet. Signups through the storefront banner will appear here automatically.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3.5">Subscriber Email</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Signup Source</th>
                  <th className="p-3.5">Date Subscribed</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#36135d] flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <a
                            href={`mailto:${s.email}`}
                            className="font-bold text-gray-900 hover:text-[#36135d] transition"
                          >
                            {s.email}
                          </a>
                          <span className="text-[10px] text-gray-400 block font-mono">ID: #{s.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                          s.status === 'subscribed'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {s.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                        {s.source || 'home_banner'}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-600">
                      <div className="font-medium">
                        {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : new Date(s.created_at).toLocaleDateString()}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {s.subscribed_at ? new Date(s.subscribed_at).toLocaleTimeString() : ''}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-400 font-mono text-[11px]">
                      {s.ip_address || '—'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setDeletingSub(s)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>
            Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} subscribers)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchSubscribers(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => fetchSubscribers(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#36135d] uppercase tracking-wider mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Manual Signup</span>
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Add Subscriber Email
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscriber} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d] text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Subscription Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'subscribed' | 'unsubscribed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden bg-white"
                >
                  <option value="subscribed">Subscribed (Active)</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Source Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin_manual, in_store_event, campaign_promo"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newEmail.trim()}
                  className="px-5 py-2 bg-[#36135d] hover:bg-[#a7144c] text-white font-bold rounded-lg transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Add to Newsletter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-gray-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Remove Subscriber?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <strong className="text-gray-800">{deletingSub.email}</strong> from the newsletter database?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingSub(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubscriber}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
