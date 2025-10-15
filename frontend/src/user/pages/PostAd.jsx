import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../contexts/CategoryContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const PostAd = () => {
  const { addItem } = useApp();
  const { categories, imageMap } = useCategories();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1); // 1: Category, 2: Subcategory, 3: Details
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    location: '',
    condition: 'good',
    availableFrom: '',
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');

  // Get subcategories dynamically from selected category
  const subcategories = selectedCategory?.subcategories || [];

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep(2);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({ ...formData, category: selectedCategory.slug, subcategory: subcategory.name });
    setCurrentStep(3);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 4 images minimum requirement
    if (images.length + files.length < 4) {
      setError('Please upload at least 4 images');
    } else {
      setError('');
    }
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (newImages.length < 4) {
      setError('Please upload at least 4 images');
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
          size: (file.size / (1024 * 1024)).toFixed(2)
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

    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.pricePerDay && !formData.pricePerWeek && !formData.pricePerMonth) {
      setError('Please specify at least one rental price');
      return;
    }

    if (images.length < 4) {
      setError('Please upload at least 4 images');
      return;
    }

    if (!video) {
      setError('Please upload a video');
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData,
      price: Number(formData.pricePerMonth || formData.pricePerWeek || formData.pricePerDay),
      pricePerDay: Number(formData.pricePerDay),
      pricePerWeek: Number(formData.pricePerWeek),
      pricePerMonth: Number(formData.pricePerMonth),
      images: images,
      video: video.preview,
      subcategory: selectedSubcategory?.name || '',
      owner: {
        name: user.name,
        avatar: user.avatar,
      },
      postedDate: new Date().toISOString(),
      rating: 0,
      reviews: [],
    };

    addItem(newItem);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-3 md:py-6 px-3 md:px-4 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-center gap-1 md:gap-4">
            {[
              { step: 1, label: 'Category' },
              { step: 2, label: 'Subcategory' },
              { step: 3, label: 'Details' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all ${
                    currentStep > item.step
                      ? 'bg-green-500 text-white'
                      : currentStep === item.step
                      ? 'bg-blue-600 text-white shadow-lg md:scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > item.step ? <Check size={14} className="md:w-5 md:h-5" /> : item.step}
                  </div>
                  <span className={`text-[10px] md:text-sm font-semibold mt-1 md:mt-2 ${
                    currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-8 md:w-20 h-0.5 md:h-1 mx-1 md:mx-2 rounded-full transition-all ${
                    currentStep > item.step ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <Card className="p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-3xl font-black text-gray-900 mb-1 md:mb-2">Select Category</h2>
              <p className="text-xs md:text-base text-gray-600">Choose the category that best fits your item</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="group bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-3 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center p-2 md:p-3 group-hover:bg-blue-50 transition-all">
                    <img
                      src={imageMap[category.image]}
                      alt={category.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="font-bold text-xs md:text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 2: Subcategory Selection */}
        {currentStep === 2 && (
          <Card className="p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-semibold mb-3 md:mb-4 group"
              >
                <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs md:text-sm">Back to Categories</span>
              </button>
              <h2 className="text-lg md:text-3xl font-black text-gray-900 mb-1 md:mb-2">
                Select Subcategory
              </h2>
              <p className="text-xs md:text-base text-gray-600">
                Refine your listing in <span className="font-bold text-blue-600">{selectedCategory?.name}</span>
              </p>
            </div>

            {subcategories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {subcategories.map((subcat, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubcategorySelect(subcat)}
                    className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all group"
                  >
                    <div className="text-2xl md:text-5xl mb-1.5 md:mb-3">{subcat.icon}</div>
                    <h3 className="font-bold text-xs md:text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                      {subcat.name}
                    </h3>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8">
                <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-4">No subcategories available for this category</p>
                <Button onClick={() => { setSelectedSubcategory({ name: 'General' }); setCurrentStep(3); }}>
                  Continue Without Subcategory
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Product Details Form */}
        {currentStep === 3 && (
          <Card className="p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-semibold mb-3 md:mb-4 group"
              >
                <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs md:text-sm">Back to Subcategories</span>
              </button>
              <h2 className="text-lg md:text-3xl font-black text-gray-900 mb-1 md:mb-2">Product Details</h2>
              <p className="text-xs md:text-base text-gray-600">
                {selectedCategory?.name} → <span className="font-bold text-blue-600">{selectedSubcategory?.name}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 text-xs md:text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Canon EOS R6 Camera"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your item in detail..."
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all resize-none"
                  required
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 md:mb-3">
                  Rental Pricing * <span className="text-[10px] md:text-xs font-normal text-gray-500">(At least one required)</span>
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div>
                    <label className="block text-[10px] md:text-xs text-gray-600 mb-1">Per Day</label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      placeholder="₹500"
                      className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs text-gray-600 mb-1">Per Week</label>
                    <input
                      type="number"
                      name="pricePerWeek"
                      value={formData.pricePerWeek}
                      onChange={handleChange}
                      placeholder="₹3000"
                      className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs text-gray-600 mb-1">Per Month</label>
                    <input
                      type="number"
                      name="pricePerMonth"
                      value={formData.pricePerMonth}
                      onChange={handleChange}
                      placeholder="₹10000"
                      className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai, Maharashtra"
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              {/* Available From */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Images * <span className="text-[10px] md:text-xs font-normal text-gray-500">(Minimum 4 required)</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 md:h-32 object-cover rounded-lg md:rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 md:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} className="md:w-[14px] md:h-[14px]" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl h-20 md:h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <Upload className="text-gray-400 mb-1 md:mb-2" size={18} />
                      <span className="text-[10px] md:text-xs text-gray-600 font-medium">Add Image</span>
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
                <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2">
                  {images.length}/4 images uploaded (min 4 required)
                </p>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Video * <span className="text-[10px] md:text-xs font-normal text-gray-500">(Required, max 50MB)</span>
                </label>
                {!video ? (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl p-4 md:p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <Upload className="text-gray-400 mb-2 md:mb-3" size={24} />
                    <span className="text-xs md:text-sm text-gray-700 font-semibold mb-1">Upload Video</span>
                    <span className="text-[10px] md:text-xs text-gray-500">Max 50MB</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative group">
                    <video
                      src={video.preview}
                      className="w-full h-32 md:h-48 object-cover rounded-lg md:rounded-xl"
                      controls
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 md:top-3 right-2 md:right-3 bg-red-500 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
                    >
                      <X size={14} />
                      Remove
                    </button>
                    <div className="mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-600">
                      {video.name} ({video.size} MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 md:pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 md:py-4 text-base md:text-lg font-bold shadow-lg"
                >
                  Post Rental
                  <ChevronRight className="ml-2" size={18} />
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PostAd;
