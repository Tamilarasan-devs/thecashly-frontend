import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Smartphone, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, X, Loader2, Ticket, CheckCircle2, Gift } from 'lucide-react';
import api from '../lib/axios';
import CashlyLogo from '../components/CashlyLogo';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || searchParams.get('referral') || '');
  const [showReferralInput, setShowReferralInput] = useState(Boolean(searchParams.get('ref') || searchParams.get('referral')));
  const [refInfo, setRefInfo] = useState({ valid: null, checking: false, referrerName: '' });
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState(''); // 'name' | 'phone' | 'password' | 'referralCode' | 'general' | ''
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate referral code when URL param is present or when user stops typing
  useEffect(() => {
    const code = referralCode.trim().toUpperCase();
    if (!code) {
      setRefInfo({ valid: null, checking: false, referrerName: '' });
      return;
    }

    const timer = setTimeout(async () => {
      setRefInfo(prev => ({ ...prev, checking: true }));
      try {
        const res = await api.get(`/auth/referral/validate/${encodeURIComponent(code)}`);
        if (res.data?.valid) {
          setRefInfo({ valid: true, checking: false, referrerName: res.data.data.referrerName });
          if (fieldError === 'referralCode') {
            setFieldError('');
            setError('');
          }
        } else {
          setRefInfo({ valid: false, checking: false, referrerName: '' });
        }
      } catch (err) {
        setRefInfo({ valid: false, checking: false, referrerName: '' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [referralCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      setFieldError('name');
      setShakeKey((k) => k + 1);
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      setFieldError('phone');
      setShakeKey((k) => k + 1);
      return;
    }
    if (!password) {
      setError('Please create a password.');
      setFieldError('password');
      setShakeKey((k) => k + 1);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setFieldError('password');
      setShakeKey((k) => k + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await register(name.trim(), cleanPhone, password, referralCode.trim().toUpperCase());
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.error || 'Failed to create account. Please try again.';
      const serverField = err.response?.data?.field || 'general';
      setError(serverMsg);
      setFieldError(serverField);
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (fieldError === 'name') {
      setFieldError('');
      setError('');
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (fieldError === 'phone') {
      setFieldError('');
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldError === 'password') {
      setFieldError('');
      setError('');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with High-Tech Indigo & Cyan Tinting and Contrast Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('https://res.cloudinary.com/nu6opo9c/image/upload/v1793888013/Glossy_Orange_Rupee_Finance_Template.png')" }}
      />
      {/* Royal Indigo & Cyan Gradient Tinting Overlays to match the new theme */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A]/85 via-[#1E1B4B]/70 to-[#0284C7]/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#0B0F19]/50 to-black/75 backdrop-blur-[1.5px]" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#06B6D4]/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[460px]">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center shadow-[0_12px_36px_rgba(6,182,212,0.25)] border border-cyan-400/30 transform hover:scale-105 transition-all duration-300">
            <CashlyLogo size={46} className="rounded-xl shadow-lg" />
          </div>
        </div>

        {/* Frosted Glass Card Container */}
        <div className="rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.35)] p-7 sm:p-9 transition-all">
          <div className="text-center mb-7">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mb-2">Join The Cashly</h1>
            <p className="text-slate-600 text-sm font-semibold">Create your account to start earning</p>
          </div>
          
          {error && (
            <div 
              key={shakeKey}
              className="mb-6 rounded-2xl bg-red-50/95 border border-red-200 p-4 text-sm font-medium text-red-800 backdrop-blur-md shadow-sm animate-shake flex items-start gap-3 transition-all"
            >
              <div className="p-1 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
                <AlertCircle size={18} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-red-900 text-xs uppercase tracking-wide mb-0.5">
                  Registration Notice
                </div>
                <div className="text-xs text-red-700 leading-relaxed font-medium">
                  {error}
                </div>
                {fieldError === 'phone' && error.includes('already exists') && (
                  <Link 
                    to="/login" 
                    className="inline-block mt-2 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    Already have an account? Sign in here &rarr;
                  </Link>
                )}
              </div>
              <button 
                type="button"
                onClick={() => { setError(''); setFieldError(''); }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <User size={18} className={fieldError === 'name' ? 'text-red-500' : 'text-slate-400'} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  className={`w-full bg-white/90 border ${
                    fieldError === 'name' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-cyan-500/20'
                  } text-slate-900 placeholder-slate-400 rounded-full py-3.5 pl-11 pr-4 focus:outline-none focus:bg-white transition-all font-medium shadow-sm text-sm`}
                  value={name}
                  onChange={handleNameChange}
                  autoComplete="name"
                />
              </div>
              {fieldError === 'name' && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider ml-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Smartphone size={18} className={fieldError === 'phone' ? 'text-red-500' : 'text-slate-400'} />
                </div>
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                  +91
                </div>
                <input 
                  type="tel" 
                  required
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  className={`w-full bg-white/90 border ${
                    fieldError === 'phone' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-cyan-500/20'
                  } text-slate-900 placeholder-slate-400 rounded-full py-3.5 pl-20 pr-4 focus:outline-none focus:bg-white transition-all font-semibold tracking-wider shadow-sm text-sm`}
                  value={phone}
                  onChange={handlePhoneChange}
                  autoComplete="tel"
                />
              </div>
              {fieldError === 'phone' && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Lock size={18} className={fieldError === 'password' ? 'text-red-500' : 'text-slate-400'} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Create a password (min 6 chars)"
                  className={`w-full bg-white/90 border ${
                    fieldError === 'password' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-cyan-500/20'
                  } text-slate-900 placeholder-slate-400 rounded-full py-3.5 pl-11 pr-11 focus:outline-none focus:bg-white transition-all font-medium shadow-sm text-sm`}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldError === 'password' && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
            </div>

            {/* Referral Code (Collapsible) */}
            {!showReferralInput ? (
              <div className="pt-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setShowReferralInput(true)}
                  className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors flex items-center gap-1.5"
                >
                  <Ticket size={14} />
                  Have a referral code?
                  <span className="text-[11px] font-black text-emerald-600 flex items-center gap-0.5 ml-1">
                    <Gift size={11} /> +₹100 bonus
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Referral Code <span className="lowercase font-medium text-slate-400">(optional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                      <Gift size={12} /> Get ₹100 Bonus
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReferralInput(false);
                        setReferralCode('');
                        setRefInfo({ valid: null, checking: false, referrerName: '' });
                      }}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                    <Ticket size={18} className={
                      fieldError === 'referralCode' 
                        ? 'text-red-500' 
                        : refInfo.valid 
                          ? 'text-emerald-500' 
                          : 'text-slate-400'
                    } />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. CASH9F2A"
                    maxLength={15}
                    className={`w-full uppercase bg-white/90 border ${
                      fieldError === 'referralCode' || refInfo.valid === false
                        ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                        : refInfo.valid
                          ? 'border-emerald-400 bg-emerald-50/30 ring-2 ring-emerald-100 focus:border-emerald-500 focus:ring-emerald-200'
                          : 'border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-cyan-500/20'
                    } text-slate-900 placeholder-slate-400 rounded-full py-3.5 pl-11 pr-10 focus:outline-none focus:bg-white transition-all font-bold tracking-wider shadow-sm text-sm`}
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value.toUpperCase());
                      if (fieldError === 'referralCode') {
                        setFieldError('');
                        setError('');
                      }
                    }}
                    autoComplete="off"
                    autoFocus
                  />
                  {refInfo.checking && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                    </div>
                  )}
                  {refInfo.valid && !refInfo.checking && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-emerald-500">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>

                {refInfo.valid && (
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-1 ml-1 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Code applied! Referred by <span className="font-extrabold">{refInfo.referrerName}</span>
                  </p>
                )}
                {refInfo.valid === false && !refInfo.checking && referralCode.trim() && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={13} /> Invalid referral code. Please check or leave blank.
                  </p>
                )}
                {fieldError === 'referralCode' && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={13} /> {error}
                  </p>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1E1B4B] via-[#2563EB] to-[#06B6D4] text-white rounded-full py-4 text-sm font-black shadow-[0_10px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_30px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed tracking-wide cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-[#0284C7] hover:text-[#0369A1] hover:underline decoration-2 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
