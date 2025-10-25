const asyncHandler = require('express-async-handler');
const Subscription = require('../models/Subscription');

// @desc    Get user subscriptions
// @route   GET /api/subscription/user/:userId
// @access  Public
const getUserSubscriptions = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone');

    res.json({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
});

// @desc    Get all subscriptions (for admin)
// @route   GET /api/subscription/all
// @access  Public
const getAllSubscriptions = asyncHandler(async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone');

    res.json({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    console.error('Error fetching all subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
});

// @desc    Get active subscription for user
// @route   GET /api/subscription/active/:userId
// @access  Public
const getActiveSubscription = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching active subscription for userId:', userId);

    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    }).populate('userId', 'name email phone');

    console.log('Found subscription:', subscription);

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error fetching active subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active subscription',
      error: error.message
    });
  }
});

// @desc    Cancel subscription
// @route   PUT /api/subscription/cancel/:subscriptionId
// @access  Public
const cancelSubscription = asyncHandler(async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
});

// @desc    Update subscription counters (listings/boosts)
// @route   PUT /api/subscription/update-counters/:userId
// @access  Public
const updateSubscriptionCounters = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, action } = req.body; // type: 'listing' or 'boost', action: 'increment' or 'decrement'

    if (!type || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type and action'
      });
    }

    // Find active subscription
    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Update counters based on type and action
    if (type === 'listing') {
      if (action === 'increment') {
        subscription.currentListings += 1;
      } else if (action === 'decrement') {
        subscription.currentListings = Math.max(0, subscription.currentListings - 1);
      }
    } else if (type === 'boost') {
      if (action === 'increment') {
        subscription.currentBoosts += 1;
      } else if (action === 'decrement') {
        subscription.currentBoosts = Math.max(0, subscription.currentBoosts - 1);
      }
    }

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription counters updated successfully',
      data: {
        currentListings: subscription.currentListings,
        currentBoosts: subscription.currentBoosts
      }
    });

  } catch (error) {
    console.error('Error updating subscription counters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription counters',
      error: error.message
    });
  }
});

// @desc    Get subscription by ID
// @route   GET /api/subscription/:subscriptionId
// @access  Public
const getSubscriptionById = asyncHandler(async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId)
      .populate('userId', 'name email phone');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message
    });
  }
});

module.exports = {
  getUserSubscriptions,
  getAllSubscriptions,
  getActiveSubscription,
  cancelSubscription,
  updateSubscriptionCounters,
  getSubscriptionById
};
