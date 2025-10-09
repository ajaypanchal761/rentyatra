import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { MapPin, Heart, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const RecentlyViewed = () => {
  const { getRecentlyViewedItems, toggleFavorite, isFavorite, setSelectedCategory } = useApp();
  const navigate = useNavigate();
  
  const recentItems = getRecentlyViewedItems();

  if (recentItems.length === 0) {
    return null; // Don't show the section if no items viewed
  }

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleFavoriteClick = (e, itemId) => {
    e.stopPropagation();
    toggleFavorite(itemId);
  };

  const handleViewAll = () => {
    setSelectedCategory(null); // Clear category filter to show all products
    navigate('/listings');
  };

  return (
    <div className="py-6 md:py-8 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Clock size={18} className="text-white md:w-5 md:h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                Recently Viewed
              </h2>
              <p className="text-[10px] md:text-xs text-gray-600">
                Continue browsing where you left off
              </p>
            </div>
          </div>
          <button
            onClick={handleViewAll}
            className="text-blue-600 hover:text-blue-700 transition flex items-center text-xs font-semibold group"
          >
            View All
            <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Gradient fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-blue-50/30 to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrollable Items */}
          <div className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth snap-x snap-mandatory">
            {recentItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="relative flex-shrink-0 w-44 md:w-56 lg:w-64 bg-white rounded-2xl overflow-hidden cursor-pointer premium-card border border-gray-100 snap-start group"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => handleFavoriteClick(e, item.id)}
                  className="absolute top-2 right-2 z-20 bg-white/95 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-lg hover:scale-110 transition-all hover:bg-white"
                >
                  <Heart
                    size={14}
                    className={`md:w-4 md:h-4 ${
                      isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Viewed Badge */}
                <div className="absolute top-2 left-2 z-20 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock size={10} className="text-white md:w-3 md:h-3" />
                  <span className="text-[8px] md:text-[9px] font-semibold text-white">Viewed</span>
                </div>

                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 md:mb-2 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                    <span className="text-base md:text-lg lg:text-xl font-bold text-blue-600">
                      ${item.price.toLocaleString()}
                    </span>
                    <span className="text-[8px] md:text-[9px] text-gray-500">/month</span>
                  </div>

                  <div className="flex flex-col gap-1 text-[10px] md:text-xs">
                    <div className="flex items-center text-gray-500">
                      <MapPin size={10} className="mr-1 flex-shrink-0 md:w-3 md:h-3" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="text-gray-400">
                      {format(new Date(item.postedDate), 'dd MMM yyyy')}
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Dots (optional) */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {recentItems.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-blue-600/30"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;

