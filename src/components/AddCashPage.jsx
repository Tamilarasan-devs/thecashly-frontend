import React, { useState } from 'react';
import BottomBar from './BottomBar';
import { Gem, Coins } from 'lucide-react';

export default function AddCashPage() {
  const [amount, setAmount] = useState('');

  const amounts = [
    { val: 100, bonus: '0' },
    { val: 500, bonus: '50' },
    { val: 1000, bonus: '150' },
    { val: 5000, bonus: '1000' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF5] p-6 lg:p-12 pb-24 font-sans text-slate-800">
      <div className="max-w-md mx-auto mt-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-orange-500 uppercase drop-shadow-sm flex items-center justify-center gap-3">
            <Gem className="text-amber-500" />
            Top Up
            <Gem className="text-amber-500" />
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Recharge your wallet and get bonuses!</p>
        </header>

        <div className="bg-white rounded-[2rem] p-8 border-4 border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="mb-8 relative z-10">
            <label className="block text-sm font-extrabold text-slate-400 mb-3 uppercase tracking-wider">Enter Amount</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-amber-500">₹</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-3xl font-extrabold text-slate-900 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
            {amounts.map((amt) => (
              <button 
                key={amt.val}
                onClick={() => setAmount(amt.val.toString())}
                className="relative group bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-95 flex flex-col items-center gap-2 shadow-sm"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg transform rotate-12 shadow-lg z-20">
                  +{amt.bonus} BONUS
                </div>
                <Coins className="w-8 h-8 text-amber-500" />
                <span className="font-extrabold text-xl text-slate-800">₹{amt.val}</span>
              </button>
            ))}
          </div>

          <button className="w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold text-lg py-5 rounded-2xl uppercase tracking-wider shadow-lg group-hover:scale-[1.02] transition-transform">
              Recharge Now
            </div>
          </button>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
