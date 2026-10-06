import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Package, Star, Calendar, ArrowRight, Hexagon, IndianRupee, TrendingUp } from 'lucide-react';

const MyProducts = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUser } = useAuth();

  const fetchSubs = () => {
    api.get('/payments/subscriptions').then(res => {
      setSubs(res.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleCollect = async (subId) => {
    try {
      const res = await api.post(`/payments/subscriptions/${subId}/collect`);
      if (res.data.success) {
        alert(`Successfully collected ₹${(res.data.amount / 100).toFixed(2)}`);
        await fetchUser(); // Refresh global wallet balance
        fetchSubs(); // Refresh local list
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to collect earnings');
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 max-w-md mx-auto pb-32">
      <div className="mb-6 px-1">
        <h1 className="text-3xl font-bold text-[#0F172A]">My Products</h1>
        <p className="mt-2 text-sm text-[#64748B]">Manage your active subscriptions and collect daily returns.</p>
      </div>

      {subs.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <p className="text-[#64748B] font-medium">You don't have any active plans yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {subs.map(sub => (
            <div key={sub._id} className="rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white border border-gray-100">
              {/* The Gradient Header */}
              <div className="bg-gradient-to-r from-[#4481eb] to-[#04befe] px-4 pt-5 pb-9 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center shadow-md">
                    <Star size={16} fill="white" className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-[17px]">
                    {sub.status === 'active' ? 'Active Plan' : 'Completed Plan'}
                  </h3>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm ${sub.status === 'active' ? 'bg-[#10B981]' : 'bg-gray-400'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                  <span className="text-white text-[10px] font-extrabold tracking-wider uppercase">{sub.status}</span>
                </div>
              </div>

              {/* The White Overlapping Body Card */}
              <div className="relative z-10 mx-1.5 mb-1.5 -mt-5 bg-white rounded-[24px] p-5 shadow-[0_5px_15px_rgb(0,0,0,0.05)] border border-gray-50">
                
                {/* Product Info */}
                <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                  <div className="w-[72px] h-[72px] bg-gradient-to-br from-[#E0D8FF] to-[#F4F2FF] rounded-[20px] flex items-center justify-center relative shadow-inner border border-white overflow-visible">
                    {sub.plan?.productImage?.url ? (
                      <img src={sub.plan.productImage.url} alt={sub.planSnapshot.name} className="w-full h-full object-cover rounded-[18px] mix-blend-multiply" />
                    ) : (
                      <div className="w-[36px] h-[36px] bg-[#6C5DD3] rounded-md rotate-45 flex items-center justify-center relative shadow-sm">
                        <div className="absolute inset-0 bg-black/10 rounded-md"></div>
                      </div>
                    )}
                    <span className="absolute -bottom-2 -left-0 right-0 mx-auto w-fit bg-[#FBBF24] text-[9px] font-black text-[#0F172A] px-2 py-0.5 rounded shadow-sm border-2 border-white uppercase z-10">
                      NEW
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-[#0F172A] leading-tight mb-0.5">{sub.planSnapshot.name}</h4>
                    <p className="text-xs text-[#94A3B8] font-medium">Started on {new Date(sub.startDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Overall Details */}
                <div className="pt-5 pb-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col items-center flex-1 border-r border-gray-100">
                    <p className="text-[11px] text-[#64748B] font-bold mb-1">Total Earned</p>
                    <p className="font-extrabold text-[#10B981] text-[17px]">₹{(sub.collectedAmount / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 border-r border-gray-100">
                    <p className="text-[11px] text-[#64748B] font-bold mb-1">Expected</p>
                    <p className="font-extrabold text-[#4A3AFF] text-[17px]">₹{(sub.planSnapshot.totalScheduled / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <p className="text-[11px] text-[#64748B] font-bold mb-1">Days Left</p>
                    <p className="font-extrabold text-[#0F172A] text-[17px]">{sub.totalDays - sub.collectedDays}</p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="pt-5 flex flex-col gap-5">
                  <div className="flex items-center justify-between px-1">
                    {/* Daily Return */}
                    <div className="flex items-center gap-2">
                      <div className="w-[28px] h-[28px] rounded-full bg-[#FBBF24] flex items-center justify-center shadow-sm shrink-0">
                        <span className="text-white text-[13px] font-bold">₹</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-bold mb-0.5">Daily Return</p>
                        <p className="font-extrabold text-[#10B981] text-[16px] leading-none">₹{(sub.planSnapshot.dailyAmount / 100).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Ends On */}
                    <div className="flex items-center gap-2">
                      <div className="w-[28px] h-[28px] flex items-center justify-center text-[#3B82F6] shrink-0">
                        <Calendar size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-bold mb-0.5">Ends On</p>
                        <p className="font-extrabold text-[#0F172A] text-[15px] leading-none">{new Date(sub.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {sub.status === 'active' ? (
                    <button 
                      onClick={() => handleCollect(sub._id)}
                      disabled={!sub.eligibleAmount || sub.eligibleAmount <= 0}
                      className={`w-full py-3.5 rounded-2xl text-[13px] font-extrabold flex items-center justify-center gap-2 transition-all mt-1 ${
                        sub.eligibleAmount > 0
                          ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:opacity-90'
                          : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                      }`}
                    >
                      {sub.eligibleAmount > 0 ? `Claim ₹${(sub.eligibleAmount / 100).toFixed(2)} Now` : 'No Earnings Yet'}
                      {sub.eligibleAmount > 0 && <ArrowRight size={16} strokeWidth={3} />}
                    </button>
                  ) : (
                    <div className="w-full bg-[#F1F5F9] text-[#64748B] py-3.5 rounded-2xl text-[13px] font-extrabold flex items-center justify-center text-center mt-1">
                      Plan Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
