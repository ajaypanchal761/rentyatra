import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Heart, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StarRating from '../components/common/StarRating';
import LocationSearch from '../components/home/LocationSearch';
import { format } from 'date-fns';

// Import category images
import carImg from '../assets/car.png';
import mobileImg from '../assets/mobile.png';
import bikeImg from '../assets/bike.png';
import furnitureImg from '../assets/furniture.png';
import fashionImg from '../assets/fashion.png';
import bookImg from '../assets/book.png';
import sportImg from '../assets/sport.png';
import realstateImg from '../assets/realstate.png';
import petImg from '../assets/pet.png';

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
    <div className="min-h-screen bg-gray-50 py-6 px-4 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Listings
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <Button
            variant="outline"
            icon={SlidersHorizontal}
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            Filters
          </Button>
        </div>

        {/* Subcategories Horizontal Row with Circular Icons */}
        {subcategories.length > 0 && (
          <div className="mb-4">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                {/* All option */}
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`flex flex-col items-center transition-all ${
                    !selectedSubcategory ? 'scale-105' : ''
                  }`}
                  style={{ minWidth: '75px' }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                    !selectedSubcategory
                      ? 'bg-[#002f34] text-white shadow-lg ring-2 ring-[#002f34] ring-offset-2'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <span className="text-2xl">🌟</span>
                  </div>
                  <span className={`text-[9px] font-bold text-center leading-tight ${
                    !selectedSubcategory ? 'text-[#002f34]' : 'text-gray-700'
                  }`}>
                    All
                  </span>
                </button>

                {/* Subcategory options */}
                {subcategories.map((subcat, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubcategory(subcat.name)}
                    className={`flex flex-col items-center transition-all ${
                      selectedSubcategory === subcat.name ? 'scale-105' : ''
                    }`}
                    style={{ minWidth: '75px' }}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      selectedSubcategory === subcat.name
                        ? 'bg-[#002f34] text-white shadow-lg ring-2 ring-[#002f34] ring-offset-2'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}>
                      <span className="text-2xl">{subcat.icon}</span>
                    </div>
                    <span className={`text-[9px] font-bold text-center leading-tight px-1 ${
                      selectedSubcategory === subcat.name ? 'text-[#002f34]' : 'text-gray-700'
                    }`}>
                      {subcat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display - Compact */}
        {hasActiveFilters && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2.5 border border-blue-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag size={14} className="text-blue-600" />
              
              {selectedCategory && (
                <span
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-md text-[10px] font-semibold hover:bg-blue-700 transition cursor-pointer"
                >
                  {categories.find(c => c.slug === selectedCategory)?.name}
                  <X size={12} />
                </span>
              )}
              
              {selectedSubcategory && (
                <span
                  onClick={() => setSelectedSubcategory(null)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 text-white rounded-md text-[10px] font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  {selectedSubcategory}
                  <X size={12} />
                </span>
              )}

              {budgetFilter && (
                <span
                  onClick={() => setBudgetFilter(null)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white rounded-md text-[10px] font-semibold hover:bg-green-700 transition cursor-pointer"
                >
                  {budgetFilter}
                  <X size={12} />
                </span>
              )}
              
              {location && (
                <span
                  onClick={() => setLocation('')}
                  className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 text-white rounded-md text-[10px] font-semibold hover:bg-orange-700 transition cursor-pointer"
                >
                  {location}
                  <X size={12} />
                </span>
              )}
              
              {conditionFilter !== 'all' && (
                <span
                  onClick={() => setConditionFilter('all')}
                  className="flex items-center gap-1 px-2.5 py-1 bg-yellow-600 text-white rounded-md text-[10px] font-semibold hover:bg-yellow-700 transition cursor-pointer"
                >
                  {conditionFilter}
                  <X size={12} />
                </span>
              )}
              
              {minRating > 0 && (
                <span
                  onClick={() => setMinRating(0)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-pink-600 text-white rounded-md text-[10px] font-semibold hover:bg-pink-700 transition cursor-pointer"
                >
                  {minRating}★+
                  <X size={12} />
                </span>
              )}
              
              <button
                onClick={clearFilters}
                className="ml-auto px-2.5 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold hover:bg-red-700 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>


        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-64 flex-shrink-0`}
          >
            <Card className="p-4 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: Number(e.target.value) })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: Number(e.target.value) })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Location
                </h3>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                  {location && (
                    <button
                      onClick={() => setLocation('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Search by city or location name
                </p>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Condition</h3>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                        minRating === rating
                          ? 'bg-blue-100 border-2 border-blue-600'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <StarRating rating={rating} size={16} />
                      <span className="text-sm">& up</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Items Grid */}
          <div className="flex-1">
            {/* Sort and Count Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="text-gray-600">
                {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown size={18} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
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

