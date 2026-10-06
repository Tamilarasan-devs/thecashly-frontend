import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Plane, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// --- Bet Panel Component ---
const BetPanel = ({ 
  panelId, 
  gameState, 
  balance, 
  socket,
  serverMulti
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);
  const [autoBet, setAutoBet] = useState(false);
  
  const [betStatus, setBetStatus] = useState('idle'); // idle, placed, active, cashed_out
  const [betId, setBetId] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  
  const handlePlaceBet = useCallback(() => {
    if (gameState !== 'waiting') return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      if (autoBet) setAutoBet(false);
      return;
    }
    
    setBetStatus('placed'); 
    socket.emit('place_bet', { 
      points: betAmount,
      autoCashout: autoCashout ? autoCashoutValue : null
    }, (res) => {
      if (res.success) {
        setBetId(res.betId);
      } else {
        alert(res.message);
        setBetStatus('idle');
        setAutoBet(false);
      }
    });
  }, [gameState, balance, betAmount, autoCashout, autoCashoutValue, autoBet, socket]);

  const handleCashout = useCallback(() => {
    if (gameState !== 'flying' || betStatus !== 'active') return;
    
    socket.emit('cashout', { betId }, (res) => {
      if (res.success) {
        setBetStatus('cashed_out');
        setWinAmount(res.winAmount);
        toast.success(`Payment collected successfully: ₹${res.winAmount}`);
      } else {
        console.error(res.message);
      }
    });
  }, [gameState, betStatus, betId, socket]);

  useEffect(() => {
    if (gameState === 'flying' && betStatus === 'placed') {
      setBetStatus('active');
    }
    if (gameState === 'crashed') {
      if (betStatus === 'active') {
         setBetStatus('idle');
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
        toast.success(`Payment collected successfully: ₹${data.winAmount}`);
      }
    };
    socket.on('auto_cashed_out', onAutoCashout);
    return () => socket.off('auto_cashed_out', onAutoCashout);
  }, [socket, betId]);


  return (
    <div className="bg-[#091124] rounded-xl p-3 border border-[#162A5A] flex flex-col justify-between shadow-lg relative overflow-hidden">
      
      {/* Background glow when active */}
      {betStatus === 'active' && (
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-pulse"></div>
      )}

      {/* Top Controls: Auto options */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={autoBet} onChange={(e) => setAutoBet(e.target.checked)} disabled={betStatus === 'active'} />
            <div className={`w-7 h-4 rounded-full transition-colors ${autoBet ? 'bg-[#38BDF8]' : 'bg-[#162A5A]'}`}></div>
            <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoBet ? 'translate-x-3' : 'translate-x-0'}`}></div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auto Bet</span>
        </label>
        
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auto Cash Out</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={autoCashout} onChange={(e) => setAutoCashout(e.target.checked)} disabled={betStatus === 'active'} />
            <div className={`w-7 h-4 rounded-full transition-colors ${autoCashout ? 'bg-[#38BDF8]' : 'bg-[#162A5A]'}`}></div>
            <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoCashout ? 'translate-x-3' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>

      {/* Inputs */}
      <div className="flex gap-2 mb-3 relative z-10">
        <div className="flex-1 bg-[#050B16] border border-[#162A5A] rounded-lg flex overflow-hidden shadow-inner">
          <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} disabled={betStatus !== 'idle'} className="w-8 flex items-center justify-center text-gray-500 hover:text-white bg-[#0A1429] disabled:opacity-50 font-bold">-</button>
          <input 
            type="number" 
            value={betAmount} 
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={betStatus !== 'idle'}
            className="flex-1 w-full bg-transparent text-center font-black text-white text-sm outline-none appearance-none"
          />
          <button onClick={() => setBetAmount(betAmount + 10)} disabled={betStatus !== 'idle'} className="w-8 flex items-center justify-center text-gray-500 hover:text-white bg-[#0A1429] disabled:opacity-50 font-bold">+</button>
        </div>
        
        {autoCashout && (
          <div className="w-20 bg-[#050B16] border border-[#162A5A] rounded-lg flex overflow-hidden px-2 items-center shadow-inner">
             <input 
              type="number" 
              step="0.1"
              value={autoCashoutValue} 
              onChange={(e) => setAutoCashoutValue(Number(e.target.value))}
              disabled={betStatus !== 'idle'}
              className="flex-1 w-full bg-transparent text-center font-black text-[#38BDF8] text-sm outline-none"
            />
            <span className="text-gray-500 font-bold text-xs">x</span>
          </div>
        )}
      </div>

      {/* Quick Amounts */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 relative z-10">
        {[100, 200, 500, 1000].map(amt => (
          <button 
            key={amt} 
            onClick={() => setBetAmount(amt)}
            disabled={betStatus !== 'idle'}
            className="bg-[#0A1429] hover:bg-[#162A5A] border border-transparent hover:border-[#38BDF8]/30 disabled:opacity-50 py-1.5 rounded-lg text-[11px] font-black text-gray-300 transition"
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div className="h-14 relative z-10">
        {betStatus === 'idle' && (
          <button 
            onClick={handlePlaceBet}
            disabled={gameState !== 'waiting'}
            className="w-full h-full bg-gradient-to-b from-[#10B981] to-[#047857] hover:from-[#34D399] hover:to-[#059669] disabled:from-[#10B981]/20 disabled:to-[#047857]/20 disabled:text-gray-500 text-white rounded-xl font-black uppercase text-xl shadow-[0_4px_15px_rgba(16,185,129,0.2),inset_0_2px_0_rgba(255,255,255,0.2)] transition-all active:scale-[0.98] border border-[#047857]/50"
          >
            {gameState === 'waiting' ? 'Bet' : 'Waiting...'}
          </button>
        )}

        {betStatus === 'placed' && (
          <button 
            disabled
            className="w-full h-full bg-gradient-to-b from-[#EF4444] to-[#B91C1C] text-white rounded-xl font-black uppercase text-xl shadow-[0_4px_15px_rgba(239,68,68,0.2),inset_0_2px_0_rgba(255,255,255,0.2)] opacity-80 border border-[#B91C1C]/50"
          >
            Waiting for Round...
          </button>
        )}

        {betStatus === 'active' && (
          <button 
            onClick={handleCashout}
            className="w-full h-full bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-white rounded-xl flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.4),inset_0_2px_0_rgba(255,255,255,0.2)] transition-all active:scale-[0.98] border border-[#D97706]/50 animate-pulse"
          >
            <span className="font-black uppercase text-xs leading-tight opacity-90 tracking-widest drop-shadow-sm">Collect Points</span>
            <span className="font-black text-2xl leading-tight drop-shadow-md">₹{Math.floor(betAmount * serverMulti)}</span>
          </button>
        )}

        {betStatus === 'cashed_out' && (
          <div className="w-full h-full bg-[#10B981]/10 border border-[#10B981] text-[#10B981] rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="font-black uppercase text-[10px] tracking-widest opacity-80">Collection Successful</span>
            <span className="font-black text-2xl">₹{winAmount}</span>
          </div>
        )}
      </div>

    </div>
  );
};


// --- Main Game Component ---
const Aviator = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('idle'); // waiting, flying, crashed
  const [multiplier, setMultiplier] = useState(1.0);
  const [serverStartTime, setServerStartTime] = useState(null);
  const [crashMulti, setCrashMulti] = useState(1.0);
  const [waitingTimeLeft, setWaitingTimeLeft] = useState(0);
  const [recentCrashes, setRecentCrashes] = useState([]);
  
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
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
          auth: { token }
        });
        
        newSocket.on('connect', () => {
          console.log('Connected to Aviator Engine');
        });

        newSocket.on('game_state', (data) => {
          setGameState(data.state);
          
          if (data.state === 'waiting') {
            setMultiplier(1.0);
            if (data.waitingTime) {
               let ms = data.waitingTime;
               setWaitingTimeLeft((ms/1000).toFixed(1));
               const int = setInterval(() => {
                 ms -= 100;
                 if (ms <= 0) {
                   clearInterval(int);
                   setWaitingTimeLeft("0.0");
                 } else {
                   setWaitingTimeLeft((ms/1000).toFixed(1));
                 }
               }, 100);
            }
          }
          else if (data.state === 'flying') {
            setMultiplier(data.multiplier || 1.0);
            setServerStartTime(Date.now());
            localStartRef.current = performance.now();
            startLocalAnimation();
          }
          else if (data.state === 'crashed') {
            stopLocalAnimation();
            const cp = data.crashPoint || data.multiplier || 1.0;
            setMultiplier(cp);
            setCrashMulti(cp);
            api.get('/auth/me').then(res => setBalance(res.data.data.walletBalance / 100));
          }

          if (data.recentCrashes) {
            setRecentCrashes(data.recentCrashes);
          }
        });

        newSocket.on('history_update', (history) => {
          setRecentCrashes(history);
        });

        setSocket(newSocket);
        setLoading(false);

      } catch (err) {
        console.error('Init error', err);
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

  // UI Calculations
  const maxVisualMulti = 10;
  const progressPercent = Math.min(100, ((multiplier - 1) / maxVisualMulti) * 100);
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#030712] text-[#38BDF8]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden flex flex-col pb-6">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0F172A', color: '#fff', border: '1px solid #1E3A8A' } }} />
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0A1429] border-b border-[#1E3A8A]/50 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <button onClick={() => navigate('/games')} className="p-2 bg-[#162A5A] rounded-full hover:bg-[#1E3A8A] transition border border-[#1E3A8A]">
          <ArrowLeft size={18} className="text-[#38BDF8]" />
        </button>
        <div className="flex items-center gap-2">
          <Plane size={24} className="text-[#38BDF8] drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" fill="currentColor" />
          <h1 className="text-xl font-black italic tracking-wider text-white drop-shadow-md">AVIATOR</h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold text-[#38BDF8] uppercase tracking-widest">Live Wallet</span>
          <span className="text-sm font-black text-white">₹{balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      </header>

      {/* History Ribbon */}
      <div className="bg-[#050B16] py-2 px-3 flex gap-2 overflow-x-auto hide-scrollbar border-b border-[#162A5A]">
        {recentCrashes.map((m, i) => {
          const isHigh = m >= 2.0;
          const isVeryHigh = m >= 10.0;
          return (
            <div key={i} className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-black shadow-sm ${
              isVeryHigh ? 'bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white border border-[#D946EF]' 
              : isHigh ? 'bg-[#1E3A8A] text-[#38BDF8] border border-[#38BDF8]/50' 
              : 'bg-[#1F2937] text-gray-400 border border-gray-600'
            }`}>
              {m.toFixed(2)}x
            </div>
          )
        })}
      </div>

      <div className="flex-1 px-3 py-3 flex flex-col gap-3">
        
        {/* Main Graph Area */}
        <div className="relative w-full h-[40vh] bg-gradient-to-b from-[#0F172A] to-[#030712] rounded-[24px] border border-[#1E3A8A] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center group">
          
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[#38BDF8]/10 blur-[80px] rounded-full pointer-events-none"></div>

          {/* Multiplier / Status Text */}
          <AnimatePresence mode="wait">
            {gameState === 'waiting' && (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative z-20 flex flex-col items-center"
              >
                <div className="w-16 h-16 mb-4 animate-bounce opacity-30 flex items-center justify-center bg-[#38BDF8]/20 rounded-full border border-[#38BDF8]/30">
                   <Plane size={32} className="text-[#38BDF8] -rotate-45" fill="currentColor" />
                </div>
                <h2 className="text-xl font-black text-[#38BDF8] uppercase tracking-widest mb-1 drop-shadow-md">Preparing Flight</h2>
                <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{waitingTimeLeft}s</div>
                <div className="w-56 h-1.5 bg-[#0F172A] rounded-full mt-5 overflow-hidden shadow-inner border border-[#1E3A8A]">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-[#38BDF8] to-[#2563EB]" 
                     initial={{ width: '100%' }}
                     animate={{ width: 0 }}
                     transition={{ duration: parseFloat(waitingTimeLeft), ease: 'linear' }}
                   />
                </div>
              </motion.div>
            )}

            {gameState === 'flying' && (
              <motion.div 
                key="flying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-20 text-[80px] font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]"
              >
                {multiplier.toFixed(2)}x
              </motion.div>
            )}

            {gameState === 'crashed' && (
              <motion.div 
                key="crashed"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-20 flex flex-col items-center"
              >
                <span className="text-[80px] font-black text-[#EF4444] tracking-tighter drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                  {crashMulti.toFixed(2)}x
                </span>
                <span className="bg-[#EF4444] text-white px-5 py-2 rounded-lg uppercase font-black tracking-widest text-sm shadow-[0_4px_15px_rgba(239,68,68,0.5)] mt-3">
                  Flew Away
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plane Animation Layer */}
          {gameState === 'flying' && (
             <div className="absolute bottom-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] pointer-events-none z-10">
               {/* Curved Trail */}
               <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path 
                   d={`M 0,100 Q ${progressPercent},${100 - progressPercent/2} ${progressPercent},${100 - progressPercent}`} 
                   fill="none" 
                   stroke="#38BDF8" 
                   strokeWidth="0.8" 
                   className="drop-shadow-[0_0_15px_rgba(56,189,248,1)]"
                 />
                 {/* Fill under the curve */}
                 <path 
                   d={`M 0,100 Q ${progressPercent},${100 - progressPercent/2} ${progressPercent},${100 - progressPercent} L ${progressPercent},100 Z`} 
                   fill="url(#trail-gradient)" 
                   className="opacity-30"
                 />
                 <defs>
                   <linearGradient id="trail-gradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#38BDF8" />
                     <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                 </defs>
               </svg>
               
               {/* Plane Sprite */}
               <motion.div 
                 className="absolute text-[#EF4444] drop-shadow-[0_0_20px_rgba(239,68,68,1)] z-20"
                 style={{ 
                   left: `calc(${progressPercent}% - 24px)`, 
                   bottom: `calc(${progressPercent}% - 24px)`,
                   transform: `rotate(${-15 - (progressPercent * 0.2)}deg)`
                 }}
               >
                 <Plane size={48} fill="currentColor" />
               </motion.div>
             </div>
          )}

          {/* Crash exit animation */}
          {gameState === 'crashed' && (
             <div className="absolute bottom-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] pointer-events-none z-10 overflow-hidden">
                <motion.div 
                 className="absolute text-[#EF4444] opacity-0"
                 initial={{ 
                   left: `calc(${progressPercent}% - 24px)`, 
                   bottom: `calc(${progressPercent}% - 24px)`,
                   transform: `rotate(${-15 - (progressPercent * 0.2)}deg)`,
                   opacity: 1
                 }}
                 animate={{
                   left: '120%',
                   bottom: '120%',
                   opacity: 0
                 }}
                 transition={{ duration: 0.8, ease: "easeIn" }}
               >
                 <Plane size={48} fill="currentColor" />
               </motion.div>
             </div>
          )}
        </div>

        {/* Dual Bet Panels side by side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BetPanel 
            panelId={1} 
            gameState={gameState} 
            balance={balance} 
            socket={socket} 
            serverMulti={multiplier} 
          />
          <BetPanel 
            panelId={2} 
            gameState={gameState} 
            balance={balance} 
            socket={socket} 
            serverMulti={multiplier} 
          />
        </div>

      </div>

    </div>
  );
};

export default Aviator;
