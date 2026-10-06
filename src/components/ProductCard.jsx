import React from 'react';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ plan, isPurchasing, onPurchase }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/plans/${plan._id}`)}
      className="relative flex w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md cursor-pointer"
    >
      {/* Hot Badge */}
      <div className="absolute right-2 top-2 z-10 rounded border border-gray-200 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">
        🔥 HOT
      </div>

      {/* Left Image */}
      <div className="relative w-[35%] shrink-0 bg-gradient-to-br from-[#E0D8FF] to-[#F4F2FF]">
        {plan.productImage?.url ? (
          <img src={plan.productImage.url} alt={plan.name} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-90" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={32} className="text-[#6C5DD3]" opacity={0.5} />
          </div>
        )}
      </div>

      {/* Right Details */}
      <div className="flex w-[65%] flex-col p-3.5 text-xs sm:text-sm">
        <h2 className="mb-2.5 text-sm font-extrabold text-[#0F172A] sm:text-base">{plan.name}</h2>
        
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
