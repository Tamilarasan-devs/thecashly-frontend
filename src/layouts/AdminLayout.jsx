import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListPlus, Banknote, Users, MessageSquare, LogOut, Menu, X, Wallet, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Plans', path: '/admin/plans', icon: ListPlus },
    { name: 'Add Cash List', path: '/admin/topups', icon: PlusCircle },
    { name: 'Withdrawals', path: '/admin/withdrawals', icon: Banknote },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Support Tickets', path: '/admin/tickets', icon: MessageSquare },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-8 border-b border-gray-50 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#4A3AFF] rounded-xl flex items-center justify-center shadow-md shadow-[#4A3AFF]/20">
              <Wallet size={20} className="text-white" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Cashly</h1>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Controls</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
                  isActive 
                  ? 'bg-[#4A3AFF] text-white shadow-[0_4px_15px_rgba(74,58,255,0.25)]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#4A3AFF]'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-bold text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center space-x-3 mb-6 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#4A3AFF]/10 flex items-center justify-center text-[#4A3AFF] font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-[#0F172A] truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-red-50 text-red-600 px-4 py-3.5 text-sm font-bold transition hover:bg-red-100"
          >
            <LogOut size={18} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-extrabold text-[#0F172A] hidden sm:block">Admin Workspace</h2>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
               </span>
               <span className="text-xs font-bold text-[#10B981]">System Online</span>
             </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default AdminLayout;
