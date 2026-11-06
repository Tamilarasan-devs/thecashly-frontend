import React from 'react';

export const CashlyLogo = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cashlyBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="cashlyCArc" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="40%" stopColor="#2563EB" />
          <stop offset="80%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        <linearGradient id="cashlyArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <filter id="cashlyNeonGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect x="4" y="4" width="92" height="92" rx="26" fill="url(#cashlyBgGrad)" />
      <rect x="4.5" y="4.5" width="91" height="91" rx="25.5" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.35" />

      <circle cx="50" cy="50" r="38" stroke="url(#cashlyCArc)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.3" />

      <g filter="url(#cashlyNeonGlow)">
        <path 
          d="M 64 34
             C 58 24, 46 22, 36 26
             C 23 31, 19 46, 22 60
             C 25 73, 38 80, 52 79
             C 61 78, 68 73, 71 66
             C 72.5 63, 70.5 59.5, 67 59.5
             C 64.5 59.5, 62.5 61, 60.5 63.5
             C 54.5 70, 41 68, 34 60
             C 28 53, 30 40, 39 34
             C 45 30, 54 30, 60 34
             C 62.5 35.8, 65.5 35, 66.8 32.5
             C 67.5 31, 66.5 29, 64 34 Z" 
          fill="url(#cashlyCArc)"
        />

        <path 
          d="M 40 60 L 67 33"
          stroke="url(#cashlyArrowGrad)" 
          strokeWidth="5" 
          strokeLinecap="round"
        />

        <path 
          d="M 53 31 H 71 C 72.1 31, 73 31.9, 73 33 V 51 L 66 44 L 66 38 L 60 38 Z" 
          fill="url(#cashlyArrowGrad)"
        />

        <circle cx="73" cy="31" r="3" fill="#FFFFFF" opacity="0.95" />
      </g>
    </svg>
  );
};

export default CashlyLogo;
