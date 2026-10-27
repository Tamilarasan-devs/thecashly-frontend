import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Smartphone,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Info
} from 'lucide-react';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Official Brand Icons for PhonePe and Paytm
const PhonePeIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#5F259F" />
    <path
      d="M27 12H19c-1.1 0-2 .9-2 2v21c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V27h7c5.2 0 9.5-4.3 9.5-9.5S32.2 12 27 12zm0 12h-7v-9h7c3.3 0 6 2.7 6 6s-2.7 6-6 6z"
      fill="#ffffff"
    />
    <path
      d="M21 24l10.8 13.5c.6.7 1.6.8 2.3.2.7-.6.8-1.6.2-2.3L23.5 22c-.6-.7-1.6-.8-2.3-.2-.7.6-.8 1.6-.2 2.2z"
      fill="#ffffff"
    />
  </svg>
);

const PaytmIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#002970" />
    <text x="7" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" letterSpacing="-0.5">
      pay
    </text>
    <text x="7" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="16" fill="#00BAF2" letterSpacing="-0.5">
      tm
    </text>
  </svg>
);

const AddCash = () => {
  const { user, fetchUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [paymentSetting, setPaymentSetting] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const [userTopUps, setUserTopUps] = useState([]);
  const [loadingSetting, setLoadingSetting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [showSandbox, setShowSandbox] = useState(false);
  const [showUtrHelp, setShowUtrHelp] = useState(false);
  const [qrMode, setQrMode] = useState('default'); // 'default' (admin QR) or 'dynamic' (amount QR)

  const quickAmounts = [100, 500, 1000, 2000, 5000];
  const minAmount = (paymentSetting?.minDeposit || 10000) / 100;
  const maxAmount = (paymentSetting?.maxDeposit || 10000000) / 100;

  // Single assigned channel (shuffled & equally balanced by backend)
  const currentChannel = {
    upiId: paymentSetting?.upiId || 'cashly@upi',
    upiName: paymentSetting?.upiName || 'The Cashly Payments',
    qrCodeImage: paymentSetting?.qrCodeImage || '',
    title: paymentSetting?.channelTitle || 'UPI QR'
  };

  useEffect(() => {
    fetchPaymentSettings();
    fetchUserTopUps();
  }, []);

  const fetchPaymentSettings = async (isRotate = false) => {
    if (isRotate) setShuffling(true);
    else setLoadingSetting(true);
    try {
      const url = isRotate ? '/payment-settings/rotate' : '/payment-settings';
      const res = await api.get(url);
      if (res.data.success && res.data.data) {
        setPaymentSetting(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load payment settings', err);
    } finally {
      setLoadingSetting(false);
      setShuffling(false);
    }
  };

  const fetchUserTopUps = async () => {
    try {
      const res = await api.get('/topups');
      if (res.data.success) {
        setUserTopUps(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user deposits', err);
    }
  };

  const handleCopyUpi = () => {
    const upi = currentChannel.upiId || paymentSetting?.upiId || 'cashly@upi';
    navigator.clipboard.writeText(upi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Generates UPI URL with exact amount formatted to 2 decimals.
   * Tailored for Android Intent, iOS schemes, and universal UPI apps.
   */
  const getUpiUrl = (appScheme = '', customAmt = null) => {
    const upiId = currentChannel.upiId || paymentSetting?.upiId || 'cashly@upi';
    const upiName = currentChannel.upiName || paymentSetting?.upiName || 'The Cashly Payments';
    const amtToUse = customAmt !== null ? customAmt : amount;
    const num = parseFloat(amtToUse);
    const amountParam = !isNaN(num) && num > 0 ? `&am=${num.toFixed(2)}` : '';
    const note = 'The Cashly Deposit';

    const baseParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}${amountParam}&cu=INR&tn=${encodeURIComponent(note)}`;

    const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
    const isAndroid = /android/i.test(ua);

    if (appScheme === 'phonepe') {
      if (isAndroid) {
        // Android Intent directly targeting PhonePe app package
        return `intent://pay?${baseParams}#Intent;scheme=upi;package=com.phonepe.app;end`;
      }
      // iOS / Universal PhonePe custom scheme
      return `phonepe://pay?${baseParams}`;
    }

    if (appScheme === 'paytm') {
      if (isAndroid) {
        // Android Intent directly targeting Paytm app package
        return `intent://pay?${baseParams}#Intent;scheme=upi;package=net.one97.paytm;end`;
      }
      // iOS / Universal Paytm scheme (paytmmp://)
      return `paytmmp://pay?${baseParams}`;
    }

    if (appScheme === 'gpay') {
      if (isAndroid) {
        return `intent://pay?${baseParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
      }
      return `tez://upi/pay?${baseParams}`;
    }

    // Generic standard UPI for any app
    return `upi://pay?${baseParams}`;
  };

  /**
   * Triggers PhonePe or Paytm redirection with pre-filled amount.
   * If amount is not entered, prompts and focuses amount input.
   */
  const handleAppPay = (appScheme) => {
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount < minAmount) {
      setStatusMsg({
        text: `Please enter an amount of at least ₹${minAmount} first to pay via ${
          appScheme === 'phonepe' ? 'PhonePe' : appScheme === 'paytm' ? 'Paytm' : 'UPI'
        }.`,
        type: 'error'
      });
      const inputEl = document.getElementById('deposit-amount-input');
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (numAmount > maxAmount) {
      setStatusMsg({
        text: `Maximum deposit allowed is ₹${maxAmount.toLocaleString()}.`,
        type: 'error'
      });
      return;
    }

    // Automatically copy UPI ID to clipboard as a helpful backup
    if (currentChannel.upiId) {
      try {
        navigator.clipboard.writeText(currentChannel.upiId);
      } catch (err) {}
    }

    const appName = appScheme === 'phonepe' ? 'PhonePe' : appScheme === 'paytm' ? 'Paytm' : 'UPI App';
    const targetUrl = getUpiUrl(appScheme);
    const genericUrl = getUpiUrl('generic');

    setStatusMsg({
      text: `Opening ${appName} to pay ₹${numAmount.toLocaleString()}...`,
      type: 'info',
      appName,
      amountPaid: numAmount,
      primaryUrl: targetUrl,
      genericUrl
    });

    // Execute redirection via user gesture
    try {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 500);
    } catch {
      window.location.href = targetUrl;
    }
  };

  const handleSubmitManual = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount < minAmount) {
      setStatusMsg({ text: `Minimum deposit amount is ₹${minAmount}`, type: 'error' });
      return;
    }
    if (numAmount > maxAmount) {
      setStatusMsg({ text: `Maximum deposit amount is ₹${maxAmount.toLocaleString()}`, type: 'error' });
      return;
    }

    const cleanUtr = utr.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setStatusMsg({ text: 'Please enter a valid 12-digit UPI UTR / Reference number from your payment receipt.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/topups/submit-manual', {
        amount: Math.round(numAmount * 100),
        utr: cleanUtr,
        paymentMethod: 'manual_upi'
      });

      if (res.data.success) {
        setStatusMsg({
          text: `Deposit request of ₹${numAmount} submitted successfully! It will be verified by admin shortly.`,
          type: 'success'
        });
        setAmount('');
        setUtr('');
        await fetchUserTopUps();
      }
    } catch (err) {
      setStatusMsg({
        text: err.response?.data?.error || 'Failed to submit deposit. Please check UTR and try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Optional Sandbox Instant Simulation for Testing
  const handleSandboxPay = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 100) {
      setStatusMsg({ text: 'Enter an amount of at least ₹100', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const initRes = await api.post('/topups/init', { amount: Math.round(numAmount * 100) });
      if (initRes.data.success) {
        const verifyRes = await api.post('/topups/verify-sandbox', {
          topUpId: initRes.data.data.topUpId,
          status: 'success',
          gatewayReference: 'TEST_SANDBOX_' + Date.now()
        });

        if (verifyRes.data.success) {
          setStatusMsg({ text: `Sandbox wallet credit of ₹${numAmount} successful!`, type: 'success' });
          setAmount('');
          await fetchUser();
          await fetchUserTopUps();
        }
      }
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.error || err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic QR server URL for current entered amount
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    getUpiUrl('generic')
  )}`;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Add Cash</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Instant UPI
            </span>
          </div>
          <p className="mt-1 text-sm text-[#64748B]">
            Transfer via PhonePe, Paytm, or scan QR code to recharge your wallet balance.
          </p>
        </div>

        {/* Current Balance Pill */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3.5 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center">
            <Wallet size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Available Balance</span>
            <span className="text-2xl font-black text-[#0F172A]">
              ₹{((user?.walletBalance || 0) / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Global Status Message Banner */}
      {statusMsg.text && (
        <div
          className={`p-4 rounded-2xl border shadow-sm transition-all ${
            statusMsg.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {statusMsg.type === 'error' ? (
                <AlertCircle size={22} className="shrink-0 text-red-600" />
              ) : statusMsg.type === 'success' ? (
                <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
              ) : (
                <Smartphone size={22} className="shrink-0 text-[#4A3AFF] animate-pulse" />
              )}
              <div>
                <p className="text-sm font-bold">{statusMsg.text}</p>
                {statusMsg.appName && (
                  <p className="text-xs text-indigo-700 mt-0.5">
                    UPI ID ({currentChannel?.upiId || 'cashly@upi'}) was copied to clipboard. After payment, copy the 12-digit UTR and paste in Step 3 below.
                  </p>
                )}
              </div>
            </div>

            {statusMsg.primaryUrl && (
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={statusMsg.primaryUrl}
                  className="px-3.5 py-1.5 bg-[#4A3AFF] text-white text-xs font-bold rounded-xl hover:bg-[#3D2EE0] transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Re-open {statusMsg.appName}</span>
                  <ArrowUpRight size={13} />
                </a>
                <a
                  href={statusMsg.genericUrl}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition text-center"
                >
                  Any UPI
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Flow Card */}
      <div className="space-y-6">

        {/* STEP 1: ENTER AMOUNT */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#4A3AFF] text-white text-xs font-black flex items-center justify-center shadow-md shadow-[#4A3AFF]/30">
                1
              </span>
              <h3 className="font-extrabold text-[#0F172A] text-lg">Enter Deposit Amount</h3>
            </div>
            <span className="text-xs font-bold text-gray-400">
              Min: ₹{minAmount} • Max: ₹{maxAmount.toLocaleString()}
            </span>
          </div>

          <div>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#4A3AFF] font-black text-2xl transition">
                ₹
              </span>
              <input
                id="deposit-amount-input"
                type="number"
                min={minAmount}
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="block w-full rounded-2xl border-2 border-gray-200 py-3.5 pl-11 pr-4 text-2xl font-black text-[#0F172A] placeholder:text-gray-300 focus:border-[#4A3AFF] focus:ring-4 focus:ring-[#4A3AFF]/10 focus:outline-none transition shadow-inner"
              />
            </div>

            {/* Quick Amount Select Chips */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                Quick:
              </span>
              {quickAmounts.map((amt) => {
                const isSelected = Number(amount) === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 active:scale-95 cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#4A3AFF] text-white shadow-md shadow-[#4A3AFF]/25 ring-2 ring-[#4A3AFF]/20'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                    <span>+₹{amt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP 2: CHOOSE PAYMENT METHOD (DIRECT PHONEPE & PAYTM REDIRECT) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-gray-100 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#4A3AFF] text-white text-xs font-black flex items-center justify-center shadow-md shadow-[#4A3AFF]/30">
                2
              </span>
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-lg">Instant 1-Click Pay</h3>
                <p className="text-xs text-gray-500">
                  Tap to open PhonePe or Paytm with your entered amount pre-filled
                </p>
              </div>
            </div>

            {amount && Number(amount) >= minAmount ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                <span>Amount ₹{amount} Ready</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-gray-400">
                Enter amount in Step 1
              </span>
            )}
          </div>

          {/* Primary 1-Click App Cards: PhonePe & Paytm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* PhonePe Card Button */}
            <button
              type="button"
              onClick={() => handleAppPay('phonepe')}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#5F259F] via-[#521e8e] to-[#3f1370] hover:from-[#6b2ab3] hover:to-[#4c1785] text-white shadow-lg shadow-[#5F259F]/25 hover:shadow-xl hover:shadow-[#5F259F]/35 transition-all duration-200 active:scale-[0.98] cursor-pointer border border-white/10 text-left overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <PhonePeIcon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-purple-100 border border-white/10">
                  Direct Redirect
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-bold text-purple-200 block uppercase tracking-wider">
                  Pay via
                </span>
                <span className="text-xl font-black text-white block tracking-tight">
                  PhonePe
                </span>

                {amount && Number(amount) >= minAmount ? (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-sm">
                    <span>Pay ₹{amount}</span>
                    <ArrowRight size={13} strokeWidth={3} />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-purple-200/80 block mt-1">
                    Tap to launch with amount
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-purple-200">
                <span>Opens PhonePe app</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>

            {/* Paytm Card Button */}
            <button
              type="button"
              onClick={() => handleAppPay('paytm')}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#002970] via-[#001f5c] to-[#00133d] hover:from-[#003894] hover:to-[#001f5c] text-white shadow-lg shadow-[#002970]/25 hover:shadow-xl hover:shadow-[#002970]/35 transition-all duration-200 active:scale-[0.98] cursor-pointer border border-[#00BAF2]/30 text-left overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-[#00BAF2]/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <PaytmIcon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00BAF2]/20 text-[#00BAF2] border border-[#00BAF2]/30">
                  Direct Redirect
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-bold text-cyan-200 block uppercase tracking-wider">
                  Pay via
                </span>
                <span className="text-xl font-black text-white block tracking-tight">
                  Paytm
                </span>

                {amount && Number(amount) >= minAmount ? (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00BAF2] text-slate-950 font-black text-xs shadow-sm">
                    <span>Pay ₹{amount}</span>
                    <ArrowRight size={13} strokeWidth={3} />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-cyan-200/80 block mt-1">
                    Tap to launch with amount
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-cyan-200">
                <span>Opens Paytm app</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Any Other UPI App Button (GPay, BHIM, CRED) */}
          <button
            type="button"
            onClick={() => handleAppPay('generic')}
            className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-[#4A3AFF]" />
              <span>Other UPI Apps (Google Pay, BHIM, CRED, Amazon Pay)</span>
            </div>
            <div className="flex items-center gap-1 text-[#4A3AFF]">
              <span>{amount && Number(amount) >= minAmount ? `Pay ₹${amount}` : 'Open App'}</span>
              <ArrowUpRight size={14} />
            </div>
          </button>

          {/* Or Scan QR Code & Copy UPI Section */}
          <div className="pt-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-gray-50 border border-gray-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <QrCode size={16} className="text-[#4A3AFF]" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Scan QR / Transfer via UPI ID
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Shuffle / Rotate Button (Available when multiple active QR channels are configured) */}
                  {paymentSetting?.hasMultipleChannels && (
                    <button
                      type="button"
                      onClick={() => fetchPaymentSettings(true)}
                      disabled={shuffling}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-gray-50 text-[#4A3AFF] border border-[#4A3AFF]/20 text-[11px] font-bold transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                      title="Rotate to another available QR code"
                    >
                      <RefreshCw size={12} className={shuffling ? 'animate-spin' : ''} />
                      <span>{shuffling ? 'Rotating...' : 'Switch QR'}</span>
                    </button>
                  )}

                  {currentChannel?.qrCodeImage && amount && Number(amount) >= minAmount && (
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setQrMode('default')}
                        className={`px-2 py-0.5 rounded-lg transition ${
                          qrMode === 'default'
                            ? 'bg-[#4A3AFF] text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        Uploaded QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrMode('dynamic')}
                        className={`px-2 py-0.5 rounded-lg transition ${
                          qrMode === 'dynamic'
                            ? 'bg-[#4A3AFF] text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        ₹{amount} QR
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* QR Code Graphic */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-white rounded-2xl shadow-sm border border-gray-200 inline-block">
                    <img
                      src={
                        qrMode === 'dynamic' && amount && Number(amount) >= minAmount
                          ? dynamicQrUrl
                          : getImageUrl(currentChannel?.qrCodeImage) || dynamicQrUrl
                      }
                      alt="UPI Payment QR Code"
                      className="w-40 h-40 object-contain rounded-xl"
                      onError={(e) => {
                        if (dynamicQrUrl && e.currentTarget.src !== dynamicQrUrl) {
                          e.currentTarget.src = dynamicQrUrl;
                        }
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 mt-1.5">
                    {qrMode === 'dynamic' && amount && Number(amount) >= minAmount
                      ? `Pre-filled with ₹${amount}`
                      : currentChannel?.upiName || 'The Cashly Payments'}
                  </p>
                </div>

                {/* UPI Copy Box & Instructions */}
                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      UPI ID (VPA)
                    </label>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white shadow-sm">
                      <div className="overflow-hidden pr-2">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                          Payee ID ({currentChannel?.title || 'UPI'})
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 select-all truncate block">
                          {currentChannel?.upiId || 'cashly@upi'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3.5 py-1.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 cursor-pointer"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200/80 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles size={13} className="text-[#4A3AFF]" />
                      Payee Name:
                    </p>
                    <p className="font-extrabold text-slate-900">
                      {currentChannel?.upiName || 'The Cashly Payments'}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Copy UPI ID, open PhonePe/Paytm, pay ₹{amount || 'the deposit amount'}, and copy the 12-digit UTR.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: SUBMIT 12-DIGIT UTR FOR VERIFICATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-gray-100 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#4A3AFF] text-white text-xs font-black flex items-center justify-center shadow-md shadow-[#4A3AFF]/30">
                3
              </span>
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-lg">Verify & Credit Wallet</h3>
                <p className="text-xs text-gray-500">
                  Enter the 12-digit UTR from your payment receipt to complete deposit
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowUtrHelp(!showUtrHelp)}
              className="text-xs font-bold text-[#4A3AFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>Where is UTR?</span>
            </button>
          </div>

          {/* Collapsible Where is UTR Help Box */}
          {showUtrHelp && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-2">
              <p className="font-extrabold flex items-center gap-1.5">
                <Info size={14} className="text-[#4A3AFF]" />
                How to find the 12-digit UTR / Reference Number:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-indigo-800 font-medium">
                <li>
                  <strong>PhonePe:</strong> Open the payment receipt &rarr; Look for <strong>"UTR"</strong> or <strong>"UPI Ref ID"</strong> (starts with numbers like 4289...).
                </li>
                <li>
                  <strong>Paytm:</strong> Go to Passbook/History &rarr; Tap the transaction &rarr; Copy the 12-digit <strong>"UPI Ref No"</strong>.
                </li>
                <li>
                  <strong>Google Pay:</strong> Tap the payment transaction &rarr; Scroll down to <strong>"UPI transaction ID"</strong>.
                </li>
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmitManual} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Deposit Amount Display / Input */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Amount Deposited (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 font-extrabold text-base">₹</span>
                  <input
                    type="number"
                    required
                    min={minAmount}
                    max={maxAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    className="block w-full rounded-2xl border border-gray-200 py-3 pl-8 pr-4 text-base font-extrabold text-[#0F172A] focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] focus:outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Must match the amount sent in PhonePe / Paytm.</p>
              </div>

              {/* 12-Digit UTR Input */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  12-Digit UTR / Reference No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/\s+/g, ''))}
                  placeholder="e.g. 428912345678"
                  className="block w-full rounded-2xl border border-gray-200 py-3 px-4 text-base font-mono font-bold text-[#0F172A] focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] focus:outline-none transition uppercase placeholder:font-sans placeholder:font-normal"
                />
                <p className="text-[11px] text-gray-400 mt-1">12-digit number copied from your receipt.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !amount || !utr}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4A3AFF] via-[#5C43FF] to-[#2563EB] hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-[#4A3AFF]/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Submitting Deposit...</span>
                </>
              ) : (
                <>
                  <span>Submit Deposit Request (₹{amount || '0'})</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Sandbox Dev Mode Toggle */}
          <div className="pt-2 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowSandbox(!showSandbox)}
              className="text-[11px] font-bold text-gray-400 hover:text-gray-600 underline cursor-pointer"
            >
              {showSandbox ? 'Hide Sandbox Test Option' : 'Developer Sandbox Mode'}
            </button>

            {showSandbox && (
              <div className="mt-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <ShieldCheck size={16} />
                  <span>Sandbox Instant Credit Test</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  For development/testing: enter an amount in Step 1 and click below to simulate an immediate credit without bank verification.
                </p>
                <button
                  type="button"
                  onClick={handleSandboxPay}
                  disabled={submitting || !amount}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  Instant Sandbox Credit ₹{amount || '0'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Deposit History */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-[#0F172A]">My Deposit Requests</h3>
          <button
            type="button"
            onClick={fetchUserTopUps}
            className="text-xs font-bold text-[#4A3AFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {userTopUps.map((item) => (
            <div key={item._id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-[#0F172A]">
                    ₹{(item.amount / 100).toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status === 'pending' && <Clock size={11} />}
                    {item.status === 'verified' && <CheckCircle2 size={11} />}
                    {item.status === 'failed' && <AlertCircle size={11} />}
                    <span className="capitalize">{item.status}</span>
                  </span>
                </div>

                <div className="text-xs text-gray-500 font-mono">
                  UTR: <span className="font-bold text-slate-700">{item.utr || item.gatewayReference || '-'}</span>
                </div>
                <div className="text-[11px] text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                </div>

                {item.rejectionReason && (
                  <div className="text-xs text-red-500 font-medium">
                    Note: {item.rejectionReason}
                  </div>
                )}
              </div>

              {item.status === 'verified' && (
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-600 block">Credited to Wallet</span>
                </div>
              )}
            </div>
          ))}

          {userTopUps.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">
              No deposit requests yet. Top up your balance to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCash;

