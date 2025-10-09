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

    if (images.length === 0) {
      setError('Please upload at least one image');
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
      seller: {
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
            <h2 className="text-lg md:text-xl font-semibold mb-4">Upload Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {images.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload className="text-gray-400 mb-2" size={28} />
                  <span className="text-xs text-gray-600">Upload</span>
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
            <p className="text-sm text-gray-500">
              Upload up to 10 photos. First photo will be the cover image.
            </p>
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
                    Price Per Day ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Per Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Week ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerWeek"
                    value={formData.pricePerWeek}
                    onChange={handleChange}
                    placeholder="150"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Per Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Month ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    step="0.01"
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
