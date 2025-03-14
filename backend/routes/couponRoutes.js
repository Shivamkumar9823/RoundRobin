import express from 'express';
import { initializeCoupons, checkEligibility, claimCoupon, getAllCoupons } from '../controllers/couponController.js';

const router = express.Router();

//initiallise this function
initializeCoupons();

// Routes
router.get('/can-claim', checkEligibility);
router.post('/claim', claimCoupon);
router.get('/', getAllCoupons);

export default router;
