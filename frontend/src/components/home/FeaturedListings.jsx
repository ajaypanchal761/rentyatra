import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import ImageCarousel from '../common/ImageCarousel';
import { format } from 'date-fns';

const FeaturedListings = () => {
  const { items, toggleFavorite, isFavorite, getAverageRating, getReviewsCount, setSelectedCategory } = useApp();
  const navigate = useNavigate();
  const [animatingHeart, setAnimatingHeart] = useState(null);

  // Show all products in featured listings
  const featuredItems = items;

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
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
          <button 
            onClick={handleViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
          >
            View All
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {featuredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items available yet</p>
            <Button className="mt-4" onClick={() => navigate('/post-ad')}>
              Post the First Ad
            </Button>
          </div>
        ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {featuredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="relative bg-white rounded-2xl overflow-hidden cursor-pointer premium-card animate-slide-up border border-gray-100"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteClick(e, item.id)}
                      className={`absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-full shadow-lg hover:scale-110 transition-all hover:bg-white ${
                        animatingHeart === item.id ? 'heart-pulse' : ''
                      }`}
                    >
                      <Heart
                        size={16}
                        className={`sm:w-5 sm:h-5 transition-all ${
                          isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        } ${animatingHeart === item.id ? 'heart-animate' : ''}`}
                      />
                    </button>

                    {/* Image Carousel */}
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <ImageCarousel 
                        images={item.images} 
                        video={item.video}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 md:p-5">
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2 leading-relaxed hidden sm:block">
                        {item.description}
                      </p>
                      
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
                          ₹{item.price.toLocaleString()}
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
  );
};

export default FeaturedListings;

