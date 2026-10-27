import React, { useState, useEffect, useRef } from 'react';
import api from '../../lib/axios';
import {
  QrCode,
  Upload,
  Copy,
  Check,
  Save,
  Image,
  Eye,
  AlertCircle,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

const AdminPaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingChannel, setSavingChannel] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Full Settings State
  const [settings, setSettings] = useState(null);
  const [channels, setChannels] = useState([]);

  // Global Settings Form
  const [globalForm, setGlobalForm] = useState({
    instructions: '',
    isActive: true,
    minDeposit: 100,
    maxDeposit: 100000
  });

  // Channel Modal State
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | null
  const [editingChannel, setEditingChannel] = useState(null);
  const [channelForm, setChannelForm] = useState({
    title: '',
    upiId: '',
    upiName: '',
    isActive: true,
    isPrimary: false,
    qrCodeImage: ''
  });
  const [channelPreview, setChannelPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Selected Channel for Live Preview in Customer Mockup
  const [previewSelectedChannelId, setPreviewSelectedChannelId] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/payment-settings');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setSettings(d);
        const chs = d.channels || [];
        setChannels(chs);
        setGlobalForm({
          instructions: d.instructions || '',
          isActive: d.isActive !== undefined ? d.isActive : true,
          minDeposit: (d.minDeposit || 10000) / 100,
          maxDeposit: (d.maxDeposit || 10000000) / 100
        });

        // Set live preview selection to primary or first channel
        const primary = chs.find((c) => c.isPrimary) || chs[0];
        if (primary) {
          setPreviewSelectedChannelId(primary._id);
        }
      }
    } catch (err) {
      console.error('Failed to load payment settings', err);
      setStatusMsg({ type: 'error', text: 'Failed to load payment settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpi = (upiId, id) => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Modal to Add Channel
  const handleOpenAddModal = () => {
    setEditingChannel(null);
    setChannelForm({
      title: `UPI QR ${channels.length + 1}`,
      upiId: '',
      upiName: 'The Cashly Payments',
      isActive: true,
      isPrimary: channels.length === 0,
      qrCodeImage: ''
    });
    setChannelPreview('');
    setSelectedFile(null);
    setActiveModal('add');
  };

  // Open Modal to Edit Channel
  const handleOpenEditModal = (channel) => {
    setEditingChannel(channel);
    setChannelForm({
      title: channel.title || 'UPI QR',
      upiId: channel.upiId || '',
      upiName: channel.upiName || 'The Cashly Payments',
      isActive: channel.isActive !== undefined ? channel.isActive : true,
      isPrimary: channel.isPrimary || false,
      qrCodeImage: channel.qrCodeImage || ''
    });
    setChannelPreview(channel.qrCodeImage || '');
    setSelectedFile(null);
    setActiveModal('edit');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setChannelPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Add or Edit Channel
  const handleSubmitChannel = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!channelForm.upiId.trim()) {
      alert('UPI ID is required');
      return;
    }

    setSavingChannel(true);
    try {
      const formData = new FormData();
      formData.append('title', channelForm.title.trim());
      formData.append('upiId', channelForm.upiId.trim());
      formData.append('upiName', channelForm.upiName.trim());
      formData.append('isActive', channelForm.isActive);
      formData.append('isPrimary', channelForm.isPrimary);

      if (selectedFile) {
        formData.append('qrImage', selectedFile);
      } else if (channelPreview && !channelPreview.startsWith('data:')) {
        formData.append('qrCodeImage', channelPreview);
      }

      let res;
      if (editingChannel) {
        res = await api.put(`/admin/payment-settings/channels/${editingChannel._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/admin/payment-settings/channels', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success && res.data.data) {
        const updated = res.data.data;
        setSettings(updated);
        setChannels(updated.channels || []);
        setActiveModal(null);
        setStatusMsg({
          type: 'success',
          text: editingChannel ? 'Payment channel updated successfully!' : 'New QR code & UPI channel added!'
        });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save payment channel');
    } finally {
      setSavingChannel(false);
    }
  };

  // Set Channel as Primary
  const handleSetPrimary = async (channelId) => {
    try {
      const res = await api.patch(`/admin/payment-settings/channels/${channelId}/primary`);
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
        setChannels(res.data.data.channels || []);
        setPreviewSelectedChannelId(channelId);
        setStatusMsg({ type: 'success', text: 'Primary payment channel updated.' });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to set primary channel');
    }
  };

  // Toggle Channel Active / Disabled
  const handleToggleActive = async (channelId) => {
    try {
      const res = await api.patch(`/admin/payment-settings/channels/${channelId}/toggle`);
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
        setChannels(res.data.data.channels || []);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to toggle channel status');
    }
  };

  // Delete Channel
  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm('Are you sure you want to delete this payment QR & UPI channel?')) return;

    try {
      const res = await api.delete(`/admin/payment-settings/channels/${channelId}`);
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
        setChannels(res.data.data.channels || []);
        setStatusMsg({ type: 'success', text: 'Channel removed successfully.' });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete channel');
    }
  };

  // Save Global Settings (Limits, Instructions, Main Switch)
  const handleSaveGlobal = async (e) => {
    e.preventDefault();
    setSavingGlobal(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await api.put('/admin/payment-settings', {
        instructions: globalForm.instructions,
        isActive: globalForm.isActive,
        minDeposit: Number(globalForm.minDeposit) * 100,
        maxDeposit: Number(globalForm.maxDeposit) * 100
      });

      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Global deposit settings saved successfully!' });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save global settings.' });
    } finally {
      setSavingGlobal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#4A3AFF] animate-spin" />
      </div>
    );
  }

  // Active channel for the live customer preview
  const liveChannel =
    channels.find((c) => c._id === previewSelectedChannelId) ||
    channels.find((c) => c.isPrimary) ||
    channels[0] ||
    {};

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F4F2FF] text-[#4A3AFF] flex items-center justify-center shrink-0 shadow-sm">
              <QrCode size={22} />
            </div>
            <span>Payment Channels & QR Codes</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload multiple QR images and UPI IDs. Customers can switch between active QR codes on deposit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            className="px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md shadow-[#4A3AFF]/30 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add QR & UPI Channel</span>
          </button>
        </div>
      </div>

      {/* Global Status Message */}
      {statusMsg.text && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold transition ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <ShieldCheck size={20} className="shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Grid: Channels List & Live Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Channels & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Configured Channels */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#4A3AFF]" />
                <h3 className="font-extrabold text-[#0F172A] text-base">Configured QR / UPI Channels</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#F4F2FF] text-[#4A3AFF] text-xs font-black">
                  {channels.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="text-xs font-bold text-[#4A3AFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Another
              </button>
            </div>

            <div className="space-y-4">
              {/* Equal Shuffle Rotation Notice */}
              <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-emerald-800 leading-relaxed">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Equal Distribution Active:</strong> Customers do not see all QR codes at once. On each deposit request, the system automatically shuffles and balances traffic equally across your active UPI accounts in round-robin sequence.
                </span>
              </div>

              {channels.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <QrCode size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-600">No payment channels configured yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Click the button below to upload your first QR code and UPI ID.</p>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="mt-4 px-4 py-2 bg-[#4A3AFF] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add First Channel
                  </button>
                </div>
              ) : (
                channels.map((ch, idx) => {
                  const isChPrimary = ch.isPrimary;
                  const isChActive = ch.isActive;

                  return (
                    <div
                      key={ch._id || idx}
                      className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                        isChPrimary
                          ? 'border-[#4A3AFF]/40 bg-[#FAF9FF] shadow-sm ring-1 ring-[#4A3AFF]/20'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        
                        {/* QR Thumbnail */}
                        <div className="w-24 h-24 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0 relative overflow-hidden group shadow-xs">
                          {ch.qrCodeImage ? (
                            <img
                              src={getImageUrl(ch.qrCodeImage)}
                              alt={ch.title}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="text-center text-gray-300 flex flex-col items-center">
                              <Image size={24} />
                              <span className="text-[9px] font-bold mt-1">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Channel Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-[#0F172A] text-sm truncate">
                              {ch.title || `UPI QR #${idx + 1}`}
                            </h4>
                            {isChPrimary && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                                <Star size={10} className="fill-amber-500 text-amber-500" /> Primary / Default
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isChActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {isChActive ? 'Active' : 'Disabled'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider">
                              Assigned {ch.usageCount || 0}x
                            </span>
                          </div>

                          {/* UPI ID with copy */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-extrabold text-[#4A3AFF] bg-[#F4F2FF] px-2.5 py-1 rounded-lg border border-[#4A3AFF]/15 select-all">
                              {ch.upiId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUpi(ch.upiId, ch._id)}
                              className="text-gray-400 hover:text-[#4A3AFF] p-1 rounded transition cursor-pointer"
                              title="Copy UPI ID"
                            >
                              {copiedId === ch._id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>

                          {/* Payee Name */}
                          <p className="text-xs text-gray-500 truncate">
                            <span className="font-semibold text-gray-400">Payee:</span>{' '}
                            <span className="font-bold text-gray-700">{ch.upiName || 'The Cashly Payments'}</span>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-col items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {!isChPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(ch._id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition cursor-pointer"
                              title="Set as Primary default channel"
                            >
                              Make Default
                            </button>
                          )}

                          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(ch._id)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                                isChActive
                                  ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              }`}
                              title={isChActive ? 'Disable Channel' : 'Enable Channel'}
                            >
                              {isChActive ? 'Disable' : 'Enable'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(ch)}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition cursor-pointer"
                              title="Edit Details & QR Image"
                            >
                              <Edit2 size={13} />
                            </button>

                            {channels.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteChannel(ch._id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
                                title="Delete Channel"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Global Deposit Controls & Instructions */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 space-y-5">
            <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#4A3AFF]" />
              <span>Global Deposit Rules & Limits</span>
            </h3>

            <form onSubmit={handleSaveGlobal} className="space-y-4">
              {/* Channel Active Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="font-bold text-sm text-[#0F172A] block">Deposit Channel Status</span>
                  <p className="text-xs text-gray-500">Enable or disable manual UPI deposits on customer side</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalForm.isActive}
                    onChange={(e) => setGlobalForm({ ...globalForm, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A3AFF]"></div>
                </label>
              </div>

              {/* Min & Max Deposit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Min Deposit (₹)</label>
                  <input
                    type="number"
                    min="10"
                    value={globalForm.minDeposit}
                    onChange={(e) => setGlobalForm({ ...globalForm, minDeposit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Max Deposit (₹)</label>
                  <input
                    type="number"
                    min="100"
                    value={globalForm.maxDeposit}
                    onChange={(e) => setGlobalForm({ ...globalForm, maxDeposit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Deposit Instructions</label>
                <textarea
                  rows={3}
                  value={globalForm.instructions}
                  onChange={(e) => setGlobalForm({ ...globalForm, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#4A3AFF] resize-none"
                  placeholder="Enter deposit instructions for users..."
                />
              </div>

              <button
                type="submit"
                disabled={savingGlobal}
                className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wider"
              >
                {savingGlobal ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Global Rules</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Interactive Live Customer Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="flex items-center justify-between text-sm font-bold text-[#0F172A]">
            <div className="flex items-center gap-2">
              <Smartphone className="text-[#4A3AFF]" size={18} />
              <span>Customer Screen Preview</span>
            </div>
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
              Interactive Test
            </span>
          </div>

          {/* Mobile Preview Frame */}
          <div className="bg-[#0F172A] rounded-[36px] p-5 shadow-2xl border-4 border-slate-800 text-white relative">
            <div className="text-center pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A3AFF]">Payment Gate</span>
              <h4 className="text-base font-black mt-0.5">Deposit & Add Cash</h4>
            </div>

            {/* Single Shuffled Channel Preview Bar */}
            <div className="my-3 flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="text-[11px] font-bold text-slate-200 truncate">
                  Assigned QR: <strong className="text-white">{liveChannel.title || 'UPI QR'}</strong>
                </span>
              </div>
              {channels.filter((c) => c.isActive).length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const active = channels.filter((c) => c.isActive);
                    if (active.length > 0) {
                      const currIdx = active.findIndex((c) => c._id === previewSelectedChannelId);
                      const nextIdx = (currIdx + 1) % active.length;
                      setPreviewSelectedChannelId(active[nextIdx]._id);
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-[10px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                  title="Simulate user clicking Switch QR"
                >
                  <RefreshCw size={11} />
                  <span>Simulate Switch</span>
                </button>
              )}
            </div>

            {/* QR Card */}
            <div className="my-3 p-4 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center shadow-lg">
              {liveChannel.qrCodeImage ? (
                <img
                  src={getImageUrl(liveChannel.qrCodeImage)}
                  alt="Customer Preview QR"
                  className="w-48 h-48 object-contain rounded-xl"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300">
                  <QrCode size={40} className="mb-2 text-slate-300" />
                  <span className="text-xs font-semibold">Upload QR to preview</span>
                </div>
              )}

              {/* Payee Name */}
              <div className="mt-2 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Merchant Name</span>
                <p className="text-sm font-extrabold text-[#0F172A]">
                  {liveChannel.upiName || 'The Cashly Payments'}
                </p>
              </div>
            </div>

            {/* UPI ID Pill with Copy */}
            <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700/80 flex items-center justify-between">
              <div className="overflow-hidden pr-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active UPI VPA
                </span>
                <span className="text-xs font-mono font-black text-emerald-400 truncate block">
                  {liveChannel.upiId || 'not-configured@upi'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyUpi(liveChannel.upiId, 'preview')}
                className="px-3 py-1.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
              >
                {copiedId === 'preview' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedId === 'preview' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Simulated Deposit Amount & UTR Box */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Min: ₹{globalForm.minDeposit}</span>
                <span>Max: ₹{globalForm.maxDeposit.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                {globalForm.instructions || 'Scan QR or copy UPI ID to transfer, then enter the 12-digit UTR.'}
              </p>
            </div>

            {/* Status indicator */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  globalForm.isActive && liveChannel.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              <span>
                {globalForm.isActive && liveChannel.isActive
                  ? 'Channel Online & Live for Users'
                  : 'Channel Currently Inactive'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: ADD / EDIT PAYMENT CHANNEL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F4F2FF] text-[#4A3AFF] flex items-center justify-center">
                  <QrCode size={16} />
                </div>
                <span>{activeModal === 'edit' ? 'Edit Payment Channel' : 'Add New QR & UPI Channel'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitChannel} className="space-y-4">
              
              {/* Channel Label / Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Channel Name / Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PhonePe QR, Google Pay Business, HDFC UPI"
                  value={channelForm.title}
                  onChange={(e) => setChannelForm({ ...channelForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  UPI ID (VPA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. merchant@okhdfcbank or 9876543210@paytm"
                  value={channelForm.upiId}
                  onChange={(e) => setChannelForm({ ...channelForm, upiId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              {/* Payee / Account Holder Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Payee / Merchant Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Cashly Payments"
                  value={channelForm.upiName}
                  onChange={(e) => setChannelForm({ ...channelForm, upiName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A3AFF]"
                />
              </div>

              {/* QR Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  QR Code Image
                </label>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-24 h-24 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative group">
                    {channelPreview ? (
                      <img
                        src={getImageUrl(channelPreview)}
                        alt="QR Preview"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-center text-gray-400 p-2">
                        <Image size={24} className="mx-auto mb-1" />
                        <span className="text-[10px] font-semibold block">No QR</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-[#4A3AFF]/10 text-[#4A3AFF] hover:bg-[#4A3AFF]/20 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={14} />
                      {channelPreview ? 'Change QR Image' : 'Select QR Image'}
                    </button>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      Upload PhonePe, Paytm, or GPay QR code (PNG, JPG, max 10MB). Automatically stored on Cloudinary.
                    </p>
                  </div>
                </div>
              </div>

              {/* Toggles: Active & Primary */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelForm.isActive}
                    onChange={(e) => setChannelForm({ ...channelForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#4A3AFF] focus:ring-[#4A3AFF] border-gray-300 cursor-pointer"
                  />
                  <span>Active & Available for Users</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelForm.isPrimary}
                    onChange={(e) => setChannelForm({ ...channelForm, isPrimary: e.target.checked })}
                    className="w-4 h-4 rounded text-[#4A3AFF] focus:ring-[#4A3AFF] border-gray-300 cursor-pointer"
                  />
                  <span>Set as Primary / Default Option</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingChannel}
                  className="flex-1 py-2.5 bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white rounded-xl text-xs font-bold shadow-md shadow-[#4A3AFF]/30 flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  {savingChannel ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Channel...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>{activeModal === 'edit' ? 'Update Channel' : 'Save Channel'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPaymentSettings;
