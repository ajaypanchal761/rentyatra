import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useCategories } from '../../contexts/CategoryContext';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';
import apiService from '../../services/api';

const CategoryGrid = () => {
  const { setSelectedCategory } = useApp();
  const { categories, fetchCategoriesByProduct, loading: categoriesLoading } = useCategories();
  const navigate = useNavigate();
  
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getFeaturedProducts(12); // Get 12 products for 6x2 grid
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = async (product) => {
    try {
      // Navigate to category page with product ID as query parameter
      // This will allow the category page to automatically select this product
      navigate(`/category?productId=${product._id}`);
    } catch (error) {
      console.error('Error navigating to product:', error);
      // Fallback to product detail page
      navigate(`/item/${product._id}`);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    // Use category slug for navigation
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };

  const handleSeeAll = () => {
    // Navigate to the first available category or a general products page
    if (categories && categories.length > 0) {
      const firstCategory = categories[0];
      setSelectedCategory(firstCategory.id);
      navigate(`/category/${firstCategory.slug}`);
    } else {
      // Fallback to listings if no categories available
      setSelectedCategory(null);
      navigate('/listings');
    }
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

        {/* Desktop Products - 6x2 Grid */}
        <div className="hidden md:block">
          {/* Header with View All Button */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Featured Products</h2>
            <button
              onClick={handleSeeAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="text-sm font-semibold">View All</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-6 gap-3 lg:gap-4">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-3 lg:gap-4">
              {products.slice(0, 12).map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                return (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-1 max-w-[120px] mx-auto"
                  >
                    {/* Hover gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    
                    <div className="relative w-full">
                      {/* Image Container - Larger for 6x2 grid */}
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-200 border border-gray-100 group-hover:border-blue-200 p-2">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={product.name}
                            className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Name */}
                      <div className="text-center px-1">
                        <h3 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 line-clamp-2 tracking-tight transition-colors duration-200">
                          {product.name}
                        </h3>
                      </div>

                      {/* Subtle indicator badge */}
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Grid - 6x2 Grid with horizontal scroll */}
        <div className="md:hidden overflow-x-auto hide-scrollbar">
          {loading ? (
            <div 
              className="grid grid-rows-2 auto-cols-max gap-x-2 gap-y-2 pb-2" 
              style={{ 
                gridAutoFlow: 'column',
                width: 'max-content'
              }}
            >
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse" style={{ width: '70px' }}>
                  <div className="w-full h-[65px] bg-gray-200 rounded-lg mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
              {/* See All Card Skeleton */}
              <div className="animate-pulse" style={{ width: '70px', gridRow: 'span 2' }}>
                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500 text-sm mb-2">Error loading products</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <div 
              className="grid grid-rows-2 auto-cols-max gap-x-2 gap-y-2 pb-2" 
              style={{ 
                gridAutoFlow: 'column',
                width: 'max-content'
              }}
            >
              {products.slice(0, 12).map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                return (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    className="flex flex-col items-center active:scale-95 transition-all"
                    style={{ width: '70px' }}
                  >
                    {/* Image Container with Shadow and Background */}
                    <div 
                      className="w-full rounded-lg overflow-hidden bg-gray-100 mb-1 flex items-center justify-center"
                      style={{ 
                        height: '65px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-[8px]">No Image</span>
                        </div>
                      )}
                    </div>
                    {/* Text Container */}
                    <div className="w-full px-0.5 text-center">
                      <span className="text-[8px] font-bold text-gray-800 leading-snug line-clamp-2 block tracking-tight">
                        {product.name}
                      </span>
                    </div>
                  </button>
                );
              })}
              
              {/* See All Card - slides with the grid */}
              <button
                onClick={handleSeeAll}
                className="flex flex-col items-center justify-center active:scale-95 transition-all"
                style={{ width: '70px', gridRow: 'span 2' }}
              >
                <div 
                  className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center gap-1.5"
                  style={{ 
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <ChevronRight size={20} className="text-blue-600" strokeWidth={2.5} />
                  <span className="text-[8px] font-bold text-blue-600">
                    See All
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
