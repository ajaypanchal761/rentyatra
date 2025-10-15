const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage configuration for Aadhar card images
const aadharStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentyatra/aadhar-cards',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto' }
    ],
    public_id: (req, file) => {
      // Generate unique filename with user ID and timestamp
      const userId = req.user?.userId || 'temp';
      const timestamp = Date.now();
      return `aadhar_${userId}_${timestamp}`;
    }
  }
});

// Create storage configuration for PAN card images
const panStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentyatra/pan-cards',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto' }
    ],
    public_id: (req, file) => {
      // Generate unique filename with user ID and timestamp
      const userId = req.user?.userId || 'temp';
      const timestamp = Date.now();
      return `pan_${userId}_${timestamp}`;
    }
  }
});

// Create storage configuration for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentyatra/profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }
    ],
    public_id: (req, file) => {
      // Generate unique filename with user ID and timestamp
      const userId = req.user?.userId || 'temp';
      const timestamp = Date.now();
      return `profile_${userId}_${timestamp}`;
    }
  }
});

// Create storage configuration for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentyatra/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // No transformation - upload full size images
    public_id: (req, file) => {
      // Generate unique filename with product name and timestamp
      const productName = req.body.name ? req.body.name.replace(/[^a-zA-Z0-9]/g, '_') : 'product';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      return `product_${productName}_${timestamp}_${randomId}`;
    }
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instances
const uploadAadhar = multer({
  storage: aadharStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Maximum 2 files (front and back of Aadhar)
  }
});

const uploadPAN = multer({
  storage: panStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Maximum 2 files (front and back of PAN)
  }
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 1 // Only 1 profile image
  }
});

const uploadProduct = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 product images
  }
});

// Create storage configuration for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentyatra/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // No transformation - upload full size images
    public_id: (req, file) => {
      // Generate unique filename with category name and timestamp
      const categoryName = req.body.name ? req.body.name.replace(/[^a-zA-Z0-9]/g, '_') : 'category';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      return `category_${categoryName}_${timestamp}_${randomId}`;
    }
  }
});

const uploadCategory = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 category images
  }
});

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadAadhar,
  uploadPAN,
  uploadProfile,
  uploadProduct,
  uploadCategory,
  deleteImage,
  extractPublicId
};
