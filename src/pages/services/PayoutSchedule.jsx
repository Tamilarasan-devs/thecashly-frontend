import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';

const PayoutSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/schedule').then(res => {
      setSchedule(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Payout Schedule</h1>
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl divide-y divide-gray-100 p-2">
        {schedule.length > 0 ? schedule.map((item) => (
          <div key={item._id} className="p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm text-[#0F172A]">{item.planSubscription?.plan?.name || 'Product'}</span>
              <span className="font-bold text-[#4A3AFF]">₹{(item.amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Date: {new Date(item.scheduledDate).toLocaleDateString()}</span>
              <span className="uppercase font-semibold text-[#64748B]">{item.status}</span>
            </div>
          </div>
        )) : (
          <div className="p-6 text-center text-sm text-gray-500">No schedule found.</div>
        )}
      </div>
    </div>
  );
};

export default PayoutSchedule;
