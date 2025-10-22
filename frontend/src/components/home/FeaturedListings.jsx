import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import ImageCarousel from '../common/ImageCarousel';
import { format } from 'date-fns';
import apiService from '../../services/api';

const FeaturedListings = () => {
  const { toggleFavorite, isFavorite, getAverageRating, getReviewsCount, setSelectedCategory } = useApp();
  const navigate = useNavigate();
  const [animatingHeart, setAnimatingHeart] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch featured rental requests for the homepage
  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch featured rental requests using the public API
        const response = await apiService.getFeaturedRentalRequests(8);

        if (response.success) {
          console.log('Featured rental requests data:', response.data.requests);
          
          // Transform rental requests to match the expected format
          const transformedListings = response.data.requests.map(request => {
            console.log('Processing request:', request);
            
            // Use address if available, otherwise fallback to city, state
            let location = 'Location not specified';
            if (request.location?.address) {
              location = request.location.address;
            } else if (request.location?.city && request.location?.state && 
                      request.location.city !== 'Unknown' && request.location.state !== 'Unknown') {
              location = `${request.location.city}, ${request.location.state}`;
            }
            
            return {
              id: request._id,
              title: request.title,
              description: request.description,
              price: request.price?.amount || 0,
              location: location,
              images: request.images ? (() => {
                // Sort images to put primary image first
                const sortedImages = [...request.images].sort((a, b) => {
                  if (a.isPrimary && !b.isPrimary) return -1;
                  if (!a.isPrimary && b.isPrimary) return 1;
                  return 0;
                });
                return sortedImages.map(img => img.url);
              })() : [],
              video: request.video?.url || null,
              postedDate: request.createdAt,
              category: request.category?.name || 'General',
              product: request.product?.name || 'General',
              condition: 'Good',
              owner: request.user,
              averageRating: 0,
              totalReviews: 0,
              isBoosted: false
            };
          });
          
          console.log('Transformed listings:', transformedListings);
          setFeaturedItems(transformedListings);
        } else {
          setError('Failed to load featured listings');
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error);
        setError('Failed to load featured listings');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
            <p className="text-gray-600">Loading featured listings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : featuredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No approved listings available yet</p>
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
                      {item.totalReviews > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating 
                            rating={item.averageRating} 
                            size={14}
                            showNumber={false}
                            className="sm:hidden"
                          />
                          <StarRating 
                            rating={item.averageRating} 
                            size={16}
                            showNumber={true}
                            className="hidden sm:flex"
                          />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            ({item.totalReviews})
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

