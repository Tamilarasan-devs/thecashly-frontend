import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, AlertCircle, Sparkles, Clock, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, fetchUser } = useAuth();
  const [purchasing, setPurchasing] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('normal'); // 'normal' | 'special' | 'coming_soon'
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (plan) => {
    setMessage('');

    if (plan.status === 'hidden' || plan.status === 'draft') {
      setMessage('This plan is currently hidden and locked.');
      return;
    }

    if (plan.isComingSoon || plan.planType === 'coming_soon') {
      setMessage('This plan is coming soon and cannot be purchased yet.');
      return;
    }

    // Client side check
    if (user.walletBalance < plan.initialPayment) {
      setMessage(`Insufficient wallet balance. You need ₹${((plan.initialPayment - user.walletBalance) / 100).toFixed(2)} more to buy ${plan.name}.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to purchase the ${plan.name} plan for ₹${(plan.initialPayment / 100).toFixed(2)}?`)) {
      return;
    }

    setPurchasing(plan._id);
    try {
      const res = await api.post('/payments/purchase', { planId: plan._id });
      if (res.data.success) {
        setMessage('Product purchased successfully!');
        await fetchUser();
        // Redirect or refresh after success
        setTimeout(() => navigate('/services/my-products'), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to purchase product');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) return null;

  const normalPlans = plans.filter(p => !p.isSpecial && !p.isComingSoon && p.planType !== 'special' && p.planType !== 'coming_soon');
  const specialPlans = plans.filter(p => p.isSpecial || p.planType === 'special');
  const comingSoonPlans = plans.filter(p => p.isComingSoon || p.planType === 'coming_soon');

  const filteredPlans = 
    activeTab === 'special' 
      ? specialPlans 
      : activeTab === 'coming_soon' 
        ? comingSoonPlans 
        : normalPlans;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#0F172A]">Premium Products</h1>
        <p className="mt-2 text-sm text-[#64748B]">Purchase a product to start earning daily scheduled returns.</p>
      </div>

      <div className="flex items-center justify-between rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
        <div>
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Available Balance</p>
          <p className="text-[28px] font-extrabold text-[#0F172A] leading-none">₹{(user?.walletBalance / 100 || 0).toFixed(2)}</p>
        </div>
        <Link to="/add-cash" className="flex items-center space-x-1 rounded-2xl bg-[#4A3AFF] px-5 py-3 text-xs font-extrabold text-white hover:opacity-90 shadow-lg shadow-[#4A3AFF]/30 transition-all">
          <PlusCircle size={16} strokeWidth={3} />
          <span>Add Cash</span>
        </Link>
      </div>

      {/* Category Tabs: Normal, Special, Coming Soon */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100/90 rounded-2xl shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('normal')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'normal'
              ? 'bg-white text-[#0F172A] shadow-md shadow-gray-200/60 scale-[1.02]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package size={14} className={activeTab === 'normal' ? 'text-[#4A3AFF]' : ''} />
          <span>Normal ({normalPlans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('special')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'special'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
              : 'text-gray-500 hover:text-amber-600'
          }`}
        >
          <Sparkles size={14} />
          <span>Special ({specialPlans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coming_soon')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'coming_soon'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
              : 'text-gray-500 hover:text-orange-600'
          }`}
        >
          <Clock size={14} />
          <span>Coming Soon ({comingSoonPlans.length})</span>
        </button>
      </div>

      {message && (
        <div className={`rounded-xl p-4 text-sm font-semibold flex flex-col sm:flex-row justify-between items-start sm:items-center ${message.includes('success') ? 'bg-[#E6F7ED] text-[#10B981]' : 'bg-[#FFF1F2] text-[#F43F5E]'}`}>
          <div className="flex items-center space-x-2">
            {!message.includes('success') && <AlertCircle size={18} />}
            <span>{message}</span>
          </div>
          {!message.includes('success') && message.includes('Insufficient') && (
            <Link to="/add-cash" className="mt-2 sm:mt-0 underline font-bold whitespace-nowrap">
              Add Cash Now
            </Link>
          )}
        </div>
      )}

      {filteredPlans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500 font-medium text-sm">No plans found in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {filteredPlans.map((plan) => (
            <ProductCard 
              key={plan._id} 
              plan={plan} 
              isPurchasing={purchasing === plan._id} 
              onPurchase={handlePurchase} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
