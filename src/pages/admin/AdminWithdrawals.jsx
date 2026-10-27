import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  Check, 
  X, 
  Building2, 
  CreditCard, 
  Copy, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowDownToLine, 
  ExternalLink,
  Filter,
  CheckCheck,
  Eye
} from 'lucide-react';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState('');
  
  // Action Modal State
  const [actionModal, setActionModal] = useState({ 
    show: false, 
    type: '', // 'approve' | 'reject' | 'view'
    item: null, 
    payload: '',
    error: '',
    submitting: false 
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/withdrawals/admin');
      setWithdrawals(res.data.data || []);
    } catch (err) {
      console.error('Failed to load admin withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const openApproveModal = (item) => {
    setActionModal({
      show: true,
      type: 'approve',
      item,
      payload: '',
      error: '',
      submitting: false
    });
  };

  const openRejectModal = (item) => {
    setActionModal({
      show: true,
      type: 'reject',
      item,
      payload: 'Bank account details could not be verified.',
      error: '',
      submitting: false
    });
  };

  const openViewModal = (item) => {
    setActionModal({
      show: true,
      type: 'view',
      item,
      payload: '',
      error: '',
      submitting: false
    });
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (actionModal.type === 'reject' && !actionModal.payload.trim()) {
      setActionModal(prev => ({ 
        ...prev, 
        error: 'Rejection reason is required' 
      }));
      return;
    }

    setActionModal(prev => ({ ...prev, submitting: true, error: '' }));

    try {
      if (actionModal.type === 'approve') {
        await api.post(`/withdrawals/${actionModal.item._id}/approve`, {
          paymentReference: actionModal.payload?.trim() || ''
        });
      } else if (actionModal.type === 'reject') {
        await api.post(`/withdrawals/${actionModal.item._id}/reject`, {
          reason: actionModal.payload.trim()
        });
      }
      setActionModal({ show: false, type: '', item: null, payload: '', error: '', submitting: false });
      fetchWithdrawals();
    } catch (err) {
      setActionModal(prev => ({ 
        ...prev, 
        submitting: false, 
        error: err.response?.data?.error || 'Failed to process withdrawal action' 
      }));
    }
  };

  // Calculations for stats
  const totalRequests = withdrawals.length;
  const pendingRequests = withdrawals.filter(w => w.status === 'requested');
  const paidRequests = withdrawals.filter(w => w.status === 'paid');
  const rejectedRequests = withdrawals.filter(w => w.status === 'rejected');

  const pendingAmount = pendingRequests.reduce((acc, curr) => acc + (curr.amount || 0), 0) / 100;
  const paidAmount = paidRequests.reduce((acc, curr) => acc + (curr.amount || 0), 0) / 100;

  // Filtered withdrawals
  const filteredWithdrawals = withdrawals.filter(item => {
    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const userName = item.user?.name?.toLowerCase() || '';
      const userEmail = item.user?.email?.toLowerCase() || '';
      const bankName = item.payoutDetailsSnapshot?.bankName?.toLowerCase() || '';
      const accNo = item.payoutDetailsSnapshot?.accountNumber?.toLowerCase() || '';
      const ifsc = item.payoutDetailsSnapshot?.ifscCode?.toLowerCase() || '';
      const holder = item.payoutDetailsSnapshot?.accountHolderName?.toLowerCase() || '';
      const ref = item.paymentReference?.toLowerCase() || '';

      return (
        userName.includes(q) ||
        userEmail.includes(q) ||
        bankName.includes(q) ||
        accNo.includes(q) ||
        ifsc.includes(q) ||
        holder.includes(q) ||
        ref.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Withdrawal Requests</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Review user bank details, approve payouts, and issue bank transfer confirmations
          </p>
        </div>
        <button
          onClick={fetchWithdrawals}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm w-fit"
        >
          Refresh List
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Requests</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#0F172A]">{pendingRequests.length}</h3>
              <p className="mt-1 text-xs font-semibold text-gray-400">Total: ₹{pendingAmount.toFixed(2)}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Paid / Approved</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#0F172A]">{paidRequests.length}</h3>
              <p className="mt-1 text-xs font-semibold text-gray-400">Total: ₹{paidAmount.toFixed(2)}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Rejected Requests</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#0F172A]">{rejectedRequests.length}</h3>
              <p className="mt-1 text-xs font-semibold text-gray-400">Refunded to wallets</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#4A3AFF] uppercase tracking-wider">Total Volume</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#0F172A]">{totalRequests}</h3>
              <p className="mt-1 text-xs font-semibold text-gray-400">All-time payout requests</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#F4F2FF] flex items-center justify-center text-[#4A3AFF]">
              <ArrowDownToLine size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, bank, account number, or IFSC..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm font-semibold text-[#0F172A] focus:border-[#4A3AFF] focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600 shrink-0">
          {[
            { id: 'all', label: `All (${withdrawals.length})` },
            { id: 'requested', label: `Pending (${pendingRequests.length})` },
            { id: 'paid', label: `Paid (${paidRequests.length})` },
            { id: 'rejected', label: `Rejected (${rejectedRequests.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === tab.id
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            Loading withdrawal requests...
          </div>
        ) : filteredWithdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50/80 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Bank Details (Payout Destination)</th>
                  <th className="px-6 py-4">Requested Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {filteredWithdrawals.map((item) => {
                  const snapshot = item.payoutDetailsSnapshot || {};
                  const isPending = item.status === 'requested';
                  const isPaid = item.status === 'paid';
                  const isRejected = item.status === 'rejected';

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/60 transition">
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-[#0F172A]">{item.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-gray-500 font-medium">{item.user?.email || 'No email'}</div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-base font-extrabold text-[#0F172A]">
                          ₹{(item.amount / 100).toFixed(2)}
                        </span>
                      </td>

                      {/* Complete Bank Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#0F172A] text-xs">
                              {snapshot.bankName || 'Bank Not Specified'}
                            </span>
                            {snapshot.branchName && (
                              <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {snapshot.branchName}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-600 flex items-center gap-1.5">
                            <span className="text-gray-400">Name:</span>
                            <span className="font-semibold text-gray-800">{snapshot.accountHolderName || item.user?.name}</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            {/* Account Number with Copy */}
                            <div className="flex items-center gap-1 font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                              <span>A/C: {snapshot.accountNumber || '—'}</span>
                              {snapshot.accountNumber && (
                                <button
                                  onClick={() => handleCopy(snapshot.accountNumber, `acc-${item._id}`)}
                                  className="text-gray-400 hover:text-[#4A3AFF] transition ml-1"
                                  title="Copy Account Number"
                                >
                                  {copiedId === `acc-${item._id}` ? (
                                    <CheckCheck size={13} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* IFSC with Copy */}
                            <div className="flex items-center gap-1 font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                              <span>IFSC: {snapshot.ifscCode || '—'}</span>
                              {snapshot.ifscCode && (
                                <button
                                  onClick={() => handleCopy(snapshot.ifscCode, `ifsc-${item._id}`)}
                                  className="text-gray-400 hover:text-[#4A3AFF] transition ml-1"
                                  title="Copy IFSC Code"
                                >
                                  {copiedId === `ifsc-${item._id}` ? (
                                    <CheckCheck size={13} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {snapshot.upiId && (
                            <div className="text-[11px] text-gray-500">
                              UPI: <span className="font-semibold text-gray-700">{snapshot.upiId}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {new Date(item.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                          isPending ? 'bg-amber-100 text-amber-800' :
                          isPaid ? 'bg-emerald-100 text-emerald-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {isPending && <Clock size={12} />}
                          {isPaid && <CheckCircle2 size={12} />}
                          {isRejected && <AlertCircle size={12} />}
                          {isPending ? 'Pending Review' : item.status}
                        </span>
                        {isPaid && item.paymentReference && (
                          <div className="text-[11px] text-gray-500 mt-1 font-mono font-semibold">
                            Ref: {item.paymentReference}
                          </div>
                        )}
                        {isRejected && item.adminReason && (
                          <div className="text-[11px] text-rose-600 mt-1 max-w-xs truncate" title={item.adminReason}>
                            Reason: {item.adminReason}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openApproveModal(item)}
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-sm border border-emerald-200"
                            >
                              <Check size={14} />
                              <span>Approve Payout</span>
                            </button>
                            <button
                              onClick={() => openRejectModal(item)}
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-sm border border-rose-200"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openViewModal(item)}
                            className="inline-flex items-center gap-1 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition border border-gray-200"
                          >
                            <Eye size={14} />
                            <span>View Details</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
              <ArrowDownToLine size={24} />
            </div>
            <h4 className="text-base font-extrabold text-[#0F172A]">No Withdrawal Requests Found</h4>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {search ? 'Try modifying your search query or filters.' : 'There are no withdrawal requests in this view.'}
            </p>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* ACTION MODAL (APPROVE / REJECT / VIEW) */}
      {/* ==================================================== */}
      {actionModal.show && actionModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setActionModal({ show: false, type: '', item: null, payload: '', error: '', submitting: false })}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                actionModal.type === 'approve' ? 'bg-emerald-100 text-emerald-700' :
                actionModal.type === 'reject' ? 'bg-rose-100 text-rose-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {actionModal.type === 'approve' ? <Check size={24} /> :
                 actionModal.type === 'reject' ? <X size={24} /> :
                 <Building2 size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  {actionModal.type === 'approve' ? 'Approve & Mark Payout as Paid' :
                   actionModal.type === 'reject' ? 'Reject Withdrawal Request' :
                   'Withdrawal Request Details'}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  User: <strong>{actionModal.item.user?.name}</strong> ({actionModal.item.user?.email})
                </p>
              </div>
            </div>

            {/* Payout & Bank Summary Box */}
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200 mb-5 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount to Transfer</span>
                <span className="text-2xl font-extrabold text-[#0F172A]">
                  ₹{(actionModal.item.amount / 100).toFixed(2)}
                </span>
              </div>

              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Bank Name:</span>
                  <span className="font-extrabold text-gray-900">{actionModal.item.payoutDetailsSnapshot?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Account Holder:</span>
                  <span className="font-extrabold text-gray-900">{actionModal.item.payoutDetailsSnapshot?.accountHolderName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Account Number:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-[#0F172A]">
                    <span>{actionModal.item.payoutDetailsSnapshot?.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(actionModal.item.payoutDetailsSnapshot?.accountNumber, 'modal-acc')}
                      className="text-gray-400 hover:text-[#4A3AFF]"
                    >
                      {copiedId === 'modal-acc' ? <CheckCheck size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">IFSC Code:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-[#0F172A]">
                    <span>{actionModal.item.payoutDetailsSnapshot?.ifscCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(actionModal.item.payoutDetailsSnapshot?.ifscCode, 'modal-ifsc')}
                      className="text-gray-400 hover:text-[#4A3AFF]"
                    >
                      {copiedId === 'modal-ifsc' ? <CheckCheck size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Branch:</span>
                  <span className="font-semibold text-gray-900">{actionModal.item.payoutDetailsSnapshot?.branchName || '—'}</span>
                </div>
                {actionModal.item.payoutDetailsSnapshot?.upiId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">UPI ID:</span>
                    <span className="font-semibold text-gray-900">{actionModal.item.payoutDetailsSnapshot?.upiId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error banner */}
            {actionModal.error && (
              <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
                {actionModal.error}
              </div>
            )}

            {/* Approve Form */}
            {actionModal.type === 'approve' && (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActionModal({ show: false, type: '', item: null, payload: '', error: '', submitting: false })}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionModal.submitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {actionModal.submitting ? 'Approving...' : 'Confirm & Mark as Paid'}
                  </button>
                </div>
              </form>
            )}

            {/* Reject Form */}
            {actionModal.type === 'reject' && (
              <form onSubmit={handleAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0F172A] mb-1">
                    Reason for Rejection <span className="text-rose-500">*</span>
                  </label>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      'Invalid account number',
                      'IFSC code mismatch',
                      'Account holder name mismatch',
                      'Bank server transfer failed',
                      'KYC verification required'
                    ].map(reason => (
                      <button
                        type="button"
                        key={reason}
                        onClick={() => setActionModal({ ...actionModal, payload: reason })}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={actionModal.payload}
                    onChange={(e) => setActionModal({ ...actionModal, payload: e.target.value })}
                    placeholder="Enter reason for rejecting this payout..."
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0F172A] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none transition"
                  />
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    Notice: Rejecting this withdrawal will automatically credit ₹{(actionModal.item.amount / 100).toFixed(2)} back into the user's earning wallet.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActionModal({ show: false, type: '', item: null, payload: '', error: '', submitting: false })}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionModal.submitting}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-md shadow-rose-600/20 disabled:opacity-50"
                  >
                    {actionModal.submitting ? 'Rejecting...' : 'Confirm Rejection & Refund'}
                  </button>
                </div>
              </form>
            )}

            {/* View Only Form */}
            {actionModal.type === 'view' && (
              <div className="space-y-4">
                {actionModal.item.paymentReference && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                    <p className="font-bold">Payment Reference / UTR:</p>
                    <p className="font-mono font-extrabold text-sm mt-0.5">{actionModal.item.paymentReference}</p>
                  </div>
                )}
                {actionModal.item.adminReason && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900">
                    <p className="font-bold">Rejection Reason:</p>
                    <p className="mt-0.5">{actionModal.item.adminReason}</p>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  <p>Created: {new Date(actionModal.item.createdAt).toLocaleString()}</p>
                  {actionModal.item.processedAt && (
                    <p>Processed: {new Date(actionModal.item.processedAt).toLocaleString()}</p>
                  )}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActionModal({ show: false, type: '', item: null, payload: '', error: '', submitting: false })}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
