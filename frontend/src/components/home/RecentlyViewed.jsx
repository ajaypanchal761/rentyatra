import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { MapPin, Heart, Clock, ChevronRight } from 'lucide-react';
import ImageCarousel from '../common/ImageCarousel';
import { RecentlyViewedSkeleton } from '../common/SkeletonLoader';

const RecentlyViewed = memo(() => {
  const { getRecentlyViewedItems, toggleFavorite, isFavorite, setSelectedCategory } = useApp();
  const navigate = useNavigate();
  const [animatingHeart, setAnimatingHeart] = useState(null);
  
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
    
    // Trigger animation
    setAnimatingHeart(itemId);
    setTimeout(() => setAnimatingHeart(null), 600);
  };

  const handleViewAll = () => {
    setSelectedCategory(null); // Clear category filter to show all products
    navigate('/listings');
  };

  return (
    <div className="py-6 md:py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-gray-700" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Recently Viewed
            </h2>
          </div>
          <button
            onClick={handleViewAll}
            className="text-blue-600 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {recentItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="relative flex-shrink-0 w-44 md:w-52 bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-200"
              >
              {/* Favorite Button */}
              <button
                onClick={(e) => handleFavoriteClick(e, item.id)}
                className={`absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full border border-gray-200 ${
                  animatingHeart === item.id ? 'heart-pulse' : ''
                }`}
              >
                <Heart
                  size={16}
                  className={`transition-all ${
                    isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  } ${animatingHeart === item.id ? 'heart-animate' : ''}`}
                />
              </button>

              {/* Image Carousel */}
              <div className="aspect-[4/3] bg-gray-100">
                <ImageCarousel 
                  images={item.images} 
                  video={item.video}
                  className="w-full h-full"
                />
              </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">/month</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
});

RecentlyViewed.displayName = 'RecentlyViewed';

export default RecentlyViewed;

