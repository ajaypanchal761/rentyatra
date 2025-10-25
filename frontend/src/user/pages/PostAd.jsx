import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, ArrowLeft, ArrowRight, Check, ChevronRight, Search, Loader2, Navigation } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../contexts/CategoryContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import apiService from '../../services/api';

const PostAd = () => {
  const { addItem } = useApp();
  const { categories, imageMap, loading: categoriesLoading } = useCategories();
  const { isAuthenticated, user } = useAuth();
  const { refreshUserSubscription } = useSubscription();
  const navigate = useNavigate();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1); // 1: Product, 2: Category, 3: Details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Product management state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  
  // Category management state
  const [productCategories, setProductCategories] = useState([]);
  
  // Location state
  const [locationLoading, setLocationLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    location: '',
    condition: 'good',
    phone: '',
    email: '',
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');


  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPublicProducts(1, 50, productSearch);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (productSearch !== '') {
        fetchProducts();
      } else {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [productSearch]);

  // Fetch categories by product
  const fetchCategoriesByProduct = async (productId) => {
    try {
      const response = await apiService.getCategoriesByProduct(productId);
      if (response.success) {
        const fetchedCategories = response.data.categories || [];
        
        // Transform backend categories to frontend format
        const transformedCategories = fetchedCategories.map(category => ({
          id: category._id,
          name: category.name,
          slug: category.name.toLowerCase().replace(/\s+/g, '-'),
          image: category.images?.[0]?.url || null,
          product: category.product,
          subcategories: [] // Categories from backend don't have subcategories in this structure
        }));
        
        setProductCategories(transformedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories by product:', error);
      setError('Failed to load categories');
      setProductCategories([]);
    }
  };

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

  // Show loading state while categories are being fetched
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-20 md:pb-0">
        <Card className="p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load the categories</p>
        </Card>
      </div>
    );
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    // Don't pre-fill title, let user enter manually
    // Fetch categories for the selected product
    fetchCategoriesByProduct(product._id);
    setCurrentStep(2);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category: category.slug });
    setCurrentStep(3);
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // If location field is changed, try to get coordinates
    if (e.target.name === 'location' && e.target.value.trim()) {
      getCoordinatesFromLocation(e.target.value);
    }
  };

  // Get coordinates from location string
  const getCoordinatesFromLocation = async (locationString) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/forward-geocode-client?query=${encodeURIComponent(locationString)}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setCoordinates({ lat: result.latitude, lng: result.longitude });
          setShowMap(true);
        }
      }
    } catch (error) {
      console.error('Error getting coordinates from location:', error);
      // Set default coordinates for Indore if API fails
      setCoordinates({ lat: 22.7196, lng: 75.8577 });
      setShowMap(true);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed the minimum requirement
    if (images.length + files.length < 4) {
      setError('Please upload at least 4 images');
    } else {
      setError('');
    }
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => {
          const newImages = [...prev, reader.result];
          // Clear error if we now have enough images
          if (newImages.length >= 4) {
            setError('');
          }
          return newImages;
        });
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
      
      // Clear any previous errors
      setError('');
      
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

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationString = `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || data.countryName || 'Unknown'}`;
            setFormData({ ...formData, location: locationString });
            setCoordinates({ lat: latitude, lng: longitude });
            setShowMap(true);
          } else {
            // Fallback to coordinates if reverse geocoding fails
            setFormData({ ...formData, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
            setCoordinates({ lat: latitude, lng: longitude });
            setShowMap(true);
          }
        } catch (error) {
          console.error('Error getting location:', error);
          setError('Failed to get location details');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred while getting location');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Images count:', images.length);
    console.log('Video:', video);
    console.log('Selected product:', selectedProduct);
    console.log('Selected category:', selectedCategory);
    console.log('Selected category ID:', selectedCategory?.id);
    console.log('Selected category _id:', selectedCategory?._id);

    if (!formData.title || !formData.description || !formData.location || !formData.phone || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.pricePerDay) {
      setError('Please specify rental price per day');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate field lengths
    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters long');
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

    if (!selectedProduct || !selectedCategory) {
      setError('Please select a product and category');
      return;
    }

    console.log('All validations passed, proceeding with submission');

    try {
      setLoading(true);
      setError('');

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields (matching backend API expectations)
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priceAmount', parseFloat(formData.pricePerDay));
      formDataToSend.append('pricePeriod', 'daily');
      formDataToSend.append('product', selectedProduct._id);
      formDataToSend.append('category', selectedCategory.id);
      
      // Location data - send as nested structure as expected by backend
      formDataToSend.append('location', formData.location);
      formDataToSend.append('address', formData.location);
      
      // Extract city and state from location string
      const locationParts = formData.location.split(',');
      const city = locationParts[0]?.trim() || 'Not specified';
      const state = locationParts[1]?.trim() || 'Not specified';
      
      formDataToSend.append('city', city);
      formDataToSend.append('state', state);
      formDataToSend.append('pincode', '000000'); // You can add pincode input field later
      
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('features', JSON.stringify(['Good condition', 'Well maintained'])); // Default features
      formDataToSend.append('tags', JSON.stringify([selectedProduct.name, selectedCategory.name])); // Default tags
      
      if (coordinates) {
        formDataToSend.append('coordinates', JSON.stringify(coordinates));
      }

      // Debug: Log all form data being sent
      console.log('FormData being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      // Add images (convert base64 to files)
      for (let i = 0; i < images.length; i++) {
        try {
          const response = await fetch(images[i]);
          const blob = await response.blob();
          const file = new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' });
          formDataToSend.append('images', file);
        } catch (error) {
          console.error('Error processing image:', error);
          throw new Error('Failed to process images');
        }
      }

      // Add video
      try {
        console.log('Processing video:', {
          name: video.name,
          type: video.file.type,
          size: video.file.size,
          preview: video.preview
        });
        
        const videoResponse = await fetch(video.preview);
        const videoBlob = await videoResponse.blob();
        const videoFile = new File([videoBlob], video.name, { type: video.file.type });
        
        console.log('Video file created:', {
          name: videoFile.name,
          type: videoFile.type,
          size: videoFile.size
        });
        
        formDataToSend.append('video', videoFile);
      } catch (error) {
        console.error('Error processing video:', error);
        throw new Error('Failed to process video');
      }

      // Submit to backend
      const response = await apiService.createRentalListing(formDataToSend);

      if (response.success) {
        // Refresh subscription data to update counters
        if (user?.id || user?._id) {
          const userId = user.id || user._id;
          await refreshUserSubscription(userId);
        }
        
        // Show success message
        setError(''); // Clear any previous errors
        // Show success notification
        const successMessage = 'Rental listing submitted successfully! It will be reviewed by our admin team before going live.';
        alert(successMessage); // You can replace this with a proper toast notification
        navigate('/dashboard', { state: { activeTab: 'my-ads' } });
      } else {
        // Handle validation errors
        if (response.errors) {
          console.error('Validation errors:', response.errors);
          const errorMessages = Object.values(response.errors).map(error => 
            typeof error === 'object' ? error.message : error
          ).join(', ');
          setError(`Validation failed: ${errorMessages}`);
        } else {
          setError(response.message || 'Failed to submit rental listing');
        }
      }
    } catch (error) {
      console.error('Error submitting rental listing:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data
      });
      
      // Try to get more specific error information
      if (error.response?.data?.errors) {
        console.error('Validation errors from server:', error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).map(error => 
          typeof error === 'object' ? error.message : error
        ).join(', ');
        setError(`Validation failed: ${errorMessages}`);
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to submit rental listing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-3 md:py-6 px-3 md:px-4 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-center gap-1 md:gap-4">
            {[
              { step: 1, label: 'Product' },
              { step: 2, label: 'Category' },
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

        {/* Step 1: Product Selection */}
        {currentStep === 1 && (
          <Card className="p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-3xl font-black text-gray-900 mb-1 md:mb-2">Select Product</h2>
              <p className="text-xs md:text-base text-gray-600">Choose the Product that best fits your item</p>
            </div>

            {/* Search Bar */}
            <div className="mb-4 md:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {products.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className="group bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="w-full h-16 md:h-20 mb-2 md:mb-3 bg-gray-100 rounded-lg md:rounded-xl flex items-center justify-center p-2 group-hover:bg-blue-50 transition-all">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs md:text-sm">No Image</div>
                      )}
                    </div>
                    <h3 className="font-bold text-xs md:text-sm text-gray-900 group-hover:text-blue-600 transition-colors text-center">
                      {product.name}
                    </h3>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No products found</p>
                <Button onClick={() => setProductSearch('')}>Clear Search</Button>
              </div>
            )}
          </Card>
        )}

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <Card className="p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-semibold mb-3 md:mb-4 group"
              >
                <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs md:text-sm">Back to Products</span>
              </button>
              <h2 className="text-lg md:text-3xl font-black text-gray-900 mb-1 md:mb-2">
                Select Category
              </h2>
              <p className="text-xs md:text-base text-gray-600">
                Choose category for <span className="font-bold text-blue-600">{selectedProduct?.name}</span>
              </p>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <span className="ml-2 text-gray-600">Loading categories...</span>
              </div>
            ) : productCategories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {productCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="group bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-3 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center p-2 md:p-3 group-hover:bg-blue-50 transition-all">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs md:text-sm">No Image</div>
                      )}
                    </div>
                    <h3 className="font-bold text-xs md:text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No categories found for this product</p>
                <Button onClick={() => setCurrentStep(1)}>Back to Products</Button>
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
                <span className="text-xs md:text-sm">Back to Categories</span>
              </button>
              <h2 className="text-lg md:text-3xl font-black text-gray-900 mb-1 md:mb-2">Product Details</h2>
              <p className="text-xs md:text-base text-gray-600">
                {selectedProduct?.name} → <span className="font-bold text-blue-600">{selectedCategory?.name}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 text-xs md:text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={(e) => {
              console.log('Form onSubmit triggered!');
              handleSubmit(e);
            }} className="space-y-4 md:space-y-6">
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
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                  Rental Price Per Day *
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  placeholder="₹500"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  required
                />
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
                    className="w-full pl-10 md:pl-12 pr-12 md:pr-14 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Get current location"
                  >
                    {locationLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Navigation size={16} />
                    )}
                  </button>
                </div>
                
                {/* Location Map */}
                {formData.location && showMap && coordinates && (
                  <div className="mt-3">
                    <div 
                      className="w-full h-32 md:h-40 rounded-lg md:rounded-xl overflow-hidden border-2 border-gray-200 relative group bg-white cursor-pointer"
                      onClick={() => {
                        const searchQuery = `${coordinates.lat},${coordinates.lng}`;
                        const googleMapsUrl = `https://www.google.com/maps?q=${searchQuery}`;
                        window.open(googleMapsUrl, '_blank');
                      }}
                      title="Click to open in Google Maps"
                    >
                      {/* Map Visual Representation */}
                      <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-100 to-green-200 relative overflow-hidden">
                        {/* Map-like grid pattern */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="grid grid-cols-8 grid-rows-4 h-full">
                            {Array.from({ length: 32 }).map((_, i) => (
                              <div key={i} className="border border-gray-400"></div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Roads representation */}
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-500 opacity-70"></div>
                        <div className="absolute top-0 left-1/2 w-2 h-full bg-gray-500 opacity-70"></div>
                        
                        {/* Location marker */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          {/* Pulse animation */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full opacity-30 animate-ping"></div>
                        </div>
                        
                        {/* Location text overlay */}
                        <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded px-2 py-1">
                          <p className="text-xs font-semibold text-gray-800 text-center">
                            📍 {formData.location}
                          </p>
                        </div>
                        
                        {/* Overlay for click indication */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Coordinates and link */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span>📍</span>
                        <span>
                          {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const searchQuery = `${coordinates.lat},${coordinates.lng}`;
                          const googleMapsUrl = `https://www.google.com/maps?q=${searchQuery}`;
                          window.open(googleMapsUrl, '_blank');
                        }}
                        className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
                      >
                        Open in Google Maps →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
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
                  disabled={loading}
                  onClick={(e) => {
                    console.log('Submit button clicked!');
                    console.log('Loading state:', loading);
                    console.log('Form data:', formData);
                    console.log('Images:', images.length);
                    console.log('Video:', video);
                    console.log('Selected product:', selectedProduct);
                    console.log('Selected category:', selectedCategory);
                    // Let the form handle the submission
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 md:py-4 text-base md:text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Post Rental
                      <ChevronRight className="ml-2" size={18} />
                    </>
                  )}
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
