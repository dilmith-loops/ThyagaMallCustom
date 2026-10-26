'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Search,
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
  Crown,
} from 'lucide-react';
import { api } from '@/services/api';
import { Admin } from '@/types';

export default function AdminStaffPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState({
    total_admins: 0,
    super_admins: 0,
    managers: 0,
    editors: 0,
    active_admins: 0,
  });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for Add Admin
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'manager' as Admin['role'],
    status: 'active' as Admin['status'],
    password: '',
  });

  // Form state for Edit Admin
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'manager' as Admin['role'],
    status: 'active' as Admin['status'],
    password: '',
  });

  const fetchAdmins = async (page = 1) => {
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await api.getAdminStaff(token, {
        page,
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        search: search || undefined,
      });

      if (res.success) {
        setAdmins(res.data);
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
    fetchAdmins(1);
  }, [selectedRole, selectedStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdmins(1);
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await api.createAdminStaff(token, formData);
      if (res.success) {
        showFeedback('success', `Administrator '${formData.name}' created successfully`);
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'manager',
          status: 'active',
          password: '',
        });
        fetchAdmins(1);
      }
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Could not create administrator');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<Admin> & { password?: string } = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        role: editFormData.role,
        status: editFormData.status,
      };
      if (editFormData.password.trim()) {
        payload.password = editFormData.password.trim();
      }

      const res = await api.updateAdminStaff(token, editingAdmin.id, payload);
      if (res.success) {
        showFeedback('success', `Administrator '${editFormData.name}' updated successfully`);
        setEditingAdmin(null);
        fetchAdmins(pagination.current_page);
      }
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Could not update administrator');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    const token = localStorage.getItem('thyaga_admin_token') || '';
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await api.deleteAdminStaff(token, deletingAdmin.id);
      if (res.success) {
        showFeedback('success', `Administrator '${deletingAdmin.name}' removed successfully`);
        setDeletingAdmin(null);
        fetchAdmins(pagination.current_page);
      } else {
        showFeedback('error', res.message || 'Could not delete administrator');
      }
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Failed to delete administrator');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      role: admin.role,
      status: admin.status || 'active',
      password: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>Administrator & Staff Management</span>
          </h1>
          <p className="text-xs text-gray-500">
            Dedicated administrative access control, system roles, and store privileges
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#36135d] hover:bg-[#a7144c] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
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
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Staff
            </span>
            <span className="text-lg font-black text-gray-900">{stats.total_admins}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#a7144c] flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Super Admins
            </span>
            <span className="text-lg font-black text-[#a7144c]">{stats.super_admins}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Store Managers
            </span>
            <span className="text-lg font-black text-blue-600">{stats.managers}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Active Access
            </span>
            <span className="text-lg font-black text-emerald-600">{stats.active_admins}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
          <input
            type="text"
            placeholder="Search admins by name, email, or phone..."
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

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden"
            >
              <option value="">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="manager">Store Manager</option>
              <option value="editor">Content Editor</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
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
      </div>

      {/* Administrators Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
              <span className="text-xs font-semibold">Loading administrators...</span>
            </div>
          ) : admins.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400">
              No administrator accounts found.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3">Staff Profile</th>
                  <th className="p-3">Email & Contact</th>
                  <th className="p-3">Privilege Role</th>
                  <th className="p-3">Access Status</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((adm) => {
                  const initials = adm.name
                    ? adm.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'A';

                  return (
                    <tr key={adm.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#36135d] font-black text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{adm.name}</span>
                              {adm.role === 'super_admin' && (
                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400">Admin ID: #{adm.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{adm.email}</div>
                        <div className="text-[10px] text-gray-400">{adm.phone || 'No phone recorded'}</div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            adm.role === 'super_admin'
                              ? 'bg-purple-100 text-[#36135d]'
                              : adm.role === 'manager'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-cyan-100 text-cyan-800'
                          }`}
                        >
                          {adm.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            adm.status === 'active' || !adm.status
                              ? 'bg-emerald-100 text-emerald-800'
                              : adm.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {adm.status || 'active'}
                        </span>
                      </td>

                      <td className="p-3 text-[11px] text-gray-500">
                        {adm.last_login_at ? (
                          <div>
                            <span className="font-medium text-gray-700">Signed in</span>{' '}
                            {new Date(adm.last_login_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        ) : (
                          <div>Never logged in</div>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(adm)}
                            className="p-1.5 text-gray-500 hover:text-[#36135d] hover:bg-purple-50 rounded-lg transition cursor-pointer"
                            title="Edit administrator"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {adm.email !== 'admin@thyaga.lk' && (
                            <button
                              onClick={() => setDeletingAdmin(adm)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete administrator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
                onClick={() => fetchAdmins(pagination.current_page - 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg font-bold transition"
              >
                Previous
              </button>
              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => fetchAdmins(pagination.current_page + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg font-bold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Administrator Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#36135d] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-gray-900">Add Administrator</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dilmith Loops"
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
                  placeholder="staff@thyaga.lk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Privilege Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as Admin['role'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-hidden"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="manager">Store Manager</option>
                    <option value="editor">Content Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as Admin['status'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-hidden"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
                  <span>Create Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Administrator Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#36135d] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-gray-900">Edit Administrator Details</h3>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-3.5 text-xs">
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
                  placeholder="+94 77 123 4567"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#36135d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Privilege Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, role: e.target.value as Admin['role'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-hidden"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="manager">Store Manager</option>
                    <option value="editor">Content Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value as Admin['status'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-hidden"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Change Password (Leave blank to keep existing)
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
                  onClick={() => setEditingAdmin(null)}
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

      {/* Delete Administrator Modal */}
      {deletingAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">Remove Administrator</h3>
                <p className="text-xs text-gray-500">Revoke administrative access</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to remove administrator{' '}
              <strong className="text-gray-900">{deletingAdmin.name}</strong> ({deletingAdmin.email})?
              This will revoke all administrative login privileges.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeletingAdmin(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteAdmin}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Revoke Access</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
