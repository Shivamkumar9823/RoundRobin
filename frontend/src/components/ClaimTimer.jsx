import React, { useEffect, useState } from 'react';

const ClaimTimer = ({ minutesLeft }) => {
  const [progress, setProgress] = useState(100 - ((minutesLeft / 60) * 100));
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (minutesLeft > 0) {
        setProgress(prev => Math.min(prev + (100/60), 100));
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, [minutesLeft]);
  
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600">
        You can claim another coupon in <span className="font-bold text-indigo-600">{minutesLeft}</span> minutes
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ClaimTimer;
