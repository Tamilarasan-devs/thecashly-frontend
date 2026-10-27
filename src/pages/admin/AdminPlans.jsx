import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Plus, Edit, Trash2, Star, Clock, Sparkles, Eye, EyeOff } from 'lucide-react';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    initialPayment: '',
    dailyAmount: '',
    durationDays: '',
    status: 'active',
    planType: 'regular',
    badgeText: '',
    image: null
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans/admin');
      setPlans(res.data.data);
    } catch (err) {
      try {
        const fallback = await api.get('/plans');
        setPlans(fallback.data.data);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files && files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview('');
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNewPlan = () => {
    setEditingId(null);
    setImagePreview('');
    setCurrentImageUrl('');
    setFormData({
      name: '',
      description: '',
      initialPayment: '',
      dailyAmount: '',
      durationDays: '',
      status: 'active',
      planType: 'regular',
      badgeText: '',
      image: null
    });
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setImagePreview('');
    setCurrentImageUrl(plan.productImage?.url || '');
    const resolvedType = plan.planType || (plan.isSpecial ? 'special' : plan.isComingSoon ? 'coming_soon' : 'regular');
    setFormData({
      name: plan.name,
      description: plan.description || '',
      initialPayment: plan.initialPayment / 100,
      dailyAmount: plan.dailyAmount / 100,
      durationDays: plan.durationDays,
      status: plan.status,
      planType: resolvedType,
      badgeText: plan.badgeText || '',
      image: null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create form data for file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    // Convert to paise for backend
    data.append('initialPayment', Number(formData.initialPayment) * 100);
    data.append('dailyAmount', Number(formData.dailyAmount) * 100);
    data.append('durationDays', formData.durationDays);
    data.append('status', formData.status);
    data.append('planType', formData.planType);
    data.append('isSpecial', formData.planType === 'special');
    data.append('isComingSoon', formData.planType === 'coming_soon');
    data.append('badgeText', formData.badgeText);
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/plans', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      console.error('Error saving plan', err);
      alert('Failed to save plan');
    }
  };

  const handleToggleStatus = async (plan) => {
    const isCurrentlyActive = plan.status === 'active';
    const newStatus = isCurrentlyActive ? 'draft' : 'active';
    try {
      const data = new FormData();
      data.append('status', newStatus);
      await api.put(`/plans/${plan._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchPlans();
    } catch (err) {
      console.error('Error toggling plan status', err);
      alert('Failed to update plan status');
    }
  };

  const handleArchive = async (id) => {
    if (window.confirm('Are you sure you want to archive this plan?')) {
      try {
        await api.delete(`/plans/${id}`);
        fetchPlans();
      } catch (err) {
        console.error('Error archiving plan', err);
      }
    }
  };

  if (loading) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Manage Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage standard, special, and upcoming plans.</p>
        </div>
        <button 
          onClick={handleNewPlan}
          className="flex items-center space-x-2 rounded-xl bg-[#4A3AFF] px-4 py-2.5 text-white hover:bg-[#3D2EE0] font-bold shadow-md shadow-[#4A3AFF]/20 transition"
        >
          <Plus size={18} />
          <span>New Plan</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Plan</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Plan Category</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Deposit</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Daily Return</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Duration</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {plans.map((plan) => {
              const isSpecial = plan.isSpecial || plan.planType === 'special';
              const isComingSoon = plan.isComingSoon || plan.planType === 'coming_soon';

              return (
                <tr key={plan._id} className="hover:bg-gray-50/70 transition">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {plan.productImage?.url ? (
                        <img 
                          src={plan.productImage.url} 
                          alt="" 
                          className="mr-3 h-11 w-11 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`mr-3 h-11 w-11 rounded-xl bg-gradient-to-tr from-[#4A3AFF]/10 to-[#818CF8]/10 text-[#4A3AFF] items-center justify-center font-extrabold text-sm border border-[#4A3AFF]/20 shrink-0 ${plan.productImage?.url ? 'hidden' : 'flex'}`}>
                        {plan.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">{plan.description}</div>
                      </div>
                    </div>
                  </td>

                  {/* Plan Category / Type */}
                  <td className="whitespace-nowrap px-6 py-4">
                    {isSpecial ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-sm">
                        <Star size={12} className="fill-white" />
                        <span>{plan.badgeText || 'Special Plan'}</span>
                      </span>
                    ) : isComingSoon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm">
                        <Clock size={12} />
                        <span>{plan.badgeText || 'Coming Soon'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600">
                        Standard Plan
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-extrabold text-gray-900">
                    ₹{(plan.initialPayment / 100).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-emerald-600">
                    ₹{(plan.dailyAmount / 100).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 font-medium">
                    {plan.durationDays} Days
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(plan)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black transition-all shadow-sm ${
                        plan.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 hover:scale-105' 
                          : 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 hover:scale-105'
                      }`}
                      title={`Click to turn ${plan.status === 'active' ? 'OFF (Hidden & Blurred on User Side)' : 'ON (Active & Visible on User Side)'}`}
                    >
                      {plan.status === 'active' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <Eye size={13} />
                          <span>Active (ON)</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                          <EyeOff size={13} />
                          <span>Hidden (OFF)</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(plan)} 
                        className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit Plan"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleArchive(plan._id)} 
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                        title="Archive Plan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {plans.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                  No plans found. Click "New Plan" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl my-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={20} className="text-[#4A3AFF]" />
              {editingId ? 'Edit Plan' : 'Create New Plan'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Plan Type Selector (Standard, Special, Coming Soon) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Plan Category & Tag <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Regular */}
                  <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition flex flex-col items-center justify-center gap-1 ${
                    formData.planType === 'regular'
                      ? 'border-[#4A3AFF] bg-[#4A3AFF]/5 text-[#4A3AFF]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}>
                    <input
                      type="radio"
                      name="planType"
                      value="regular"
                      checked={formData.planType === 'regular'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-extrabold">Standard</span>
                    <span className="text-[10px] text-gray-400">Regular Plan</span>
                  </label>

                  {/* Special Plan */}
                  <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition flex flex-col items-center justify-center gap-1 ${
                    formData.planType === 'special'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}>
                    <input
                      type="radio"
                      name="planType"
                      value="special"
                      checked={formData.planType === 'special'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-extrabold flex items-center gap-1 text-amber-600">
                      <Star size={13} className="fill-amber-500" /> Special
                    </span>
                    <span className="text-[10px] text-amber-600/70">VIP High Yield</span>
                  </label>

                  {/* Coming Soon */}
                  <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition flex flex-col items-center justify-center gap-1 ${
                    formData.planType === 'coming_soon'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}>
                    <input
                      type="radio"
                      name="planType"
                      value="coming_soon"
                      checked={formData.planType === 'coming_soon'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-extrabold flex items-center gap-1 text-blue-600">
                      <Clock size={13} /> Coming Soon
                    </span>
                    <span className="text-[10px] text-blue-600/70">Teaser / Locked</span>
                  </label>
                </div>
              </div>

              {/* Badge Text (Optional) */}
              {(formData.planType === 'special' || formData.planType === 'coming_soon') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Custom Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    name="badgeText"
                    value={formData.badgeText}
                    placeholder={formData.planType === 'special' ? 'e.g. VIP SPECIAL or 2X RETURNS' : 'e.g. LAUNCHING SOON'}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-semibold focus:border-[#4A3AFF] focus:outline-none"
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  required 
                  placeholder="e.g. Diamond Daily Growth"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-semibold focus:border-[#4A3AFF] focus:outline-none" 
                  onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="description" 
                  value={formData.description} 
                  required 
                  placeholder="Brief plan highlights..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-[#4A3AFF] focus:outline-none" 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Deposit (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="initialPayment" 
                    value={formData.initialPayment} 
                    required 
                    placeholder="1000"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-bold focus:border-[#4A3AFF] focus:outline-none" 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Daily Return (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="dailyAmount" 
                    value={formData.dailyAmount} 
                    required 
                    placeholder="120"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-bold focus:border-[#4A3AFF] focus:outline-none" 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Days) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="durationDays" 
                    value={formData.durationDays} 
                    required 
                    placeholder="30"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-bold focus:border-[#4A3AFF] focus:outline-none" 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status (Visibility)</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange} 
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-semibold focus:border-[#4A3AFF] focus:outline-none bg-white"
                  >
                    <option value="active">Active (Visible to Users)</option>
                    <option value="draft">Hidden (Blurred / Locked on User Side)</option>
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {formData.status === 'draft' || formData.status === 'hidden'
                      ? '🔒 Hidden: Listed on user side with a blur locked effect until turned on.'
                      : '👁️ Active: Visible and open for investments in the app.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Image</label>
                
                {/* Image Preview Box */}
                {(imagePreview || currentImageUrl) && (
                  <div className="mb-3 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50/40 border border-gray-200">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0 shadow-sm">
                      <img 
                        src={imagePreview || currentImageUrl} 
                        alt="Plan Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wider block text-[#4A3AFF]">
                        {imagePreview ? '✨ New Selected Image' : '🖼️ Current Saved Image'}
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                        {formData.image ? formData.image.name : 'Image saved on Cloudinary'}
                      </p>
                      {formData.image && (
                        <p className="text-[10px] text-gray-400 font-semibold">
                          {(formData.image.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, image: null }));
                          setImagePreview('');
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}

                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#4A3AFF]/10 file:text-[#4A3AFF] hover:file:bg-[#4A3AFF]/20 cursor-pointer" 
                  onChange={handleInputChange} 
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Upload JPG, PNG, WEBP. Stored securely on Cloudinary.
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-xl bg-[#4A3AFF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3D2EE0] shadow-md transition"
                >
                  {editingId ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
