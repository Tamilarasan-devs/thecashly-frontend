import React, { useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Wallet, ShieldCheck, Clock } from 'lucide-react';

const AddCash = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleTopUp = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) {
      setStatusMsg({ text: 'Minimum top-up amount is ₹100', type: 'error' });
      return;
    }
    if (numAmount > 100000) {
      setStatusMsg({ text: 'Maximum top-up amount is ₹100,000', type: 'error' });
      return;
    }

    setProcessing(true);
    try {
      // 1. Initialize top up
      const initRes = await api.post('/topups/init', { amount: numAmount * 100 });

      if (initRes.data.success) {
        // 2. Simulate Sandbox Gateway Webhook Verification
        const verifyRes = await api.post('/topups/verify-sandbox', {
          topUpId: initRes.data.data.topUpId,
          status: 'success',
          gatewayReference: 'SANDBOX_REF_' + Date.now()
        });

        if (verifyRes.data.success) {
          setStatusMsg({ text: 'Wallet credited successfully via Sandbox!', type: 'success' });
          setAmount('');
          // In a real app, you would force a context reload of the user's balance here.
          // Because user state is loaded on page load, a reload or re-fetch is ideal.
          setTimeout(() => window.location.reload(), 1500);
        }
      }
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.error || err.message, type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">Add Cash</h1>
        <p className="mt-2 text-sm text-[#64748B]">Top up your wallet to purchase products.</p>
      </div>

      {/* Current Balance */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-blue-50 p-3 text-blue-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Balance</p>
            <p className="text-2xl font-bold text-[#0F172A]">₹{(user?.walletBalance / 100 || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Top Up Form */}
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6">
        <div className="mb-6 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex space-x-3">
            <ShieldCheck className="text-yellow-600 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-yellow-800">Sandbox Mode Active</h4>
              <p className="mt-1 text-xs text-yellow-700">
                You are currently in development mode. No real money will be charged. Payments simulate an immediate successful webhook.
              </p>
            </div>
          </div>
        </div>

        {statusMsg.text && (
          <div className={`mb-6 rounded-lg p-4 text-sm font-semibold ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleTopUp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#0F172A]">Enter Amount (₹)</label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-semibold">₹</span>
              <input
                type="number"
                min="100"
                max="100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 py-4 pl-10 pr-4 text-lg font-bold text-[#0F172A] focus:border-[#4A3AFF] focus:outline-none focus:ring-1 focus:ring-[#4A3AFF]"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Quick Select</p>
            <div className="grid grid-cols-4 gap-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`rounded-lg border py-2 text-sm font-medium transition ${Number(amount) === amt
                      ? 'border-[#4A3AFF] bg-[#4A3AFF] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={processing || !amount}
            className="bg-gradient-to-r from-[#4481eb] to-[#04befe] flex w-full items-center justify-center space-x-2 rounded-xl py-4 font-bold text-[#0F172A] shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            {processing ? (
              <>
                <Clock size={20} className="animate-spin" />
                <span>Processing Sandbox Payment...</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                <span>Proceed to Pay ₹{amount || '0'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCash;
