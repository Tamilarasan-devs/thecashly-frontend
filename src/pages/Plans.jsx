import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, fetchUser } = useAuth();
  const [purchasing, setPurchasing] = useState(null);
  const [message, setMessage] = useState('');
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

      <div className="flex flex-col space-y-4">
        {plans.map((plan) => (
          <ProductCard 
            key={plan._id} 
            plan={plan} 
            isPurchasing={purchasing === plan._id} 
            onPurchase={handlePurchase} 
          />
        ))}
      </div>
    </div>
  );
};

export default Plans;
