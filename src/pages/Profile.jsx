import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, Lock, Camera, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/me', formData); // Assume we add this endpoint
      if (res.data.success) {
        setMsg({ text: 'Profile updated successfully', type: 'success' });
        setEditing(false);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to update profile', type: 'error' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-32 overflow-hidden font-sans -mx-4 -mt-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 z-0 rounded-b-[40px] overflow-hidden bg-gradient-to-br from-[#4A3AFF] via-[#3B82F6] to-[#06B6D4]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/10 rounded-full blur-3xl transform rotate-12"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[100%] bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-[1] px-5 pt-10 space-y-8 max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">My Profile</h1>
          <p className="text-white/80 text-sm mt-1 font-medium">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-[0_20px_40px_rgb(0,0,0,0.08)] rounded-[32px] p-6 relative mt-4">
          
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#4A3AFF] to-[#3B82F6] p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-[#4A3AFF]" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-[#0F172A] w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white hover:scale-105 transition-transform">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] mt-3">{user?.name}</h2>
            <div className="inline-flex items-center gap-1.5 bg-[#F1F5F9] px-3 py-1 rounded-full mt-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">{user?.role}</span>
            </div>
          </div>

          {msg.text && (
            <div className={`rounded-2xl p-4 text-sm font-bold flex items-center justify-center mb-6 shadow-sm ${msg.type === 'success' ? 'bg-[#E6F7ED] text-[#10B981]' : 'bg-[#FFF1F2] text-[#F43F5E]'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-[13px] font-extrabold text-[#0F172A] mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User size={18} className={editing ? "text-[#4A3AFF]" : "text-gray-400"} />
                </div>
                <input
                  type="text"
                  disabled={!editing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 py-3.5 pl-12 pr-4 text-[#0F172A] font-semibold focus:border-[#4A3AFF] focus:bg-white focus:outline-none transition-all disabled:opacity-70"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-extrabold text-[#0F172A] mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-100/50 py-3.5 pl-12 pr-4 text-gray-500 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              {editing ? (
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-[#4A3AFF] to-[#3B82F6] py-3.5 text-white font-extrabold shadow-[0_8px_20px_rgba(74,58,255,0.25)] hover:opacity-90 transition-all">Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-2xl border-2 border-gray-200 bg-white py-3.5 text-[#64748B] font-extrabold hover:bg-gray-50 transition-all">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setEditing(true)} className="w-full rounded-2xl border-2 border-[#4A3AFF] py-3.5 text-[#4A3AFF] font-extrabold hover:bg-[#F4F2FF] transition-all">
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Settings Menu */}
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden border border-gray-50">
          <button className="w-full flex items-center justify-between p-5 text-left transition hover:bg-gray-50 border-b border-gray-50 group">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform">
                <Lock size={20} />
              </div>
              <span className="font-extrabold text-[#0F172A]">Change Password</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-5 text-left transition hover:bg-gray-50 border-b border-gray-50 group">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <span className="font-extrabold text-[#0F172A]">Privacy Policy</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button onClick={logout} className="w-full flex items-center justify-between p-5 text-left transition hover:bg-red-50 group border-b border-gray-50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] flex items-center justify-center text-[#F43F5E] group-hover:scale-110 transition-transform">
                <LogOut size={20} />
              </div>
              <span className="font-extrabold text-[#F43F5E]">Secure Logout</span>
            </div>
            <ChevronRight size={18} className="text-red-300" />
          </button>

          {user?.role === 'admin' && (
            <button onClick={() => window.location.href = '/admin'} className="w-full flex items-center justify-between p-5 text-left transition hover:bg-[#F4F2FF] group bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#E0D8FF] flex items-center justify-center text-[#4A3AFF] group-hover:scale-110 transition-transform shadow-sm">
                  <Shield size={20} />
                </div>
                <span className="font-extrabold text-[#4A3AFF]">Admin Dashboard</span>
              </div>
              <ChevronRight size={18} className="text-[#4A3AFF]" />
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
