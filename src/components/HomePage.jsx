import React from 'react';
import { LogOut, Gamepad2, Sparkles, Trophy, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomBar from './BottomBar';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF5] p-6 lg:p-12 pb-24 font-sans text-slate-800 relative overflow-hidden">
      {/* Background gamified elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>
      <div className="absolute top-40 right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-2xl border-4 border-white shadow-[0_8px_20px_rgba(245,158,11,0.3)]">
              <Gamepad2 className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
              THE<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">CASHLY</span>
            </span>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold transition-all bg-white px-4 py-2.5 rounded-2xl border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 shadow-sm cursor-pointer active:scale-95"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        {/* Main Hero Card */}
        <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 p-10 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center max-w-3xl mx-auto mt-10 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg flex items-center gap-2 border-4 border-white">
            <Flame className="w-4 h-4 text-amber-300" />
            Lobby Ready
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight mt-4">Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Arena</span></h1>
          <p className="text-slate-500 text-[16px] sm:text-lg mb-10 leading-relaxed font-medium">Your games, leaderboards, and wallet are ready. Jump in and start your winning streak today!</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-extrabold uppercase tracking-wide shadow-xl group-hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border-b-4 border-purple-800">
                <Sparkles className="w-5 h-5 text-purple-200" />
                Join a Match
              </div>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto bg-white text-slate-700 hover:text-indigo-600 border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-10 py-4 rounded-2xl font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4"
            >
              <Trophy className="w-5 h-5" />
              View Stats
            </button>
          </div>
        </div>

      </div>
      <BottomBar />
    </div>
  );
}
