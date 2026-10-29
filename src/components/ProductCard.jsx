import React from 'react';
import { Package, Star, Clock, Lock, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ plan, isPurchasing, onPurchase }) => {
  const navigate = useNavigate();

  const isComingSoon = plan.isComingSoon || plan.planType === 'coming_soon';
  const isSpecial = plan.isSpecial || plan.planType === 'special';
  const isHidden = plan.status === 'hidden' || plan.status === 'draft';

  return (
    <div 
      onClick={() => {
        if (!isHidden) navigate(`/plans/${plan._id}`);
      }}
      className={`relative flex w-full overflow-hidden rounded-xl border bg-white shadow-sm transition ${
        isHidden 
          ? 'border-slate-300 bg-slate-900/5 cursor-default'
          : isSpecial 
            ? 'border-amber-300 ring-1 ring-amber-200/60 shadow-amber-50/50 hover:shadow-md cursor-pointer' 
            : isComingSoon 
              ? 'border-slate-200 bg-slate-50/40 hover:shadow-md cursor-pointer' 
              : 'border-gray-100 hover:shadow-md cursor-pointer'
      }`}
    >
      {/* Hidden / Blur Overlay */}
      {isHidden && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[7px] p-3 text-center transition-all animate-fadeIn"
        >
          <div className="relative mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/25 to-indigo-500/25 border border-white/30 flex items-center justify-center text-amber-300 shadow-lg">
              <Lock size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider mb-1">
            <EyeOff size={11} />
            <span>Hidden Plan</span>
          </div>
          <h3 className="text-xs font-black text-white px-3 truncate max-w-[260px] tracking-tight">{plan.name}</h3>
          <p className="text-[10px] text-slate-300 font-medium mt-0.5">
            Locked by admin • Will show when turned on
          </p>
        </div>
      )}

      {/* Main Card Content (blurred if hidden) */}
      <div className={`flex w-full ${isHidden ? 'filter blur-[6px] opacity-40 select-none pointer-events-none' : ''}`}>
        
        {/* Badge */}
        <div className="absolute right-2 top-2 z-10">
          {isComingSoon ? (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm tracking-wide">
              <Clock size={10} className="stroke-[3]" />
              <span>{plan.badgeText || 'COMING SOON'}</span>
            </div>
          ) : isSpecial ? (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-[0_2px_8px_rgba(245,158,11,0.4)] tracking-wide">
              <Star size={10} fill="currentColor" />
              <span>{plan.badgeText || 'SPECIAL PLAN'}</span>
            </div>
          ) : (
            <div className="rounded border border-gray-200 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">
              {plan.badgeText || '🔥 HOT'}
            </div>
          )}
        </div>

        {/* Left Image */}
        <div className={`relative w-[35%] shrink-0 overflow-hidden ${
          isSpecial 
            ? 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]' 
            : isComingSoon 
              ? 'bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]' 
              : 'bg-gradient-to-br from-[#E0D8FF] to-[#F4F2FF]'
        }`}>
          {plan.productImage?.url ? (
            <img 
              src={plan.productImage.url} 
              alt={plan.name} 
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isComingSoon ? 'opacity-80 grayscale-[20%]' : 'opacity-100'
              }`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex h-full w-full items-center justify-center ${plan.productImage?.url ? 'hidden' : ''}`}>
            <Package 
              size={32} 
              className={isSpecial ? "text-amber-600" : isComingSoon ? "text-slate-400" : "text-[#6C5DD3]"} 
              opacity={0.6} 
            />
          </div>
        </div>

        {/* Right Details */}
        <div className="flex w-[65%] flex-col p-3.5 text-xs sm:text-sm">
          <h2 className="mb-2.5 text-sm font-extrabold text-[#0F172A] sm:text-base flex items-center gap-1">
            {plan.name}
            {isSpecial && <span className="text-amber-500 text-xs">✨</span>}
          </h2>
          
          <div className="flex justify-between py-0.5">
            <span className="text-[#64748B] font-medium">Price</span>
            <span className="font-extrabold text-[#0F172A]">₹{(plan.initialPayment / 100).toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[#64748B] font-medium">Daily</span>
            <span className="font-extrabold text-[#10B981]">₹{(plan.dailyAmount / 100).toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[#64748B] font-medium">Period</span>
            <span className="font-extrabold text-[#0F172A]">{plan.durationDays} Days</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[#64748B] font-medium">Total Returns</span>
            <span className="font-extrabold text-[#4A3AFF]">₹{(plan.totalScheduled / 100).toFixed(0)}</span>
          </div>

          <div className="mt-4">
            {isComingSoon ? (
              <button
                type="button"
                disabled
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded-xl bg-slate-200 text-slate-500 py-2 text-xs font-black shadow-none cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Clock size={13} className="stroke-[2.5]" />
                <span>Coming Soon</span>
              </button>
            ) : isSpecial ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(plan);
                }}
                disabled={isPurchasing}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 py-2 font-bold text-white shadow-md shadow-amber-500/20 transition hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Star size={13} fill="currentColor" />
                <span>{isPurchasing ? 'Processing...' : 'Invest in Special'}</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(plan);
                }}
                disabled={isPurchasing}
                className="w-full rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] py-2 font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                {isPurchasing ? 'Processing...' : 'Invest Now'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
