import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import { ArrowLeft, Package, CheckCircle2 } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchUser } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get('/plans');
        const foundPlan = res.data.data.find(p => p._id === id);
        if (foundPlan) {
          setPlan(foundPlan);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handlePurchase = async () => {
    if (user.walletBalance < plan.initialPayment) {
      alert(`Insufficient wallet balance. You need ₹${((plan.initialPayment - user.walletBalance) / 100).toFixed(2)} more to buy ${plan.name}.`);
      navigate('/add-cash');
      return;
    }

    if (!window.confirm(`Are you sure you want to purchase the ${plan.name} plan for ₹${(plan.initialPayment / 100).toFixed(2)}?`)) {
      return;
    }

    setPurchasing(true);
    try {
      const res = await api.post('/payments/purchase', { planId: plan._id });
      if (res.data.success) {
        alert('Product purchased successfully!');
        await fetchUser();
        navigate('/services/my-products');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to purchase product');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return null;
  if (!plan) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header Image Area */}
      <div className="relative h-72 w-full bg-gradient-to-br from-[#E0D8FF] to-[#F4F2FF] rounded-b-[40px] shadow-sm overflow-hidden flex items-center justify-center">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-5 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center shadow-sm text-[#0F172A]"
        >
          <ArrowLeft size={20} />
        </button>
        
        {plan.productImage?.url ? (
          <img src={plan.productImage.url} alt={plan.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
        ) : (
          <Package size={80} className="text-[#6C5DD3]" opacity={0.5} />
        )}
      </div>

      {/* Details Container */}
      <div className="px-5 pt-6 relative z-10 -mt-10">
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="inline-block px-3 py-1 bg-[#FBBF24] text-[#0F172A] text-[10px] font-black uppercase rounded-full mb-2">🔥 Hot Plan</div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] leading-tight">{plan.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#64748B] font-bold">Investment</p>
              <h2 className="text-2xl font-black text-[#4A3AFF]">₹{(plan.initialPayment / 100).toFixed(0)}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-5 border-y border-gray-100 mt-2 mb-5">
            <div>
              <p className="text-xs text-[#64748B] font-bold mb-0.5">Daily Return</p>
              <p className="text-lg font-extrabold text-[#10B981]">₹{(plan.dailyAmount / 100).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-bold mb-0.5">Duration</p>
              <p className="text-lg font-extrabold text-[#0F172A]">{plan.durationDays} Days</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-bold mb-0.5">Total Returns Expected</p>
              <p className="text-lg font-extrabold text-[#4A3AFF]">₹{(plan.totalScheduled / 100).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-bold mb-0.5">Purchase Limit</p>
              <p className="text-lg font-extrabold text-[#0F172A]">2 times</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] mb-3">Plan Benefits</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-sm text-[#475569] font-medium leading-relaxed">Guaranteed daily returns directly credited to your wallet</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-sm text-[#475569] font-medium leading-relaxed">Fast withdrawals without hidden fees</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-sm text-[#475569] font-medium leading-relaxed">24/7 dedicated customer support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="fixed bottom-20 left-5 right-5 z-20 sm:static sm:mt-6 sm:bottom-auto">
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] py-4 text-sm font-black text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition hover:opacity-90 disabled:opacity-50"
          >
            {purchasing ? 'Processing Investment...' : `Invest ₹${(plan.initialPayment / 100).toFixed(0)} Now`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
