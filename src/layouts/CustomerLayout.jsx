import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, LayoutGrid, User, Wallet, Gamepad2 } from 'lucide-react';

const CustomerLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/plans', icon: List },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Add Cash', path: '/add-cash', icon: PlusCircle },
    { name: 'Services', path: '/services', icon: LayoutGrid },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Top Header - Hide on Home and Game pages */}
      {location.pathname !== '/' && location.pathname !== '/color-game' && location.pathname !== '/aviator' && (
        <header className="sticky top-0 z-30 bg-white px-5 py-4 text-[#0F172A] shadow-[0_2px_10px_rgb(0,0,0,0.05)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4A3AFF] rounded-[10px] flex items-center justify-center shadow-md">
                <Wallet size={18} className="text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Cashly</h1>
            </div>
            {/* We can add notifications or profile pic here */}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 pb-32 ${location.pathname === '/' ? '' : 'p-4'}`}>
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      {location.pathname !== '/color-game' && location.pathname !== '/aviator' && (
        <nav className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
          <div className="flex justify-around items-center bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-[28px] p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex flex-col items-center justify-center flex-1 h-14 rounded-[20px] transition-all duration-300 ${isActive ? 'text-white' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-[#4A3AFF] rounded-[20px] scale-100 transition-transform shadow-[0_0_15px_rgba(74,58,255,0.5)]"></span>
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 mb-0.5" />
                <span className={`text-[10px] font-bold relative z-10 transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-80 scale-95'}`}>{item.name}</span>
              </Link>
            );
          })}
          </div>
        </nav>
      )}

      {/* Desktop Sidebar (Optional, but keeping it simple for now) */}
    </div>
  );
};

export default CustomerLayout;
