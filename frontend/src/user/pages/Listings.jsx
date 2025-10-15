import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Heart, SlidersHorizontal, ArrowUpDown, X, Tag, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import LocationSearch from '../../components/home/LocationSearch';
import { format } from 'date-fns';

// Import category images
import carImg from '../../assets/car.png';
import mobileImg from '../../assets/mobile.png';
import bikeImg from '../../assets/bike.png';
import furnitureImg from '../../assets/furniture.png';
import fashionImg from '../../assets/fashion.png';
import bookImg from '../../assets/book.png';
import sportImg from '../../assets/sport.png';
import realstateImg from '../../assets/realstate.png';
import petImg from '../../assets/pet.png';

const imageMap = {
  'car.png': carImg,
  'mobile.png': mobileImg,
  'bike.png': bikeImg,
  'furniture.png': furnitureImg,
  'fashion.png': fashionImg,
  'book.png': bookImg,
  'sport.png': sportImg,
  'realstate.png': realstateImg,
  'pet.png': petImg,
};

const Listings = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    location,
    setLocation,
    getFilteredItems,
    toggleFavorite,
    isFavorite,
    getAverageRating,
    getReviewsCount,
  } = useApp();

  const locationState = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [budgetFilter, setBudgetFilter] = useState(null);
  const navigate = useNavigate();

  // Get subcategory and budget from navigation state
  useEffect(() => {
    if (locationState.state?.subcategory) {
      setSelectedSubcategory(locationState.state.subcategory);
    }
    if (locationState.state?.budget) {
      setBudgetFilter(locationState.state.budget);
    }
  }, [locationState.state]);

  // Subcategories based on selected category with icons
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    
    const subcategoryMap = {
      cars: [
        { name: 'Sedan', icon: '🚗' },
        { name: 'SUV', icon: '🚙' },
        { name: 'Hatchback', icon: '🚕' },
        { name: 'Sports Car', icon: '🏎️' },
        { name: 'Luxury', icon: '🚐' },
        { name: 'Electric', icon: '⚡' },
      ],
      bikes: [
        { name: 'Sports Bike', icon: '🏍️' },
        { name: 'Cruiser', icon: '🛵' },
        { name: 'Scooter', icon: '🛴' },
        { name: 'Commuter', icon: '🚲' },
        { name: 'Electric', icon: '⚡' },
        { name: 'Vintage', icon: '🎪' },
      ],
      mobiles: [
        { name: 'Smartphones', icon: '📱' },
        { name: 'Feature Phones', icon: '📞' },
        { name: 'Tablets', icon: '📱' },
        { name: 'Accessories', icon: '🔌' },
        { name: 'Smartwatches', icon: '⌚' },
        { name: 'Gaming', icon: '🎮' },
      ],
      properties: [
        { name: 'Apartments', icon: '🏢' },
        { name: 'Villas', icon: '🏠' },
        { name: 'Plots', icon: '🏗️' },
        { name: 'Commercial', icon: '🏬' },
        { name: 'PG/Hostel', icon: '🛏️' },
        { name: 'Farmhouse', icon: '🌾' },
      ],
      furniture: [
        { name: 'Sofa Sets', icon: '🛋️' },
        { name: 'Beds', icon: '🛏️' },
        { name: 'Dining Tables', icon: '🪑' },
        { name: 'Wardrobes', icon: '🚪' },
        { name: 'Study Tables', icon: '📚' },
        { name: 'Office Furniture', icon: '💼' },
      ],
      electronics: [
        { name: 'Washing Machine', icon: '🧺' },
        { name: 'Refrigerator', icon: '❄️' },
        { name: 'Air Conditioner', icon: '🌬️' },
        { name: 'TV', icon: '📺' },
        { name: 'Camera', icon: '📷' },
        { name: 'Microwave', icon: '📦' },
      ],
      fashion: [
        { name: "Men's Clothing", icon: '👔' },
        { name: "Women's Clothing", icon: '👗' },
        { name: 'Footwear', icon: '👞' },
        { name: 'Watches', icon: '⌚' },
        { name: 'Bags', icon: '👜' },
        { name: 'Accessories', icon: '💍' },
      ],
      books: [
        { name: 'Textbooks', icon: '📚' },
        { name: 'Novels', icon: '📖' },
        { name: 'Comics', icon: '📰' },
        { name: 'Magazines', icon: '📑' },
        { name: 'Reference', icon: '📕' },
        { name: 'Children Books', icon: '📘' },
      ],
      sports: [
        { name: 'Cricket', icon: '🏏' },
        { name: 'Football', icon: '⚽' },
        { name: 'Gym Equipment', icon: '💪' },
        { name: 'Cycling', icon: '🚴' },
        { name: 'Badminton', icon: '🏸' },
        { name: 'Swimming', icon: '🏊' },
      ],
      pets: [
        { name: 'Dogs', icon: '🐕' },
        { name: 'Cats', icon: '🐈' },
        { name: 'Birds', icon: '🦜' },
        { name: 'Fish', icon: '🐠' },
        { name: 'Pet Food', icon: '🍖' },
        { name: 'Accessories', icon: '🦴' },
      ],
    };
    
    return subcategoryMap[selectedCategory] || [];
  };

  const subcategories = getSubcategories();
  
  let filteredItems = getFilteredItems();
  
  // Apply subcategory filter
  if (selectedSubcategory) {
    filteredItems = filteredItems.filter(item =>
      item.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase() ||
      item.title?.toLowerCase().includes(selectedSubcategory.toLowerCase())
    );
  }
  
  // Apply additional filters
  if (conditionFilter !== 'all') {
    filteredItems = filteredItems.filter(item => 
      item.condition?.toLowerCase() === conditionFilter.toLowerCase()
    );
  }
  
  if (minRating > 0) {
    filteredItems = filteredItems.filter(item => 
      getAverageRating(item.id) >= minRating
    );
  }
  
  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.pricePerDay || a.price) - (b.pricePerDay || b.price);
      case 'price-high':
        return (b.pricePerDay || b.price) - (a.pricePerDay || a.price);
      case 'rating':
        return getAverageRating(b.id) - getAverageRating(a.id);
      case 'reviews':
        return getReviewsCount(b.id) - getReviewsCount(a.id);
      case 'newest':
      default:
        return new Date(b.postedDate) - new Date(a.postedDate);
    }
  });

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleFavoriteClick = (e, itemId) => {
    e.stopPropagation();
    toggleFavorite(itemId);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setBudgetFilter(null);
    setPriceRange({ min: 0, max: 50000 });
    setLocation('');
    setConditionFilter('all');
    setMinRating(0);
    setSortBy('newest');
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || selectedSubcategory || budgetFilter || location || priceRange.min > 0 || priceRange.max < 50000 || conditionFilter !== 'all' || minRating > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-3 px-3 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-base md:text-xl font-bold text-gray-900">
            All Listings
            <span className="text-xs font-normal text-gray-500 ml-1.5">
              ({sortedItems.length})
            </span>
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Categories Quick Filter - Compact Cards */}
        <div className="mb-3">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 pb-2">
              {/* All Categories */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100">
                  <ChevronRight size={14} className="text-gray-600" />
                </div>
                <span className="text-xs font-bold">All</span>
              </button>

              {/* Category Cards with Images */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.slug);
                    setSelectedSubcategory(null);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center p-1 ${
                    selectedCategory === category.slug ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <img
                      src={imageMap[category.image]}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subcategories Pills */}
        {subcategories.length > 0 && (
          <div className="mb-3">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-1.5 pb-2">
                {subcategories.map((subcat, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === subcat.name ? null : subcat.name)}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs font-semibold ${
                      selectedSubcategory === subcat.name
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-sm">{subcat.icon}</span>
                    <span className="text-[11px]">{subcat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display - Compact & Improved */}
        {hasActiveFilters && (
          <div className="mb-3 bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                <SlidersHorizontal size={12} className="text-blue-600" />
                <span className="hidden md:inline">Active:</span>
              </div>
              
              {selectedCategory && (
                <span
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold hover:bg-blue-200 transition cursor-pointer"
                >
                  {categories.find(c => c.slug === selectedCategory)?.name}
                  <X size={10} />
                </span>
              )}
              
              {selectedSubcategory && (
                <span
                  onClick={() => setSelectedSubcategory(null)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold hover:bg-purple-200 transition cursor-pointer"
                >
                  {selectedSubcategory}
                  <X size={10} />
                </span>
              )}

              {budgetFilter && (
                <span
                  onClick={() => setBudgetFilter(null)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold hover:bg-green-200 transition cursor-pointer"
                >
                  {budgetFilter}
                  <X size={10} />
                </span>
              )}
              
              {location && (
                <span
                  onClick={() => setLocation('')}
                  className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[10px] font-bold hover:bg-orange-200 transition cursor-pointer"
                >
                  {location}
                  <X size={10} />
                </span>
              )}
              
              {conditionFilter !== 'all' && (
                <span
                  onClick={() => setConditionFilter('all')}
                  className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-[10px] font-bold hover:bg-yellow-200 transition cursor-pointer"
                >
                  {conditionFilter}
                  <X size={10} />
                </span>
              )}
              
              {minRating > 0 && (
                <span
                  onClick={() => setMinRating(0)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-md text-[10px] font-bold hover:bg-pink-200 transition cursor-pointer"
                >
                  {minRating}★+
                  <X size={10} />
                </span>
              )}
              
              <button
                onClick={clearFilters}
                className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[10px] font-bold hover:bg-red-200 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[75vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between z-10">
                  <h2 className="font-bold text-base">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-3 space-y-2.5">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-bold text-xs mb-1.5 text-gray-800">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-600">Min</label>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                          className="w-full mt-0.5 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600">Max</label>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          className="w-full mt-0.5 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="font-bold text-xs mb-1.5 text-gray-800">Location</h3>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                      <input
                        type="text"
                        placeholder="City name"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <h3 className="font-bold text-xs mb-1.5 text-gray-800">Condition</h3>
                    <select
                      value={conditionFilter}
                      onChange={(e) => setConditionFilter(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="all">All</option>
                      <option value="new">New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-bold text-xs mb-1.5 text-gray-800">Rating</h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                          className={`flex items-center justify-center gap-0.5 px-2 py-1 rounded text-[10px] font-bold transition ${
                            minRating === rating
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <StarRating rating={rating} size={10} />
                          <span>+</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-2 flex gap-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1 text-xs py-1.5">
                      Clear
                    </Button>
                    <Button onClick={() => setShowFilters(false)} className="flex-1 bg-blue-600 text-xs py-1.5">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <Card className="p-3 sticky top-20">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-sm">Filters</h2>
                <button onClick={clearFilters} className="text-[10px] text-blue-600 hover:underline font-bold">
                  Clear
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <h3 className="font-bold text-xs mb-1.5 text-gray-800">Price Range</h3>
                <div className="space-y-1.5">
                  <div>
                    <label className="text-[10px] text-gray-600">Min</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full mt-0.5 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-600">Max</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full mt-0.5 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-3">
                <h3 className="font-bold text-xs mb-1.5 text-gray-800">Location</h3>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    placeholder="City name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="mb-3">
                <h3 className="font-bold text-xs mb-1.5 text-gray-800">Condition</h3>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-bold text-xs mb-1.5 text-gray-800">Rating</h3>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`w-full flex items-center gap-1.5 px-2 py-1 rounded transition text-[10px] font-bold ${
                        minRating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <StarRating rating={rating} size={10} />
                      <span>& up</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Items Grid */}
          <div className="flex-1">
            {/* Sort and Count Header - Compact */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div className="text-xs text-gray-600 font-medium">
                {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <ArrowUpDown size={14} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low-High</option>
                  <option value="price-high">Price: High-Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>


            {sortedItems.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">No items found matching your criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="relative bg-white rounded-2xl overflow-hidden cursor-pointer premium-card animate-slide-up border border-gray-100"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteClick(e, item.id)}
                      className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-full shadow-lg hover:scale-110 transition-all hover:bg-white"
                    >
                      <Heart
                        size={16}
                        className={`sm:w-5 sm:h-5 ${
                          isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                      />
                    </button>

                    {/* Image */}
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 md:p-5">
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2 leading-relaxed hidden sm:block">{item.description}</p>

                      {/* Rating */}
                      {getReviewsCount(item.id) > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating 
                            rating={getAverageRating(item.id)} 
                            size={14}
                            showNumber={false}
                            className="sm:hidden"
                          />
                          <StarRating 
                            rating={getAverageRating(item.id)} 
                            size={16}
                            showNumber={true}
                            className="hidden sm:flex"
                          />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            ({getReviewsCount(item.id)})
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-base sm:text-xl md:text-2xl font-bold text-blue-600">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-500 truncate">
                          <MapPin size={12} className="mr-1 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400">
                          {format(new Date(item.postedDate), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;

