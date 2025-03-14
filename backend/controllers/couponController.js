import Coupon from '../models/coupon.js';
import Claim from '../models/Claim.js';


const HOUR_IN_MS = 60 * 60 * 1000;
const CLAIM_COOLDOWN = HOUR_IN_MS; 

//initialize DB;
export const initializeCoupons = async () => {
  const count = await Coupon.countDocuments();
  if (count === 0) {
    const initialCoupons = [
      { code: 'VHGFY5E65', description: '10% off your purchase' },
      { code: 'E75DTF56C', description: '10% off your purchase' },
      { code: 'BOGO50', description: '10% off your purchase' },
      { code: 'HBUYTC6F', description: '15% off your purchase' },
      { code: 'GHHVTY78R', description: '25% off your purchase' }
    ];
    
    await Coupon.insertMany(initialCoupons);
    console.log('Database initialized with coupons');
  }
};




//=============================================check=======================================================================;
export const checkEligibility = async (req, res) => {
  try {
    const ip = req.ip;
    const deviceId = req.cookies.deviceId || '';
    const now = Date.now();

    // Check IP restriction
    const ipClaim = await Claim.findOne({
      ip,
      timestamp: { $gt: new Date(now - CLAIM_COOLDOWN) }
    });

    if (ipClaim) {
      const timeLeft = CLAIM_COOLDOWN - (now - new Date(ipClaim.timestamp).getTime());
      const minutesLeft = Math.ceil(timeLeft / (60 * 1000));

      return res.json({
        canClaim: false,
        timeLeft,
        minutesLeft,
        reason: 'ip'
      });
    }

    // Check device ID restriction if cookie exists
    if (deviceId) {
      const deviceClaim = await Claim.findOne({
        deviceId,
        timestamp: { $gt: new Date(now - CLAIM_COOLDOWN) }
      });

      if (deviceClaim) {
        const timeLeft = CLAIM_COOLDOWN - (now - new Date(deviceClaim.timestamp).getTime());
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));

        return res.json({
          canClaim: false,
          timeLeft,
          minutesLeft,
          reason: 'device'
        });
      }
    }

    res.json({
      canClaim: true,
      timeLeft: 0,
      minutesLeft: 0
    });

  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ message: 'Server error while checking eligibility' });
  }
};





//=======================================================Claim========================================================//
export const claimCoupon = async (req, res) => {
  try {
    const ip = req.ip;
    const now = Date.now();
    
    let deviceId = req.cookies.deviceId;
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      res.cookie('deviceId', deviceId, { 
        maxAge: 365 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        domain: 'https://round-robin-psi.vercel.app'
      });
    }

    //all the claims with in 1hr;
    const recentClaim = await Claim.findOne({
      $or: [
        { ip, timestamp: { $gt: new Date(now - CLAIM_COOLDOWN) } },
        { deviceId, timestamp: { $gt: new Date(now - CLAIM_COOLDOWN) } }
      ] 
    });

    if (recentClaim) {
      const timeLeft = CLAIM_COOLDOWN - (now - new Date(recentClaim.timestamp).getTime());
      const minutesLeft = Math.ceil(timeLeft / (60 * 1000));

      return res.status(429).json({
        message: `You've already claimed a coupon. Please wait ${minutesLeft} minutes before claiming another.`
      });
    }


    const coupons = await Coupon.find({ active: true });
    if (coupons.length === 0) {
      return res.status(404).json({ message: 'No coupons available at this time' });
    }

    // Get the last claimed coupon (for round-robin)
    const lastClaim = await Claim.findOne().sort({ timestamp: -1 });

    let nextCoupon;
    if (!lastClaim) {
      nextCoupon = coupons[0];
    } else {
      const lastCouponIndex = coupons.findIndex(c => 
        c._id.toString() === lastClaim.couponId.toString()
      );

      const nextIndex = (lastCouponIndex + 1) % coupons.length;
      nextCoupon = coupons[nextIndex];
    }

    const claim = new Claim({
      ip,
      deviceId,
      couponId: nextCoupon._id,
      timestamp: new Date()
    });

    await claim.save();

    res.json({
      success: true,
      coupon: {
        code: nextCoupon.code,
        description: nextCoupon.description
      },
      message: 'Coupon claimed successfully!'
    });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    res.status(500).json({ message: 'Server error while claiming coupon' });
  }
};








// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Server error while fetching coupons' });
  }
};
