import React, { useEffect, useRef } from 'react';
import { X, Crown, ArrowRight, Zap, Gift, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnnouncementModal = ({ isOpen, onClose, onClaim }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (modalRef.current) modalRef.current.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = () => {
    onClose();
    if (onClaim) {
      onClaim();
    } else {
      navigate('/add-cash');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click dismiss */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Wrapper (Card + Floating Close Button) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[345px] sm:max-w-[375px] animate-modal-pop">
        
        {/* Modal Card */}
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="w-full rounded-[30px] overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#140D36] to-[#090518] border border-indigo-500/40 shadow-[0_20px_60px_-10px_rgba(74,58,255,0.55)] flex flex-col relative select-none outline-none"
        >
          {/* Top Neon Ambient Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#EC4899] to-transparent shadow-[0_0_12px_#EC4899]" />

          {/* Header Section */}
          <div className="pt-4 px-4 pb-2 text-center flex flex-col items-center">
            {/* Crown Logo Badge */}
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#FBBF24] uppercase">
              <Crown size={15} className="fill-[#FBBF24] text-[#FBBF24] drop-shadow-md" />
              <span>THE CASHLY</span>
            </div>

            {/* 3D Gold Headline */}
            <h2 className="text-center font-black text-[27px] sm:text-[31px] tracking-tight leading-none mt-1.5 bg-gradient-to-b from-[#FFFBEB] via-[#FBBF24] to-[#B45309] bg-clip-text text-transparent drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
              BRAND NEW BONUS
            </h2>

            {/* Glowing Offer Ribbon */}
            <div className="mt-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#4A3AFF] text-white text-[11px] sm:text-[11.5px] font-black uppercase tracking-wider shadow-lg shadow-purple-900/40 text-center">
              100% DOUBLE LUCK DEPOSIT BONUS
            </div>
          </div>

          {/* 3D Prize Wheel & Vault Artwork */}
          <div className="relative mx-3.5 my-1.5 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.7)] group">
            <img
              src="/cashly_bonus.jpg"
              alt="Cashly Brand New Bonus"
              className="w-full h-48 sm:h-52 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges Overlay */}
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider border border-white/20">
              <span>🔥 HOT BONUS</span>
            </div>

            <div className="absolute top-2 right-2 bg-gradient-to-r from-[#4A3AFF] to-[#8B5CF6] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider border border-white/20">
              <span>⚡ 2X MATCH</span>
            </div>
          </div>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-1 px-3.5 mt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-1 flex flex-col items-center text-center">
              <Gift size={14} className="text-[#FBBF24] mb-0.5" />
              <span className="text-[10px] font-bold text-slate-200">100% Match</span>
              <span className="text-[8.5px] text-slate-400">Instant credit</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-1 flex flex-col items-center text-center">
              <Zap size={14} className="text-[#EC4899] mb-0.5" />
              <span className="text-[10px] font-bold text-slate-200">₹100 Min</span>
              <span className="text-[8.5px] text-slate-400">Easy top-up</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-1 flex flex-col items-center text-center">
              <ShieldCheck size={14} className="text-[#34D399] mb-0.5" />
              <span className="text-[10px] font-bold text-slate-200">Zero Fees</span>
              <span className="text-[8.5px] text-slate-400">Fast payout</span>
            </div>
          </div>

          {/* Bottom Action Ribbon CTA Button */}
          <div className="p-3.5 mt-2 bg-gradient-to-t from-black/80 to-transparent">
            <button
              onClick={handleAction}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#4A3AFF] via-[#6366F1] to-[#EC4899] hover:from-[#5C43FF] hover:to-[#F43F5E] text-white font-black text-[13px] sm:text-[14px] uppercase tracking-wider shadow-[0_8px_25px_rgba(74,58,255,0.7)] flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer group"
            >
              <span>GET 10,000 BONUS UPON DEPOSIT</span>
              <ArrowRight size={17} strokeWidth={3} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating Circular Close Button (X) below modal card */}
        <button
          onClick={onClose}
          aria-label="Close Bonus Modal"
          className="mt-4 w-12 h-12 rounded-full border-2 border-white/50 bg-black/70 backdrop-blur-md text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-110 hover:border-white transition-all cursor-pointer active:scale-90"
        >
          <X size={24} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementModal;
