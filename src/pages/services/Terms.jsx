import React from 'react';

const Terms = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Terms & FAQs</h1>
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 prose prose-sm max-w-none text-gray-600">
        <h3>1. Returns are not guaranteed</h3>
        <p>All scheduled returns are subject to business eligibility and are strictly not guaranteed earnings.</p>
        
        <h3>2. Wallet Balance</h3>
        <p>Wallet balance represents internal credits. It is only eligible for withdrawal if conditions are met.</p>
        
        <h3>3. Refunds</h3>
        <p>We process refunds for top-ups to the original payment method upon valid request.</p>
      </div>
    </div>
  );
};

export default Terms;
