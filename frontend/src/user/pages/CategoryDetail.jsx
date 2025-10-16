import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useCategories } from '../../contexts/CategoryContext';
import { useState, useEffect } from 'react';
import apiService from '../../services/api';


const CategoryDetail = () => {
  const { categorySlug } = useParams();
  const { categories, setSelectedCategory } = useApp();
  const { getCategoryBySlug } = useCategories();
  const navigate = useNavigate();

  // State for products and loading
  const [allProducts, setAllProducts] = useState([]); // Store all products (for sidebar)
  const [backendCategories, setBackendCategories] = useState([]); // Store categories from backend
  const [subcategories, setSubcategories] = useState([]); // Store subcategories for selected main category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for filtering

  const currentCategory = getCategoryBySlug(categorySlug) || categories[0];

  // Fetch products for the current category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both products and categories from backend
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getPublicProducts(1, 100, ''), // Get all products
          apiService.getPublicCategories(1, 100, '') // Get all categories
        ]);
        
        const fetchedProducts = productsResponse.data.products || [];
        const fetchedCategories = categoriesResponse.data.categories || [];
        
        console.log('Fetched products:', fetchedProducts.length);
        console.log('Fetched categories:', fetchedCategories.length);
        console.log('Categories:', fetchedCategories.map(c => ({ 
          id: c._id, 
          name: c.name, 
          product: c.product?.name,
          productId: c.product?._id,
          images: c.images?.length || 0,
          imageUrl: c.images?.[0]?.url
        })));
        console.log('All products:', fetchedProducts.map(p => ({ id: p._id, name: p.name })));
        
             // Store all data
             setAllProducts(fetchedProducts);
             setBackendCategories(fetchedCategories);
        
        // Set initial selected product based on URL parameter
        if (categorySlug && fetchedProducts.length > 0) {
          const initialProduct = fetchedProducts.find(product => 
            product.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
          );
          if (initialProduct) {
            setSelectedProduct(initialProduct);
            // Find subcategories for this product
            const productSubcategories = fetchedCategories.filter(category => 
              category.product && category.product._id === initialProduct._id
            );
            setSubcategories(productSubcategories);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);





  // Function to show subcategories for selected product
  const filterProductsByCategory = (product) => {
    if (!product || !product.name) {
      // If no product selected, clear subcategories
      setSelectedProduct(null);
      setSubcategories([]);
      return;
    }

    // Find all categories (subcategories) that belong to this product
    const productSubcategories = backendCategories.filter(category => {
      if (!category.product) return false;
      
      // Check if this category's product matches the selected product
      return category.product._id === product._id;
    });

    console.log('Product selected:', product.name);
    console.log('Product ID:', product._id);
    console.log('Subcategories found:', productSubcategories.map(c => ({ 
      name: c.name, 
      productId: c.product?._id,
      productName: c.product?.name 
    })));
    
    setSubcategories(productSubcategories);
    setSelectedProduct(product);
  };

  // Function to handle sidebar product click
  const handleSidebarProductClick = (product) => {
    filterProductsByCategory(product);
  };

  // Show loading if category is not found and categories are still loading
  if (!currentCategory && categories.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Show error if category is not found
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition mr-3"
          >
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-x-hidden">
        {/* Sidebar - Products List */}
        <div className="w-20 md:w-24 bg-[#f0f4f7] border-r border-gray-200 overflow-y-auto flex-shrink-0">
          {loading ? (
            // Loading skeleton for products
            <div className="space-y-2 p-2">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-2 text-center">
              <div className="text-[8px] text-red-500">Error loading products</div>
            </div>
          ) : allProducts.length === 0 ? (
            <div className="p-2 text-center">
              <div className="text-[8px] text-gray-500">No products found</div>
            </div>
          ) : (
            // Show main products (main categories) in sidebar
            allProducts.map((product) => {
              const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
              const isSelected = selectedProduct && selectedProduct._id === product._id;
              
              return (
            <button
                  key={product._id}
                  onClick={() => handleSidebarProductClick(product)}
              className={`w-full flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
                    isSelected 
                      ? 'bg-white shadow-sm border-r-2 border-blue-500' 
                  : 'hover:bg-gray-100'
              }`}
            >
                  {primaryImage ? (
                    <img
                      src={primaryImage.url}
                      alt={product.name}
                      className={`w-9 h-9 md:w-10 md:h-10 object-cover rounded-lg ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                    />
                  ) : (
                    <div className={`w-9 h-9 md:w-10 md:h-10 bg-gray-200 rounded-lg flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}>
                      <span className="text-[8px] text-gray-400">📦</span>
                    </div>
                  )}
                  <span className={`text-[7px] md:text-[8px] font-semibold text-center leading-tight px-0.5 line-clamp-2 ${
                    isSelected ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {product.name}
              </span>
            </button>
              );
            })
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-4">
          {/* Banner Ad */}
          <div className="p-3 md:p-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg md:rounded-xl p-4 md:p-6 text-white">
              <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Festival Special!</h2>
              <p className="text-xs md:text-sm mb-3 md:mb-4">Special discounts on all categories</p>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 md:py-2 md:px-6 rounded-lg text-xs md:text-sm transition">
                BOOK NOW
              </button>
            </div>
          </div>

          {/* All Products Section */}
          <div className="px-3 md:px-4 py-3 md:py-4">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                {selectedProduct 
                  ? `${selectedProduct.name} Categories (${subcategories.length})` 
                  : 'Select a Product'
                }
            </h3>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="w-full aspect-[3/2] bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Error loading data: {error}</p>
                <button
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : selectedProduct && subcategories.length > 0 ? (
              // Show subcategories when product is selected
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {subcategories.map((category) => {
                  const product = category.product;
                  if (!product) return null;
                  
                  const primaryImage = category.images?.find(img => img.isPrimary) || category.images?.[0];
                  
                  // Debug image data
                  console.log(`Category: ${category.name}`, {
                    hasImages: !!category.images,
                    imagesLength: category.images?.length || 0,
                    primaryImage: primaryImage,
                    imageUrl: primaryImage?.url,
                    allImages: category.images
                  });
                  
                  // Test image URL accessibility
                  if (primaryImage && primaryImage.url) {
                    fetch(primaryImage.url, { method: 'HEAD' })
                      .then(response => {
                        console.log(`🔍 Image URL test for ${category.name}:`, {
                          url: primaryImage.url,
                          status: response.status,
                          ok: response.ok
                        });
                      })
                      .catch(error => {
                        console.error(`🚫 Image URL test failed for ${category.name}:`, error);
                      });
                  }
                  
                  return (
              <button
                      key={category._id}
                      onClick={() => navigate(`/item/${product._id}`)}
                      className="group flex flex-col bg-white hover:bg-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 overflow-hidden transform hover:-translate-y-1"
                    >
                        {/* Category Image */}
                        <div className="w-full aspect-[3/2] overflow-hidden rounded-t-xl relative">
                          {primaryImage && primaryImage.url ? (
                            <img
                              src={primaryImage.url}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onLoad={() => {
                                console.log(`✅ Image loaded successfully: ${category.name} - ${primaryImage.url}`);
                              }}
                              onError={(e) => {
                                console.error(`❌ Image failed to load: ${category.name} - ${primaryImage.url}`);
                                e.target.style.display = 'none';
                                // Show fallback
                                const fallback = e.target.parentElement.querySelector('.image-fallback');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback for no image or error */}
                          <div 
                            className="image-fallback w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center absolute inset-0"
                            style={{ display: primaryImage && primaryImage.url ? 'none' : 'flex' }}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">📦</div>
                              <span className="text-gray-600 text-sm font-medium">{category.name}</span>
                            </div>
                          </div>
                        </div>

                      {/* Category Info */}
                      <div className="p-2 text-center">
                        <h4 className="font-medium text-xs text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          {category.name}
                        </h4>
                    </div>
                </button>
                  );
                })}
              </div>
            ) : selectedProduct && subcategories.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No categories found</h3>
                <p className="text-gray-500">No categories available for {selectedProduct.name} yet.</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Product</h3>
                <p className="text-gray-500">Choose a product from the sidebar to view its categories.</p>
            </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;


