import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Building2, 
  Plus, 
  RefreshCw,
  Wallet,
  Receipt
} from 'lucide-react';

const TransactionHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'withdrawals' ? 'withdrawals' : 'transactions';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [history, setHistory] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [historyRes, withdrawalsRes] = await Promise.all([
        api.get('/services/history').catch(() => ({ data: { data: [] } })),
        api.get('/withdrawals').catch(() => ({ data: { data: [] } }))
      ]);
      setHistory(historyRes.data?.data || []);
      setWithdrawals(withdrawalsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load history data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'withdrawals' ? { tab: 'withdrawals' } : {});
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">History & Activity</h1>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            View your wallet ledger transactions and payout withdrawal requests
          </p>
        </div>

        <Link
          to="/wallet"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A3AFF] to-[#6C5DD3] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Withdrawal</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => handleTabChange('transactions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
          }`}
        >
          <Receipt size={15} />
          <span>All Transactions</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'transactions' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {history.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('withdrawals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'bg-[#10B981] text-white shadow-sm'
              : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
          }`}
        >
          <Wallet size={15} />
          <span>Withdrawal History</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'withdrawals' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {withdrawals.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="text-[#4A3AFF] animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loading history...</p>
        </div>
      ) : activeTab === 'withdrawals' ? (
        /* Withdrawals Tab Content */
        <div className="space-y-3">
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => {
              const status = withdrawal.status;
              const snapshot = withdrawal.payoutDetailsSnapshot || {};

              return (
                <div 
                  key={withdrawal._id} 
                  className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition hover:shadow-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                        status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {status === 'paid' ? <CheckCircle2 size={20} /> :
                         status === 'rejected' ? <AlertCircle size={20} /> :
                         <Clock size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xl font-extrabold text-[#0F172A]">
                            ₹{(withdrawal.amount / 100).toFixed(2)}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                            status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {status === 'requested' ? 'Pending Review' : status}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] font-medium mt-0.5">
                          Requested on {new Date(withdrawal.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-[#0F172A] font-semibold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 w-fit flex items-center gap-1.5">
                      <Building2 size={13} className="text-gray-400" />
                      <span>{snapshot.bankName || 'Bank Transfer'}</span>
                      {snapshot.accountNumber && (
                        <span className="text-gray-500 font-mono">(•••• {snapshot.accountNumber.slice(-4)})</span>
                      )}
                    </div>
                  </div>

                  {/* Bank snapshot columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600 pt-1">
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">Account Name</span>
                      <span className="font-semibold text-gray-900">{snapshot.accountHolderName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">IFSC Code</span>
                      <span className="font-semibold text-gray-900 font-mono">{snapshot.ifscCode || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">Branch</span>
                      <span className="font-semibold text-gray-900">{snapshot.branchName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">Processed Date</span>
                      <span className="font-semibold text-gray-900">
                        {withdrawal.processedAt 
                          ? new Date(withdrawal.processedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                          : 'In Review'}
                      </span>
                    </div>
                  </div>

                  {/* If Paid: Bank UTR Reference */}
                  {status === 'paid' && withdrawal.paymentReference && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>UTR / Bank Ref: <strong className="font-mono text-emerald-950 font-bold">{withdrawal.paymentReference}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(withdrawal.paymentReference, withdrawal._id)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer shadow-xs"
                      >
                        {copiedId === withdrawal._id ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedId === withdrawal._id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {/* If Rejected: Reason */}
                  {status === 'rejected' && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Declined Reason:</p>
                        <p className="mt-0.5">{withdrawal.adminReason || 'Information does not match bank records.'}</p>
                        <p className="text-[11px] text-rose-600 font-semibold mt-1">
                          ✓ ₹{(withdrawal.amount / 100).toFixed(2)} was refunded back to your eligible earning balance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">No withdrawal requests yet</p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  When you request a payout from your earning balance, you can track it here.
                </p>
              </div>
              <Link
                to="/wallet"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition"
              >
                Go to Wallet & Withdraw
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Transactions Ledger Tab Content */
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl divide-y divide-gray-100 p-2 border border-gray-100/80">
          {history.length > 0 ? (
            history.map((log) => {
              const isCredit = log.type === 'credit';
              return (
                <div key={log._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-xl transition">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#0F172A]">{log.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-[#0F172A]'}`}>
                    {isCredit ? '+' : '-'}₹{(Math.abs(log.amount) / 100).toFixed(2)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">No transactions recorded yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
