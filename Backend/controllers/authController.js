const User = require('../models/User');
const jwt = require('jsonwebtoken');
const smsService = require('../services/smsService');
const consoleSmsService = require('../services/consoleSmsService');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'rentyatra-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { phone } = req.body;

  // Validate phone number
  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }

  // Validate Indian phone number format
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 10-digit Indian phone number'
    });
  }

  try {
    console.log('Starting OTP send process for phone:', cleanPhone);
    
    // Check if user exists
    let user = await User.findByPhoneOrEmail(cleanPhone);
    
    if (!user) {
      console.log('Creating new user for OTP');
      // Create new user if doesn't exist
      user = new User({
        phone: cleanPhone,
        role: 'user',
        isPhoneVerified: false
      });
    } else {
      console.log('Existing user found:', user._id);
    }

    // Generate OTP for all phone numbers
    console.log('Generating OTP');
    let otp;
    
    // Check if it's the default test number
    const isDefaultTestNumber = cleanPhone === '7610416911' || cleanPhone === '9617540664';
    
    if (isDefaultTestNumber) {
      // Use fixed OTP for development
      otp = '110211';
      // Manually set OTP in user object
      user.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      };
      console.log(`🔧 Using default OTP for test number ${cleanPhone}: ${otp}`);
    } else {
      // Generate random OTP for other numbers
      otp = user.generateOTP();
    }
    
    await user.save();
    
    console.log('OTP generated and user saved');
    
    // Send OTP via SMS India Hub (skip SMS for test number)
    let smsResult;
    
    if (isDefaultTestNumber) {
      // Skip SMS for test number, just log OTP
      console.log(`🔧 Test Number ${cleanPhone} - OTP: ${otp} (No SMS sent)`);
      smsResult = {
        success: true,
        messageId: 'test-' + Date.now(),
        message: 'Test number - OTP available without SMS',
        provider: 'Test Mode'
      };
    } else {
      // Send SMS for other numbers
      console.log('Attempting to send SMS via SMS India Hub');
      
      try {
        smsResult = await smsService.sendOTP(cleanPhone, otp);
        console.log('SMS sending result:', smsResult);
        
        if (!smsResult.success) {
          console.error('SMS sending failed:', smsResult.error);
          throw new Error('SMS India Hub failed');
        }
      } catch (smsError) {
        console.error('SMS India Hub error:', smsError.message);
        console.log('🔄 Falling back to Console SMS Service...');
        
        // Use console SMS service as fallback
        try {
          smsResult = await consoleSmsService.sendOTP(cleanPhone, otp);
          console.log('Console SMS result:', smsResult);
        } catch (consoleError) {
          console.error('Console SMS error:', consoleError.message);
          smsResult = {
            success: true,
            messageId: 'fallback-' + Date.now(),
            message: 'SMS service unavailable. Check console for OTP.',
            provider: 'Fallback'
          };
        }
      }
    }

    // Enhanced response with debugging info
    const responseData = {
      phone: user.formattedPhone,
      messageId: smsResult.messageId,
      provider: smsResult.provider || 'SMS India Hub',
      smsStatus: smsResult.status || 'pending'
    };

    // Don't include OTP in response for security
    // responseData.otp = otp;
    // responseData.developmentMode = true;
    // responseData.note = 'SMS India Hub template approval pending. OTP available in response for testing.';

    // Special handling for template approval issues
    if (smsResult.error && smsResult.error.includes('Template needs approval')) {
      responseData.smsStatus = 'template_approval_pending';
      responseData.smsNote = 'SMS template needs approval from SMS India Hub';
    }

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${user.formattedPhone}`,
      data: responseData
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    
    // Check if it's a template approval issue
    if (error.message && error.message.includes('Template needs approval')) {
      // Generate and store OTP anyway for testing purposes
      console.log('SMS template approval needed, proceeding with fallback OTP');
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const cleanPhone = req.body.phone.replace(/\D/g, '');
      
      try {
        // Find or create user and store OTP
        let user = await User.findByPhoneOrEmail(cleanPhone);
        if (!user) {
          user = new User({
            phone: cleanPhone,
            role: 'user',
            isPhoneVerified: false
          });
        }
        
        user.otp = {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        };
        await user.save();
        
        console.log(`🔧 Fallback OTP Generated - Phone: ${cleanPhone}, OTP: ${otp}`);
        
         res.status(200).json({
           success: true,
           message: `OTP sent successfully to ${user.formattedPhone}`,
           data: {
             phone: user.formattedPhone,
             messageId: 'fallback-' + Date.now(),
             provider: 'SMS India Hub',
             smsStatus: 'sent'
           }
         });
        return;
      } catch (dbError) {
        console.error('Database error during fallback OTP generation:', dbError);
      }
    }
    
    // Generic error response for other issues
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify OTP and login/signup user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { phone, otp, name, email } = req.body;

  // Validate required fields
  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required'
    });
  }

  // Validate OTP format
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 6-digit OTP'
    });
  }

  try {
    // Find user by phone
    const cleanPhone = phone.replace(/\D/g, '');
    let user = await User.findByPhoneOrEmail(cleanPhone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please request OTP first.'
      });
    }

    // Verify OTP
    const isValidOTP = user.verifyOTP(otp);
    
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please try again.'
      });
    }

    // Clear OTP after successful verification
    user.clearOTP();
    user.isPhoneVerified = true;

    // If this is a signup (name and email provided), update user info
    if (name && email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address'
        });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email address is already registered'
        });
      }

      user.name = name.trim();
      user.email = email.toLowerCase();
      user.isEmailVerified = false; // Email verification can be done later
    } else if (!user.name || !user.email) {
      // If user doesn't have complete profile, require name and email for signup
      return res.status(400).json({
        success: false,
        message: 'Name and email are required for account creation'
      });
    }

    // Update last login
    await user.updateLastLogin();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Prepare user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.formattedPhone,
      role: user.role,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      profileImage: user.profileImage,
      address: user.address,
      preferences: user.preferences,
      stats: user.stats,
      rentalProfile: user.rentalProfile,
      wallet: user.wallet
    };

    // Determine if this is login or signup
    const isNewUser = !user.name || !user.email;
    const message = isNewUser ? 'Account created and verified successfully!' : 'Login successful!';

    res.status(200).json({
      success: true,
      message: message,
      data: {
        user: userData,
        token,
        isNewUser: isNewUser,
        redirectTo: isNewUser ? '/profile' : '/' // Redirect new users to profile, existing to home
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.'
    });
  }
};

// @desc    Register new user with complete information
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, phone, address } = req.body;

  // Validate required fields
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and phone number are required'
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

  // Validate phone number
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 10-digit Indian phone number'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: cleanPhone }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'phone';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Create new user with complete data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      phone: cleanPhone,
      role: 'user',
      isPhoneVerified: false,
      isEmailVerified: false
    };

    // Add address if provided
    if (address) {
      userData.address = {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        landmark: address.landmark || ''
      };
    }

    const user = new User(userData);
    await user.save();

    // Generate OTP for all numbers
    let otp;
    
    // Check if it's the default test number
    const isDefaultTestNumber = cleanPhone === '7610416911' || cleanPhone === '9617540664';
    
    if (isDefaultTestNumber) {
      // Use fixed OTP for development
      otp = '110211';
      // Manually set OTP in user object
      user.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      };
      console.log(`🔧 Using default OTP for test number ${cleanPhone}: ${otp}`);
    } else {
      // Generate random OTP for other numbers
      otp = user.generateOTP();
    }
    
    await user.save();

    // Send OTP via SMS India Hub (skip SMS for test number)
    let smsResult;
    
    if (isDefaultTestNumber) {
      // Skip SMS for test number, just log OTP
      console.log(`🔧 Test Number ${cleanPhone} - OTP: ${otp} (No SMS sent)`);
      smsResult = {
        success: true,
        messageId: 'test-' + Date.now(),
        message: 'Test number - OTP available without SMS',
        provider: 'Test Mode'
      };
    } else {
      // Send SMS for other numbers
      try {
        smsResult = await smsService.sendOTP(cleanPhone, otp);
        
        if (!smsResult.success) {
          console.error('SMS sending failed:', smsResult.error);
        }
      } catch (smsError) {
        console.error('SMS service error:', smsError.message);
        smsResult = {
          success: true,
          messageId: 'fallback-' + Date.now(),
          message: 'SMS service temporarily unavailable, using fallback mechanism'
        };
      }
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please verify your phone number with the OTP sent.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.formattedPhone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          address: user.address
        },
         messageId: smsResult.messageId
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// @desc    Login user with phone and OTP
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { phone, otp } = req.body;

  // Validate required fields
  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required'
    });
  }

  try {
    // Find user by phone
    const cleanPhone = phone.replace(/\D/g, '');
    const user = await User.findByPhoneOrEmail(cleanPhone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Verify OTP
    const isValidOTP = user.verifyOTP(otp);
    
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please try again.'
      });
    }

    // Clear OTP and update login info
    user.clearOTP();
    await user.updateLastLogin();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Prepare user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.formattedPhone,
      role: user.role,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      profileImage: user.profileImage,
      address: user.address,
      preferences: user.preferences,
      stats: user.stats,
      rentalProfile: user.rentalProfile,
      wallet: user.wallet
    };

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back to RentYatra.',
      data: {
        user: userData,
        token,
        redirectTo: '/' // Redirect to home page after login
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  // Since we're using JWT tokens, logout is handled on the client side
  // by removing the token from storage. However, we can implement
  // token blacklisting here if needed for enhanced security.

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-otp');

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
    role: user.role,
    isPhoneVerified: user.isPhoneVerified,
    isEmailVerified: user.isEmailVerified,
    profileImage: user.profileImage,
    address: user.address,
    preferences: user.preferences,
    stats: user.stats,
    rentalProfile: user.rentalProfile,
    wallet: user.wallet,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  res.status(200).json({
    success: true,
    data: {
      user: userData
    }
  });
};

module.exports = {
  sendOTP,
  verifyOTP,
  register,
  login,
  logout,
  getMe
};
