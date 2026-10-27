import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { 
  Headphones, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Sparkles, 
  Plus, 
  CornerDownRight,
  HelpCircle
} from 'lucide-react';

const CATEGORIES = [
  'Deposit / UPI Payment',
  'Withdrawal Request',
  'Product / Plan Returns',
  'Game / Prediction',
  'Account & Security',
  'Other Query'
];

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const [form, setForm] = useState({ 
    category: CATEGORIES[0],
    subject: '', 
    message: '' 
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/services/tickets');
      if (res.data.success) {
        const ticketList = res.data.data || [];
        setTickets(ticketList);
        // Automatically expand the newest ticket if available and none expanded yet
        if (ticketList.length > 0 && !expandedTicketId) {
          setExpandedTicketId(ticketList[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in both subject and message.' });
      return;
    }

    setSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const fullSubject = form.category ? `[${form.category}] ${form.subject.trim()}` : form.subject.trim();
      const res = await api.post('/services/tickets', {
        subject: fullSubject,
        message: form.message.trim()
      });

      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Your support ticket has been created! Our team will respond shortly.' });
        setForm({ category: CATEGORIES[0], subject: '', message: '' });
        setShowCreateForm(false);
        await fetchTickets();
        if (res.data.data?._id) {
          setExpandedTicketId(res.data.data._id);
        }
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to submit ticket. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (ticketId) => {
    const text = replyText[ticketId]?.trim();
    if (!text) return;

    setReplyingId(ticketId);
    try {
      const res = await api.post(`/services/tickets/${ticketId}/reply`, { message: text });
      if (res.data.success) {
        setReplyText(prev => ({ ...prev, [ticketId]: '' }));
        await fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reply');
    } finally {
      setReplyingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw size={12} className="animate-spin" /> In Progress
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} /> Open
          </span>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 font-sans px-2 sm:px-0">
      
      {/* Top Banner */}
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#4A3AFF] via-[#3B2ED0] to-[#1E1475] p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold mb-2">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>Official Help Desk</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Help & Support</h1>
            <p className="text-xs text-white/80 mt-1 max-w-sm">
              Have an issue with deposits, plans, or payouts? Send us a ticket and our support team will reply directly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setStatusMsg({ type: '', text: '' });
            }}
            className="self-start sm:self-center px-4 py-2.5 bg-white text-[#4A3AFF] hover:bg-white/95 text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            {showCreateForm ? <ChevronUp size={16} /> : <Plus size={16} />}
            <span>{showCreateForm ? 'Close Form' : 'Raise New Ticket'}</span>
          </button>
        </div>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* New Ticket Form (Collapsible) */}
      {showCreateForm && (
        <form onSubmit={handleCreateTicket} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
              <MessageSquare size={18} className="text-[#4A3AFF]" />
              <span>Create Support Ticket</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Average reply &lt; 15 mins</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Query Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Subject</label>
            <input 
              type="text" 
              placeholder="e.g. Deposit not credited / UTR issue" 
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Detailed Message</label>
            <textarea 
              placeholder="Please explain your question or issue in detail. Include any transaction ID / UTR number if applicable..." 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#4A3AFF] focus:bg-white transition h-28 resize-none" 
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-xs font-bold rounded-xl shadow-md shadow-[#4A3AFF]/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tickets List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-[#0F172A] text-lg flex items-center gap-2">
            <span>Your Tickets</span>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {tickets.length}
            </span>
          </h3>
          <button
            type="button"
            onClick={fetchTickets}
            className="text-xs font-bold text-[#4A3AFF] hover:underline flex items-center gap-1"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 flex flex-col items-center shadow-sm">
            <RefreshCw size={24} className="animate-spin text-[#4A3AFF] mb-2" />
            <span className="text-xs font-semibold">Loading your support history...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4A3AFF] mb-3">
              <Headphones size={28} />
            </div>
            <h4 className="font-bold text-sm text-[#0F172A]">No Support Tickets Yet</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Need assistance? Click "Raise New Ticket" above to connect with our support agents.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => {
              const isExpanded = expandedTicketId === ticket._id;
              const responses = ticket.responses || [];
              const adminRepliesCount = responses.filter(r => r.sender === 'admin').length;
              const hasAdminReplied = adminRepliesCount > 0;

              return (
                <div 
                  key={ticket._id} 
                  className={`bg-white rounded-[24px] border transition-all overflow-hidden ${
                    isExpanded 
                      ? 'border-[#4A3AFF]/30 shadow-md ring-1 ring-[#4A3AFF]/20' 
                      : 'border-gray-100 shadow-sm hover:border-gray-200'
                  }`}
                >
                  {/* Ticket Header Bar (Click to Expand / Collapse) */}
                  <div 
                    onClick={() => setExpandedTicketId(isExpanded ? null : ticket._id)}
                    className="p-5 cursor-pointer flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {getStatusBadge(ticket.status)}
                          {hasAdminReplied && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-[#4A3AFF] border border-indigo-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4A3AFF] animate-ping"></span>
                              Admin Replied ({adminRepliesCount})
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-[#0F172A] text-sm leading-snug">
                          {ticket.subject}
                        </h4>
                      </div>
                      <div className="text-gray-400 hover:text-gray-600 transition shrink-0 pt-1">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span>Created {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{responses.length} {responses.length === 1 ? 'Message' : 'Messages'} in thread</span>
                    </div>
                  </div>

                  {/* Expanded Conversation View */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-[#F8FAFC] p-5 space-y-4">
                      
                      {/* Initial Ticket Message */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 mt-0.5">
                          <User size={15} />
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-extrabold text-[#0F172A]">You (Initial Request)</span>
                            <span className="text-[10px] text-gray-400 font-semibold">
                              {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {ticket.message}
                          </p>
                        </div>
                      </div>

                      {/* Conversation Thread (Responses) */}
                      {responses.map((resp, idx) => {
                        const isAdmin = resp.sender === 'admin';
                        return (
                          <div 
                            key={resp._id || idx} 
                            className={`flex items-start gap-3 ${isAdmin ? '' : 'flex-row-reverse'}`}
                          >
                            {/* Avatar */}
                            {isAdmin ? (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4A3AFF] to-[#818CF8] flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
                                <ShieldCheck size={16} />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 mt-0.5">
                                <User size={15} />
                              </div>
                            )}

                            {/* Message Card */}
                            <div 
                              className={`flex-1 max-w-[88%] p-4 rounded-2xl shadow-xs border ${
                                isAdmin 
                                  ? 'bg-gradient-to-br from-[#EFF6FF] via-[#EEF2FF] to-[#FAF5FF] border-[#4A3AFF]/20 rounded-tl-sm' 
                                  : 'bg-white border-gray-100 rounded-tr-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[11px] font-extrabold ${isAdmin ? 'text-[#4A3AFF]' : 'text-[#0F172A]'}`}>
                                    {isAdmin ? 'Cashly Support Team' : 'You'}
                                  </span>
                                  {isAdmin && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#4A3AFF] text-white px-1.5 py-0.2 rounded">
                                      Official
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 font-semibold">
                                  {resp.createdAt ? new Date(resp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className={`text-xs whitespace-pre-wrap leading-relaxed ${isAdmin ? 'text-slate-800 font-medium' : 'text-slate-700'}`}>
                                {resp.message}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {/* Reply Box */}
                      <div className="pt-3 border-t border-gray-200/80">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Type a follow-up reply..."
                            value={replyText[ticket._id] || ''}
                            onChange={(e) => setReplyText({ ...replyText, [ticket._id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendReply(ticket._id);
                              }
                            }}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#4A3AFF] transition"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendReply(ticket._id)}
                            disabled={replyingId === ticket._id || !replyText[ticket._id]?.trim()}
                            className="px-4 py-2.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            {replyingId === ticket._id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <>
                                <Send size={13} />
                                <span className="hidden sm:inline">Send</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};

export default Support;
