import { useState, useEffect } from 'react';
import { Sparkles, Zap, Star } from 'lucide-react';
import apiService from '../../services/api';

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch banners from the public API
      const response = await apiService.getPublicBanners('', 10);
      
      console.log('Banner API Response:', response);
      if (response.success && response.data.banners) {
        console.log('Banners found:', response.data.banners);
        setBanners(response.data.banners);
      } else {
        console.log('No banners found in response');
        setBanners([]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to load banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    
    // Refresh banners every 10 seconds to get updates from admin
    const refreshInterval = setInterval(() => {
      fetchBanners();
    }, 10000); // 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Refresh banners when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBanners();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto-rotate banner every 4 seconds (only if we have banners)
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse" />
      <div className="relative rounded-3xl overflow-hidden">
        {loading ? (
          <div className="w-full h-44 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gray-200 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading banners...</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 xl:h-96 bg-gray-100">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={banner.banner} 
                  alt={banner.title || `RentYatra Banner ${index + 1}`} 
                  className="w-full h-full rounded-3xl shadow-2xl"
                  style={{ objectFit: 'fill' }}
                  onLoad={(e) => {
                    const img = e.target;
                    // Ensure image fills container properly
                    img.style.minHeight = '100%';
                    img.style.minWidth = '100%';
                  }}
                  onError={(e) => {
                    console.error('Banner image failed to load:', banner.banner);
                    // Hide the broken image
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Banner Indicators */}
        {!loading && banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;