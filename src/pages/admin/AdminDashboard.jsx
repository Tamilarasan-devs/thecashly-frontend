import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../lib/axios';
import { Users, Banknote, ShieldAlert, Zap } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    pendingWithdrawals: 0
  });
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      }
    };
    
    fetchStats();
  }, []);

  const triggerPayouts = async () => {
    setTriggering(true);
    try {
      const res = await api.post('/admin/trigger-payouts');
      alert(`Success! Processed ${res.data.processedCount} payouts.`);
    } catch (err) {
      alert('Failed to trigger payouts');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-1 font-medium">Here's what's happening with Cashly today.</p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Users</p>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Deposits</p>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">₹{((stats.totalDeposits || 0) / 100).toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <Banknote size={24} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Active Plans</p>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{stats.activePlans}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm shrink-0">
              <Banknote size={24} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Withdraw</p>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{stats.pendingWithdrawals}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
              <ShieldAlert size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mb-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-extrabold text-white mb-2">Manual Actions</h2>
          <p className="text-gray-400 text-sm font-medium max-w-md">Need to force process daily returns? You can manually trigger the daily payouts for all active subscriptions.</p>
        </div>
        <button
          onClick={triggerPayouts}
          disabled={triggering}
          className="relative z-10 flex items-center justify-center space-x-2 rounded-xl bg-[#4A3AFF] px-6 py-4 font-bold text-white shadow-[0_8px_20px_rgba(74,58,255,0.3)] transition hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(74,58,255,0.4)] disabled:opacity-50 disabled:hover:translate-y-0 w-full md:w-auto"
        >
          <Zap size={20} className={triggering ? 'animate-pulse' : ''} />
          <span>{triggering ? 'Processing Payouts...' : 'Run Daily Payouts Now'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
