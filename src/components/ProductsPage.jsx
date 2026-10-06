import React from 'react';
import BottomBar from './BottomBar';
import { Zap, Shield, Star } from 'lucide-react';

export default function ProductsPage() {
  const products = [
    { id: 1, name: 'Starter Pack', desc: 'Get a quick boost to your game.', price: 500, icon: Star, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { id: 2, name: 'Pro Power-Up', desc: 'Double your XP for 24 hours!', price: 1500, icon: Zap, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/30' },
    { id: 3, name: 'Elite Armor', desc: 'Maximum protection in matches.', price: 3000, icon: Shield, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-teal-500/30' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF5] p-6 lg:p-12 pb-24 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 uppercase drop-shadow-sm">Loot Store</h1>
          <p className="text-slate-500 mt-2 font-medium">Equip the best gear and dominate.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative bg-white rounded-3xl p-1.5 border-2 border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white rounded-[22px] p-6 h-full flex flex-col">
                  <div className={`h-32 bg-gradient-to-br ${item.color} rounded-2xl mb-6 flex items-center justify-center shadow-lg ${item.shadow} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <Icon className="w-16 h-16 text-white drop-shadow-md z-10" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-1">{item.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                      ₹{item.price}
                    </span>
                    <button className={`bg-gradient-to-r ${item.color} text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg ${item.shadow} hover:opacity-90 transition-all active:scale-95`}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
