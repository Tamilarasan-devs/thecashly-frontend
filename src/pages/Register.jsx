import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, X, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState(''); // 'name' | 'email' | 'password' | 'general' | ''
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

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
    if (!email.trim()) {
      setError('Please enter your email address.');
      setFieldError('email');
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
      const res = await register(name.trim(), email.trim(), password);
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldError === 'email') {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dizbpr8pc/image/upload/v1791378622/bg_zm0475.png')" }}
      >
      </div>

      <div className="relative z-10 w-full max-w-md px-5 py-8">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-[20px] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200">
            <div className="w-12 h-12 bg-white rounded-[14px] flex items-center justify-center shadow-inner">
              <Wallet size={28} className="text-[#4A3AFF]" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Form Container (No Card) */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Join Cashly</h1>
            <p className="text-gray-700 text-sm font-medium">Create an account to start earning</p>
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
                {fieldError === 'email' && error.includes('already exists') && (
                  <Link 
                    to="/login" 
                    className="inline-block mt-2 text-xs font-bold text-[#4A3AFF] hover:underline"
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
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <User size={18} className={fieldError === 'name' ? 'text-red-500' : 'text-gray-500'} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  className={`w-full bg-white/60 border ${
                    fieldError === 'name' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-[#4A3AFF]'
                  } text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm`}
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
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Mail size={18} className={fieldError === 'email' ? 'text-red-500' : 'text-gray-500'} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email"
                  className={`w-full bg-white/60 border ${
                    fieldError === 'email' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-[#4A3AFF]'
                  } text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm`}
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                />
              </div>
              {fieldError === 'email' && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Lock size={18} className={fieldError === 'password' ? 'text-red-500' : 'text-gray-500'} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Create a password"
                  className={`w-full bg-white/60 border ${
                    fieldError === 'password' 
                      ? 'border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-[#4A3AFF]'
                  } text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-11 focus:outline-none focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm`}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0F172A] text-white rounded-2xl py-4 text-sm font-extrabold shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm font-medium text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-gray-900 hover:underline decoration-2 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
