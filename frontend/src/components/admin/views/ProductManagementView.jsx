import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import { MOCK_PRODUCTS } from '../../../utils/adminMockData';
import ViewProductModal from '../modals/ViewProductModal';
import EditProductModal from '../modals/EditProductModal';
import ApproveRejectModal from '../modals/ApproveRejectModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

function ProductManagementView() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  
  // Modal states
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [approvingProduct, setApprovingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesFeatured = featuredFilter === 'All' || 
                           (featuredFilter === 'Featured' && product.featured) ||
                           (featuredFilter === 'Not Featured' && !product.featured);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesFeatured;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const statuses = ['All', 'Active', 'Pending', 'Inactive', 'Rejected'];

  // Handle checkbox selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Actions
  const handleToggleFeatured = (productId) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, featured: !p.featured } : p
    ));
    setOpenActionMenu(null);
  };

  const handleToggleStatus = (productId) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' }
        : p
    ));
    setOpenActionMenu(null);
  };

  const handleApproveProduct = (product, message) => {
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, status: 'Active' } : p
    ));
  };

  const handleRejectProduct = (product, reason) => {
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, status: 'Rejected', rejectionReason: reason } : p
    ));
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };

  const handleBulkFeatured = () => {
    setProducts(products.map(p => 
      selectedProducts.includes(p.id) ? { ...p, featured: true } : p
    ));
    setSelectedProducts([]);
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-slate-800">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icons.ProductsIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-slate-800">
                {products.filter(p => p.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icons.ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Featured Products</p>
              <p className="text-2xl font-bold text-slate-800">
                {products.filter(p => p.featured).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icons.StarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800">
                ${products.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icons.RevenueIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Icons.SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, ID, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="All">All Products</option>
              <option value="Featured">Featured</option>
              <option value="Not Featured">Not Featured</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-200">
            <span className="text-sm font-medium text-slate-700">
              {selectedProducts.length} selected
            </span>
            <button
              onClick={handleBulkFeatured}
              className="px-4 py-2 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Mark as Featured
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 bg-slate-100 rounded border-slate-300 focus:ring-indigo-500"
                    checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Owner</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Stats</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="w-4 p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 bg-slate-100 rounded border-slate-300 focus:ring-indigo-500"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </td>
                  
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{product.title}</p>
                          {product.featured && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                              ⭐ Featured
                            </span>
                          )}
                          {product.boosted && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                              ⚡ Boosted
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                      {product.category}
                    </span>
                  </td>
                  
                  {/* Owner */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{product.owner}</p>
                      <p className="text-xs text-slate-500">{product.ownerEmail}</p>
                    </div>
                  </td>
                  
                  {/* Price */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">${product.price}</p>
                      <p className="text-xs text-slate-500">{product.priceType}</p>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : product.status === 'Inactive'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  
                  {/* Stats */}
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="text-slate-600">👁️ {product.views.toLocaleString()} views</p>
                      <p className="text-slate-600">❤️ {product.favorites} favorites</p>
                      <p className="text-slate-600">📅 {product.bookings} bookings</p>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenu(openActionMenu === product.id ? null : product.id)}
                        onBlur={() => setTimeout(() => { if (openActionMenu === product.id) setOpenActionMenu(null); }, 150)}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-500"
                      >
                        <Icons.MoreVertIcon className="h-5 w-5" />
                      </button>
                      
                      {openActionMenu === product.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenActionMenu(null)}
                          ></div>
                          
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-2 border border-slate-200">
                            <button
                              onClick={() => { setViewingProduct(product); setOpenActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                            >
                              <Icons.EyeIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-slate-700">View Details</span>
                            </button>
                            
                            <button
                              onClick={() => { setEditingProduct(product); setOpenActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                            >
                              <Icons.EditIcon className="h-4 w-4 text-green-600" />
                              <span className="text-slate-700">Edit Product</span>
                            </button>
                            
                            {product.status === 'Pending' && (
                              <button
                                onClick={() => { setApprovingProduct(product); setOpenActionMenu(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                              >
                                <Icons.CheckIcon className="h-4 w-4 text-green-600" />
                                <span className="text-green-700">Approve/Reject</span>
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleToggleFeatured(product.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                            >
                              <Icons.StarIcon className="h-4 w-4 text-purple-600" />
                              <span className="text-slate-700">
                                {product.featured ? 'Remove Featured' : 'Mark Featured'}
                              </span>
                            </button>
                            
                            <button
                              onClick={() => handleToggleStatus(product.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                            >
                              {product.status === 'Active' ? (
                                <>
                                  <Icons.BlockIcon className="h-4 w-4 text-orange-600" />
                                  <span className="text-orange-700">Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <Icons.CheckIcon className="h-4 w-4 text-green-600" />
                                  <span className="text-green-700">Activate</span>
                                </>
                              )}
                            </button>
                            
                            <div className="border-t border-slate-100 my-1"></div>
                            
                            <button
                              onClick={() => { setDeletingProduct(product); setOpenActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Icons.TrashIcon className="h-4 w-4" />
                              <span>Delete Product</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-700">
              of {filteredProducts.length} products
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewingProduct && (
        <ViewProductModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}

      {approvingProduct && (
        <ApproveRejectModal
          product={approvingProduct}
          onClose={() => setApprovingProduct(null)}
          onApprove={handleApproveProduct}
          onReject={handleRejectProduct}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deletingProduct.title}"? This action cannot be undone.`}
          onClose={() => setDeletingProduct(null)}
          onConfirm={() => {
            handleDeleteProduct(deletingProduct.id);
            setDeletingProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default ProductManagementView;
