const RentalRequest = require('../models/RentalRequest');
const { cloudinary, deleteImage, extractPublicId } = require('../config/cloudinary');

// @desc    Get all rental requests (Admin)
// @route   GET /api/admin/rental-requests
// @access  Private (Admin)
const getAllRentalRequests = async (req, res) => {
  try {
    console.log('=== Get All Rental Requests (Admin) ===');
    console.log('Request query:', req.query);
    console.log('Request user:', req.user);
    
    const {
      page = 1,
      limit = 10,
      status,
      search,
      category,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('Final query:', query);
    console.log('Sort:', sort);
    console.log('Skip:', skip, 'Limit:', parseInt(limit));

    // Execute query
    const requests = await RentalRequest.find(query)
      .populate('user', 'name email phone')
      .populate('product', 'name')
      .populate('category', 'name')
      .populate('reviewedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await RentalRequest.countDocuments(query);
    
    console.log('Found requests:', requests.length);
    console.log('Total count:', total);

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
    console.error('=== Error fetching rental requests ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Error fetching rental requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single rental request (Admin)
// @route   GET /api/admin/rental-requests/:id
// @access  Private (Admin)
const getRentalRequest = async (req, res) => {
  try {
    const request = await RentalRequest.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('category', 'name')
      .populate('reviewedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        request
      }
    });

  } catch (error) {
    console.error('Error fetching rental request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rental request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update rental request status (Admin)
// @route   PUT /api/admin/rental-requests/:id/status
// @access  Private (Admin)
const updateRentalRequestStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const request = await RentalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    // Update status using the model method
    await request.updateStatus(status, req.admin._id, rejectionReason);

    // Log when a request becomes visible to users
    if (status === 'approved') {
      console.log(`✅ Rental request "${request.title}" (ID: ${request._id}) has been approved and is now visible to all users in featured listings!`);
    } else if (status === 'rejected') {
      console.log(`❌ Rental request "${request.title}" (ID: ${request._id}) has been rejected and will not be visible to users.`);
    }

    // Populate fields for response
    await request.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'product', select: 'name' },
      { path: 'category', select: 'name' },
      { path: 'reviewedBy', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: `Rental request ${status} successfully`,
      data: {
        request
      }
    });

  } catch (error) {
    console.error('Error updating rental request status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating rental request status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete rental request (Admin)
// @route   DELETE /api/admin/rental-requests/:id
// @access  Private (Admin)
const deleteRentalRequest = async (req, res) => {
  try {
    const request = await RentalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    // Delete images from Cloudinary
    if (request.images && request.images.length > 0) {
      try {
        for (const image of request.images) {
          await deleteImage(image.publicId);
        }
      } catch (imageError) {
        console.error('Error deleting images from Cloudinary:', imageError);
        // Continue with request deletion even if image deletion fails
      }
    }

    // Delete the request
    await RentalRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Rental request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting rental request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting rental request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get rental request statistics (Admin)
// @route   GET /api/admin/rental-requests/stats
// @access  Private (Admin)
const getRentalRequestStats = async (req, res) => {
  try {
    const stats = await RentalRequest.getRequestStats();
    const categoryStats = await RentalRequest.getRequestsByCategory();

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalRequests: 0,
          pendingRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          totalViews: 0,
          totalInquiries: 0
        },
        categoryStats
      }
    });

  } catch (error) {
    console.error('Error fetching rental request stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rental request statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Bulk update rental request status (Admin)
// @route   PUT /api/admin/rental-requests/bulk-status
// @access  Private (Admin)
const bulkUpdateRentalRequestStatus = async (req, res) => {
  try {
    const { requestIds, status, rejectionReason } = req.body;

    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request IDs array is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Update multiple requests
    const updateData = {
      status,
      reviewedBy: req.admin._id,
      reviewedAt: new Date()
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const result = await RentalRequest.updateMany(
      { _id: { $in: requestIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} rental requests updated successfully`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Error bulk updating rental request status:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk updating rental request status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get rental requests by user (Admin)
// @route   GET /api/admin/rental-requests/user/:userId
// @access  Private (Admin)
const getRentalRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      status
    } = req.query;

    // Build query
    const query = { user: userId };
    
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const requests = await RentalRequest.find(query)
      .populate('category', 'name')
      .populate('reviewedBy', 'name email')
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
    console.error('Error fetching rental requests by user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rental requests by user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getAllRentalRequests,
  getRentalRequest,
  updateRentalRequestStatus,
  deleteRentalRequest,
  getRentalRequestStats,
  bulkUpdateRentalRequestStatus,
  getRentalRequestsByUser
};
