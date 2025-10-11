import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useCategories } from '../../contexts/CategoryContext';
import { ChevronRight } from 'lucide-react';
import AdBanner from './AdBanner';

const CategoryGrid = () => {
  const { categories, setSelectedCategory } = useApp();
  const { imageMap } = useCategories();
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

        {/* Desktop Categories - 9 Columns Grid */}
        <div className="hidden md:block">
          {/* Header with View All Button */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Browse Categories</h2>
            <button
              onClick={handleSeeAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="text-sm font-semibold">View All</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="grid grid-cols-9 gap-2 lg:gap-3">
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-1 max-w-[90px] mx-auto"
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  
                  <div className="relative w-full">
                    {/* Image Container - Compact */}
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-200 border border-gray-100 group-hover:border-blue-200 p-2">
                      <img
                        src={imageMap[category.image]}
                        alt={category.name}
                        className="object-contain group-hover:scale-105 transition-transform duration-200 w-full h-full"
                        style={{ maxWidth: '90%', maxHeight: '90%' }}
                      />
                    </div>
                    
                    {/* Category Name */}
                    <div className="text-center px-1">
                      <h3 className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 line-clamp-1 tracking-tight transition-colors duration-200">
                        {category.name}
                      </h3>
                    </div>

                    {/* Subtle indicator badge */}
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
                      style={{ width: '48px', height: '48px' }}
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
