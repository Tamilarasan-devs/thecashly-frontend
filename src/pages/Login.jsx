import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Smartphone, Lock, ArrowRight, Eye, EyeOff, AlertCircle, X, Loader2 } from 'lucide-react';
import CashlyLogo from '../components/CashlyLogo';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState(''); // 'phone' | 'password' | 'all' | 'general' | ''
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldError('');

    const rawPhone = phone.trim();
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      setFieldError('phone');
      setShakeKey((k) => k + 1);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      setFieldError('password');
      setShakeKey((k) => k + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await login(cleanPhone, password);
      if (res.success) {
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const serverMsg = err.response?.data?.error || 'Unable to sign in. Please verify your connection and try again.';
      const serverField = err.response?.data?.field || 'general';
      setError(serverMsg);
      setFieldError(serverField);
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (fieldError === 'phone' || fieldError === 'all') {
      setFieldError('');
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldError === 'password' || fieldError === 'all') {
      setFieldError('');
      setError('');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('https://res.cloudinary.com/ns2sgvez/image/upload/v1793950832/bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center shadow-[0_12px_36px_rgba(6,182,212,0.25)] border border-cyan-400/30 transform hover:scale-105 transition-all duration-300">
            <CashlyLogo size={46} className="rounded-xl shadow-lg" />
          </div>
        </div>

        {/* Frosted Glass Card Container */}
        <div className="rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.35)] p-7 sm:p-9 transition-all">
          <div className="text-center mb-7">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-600 text-sm font-semibold">Log in with your mobile number</p>
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
                  {fieldError === 'phone' ? 'Phone Not Found' : fieldError === 'password' ? 'Incorrect Password' : 'Login Error'}
                </div>
                <div className="text-xs text-red-700 leading-relaxed font-medium">
                  {error}
                </div>
                {fieldError === 'phone' && (
                  <Link 
                    to="/register" 
                    className="inline-block mt-2 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    Don't have an account? Sign up here &rarr;
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
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider ml-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Smartphone size={18} className={fieldError === 'phone' || fieldError === 'all' ? "text-red-500" : "text-slate-400"} />
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
                    fieldError === 'phone' || fieldError === 'all' 
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
                  <AlertCircle size={13} /> Check mobile number
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Lock size={18} className={fieldError === 'password' || fieldError === 'all' ? "text-red-500" : "text-slate-400"} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Enter your password"
                  className={`w-full bg-white/90 border ${
                    fieldError === 'password' || fieldError === 'all' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-cyan-500/20'
                  } text-slate-900 placeholder-slate-400 rounded-full py-3.5 pl-11 pr-11 focus:outline-none focus:bg-white transition-all font-medium shadow-sm text-sm`}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
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
                  <AlertCircle size={13} /> Check password
                </p>
              )}
            </div>

            <div className="flex items-center justify-end pt-0.5">
              <a href="#" className="text-xs font-bold text-slate-600 hover:text-[#0284C7] transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1E1B4B] via-[#2563EB] to-[#06B6D4] text-white rounded-full py-4 text-sm font-black shadow-[0_10px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_30px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed tracking-wide cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-[#0284C7] hover:text-[#0369A1] hover:underline decoration-2 underline-offset-2">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
