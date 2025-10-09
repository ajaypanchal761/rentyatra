import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ChevronRight } from 'lucide-react';
import AdBanner from './AdBanner';

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

const CategoryGrid = () => {
  const { categories, setSelectedCategory } = useApp();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.slug);
    navigate(`/category/${category.slug}`);
  };

  const handleSeeAll = () => {
    setSelectedCategory(null);
    navigate('/listings');
  };

  return (
    <div className="py-4 md:py-6 px-3 md:px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Mobile - Ad Banner on Top */}
        <div className="md:hidden mb-4">
          <AdBanner />
        </div>

        {/* Desktop - Ad Banner on Top */}
        <div className="hidden md:block mb-6 lg:mb-8">
          <AdBanner />
        </div>

        {/* Desktop Categories Grid - All categories visible */}
        <div className="hidden md:block">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Browse Categories</h2>
          <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-4">
          {categories.map((category) => {
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group relative flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative w-full">
                  {/* Image Container with enhanced styling - Smaller */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
                    <img
                      src={imageMap[category.image]}
                      alt={category.name}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      style={{ width: '55%', height: '55%' }}
                    />
                  </div>
                  
                  {/* Category Name with better styling - Smaller text */}
                  <div className="text-center px-1">
                    <h3 className="font-bold text-xs lg:text-sm text-gray-800 group-hover:text-blue-600 line-clamp-1 tracking-tight transition-colors duration-200">
                      {category.name}
                    </h3>
                  </div>

                  {/* Subtle indicator badge */}
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </button>
            );
          })}
          </div>
        </div>

        {/* Mobile Grid - 2 rows, synchronized horizontal scroll */}
        <div className="md:hidden overflow-x-auto hide-scrollbar">
          <div 
            className="grid grid-rows-2 auto-cols-max gap-x-1.5 gap-y-2 pb-2" 
            style={{ 
              gridAutoFlow: 'column',
              width: 'max-content'
            }}
          >
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="flex flex-col items-center active:scale-95 transition-all"
                  style={{ width: '62px' }}
                >
                  {/* Image Container with Shadow and Background */}
                  <div 
                    className="w-full rounded-lg overflow-hidden bg-gray-100 mb-1 flex items-center justify-center"
                    style={{ 
                      height: '58px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <img
                      src={imageMap[category.image]}
                      alt={category.name}
                      className="object-contain"
                      style={{ width: '38px', height: '38px' }}
                    />
                  </div>
                  {/* Text Container - No background */}
                  <div className="w-full px-0.5 text-center">
                    <span className="text-[9px] font-bold text-gray-800 leading-snug line-clamp-2 block tracking-tight">
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
            
            {/* See All Card */}
            <button
              onClick={handleSeeAll}
              className="flex flex-col items-center justify-center active:scale-95 transition-all"
              style={{ width: '62px', gridRow: 'span 2' }}
            >
              <div 
                className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center gap-1.5"
                style={{ 
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              >
                <ChevronRight size={24} className="text-blue-600" strokeWidth={2.5} />
                <span className="text-[9px] font-bold text-blue-600">
                  See All
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
