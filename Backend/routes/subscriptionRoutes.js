const express = require('express');
const router = express.Router();
const {
  getUserSubscriptions,
  getAllSubscriptions,
  getActiveSubscription,
  cancelSubscription,
  updateSubscriptionCounters,
  getSubscriptionById
} = require('../controllers/subscriptionController');

// @route   GET /api/subscription/user/:userId
// @desc    Get user subscriptions
// @access  Public
router.get('/user/:userId', getUserSubscriptions);

// @route   GET /api/subscription/active/:userId
// @desc    Get active subscription for user
// @access  Public
router.get('/active/:userId', getActiveSubscription);

// @route   GET /api/subscription/all
// @desc    Get all subscriptions (for admin)
// @access  Public
router.get('/all', getAllSubscriptions);

// @route   PUT /api/subscription/cancel/:subscriptionId
// @desc    Cancel subscription
// @access  Public
router.put('/cancel/:subscriptionId', cancelSubscription);

// @route   PUT /api/subscription/update-counters/:userId
// @desc    Update subscription counters (listings/boosts)
// @access  Public
router.put('/update-counters/:userId', updateSubscriptionCounters);

// @route   GET /api/subscription/:subscriptionId
// @desc    Get subscription by ID
// @access  Public
router.get('/:subscriptionId', getSubscriptionById);

module.exports = router;
