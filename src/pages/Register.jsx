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
            <div className="mb-6 rounded-2xl bg-red-100 border border-red-200 p-4 text-sm font-medium text-red-700 backdrop-blur-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  className="w-full bg-white/60 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  className="w-full bg-white/60 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition-all font-medium backdrop-blur-sm shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0F172A] text-white rounded-2xl py-4 text-sm font-extrabold shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} strokeWidth={3} />}
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
