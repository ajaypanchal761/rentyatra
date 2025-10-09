import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Heart, MessageCircle, Share2, Phone, Mail, Star, ChevronLeft, Package, Calendar, Shield, Truck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ReviewsSection from '../components/product/ReviewsSection';
import StarRating from '../components/common/StarRating';
import BookingCard from '../components/booking/BookingCard';
import { format } from 'date-fns';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, toggleFavorite, isFavorite, addToRecentlyViewed, getAverageRating, getReviewsCount } = useApp();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  const item = items.find((item) => item.id === Number(id));

  // Track recently viewed items
  useEffect(() => {
    if (item) {
      addToRecentlyViewed(item.id);
    }
  }, [item, addToRecentlyViewed]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Item not found</h2>
          <Button onClick={() => navigate('/listings')}>Browse Listings</Button>
        </Card>
      </div>
    );
  }

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // In a real app, this would open a chat or messaging interface
    alert('Opening chat with seller...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Get related products (same category, excluding current item)
  const relatedProducts = items
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-6 px-3 md:px-4 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-3 md:mb-4 text-sm md:text-base"
        >
          <ChevronLeft size={18} className="md:w-5 md:h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-3 md:space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              {/* Main Image */}
              <div className="aspect-video bg-gray-200">
                <img
                  src={item.images[selectedImage]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {item.images.length > 1 && (
                <div className="flex gap-1.5 md:gap-2 p-2 md:p-4 overflow-x-auto hide-scrollbar">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Item Details */}
            <Card className="p-3 md:p-6">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2">
                    {item.title}
                  </h1>
                  <div className="flex items-center text-gray-600 text-xs md:text-sm">
                    <MapPin size={14} className="mr-1 flex-shrink-0 md:w-4 md:h-4" />
                    <span className="truncate">{item.location}</span>
                    <span className="mx-1 md:mx-2">•</span>
                    <span className="whitespace-nowrap">{format(new Date(item.postedDate), 'dd/MM/yyyy')}</span>
                  </div>
                </div>
                <div className="flex gap-1 md:gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Heart
                      size={18}
                      className={`md:w-6 md:h-6 ${isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Share2 size={18} className="text-gray-600 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">
                    ${item.price.toLocaleString()}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500">/month</span>
                </div>
                {/* Rating Display */}
                {getReviewsCount(item.id) > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating 
                      rating={getAverageRating(item.id)} 
                      size={18}
                      showNumber={true}
                    />
                    <span className="text-sm text-gray-600">
                      ({getReviewsCount(item.id)} {getReviewsCount(item.id) === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 md:mb-6">
                <div className="bg-blue-50 rounded-lg p-2 md:p-3 text-center">
                  <Package size={16} className="mx-auto mb-1 text-blue-600 md:w-5 md:h-5" />
                  <p className="text-[10px] md:text-xs text-gray-600">Good Condition</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 md:p-3 text-center">
                  <Calendar size={16} className="mx-auto mb-1 text-green-600 md:w-5 md:h-5" />
                  <p className="text-[10px] md:text-xs text-gray-600">Available Now</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 md:p-3 text-center">
                  <Shield size={16} className="mx-auto mb-1 text-purple-600 md:w-5 md:h-5" />
                  <p className="text-[10px] md:text-xs text-gray-600">Verified Seller</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 md:p-3 text-center">
                  <Truck size={16} className="mx-auto mb-1 text-orange-600 md:w-5 md:h-5" />
                  <p className="text-[10px] md:text-xs text-gray-600">Pickup Available</p>
                </div>
              </div>

              <div className="border-t pt-3 md:pt-6">
                <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-2 md:mb-3">Description</h2>
                <p className="text-xs md:text-sm lg:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="border-t pt-3 md:pt-6 mt-3 md:mt-6">
                <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4">Product Details</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                    <span className="text-[10px] md:text-xs text-gray-600 block mb-1">Category</span>
                    <p className="text-xs md:text-sm font-semibold capitalize">{item.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                    <span className="text-[10px] md:text-xs text-gray-600 block mb-1">Condition</span>
                    <p className="text-xs md:text-sm font-semibold">Excellent</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                    <span className="text-[10px] md:text-xs text-gray-600 block mb-1">Listed On</span>
                    <p className="text-xs md:text-sm font-semibold">
                      {format(new Date(item.postedDate), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                    <span className="text-[10px] md:text-xs text-gray-600 block mb-1">Item ID</span>
                    <p className="text-xs md:text-sm font-semibold">#{item.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking & Seller Info */}
          <div className="space-y-3 md:space-y-6">
            {/* Booking Card */}
            <BookingCard item={item} />
            
            {/* Seller Card */}
            <Card className="p-3 md:p-6">
              <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4">Seller Information</h2>
              
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold flex-shrink-0">
                  {item.seller.name.charAt(0)}
                </div>
                <div className="ml-3 md:ml-4 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base lg:text-lg truncate">{item.seller.name}</h3>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-yellow-400 md:w-4 md:h-4" />
                    <span className="ml-1 text-xs md:text-sm text-gray-600">{item.seller.rating} Rating</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center text-xs md:text-sm text-gray-600">
                  <Phone size={14} className="mr-2 flex-shrink-0 md:w-4 md:h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-xs md:text-sm text-gray-600">
                  <Mail size={14} className="mr-2 flex-shrink-0 md:w-4 md:h-4" />
                  <span className="truncate">seller@example.com</span>
                </div>
              </div>

              <Button
                icon={MessageCircle}
                className="w-full mb-2 md:mb-3 text-sm md:text-base"
                onClick={handleContactSeller}
              >
                Chat with Seller
              </Button>
              
              <Button
                variant="outline"
                icon={Phone}
                className="w-full text-sm md:text-base"
              >
                Show Phone Number
              </Button>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-xs md:text-sm mb-2">Safety Tips</h4>
                <ul className="text-[10px] md:text-xs text-gray-600 space-y-1">
                  <li>• Meet in a safe, public place</li>
                  <li>• Check the item before renting</li>
                  <li>• Pay only after collecting item</li>
                  <li>• Verify seller identity</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 md:mt-12">
          <ReviewsSection itemId={item.id} />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-6 md:mt-8">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Related Items
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((relatedItem) => (
                <div
                  key={relatedItem.id}
                  onClick={() => navigate(`/item/${relatedItem.id}`)}
                  className="bg-white rounded-xl overflow-hidden cursor-pointer premium-card border border-gray-100"
                >
                  {/* Image */}
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={relatedItem.images[0]}
                      alt={relatedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-2 md:p-3">
                    <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <p className="text-blue-600 font-bold text-sm md:text-base mb-1">
                      ${relatedItem.price.toLocaleString()}
                    </p>
                    <div className="flex items-center text-gray-500 text-[10px] md:text-xs">
                      <MapPin size={10} className="mr-1 flex-shrink-0 md:w-3 md:h-3" />
                      <span className="truncate">{relatedItem.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;

