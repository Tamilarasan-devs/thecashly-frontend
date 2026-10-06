import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    api.get('/services/tickets').then(res => {
      setTickets(res.data.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services/tickets', form);
      setForm({ subject: '', message: '' });
      fetchTickets();
      alert('Ticket raised successfully');
    } catch (err) {
      alert('Failed to raise ticket');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-2xl font-bold text-[#0F172A]">Help & Support</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-[#0F172A]">Create a Ticket</h3>
        <input 
          type="text" 
          placeholder="Subject" 
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-lg border border-gray-200 p-3" 
          required 
        />
        <textarea 
          placeholder="How can we help?" 
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-gray-200 p-3 h-24" 
          required
        ></textarea>
        <button className="w-full rounded-lg bg-[#4A3AFF] py-3 text-white font-bold">Submit Ticket</button>
      </form>

      <div className="space-y-4 mt-6">
        <h3 className="font-bold text-[#0F172A]">Previous Tickets</h3>
        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-[#0F172A] text-sm">{ticket.subject}</h4>
              <span className="text-xs uppercase px-2 py-1 bg-gray-100 rounded font-semibold">{ticket.status}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(ticket.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
