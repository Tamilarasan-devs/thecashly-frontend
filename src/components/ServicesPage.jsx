import React from 'react';
import BottomBar from './BottomBar';
import { ShieldCheck, Headset, History, FileText, Scroll } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { icon: Headset, title: 'Support Guild', desc: 'Get help 24/7 with your queries', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { icon: ShieldCheck, title: 'Security Arsenal', desc: 'Manage passwords and auth', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-teal-500/20' },
    { icon: History, title: 'Battle Logs', desc: 'View past deposits and withdrawals', color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' },
    { icon: Scroll, title: 'Rules of Engagement', desc: 'Read our platform policies', color: 'from-purple-500 to-pink-500', shadow: 'shadow-pink-500/20' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF5] p-6 lg:p-12 pb-24 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto mt-4">
        <header className="mb-10 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 uppercase drop-shadow-sm">Command Center</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your account and stats</p>
        </header>

        <div className="grid gap-5">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="relative group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl blur opacity-10 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative bg-white p-5 rounded-2xl border-2 border-slate-100 group-hover:border-indigo-200 flex items-center gap-5 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${service.color} shadow-lg ${service.shadow} relative z-10`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="font-extrabold text-slate-800 text-lg tracking-wide">{service.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{service.desc}</p>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent opacity-50"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
