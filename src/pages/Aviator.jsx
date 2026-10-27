import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Menu, 
  MessageSquare, 
  HelpCircle, 
  X, 
  Settings, 
  Volume2, 
  VolumeX, 
  Check, 
  MoreHorizontal,
  ChevronRight,
  Hand
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// --- Iconic Aviator Monoplane SVG ---
const AviatorPlane = ({ className = "w-14 h-8" }) => (
  <svg viewBox="0 0 110 55" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Spinning Propeller */}
    <ellipse cx="104" cy="28" rx="2" ry="14" fill="#FCA5A5" className="animate-spin origin-[104px_28px]" />
    <circle cx="104" cy="28" r="3" fill="#DC2626" />
    
    {/* Engine Cowling */}
    <path d="M88 22 C96 23, 102 25, 102 28 C102 31, 96 33, 88 34 Z" fill="#DC2626" />
    
    {/* Main Fuselage */}
    <path d="M22 26 C42 21, 70 22, 90 23 C92 25, 92 31, 90 33 C70 34, 42 33, 22 30 Z" fill="#EF4444" />
    
    {/* Cockpit Windshield */}
    <path d="M62 22 L72 22 C70 18, 62 18, 58 22 Z" fill="#BAE6FD" opacity="0.85" />
    <circle cx="64" cy="20" r="2.5" fill="#FFFFFF" />
    
    {/* Upper Wing */}
    <path d="M46 12 C64 12, 82 13, 86 16 C82 18, 62 18, 44 16 C40 14, 42 12, 46 12 Z" fill="#DC2626" />
    <line x1="56" y1="16" x2="60" y2="23" stroke="#991B1B" strokeWidth="2" />
    <line x1="74" y1="16" x2="72" y2="23" stroke="#991B1B" strokeWidth="2" />
    
    {/* Tail Fin & Rudder */}
    <path d="M14 10 C22 10, 26 18, 26 27 L16 27 C12 20, 10 12, 14 10 Z" fill="#DC2626" />
    <path d="M10 26 L22 26 L18 30 L6 30 Z" fill="#B91C1C" />
    
    {/* Landing Skids */}
    <line x1="68" y1="33" x2="64" y2="42" stroke="#7F1D1D" strokeWidth="2" />
    <line x1="80" y1="33" x2="76" y2="42" stroke="#7F1D1D" strokeWidth="2" />
    <line x1="58" y1="42" x2="86" y2="42" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    <circle cx="70" cy="42" r="3" fill="#0F172A" />
  </svg>
);

