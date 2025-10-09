import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

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

const CategoryDetail = () => {
  const { categorySlug } = useParams();
  const { categories, setSelectedCategory } = useApp();
  const navigate = useNavigate();

  const currentCategory = categories.find(cat => cat.slug === categorySlug) || categories[0];

  // Category-specific data
  const categoryData = {
    cars: {
      budgetLabel: 'Cars By Budget',
      budgetRanges: [
        { id: 1, label: '<3L', description: 'Below 3 Lac' },
        { id: 2, label: '3L-6L', description: '3 Lac - 6 Lac' },
        { id: 3, label: '6L-10L', description: '6 Lac - 10 Lac' },
        { id: 4, label: '10L-15L', description: '10 Lac - 15 Lac' },
        { id: 5, label: '>15L', description: '15 Lac and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Sedan', icon: '🚗' },
        { id: 2, name: 'SUV', icon: '🚙' },
        { id: 3, name: 'Hatchback', icon: '🚕' },
        { id: 4, name: 'Sports Car', icon: '🏎️' },
        { id: 5, name: 'Luxury', icon: '🚐' },
        { id: 6, name: 'Electric', icon: '⚡' },
      ]
    },
    bikes: {
      budgetLabel: 'Bikes By Budget',
      budgetRanges: [
        { id: 1, label: '<50K', description: 'Below 50K' },
        { id: 2, label: '50K-1L', description: '50K - 1 Lac' },
        { id: 3, label: '1L-2L', description: '1 Lac - 2 Lac' },
        { id: 4, label: '2L-5L', description: '2 Lac - 5 Lac' },
        { id: 5, label: '>5L', description: '5 Lac and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Sports Bike', icon: '🏍️' },
        { id: 2, name: 'Cruiser', icon: '🛵' },
        { id: 3, name: 'Scooter', icon: '🛴' },
        { id: 4, name: 'Commuter', icon: '🚲' },
        { id: 5, name: 'Electric', icon: '⚡' },
        { id: 6, name: 'Vintage', icon: '🎪' },
      ]
    },
    mobiles: {
      budgetLabel: 'Mobiles By Budget',
      budgetRanges: [
        { id: 1, label: '<10K', description: 'Below 10K' },
        { id: 2, label: '10K-20K', description: '10K - 20K' },
        { id: 3, label: '20K-30K', description: '20K - 30K' },
        { id: 4, label: '30K-50K', description: '30K - 50K' },
        { id: 5, label: '>50K', description: '50K and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Smartphones', icon: '📱' },
        { id: 2, name: 'Feature Phones', icon: '📞' },
        { id: 3, name: 'Tablets', icon: '📱' },
        { id: 4, name: 'Accessories', icon: '🔌' },
        { id: 5, name: 'Smartwatches', icon: '⌚' },
        { id: 6, name: 'Gaming', icon: '🎮' },
      ]
    },
    properties: {
      budgetLabel: 'Properties By Budget',
      budgetRanges: [
        { id: 1, label: '<20L', description: 'Below 20 Lac' },
        { id: 2, label: '20L-50L', description: '20 Lac - 50 Lac' },
        { id: 3, label: '50L-1Cr', description: '50 Lac - 1 Crore' },
        { id: 4, label: '1Cr-2Cr', description: '1 Cr - 2 Crore' },
        { id: 5, label: '>2Cr', description: '2 Cr and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Apartments', icon: '🏢' },
        { id: 2, name: 'Villas', icon: '🏠' },
        { id: 3, name: 'Plots', icon: '🏗️' },
        { id: 4, name: 'Commercial', icon: '🏬' },
        { id: 5, name: 'PG/Hostel', icon: '🛏️' },
        { id: 6, name: 'Farmhouse', icon: '🌾' },
      ]
    },
    furniture: {
      budgetLabel: 'Furniture By Budget',
      budgetRanges: [
        { id: 1, label: '<5K', description: 'Below 5K' },
        { id: 2, label: '5K-10K', description: '5K - 10K' },
        { id: 3, label: '10K-25K', description: '10K - 25K' },
        { id: 4, label: '25K-50K', description: '25K - 50K' },
        { id: 5, label: '>50K', description: '50K and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Sofa Sets', icon: '🛋️' },
        { id: 2, name: 'Beds', icon: '🛏️' },
        { id: 3, name: 'Dining Tables', icon: '🪑' },
        { id: 4, name: 'Wardrobes', icon: '🚪' },
        { id: 5, name: 'Study Tables', icon: '📚' },
        { id: 6, name: 'Office Furniture', icon: '💼' },
      ]
    },
    electronics: {
      budgetLabel: 'Electronics By Budget',
      budgetRanges: [
        { id: 1, label: '<10K', description: 'Below 10K' },
        { id: 2, label: '10K-25K', description: '10K - 25K' },
        { id: 3, label: '25K-50K', description: '25K - 50K' },
        { id: 4, label: '50K-1L', description: '50K - 1 Lac' },
        { id: 5, label: '>1L', description: '1 Lac and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Washing Machine', icon: '🧺' },
        { id: 2, name: 'Refrigerator', icon: '❄️' },
        { id: 3, name: 'Air Conditioner', icon: '🌬️' },
        { id: 4, name: 'TV', icon: '📺' },
        { id: 5, name: 'Camera', icon: '📷' },
        { id: 6, name: 'Microwave', icon: '📦' },
      ]
    },
    fashion: {
      budgetLabel: 'Fashion By Budget',
      budgetRanges: [
        { id: 1, label: '<500', description: 'Below 500' },
        { id: 2, label: '500-1K', description: '500 - 1K' },
        { id: 3, label: '1K-3K', description: '1K - 3K' },
        { id: 4, label: '3K-5K', description: '3K - 5K' },
        { id: 5, label: '>5K', description: '5K and Above' },
      ],
      subcategories: [
        { id: 1, name: "Men's Clothing", icon: '👔' },
        { id: 2, name: "Women's Clothing", icon: '👗' },
        { id: 3, name: 'Footwear', icon: '👞' },
        { id: 4, name: 'Watches', icon: '⌚' },
        { id: 5, name: 'Bags', icon: '👜' },
        { id: 6, name: 'Accessories', icon: '💍' },
      ]
    },
    books: {
      budgetLabel: 'Books By Budget',
      budgetRanges: [
        { id: 1, label: '<200', description: 'Below 200' },
        { id: 2, label: '200-500', description: '200 - 500' },
        { id: 3, label: '500-1K', description: '500 - 1K' },
        { id: 4, label: '1K-2K', description: '1K - 2K' },
        { id: 5, label: '>2K', description: '2K and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Textbooks', icon: '📚' },
        { id: 2, name: 'Novels', icon: '📖' },
        { id: 3, name: 'Comics', icon: '📰' },
        { id: 4, name: 'Magazines', icon: '📑' },
        { id: 5, name: 'Reference', icon: '📕' },
        { id: 6, name: 'Children Books', icon: '📘' },
      ]
    },
    sports: {
      budgetLabel: 'Sports By Budget',
      budgetRanges: [
        { id: 1, label: '<1K', description: 'Below 1K' },
        { id: 2, label: '1K-3K', description: '1K - 3K' },
        { id: 3, label: '3K-5K', description: '3K - 5K' },
        { id: 4, label: '5K-10K', description: '5K - 10K' },
        { id: 5, label: '>10K', description: '10K and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Cricket', icon: '🏏' },
        { id: 2, name: 'Football', icon: '⚽' },
        { id: 3, name: 'Gym Equipment', icon: '💪' },
        { id: 4, name: 'Cycling', icon: '🚴' },
        { id: 5, name: 'Badminton', icon: '🏸' },
        { id: 6, name: 'Swimming', icon: '🏊' },
      ]
    },
    pets: {
      budgetLabel: 'Pets By Budget',
      budgetRanges: [
        { id: 1, label: '<5K', description: 'Below 5K' },
        { id: 2, label: '5K-10K', description: '5K - 10K' },
        { id: 3, label: '10K-25K', description: '10K - 25K' },
        { id: 4, label: '25K-50K', description: '25K - 50K' },
        { id: 5, label: '>50K', description: '50K and Above' },
      ],
      subcategories: [
        { id: 1, name: 'Dogs', icon: '🐕' },
        { id: 2, name: 'Cats', icon: '🐈' },
        { id: 3, name: 'Birds', icon: '🦜' },
        { id: 4, name: 'Fish', icon: '🐠' },
        { id: 5, name: 'Pet Food', icon: '🍖' },
        { id: 6, name: 'Accessories', icon: '🦴' },
      ]
    },
  };

  const currentData = categoryData[currentCategory.slug] || categoryData.cars;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.slug);
    navigate(`/category/${category.slug}`);
  };

  const handleBudgetClick = (budget) => {
    setSelectedCategory(currentCategory.slug);
    navigate('/listings', { state: { budget: budget.description } });
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedCategory(currentCategory.slug);
    navigate('/listings', { state: { subcategory: subcategory.name } });
  };

  const handleViewAll = () => {
    setSelectedCategory(currentCategory.slug);
    navigate('/listings');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition mr-3"
          >
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - Categories List */}
        <div className="w-20 md:w-24 bg-[#f0f4f7] border-r border-gray-200 overflow-y-auto flex-shrink-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`w-full flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
                category.slug === currentCategory.slug
                  ? 'bg-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={imageMap[category.image]}
                alt={category.name}
                className="w-9 h-9 md:w-10 md:h-10 object-contain"
              />
              <span className="text-[7px] md:text-[8px] font-semibold text-gray-900 text-center leading-tight px-0.5">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-4">
          {/* Banner Ad */}
          <div className="p-3 md:p-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg md:rounded-xl p-4 md:p-6 text-white">
              <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Festival Special!</h2>
              <p className="text-xs md:text-sm mb-3 md:mb-4">Special discounts on all categories</p>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 md:py-2 md:px-6 rounded-lg text-xs md:text-sm transition">
                BOOK NOW
              </button>
            </div>
          </div>

          {/* By Budget Section */}
          <div className="px-3 md:px-4 py-3 md:py-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              {currentData.budgetLabel}
            </h3>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {currentData.budgetRanges.map((budget) => (
                <button
                  key={budget.id}
                  onClick={() => handleBudgetClick(budget)}
                  className="group flex flex-col items-center py-2.5 md:py-4 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg active:scale-95"
                >
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-1 md:mb-2 shadow-sm group-hover:shadow-md transition-all duration-200">
                    <span className="text-xs md:text-base font-black text-blue-600 group-hover:text-blue-700">{budget.label}</span>
                  </div>
                  <span className="text-[9px] md:text-xs text-center font-bold text-gray-700 group-hover:text-blue-600 px-1 leading-tight transition-colors duration-200">
                    {budget.description}
                  </span>
                </button>
              ))}
              
              {/* View All Button */}
              <button
                onClick={handleViewAll}
                className="flex flex-col items-center justify-center py-3 md:py-4 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center mb-1 md:mb-2">
                  <ChevronRight size={18} className="text-white md:w-6 md:h-6" strokeWidth={2.5} />
                </div>
                <span className="text-[9px] md:text-xs font-black text-white">View All</span>
              </button>
            </div>
          </div>

          {/* Subcategories Section */}
          <div className="px-3 md:px-4 py-3 md:py-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Browse by Type</h3>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {currentData.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSubcategoryClick(subcategory)}
                  className="group flex flex-col items-center py-3 md:py-4 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg active:scale-95"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-2xl flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all duration-200">
                    <span className="text-2xl md:text-3xl">{subcategory.icon}</span>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-800 group-hover:text-blue-600 text-center leading-tight px-1 transition-colors duration-200">
                    {subcategory.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;

