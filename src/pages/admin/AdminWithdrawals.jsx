import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Check, X, CreditCard } from 'lucide-react';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ show: false, type: '', id: '', payload: '' });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/withdrawals/admin');
      setWithdrawals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (actionModal.type === 'approve') {
        await api.post(`/withdrawals/${actionModal.id}/approve`, {
          paymentReference: actionModal.payload
        });
      } else {
        await api.post(`/withdrawals/${actionModal.id}/reject`, {
          reason: actionModal.payload
        });
      }
      setActionModal({ show: false, type: '', id: '', payload: '' });
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process request');
    }
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">Withdrawal Requests</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {withdrawals.map((item) => (
              <tr key={item._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">{item.user?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{item.user?.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                  ₹{(item.amount / 100).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    item.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  {item.status === 'requested' && (
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setActionModal({ show: true, type: 'approve', id: item._id, payload: '' })}
                        className="flex items-center space-x-1 rounded bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100"
                      >
                        <Check size={14} /> <span>Approve</span>
                      </button>
                      <button 
                        onClick={() => setActionModal({ show: true, type: 'reject', id: item._id, payload: '' })}
                        className="flex items-center space-x-1 rounded bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100"
                      >
                        <X size={14} /> <span>Reject</span>
                      </button>
                    </div>
                  )}
                  {item.status === 'paid' && item.paymentReference && (
                    <span className="text-xs text-gray-500">Ref: {item.paymentReference}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {actionModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              {actionModal.type === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
            </h2>
            <form onSubmit={handleAction}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {actionModal.type === 'approve' ? 'Gateway Payment Reference ID' : 'Reason for Rejection'}
                </label>
                <input 
                  type="text" 
                  required 
                  className="mt-1 w-full rounded-md border p-2 focus:border-[#4A3AFF] focus:ring-1 focus:ring-[var(--color-navy)]"
                  value={actionModal.payload}
                  onChange={(e) => setActionModal({ ...actionModal, payload: e.target.value })}
                  placeholder={actionModal.type === 'approve' ? 'e.g. UTR123456789' : 'Reason'}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setActionModal({ show: false })} className="rounded-md border px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button type="submit" className={`rounded-md px-4 py-2 text-sm text-white ${actionModal.type === 'approve' ? 'bg-green-600' : 'bg-red-600'}`}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
