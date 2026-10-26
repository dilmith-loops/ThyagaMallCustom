'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Lock,
  LogIn,
  LogOut,
  ShoppingBag,
  Package,
  Users,
  Zap,
  RotateCw,
  Loader2,
  Globe,
  Terminal,
} from 'lucide-react';
import { api } from '@/services/api';
import { ActivityLogItem } from '@/types';

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [stats, setStats] = useState({
    total_activities: 0,
    today_activities: 0,
    unique_admins: 0,
    auth_events: 0,
  });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [selectedAction, setSelectedAction] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async (page = 1) => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await api.getAdminActivityLogs(token, {
        page,
        action: selectedAction || undefined,
        search: search || undefined,
      });

      if (res.success) {
        setLogs(res.data);
        if (res.stats) setStats(res.stats);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [selectedAction]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act === 'LOGIN') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: LogIn,
        label: 'Sign In',
      };
    }
    if (act === 'LOGOUT') {
      return {
        bg: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: LogOut,
        label: 'Sign Out',
      };
    }
    if (act.includes('ORDER')) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: ShoppingBag,
        label: 'Order Update',
      };
    }
    if (act.includes('PRODUCT')) {
      return {
        bg: 'bg-purple-50 text-[#36135d] border-purple-200',
        icon: Package,
        label: act.includes('CREATE')
          ? 'Product Created'
          : act.includes('DELETE')
          ? 'Product Deleted'
          : 'Product Updated',
      };
    }
    if (act.includes('USER')) {
      return {
        bg: 'bg-pink-50 text-[#a7144c] border-pink-200',
        icon: Users,
        label: act.includes('CREATE')
          ? 'User Created'
          : act.includes('DELETE')
          ? 'User Deleted'
          : 'User Updated',
      };
    }
    if (act.includes('FLASH')) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Zap,
        label: 'Flash Sale',
      };
    }

    return {
      bg: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: Activity,
      label: act,
    };
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return past.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>Activity Log & Audit Trail</span>
          </h1>
          <p className="text-xs text-gray-500">
            Real-time administrative operations, order state transitions, and catalog revisions
          </p>
        </div>

        <button
          onClick={() => fetchLogs(pagination.current_page)}
          disabled={isLoading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#36135d] flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Log Entries
            </span>
            <span className="text-lg font-black text-gray-900">{stats.total_activities}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Actions Today
            </span>
            <span className="text-lg font-black text-blue-600">{stats.today_activities}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#a7144c] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Active Admins
            </span>
            <span className="text-lg font-black text-gray-900">{stats.unique_admins}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Auth Events
            </span>
            <span className="text-lg font-black text-emerald-600">{stats.auth_events}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
          <input
            type="text"
            placeholder="Search by action, description, admin, or IP..."
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
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden"
          >
            <option value="">All Categories</option>
            <option value="auth">Authentication (Logins & Logouts)</option>
            <option value="orders">Order Transitions</option>
            <option value="products">Product & Catalog Changes</option>
            <option value="users">User Management Actions</option>
            <option value="flash_sales">Flash Sale Modifications</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
              <span className="text-xs font-semibold">Loading audit logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400">
              No audit records found matching your filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Event Description</th>
                  <th className="p-3">Actor / Admin</th>
                  <th className="p-3">Client / IP</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-gray-900 leading-snug">
                          {log.description}
                        </div>
                        {log.entity_type && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Entity: {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                          </div>
                        )}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-[#36135d] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {log.admin_name ? log.admin_name[0].toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{log.admin_name}</div>
                            {log.admin_id && (
                              <div className="text-[10px] text-gray-400">Admin ID: #{log.admin_id}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <span>{log.ip_address || '127.0.0.1'}</span>
                        </div>
                        {log.user_agent && (
                          <div
                            className="text-[9px] text-gray-400 truncate max-w-[180px]"
                            title={log.user_agent}
                          >
                            {log.user_agent}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="font-bold text-gray-800">
                          {formatRelativeTime(log.created_at)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(log.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                onClick={() => fetchLogs(pagination.current_page - 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg font-bold transition"
              >
                Previous
              </button>
              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => fetchLogs(pagination.current_page + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg font-bold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