// Sample simulated active bets for social proof
const SIMULATED_BETS = [
  { user: 'p***9', amount: 200, multi: 1.84, win: 368, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop' },
  { user: 'a***4', amount: 500, multi: 2.15, win: 1075, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop' },
  { user: 'r***1', amount: 100, multi: 1.35, win: 135, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&h=60&fit=crop' },
  { user: 'k***8', amount: 1000, multi: null, win: null, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop' },
  { user: 'm***3', amount: 50, multi: 3.42, win: 171, avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=60&h=60&fit=crop' },
  { user: 's***7', amount: 2000, multi: 1.48, win: 2960, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' }
];

// --- Spribe Style Bet Panel Component ---
const BetPanel = ({ 
  panelId, 
  gameState, 
  balance, 
  socket, 
  serverMulti,
  onClose,
  canClose
}) => {
  const [tabMode, setTabMode] = useState('bet'); // 'bet' | 'auto'
  const [betAmount, setBetAmount] = useState(5.00);
  const [autoCashout, setAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.00);
  const [autoBet, setAutoBet] = useState(false);
  
  const [betStatus, setBetStatus] = useState('idle'); // 'idle' | 'placed' | 'active' | 'cashed_out'
  const [betId, setBetId] = useState(null);
  const [winAmount, setWinAmount] = useState(0);

  const handlePlaceBet = useCallback(() => {
    if (gameState !== 'waiting') return;
    if (balance < betAmount) {
      toast.error('Insufficient wallet balance!');
      if (autoBet) setAutoBet(false);
      return;
    }
    
    setBetStatus('placed'); 
    socket.emit('place_bet', { 
      points: betAmount,
      autoCashout: (tabMode === 'auto' && autoCashout) ? autoCashoutValue : null
    }, (res) => {
      if (res.success) {
        setBetId(res.betId);
      } else {
        toast.error(res.message || 'Bet failed');
        setBetStatus('idle');
        setAutoBet(false);
      }
    });
  }, [gameState, balance, betAmount, tabMode, autoCashout, autoCashoutValue, autoBet, socket]);

  const handleCancelBet = useCallback(() => {
    if (betStatus === 'placed' && gameState === 'waiting') {
      setBetStatus('idle');
      setBetId(null);
    }
  }, [betStatus, gameState]);

  const handleCashout = useCallback(() => {
    if (gameState !== 'flying' || betStatus !== 'active') return;
    
    socket.emit('cashout', { betId }, (res) => {
      if (res.success) {
        setBetStatus('cashed_out');
        setWinAmount(res.winAmount);
        toast.success(`Cashed out at ${(res.winAmount / betAmount).toFixed(2)}x (+₹${res.winAmount})!`);
      } else {
        console.error(res.message);
      }
    });
  }, [gameState, betStatus, betId, betAmount, socket]);

  useEffect(() => {
    if (gameState === 'flying' && betStatus === 'placed') {
      setBetStatus('active');
    }
    if (gameState === 'crashed') {
      if (betStatus === 'active') {
        setBetStatus('idle');
        setBetId(null);
      }
    }
    if (gameState === 'waiting') {
      if (betStatus === 'cashed_out' || betStatus === 'idle') {
        setBetStatus('idle');
        setWinAmount(0);
        setBetId(null);
        if (autoBet) {
          handlePlaceBet();
        }
      }
    }
  }, [gameState, betStatus, autoBet, handlePlaceBet]);

  useEffect(() => {
    if (!socket) return;
    const onAutoCashout = (data) => {
      if (data.betId === betId) {
        setBetStatus('cashed_out');
        setWinAmount(data.winAmount);
        toast.success(`Auto cashed out: ₹${data.winAmount}`);
      }
    };
    socket.on('auto_cashed_out', onAutoCashout);
    return () => socket.off('auto_cashed_out', onAutoCashout);
  }, [socket, betId]);

  const adjustBet = (delta) => {
    if (betStatus !== 'idle') return;
    setBetAmount(prev => Math.max(1, Math.round((prev + delta) * 100) / 100));
  };

  return (
    <div className="bg-[#181A1D] rounded-[20px] p-3 border border-white/5 shadow-xl relative overflow-hidden">
      
      {/* Top Segmented Controls: Bet / Auto & Close button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 flex justify-center">
          <div className="bg-[#121417] p-1 rounded-full flex gap-1 w-44 shadow-inner">
            <button
              onClick={() => setTabMode('bet')}
              className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${
                tabMode === 'bet' ? 'bg-[#25282D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Bet
            </button>
            <button
              onClick={() => setTabMode('auto')}
              className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${
                tabMode === 'auto' ? 'bg-[#25282D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Auto
            </button>
          </div>
        </div>

        {canClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#25282D] hover:bg-[#32363D] flex items-center justify-center text-gray-400 hover:text-white transition shrink-0 ml-2"
            title="Remove bet panel"
          >
            <Minus size={14} />
          </button>
        )}
      </div>

      {/* Auto Settings Drawer */}
      {tabMode === 'auto' && (
        <div className="mb-3 p-2 rounded-xl bg-[#121417] border border-white/5 flex items-center justify-between text-xs text-gray-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={autoBet} 
              onChange={(e) => setAutoBet(e.target.checked)} 
              disabled={betStatus === 'active'}
              className="accent-[#22c55e] w-3.5 h-3.5 rounded"
            />
            <span className="font-bold">Auto Bet</span>
          </label>

          <div className="flex items-center gap-1.5">
            <label className="flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoCashout} 
                onChange={(e) => setAutoCashout(e.target.checked)} 
                disabled={betStatus === 'active'}
                className="accent-[#22c55e] w-3.5 h-3.5 rounded"
              />
              <span className="font-bold">Auto Cashout</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="1.01"
              value={autoCashoutValue}
              onChange={(e) => setAutoCashoutValue(Number(e.target.value))}
              disabled={!autoCashout || betStatus === 'active'}
              className="w-14 bg-[#1E2024] border border-white/10 rounded-md px-1.5 py-0.5 text-center font-mono font-bold text-white text-xs disabled:opacity-40"
            />
            <span className="text-gray-400 font-bold">x</span>
          </div>
        </div>
      )}

      {/* Main Controls: Left Inputs & Right Green Action Button */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        
        {/* Left Column: Stepper & 2x2 Chips */}
        <div className="flex flex-col gap-2">
          {/* Amount Stepper */}
          <div className="bg-[#121417] border border-white/10 rounded-xl p-1.5 flex items-center justify-between shadow-inner">
            <button
              onClick={() => adjustBet(-1)}
              disabled={betStatus !== 'idle'}
              className="w-7 h-7 rounded-lg bg-[#25282D] hover:bg-[#32363D] disabled:opacity-30 flex items-center justify-center text-white font-bold transition"
            >
              <Minus size={14} />
            </button>
            <div className="text-center font-mono font-black text-white text-base">
              {betAmount.toFixed(2)}
            </div>
            <button
              onClick={() => adjustBet(1)}
              disabled={betStatus !== 'idle'}
              className="w-7 h-7 rounded-lg bg-[#25282D] hover:bg-[#32363D] disabled:opacity-30 flex items-center justify-center text-white font-bold transition"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Quick Amount Chips (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-1.5">
            {[100, 200, 500, 1000].map(amt => (
              <button
                key={amt}
                onClick={() => betStatus === 'idle' && setBetAmount(amt)}
                disabled={betStatus !== 'idle'}
                className="bg-[#121417] hover:bg-[#25282D] disabled:opacity-40 py-1.5 rounded-lg text-xs font-bold text-gray-300 border border-white/5 transition"
              >
                {amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Giant Green Bet / Cash Out Button */}
        <div className="h-full min-h-[92px]">
          {/* Idle: Waiting to Bet */}
          {betStatus === 'idle' && (
            <button
              onClick={handlePlaceBet}
              disabled={gameState !== 'waiting'}
              className={`w-full h-full rounded-[18px] flex flex-col items-center justify-center transition-all shadow-[0_6px_20px_rgba(34,197,94,0.3)] active:scale-95 border ${
                gameState === 'waiting'
                  ? 'bg-gradient-to-b from-[#22c55e] to-[#15803d] border-[#4ade80]/40 text-white cursor-pointer hover:brightness-105'
                  : 'bg-[#1e2920] border-[#166534]/30 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl font-black uppercase tracking-wide">
                {gameState === 'waiting' ? 'Bet' : 'Waiting'}
              </span>
              <span className="text-sm font-extrabold opacity-95 mt-0.5">
                {betAmount.toFixed(2)} INR
              </span>
            </button>
          )}

          {/* Placed: In Queue for Next Round */}
          {betStatus === 'placed' && (
            <button
              onClick={handleCancelBet}
              className="w-full h-full rounded-[18px] bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border border-[#F87171]/40 text-white flex flex-col items-center justify-center transition-all shadow-[0_6px_20px_rgba(239,68,68,0.3)] active:scale-95"
            >
              <span className="text-xl font-black uppercase tracking-wide">Cancel</span>
              <span className="text-xs font-bold opacity-90 mt-0.5">
                Waiting for round...
              </span>
            </button>
          )}

          {/* Active: Flight in Progress -> Orange Cash Out Button */}
          {betStatus === 'active' && (
            <button
              onClick={handleCashout}
              className="w-full h-full rounded-[18px] bg-gradient-to-b from-[#f59e0b] via-[#ea580c] to-[#c2410c] border border-[#fdba74]/50 text-white flex flex-col items-center justify-center transition-all shadow-[0_6px_25px_rgba(234,88,12,0.5)] active:scale-95 animate-pulse"
            >
              <span className="text-xl font-black uppercase tracking-wider drop-shadow-sm">Cash Out</span>
              <span className="text-lg font-black tracking-tight drop-shadow-md">
                {(betAmount * serverMulti).toFixed(2)} INR
              </span>
            </button>
          )}

          {/* Cashed Out Banner */}
          {betStatus === 'cashed_out' && (
            <div className="w-full h-full rounded-[18px] bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex flex-col items-center justify-center shadow-lg">
              <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-80">Won!</span>
              <span className="text-xl font-black text-emerald-400">₹{winAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};


// --- Main Aviator Screen ---
const Aviator = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('idle'); // 'waiting' | 'flying' | 'crashed'
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashMulti, setCrashMulti] = useState(1.0);
  const [waitingTimeLeft, setWaitingTimeLeft] = useState(0);
  const [recentCrashes, setRecentCrashes] = useState([
    1.32, 14.25, 1.00, 2.73, 1.38, 37.86, 1.36, 1.36, 6.46
  ]);
  
  // Dual panels toggle
  const [showSecondPanel, setShowSecondPanel] = useState(true);
  
  // Bottom tab
  const [bottomTab, setBottomTab] = useState('all'); // 'all' | 'prev' | 'top'
  
  // Rules / Menu modal
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);

  const animationRef = useRef(null);
  const localStartRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await api.get('/auth/me');
        if (profileRes.data.success) {
          setBalance(profileRes.data.data.walletBalance / 100);
        }
        
        const token = localStorage.getItem('token');
        const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://thecashly-backend.onrender.com', {
          auth: { token }
        });
        
        newSocket.on('connect', () => {
          console.log('Connected to Aviator Socket');
        });

        newSocket.on('game_state', (data) => {
          setGameState(data.state);
          
          if (data.state === 'waiting') {
            setMultiplier(1.0);
            if (data.waitingTime) {
              let ms = data.waitingTime;
              setWaitingTimeLeft((ms / 1000).toFixed(1));
              const int = setInterval(() => {
                ms -= 100;
                if (ms <= 0) {
                  clearInterval(int);
                  setWaitingTimeLeft("0.0");
                } else {
                  setWaitingTimeLeft((ms / 1000).toFixed(1));
                }
              }, 100);
            }
          } else if (data.state === 'flying') {
            setMultiplier(data.multiplier || 1.0);
            localStartRef.current = performance.now();
            startLocalAnimation();
          } else if (data.state === 'crashed') {
            stopLocalAnimation();
            const cp = data.crashPoint || data.multiplier || 1.0;
            setMultiplier(cp);
            setCrashMulti(cp);
            api.get('/auth/me').then(res => setBalance(res.data.data.walletBalance / 100));
          }

          if (data.recentCrashes && data.recentCrashes.length > 0) {
            setRecentCrashes(data.recentCrashes);
          }
        });

        newSocket.on('history_update', (history) => {
          if (history && history.length > 0) setRecentCrashes(history);
        });

        setSocket(newSocket);
        setLoading(false);

      } catch (err) {
        console.error('Aviator init error:', err);
        setLoading(false);
      }
    };

    init();

    return () => {
      stopLocalAnimation();
      if (socket) socket.disconnect();
    };
  }, []);

  const startLocalAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    const update = (time) => {
      if (!localStartRef.current) return;
      const elapsedSeconds = (time - localStartRef.current) / 1000;
      const currentMulti = 1 + Math.pow(elapsedSeconds * 1.5, 1.2) * 0.05;
      
      setMultiplier(currentMulti);
      animationRef.current = requestAnimationFrame(update);
    };
    animationRef.current = requestAnimationFrame(update);
  };

  const stopLocalAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Trajectory progress: 0 to 100%
  const maxVisualMulti = 8;
  const progressPercent = Math.min(85, Math.max(10, ((multiplier - 1) / (maxVisualMulti - 1)) * 80 + 15));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1117] flex items-center justify-center text-[#22c55e] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400">Loading Aviator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1117] text-white font-sans overflow-x-hidden flex flex-col pb-8">
      <Toaster position="top-center" />

      {/* ==================================================== */}
      {/* 1. TOP HEADER (Spribe Style) */}
      {/* ==================================================== */}
      <header className="flex items-center justify-between px-3.5 py-2.5 bg-[#14171E] border-b border-white/5 sticky top-0 z-40">
        
        {/* Left Side: Logo + Back | Deposit | Finger icon */}
        <div className="flex items-center gap-2">
          {/* Red Stylized Aviator Logo */}
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30">
            <span className="text-white font-black italic text-lg leading-none select-none">A</span>
          </div>

          <button 
            onClick={() => navigate('/games')} 
            className="text-white font-extrabold text-sm hover:text-gray-300 transition"
          >
            Back
          </button>

          <span className="text-gray-600 font-light">|</span>

          <button 
            onClick={() => navigate('/add-cash')} 
            className="text-white font-extrabold text-sm hover:text-[#22c55e] transition"
          >
            Deposit
          </button>

          <span className="text-gray-600 font-light">|</span>

          <button 
            onClick={() => setShowRulesModal(true)} 
            className="text-gray-400 hover:text-white transition p-1"
            title="How to play"
          >
            <Hand size={16} />
          </button>
        </div>

        {/* Right Side: Balance + Menu + Chat */}
        <div className="flex items-center gap-3">
          {/* Balance in Green */}
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#22C55E]">
              {balance.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-gray-400">INR</span>
          </div>

          {/* Hamburger Menu */}
          <button 
            onClick={() => setShowMenuDrawer(true)}
            className="text-gray-400 hover:text-white transition p-1"
            title="Menu"
          >
            <Menu size={18} />
          </button>

          {/* Chat Icon */}
          <button 
            onClick={() => toast('Live Chat will be available soon', { icon: '💬' })}
            className="text-gray-400 hover:text-white transition p-1"
            title="Chat"
          >
            <MessageSquare size={18} />
          </button>
        </div>

      </header>

      {/* ==================================================== */}
      {/* 2. MULTIPLIER HISTORY RIBBON (Color coded pills) */}
      {/* ==================================================== */}
      <div className="bg-[#101217] py-2 px-3 flex items-center gap-1.5 overflow-x-auto hide-scrollbar border-b border-white/5">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {recentCrashes.map((m, i) => {
            const num = Number(m);
            // Spribe color logic: <2x blue, 2-10x purple, 10x+ pink/magenta
            const isBlue = num < 2.0;
            const isPurple = num >= 2.0 && num < 10.0;
            const isPink = num >= 10.0;

            return (
              <div 
                key={i} 
                className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold shadow-sm border ${
                  isPink 
                    ? 'bg-[#38142b] text-[#f472b6] border-[#701a4e]' 
                    : isPurple 
                      ? 'bg-[#291738] text-[#c084fc] border-[#4c1d70]' 
                      : 'bg-[#14233c] text-[#38bdf8] border-[#1e3a6a]'
                }`}
              >
                {num.toFixed(2)}x
              </div>
            );
          })}
        </div>

        {/* History details button */}
        <button 
          onClick={() => toast('Detailed round history', { icon: '📜' })}
          className="ml-auto w-6 h-6 rounded-full bg-[#1C2028] hover:bg-[#2A2E38] flex items-center justify-center text-gray-400 hover:text-white transition shrink-0"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* ==================================================== */}
      {/* 3. MAIN CONTENT CONTAINER */}
      {/* ==================================================== */}
      <div className="max-w-md mx-auto w-full px-3 py-3 flex flex-col gap-3">
        
        {/* ==================================================== */}
        {/* 3A. GAME ARENA / FLIGHT CANVAS */}
        {/* ==================================================== */}
        <div className="relative w-full h-[255px] sm:h-[280px] bg-[#0A0C10] rounded-[22px] border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center">
          
          {/* Radiating Dark Sunburst Rays Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40" 
            style={{ 
              background: 'repeating-conic-gradient(from 0deg at 15% 85%, #0A0C10 0deg 9deg, #12151D 9deg 18deg)'
            }}
          />

          {/* Ambient Blue Glow in the Center */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-80"
            style={{
              background: 'radial-gradient(circle at 60% 45%, rgba(14, 116, 144, 0.35) 0%, rgba(2, 6, 23, 0) 70%)'
            }}
          />

          {/* Waiting State: Preparing Round */}
          {gameState === 'waiting' && (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-20 flex flex-col items-center"
            >
              <div className="w-14 h-14 mb-3 flex items-center justify-center bg-white/5 rounded-full border border-white/10 shadow-lg">
                <AviatorPlane className="w-10 h-6 -rotate-12 opacity-80" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-[#38BDF8] drop-shadow-md">
                WAITING FOR NEXT ROUND
              </p>
              <div className="text-4xl font-mono font-black text-white mt-1 drop-shadow-sm">
                {waitingTimeLeft}s
              </div>
              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-[#1E293B] rounded-full mt-4 overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#F97316]" 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: parseFloat(waitingTimeLeft) || 5, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}

          {/* Flying State: Live Multiplier in Big White Text */}
          {gameState === 'flying' && (
            <div className="relative z-20 flex flex-col items-center select-none pointer-events-none">
              <span className="text-6xl sm:text-7xl font-black font-sans text-white tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                {multiplier.toFixed(2)}x
              </span>
            </div>
          )}

          {/* Crashed State: Flew Away in Red */}
          {gameState === 'crashed' && (
            <motion.div 
              key="crashed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-20 flex flex-col items-center select-none"
            >
              <span className="text-xs font-black uppercase tracking-widest text-[#EF4444] bg-red-950/80 px-4 py-1.5 rounded-full border border-red-500/40 mb-2 shadow-lg">
                FLEW AWAY!
              </span>
              <span className="text-6xl sm:text-7xl font-black font-sans text-[#EF4444] tracking-tight drop-shadow-[0_4px_30px_rgba(239,68,68,0.5)]">
                {crashMulti.toFixed(2)}x
              </span>
            </motion.div>
          )}

          {/* Flight Path SVG Curve & Flying Plane */}
          {gameState === 'flying' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Red Area Under Curve */}
                <path 
                  d={`M 0,100 Q ${progressPercent * 0.5},${100 - progressPercent * 0.3} ${progressPercent},${100 - progressPercent} L ${progressPercent},100 Z`} 
                  fill="url(#red-glow-gradient)" 
                />
                {/* Red Leading Edge Line */}
                <path 
                  d={`M 0,100 Q ${progressPercent * 0.5},${100 - progressPercent * 0.3} ${progressPercent},${100 - progressPercent}`} 
                  fill="none" 
                  stroke="#DC2626" 
                  strokeWidth="1.2" 
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="red-glow-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Red Aviator Monoplane at Curve Tip */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
                style={{ 
                  left: `${progressPercent}%`, 
                  top: `${100 - progressPercent}%`,
                  transform: `translate(-50%, -50%) rotate(${-12 - (progressPercent * 0.15)}deg)`
                }}
              >
                <AviatorPlane className="w-16 h-10 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              </div>
            </div>
          )}

          {/* Crash exit flying away animation */}
          {gameState === 'crashed' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <motion.div 
                className="absolute"
                initial={{ 
                  left: `${progressPercent}%`, 
                  top: `${100 - progressPercent}%`,
                  opacity: 1
                }}
                animate={{
                  left: '120%',
                  top: '-20%',
                  opacity: 0
                }}
                transition={{ duration: 0.6, ease: "easeIn" }}
              >
                <AviatorPlane className="w-16 h-10 rotate-[-25deg]" />
              </motion.div>
            </div>
          )}

          {/* Bottom Right of Canvas: 3 User Avatars + 2,345 Players */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-4 w-4 rounded-full ring-1 ring-black" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop" alt="" />
              <img className="inline-block h-4 w-4 rounded-full ring-1 ring-black" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop" alt="" />
              <img className="inline-block h-4 w-4 rounded-full ring-1 ring-black" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop" alt="" />
            </div>
            <span className="text-[11px] font-extrabold text-gray-200">2,345</span>
          </div>

        </div>

        {/* ==================================================== */}
        {/* 3B. DUAL BET PANELS (Exact Layout from Reference) */}
        {/* ==================================================== */}
        <div className="flex flex-col gap-2.5">
          {/* Panel 1 */}
          <div className="relative">
            <BetPanel 
              panelId={1} 
              gameState={gameState} 
              balance={balance} 
              socket={socket} 
              serverMulti={multiplier} 
              canClose={false}
            />
            {/* If second panel is hidden, show [+] button to add second panel */}
            {!showSecondPanel && (
              <button
                onClick={() => setShowSecondPanel(true)}
                className="absolute top-3 right-3 text-xs font-bold text-gray-400 hover:text-white bg-[#25282D] hover:bg-[#32363D] px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow-sm"
              >
                <Plus size={13} />
                <span>Add Bet</span>
              </button>
            )}
          </div>

          {/* Panel 2 (Closable with [-] button) */}
          {showSecondPanel && (
            <BetPanel 
              panelId={2} 
              gameState={gameState} 
              balance={balance} 
              socket={socket} 
              serverMulti={multiplier} 
              onClose={() => setShowSecondPanel(false)}
              canClose={true}
            />
          )}
        </div>

        {/* ==================================================== */}
        {/* 3C. BOTTOM STATS / ALL BETS PANEL (From Reference) */}
        {/* ==================================================== */}
        <div className="bg-[#181A1D] rounded-[22px] p-3.5 border border-white/5 shadow-xl flex flex-col gap-3">
          
          {/* Segmented Tab: [ All Bets ] [ Previous ] [ Top ] */}
          <div className="bg-[#121417] p-1 rounded-full flex gap-1 shadow-inner">
            <button
              onClick={() => setBottomTab('all')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                bottomTab === 'all' ? 'bg-[#25282D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Bets
            </button>
            <button
              onClick={() => setBottomTab('prev')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                bottomTab === 'prev' ? 'bg-[#25282D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setBottomTab('top')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                bottomTab === 'top' ? 'bg-[#25282D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Top
            </button>
          </div>

          {/* Info Header Row from Reference: Avatars + 3902/3970 Bets & Total win INR */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-black" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop" alt="" />
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-black" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop" alt="" />
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-black" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop" alt="" />
              </div>
              <span className="text-xs font-extrabold text-gray-300">
                3902/3970 <span className="text-gray-500 font-semibold">Bets</span>
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm font-black text-white">0.00</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total win INR</div>
            </div>
          </div>

          {/* Thin Green Divider / Progress Bar */}
          <div className="w-full h-1 bg-[#121417] rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-[#22C55E] rounded-full"></div>
          </div>

          {/* Live Bets Feed */}
          <div className="flex flex-col divide-y divide-white/5 max-h-48 overflow-y-auto hide-scrollbar">
            {SIMULATED_BETS.map((bet, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={bet.avatar} className="w-5 h-5 rounded-full object-cover" alt="" />
                  <span className="text-gray-400 font-mono">{bet.user}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 font-bold">₹{bet.amount}</span>
                  {bet.multi ? (
                    <span className="text-[#38BDF8] font-mono font-bold bg-[#14233C] px-2 py-0.5 rounded-full text-[11px]">
                      {bet.multi.toFixed(2)}x
                    </span>
                  ) : (
                    <span className="text-gray-600 font-mono text-[11px]">—</span>
                  )}
                  <span className={`font-black font-mono w-16 text-right ${bet.win ? 'text-[#22C55E]' : 'text-gray-600'}`}>
                    {bet.win ? `₹${bet.win}` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ==================================================== */}
      {/* 4. HOW TO PLAY RULES MODAL */}
      {/* ==================================================== */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#181A1D] rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black italic">
                A
              </div>
              <h3 className="text-lg font-black text-white">How to Play Aviator</h3>
            </div>

            <div className="space-y-3 text-xs text-gray-300 font-medium">
              <p>• <strong>Place your bet</strong> before the round starts during the countdown.</p>
              <p>• As the plane takes off, the <strong>multiplier increases</strong> starting from 1.00x.</p>
              <p>• Hit <strong>Cash Out</strong> before the plane flies away to collect your winnings!</p>
              <p>• If the plane flies away before you cash out, your bet is lost.</p>
              <p>• You can place <strong>two bets simultaneously</strong> using both panels.</p>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-[#22C55E] text-black font-extrabold text-sm hover:brightness-105 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. MENU DRAWER */}
      {/* ==================================================== */}
      {showMenuDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowMenuDrawer(false)}>
          <div 
            className="w-64 bg-[#14171E] h-full p-5 border-l border-white/10 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <span className="font-extrabold text-sm text-white">Game Settings</span>
                <button onClick={() => setShowMenuDrawer(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <button 
                  onClick={() => { setShowRulesModal(true); setShowMenuDrawer(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-gray-300 font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-[#38BDF8]" />
                    <span>How to Play</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-500" />
                </button>

                <button 
                  onClick={() => navigate('/services/history')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-gray-300 font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings size={16} className="text-[#A78BFA]" />
                    <span>Bet History</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-center text-xs text-gray-500">
              Cashly Aviator Engine v2.0
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Aviator;
