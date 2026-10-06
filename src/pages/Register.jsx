import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2529&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-5 py-8">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[20px] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20">
            <div className="w-12 h-12 bg-white rounded-[14px] flex items-center justify-center shadow-inner">
              <Wallet size={28} className="text-[#4A3AFF]" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Join Cashly</h1>
            <p className="text-white/70 text-sm font-medium">Create an account to start earning</p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-2xl bg-red-500/20 border border-red-500/30 p-4 text-sm font-medium text-red-200 backdrop-blur-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/80 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <User size={18} className="text-white/50" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/80 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Mail size={18} className="text-white/50" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/80 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <Lock size={18} className="text-white/50" />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Create a password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-[#0F172A] rounded-2xl py-4 text-sm font-extrabold shadow-[0_10px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_25px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} strokeWidth={3} />}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm font-medium text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-white hover:underline decoration-2 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
