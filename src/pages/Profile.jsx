import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  ChevronRight, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  Wallet, 
  Crown, 
  Check, 
  Settings, 
  X, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles,
  Smartphone,
  Pencil,
  History
} from 'lucide-react';
import api from '../lib/axios';

const Profile = () => {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'name' | 'password' | 'bank' | 'privacy' | 'settings'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Form states
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [bankForm, setBankForm] = useState({
    bankName: user?.payoutDetails?.bankName || '',
    accountNumber: user?.payoutDetails?.accountNumber || '',
    ifscCode: user?.payoutDetails?.ifscCode || '',
    accountHolderName: user?.payoutDetails?.accountHolderName || '',
    upiId: user?.payoutDetails?.upiId || ''
  });

  // Handle Common Profile Update (Name & Email)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setMsg({ text: 'Both name and email are required.', type: 'error' });
      return;
    }
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.put('/auth/me', { 
        name: profileForm.name.trim(),
        email: profileForm.email.trim()
      });
      if (res.data.success) {
        await fetchUser();
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => {
          setActiveModal(null);
          setMsg({ text: '', type: '' });
        }, 800);
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.put('/auth/me', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data.success) {
        setMsg({ text: 'Password changed successfully!', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setActiveModal(null);
          setMsg({ text: '', type: '' });
        }, 1200);
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to update password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Bank & Payout Details Update
  const handleUpdateBank = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.put('/auth/me', { payoutDetails: bankForm });
      if (res.data.success) {
        await fetchUser();
        setMsg({ text: 'Bank details saved successfully!', type: 'success' });
        setTimeout(() => {
          setActiveModal(null);
          setMsg({ text: '', type: '' });
        }, 1000);
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to save bank details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Avatar Change
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result;
        await api.put('/auth/me', { avatar: base64 });
        await fetchUser();
      } catch (err) {
        console.error('Failed to update avatar', err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-32 font-sans overflow-x-hidden -mx-4 -mt-4">
      
      {/* Top Deep Header Background */}
      <div className="relative bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#3730A3] px-6 pt-7 pb-20 rounded-b-[40px] shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Navigation Row */}
        <div className="flex items-center justify-between relative z-10 max-w-md mx-auto">
          {/* Brand Logo & Sub-tagline */}
          <div>
            <div className="flex items-center gap-1.5 relative">
              <span className="text-white font-extrabold text-2xl tracking-tight">the</span>
              <div className="relative inline-block">
                <span className="text-[#38BDF8] font-black text-2xl tracking-tight">cashly</span>
                <Crown size={13} className="text-[#FBBF24] fill-[#FBBF24] absolute -top-2 right-0.5 rotate-12 drop-shadow-sm" />
              </div>
            </div>
            <p className="text-[11px] text-white/70 font-semibold tracking-wider mt-0.5">Play • Earn • Grow</p>
          </div>

          {/* Settings Button */}
          <button 
            type="button"
            onClick={() => setActiveModal('settings')}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/15 hover:bg-white/20 transition cursor-pointer"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Body (Overlapping Top Banner) */}
      <div className="relative z-10 max-w-md mx-auto px-4 -mt-12 space-y-4">

        {/* 1. Hero User Profile Card */}
        <div className="relative overflow-hidden rounded-[28px] p-5 bg-gradient-to-r from-[#F0EDFF] via-[#E8EDFF] to-[#DCE8FF] border border-white/80 shadow-[0_12px_32px_rgba(74,58,255,0.08)]">
          {/* Decorative Wave Overlay */}
          <div className="absolute right-0 bottom-0 w-44 h-44 bg-gradient-to-tl from-indigo-200/50 via-blue-200/30 to-transparent rounded-tl-full pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            {/* Avatar Circle */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6C5DD3] to-[#4A3AFF] p-1 shadow-md border-2 border-white">
                <div className="w-full h-full rounded-full bg-[#6C5DD3] flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={38} className="text-white" />
                  )}
                </div>
              </div>
              
              {/* Overlapping Camera Icon Button */}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#0F172A] rounded-full flex items-center justify-center text-white border-2 border-white shadow-md hover:scale-110 transition cursor-pointer"
                title="Change Avatar"
              >
                <Camera size={13} />
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 min-w-0">
              {/* Name + Verified Badge */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight">
                  {user?.name || 'arjun'}
                </h3>
                <div className="w-4 h-4 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Check size={11} strokeWidth={3.5} />
                </div>
              </div>

              {/* Role Pill Badge */}
              <div className="mt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669] text-[10px] font-black tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span>{user?.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}</span>
                </span>
              </div>

              {/* Motto / Tagline */}
              <p className="text-xs text-[#64748B] font-medium mt-1">
                Play smart, win more!
              </p>
            </div>
          </div>
        </div>

        {/* 2. User Details Card (Full Name & Email Address) */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80 p-4 space-y-2">
          
          {/* Card Header with Common Edit Button */}
          <div className="flex items-center justify-between pb-2.5 px-1 border-b border-gray-100">
            <span className="text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wider">
              Personal Information
            </span>
            <button
              type="button"
              onClick={() => {
                setProfileForm({ name: user?.name || '', email: user?.email || '' });
                setMsg({ text: '', type: '' });
                setActiveModal('profile');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F2FF] hover:bg-[#ECE8FF] text-[#4A3AFF] text-xs font-bold rounded-xl transition cursor-pointer border border-[#4A3AFF]/10 shadow-xs"
            >
              <Pencil size={12} />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {/* Full Name Row */}
            <div className="flex items-center justify-between py-2.5 px-1">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F4F2FF] text-[#4A3AFF] flex items-center justify-center shrink-0">
                  <User size={19} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">{user?.name || 'arjun'}</span>
                </div>
              </div>
            </div>

            {/* Email Address Row */}
            <div className="flex items-center justify-between py-2.5 px-1">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Mail size={19} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">{user?.email || 'arjun01@gmail.com'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Wallet Balance Card (Very Prominent Gradient Banner) */}
        <div className="relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-r from-[#172554] via-[#1E40AF] to-[#6366F1] text-white shadow-xl flex items-center justify-between">
          {/* Background Abstract Curved Wave Decor */}
          <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-white/10 via-white/5 to-transparent rounded-l-full pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#8B5CF6]/30 rounded-full blur-2xl pointer-events-none"></div>

          {/* Left Info: Wallet Icon + Amount */}
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <Wallet size={22} className="text-white" />
            </div>
            <div>
              <span className="text-xs text-blue-100/90 font-medium block">Wallet Balance</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white tracking-tight">
                  ₹ {((user?.walletBalance || 0) / 100).toLocaleString('en-IN')}
                </span>
                <button 
                  type="button"
                  onClick={() => navigate('/services/history')}
                  className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-white/90 hover:bg-white/25 transition cursor-pointer"
                  title="View Transaction History"
                >
                  <ChevronRight size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Action: Add Cash Button */}
          <button
            type="button"
            onClick={() => navigate('/add-cash')}
            className="relative z-10 px-5 py-2.5 bg-gradient-to-r from-[#5B51D8] to-[#7C3AED] hover:from-[#4E44CB] hover:to-[#6D28D9] text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-950/40 transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            Add Cash
          </button>
        </div>

        {/* 4. Action Menu Rows Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80 overflow-hidden divide-y divide-gray-50">
          
          {/* Bank & Payout Details */}
          <button 
            type="button"
            onClick={() => {
              setBankForm({
                bankName: user?.payoutDetails?.bankName || '',
                accountNumber: user?.payoutDetails?.accountNumber || '',
                ifscCode: user?.payoutDetails?.ifscCode || '',
                accountHolderName: user?.payoutDetails?.accountHolderName || '',
                upiId: user?.payoutDetails?.upiId || ''
              });
              setMsg({ text: '', type: '' });
              setActiveModal('bank');
            }}
            className="w-full flex items-center justify-between p-4 text-left transition hover:bg-gray-50 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#0F172A] text-sm block">Bank & Payout Details</span>
                <span className="text-xs text-[#64748B] font-medium">
                  {user?.payoutDetails?.bankName 
                    ? `${user.payoutDetails.bankName} (•••• ${user.payoutDetails.accountNumber?.slice(-4) || '8900'})` 
                    : 'State Bank of India (•••• 8900)'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#2563EB] transition-colors" />
          </button>

          {/* Withdrawal History */}
          <button 
            type="button"
            onClick={() => navigate('/wallet#withdrawals')}
            className="w-full flex items-center justify-between p-4 text-left transition hover:bg-gray-50 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <History size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#0F172A] text-sm block">Withdrawal History</span>
                <span className="text-xs text-[#64748B] font-medium">Track payout requests & live approval status</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#10B981] transition-colors" />
          </button>

          {/* Change Password */}
          <button 
            type="button"
            onClick={() => {
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setMsg({ text: '', type: '' });
              setActiveModal('password');
            }}
            className="w-full flex items-center justify-between p-4 text-left transition hover:bg-gray-50 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Lock size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#0F172A] text-sm block">Change Password</span>
                <span className="text-xs text-gray-400 font-medium">Keep your account secure</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#F97316] transition-colors" />
          </button>

          {/* Privacy Policy */}
          <button 
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="w-full flex items-center justify-between p-4 text-left transition hover:bg-gray-50 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#0F172A] text-sm block">Privacy Policy</span>
                <span className="text-xs text-gray-400 font-medium">Your data matters</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#10B981] transition-colors" />
          </button>

          {/* Secure Logout */}
          <button 
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-between p-4 text-left transition hover:bg-red-50/50 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF1F2] text-[#F43F5E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LogOut size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#0F172A] text-sm block">Secure Logout</span>
                <span className="text-xs text-gray-400 font-medium">Sign out from your account</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#F43F5E] transition-colors" />
          </button>

          {/* Admin Dashboard (if admin) */}
          {user?.role === 'admin' && (
            <button 
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-between p-4 text-left transition bg-indigo-50/40 hover:bg-indigo-50 group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#E0D8FF] text-[#4A3AFF] flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="font-extrabold text-[#4A3AFF] text-sm block">Admin Workspace</span>
                  <span className="text-xs text-indigo-900/60 font-medium">Manage platform, plans & users</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#4A3AFF]" />
            </button>
          )}

        </div>

      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Edit Profile Modal (Common Edit for Name & Email) */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <Pencil size={18} className="text-[#4A3AFF]" />
                <span>Edit Profile Details</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {msg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading && <RefreshCw size={14} className="animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Change Password Modal */}
      {activeModal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <Lock size={18} className="text-[#F97316]" />
                <span>Change Password</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {msg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading && <RefreshCw size={14} className="animate-spin" />}
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Bank & Payout Details Modal */}
      {activeModal === 'bank' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <Building2 size={18} className="text-[#2563EB]" />
                <span>Bank & Payout Details</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {msg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleUpdateBank} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Full name as per bank record"
                  value={bankForm.accountHolderName}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 123456789012"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={bankForm.ifscCode}
                  onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF] uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">UPI ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={bankForm.upiId}
                  onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading && <RefreshCw size={14} className="animate-spin" />}
                  <span>Save Bank</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10B981]" />
                <span>Privacy & Security</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p className="font-semibold text-gray-800">
                At The Cashly, your privacy, transaction records, and personal security are our top priorities.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 space-y-1">
                <p className="font-bold">✓ End-to-End Encryption</p>
                <p className="text-[11px]">All financial records and UPI transactions are encrypted with bank-grade 256-bit protocols.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-800 space-y-1">
                <p className="font-bold">✓ No Third-Party Data Sharing</p>
                <p className="text-[11px]">Your phone number, email, and wallet history are never sold or rented to third-party advertisers.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-purple-800 space-y-1">
                <p className="font-bold">✓ Fast Withdrawal Verification</p>
                <p className="text-[11px]">Payout requests are strictly verified against your registered account for zero fraud tolerance.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* 5. Quick Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <Settings size={18} className="text-[#4A3AFF]" />
                <span>Account Settings</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => { setActiveModal('name'); }}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left font-bold text-gray-700 flex items-center justify-between"
              >
                <span>Edit Profile Name</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal('password'); }}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left font-bold text-gray-700 flex items-center justify-between"
              >
                <span>Change Password</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal('bank'); }}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left font-bold text-gray-700 flex items-center justify-between"
              >
                <span>Bank & Payout Setup</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => { navigate('/services/support'); }}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left font-bold text-gray-700 flex items-center justify-between"
              >
                <span>Support & Help Desk</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
