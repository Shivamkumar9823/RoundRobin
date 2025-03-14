import React from 'react';

const CouponCard = ({ coupon, onCopy }) => {
  if (!coupon) return null;
  
  return (
    <div className="p-4 rounded-lg border-2 border-dashed">
      <h3 className="text-xl font-bold text-center mb-2 text-indigo-700">Your Coupon</h3>
      <div className="coupon-card bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-md text-center">
        <div className="text-2xl font-mono font-bold mb-1 text-indigo-800">
          {coupon.code}
        </div>
        <p className="text-gray-700">{coupon.description}</p>
      </div>
      <div className="text-center mt-4">
        <button 
          onClick={() => onCopy(coupon.code)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition text-sm"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
