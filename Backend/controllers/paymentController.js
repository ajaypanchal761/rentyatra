const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const options = {
      amount: Math.round(parseFloat(amount) * 100), // Convert rupees to paise
      currency: currency,
      receipt: receipt,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Public
const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      subscriptionId,
      amount 
    } = req.body;

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update subscription payment status
    if (subscriptionId) {
      const subscription = await Subscription.findById(subscriptionId);
      
      if (subscription) {
        subscription.paymentStatus = 'paid';
        subscription.paymentId = razorpay_payment_id;
        subscription.paymentCompletedAt = new Date();
        subscription.status = 'active';
        await subscription.save();

        console.log('Subscription payment verified:', {
          subscriptionId,
          paymentId: razorpay_payment_id,
          amount
        });
      } else {
        console.error('Subscription not found:', subscriptionId);
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount
      }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Public
const getPaymentDetails = asyncHandler(async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

// @desc    Create subscription before payment
// @route   POST /api/payment/create-subscription
// @access  Public
const createSubscription = asyncHandler(async (req, res) => {
  try {
    const { userId, planId, planName, price, maxListings, maxBoosts, maxPhotos } = req.body;

    if (!userId || !planId || !planName || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Default 30 days

    // Create subscription record
    const subscription = new Subscription({
      userId,
      planId,
      planName,
      status: 'pending',
      startDate,
      endDate,
      price,
      paymentStatus: 'pending',
      currentListings: 0,
      currentBoosts: 0,
      totalViews: 0,
      totalRevenue: 0,
      maxListings: maxListings || 0,
      maxBoosts: maxBoosts || 0,
      maxPhotos: maxPhotos || 0
    });

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscriptionId: subscription._id,
        status: subscription.status
      }
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message
    });
  }
});

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  createSubscription
};
