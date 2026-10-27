import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, CirclePlus, LayoutGrid, User, Wallet } from 'lucide-react';

const CustomerLayout = () => {
  const location = useLocation();

  const isGame = location.pathname === '/color-game' || location.pathname === '/aviator';

  return (
    <div className={`flex min-h-screen flex-col ${isGame ? 'bg-[#0B0F19]' : 'bg-[#F8FAFC]'}`}>
      {/* Top Header - Hide on Home and Game pages */}
      {location.pathname !== '/' && !isGame && (
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
      <main className={`flex-1 ${isGame || location.pathname === '/' ? '' : 'p-4 pb-32'}`}>
        <div className={isGame ? 'w-full' : 'mx-auto max-w-5xl'}>
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile & Desktop App View) */}
      {location.pathname !== '/color-game' && location.pathname !== '/aviator' && (() => {
        const getActiveIndex = () => {
          const path = location.pathname;
          if (path === '/') return 0;
          if (path.startsWith('/plans')) return 1;
          if (path.startsWith('/add-cash') || path.startsWith('/wallet')) return 2;
          if (path.startsWith('/services')) return 3;
          if (path.startsWith('/profile')) return 4;
          return 0;
        };

        const activeIdx = getActiveIndex();

        const navItems = [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Products', path: '/plans', icon: ShoppingBag },
          // { name: 'Games', path: '/games', icon: Gamepad2 },
          { name: 'Add Cash', path: '/add-cash', icon: CirclePlus },
          { name: 'Services', path: '/services', icon: LayoutGrid },
          { name: 'Profile', path: '/profile', icon: User },
        ];

        const getSvgPaths = (idx) => {
          const cx = idx * 200 + 100;
          let bgPath = '';
          let rimPath = '';

          if (idx === 0) {
            bgPath = `M 0 68 C 25 76, 50 104, 100 104 C 150 104, 160 38, 205 38 L 980 38 Q 1000 38 1000 58 L 1000 150 L 0 150 Z`;
            rimPath = `M 0 68 C 25 76, 50 104, 100 104 C 150 104, 160 38, 205 38 L 1000 38`;
          } else if (idx === 4) {
            bgPath = `M 0 58 Q 0 38 20 38 L 795 38 C 840 38, 850 104, 900 104 C 950 104, 975 76, 1000 68 L 1000 150 L 0 150 Z`;
            rimPath = `M 0 38 L 795 38 C 840 38, 850 104, 900 104 C 950 104, 975 76, 1000 68`;
          } else {
            const startX = cx - 95;
            const endX = cx + 95;
            bgPath = `M 0 58 Q 0 38 20 38 L ${startX} 38 C ${cx - 50} 38, ${cx - 45} 104, ${cx} 104 C ${cx + 45} 104, ${cx + 50} 38, ${endX} 38 L 980 38 Q 1000 38 1000 58 L 1000 150 L 0 150 Z`;
            rimPath = `M 0 38 L ${startX} 38 C ${cx - 50} 38, ${cx - 45} 104, ${cx} 104 C ${cx + 45} 104, ${cx + 50} 38, ${endX} 38 L 1000 38`;
          }

          return { bgPath, rimPath, cxPercent: idx * 20 + 10 };
        };

        const { bgPath, rimPath, cxPercent } = getSvgPaths(activeIdx);
        const ActiveIcon = navItems[activeIdx]?.icon;

        return (
          <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-safe">
            <div className="relative w-full max-w-lg h-[92px] pointer-events-auto select-none">
              {/* Background SVG with Notch Cutout and Cashly Slate/Blue Rim */}
              <svg
                className="absolute bottom-0 left-0 w-full h-full pointer-events-none drop-shadow-[0_-5px_20px_rgba(15,23,42,0.4)]"
                viewBox="0 0 1000 150"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="slateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0F172A" />
                    <stop offset="100%" stopColor="#090D16" />
                  </linearGradient>
                  <linearGradient id="blueRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4A3AFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#4A3AFF" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Main Dark Slate Bar Shape with Notch */}
                <path d={bgPath} fill="url(#slateGrad)" />

                {/* Electric Blue Contour Rim along Top & Notch */}
                <path d={rimPath} fill="none" stroke="url(#blueRimGrad)" strokeWidth="3" strokeLinecap="round" />
              </svg>

              {/* Elevated Floating Circular Badge with Cashly Blue Theme */}
              <div
                className="absolute -top-6 transition-all duration-300 ease-out pointer-events-none flex flex-col items-center justify-center"
                style={{
                  left: `${cxPercent}%`,
                  transform: 'translateX(-50%)',
                  width: '68px',
                }}
              >
                <div className="w-[66px] h-[66px] rounded-full p-[2.5px] bg-gradient-to-b from-[#818CF8] via-[#4A3AFF] to-[#2518A8] shadow-[0_8px_25px_rgba(74,58,255,0.55)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full p-[2.5px] bg-[#0F172A] flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-[1.5px] border-[#818CF8]/60 bg-gradient-to-b from-[#4A3AFF] to-[#3724E6] flex items-center justify-center text-white shadow-inner">
                      {ActiveIcon && <ActiveIcon size={26} strokeWidth={2.4} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Tab Items */}
              <div className="relative z-10 w-full h-full flex items-end pb-2 pt-6">
                {navItems.map((item, idx) => {
                  const isActive = idx === activeIdx;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="group flex-1 flex flex-col items-center justify-end h-full pb-1 select-none transition-transform duration-150 active:scale-95"
                    >
                      {isActive ? (
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[12px] tracking-tight text-white drop-shadow-sm leading-tight">
                            {item.name}
                          </span>
                          <span className="w-4 h-[2.5px] bg-[#4A3AFF] rounded-full mt-1.5 shadow-[0_0_8px_rgba(74,58,255,0.8)]" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1 text-[#64748B] group-hover:text-[#94A3B8] transition-colors">
                          <div className="w-7 h-7 flex items-center justify-center">
                            <Icon size={22} strokeWidth={2} />
                          </div>
                          <span className="font-semibold text-[10.5px] tracking-tight text-[#64748B] group-hover:text-[#94A3B8] leading-none">
                            {item.name}
                          </span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        );
      })()}

      {/* Desktop Sidebar (Optional, but keeping it simple for now) */}
    </div>
  );
};

export default CustomerLayout;
