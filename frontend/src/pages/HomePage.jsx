import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CouponCard from '../components/CouponCard';
import ClaimTimer from '../components/ClaimTimer';
import ConfettiEffect from '../components/ConfettiEffect';
import './HomePage.css'; // Import CSS file

const API_URL = 'http://localhost:5000/api';


const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [canClaim, setCanClaim] = useState(true);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);



 useEffect(() => { 
    checkClaimEligibility();
    const timer = setInterval(checkClaimEligibility, 60000);  //1Min.
    return () => clearInterval(timer);
  }, []);


  const checkClaimEligibility = async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons/can-claim`, { withCredentials: true });
      setCanClaim(response.data.canClaim);
      setMinutesLeft(response.data.minutesLeft);
    } catch (err) {
      setError('Unable to check eligibility. Please refresh the page.');
    }
  };






const handleClaimCoupon = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/coupons/claim`, {}, { withCredentials: true });
      setCoupon(response.data.coupon);
      setMessage(response.data.message);
      setShowConfetti(true);
      checkClaimEligibility();
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim coupon. Try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setMessage('Coupon copied to clipboard!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(() => setError('Failed to copy code. Please select and copy manually.'));
  };

  return (
    <div className="container">
      <div className="heading">
        <h1 className="title">Claim Your Coupon</h1>
        <p className="subtitle">Get exclusive discounts with our system</p>
      </div>



      <div className="card">
        {error && <div className="error">{error}</div>}
        {message && !error && <div className="success">{message}</div>}

        <div className="text-center">
          {
          !coupon ? (
            <>
              <p>Click the button below to claim your coupon</p>
              <button
                onClick={handleClaimCoupon}
                disabled={loading || !canClaim}
                className={`button ${loading || !canClaim ? 'disabled' : ''}`}
              >
                {loading ? 'Processing...' : canClaim ? 'Claim My Coupon' : 'Coupon Claimed'}
              </button>
              {!canClaim && <ClaimTimer minutesLeft={minutesLeft} />}
            </>
           )
           : 
           (
            <CouponCard coupon={coupon} onCopy={handleCopy} />
           )}
        </div>
      </div>

      <div className="info-box">
        <h3>How it works:</h3>
        <ul>
          <li>Each guest can claim one coupon per hour</li>
          <li>Coupons are distributed in a round-robin manner</li>
          <li>The system prevents multiple claims from the same device</li>
          <li>No account creation or login required</li>
        </ul>
      </div>

      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default HomePage;
