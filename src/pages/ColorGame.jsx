import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, RefreshCcw, X, Trophy, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

const ColorGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [history, setHistory] = useState({ rounds: [], userHistory: [] });
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  // Bet Modal State
  const [showModal, setShowModal] = useState(false);
  const [betSelection, setBetSelection] = useState(null);
  const [betAmountMultiplier, setBetAmountMultiplier] = useState(10);
  const [betQuantity, setBetQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState('parity'); // 'parity' | 'my'

  useEffect(() => {
    fetchGameState();
    fetchHistory();
    const interval = setInterval(() => {
      fetchGameState();
      fetchHistory();
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameState?.remainingSeconds > 0) {
      setRemainingTime(gameState.remainingSeconds);
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setTimeout(fetchGameState, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState?.remainingSeconds, gameState?.roundId]);

  const fetchGameState = async () => {
    try {
      const res = await api.get('/colorgame/current');
      if (res.data.success) {
        setGameState(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/colorgame/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const openBetModal = (type, value) => {
    if (isLocked) {
      alert('Entries are closed for this round!');
      return;
    }
    setBetSelection({ type, value });
    setBetAmountMultiplier(10);
    setBetQuantity(1);
    setShowModal(true);
  };

  const submitBet = async () => {
    const totalPoints = betAmountMultiplier * betQuantity;
    if (totalPoints <= 0) return alert('Invalid points.');
    if (isLocked) return alert('Entries are closed for this round!');
    if (gameState?.walletBalance < totalPoints) return alert('Insufficient balance.');

    setSubmitting(true);
    try {
      const payload = {
        selectType: betSelection.type,
        points: totalPoints
      };
      if (betSelection.type === 'color') payload.color = betSelection.value;
      if (betSelection.type === 'number') payload.number = betSelection.value;

      const res = await api.post('/colorgame/predict', payload);
      if (res.data.success) {
        setShowModal(false);
        fetchGameState();
        fetchHistory();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLocked = remainingTime <= 5;

  // Premium ball styling
  const getNumberStyle = (num) => {
    if (num === 0) return 'bg-gradient-to-br from-[#EF4444] to-[#8B5CF6]';
    if (num === 5) return 'bg-gradient-to-br from-[#10B981] to-[#8B5CF6]';
    if ([1, 3, 7, 9].includes(num)) return 'bg-gradient-to-br from-[#10B981] to-[#047857]';
    if ([2, 4, 6, 8].includes(num)) return 'bg-gradient-to-br from-[#EF4444] to-[#B91C1C]';
    return 'bg-gray-500';
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0B0F19] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative pb-10">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-[#1E3A8A]/20 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate('/games')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
          <ArrowLeft size={20} className="text-gray-200" />
        </button>
        <h1 className="text-xl font-black text-white tracking-wide">Wingo 1Min</h1>
        <button onClick={fetchGameState} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
          <RefreshCcw size={18} className="text-gray-200" />
        </button>
      </header>

      {/* Wallet Card */}
      <div className="px-4 mt-2 mb-6 relative z-10">
        <div className="bg-[#1C2333] rounded-[24px] p-6 shadow-2xl relative overflow-hidden border border-white/5">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Wallet size={16} className="text-[#38BDF8]" />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Available Balance</span>
          </div>
          <div className="flex justify-between items-end relative z-10">
            <h2 className="text-4xl font-black text-white flex items-baseline gap-1 tracking-tight">
              <span className="text-xl text-[#38BDF8]">₹</span>
              {gameState?.walletBalance?.toLocaleString() || 0}
            </h2>
          </div>

          <div className="flex gap-3 mt-6 relative z-10">
            <button onClick={() => navigate('/add-cash')} className="flex-1 bg-[#38BDF8] text-[#0B0F19] py-3 rounded-2xl font-black text-[15px] shadow-[0_4px_20px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition-all">
              Recharge
            </button>
            <button onClick={() => navigate('/wallet')} className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold text-[15px] border border-white/10 hover:bg-white/20 active:scale-95 transition-all">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Game Timer & Period Container */}
      <div className="px-4 mb-6 relative z-10">
        <div className="bg-[#1C2333] rounded-[20px] p-5 flex justify-between items-center shadow-lg border border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy size={14} className="text-[#FBBF24]" />
              <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">Period</span>
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tight">
              {gameState?.roundId}
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1.5">Count Down</span>
            <div className="flex items-center gap-1.5">
              <div className="bg-white/5 border border-white/10 w-9 h-11 flex items-center justify-center rounded-[10px] text-xl font-mono font-bold text-gray-200">0</div>
              <div className="bg-white/5 border border-white/10 w-9 h-11 flex items-center justify-center rounded-[10px] text-xl font-mono font-bold text-gray-200">0</div>
              <div className="text-gray-500 font-bold mx-0.5 animate-pulse">:</div>
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 w-9 h-11 flex items-center justify-center rounded-[10px] text-xl font-mono font-bold text-[#EF4444]">
                {Math.floor(remainingTime / 10)}
              </div>
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 w-9 h-11 flex items-center justify-center rounded-[10px] text-xl font-mono font-bold text-[#EF4444]">
                {remainingTime % 10}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Betting Area */}
      <div className="px-4 mb-6 relative z-10">
        
        {isLocked && (
          <div className="absolute inset-0 z-20 bg-[#0B0F19]/80 backdrop-blur-[4px] rounded-[24px] flex flex-col items-center justify-center overflow-hidden border border-white/5">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <AlertCircle size={48} className="text-[#EF4444] mb-3 animate-pulse" />
              <div className="text-5xl font-black text-white mb-2">{remainingTime}</div>
              <div className="bg-[#EF4444] text-white px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                Stop Betting
              </div>
            </motion.div>
          </div>
        )}

        <div className="bg-[#1C2333] p-5 rounded-[24px] shadow-lg border border-white/5">
          {/* Color Actions */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => openBetModal('color', 'green')}
              className="flex-1 bg-gradient-to-b from-[#10B981] to-[#047857] py-4 rounded-2xl shadow-[0_4px_15px_rgba(16,185,129,0.25),inset_0_2px_0_rgba(255,255,255,0.2)] hover:brightness-110 active:scale-95 transition-all flex flex-col items-center justify-center"
            >
              <span className="text-white font-black text-sm drop-shadow-md">Green</span>
              <span className="text-emerald-100 text-[10px] font-bold mt-0.5">2X</span>
            </button>
            <button 
              onClick={() => openBetModal('color', 'violet')}
              className="flex-1 bg-gradient-to-b from-[#8B5CF6] to-[#5B21B6] py-4 rounded-2xl shadow-[0_4px_15px_rgba(139,92,246,0.25),inset_0_2px_0_rgba(255,255,255,0.2)] hover:brightness-110 active:scale-95 transition-all flex flex-col items-center justify-center"
            >
              <span className="text-white font-black text-sm drop-shadow-md">Violet</span>
              <span className="text-violet-200 text-[10px] font-bold mt-0.5">4.5X</span>
            </button>
            <button 
              onClick={() => openBetModal('color', 'red')}
              className="flex-1 bg-gradient-to-b from-[#EF4444] to-[#B91C1C] py-4 rounded-2xl shadow-[0_4px_15px_rgba(239,68,68,0.25),inset_0_2px_0_rgba(255,255,255,0.2)] hover:brightness-110 active:scale-95 transition-all flex flex-col items-center justify-center"
            >
              <span className="text-white font-black text-sm drop-shadow-md">Red</span>
              <span className="text-red-200 text-[10px] font-bold mt-0.5">2X</span>
            </button>
          </div>

          {/* Number Grid - Casino Chip Style */}
          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => openBetModal('number', num)}
                className={`w-full aspect-square rounded-full flex flex-col items-center justify-center text-white font-black text-xl 
                shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_4px_rgba(0,0,0,0.3)] 
                hover:scale-105 active:scale-95 transition-all ${getNumberStyle(num)}`}
              >
                <span className="drop-shadow-md">{num}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs & Records Container */}
      <div className="px-4 relative z-10">
        
        {/* Toggle Switch */}
        <div className="bg-[#1C2333] p-1 rounded-[16px] flex mb-4 border border-white/5 shadow-inner relative">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#38BDF8] rounded-[12px] transition-transform duration-300 ease-out shadow-md"
            style={{ transform: activeTab === 'parity' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
          ></div>
          <button 
            onClick={() => setActiveTab('parity')}
            className={`flex-1 py-2.5 text-[13px] font-bold text-center rounded-[12px] relative z-10 transition-colors ${activeTab === 'parity' ? 'text-[#0B0F19]' : 'text-gray-400'}`}
          >
            Game History
          </button>
          <button 
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2.5 text-[13px] font-bold text-center rounded-[12px] relative z-10 transition-colors ${activeTab === 'my' ? 'text-[#0B0F19]' : 'text-gray-400'}`}
          >
            My Bets
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#1C2333] rounded-[24px] overflow-hidden border border-white/5 shadow-lg">
          {activeTab === 'parity' && (
            <div className="w-full">
              <div className="grid grid-cols-4 text-[11px] font-black uppercase tracking-wider text-gray-500 bg-white/5 p-4 text-center border-b border-white/5">
                <div>Period</div>
                <div>Number</div>
                <div>Size</div>
                <div>Result</div>
              </div>
              <div className="flex flex-col">
                {history.rounds.map((r, i) => {
                  const size = r.winningNumber >= 5 ? 'Big' : 'Small';
                  const sizeColor = size === 'Big' ? 'text-[#FBBF24]' : 'text-[#38BDF8]';
                  return (
                    <div key={i} className="grid grid-cols-4 items-center text-sm p-4 border-b border-white/5 last:border-0 text-center hover:bg-white/[0.02] transition-colors">
                      <div className="text-gray-300 font-mono text-[13px]">{r.roundId.slice(-4)}</div>
                      <div className={`font-black text-[16px] ${r.winningNumber !== undefined ? (r.winningColor === 'red' ? 'text-[#EF4444]' : r.winningColor === 'green' ? 'text-[#10B981]' : 'text-[#8B5CF6]') : 'text-gray-600'}`}>
                        {r.winningNumber !== undefined ? r.winningNumber : '?'}
                      </div>
                      <div className={`font-bold text-[12px] uppercase ${r.winningNumber !== undefined ? sizeColor : 'text-gray-600'}`}>
                        {r.winningNumber !== undefined ? size : '-'}
                      </div>
                      <div className="flex justify-center">
                        {r.winningColor ? (
                          <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${r.winningColor === 'red' ? 'bg-[#EF4444]' : r.winningColor === 'green' ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'}`} />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                        )}
                      </div>
                    </div>
                  );
                })}
                {history.rounds.length === 0 && (
                  <div className="p-10 text-center text-gray-500 text-sm font-medium">No records yet</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'my' && (
            <div className="flex flex-col">
              {history.userHistory.map((item, i) => (
                <div key={i} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="text-[11px] text-gray-400 font-mono bg-white/5 px-2 py-1 rounded-md">{item.roundId}</div>
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase ${item.status === 'won' ? 'bg-[#10B981]/20 text-[#10B981]' : item.status === 'lost' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#FBBF24]/20 text-[#FBBF24]'}`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Selection</span>
                      <div className="flex items-center gap-1.5">
                        {item.selectType === 'color' ? (
                          <span className={`text-[15px] font-black capitalize ${item.color === 'red' ? 'text-[#EF4444]' : item.color === 'green' ? 'text-[#10B981]' : 'text-[#8B5CF6]'}`}>
                            {item.color}
                          </span>
                        ) : (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[13px] font-black ${getNumberStyle(item.number)}`}>
                            {item.number}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-black text-white">₹{item.points}</div>
                      {item.status === 'won' && <div className="text-[13px] font-black text-[#10B981] mt-0.5">+₹{item.winAmount}</div>}
                      {item.status === 'lost' && <div className="text-[13px] font-bold text-gray-500 mt-0.5">-₹{item.points}</div>}
                    </div>
                  </div>
                </div>
              ))}
              {history.userHistory.length === 0 && (
                <div className="p-10 text-center text-gray-500 text-sm font-medium">No betting history</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Betting Modal */}
      <AnimatePresence>
        {showModal && betSelection && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0B0F19]/80 z-50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#1C2333] z-50 rounded-t-[32px] overflow-hidden max-w-md mx-auto shadow-[0_-10px_50px_rgba(0,0,0,0.5)] border-t border-white/10"
            >
              {/* Header */}
              <div className={`px-6 py-5 ${
                betSelection.type === 'color' ? (betSelection.value === 'red' ? 'bg-[#EF4444]' : betSelection.value === 'green' ? 'bg-[#10B981]' : 'bg-[#8B5CF6]') 
                : 'bg-[#38BDF8]'
              } flex justify-between items-center text-white relative`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                <h3 className="font-black text-xl tracking-tight capitalize relative z-10 shadow-sm">
                  Join {betSelection.type === 'color' ? betSelection.value : `Number ${betSelection.value}`}
                </h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md relative z-10 hover:bg-black/40 transition">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                
                {/* Contract Money */}
                <div className="mb-6">
                  <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-3">Contract Money</p>
                  <div className="flex gap-2">
                    {[10, 100, 1000, 10000].map((amt) => (
                      <button 
                        key={amt}
                        onClick={() => setBetAmountMultiplier(amt)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all border ${
                          betAmountMultiplier === amt 
                            ? (betSelection.type === 'color' ? (betSelection.value === 'red' ? 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]' : betSelection.value === 'green' ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]' : 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6]') : 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]')
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-3">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setBetQuantity(Math.max(1, betQuantity - 1))}
                      className="w-12 h-12 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-medium text-gray-300 hover:bg-white/10 transition active:scale-95"
                    >
                      -
                    </button>
                    <div className="flex-1 bg-[#0B0F19] border border-white/5 h-12 rounded-[14px] flex items-center justify-center font-black text-xl text-white shadow-inner">
                      {betQuantity}
                    </div>
                    <button 
                      onClick={() => setBetQuantity(betQuantity + 1)}
                      className="w-12 h-12 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-medium text-gray-300 hover:bg-white/10 transition active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-gray-400 text-sm font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-white">₹{betAmountMultiplier * betQuantity}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-300 font-black text-[15px] hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitBet}
                    disabled={submitting}
                    className={`flex-1 py-4 rounded-2xl font-black text-[15px] text-white transition-all shadow-lg ${
                      betSelection.type === 'color' ? (betSelection.value === 'red' ? 'bg-[#EF4444]' : betSelection.value === 'green' ? 'bg-[#10B981]' : 'bg-[#8B5CF6]')
                      : 'bg-[#38BDF8]'
                    } ${submitting ? 'opacity-70 scale-95' : 'hover:brightness-110 active:scale-95'}`}
                  >
                    {submitting ? 'Confirming...' : 'Confirm Bet'}
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ColorGame;
