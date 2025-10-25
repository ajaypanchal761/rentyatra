const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  createSubscription
} = require('../controllers/paymentController');

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Public
router.post('/create-order', createOrder);

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Public
router.post('/verify', verifyPayment);

// @route   POST /api/payment/create-subscription
// @desc    Create subscription before payment
// @access  Public
router.post('/create-subscription', createSubscription);

// @route   GET /api/payment/:paymentId
// @desc    Get payment details
// @access  Public
router.get('/:paymentId', getPaymentDetails);

module.exports = router;
