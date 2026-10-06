import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ChevronRight, Star, TrendingUp, Crown, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Games = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white pb-24 overflow-x-hidden relative selection:bg-blue-500/30">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-900/20 via-[#0B0F19] to-[#0B0F19] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header Section */}
      <div className="px-4 pt-6 pb-2 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-[32px] overflow-hidden p-8 shadow-2xl border border-white/10 bg-[#151B2B]/80 backdrop-blur-xl"
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-[#0B0F19] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                <Crown size={12} strokeWidth={3} /> Premium Arcade
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
              Play & Win<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Instantly.
              </span>
            </h1>
            <p className="text-gray-400 text-sm font-medium max-w-[200px] leading-relaxed">
              Step into the arena. Real money, real thrills.
            </p>
          </div>

          {/* Floating Controller Graphic */}
          <motion.div 
            animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-white/20"
          >
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
            <Gamepad2 size={40} className="text-white relative z-10 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </div>

      {/* Popular Games List */}
      <div className="px-4 pt-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2.5 mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
            <TrendingUp size={16} className="text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">Trending Now</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          
          {/* Aviator Premium Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          >
            <Link
              to="/aviator"
              className="group relative block rounded-[32px] p-[2px] overflow-hidden transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-gray-900 to-red-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-[#0F1423] rounded-[30px] h-full overflow-hidden flex flex-col border border-white/5">
                {/* Background Art */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-red-600/20 transition-colors" />
                
                {/* Card Header Area */}
                <div className="p-6 pb-5 flex items-start gap-5 relative z-10 flex-1">
                  <div className="w-16 h-16 shrink-0 rounded-[20px] bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-[0_8px_20px_rgba(225,29,72,0.4)] border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                    <Zap size={28} className="text-white drop-shadow-md" fill="currentColor" />
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-white text-[22px] leading-none tracking-tight group-hover:text-red-400 transition-colors">Aviator</h3>
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)] flex items-center gap-1">
                        <Sparkles size={10} /> Hot
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                      Cash out before the plane flies away! Win huge multipliers.
                    </p>
                  </div>
                </div>
                
                {/* Card Footer Area */}
                <div className="bg-[#151B2B]/80 backdrop-blur-md px-6 py-4 border-t border-white/5 flex items-center justify-between group-hover:bg-[#1A2235] transition-colors relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#151B2B]" />
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-[#151B2B]" />
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-[#151B2B]" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 ml-1.5 tracking-wide">12k+ Playing</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full text-red-400 font-black text-[11px] uppercase tracking-widest group-hover:bg-red-500 group-hover:text-white transition-all">
                    Play <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Color Prediction Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          >
            <Link
              to="/color-game"
              className="group relative block rounded-[32px] p-[2px] overflow-hidden transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-gray-900 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-[#0F1423] rounded-[30px] h-full overflow-hidden flex flex-col border border-white/5">
                
                <div className="absolute top-0 left-0 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-600/20 transition-colors" />
                
                <div className="p-6 pb-5 flex items-start gap-5 relative z-10 flex-1">
                  <div className="w-16 h-16 shrink-0 rounded-[20px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_8px_20px_rgba(139,92,246,0.4)] border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                    <Star size={28} className="text-white drop-shadow-md" fill="currentColor" />
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-white text-[22px] leading-none tracking-tight group-hover:text-purple-400 transition-colors">Wingo 1Min</h3>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        Live
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                      Predict Colors & Numbers. Fast paced, instant 9x payouts!
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#151B2B]/80 backdrop-blur-md px-6 py-4 border-t border-white/5 flex items-center justify-between group-hover:bg-[#1A2235] transition-colors relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#151B2B]" />
                      <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-[#151B2B]" />
                      <div className="w-7 h-7 rounded-full bg-red-500 border-2 border-[#151B2B]" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 ml-1.5 tracking-wide">8k+ Playing</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-purple-500/10 px-3 py-1.5 rounded-full text-purple-400 font-black text-[11px] uppercase tracking-widest group-hover:bg-purple-500 group-hover:text-white transition-all">
                    Play <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default Games;
