import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { PlusCircle, Check, X, Copy, CheckCircle2, AlertCircle, RefreshCw, Search, Clock } from 'lucide-react';

const AdminTopUps = () => {
  const [topUps, setTopUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [copiedUtr, setCopiedUtr] = useState(null);

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

  const handleApprove = async (id, amount) => {
    if (!window.confirm(`Are you sure you want to approve this deposit of ₹${(amount / 100).toFixed(2)} and credit the user's wallet?`)) {
      return;
    }

    setProcessingId(id);
    try {
      const res = await api.post(`/admin/topups/${id}/approve`);
      if (res.data.success) {
        alert('Deposit approved successfully! User wallet has been credited.');
        await fetchTopUps();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve deposit.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejecting this deposit request:', 'Payment not received in bank account / Invalid UTR');
    if (reason === null) return; // user cancelled

    setProcessingId(id);
    try {
      const res = await api.post(`/admin/topups/${id}/reject`, { reason });
      if (res.data.success) {
        alert('Deposit marked as rejected.');
        await fetchTopUps();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject deposit.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#4A3AFF] animate-spin" />
      </div>
    );
  }

  const verifiedAmount = topUps
    .filter(t => t.status === 'verified')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = topUps.filter(t => t.status === 'pending').length;

  const filteredTopUps = topUps.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.user?.name?.toLowerCase().includes(query) ||
      item.user?.email?.toLowerCase().includes(query) ||
      item.utr?.toLowerCase().includes(query) ||
      item.gatewayReference?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <PlusCircle className="text-[#4A3AFF]" size={28} />
            User Deposits (Add Cash)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review user UPI deposits, verify UTR numbers, and approve wallet credits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Pending Badge Card */}
          {pendingCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
              <Clock size={18} className="text-amber-600 animate-pulse" />
              <div>
                <p className="text-[10px] font-bold text-amber-700 uppercase">Pending Review</p>
                <p className="text-sm font-extrabold text-amber-900">{pendingCount} requests</p>
              </div>
            </div>
          )}

          {/* Total Verified Card */}
          <div className="bg-[#4A3AFF]/10 border border-[#4A3AFF]/20 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-[#4A3AFF] flex items-center justify-center text-white shrink-0 shadow-md">
              <span className="font-bold text-base">₹</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#4A3AFF] uppercase tracking-wider">Total Verified</p>
              <p className="text-base font-extrabold text-[#0F172A]">₹{(verifiedAmount / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Deposits' },
            { id: 'pending', label: `Pending (${pendingCount})`, badge: pendingCount > 0 },
            { id: 'verified', label: 'Verified' },
            { id: 'failed', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-[#4A3AFF] text-white shadow-md shadow-[#4A3AFF]/20'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#4A3AFF] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Deposits Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">UTR / Reference No.</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredTopUps.map((item) => {
                const utrValue = item.utr || item.gatewayReference || '-';
                const isProcessing = processingId === item._id;

                return (
                  <tr key={item._id} className="hover:bg-gray-50/70 transition">
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-[#0F172A]">{item.user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{item.user?.email}</div>
                      {item.user?.phone && <div className="text-[11px] text-gray-400">{item.user.phone}</div>}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap font-extrabold text-[#0F172A] text-base">
                      ₹{(item.amount / 100).toFixed(2)}
                    </td>

                    {/* UTR Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {utrValue !== '-' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-md select-all">
                            {utrValue}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(utrValue)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition"
                            title="Copy UTR"
                          >
                            {copiedUtr === utrValue ? (
                              <Check size={14} className="text-emerald-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 uppercase">
                        {item.paymentMethod || 'Manual UPI'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-gray-400">{new Date(item.createdAt).toLocaleTimeString()}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : item.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {item.status === 'pending' && <Clock size={12} />}
                        {item.status === 'verified' && <CheckCircle2 size={12} />}
                        {item.status === 'failed' && <AlertCircle size={12} />}
                        <span className="capitalize">{item.status}</span>
                      </span>

                      {item.rejectionReason && (
                        <div className="text-[10px] text-red-500 mt-0.5 max-w-xs truncate" title={item.rejectionReason}>
                          Reason: {item.rejectionReason}
                        </div>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleApprove(item._id, item.amount)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Verify UTR and credit user balance"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleReject(item._id)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Reject deposit"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredTopUps.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <PlusCircle size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No deposit requests found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {filterStatus !== 'all' ? `No ${filterStatus} deposits.` : 'New user deposits will appear here.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTopUps;
