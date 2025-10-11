import * as Icons from '../icons/AdminIcons';

function ViewProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Product Details</h3>
                <p className="text-sm text-blue-100 mt-1">{product.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Icons.CloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Images Gallery */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-slate-200"
                  />
                ))}
              </div>
            </div>

            {/* Title and Badges */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                    {product.featured && (
                      <span className="px-3 py-1 text-sm font-semibold bg-purple-100 text-purple-800 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    {product.boosted && (
                      <span className="px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-800 rounded-full">
                        ⚡ Boosted
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600">${product.price}</p>
                  <p className="text-sm text-slate-500">{product.priceType}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Product Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Category:</span>
                    <span className="text-sm text-slate-900 font-medium">{product.category}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Condition:</span>
                    <span className="text-sm text-slate-900 font-medium">{product.condition}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Location:</span>
                    <span className="text-sm text-slate-900 font-medium">{product.location}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Created Date:</span>
                    <span className="text-sm text-slate-900 font-medium">{product.createdDate}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Last Updated:</span>
                    <span className="text-sm text-slate-900 font-medium">{product.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Owner Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Name:</span>
                    <span className="text-sm text-slate-900 font-medium">{product.owner}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">User ID:</span>
                    <span className="text-sm text-slate-900 font-mono">{product.ownerId}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-slate-500 w-32">Email:</span>
                    <span className="text-sm text-slate-900">{product.ownerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Performance Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-blue-900">{product.views.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-600 mb-1">Favorites</p>
                  <p className="text-2xl font-bold text-red-900">{product.favorites.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600 mb-1">Bookings</p>
                  <p className="text-2xl font-bold text-green-900">{product.bookings.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-600 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-purple-900">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Rejection Reason (if rejected) */}
            {product.status === 'Rejected' && product.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Rejection Reason</h3>
                <p className="text-sm text-red-700">{product.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-end border-t border-slate-200 sticky bottom-0">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProductModal;


