import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/admin/tickets');
      setTickets(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/tickets/${activeTicket._id}`, {
        status: status || activeTicket.status,
        responseMessage: replyMsg
      });
      setActiveTicket(null);
      setReplyMsg('');
      fetchTickets();
    } catch (err) {
      alert('Failed to update ticket');
    }
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">Support Tickets</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">{ticket.user?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{ticket.user?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-[#0F172A]">{ticket.subject}</div>
                  <div className="text-sm text-gray-500 truncate w-48">{ticket.message}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button 
                    onClick={() => { setActiveTicket(ticket); setStatus(ticket.status); }}
                    className="text-indigo-600 hover:text-indigo-900 font-bold"
                  >
                    View / Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-gray-900">{activeTicket.subject}</h2>
            <p className="text-sm text-gray-500 mb-4 border-b pb-4">{activeTicket.message}</p>
            
            <div className="mb-4 max-h-40 overflow-y-auto space-y-3">
              {activeTicket.responses.map((resp, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${resp.sender === 'admin' ? 'bg-indigo-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                  <span className="font-bold text-xs uppercase block mb-1 text-gray-500">{resp.sender}</span>
                  {resp.message}
                </div>
              ))}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reply Message</label>
                <textarea 
                  className="mt-1 w-full rounded-md border p-2" 
                  rows="3"
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  placeholder="Type your reply here..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Update Status</label>
                <select className="mt-1 w-full rounded-md border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setActiveTicket(null)} className="rounded-md border px-4 py-2 text-gray-600">Close</button>
                <button type="submit" className="rounded-md bg-[#4A3AFF] px-4 py-2 text-white">Save & Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
