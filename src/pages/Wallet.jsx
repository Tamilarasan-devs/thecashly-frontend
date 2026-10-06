import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, ArrowDownToLine, History } from 'lucide-react';

const Wallet = () => {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/withdrawals');
      setWithdrawals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    try {
      const res = await api.post('/withdrawals/request', { amount: Number(amount) * 100 });
      if (res.data.success) {
        setMessage({ text: 'Withdrawal requested successfully', type: 'success' });
        setAmount('');
        fetchWithdrawals();
        // Ideally we would update the user context balance here too
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Withdrawal failed', type: 'error' });
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">My Wallet</h1>
      </div>

      <div className="bg-gradient-to-r from-[#4481eb] to-[#04befe] rounded-2xl p-8 text-[#0F172A] shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">Available to Withdraw</p>
            <h2 className="mt-2 text-4xl font-bold">₹{(user?.earningBalance / 100 || 0).toFixed(2)}</h2>
          </div>
          <WalletIcon size={48} className="opacity-50" />
        </div>
      </div>

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6">
        <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold text-[#0F172A]">
          <ArrowDownToLine size={20} />
          <span>Request Payout</span>
        </h3>
        
        {message.text && (
          <div className={`mb-4 rounded p-3 text-sm font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleWithdrawalRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A]">Amount (₹)</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 py-3 pl-4 pr-12 focus:border-[#4A3AFF] focus:outline-none focus:ring-1 focus:ring-[#4A3AFF]"
                placeholder="0.00"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-gray-400">INR</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#4A3AFF] py-3 font-semibold text-white shadow-md transition hover:bg-[#64748B]"
          >
            Submit Request
          </button>
        </form>
        <p className="mt-3 text-xs text-[#64748B]">
          Ensure your payout details are updated in your Profile before requesting a withdrawal.
        </p>
      </div>

      <div>
        <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold text-[#0F172A]">
          <History size={20} />
          <span>Withdrawal History</span>
        </h3>
        
        {withdrawals.length > 0 ? (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal._id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div>
                  <p className="font-semibold text-[#0F172A]">₹{(withdrawal.amount / 100).toFixed(2)}</p>
                  <p className="text-xs text-[#64748B]">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  withdrawal.status === 'paid' ? 'bg-green-100 text-green-700' :
                  withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {withdrawal.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center">
            <p className="text-sm text-[#64748B]">No withdrawals requested yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
