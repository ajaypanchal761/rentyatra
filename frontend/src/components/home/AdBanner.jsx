import { useState, useEffect } from 'react';
import { Sparkles, Zap, Star } from 'lucide-react';

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredProducts = [
    {
      id: 1,
      title: "Premium Camera Equipment",
      description: "Professional DSLR Camera with Lens Kit - Perfect for Photography",
      price: 299,
      discount: 30,
      image: "https://images.unsplash.com/photo-1606980707002-27163e2d5af7?w=800&auto=format&fit=crop",
      badge: "Hot Deal",
      gradient: "from-orange-600 via-red-600 to-pink-700"
    },
    {
      id: 2,
      title: "MacBook Pro 16-inch",
      description: "M3 Max Chip, 32GB RAM, 1TB SSD - Ultimate Performance",
      price: 899,
      discount: 25,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
      badge: "Trending",
      gradient: "from-blue-600 via-indigo-700 to-purple-800"
    },
    {
      id: 3,
      title: "Tesla Model 3 Rental",
      description: "Electric Luxury Sedan - Zero Emissions, Maximum Style",
      price: 599,
      discount: 20,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
      badge: "Premium",
      gradient: "from-emerald-600 via-teal-700 to-cyan-800"
    },
    {
      id: 4,
      title: "Gaming Console PS5",
      description: "PlayStation 5 with Controllers & Top Games Bundle",
      price: 199,
      discount: 35,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop",
      badge: "Best Offer",
      gradient: "from-violet-600 via-purple-700 to-fuchsia-800"
    }
  ];

  // Auto-rotate banner every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const featuredProduct = featuredProducts[currentIndex];

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className={`overflow-hidden rounded-2xl bg-gradient-to-br ${featuredProduct.gradient} shadow-xl transition-all duration-500`}
    >
      {/* Mobile View */}
      <div className="md:hidden relative h-32 flex items-center animate-fade-in">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3 px-4 w-full">
          {/* Image */}
          <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20">
            <img 
              src={featuredProduct.image}
              alt={featuredProduct.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="text-yellow-300" size={14} />
              <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wide">
                {featuredProduct.badge}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm mb-0.5 line-clamp-1">
              {featuredProduct.title}
            </h3>
            <p className="text-blue-100 text-xs mb-1.5 line-clamp-1">
              {featuredProduct.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-lg">
                ${featuredProduct.price}
              </span>
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {featuredProduct.discount}% OFF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Horizontal Banner */}
      <div className="hidden md:block relative h-64 lg:h-72 animate-fade-in">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 h-full flex items-center px-8 lg:px-12">
          <div className="flex items-center justify-between w-full gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 space-y-4 lg:space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full shadow-lg">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-sm font-black uppercase tracking-wide">
                    {featuredProduct.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Star className="text-yellow-300" size={14} fill="currentColor" />
                  <span className="text-white text-xs font-bold">4.9</span>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h2 className="text-white font-black text-3xl lg:text-4xl xl:text-5xl mb-3 leading-tight">
                  {featuredProduct.title}
                </h2>
                <p className="text-white/90 text-base lg:text-lg max-w-xl leading-relaxed">
                  {featuredProduct.description}
                </p>
              </div>

              {/* Price */}
              <div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 inline-block">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-black text-4xl lg:text-5xl">
                      ${featuredProduct.price}
                    </span>
                    <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-lg">
                      {featuredProduct.discount}% OFF
                    </span>
                  </div>
                  <span className="text-white/70 text-sm">/month</span>
                </div>
              </div>
            </div>

            {/* Right - Product Image */}
            <div className="flex-shrink-0 w-72 lg:w-80 xl:w-96">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl"></div>
                
                {/* Image Container */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white/30 shadow-2xl transition-transform duration-500">
                  <img 
                    src={featuredProduct.image}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-xl animate-bounce">
                  <Sparkles className="text-yellow-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-8 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;

