import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { PlusCircle } from 'lucide-react';

const AdminTopUps = () => {
  const [topUps, setTopUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopUps();
  }, []);

  const fetchTopUps = async () => {
    try {
      const res = await api.get('/admin/topups');
      setTopUps(res.data.data);
    } catch (err) {
      console.error('Failed to load topups', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const totalAmount = topUps
    .filter(t => t.status === 'verified')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Add Cash (Top Ups) History</h1>
          <p className="text-sm text-gray-500 mt-1">View all user wallet deposits.</p>
        </div>
        <div className="bg-[#4A3AFF]/10 border border-[#4A3AFF]/20 rounded-xl px-4 py-3 shrink-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4A3AFF] flex items-center justify-center text-white shrink-0 shadow-md">
            <span className="font-bold text-lg">₹</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#4A3AFF] uppercase tracking-wider">Total Verified Added</p>
            <p className="text-xl font-extrabold text-[#0F172A]">₹{(totalAmount / 100).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Gateway Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {topUps.map((item) => (
              <tr key={item._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">{item.user?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{item.user?.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                  ₹{(item.amount / 100).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.gatewayReference || '-'}
                </td>
              </tr>
            ))}
            {topUps.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No top up records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTopUps;
