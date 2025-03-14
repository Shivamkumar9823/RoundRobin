import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Claim = mongoose.model('Claim', ClaimSchema);
export default Claim;
