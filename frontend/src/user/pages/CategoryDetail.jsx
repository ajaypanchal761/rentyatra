import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // State for products and loading
  const [allProducts, setAllProducts] = useState([]); // Store all products (for sidebar)
  const [backendCategories, setBackendCategories] = useState([]); // Store categories from backend
  const [subcategories, setSubcategories] = useState([]); // Store subcategories for selected main category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for filtering

  const currentCategory = getCategoryBySlug(categorySlug) || categories[0];

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      
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
        
        // Set initial selected product based on URL parameter or query parameter
        if (fetchedProducts.length > 0) {
          let initialProduct = null;
          
          // Check for productId query parameter first
          const urlParams = new URLSearchParams(location.search);
          const productId = urlParams.get('productId');
          
          console.log('URL params:', { productId, categorySlug, location: location.search });
          console.log('Available products:', fetchedProducts.map(p => ({ id: p._id, name: p.name })));
          
          if (productId) {
            // Find product by ID from query parameter
            initialProduct = fetchedProducts.find(product => product._id === productId);
            console.log('Found product by ID:', initialProduct);
          } else if (categorySlug) {
            // Fallback to categorySlug parameter
            initialProduct = fetchedProducts.find(product => 
              product.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
            );
            console.log('Found product by slug:', initialProduct);
          }
          
          if (initialProduct) {
            setSelectedProduct(initialProduct);
            // Find subcategories for this product
            const productSubcategories = fetchedCategories.filter(category => 
              category.product && category.product._id === initialProduct._id
            );
            console.log('Product subcategories:', productSubcategories);
            setSubcategories(productSubcategories);
          } else {
            console.log('No initial product found, showing all categories');
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
  }, [categorySlug, location.search]);





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

  // Show loading if data is still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products and categories...</p>
        </div>
      </div>
    );
  }

  // Show error if there's an error loading data
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Error loading data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
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
        <div className="w-20 md:w-24 bg-blue-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 py-2">
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
              className={`w-full flex flex-col items-center gap-1 py-3 px-1 mx-1 my-1 transition-all duration-200 ${
                    isSelected 
                      ? 'bg-white shadow-md rounded-lg border-r-2 border-blue-500' 
                  : 'hover:bg-white hover:shadow-sm rounded-lg'
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
                  : `All Categories (${backendCategories.length})`
                }
            </h3>
            </div>
            
            {(() => {
              console.log('Rendering main content:', { 
                loading, 
                error, 
                selectedProduct: selectedProduct?.name, 
                subcategoriesLength: subcategories.length,
                backendCategoriesLength: backendCategories.length,
                allProductsLength: allProducts.length
              });
              
              if (loading) {
                return (
                  <div className="grid grid-cols-4 gap-3 md:gap-4">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="w-full aspect-[3/2] bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                );
              }
              
              if (error) {
                return (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">Error loading data: {error}</p>
                    <button
                      onClick={() => window.location.reload()} 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                );
              }
              
              if (selectedProduct && subcategories.length > 0) {
                // Show subcategories when product is selected - Circular Design
                return (
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {subcategories.map((category) => {
                      const product = category.product;
                      if (!product) return null;
                      
                      const primaryImage = category.images?.find(img => img.isPrimary) || category.images?.[0];
                      
                      return (
                        <button
                          key={category._id}
                          onClick={() => navigate(`/item/${product._id}`)}
                          className="group flex flex-col items-center transition-all duration-300 active:scale-95"
                        >
                          {/* Circular Category Icon */}
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-all duration-300">
                            {primaryImage && primaryImage.url ? (
                              <img
                                src={primaryImage.url}
                                alt={category.name}
                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallback = e.target.parentElement.querySelector('.image-fallback');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            
                            {/* Fallback for no image or error */}
                            <div 
                              className="image-fallback w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
                              style={{ display: primaryImage && primaryImage.url ? 'none' : 'flex' }}
                            >
                              <div className="text-center">
                                <div className="text-lg md:text-xl">📦</div>
                              </div>
                            </div>
                          </div>

                          {/* Category Name */}
                          <div className="mt-2 text-center">
                            <h4 className="font-medium text-xs md:text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                              {category.name}
                            </h4>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              }
              
              if (selectedProduct && subcategories.length === 0) {
                return (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📂</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No categories found</h3>
                    <p className="text-gray-500">No categories available for {selectedProduct.name} yet.</p>
                  </div>
                );
              }
              
              // Show all categories when no product is selected - Circular Design
              return (
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  {backendCategories.map((category) => {
                    const primaryImage = category.images?.find(img => img.isPrimary) || category.images?.[0];
                    
                    return (
                      <button
                        key={category._id}
                        onClick={() => {
                          // Find the product associated with this category
                          const associatedProduct = allProducts.find(p => p._id === category.product);
                          if (associatedProduct) {
                            handleSidebarProductClick(associatedProduct);
                          }
                        }}
                        className="group flex flex-col items-center transition-all duration-300 active:scale-95"
                      >
                        {/* Circular Category Icon */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-all duration-300">
                          {primaryImage && primaryImage.url ? (
                            <img
                              src={primaryImage.url}
                              alt={category.name}
                              className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement.querySelector('.image-fallback');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback for no image or error */}
                          <div 
                            className="image-fallback w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
                            style={{ display: primaryImage && primaryImage.url ? 'none' : 'flex' }}
                          >
                            <div className="text-center">
                              <div className="text-lg md:text-xl">📦</div>
                            </div>
                          </div>
                        </div>

                        {/* Category Name */}
                        <div className="mt-2 text-center">
                          <h4 className="font-medium text-xs md:text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                            {category.name}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;


