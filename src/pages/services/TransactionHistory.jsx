import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/history').then(res => {
      setHistory(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Transaction History</h1>
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl divide-y divide-gray-100 p-2">
        {history.length > 0 ? history.map((log) => (
          <div key={log._id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{log.description}</p>
              <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
            <span className={`font-bold ${log.type === 'credit' ? 'text-green-600' : 'text-[#0F172A]'}`}>
              {log.type === 'credit' ? '+' : '-'}₹{(Math.abs(log.amount) / 100).toFixed(2)}
            </span>
          </div>
        )) : (
          <div className="p-6 text-center text-sm text-gray-500">No transactions yet.</div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
