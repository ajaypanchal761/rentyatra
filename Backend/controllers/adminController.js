const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token for Admin
const generateAdminToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET || 'rentyatra-secret-key', {
    expiresIn: '7d', // Admin tokens last longer
  });
};

// @desc    Admin Signup
// @route   POST /api/admin/signup
// @access  Public
const adminSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  // Validate password
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Validate password confirmation
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }


  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const adminData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      adminKey: 'ADMIN2024', // Default admin key
      role: 'admin', // Default role
      isEmailVerified: true, // Admin emails are considered verified
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    // Generate JWT token
    const token = generateAdminToken(admin._id);

    // Prepare admin data for response (exclude sensitive fields)
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      profileImage: admin.profileImage,
      isActive: admin.isActive,
      isEmailVerified: admin.isEmailVerified,
      createdAt: admin.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      data: {
        admin: adminResponse,
        token
      }
    });

  } catch (error) {
    console.error('Admin Signup Error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Admin signup failed. Please try again.'
    });
  }
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  try {
    // Find admin by email and include password
    const admin = await Admin.findByEmail(email).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated. Please contact super admin.'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Update last login
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    await admin.updateLastLogin(clientIP);

    // Generate JWT token
    const token = generateAdminToken(admin._id);

    // Prepare admin data for response
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      profileImage: admin.profileImage,
      isActive: admin.isActive,
      isEmailVerified: admin.isEmailVerified,
      lastLoginAt: admin.stats.lastLoginAt,
      totalLogins: admin.stats.totalLogins,
      createdAt: admin.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Admin login successful!',
      data: {
        admin: adminResponse,
        token
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed. Please try again.'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update last activity
    await admin.incrementActions();

    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      profileImage: admin.profileImage,
      phone: admin.phone,
      isActive: admin.isActive,
      isEmailVerified: admin.isEmailVerified,
      lastLoginAt: admin.stats.lastLoginAt,
      lastActivity: admin.lastActivity,
      totalLogins: admin.stats.totalLogins,
      actionsPerformed: admin.stats.actionsPerformed,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    res.status(200).json({
      success: true,
      data: {
        admin: adminResponse
      }
    });

  } catch (error) {
    console.error('Get Admin Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile'
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
const updateAdminProfile = async (req, res) => {
  const { name, phone, profileImage } = req.body;

  try {
    const admin = await Admin.findById(req.admin.adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update allowed fields
    if (name) admin.name = name.trim();
    if (phone) admin.phone = phone;
    if (profileImage) admin.profileImage = profileImage;

    await admin.save();
    await admin.incrementActions();

    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      profileImage: admin.profileImage,
      phone: admin.phone,
      isActive: admin.isActive,
      isEmailVerified: admin.isEmailVerified,
      lastLoginAt: admin.stats.lastLoginAt,
      lastActivity: admin.lastActivity,
      totalLogins: admin.stats.totalLogins,
      actionsPerformed: admin.stats.actionsPerformed,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin: adminResponse
      }
    });

  } catch (error) {
    console.error('Update Admin Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin profile'
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private (Admin)
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'All password fields are required'
    });
  }

  // Validate new password
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  // Validate password confirmation
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'New passwords do not match'
    });
  }

  try {
    const admin = await Admin.findById(req.admin.adminId).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();
    await admin.incrementActions();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// @desc    Admin Logout
// @route   POST /api/admin/logout
// @access  Private (Admin)
const adminLogout = async (req, res) => {
  try {
    // Update last activity
    const admin = await Admin.findById(req.admin.adminId);
    if (admin) {
      admin.lastActivity = new Date();
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully'
    });

  } catch (error) {
    console.error('Admin Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const stats = await Admin.getAdminStats();
    
    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalAdmins: 0,
          activeAdmins: 0,
          superAdmins: 0,
          admins: 0,
          moderators: 0
        }
      }
    });

  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
};

