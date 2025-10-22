const RentalRequest = require('../models/RentalRequest');
const { cloudinary, deleteImage, extractPublicId } = require('../config/cloudinary');

// @desc    Get all public approved rental requests (for regular users)
// @route   GET /api/rental-requests
// @access  Public
const getPublicRentalRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query - only show approved rental requests
    const query = {
      status: 'approved'
    };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const requests = await RentalRequest.find(query)
      .populate('user', 'name email')
      .populate('product', 'name')
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviewedBy -reviewedAt -rejectionReason'); // Exclude admin-specific fields

    const total = await RentalRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRequests: total,
          hasNext: skip + requests.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching public rental requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rental requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single public rental request (for regular users)
// @route   GET /api/rental-requests/:id
// @access  Public
const getPublicRentalRequest = async (req, res) => {
  try {
    const request = await RentalRequest.findOne({
      _id: req.params.id,
      status: 'approved'
    })
      .populate('user', 'name email')
      .populate('product', 'name')
      .populate('category', 'name')
      .select('-reviewedBy -reviewedAt -rejectionReason'); // Exclude admin-specific fields

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found or not available'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        request
      }
    });

  } catch (error) {
    console.error('Error fetching public rental request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rental request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get featured rental requests (for homepage)
// @route   GET /api/rental-requests/featured
// @access  Public
const getFeaturedRentalRequests = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    // Get recent approved rental requests
    const requests = await RentalRequest.find({
      status: 'approved'
    })
      .populate('user', 'name email')
      .populate('product', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-reviewedBy -reviewedAt -rejectionReason'); // Exclude admin-specific fields

    res.status(200).json({
      success: true,
      data: {
        requests
      }
    });

  } catch (error) {
    console.error('Error fetching featured rental requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured rental requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Create rental request (for regular users)
// @route   POST /api/rental-requests
// @access  Private (User)
const createRentalRequest = async (req, res) => {
  try {
    console.log('=== Create Rental Request ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('User info:', req.user);

        const {
          title,
          description,
          priceAmount,
          pricePeriod,
          product,
          category,
          location,
          address,
          city,
          state,
          pincode,
          features,
          tags,
          startDate,
          endDate,
          phone,
          email,
          alternatePhone
        } = req.body;

    // Validate required fields
    if (!title || !description || !priceAmount || !category || !location || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Process uploaded files (images and videos)
    const images = [];
    let videoUrl = null;
    let videoPublicId = null;
    
    if (req.files) {
      console.log('Processing uploaded files:', req.files);
      
      // Handle images
      if (req.files.images && req.files.images.length > 0) {
        console.log('Processing', req.files.images.length, 'images');
        
        for (const file of req.files.images) {
          console.log('Processing image:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
          });
          
          if (file.mimetype.startsWith('image/')) {
            // Upload image to Cloudinary
            try {
              const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                  {
                    folder: 'rentyatra/rental-requests/images',
                    resource_type: 'image',
                    transformation: [
                      { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
                    ],
                    public_id: `rental_img_${req.user.userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                ).end(file.buffer);
              });
            
              images.push({
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                isPrimary: images.length === 0, // First image is primary
                uploadedAt: new Date()
              });
              
              console.log('Image uploaded successfully:', uploadResult.secure_url);
            } catch (error) {
              console.error('Error uploading image to Cloudinary:', error);
              throw new Error('Failed to upload image');
            }
          }
        }
      }
      
      // Handle video
      if (req.files.video && req.files.video.length > 0) {
        console.log('Processing', req.files.video.length, 'videos');
        
        for (const file of req.files.video) {
          console.log('Processing video:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
          });
          
          if (file.mimetype.startsWith('video/')) {
            // Upload video to Cloudinary
            try {
              const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                  {
                    folder: 'rentyatra/rental-requests/videos',
                    resource_type: 'video',
                    transformation: [
                      { width: 1280, height: 720, crop: 'limit', quality: 'auto' }
                    ],
                    public_id: `rental_video_${req.user.userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                ).end(file.buffer);
              });
              
              videoUrl = uploadResult.secure_url;
              videoPublicId = uploadResult.public_id;
              
              console.log('Video uploaded successfully:', uploadResult.secure_url);
            } catch (error) {
              console.error('Error uploading video to Cloudinary:', error);
              throw new Error('Failed to upload video');
            }
          }
        }
      }
    }

    // Parse features and tags if they are strings
    let featuresArray = [];
    let tagsArray = [];
    
    if (features) {
      try {
        featuresArray = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        featuresArray = features.split(',').map(f => f.trim());
      }
    }
    
    if (tags) {
      try {
        tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        tagsArray = tags.split(',').map(t => t.trim());
      }
    }

    // Parse coordinates if provided
    let coordinates = null;
    if (req.body.coordinates) {
      try {
        coordinates = typeof req.body.coordinates === 'string' 
          ? JSON.parse(req.body.coordinates) 
          : req.body.coordinates;
      } catch (e) {
        console.log('Invalid coordinates format, ignoring:', req.body.coordinates);
      }
    }

    // Create rental request data
    const rentalRequestData = {
      title: title.trim(),
      description: description.trim(),
      location: {
        address: address || location,
        city: city || 'Unknown',
        state: state || 'Unknown',
        pincode: pincode || '000000',
        coordinates: coordinates ? {
          latitude: coordinates.lat || coordinates.latitude,
          longitude: coordinates.lng || coordinates.longitude
        } : undefined
      },
      price: {
        amount: parseFloat(priceAmount),
        currency: 'INR',
        period: pricePeriod || 'daily'
      },
      product: product,
      category: category,
      features: featuresArray || [],
      images: images || [],
      video: videoUrl ? {
        url: videoUrl,
        publicId: videoPublicId,
        uploadedAt: new Date()
      } : null,
      user: req.user.userId,
      contactInfo: {
        phone: phone,
        email: email,
        alternatePhone: alternatePhone || null
      },
      availability: {
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isAvailable: true
      },
      tags: tagsArray || [],
      status: 'pending' // New requests start as pending
    };

    console.log('Rental request data to save:', JSON.stringify(rentalRequestData, null, 2));

    // Create the rental request
    const rentalRequest = new RentalRequest(rentalRequestData);
    
    // Validate the document before saving
    const validationError = rentalRequest.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationError.errors
      });
    }
    
    await rentalRequest.save();
    console.log('Rental request saved successfully:', rentalRequest._id);

    // Populate fields for response
    try {
      await rentalRequest.populate([
        { path: 'user', select: 'name email' },
        { path: 'category', select: 'name' }
      ]);
      console.log('Rental request populated successfully');
    } catch (populateError) {
      console.error('Error populating rental request:', populateError);
      // Continue without population - the request was saved successfully
    }

    res.status(201).json({
      success: true,
      message: 'Rental request submitted successfully. It will be reviewed by our admin team.',
      data: {
        rentalRequest
      }
    });

  } catch (error) {
    console.error('=== Error creating rental request ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    console.error('Full error object:', error);
    
    // If there's an error and images were uploaded, clean them up
    if (req.files) {
      try {
        console.log('Cleaning up uploaded files...');
        
        // Clean up images
        if (req.files.images && Array.isArray(req.files.images) && req.files.images.length > 0) {
          for (const file of req.files.images) {
            if (file && file.publicId) {
              try {
                await cloudinary.uploader.destroy(file.publicId);
              } catch (deleteError) {
                console.error('Error deleting image:', deleteError);
              }
            }
          }
        }
        
        // Clean up video
        if (req.files.video && Array.isArray(req.files.video) && req.files.video.length > 0) {
          for (const file of req.files.video) {
            if (file && file.publicId) {
              try {
                await cloudinary.uploader.destroy(file.publicId, { resource_type: 'video' });
              } catch (deleteError) {
                console.error('Error deleting video:', deleteError);
              }
            }
          }
        }
        
        console.log('Files cleaned up successfully');
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded files:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error creating rental request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user's own rental requests
// @route   GET /api/rental-requests/my-requests
// @access  Private (User)
const getUserRentalRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = ''
    } = req.query;

    // Build query - only show user's own requests
    const query = {
      user: req.user.userId
    };
    
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const requests = await RentalRequest.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await RentalRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRequests: total,
          hasNext: skip + requests.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user rental requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user rental requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getPublicRentalRequests,
  getPublicRentalRequest,
  getFeaturedRentalRequests,
  createRentalRequest,
  getUserRentalRequests
};