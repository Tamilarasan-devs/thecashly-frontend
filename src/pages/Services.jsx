import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Banknote, History, Calendar, HelpCircle, FileText, ChevronRight, LayoutGrid } from 'lucide-react';

const Services = () => {
  const serviceLinks = [
    { 
      name: 'My Products', 
      icon: Package, 
      path: '/services/my-products', 
      desc: 'Active & completed subscriptions',
      color: 'text-[#6C5DD3]',
      bg: 'bg-[#F4F2FF]',
      border: 'group-hover:border-[#6C5DD3]'
    },
    { 
      name: 'Withdrawal', 
      icon: Banknote, 
      path: '/wallet', 
      desc: 'Request payout from eligible balance',
      color: 'text-[#10B981]',
      bg: 'bg-[#E6F7ED]',
      border: 'group-hover:border-[#10B981]'
    },
    { 
      name: 'Transaction History', 
      icon: History, 
      path: '/services/history', 
      desc: 'Wallet credits & purchases',
      color: 'text-[#F97316]',
      bg: 'bg-[#FFF7ED]',
      border: 'group-hover:border-[#F97316]'
    },
    { 
      name: 'Payout Schedule', 
      icon: Calendar, 
      path: '/services/schedule', 
      desc: 'Day-by-day return schedule',
      color: 'text-[#F43F5E]',
      bg: 'bg-[#FFF1F2]',
      border: 'group-hover:border-[#F43F5E]'
    },
    { 
      name: 'Help & Support', 
      icon: HelpCircle, 
      path: '/services/support', 
      desc: 'Raise a ticket for assistance',
      color: 'text-[#3B82F6]',
      bg: 'bg-[#EFF6FF]',
      border: 'group-hover:border-[#3B82F6]'
    },
    { 
      name: 'Terms & FAQs', 
      icon: FileText, 
      path: '/services/terms', 
      desc: 'Rules and general information',
      color: 'text-[#64748B]',
      bg: 'bg-[#F1F5F9]',
      border: 'group-hover:border-[#64748B]'
    },
    { 
      name: 'Mini Games', 
      icon: LayoutGrid, 
      path: '/games', 
      desc: 'Play & win points instantly',
      color: 'text-[#8B5CF6]',
      bg: 'bg-[#F5F3FF]',
      border: 'group-hover:border-[#8B5CF6]'
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      
      {/* Header Section */}
      <div className="relative rounded-[28px] bg-[#0F172A] overflow-hidden p-8 shadow-xl">
        {/* Abstract shapes for header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A3AFF] opacity-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F43F5E] opacity-20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <LayoutGrid size={28} className="text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-[26px] font-extrabold text-white tracking-tight">Services</h1>
            <p className="text-[13px] text-gray-400 font-medium mt-0.5">Manage your assets & track history</p>
          </div>
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid gap-4 sm:grid-cols-2">
        {serviceLinks.map((service) => (
          <Link
            key={service.name}
            to={service.path}
            className={`group flex items-center justify-between rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] ${service.border}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110 ${service.bg} ${service.color}`}>
                <service.icon size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-[15px] group-hover:text-[#4A3AFF] transition-colors">{service.name}</h3>
                <p className="text-[11px] text-[#64748B] font-semibold mt-0.5">{service.desc}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#4A3AFF] transition-colors">
              <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" strokeWidth={3} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