// Validate admin token
const validateAdminToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select('-password -adminKey');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          isActive: admin.isActive,
          isEmailVerified: admin.isEmailVerified,
          lastLoginAt: admin.lastLoginAt,
          createdAt: admin.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token validation',
      error: error.message
    });
  }
};

// Get all users for admin management
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', plan = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      if (status === 'Active') {
        filter.isActive = true;
      } else if (status === 'Inactive') {
        filter.isActive = false;
      } else if (status === 'Blocked') {
        filter.isBanned = true;
      }
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('name email phone role isPhoneVerified isEmailVerified profileImage isActive isBanned createdAt stats wallet documents')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean() to get plain JavaScript objects

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Format user data for admin view
    const formattedUsers = users.map(user => {
      const formattedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // Use phone directly since we're using lean()
        avatar: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
        plan: user.subscription?.plan || 'Basic',
        status: user.isBanned ? 'Blocked' : user.isActive ? 'Active' : 'Inactive',
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        joinedDate: user.createdAt.toISOString().split('T')[0],
        lastLoginAt: user.stats?.lastLoginAt,
      aadharCardFront: user.documents?.aadhar?.frontImage?.url || null,
      aadharCardBack: user.documents?.aadhar?.backImage?.url || null,
      aadharVerified: user.documents?.aadhar?.verified || false,
        stats: user.stats,
        wallet: user.wallet
      };
      
      // Debug log for first user
      if (user._id.toString() === '68ecf1405dc76114574b7b11') {
        console.log('Debug - User documents:', JSON.stringify(user.documents, null, 2));
        console.log('Debug - Aadhar front image URL:', user.documents?.aadhar?.frontImage?.url);
        console.log('Debug - Aadhar back image URL:', user.documents?.aadhar?.backImage?.url);
        console.log('Debug - Formatted user aadhar data:', {
          front: formattedUser.aadharCardFront,
          back: formattedUser.aadharCardBack,
          verified: formattedUser.aadharVerified
        });
      }
      
      return formattedUser;
    });

    // Test Cloudinary URLs for debugging
    const testUser = formattedUsers.find(u => u.id === '68ecf1405dc76114574b7b11');
    if (testUser) {
      console.log('Test - Cloudinary URLs:');
      console.log('Front URL:', testUser.aadharCardFront);
      console.log('Back URL:', testUser.aadharCardBack);
      console.log('Front URL accessible:', testUser.aadharCardFront ? 'Yes' : 'No');
      console.log('Back URL accessible:', testUser.aadharCardBack ? 'Yes' : 'No');
    }

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Update user status (ban/unban, activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'block', 'unblock', 'activate', 'deactivate'

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    switch (action) {
      case 'block':
        user.isBanned = true;
        user.isActive = false;
        break;
      case 'unblock':
        user.isBanned = false;
        user.isActive = true;
        break;
      case 'activate':
        user.isActive = true;
        user.isBanned = false;
        break;
      case 'deactivate':
        user.isActive = false;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    await user.save();

    res.json({
      success: true,
      message: `User ${action}ed successfully`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.isBanned ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'
        }
      }
    });

  } catch (error) {
    console.error('Update User Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Get user details for admin view
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -otp -__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.formattedPhone,
      avatar: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      plan: user.subscription?.plan || 'Basic',
      status: user.isBanned ? 'Blocked' : user.isActive ? 'Active' : 'Inactive',
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      joinedDate: user.createdAt.toISOString().split('T')[0],
      lastLoginAt: user.stats?.lastLoginAt,
      address: user.address,
      documents: {
        ...user.documents,
        aadharCardFront: user.documents?.aadhar?.frontImage?.url,
        aadharCardBack: user.documents?.aadhar?.backImage?.url,
        aadharVerified: user.documents?.aadhar?.verified,
        aadharVerificationStatus: user.documents?.aadhar?.verificationStatus
      },
      stats: user.stats,
      wallet: user.wallet,
      preferences: user.preferences,
      rentalProfile: user.rentalProfile
    };

    res.json({
      success: true,
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Get User Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
  validateAdminToken,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  adminLogout,
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getUserDetails
};
