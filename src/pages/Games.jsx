import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ChevronRight, Star, TrendingUp, Crown, Zap } from 'lucide-react';

const Games = () => {
  return (
    <div className="space-y-6 pb-6 bg-[#F8FAFC] min-h-screen">
      
      {/* Header Section - Modern Light Style */}
      <div className="relative rounded-[28px] bg-white overflow-hidden p-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 opacity-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 opacity-40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#EEF2FF] text-[#4A3AFF] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Crown size={12} strokeWidth={3} /> Arcade
              </span>
            </div>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Play & Win<br />Instantly
            </h1>
          </div>
          <div className="w-[60px] h-[60px] rounded-[20px] bg-gradient-to-br from-[#4A3AFF] to-[#3B82F6] flex items-center justify-center shadow-[0_10px_25px_rgba(74,58,255,0.3)]">
            <Gamepad2 size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Popular Games List */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4 px-1">
          <TrendingUp size={20} className="text-[#F43F5E]" />
          <h2 className="text-[18px] font-extrabold text-[#0F172A]">Trending Games</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Color Prediction Card */}
          <Link
            to="/color-game"
            className="group relative flex flex-col justify-between rounded-[24px] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(74,58,255,0.1)] hover:-translate-y-1"
          >
            {/* Card Graphic Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="p-5 flex items-start gap-4 relative z-10">
              <div className="w-[64px] h-[64px] shrink-0 rounded-[18px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-[0_8px_20px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform duration-300">
                <Star size={32} className="text-white drop-shadow-sm" fill="currentColor" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-[#0F172A] text-[19px] group-hover:text-[#6D28D9] transition-colors tracking-tight">Wingo</h3>
                  <span className="bg-[#FEF2F2] text-[#EF4444] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                    <Zap size={10} fill="currentColor" /> Hot
                  </span>
                </div>
                <p className="text-[13px] text-[#64748B] font-medium leading-relaxed">Predict Colors & Numbers to win up to 9x instantly!</p>
              </div>
            </div>
            
            <div className="bg-[#F8FAFC] px-5 py-3.5 border-t border-gray-100 flex items-center justify-between relative z-10 group-hover:bg-[#EEF2FF] transition-colors">
              <span className="text-[12px] font-bold text-[#475569] flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-red-400 border-2 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-violet-400 border-2 border-white shadow-sm"></div>
                </div>
                1.2k+ Playing
              </span>
              <div className="flex items-center gap-1 text-[#6D28D9] font-black text-[13px] uppercase tracking-wide">
                Play <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Aviator Premium Card */}
          <Link
            to="/aviator"
            className="group relative block rounded-[28px] p-[2px] overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] via-[#10B981] to-[#3B82F6] opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-[#121212] rounded-[26px] h-full overflow-hidden">
              {/* Card Header Area */}
              <div className="p-6 pb-5 flex items-start gap-5">
                <div className="w-16 h-16 shrink-0 rounded-[20px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-[0_8px_20px_rgba(59,130,246,0.4)] relative">
                  <div className="absolute inset-0 rounded-[20px] bg-white/20 blur-sm pointer-events-none"></div>
                  <Zap size={32} className="text-white relative z-10" />
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-black text-white text-[20px] leading-none tracking-tight">Aviator</h3>
                    <span className="bg-gradient-to-r from-[#10B981] to-[#047857] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.5)]">New</span>
                  </div>
                  <p className="text-[13px] text-gray-400 font-medium leading-snug">Cash out before the plane flies away! Win big multipliers.</p>
                </div>
              </div>
              
              {/* Card Footer Area */}
              <div className="bg-[#1a1a1a] px-6 py-4 border-t border-white/5 flex items-center justify-between group-hover:bg-[#222] transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#1a1a1a]"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-[#1a1a1a]"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 border-2 border-[#1a1a1a]"></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 ml-1">900+ Playing</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-[#3B82F6] font-black text-[13px] uppercase tracking-wide">
                  Play <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
};

export default Games;
