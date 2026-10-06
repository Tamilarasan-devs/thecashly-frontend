import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Eye, Wallet, Package, Calendar, ArrowRight, Star, Rocket } from 'lucide-react';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [purchasing, setPurchasing] = useState(null);

  const fetchData = async () => {
    try {
      const [subsRes, plansRes] = await Promise.all([
        api.get('/payments/subscriptions'),
        api.get('/plans')
      ]);
      
      if (subsRes.data.data.length > 0) {
        setActiveSub(subsRes.data.data[0]);
      }
      setPlans(plansRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchData();
  }, []);

  const handlePurchase = async (plan) => {
    // Client side check
    if (user.walletBalance < plan.initialPayment) {
      alert(`Insufficient wallet balance. You need ₹${((plan.initialPayment - user.walletBalance) / 100).toFixed(2)} more to buy ${plan.name}.`);
      navigate('/add-cash');
      return;
    }

    if (!window.confirm(`Are you sure you want to purchase the ${plan.name} plan for ₹${(plan.initialPayment / 100).toFixed(2)}?`)) {
      return;
    }

    setPurchasing(plan._id);
    try {
      const res = await api.post('/payments/purchase', { planId: plan._id });
      if (res.data.success) {
        alert('Product purchased successfully!');
        await fetchUser();
        await fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to purchase product');
    } finally {
      setPurchasing(null);
    }
  };

  const handleCollect = async (id) => {
    try {
      const res = await api.post(`/payments/subscriptions/${id}/collect`);
      if (res.data.success) {
        // Refresh everything to reflect the new balance and updated plan numbers
        await fetchUser();
        await fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to collect earnings');
    }
  };


  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-36 font-sans overflow-x-hidden">
      
      {/* Top Header Background Illustration area */}
      <div className="absolute top-0 left-0 right-0 h-64 z-0 rounded-b-[40px] overflow-hidden bg-gradient-to-br from-[#FFFDF0] via-[#E8F8ED] to-[#DDF1FA]">
        {/* Abstract shapes to mimic the illustration's colors and depth */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 w-48 h-48 bg-yellow-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 px-5 pt-6 space-y-7">
        
        {/* Top Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm pr-4 pl-1.5 py-1.5 rounded-full shadow-sm border border-white/60">
            <div className="w-8 h-8 bg-[#4A3AFF] rounded-[10px] flex items-center justify-center shadow-md">
              <Wallet size={18} className="text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Cashly</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_2px_15px_rgb(0,0,0,0.06)] border border-gray-100 text-gray-700">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_2px_15px_rgb(0,0,0,0.06)] border border-gray-100 text-[#4A3AFF]">
              <User size={20} fill="currentColor" />
            </button>
          </div>
        </header>

        {/* Greeting */}
        <div className="pt-2 pb-2">
          <h2 className="text-[22px] font-extrabold text-[#0F172A] flex items-center gap-2 tracking-tight">
            Hello, {user?.name.split(' ')[0]} <span className="text-2xl">👋</span>
          </h2>
          <p className="text-[13px] text-[#475569] font-semibold mt-1">Welcome back to Cashly</p>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-[24px] p-6 shadow-[0_15px_35px_rgba(74,58,255,0.25)] bg-gradient-to-br from-[#533df5] to-[#2563EB]">
          {/* Wave decor for Balance Card */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
            <div className="absolute right-[-10%] top-[-30%] w-[80%] h-[150%] bg-gradient-to-b from-white/20 to-transparent rounded-full rotate-[15deg] blur-sm"></div>
            <div className="absolute bottom-[-50%] left-[-10%] w-[60%] h-[100%] bg-white/10 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-white/90 mb-1">
                  <p className="text-sm font-medium">Wallet Balance</p>
                  <Eye size={16} className="opacity-80" />
                </div>
                <h2 className="text-[32px] font-extrabold text-white leading-tight tracking-tighter shadow-sm">
                  ₹{(user?.walletBalance / 100 || 0).toFixed(2)}
                </h2>
              </div>
              
              <Link to="/add-cash" className="flex flex-col items-center justify-center group relative z-20">
                <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:bg-white transition-all mb-1">
                  <Wallet size={20} className="text-[#4A3AFF]" fill="currentColor" />
                </div>
                <span className="text-white text-[10px] font-bold">Add Cash</span>
              </Link>
            </div>

            <div className="border-t border-white/20 pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">Earning Balance</p>
                <h2 className="text-[24px] font-extrabold text-white leading-tight shadow-sm">
                  ₹{(user?.earningBalance / 100 || 0).toFixed(2)}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-white shadow-sm px-2 py-1 rounded-full">
                  <span className="text-[#10B981] text-[10px] font-bold tracking-wide">+ ₹{((activeSub?.eligibleAmount || 0) / 100).toFixed(2)} today</span>
                </div>
                <Link to="/wallet" className="flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl px-3 py-1.5 transition-all border border-white/30">
                  <span className="text-white text-[11px] font-bold">Withdraw</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-2 bg-white p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
          <Link to="/add-cash" className="flex flex-col items-center gap-2 text-center">
            <div className="w-[52px] h-[52px] rounded-[18px] bg-[#E6F7ED] flex items-center justify-center text-[#10B981]">
              <Wallet size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0F172A]">Add Cash</p>
              <p className="text-[9px] text-[#64748B] font-medium leading-tight mt-0.5">Fund your wallet</p>
            </div>
          </Link>
          <Link to="/plans" className="flex flex-col items-center gap-2 text-center">
            <div className="w-[52px] h-[52px] rounded-[18px] bg-[#F4F2FF] flex items-center justify-center text-[#6C5DD3]">
              <Package size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0F172A]">Products</p>
              <p className="text-[9px] text-[#64748B] font-medium leading-tight mt-0.5">Explore & Invest</p>
            </div>
          </Link>
          <Link to="/services" className="flex flex-col items-center gap-2 text-center">
            <div className="w-[52px] h-[52px] rounded-[18px] bg-[#FFF1F2] flex items-center justify-center text-[#F43F5E]">
              <Calendar size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0F172A]">Services</p>
              <p className="text-[9px] text-[#64748B] font-medium leading-tight mt-0.5">Get Support</p>
            </div>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-2 text-center">
            <div className="w-[52px] h-[52px] rounded-[18px] bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
              <User size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0F172A]">Profile</p>
              <p className="text-[9px] text-[#64748B] font-medium leading-tight mt-0.5">Manage Account</p>
            </div>
          </Link>
        </div>

        {/* Your Active Plan Card */}
        {activeSub && (
          <div className="rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white border border-gray-100 mt-4">
            {/* The Gradient Header */}
            <div className="bg-gradient-to-r from-[#4481eb] to-[#04befe] px-4 pt-5 pb-9 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center shadow-md">
                  <Star size={16} fill="white" className="text-white" />
                </div>
                <h3 className="text-white font-bold text-[17px]">Your Active Plan</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-[#10B981] px-3 py-1.5 rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                <span className="text-white text-[10px] font-extrabold tracking-wider">ACTIVE</span>
              </div>
            </div>

            {/* The White Overlapping Body Card */}
            <div className="relative z-10 mx-1.5 mb-1.5 -mt-5 bg-white rounded-[24px] p-5 shadow-[0_5px_15px_rgb(0,0,0,0.05)] border border-gray-50">
              
              {/* Product Info */}
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="w-[72px] h-[72px] bg-gradient-to-br from-[#E0D8FF] to-[#F4F2FF] rounded-[20px] flex items-center justify-center relative shadow-inner border border-white overflow-visible">
                  {activeSub.plan?.productImage?.url ? (
                    <img src={activeSub.plan.productImage.url} alt={activeSub.planSnapshot.name} className="w-full h-full object-cover rounded-[18px] mix-blend-multiply" />
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
                  <h4 className="text-xl font-extrabold text-[#0F172A] leading-tight mb-0.5">{activeSub.planSnapshot.name}</h4>
                  <p className="text-xs text-[#94A3B8] font-medium">Started on {new Date(activeSub.startDate).toLocaleDateString()}</p>
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
                      <p className="font-extrabold text-[#10B981] text-[16px] leading-none">₹{(activeSub.planSnapshot.dailyAmount / 100).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Ends On */}
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] flex items-center justify-center text-[#3B82F6] shrink-0">
                      <Calendar size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#64748B] font-bold mb-0.5">Ends On</p>
                      <p className="font-extrabold text-[#0F172A] text-[15px] leading-none">{new Date(activeSub.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => {
                    if(activeSub.eligibleAmount > 0) {
                      handleCollect(activeSub._id);
                    } else {
                      navigate('/services/my-products');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-[#533df5] to-[#2563EB] text-white py-3.5 rounded-2xl text-[13px] font-extrabold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:opacity-90 transition-all mt-1"
                >
                  View Details
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Promo Banner */}
        <div className="rounded-[24px] p-5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-gradient-to-r from-[#FFD3A5] via-[#FD6585] to-[#FFD3A5] mt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 blur-xl"></div>
          <div className="relative z-10 flex-1 pr-4">
            <h3 className="text-[#0F172A] font-extrabold text-[17px] flex items-center gap-1.5 tracking-tight">
              Earn Daily, Grow Fast <Rocket size={18} className="text-[#0F172A]" fill="currentColor" />
            </h3>
            <p className="text-[#0F172A]/80 text-[11px] font-bold leading-relaxed mt-1">
              Collect your daily returns and watch your balance grow!
            </p>
          </div>
          <Link to="/plans" className="relative z-10 bg-white text-[#FD6585] px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1 hover:scale-105 transition">
            View Plan <ArrowRight size={12} strokeWidth={3} />
          </Link>
        </div>

        {/* Color Game Promo Banner */}
        <div className="rounded-[24px] p-5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#7C3AED] mt-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 blur-xl"></div>
          <div className="relative z-10 flex-1 pr-4">
            <h3 className="text-white font-extrabold text-[17px] flex items-center gap-1.5 tracking-tight">
              Color Prediction <Star size={18} fill="currentColor" className="text-yellow-300" />
            </h3>
            <p className="text-white/80 text-[11px] font-bold leading-relaxed mt-1">
              Win 3x your demo points every 60 seconds!
            </p>
          </div>
          <Link to="/games" className="relative z-10 bg-white text-[#7C3AED] px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1 hover:scale-105 transition">
            Play Now <ArrowRight size={12} strokeWidth={3} />
          </Link>
        </div>

        {/* Available Products */}
        <div className="pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Explore Products</h3>
            <Link to="/plans" className="text-[#4A3AFF] text-xs font-bold flex items-center gap-0.5">
              See All <ArrowRight size={14} />
            </Link>
          </div>
          
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

      </div>
    </div>
  );
};

export default Home;
