import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
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

      <div className="relative z-10 w-full max-w-md px-5">
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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-700 text-sm font-medium">Log in to access your dashboard</p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-2xl bg-red-100 border border-red-200 p-4 text-sm font-medium text-red-700 backdrop-blur-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email"
                  className="w-full bg-white/60 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Enter your password"
                  className="w-full bg-white/60 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <a href="#" className="text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0F172A] text-white rounded-2xl py-4 text-sm font-extrabold shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} strokeWidth={3} />}
            </button>
            
            {/* Quick Login Buttons for Development/Testing */}
            <div className="pt-4 mt-4 border-t border-gray-300">
              <p className="text-xs font-medium text-gray-600 text-center mb-3">Quick Login (Testing Only)</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('tamilarasan@gmail.com');
                    setPassword('admin');
                  }}
                  className="flex-1 bg-[#4A3AFF] hover:bg-[#3b2ec2] text-white rounded-xl py-2.5 text-xs font-bold transition-colors shadow-sm"
                >
                  Fill Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('user@example.com');
                    setPassword('password');
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-2.5 text-xs font-bold transition-colors shadow-sm"
                >
                  Fill Casual
                </button>
              </div>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm font-medium text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-gray-900 hover:underline decoration-2 underline-offset-2">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
