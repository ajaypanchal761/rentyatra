const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  // Basic Request Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Location Information
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Pricing Information
  price: {
    amount: {
      type: Number,
      required: [true, 'Price amount is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR']
    },
    period: {
      type: String,
      required: [true, 'Price period is required'],
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly']
    }
  },
  
  // Product and Category
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  
  features: [{
    type: String,
    trim: true
  }],
  
  // Images
  images: {
    type: [{
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      isPrimary: {
        type: Boolean,
        default: false
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Ensure array exists even when no images are provided to avoid undefined access
    default: []
  },
  
  // Video
  video: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Contact Information
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    alternatePhone: {
      type: String,
      trim: true
    }
  },
  
  // Request Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  
  // Admin Information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  reviewedAt: {
    type: Date,
    default: null
  },
  
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  
  // Availability
  availability: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  
  // Additional Information
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  // View and Interaction Counts
  viewCount: {
    type: Number,
    default: 0
  },
  
  inquiryCount: {
    type: Number,
    default: 0
  },
  
  // Review Statistics
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
rentalRequestSchema.index({ title: 'text', description: 'text' });
rentalRequestSchema.index({ status: 1 });
rentalRequestSchema.index({ user: 1 });
rentalRequestSchema.index({ product: 1 });
rentalRequestSchema.index({ category: 1 });
rentalRequestSchema.index({ 'location.city': 1, 'location.state': 1 });
rentalRequestSchema.index({ createdAt: -1 });
rentalRequestSchema.index({ 'availability.startDate': 1, 'availability.endDate': 1 });

// Virtual for primary image
rentalRequestSchema.virtual('primaryImage').get(function() {
  const imageArray = Array.isArray(this.images) ? this.images : [];
  const primaryImg = imageArray.find(img => img && img.isPrimary);
  return primaryImg || imageArray[0] || null;
});

// Virtual for formatted price
rentalRequestSchema.virtual('formattedPrice').get(function() {
  const currencySymbol = this.price.currency === 'INR' ? '₹' : this.price.currency;
  return `${currencySymbol}${this.price.amount}/${this.price.period}`;
});

// Virtual for full address
rentalRequestSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Pre-save middleware to set primary image
rentalRequestSchema.pre('save', function(next) {
  if (this.images && Array.isArray(this.images) && this.images.length > 0) {
    // If no primary image is set, make the first one primary
    const hasPrimary = this.images.some(img => img && img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Method to update status
rentalRequestSchema.methods.updateStatus = function(newStatus, adminId, rejectionReason = null) {
  this.status = newStatus;
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  
  if (newStatus === 'rejected' && rejectionReason) {
    this.rejectionReason = rejectionReason;
  }
  
  return this.save();
};

// Method to increment view count
rentalRequestSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment inquiry count
rentalRequestSchema.methods.incrementInquiryCount = function() {
  this.inquiryCount += 1;
  return this.save();
};

// Static method to search rental requests
rentalRequestSchema.statics.searchRequests = function(query, filters = {}) {
  const searchQuery = {
    status: 'pending',
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery)
    .populate('user', 'name email phone')
    .populate('category', 'name')
    .populate('reviewedBy', 'name email')
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 });
};

// Static method to get rental request statistics
rentalRequestSchema.statics.getRequestStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        pendingRequests: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        approvedRequests: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        rejectedRequests: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        totalViews: { $sum: '$viewCount' },
        totalInquiries: { $sum: '$inquiryCount' }
      }
    }
  ]);
};

// Static method to get requests by category
rentalRequestSchema.statics.getRequestsByCategory = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $project: {
        categoryName: '$category.name',
        count: 1,
        pending: 1,
        approved: 1
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Export the model
const RentalRequest = mongoose.model('RentalRequest', rentalRequestSchema);
module.exports = RentalRequest;
