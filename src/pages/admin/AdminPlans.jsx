import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    initialPayment: '',
    dailyAmount: '',
    durationDays: '',
    status: 'active',
    image: null
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await api.post('/plans', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      console.error('Error creating plan', err);
      alert('Failed to create plan');
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
        <h1 className="text-2xl font-bold text-[#0F172A]">Manage Plans</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 rounded-lg bg-[#4A3AFF] px-4 py-2 text-white hover:bg-[#64748B]"
        >
          <Plus size={16} />
          <span>New Plan</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Deposit</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Daily Return</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    {plan.productImage?.url && (
                      <img src={plan.productImage.url} alt="" className="mr-3 h-8 w-8 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.description}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ₹{(plan.initialPayment / 100).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#4A3AFF]">
                  ₹{(plan.dailyAmount / 100).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {plan.durationDays} Days
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleArchive(plan._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Create New Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input type="text" name="name" required className="mt-1 w-full rounded-md border p-2" onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Initial Payment (₹)</label>
                  <input type="number" name="initialPayment" required className="mt-1 w-full rounded-md border p-2" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Return (₹)</label>
                  <input type="number" name="dailyAmount" required className="mt-1 w-full rounded-md border p-2" onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
                <input type="number" name="durationDays" required className="mt-1 w-full rounded-md border p-2" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 w-full rounded-md border p-2">
                  <option value="active">Active (Visible to users)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" name="image" accept="image/*" className="mt-1 w-full text-sm" onChange={handleInputChange} />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-md border px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="rounded-md bg-[#4A3AFF] px-4 py-2 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
