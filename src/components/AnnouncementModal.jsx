import React, { useEffect, useRef } from 'react';
import { X, Sparkles, ArrowRight, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AnnouncementModal = ({ isOpen, onClose, plans = [] }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Basic focus trap - focus the modal when opened
      if (modalRef.current) modalRef.current.focus();
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-[#4A3AFF]/80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col outline-none overscroll-contain"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">TheCashly</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#0F172A] transition-colors focus:ring-2 focus:ring-[var(--color-navy)] focus:outline-none"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-10 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-[var(--color-gold-light)] to-[#4A3AFF] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[var(--color-gold-light)]/50">
            <Sparkles size={36} className="text-white" />
          </div>
          
          <h2 id="modal-title" className="text-3xl sm:text-4xl font-black text-[#0F172A] mb-4 tracking-tight max-w-xl">
            Welcome to the New TheCashly Experience!
          </h2>
          
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-8">
            We've redesigned our platform to give you a more premium, faster, and more rewarding journey. Discover exciting new features and seamless navigation.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 max-w-lg w-full mb-8 shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-4 text-lg">🚀 What's New?</h3>
            <ul className="text-sm text-gray-600 text-left space-y-3 font-medium">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3 text-lg leading-none">✓</span>
                Premium solid design with improved readability
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3 text-lg leading-none">✓</span>
                Lightning-fast dashboard and smoother navigation
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3 text-lg leading-none">✓</span>
                Exclusive high-yield opportunities available now
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => {
              onClose();
              navigate('/plans');
            }}
            className="w-full max-w-sm py-4 rounded-xl bg-[#4A3AFF] text-white font-bold shadow-lg hover:bg-[#64748B] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-navy)] focus:outline-none"
          >
            <span>Explore Opportunities</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 rounded-b-3xl">
          <Link 
            to="/services/terms" 
            onClick={onClose}
            className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-navy transition-colors"
          >
            <Info size={16} />
            <span>Withdrawal rules & plan terms</span>
          </Link>
          
          <button 
            onClick={onClose}
            className="text-sm font-bold text-gray-500 hover:text-navy px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-navy focus:outline-none"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
