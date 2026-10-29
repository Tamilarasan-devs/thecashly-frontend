import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">Users Management</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name / Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Referral Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Referred By</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Wallet Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-bold text-[#0F172A]">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {u.referralCode || '-'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                  {u.referredBy ? (
                    <div>
                      <span className="font-bold text-gray-900">{u.referredBy.name}</span>
                      <div className="text-[11px] font-mono text-indigo-600">({u.referredBy.referralCode})</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Direct Signup</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#4A3AFF]">
                  ₹{(u.walletBalance / 100).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
