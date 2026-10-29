import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import { ArrowLeft, Package, CheckCircle2, Star, Clock, AlertTriangle, Lock, EyeOff } from 'lucide-react';

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
    if (plan.status === 'hidden' || plan.status === 'draft') {
      alert('This plan is currently hidden and locked.');
      return;
    }

    if (plan.isComingSoon || plan.planType === 'coming_soon') {
      alert('This plan is coming soon and cannot be purchased yet.');
      return;
    }

    if (user.walletBalance < plan.initialPayment) {
      alert(`Insufficient wallet balance. You need ₹${((plan.initialPayment - user.walletBalance) / 100).toFixed(2)} more to buy ${plan.name}.`);
      navigate(`/add-cash?planId=${plan._id}&amount=${plan.initialPayment / 100}`);
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

  const isComingSoon = plan.isComingSoon || plan.planType === 'coming_soon';
  const isSpecial = plan.isSpecial || plan.planType === 'special';
  const isHidden = plan.status === 'hidden' || plan.status === 'draft';

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header Image Area */}
      <div className={`relative h-72 w-full rounded-b-[40px] shadow-sm overflow-hidden flex items-center justify-center ${
        isSpecial 
          ? 'bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#FDE047]' 
          : isComingSoon 
            ? 'bg-gradient-to-br from-[#F1F5F9] to-[#CBD5E1]' 
            : 'bg-gradient-to-br from-[#E0D8FF] to-[#F4F2FF]'
      }`}>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-5 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm text-[#0F172A] hover:bg-white transition"
        >
          <ArrowLeft size={20} />
        </button>
        
        {plan.productImage?.url ? (
          <img 
            src={plan.productImage.url} 
            alt={plan.name} 
            className={`w-full h-full object-cover ${isComingSoon ? 'opacity-80 grayscale-[20%]' : 'opacity-100'}`} 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${plan.productImage?.url ? 'hidden' : ''}`}>
          <Package 
            size={80} 
            className={isSpecial ? "text-amber-600" : isComingSoon ? "text-slate-400" : "text-[#6C5DD3]"} 
            opacity={0.6} 
          />
        </div>
      </div>

      {/* Details Container */}
      <div className="px-5 pt-6 relative z-10 -mt-10">
        <div className={`relative overflow-hidden bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border ${
          isHidden 
            ? 'border-amber-200' 
            : isSpecial 
              ? 'border-amber-300 ring-1 ring-amber-200/50' 
              : isComingSoon 
                ? 'border-slate-200' 
                : 'border-gray-100'
        }`}>
          {/* Hidden Blur Overlay */}
          {isHidden && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-[8px] p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center text-amber-300 shadow-xl mb-3">
                <Lock size={26} className="stroke-[2.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider mb-2">
                <EyeOff size={13} />
                <span>Hidden / Locked Plan</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{plan.name}</h2>
              <p className="text-xs text-slate-300 font-medium mt-1.5 max-w-xs">
                This plan is currently hidden & locked by the administrator. It will become visible and unlock when turned on.
              </p>
            </div>
          )}

          <div className={`transition-all ${isHidden ? 'filter blur-[6px] opacity-40 select-none pointer-events-none' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                {isComingSoon ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase rounded-full mb-2 shadow-sm tracking-wide">
                    <Clock size={12} className="stroke-[3]" />
                    <span>{plan.badgeText || '⏳ Coming Soon'}</span>
                  </div>
                ) : isSpecial ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-[10px] font-black uppercase rounded-full mb-2 shadow-md shadow-amber-500/20 tracking-wide">
                    <Star size={12} fill="currentColor" />
                    <span>{plan.badgeText || '⭐ Special Plan'}</span>
                  </div>
                ) : (
                  <div className="inline-block px-3 py-1 bg-[#FBBF24] text-[#0F172A] text-[10px] font-black uppercase rounded-full mb-2">
                    {plan.badgeText || '🔥 Hot Plan'}
                  </div>
                )}
                <h1 className="text-2xl font-extrabold text-[#0F172A] leading-tight flex items-center gap-2">
                  {plan.name}
                  {isSpecial && <span className="text-amber-500 text-lg">✨</span>}
                </h1>
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
                  <span className="text-sm text-[#475569] font-medium leading-relaxed">
                    {isSpecial ? 'Exclusive VIP daily return rate credited directly to wallet' : 'Guaranteed daily returns directly credited to your wallet'}
                  </span>
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
        </div>

        {/* Action Bottom */}
        <div className="fixed bottom-20 left-5 right-5 z-20 sm:static sm:mt-6 sm:bottom-auto">
          {isHidden ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-700/80 p-4 shadow-xl text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-extrabold text-sm">
                <Lock size={16} className="stroke-[2.5]" />
                <span>Product Hidden & Locked</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Subscriptions and details will unlock when this plan is turned on.
              </p>
              <button
                type="button"
                disabled
                className="w-full rounded-2xl bg-slate-800 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wider cursor-not-allowed border border-slate-700 flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                <span>Locked Product</span>
              </button>
            </div>
          ) : isComingSoon ? (
            <div className="rounded-2xl bg-white border border-orange-200/80 p-4 shadow-lg text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-orange-600 font-extrabold text-sm">
                <Clock size={16} className="stroke-[2.5]" />
                <span>Plan Launching Soon</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                This plan is scheduled for upcoming release. Subscriptions will unlock shortly!
              </p>
              <button
                type="button"
                disabled
                className="w-full rounded-2xl bg-slate-200 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wider cursor-not-allowed"
              >
                Registration Opens Soon
              </button>
            </div>
          ) : isSpecial ? (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 py-4 text-sm font-black text-white shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Star size={16} fill="currentColor" />
              <span>{purchasing ? 'Processing Special Investment...' : `Invest ₹${(plan.initialPayment / 100).toFixed(0)} in Special Plan`}</span>
            </button>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] py-4 text-sm font-black text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition hover:opacity-90 disabled:opacity-50"
            >
              {purchasing ? 'Processing Investment...' : `Invest ₹${(plan.initialPayment / 100).toFixed(0)} Now`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
