import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Coins, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Loader2
} from 'lucide-react';

export default function ReferAndEarn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    referralCode: user?.referralCode || '',
    totalReferrals: 0,
    totalEarnings: 0,
    rewardPerReferral: 10000,
    refereeBonus: 10000,
    referrals: []
  });

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/referrals');
      if (res.data?.success) {
        setReferralData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load referral data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const referralCode = referralData.referralCode || user?.referralCode || 'CASHLY';
  const siteUrl = window.location.origin;
  const referralLink = `${siteUrl}/register?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const shareMessage = `🎮 Hey! Join Cashly to play games, invest in smart daily return assets, and cash out real money!\n\nUse my referral code *${referralCode}* to get an instant ₹100 welcome bonus!\n\nRegister here: ${referralLink}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Cashly & Earn Real Cash',
          text: shareMessage,
          url: referralLink,
        });
      } catch (err) {
        console.log('User cancelled share or not supported', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-gray-50 shadow-sm transition cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">Refer & Earn</h1>
          <p className="text-xs text-gray-500 font-medium">Invite friends and earn ₹100 per signup</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#4338CA] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC4899] opacity-30 rounded-full blur-3xl pointer-events-none -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4A3AFF] opacity-35 rounded-full blur-2xl pointer-events-none translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              Unlimited Cash Rewards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Earn ₹100 for every friend <br />
              <span className="text-amber-300">who joins Cashly!</span>
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm font-medium max-w-sm">
              Your friend gets a ₹100 welcome bonus, and you receive ₹100 directly in your wallet balance.
            </p>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 flex items-center justify-center shadow-2xl shadow-orange-500/40 shrink-0 self-center sm:self-auto">
            <div className="w-full h-full rounded-[22px] bg-[#0F172A]/40 flex items-center justify-center backdrop-blur-sm">
              <Gift size={42} className="text-white drop-shadow-md animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Box */}
      <div className="bg-white rounded-[26px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 text-center sm:text-left">
          Your Personal Referral Code
        </span>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:flex-1 bg-gradient-to-r from-gray-50 to-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl py-3.5 px-5 flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-[#4A3AFF]">
              {loading ? '••••••••' : referralCode}
            </span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
              copiedCode 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#0F172A] hover:bg-slate-800 text-white'
            }`}
          >
            {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Share buttons row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <MessageCircle size={16} fill="currentColor" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className={`w-full py-3 px-4 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
              copiedLink 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                : 'bg-white hover:bg-gray-50 text-[#0F172A] border-gray-200'
            }`}
          >
            {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Referral Link'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
            <Users size={20} />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Friends Invited
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mt-0.5 block">
            {loading ? '-' : referralData.totalReferrals}
          </span>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            Active referrals
          </span>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80">
          <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-3">
            <Coins size={20} />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Total Earned
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#10B981] tracking-tight mt-0.5 block">
            ₹{loading ? '-' : ((referralData.totalEarnings || 0) / 100).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            Credited to wallet
          </span>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-[26px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4A3AFF] flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
          <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
            How It Works
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#F4F2FF] text-[#4A3AFF] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Share Your Code</h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Share your unique referral code or link with friends, family, or social media.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Friend Signs Up</h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                They register on Cashly using your referral code and receive an instant ₹100 welcome reward.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#10B981] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Get Instant ₹100 Cash</h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                You receive ₹100 cash in your wallet balance immediately for each qualified registration!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List Section */}
      <div className="bg-white rounded-[26px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Users size={16} />
            </div>
            <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
              Friends You Referred ({referralData.referrals?.length || 0})
            </h3>
          </div>
          <button 
            type="button" 
            onClick={fetchReferralStats}
            className="text-xs text-[#4A3AFF] font-bold hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 size={24} className="animate-spin text-[#4A3AFF]" />
            <span className="text-xs font-medium">Loading referrals...</span>
          </div>
        ) : referralData.referrals && referralData.referrals.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {referralData.referrals.map((refItem) => (
              <div key={refItem._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F4F2FF] text-[#4A3AFF] font-black text-xs flex items-center justify-center">
                    {refItem.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] block">
                      {refItem.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(refItem.createdAt).toLocaleDateString()} &middot; {refItem.email}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-emerald-600 block">
                    +₹{(refItem.rewardAmount / 100).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Reward Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
              <Gift size={26} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0F172A]">No friends invited yet</p>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                Share your referral link with friends to earn your first ₹100 bonus!
              </p>
            </div>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white font-extrabold text-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Invite Your First Friend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

