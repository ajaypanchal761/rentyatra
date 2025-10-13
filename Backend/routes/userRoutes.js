const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  updateUserPreferences,
  deactivateAccount,
  reactivateAccount,
  changePhoneNumber,
  getUserActivity,
  exportUserData
} = require('../controllers/userController');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, getUserStats);

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', protect, updateUserPreferences);

// @route   PUT /api/users/deactivate
// @desc    Deactivate user account
// @access  Private
router.put('/deactivate', protect, deactivateAccount);

// @route   PUT /api/users/reactivate
// @desc    Reactivate user account
// @access  Private
router.put('/reactivate', protect, reactivateAccount);

// @route   POST /api/users/change-phone
// @desc    Change phone number
// @access  Private
router.post('/change-phone', protect, changePhoneNumber);

// @route   GET /api/users/activity
// @desc    Get user activity log
// @access  Private
router.get('/activity', protect, getUserActivity);

// @route   GET /api/users/export
// @desc    Export user data
// @access  Private
router.get('/export', protect, exportUserData);

module.exports = router;
