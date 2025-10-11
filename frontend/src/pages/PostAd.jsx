import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const PostAd = () => {
  const { categories, addItem } = useApp();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    category: '',
    location: '',
    condition: 'good',
    availableFrom: '',
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-20 md:pb-0">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to list your item for rent</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file size should be less than 50MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideo({
          file: file,
          preview: reader.result,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) // Size in MB
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.pricePerDay && !formData.pricePerWeek && !formData.pricePerMonth) {
      setError('Please provide at least one rental price (per day, week, or month)');
      return;
    }

    if (images.length < 4) {
      setError('Please upload at least 4 images');
      return;
    }

    const newItem = {
      ...formData,
      price: Number(formData.pricePerDay || formData.pricePerWeek || formData.pricePerMonth),
      rentalPricing: {
        daily: formData.pricePerDay ? Number(formData.pricePerDay) : null,
        weekly: formData.pricePerWeek ? Number(formData.pricePerWeek) : null,
        monthly: formData.pricePerMonth ? Number(formData.pricePerMonth) : null,
      },
      images,
      video: video ? video.preview : null,
      owner: {
        name: user.name,
        rating: 4.5,
      },
    };

    addItem(newItem);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">List Your Item for Rent</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Images Upload */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Upload Photos *</h2>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                images.length >= 4 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {images.length}/10 images
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                      Cover
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {images.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition">
                  <Upload className="text-blue-500 mb-2" size={32} />
                  <span className="text-xs font-semibold text-blue-600">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                📸 <strong>Minimum 4 photos required</strong> • Maximum 10 photos • First photo will be the cover image
              </p>
            </div>
          </Card>

          {/* Video Upload */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Upload Video (Optional)</h2>
              {video && (
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {video.size} MB
                </span>
              )}
            </div>

            {!video ? (
              <label className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-100 transition">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-purple-700 mb-1">Upload Product Video</span>
                <span className="text-xs text-purple-600">MP4, MOV, AVI (Max 50MB)</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative bg-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-purple-200 rounded-lg overflow-hidden">
                      <video
                        src={video.preview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{video.name}</h4>
                    <p className="text-sm text-gray-600">Size: {video.size} MB</p>
                    <p className="text-xs text-gray-500 mt-2">Video preview will be shown to potential renters</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="flex-shrink-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                🎥 <strong>Pro Tip:</strong> Videos get 3x more inquiries! Show your item in action, highlight features, and build trust.
              </p>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Item Details</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Canon EOS R6 Camera"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item, its condition, and any rental terms..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="new">Brand New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Available From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Rental Pricing */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Rental Pricing</h2>
            <p className="text-sm text-gray-600 mb-4">
              Set your rental rates. You can offer daily, weekly, or monthly rentals (or all three).
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Per Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Day (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Per Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Week (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerWeek"
                    value={formData.pricePerWeek}
                    onChange={handleChange}
                    placeholder="3000"
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Per Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Month (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleChange}
                    placeholder="10000"
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Offering weekly/monthly rates with discounts can attract longer rentals!
                </p>
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="flex-1">
              List Item for Rent
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostAd;
