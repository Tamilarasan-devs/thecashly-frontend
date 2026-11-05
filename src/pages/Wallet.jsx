import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet as WalletIcon, 
  ArrowDownToLine, 
  History, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Copy, 
  Check, 
  Edit3, 
  Plus, 
  ChevronRight, 
  ShieldCheck, 
  X,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Kotak Mahindra Bank',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'Yes Bank',
  'Federal Bank',
  'IDBI Bank',
  'Other Bank'
];

const Wallet = () => {
  const { user, fetchUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [copiedId, setCopiedId] = useState('');

  // Bank Modal State
  const [showBankModal, setShowBankModal] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [bankError, setBankError] = useState('');
  const [selectedBankType, setSelectedBankType] = useState('select');
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    bankName: '',
    customBankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    branchName: '',
    upiId: ''
  });

  // Confirm Withdrawal Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchUser?.();
    fetchWithdrawals();
    if (user?.payoutDetails) {
      prefillBankForm(user.payoutDetails);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash === '#withdrawals' || window.location.hash === '#history') {
      const timer = setTimeout(() => {
        const el = document.getElementById('withdrawals');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  const prefillBankForm = (details) => {
    const isStandardBank = POPULAR_BANKS.includes(details.bankName);
    setBankForm({
      accountHolderName: details.accountHolderName || '',
      bankName: isStandardBank ? details.bankName : (details.bankName ? 'Other Bank' : ''),
      customBankName: isStandardBank ? '' : (details.bankName || ''),
      accountNumber: details.accountNumber || '',
      confirmAccountNumber: details.accountNumber || '',
      ifscCode: details.ifscCode || '',
      branchName: details.branchName || '',
      upiId: details.upiId || ''
    });
    setSelectedBankType(isStandardBank ? 'select' : (details.bankName ? 'other' : 'select'));
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/withdrawals');
      setWithdrawals(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const hasCompleteBankDetails = () => {
    const p = user?.payoutDetails;
    return Boolean(
      p &&
      p.accountHolderName &&
      p.bankName &&
      p.accountNumber &&
      p.ifscCode &&
      p.branchName
    );
  };

  const handleBankFormSubmit = async (e) => {
    e.preventDefault();
    setBankError('');

    const bankNameFinal = bankForm.bankName === 'Other Bank' 
      ? bankForm.customBankName?.trim() 
      : bankForm.bankName?.trim();

    if (!bankForm.accountHolderName.trim()) {
      return setBankError('Please enter the account holder name');
    }
    if (!bankNameFinal) {
      return setBankError('Please select or specify the bank name');
    }
    const cleanAcc = bankForm.accountNumber.trim();
    if (!/^\d{8,20}$/.test(cleanAcc)) {
      return setBankError('Account number must be 8 to 20 numeric digits');
    }
    if (cleanAcc !== bankForm.confirmAccountNumber.trim()) {
      return setBankError('Account numbers do not match. Please verify carefully.');
    }
    const cleanIfsc = bankForm.ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      return setBankError('Invalid IFSC code format (e.g. SBIN0001234)');
    }
    if (!bankForm.branchName.trim()) {
      return setBankError('Please enter the bank branch name');
    }

    setSavingBank(true);
    try {
      const payload = {
        accountHolderName: bankForm.accountHolderName.trim(),
        bankName: bankNameFinal,
        accountNumber: cleanAcc,
        ifscCode: cleanIfsc,
        branchName: bankForm.branchName.trim(),
        upiId: bankForm.upiId?.trim() || ''
      };

      const res = await api.put('/withdrawals/bank-details', payload);
      if (res.data.success) {
        if (fetchUser) await fetchUser();
        setShowBankModal(false);
        setMessage({ text: 'Bank details saved successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (err) {
      setBankError(err.response?.data?.error || 'Failed to save bank details');
    } finally {
      setSavingBank(false);
    }
  };

  const handleInitiateWithdrawal = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!hasCompleteBankDetails()) {
      setMessage({ text: 'Please add your bank account details before requesting a payout.', type: 'error' });
      setShowBankModal(true);
      return;
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: 'Please enter a valid withdrawal amount', type: 'error' });
      return;
    }

    if (numAmount < 200) {
      setMessage({ text: 'Minimum withdrawal amount is ₹200', type: 'error' });
      return;
    }

    const maxAllowed = (user?.earningBalance || 0) / 100;
    if (numAmount > maxAllowed) {
      setMessage({ text: `Amount exceeds your available earning balance (₹${maxAllowed.toFixed(2)})`, type: 'error' });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/withdrawals/request', {
        amount: Math.round(Number(amount) * 100)
      });

      if (res.data.success) {
        setShowConfirmModal(false);
        setAmount('');
        setMessage({ 
          text: 'Withdrawal request submitted successfully! Your payout is being reviewed by admin.', 
          type: 'success' 
        });
        if (fetchUser) await fetchUser();
        fetchWithdrawals();
      }
    } catch (err) {
      setShowConfirmModal(false);
      setMessage({ 
        text: err.response?.data?.error || 'Failed to submit withdrawal request', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    if (activeTab === 'all') return true;
    return w.status === activeTab;
  });

  const availableEarning = (user?.earningBalance || 0) / 100;
  const walletDeposit = (user?.walletBalance || 0) / 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#090A0F] tracking-tight">Wallet & Withdrawals</h1>
          <p className="text-[#1E293B] text-sm font-semibold mt-1">Manage bank payout details and request earnings withdrawal</p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/add-cash" 
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-bold text-[#090A0F] hover:bg-orange-50 hover:border-orange-300 transition shadow-sm"
          >
            <WalletIcon size={16} className="text-[#EA580C]" />
            <span>Add Cash</span>
          </Link>
          <button
            onClick={() => {
              if (user?.payoutDetails) prefillBankForm(user.payoutDetails);
              setShowBankModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#EF4444] text-white text-sm font-bold hover:brightness-105 transition shadow-md shadow-orange-500/20"
          >
            <Building2 size={16} />
            <span>{hasCompleteBankDetails() ? 'Edit Bank Details' : 'Add Bank Account'}</span>
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Earning Balance (Withdrawal Eligible) */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#EF4444] p-7 text-white shadow-xl shadow-orange-500/20">
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-white" />
                <span>Eligible for Payout</span>
              </div>
              <p className="text-xs uppercase tracking-wider text-white/90 font-bold">Available Earning Balance</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">₹{availableEarning.toFixed(2)}</h2>
              <p className="mt-3 text-xs text-white/80">Daily returns and profits eligible for direct bank transfer.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <ArrowDownToLine size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Deposit Wallet Balance */}
        <div className="relative overflow-hidden rounded-[26px] bg-[#18181B] p-7 text-white shadow-xl border border-zinc-800">
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 text-orange-200">
                <WalletIcon size={13} className="text-[#FB923C]" />
                <span>Plan Balance</span>
              </div>
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Deposit Balance</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">₹{walletDeposit.toFixed(2)}</h2>
              <div className="mt-3 flex items-center gap-2">
                <Link to="/plans" className="text-xs font-bold text-[#FB923C] hover:underline flex items-center gap-1">
                  Browse Plans <ChevronRight size={12} />
                </Link>
                <span className="text-zinc-600">•</span>
                
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <WalletIcon size={24} className="text-zinc-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {message.text && (
        <div className={`rounded-2xl p-4 text-sm font-bold flex items-center gap-3 transition-all ${
          message.type === 'success' 
            ? 'bg-[#E6F7ED] text-[#10B981] border border-emerald-200' 
            : 'bg-[#FFF1F2] text-[#F43F5E] border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Bank Account Section */}
      <div className="bg-white rounded-[26px] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#EA580C]">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#090A0F]">Payout Destination (Bank Account)</h3>
              <p className="text-xs text-[#334155] font-semibold">Bank account where your withdrawn funds will be credited</p>
            </div>
          </div>
          {hasCompleteBankDetails() && (
            <button
              onClick={() => {
                prefillBankForm(user.payoutDetails);
                setShowBankModal(true);
              }}
              className="text-xs font-black text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition"
            >
              <Edit3 size={14} />
              <span>Change</span>
            </button>
          )}
        </div>

        {hasCompleteBankDetails() ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-stone-900 to-zinc-950 p-6 text-white shadow-lg border border-zinc-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <Building2 size={22} />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Bank Name</p>
                  <h4 className="text-lg font-bold text-white">{user.payoutDetails.bankName}</h4>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 w-fit">
                <ShieldCheck size={14} />
                <span>Verified Payout Account</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Account Holder</p>
                <p className="text-sm font-extrabold text-white mt-0.5">{user.payoutDetails.accountHolderName}</p>
              </div>

              <div>
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Account Number</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm font-extrabold tracking-wider text-white">
                    •••• •••• {user.payoutDetails.accountNumber.slice(-4)}
                  </p>
                  <button 
                    onClick={() => handleCopy(user.payoutDetails.accountNumber, 'acc')}
                    className="text-white/60 hover:text-white transition"
                    title="Copy full account number"
                  >
                    {copiedId === 'acc' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">IFSC & Branch</p>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  {user.payoutDetails.ifscCode}
                  {user.payoutDetails.branchName && (
                    <span className="text-xs text-white/70 font-medium block">{user.payoutDetails.branchName}</span>
                  )}
                </p>
              </div>
            </div>

            {user.payoutDetails.upiId && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/70">
                <CreditCard size={14} />
                <span>UPI ID: <strong className="text-white font-semibold">{user.payoutDetails.upiId}</strong></span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-amber-900">No Bank Details Added Yet</h4>
                <p className="text-xs text-amber-700 font-medium mt-0.5 max-w-md">
                  Please link your bank account (Account Holder, Account No, IFSC Code & Branch) to enable earnings withdrawal.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (user?.payoutDetails) prefillBankForm(user.payoutDetails);
                setShowBankModal(true);
              }}
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 transition flex items-center gap-2 shrink-0"
            >
              <Plus size={16} />
              <span>Add Bank Details</span>
            </button>
          </div>
        )}
      </div>

      {/* Request Payout Form */}
      <div className="bg-white rounded-[26px] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7ED] flex items-center justify-center text-[#10B981]">
            <ArrowDownToLine size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#090A0F]">Request Payout</h3>
            <p className="text-xs text-[#334155] font-semibold">Funds will be transferred to your linked bank account</p>
          </div>
        </div>

        <form onSubmit={handleInitiateWithdrawal} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#090A0F]">Withdrawal Amount (₹)</label>
              <span className="text-xs font-bold text-[#1E293B]">
                Max: <strong className="text-[#090A0F] font-black">₹{availableEarning.toFixed(2)}</strong>
              </span>
            </div>

            <div className="relative rounded-2xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700 font-black text-lg">
                ₹
              </div>
              <input
                type="number"
                min="200"
                step="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-2xl border-2 border-gray-200 bg-gray-50/50 py-3.5 pl-9 pr-16 text-lg font-black text-[#090A0F] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                placeholder="Enter amount (min ₹200)"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider">INR</span>
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[200, 500, 1000, 2000, 5000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition border ${
                    amount === val.toString()
                      ? 'bg-gradient-to-r from-[#EA580C] to-[#EF4444] text-white border-transparent shadow-sm shadow-orange-500/20'
                      : 'bg-gray-100 text-[#090A0F] border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(Math.floor(availableEarning).toString())}
                disabled={availableEarning < 200}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-orange-50 text-[#EA580C] border border-orange-300 hover:bg-orange-100 transition disabled:opacity-50"
              >
                Max Balance
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-xl bg-orange-50/90 border border-orange-200 p-3.5 flex items-start gap-2.5 text-xs text-[#431407] font-semibold">
            <Info size={16} className="text-[#C2410C] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[#431407]">
              <p>• Minimum withdrawal amount is <strong className="text-black font-black">₹200</strong>.</p>
              <p>• Requests are reviewed and processed by admin directly to your verified bank account.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || availableEarning < 200}
            className="w-full rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EF4444] py-4 font-black text-white text-base shadow-[0_8px_20px_rgba(234,88,12,0.28)] hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowDownToLine size={18} />
            <span>
              {availableEarning < 200 
                ? 'Insufficient Balance (Min ₹200)' 
                : hasCompleteBankDetails() 
                  ? 'Request Withdrawal' 
                  : 'Add Bank Details & Withdraw'
              }
            </span>
          </button>
        </form>
      </div>

      {/* Withdrawal History Section */}
      <div id="withdrawals" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800">
              <History size={18} />
            </div>
            <h3 className="text-lg font-black text-[#090A0F]">Withdrawal History</h3>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-black text-gray-800 w-fit">
            {[
              { id: 'all', label: 'All' },
              { id: 'requested', label: 'Pending' },
              { id: 'paid', label: 'Completed' },
              { id: 'rejected', label: 'Rejected' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition font-black ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#EA580C] to-[#EF4444] text-white shadow-sm'
                    : 'text-[#1E293B] hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-[#090A0F] font-bold text-sm">
            Loading your withdrawal requests...
          </div>
        ) : filteredWithdrawals.length > 0 ? (
          <div className="space-y-3">
            {filteredWithdrawals.map((withdrawal) => {
              const status = withdrawal.status;
              const snapshot = withdrawal.payoutDetailsSnapshot || {};
              return (
                <div 
                  key={withdrawal._id} 
                  className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                        status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {status === 'paid' ? <CheckCircle2 size={20} /> :
                         status === 'rejected' ? <AlertCircle size={20} /> :
                         <Clock size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-black text-[#090A0F]">
                            ₹{(withdrawal.amount / 100).toFixed(2)}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black capitalize ${
                            status === 'paid' ? 'bg-emerald-100 text-emerald-900' :
                            status === 'rejected' ? 'bg-rose-100 text-rose-900' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {status === 'requested' ? 'Pending Review' : status}
                          </span>
                        </div>
                        <p className="text-xs text-[#334155] font-bold mt-0.5">
                          Requested on {new Date(withdrawal.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Bank summary badge */}
                    <div className="text-xs text-[#090A0F] font-black bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 w-fit">
                      <span className="text-[#334155] font-bold">Bank:</span> {snapshot.bankName || 'Direct Transfer'} 
                      {snapshot.accountNumber && (
                        <span className="ml-1 text-[#090A0F] font-mono font-bold">(•••• {snapshot.accountNumber.slice(-4)})</span>
                      )}
                    </div>
                  </div>

                  {/* Details section */}
                  <div className="pt-3 text-xs space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-800">
                      <div>
                        <span className="text-[#475569] block text-[11px] font-black uppercase">Account Name</span>
                        <span className="font-extrabold text-[#090A0F]">{snapshot.accountHolderName || user?.name}</span>
                      </div>
                      <div>
                        <span className="text-[#475569] block text-[11px] font-black uppercase">IFSC Code</span>
                        <span className="font-black text-[#090A0F] font-mono">{snapshot.ifscCode || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[#475569] block text-[11px] font-black uppercase">Branch</span>
                        <span className="font-extrabold text-[#090A0F]">{snapshot.branchName || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[#475569] block text-[11px] font-black uppercase">Status Update</span>
                        <span className="font-extrabold text-[#090A0F]">
                          {withdrawal.processedAt 
                            ? new Date(withdrawal.processedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                            : 'In Queue'}
                        </span>
                      </div>
                    </div>

                    {/* If Paid: Show UTR/Payment Reference */}
                    {status === 'paid' && withdrawal.paymentReference && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                          <span>Bank UTR / Transaction Ref: <strong className="font-mono text-black font-black">{withdrawal.paymentReference}</strong></span>
                        </div>
                        <button
                          onClick={() => handleCopy(withdrawal.paymentReference, withdrawal._id)}
                          className="text-xs font-black text-emerald-900 hover:text-emerald-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-xs"
                        >
                          {copiedId === withdrawal._id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedId === withdrawal._id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {/* If Rejected: Show Admin Reason */}
                    {status === 'rejected' && (
                      <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 flex items-start gap-2">
                        <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs">Declined by Admin:</p>
                          <p className="text-xs mt-0.5">{withdrawal.adminReason || 'Information does not match bank records.'}</p>
                          <p className="text-[11px] text-rose-600 font-semibold mt-1">
                            ✓ ₹{(withdrawal.amount / 100).toFixed(2)} was automatically refunded to your earning balance.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
              <History size={26} />
            </div>
            <h4 className="font-extrabold text-[#0F172A] text-base">No Withdrawals Found</h4>
            <p className="text-xs text-[#64748B] font-medium mt-1">
              {activeTab === 'all' 
                ? 'You have not submitted any withdrawal requests yet.'
                : `No ${activeTab} withdrawal requests.`}
            </p>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* BANK DETAILS MODAL */}
      {/* ==================================================== */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#EA580C]">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">Bank Account Details</h3>
                <p className="text-xs text-[#64748B] font-medium">Enter your verified bank details to receive payouts</p>
              </div>
            </div>

            {bankError && (
              <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 flex items-center gap-2 border border-rose-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{bankError}</span>
              </div>
            )}

            <form onSubmit={handleBankFormSubmit} className="space-y-4">
              {/* Account Holder Name */}
              <div>
                <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                  Account Holder Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankForm.accountHolderName}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                  placeholder="Full name as printed in passbook"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Bank Name Selector */}
              <div>
                <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <select
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                  required
                >
                  <option value="">Select your bank</option>
                  {POPULAR_BANKS.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>

                {bankForm.bankName === 'Other Bank' && (
                  <input
                    type="text"
                    required
                    value={bankForm.customBankName}
                    onChange={(e) => setBankForm({ ...bankForm, customBankName: e.target.value })}
                    placeholder="Enter bank name"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                  />
                )}
              </div>

              {/* Account Number & Confirm Account Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="8 to 20 digits"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold font-mono text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                    Confirm Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.confirmAccountNumber}
                    onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="Re-enter account number"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold font-mono text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              {/* IFSC Code & Branch Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                    IFSC Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={bankForm.ifscCode}
                    onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase().trim() })}
                    placeholder="e.g. SBIN0001234"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold font-mono uppercase text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                    Branch Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.branchName}
                    onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                    placeholder="e.g. MG Road Branch"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              {/* UPI ID (Optional) */}
              <div>
                <label className="block text-xs font-extrabold text-[#0F172A] mb-1 uppercase tracking-wider">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={bankForm.upiId}
                  onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-semibold text-[#0F172A] focus:border-[#EA580C] focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBank}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#EF4444] text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:brightness-105 transition disabled:opacity-50"
                >
                  {savingBank ? 'Saving Details...' : 'Save Bank Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CONFIRM WITHDRAWAL MODAL */}
      {/* ==================================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center mx-auto mb-4">
              <ArrowDownToLine size={28} />
            </div>

            <h3 className="text-xl font-extrabold text-center text-[#0F172A]">Confirm Withdrawal</h3>
            <p className="text-center text-xs text-[#64748B] mt-1">Please review payout details before submitting</p>

            <div className="my-6 rounded-2xl bg-gray-50 p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-sm">
                <span className="text-gray-500 font-semibold">Payout Amount</span>
                <span className="font-extrabold text-2xl text-[#EA580C]">₹{Number(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Bank</span>
                <span className="font-bold text-[#0F172A]">{user?.payoutDetails?.bankName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Account Holder</span>
                <span className="font-bold text-[#0F172A]">{user?.payoutDetails?.accountHolderName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Account Number</span>
                <span className="font-mono font-bold text-[#0F172A]">•••• •••• {user?.payoutDetails?.accountNumber?.slice(-4)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">IFSC Code</span>
                <span className="font-mono font-bold text-[#0F172A]">{user?.payoutDetails?.ifscCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Branch</span>
                <span className="font-bold text-[#0F172A]">{user?.payoutDetails?.branchName}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#EF4444] text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:brightness-105 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
