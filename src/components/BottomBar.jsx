import React from 'react';
import { Home, Gamepad2, Plus, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Lobby', path: '/home' },
    { icon: Gamepad2, label: 'Store', path: '/products' },
    { icon: Plus, label: 'Top Up', isPrimary: true, path: '/add-cash' },
    { icon: Trophy, label: 'Quests', path: '/services' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-2 z-50 rounded-t-3xl">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/home' && location.pathname === '/');
          
          if (item.isPrimary) {
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="relative -top-6 flex flex-col items-center justify-center cursor-pointer group z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-4 rounded-full border-4 border-white shadow-[0_8px_20px_rgba(245,158,11,0.4)] transform group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7 text-white drop-shadow-md" strokeWidth={3} />
                </div>
                <span className="text-[11px] font-extrabold text-amber-500 mt-1 uppercase tracking-wider">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1.5 cursor-pointer w-[60px] relative"
            >
              {isActive && (
                <div className="absolute -top-2 w-10 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-xl shadow-[0_0_10px_rgba(99,102,241,0.4)]"></div>
              )}
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-50 scale-110' : 'hover:bg-slate-50 hover:scale-105'}`}>
                <Icon 
                  className={`h-6 w-6 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
