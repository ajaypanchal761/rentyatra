import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import CreateBannerModal from '../modals/CreateBannerModal';
import EditBannerModal from '../modals/EditBannerModal';

function AdBannerManagementView() {
  const [banners, setBanners] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [openActionMenu, setOpenActionMenu] = useState(null);

  const handleSaveBanner = (newBanner) => {
    setBanners([newBanner, ...banners].sort((a, b) => a.order - b.order));
  };

  const handleUpdateBanner = (updatedBanner) => {
    setBanners(banners.map(b => 
      b.id === updatedBanner.id ? updatedBanner : b
    ).sort((a, b) => a.order - b.order));
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(b => b.id !== bannerId));
    }
  };

  const handleToggleStatus = (bannerId) => {
    setBanners(banners.map(b => 
      b.id === bannerId 
        ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' }
        : b
    ));
    setOpenActionMenu(null);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Ad Banner Management</h2>
            <p className="text-sm text-slate-500 mt-1">Create and manage promotional banners</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Icons.BannerIcon className="h-5 w-5" />
            Create New Banner
          </button>
        </div>
      </div>

      {/* Banners Grid */}
      {banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Banner Image */}
              <div className="relative h-32 bg-slate-100">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    banner.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`h-1.5 w-1.5 mr-1 rounded-full ${
                      banner.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'
                    }`}></span>
                    {banner.status}
                  </span>
                </div>
                {/* Order Badge */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    #{banner.order}
                  </span>
                </div>
                {/* Actions Menu */}
                <div className="absolute bottom-2 right-2">
                  <div className="relative">
                    <button
                      onClick={() => setOpenActionMenu(openActionMenu === banner.id ? null : banner.id)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-slate-50 transition-colors"
                    >
                      <Icons.MoreVertIcon className="h-5 w-5 text-slate-600" />
                    </button>
                    
                    {openActionMenu === banner.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenActionMenu(null)}
                        ></div>
                        
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-20 py-1 border border-slate-200">
                          <button
                            onClick={() => {
                              setEditingBanner(banner);
                              setOpenActionMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 transition-colors"
                          >
                            <Icons.EditIcon className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-slate-700">Edit Banner</span>
                          </button>
                          
                          <button
                            onClick={() => handleToggleStatus(banner.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 transition-colors"
                          >
                            {banner.status === 'Active' ? (
                              <>
                                <Icons.BlockIcon className="h-3.5 w-3.5 text-orange-600" />
                                <span className="text-orange-700">Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Icons.CheckIcon className="h-3.5 w-3.5 text-green-600" />
                                <span className="text-green-700">Activate</span>
                              </>
                            )}
                          </button>
                          
                          <div className="border-t border-slate-100 my-1"></div>
                          
                          <button
                            onClick={() => {
                              handleDeleteBanner(banner.id);
                              setOpenActionMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Icons.TrashIcon className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-3">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-1">{banner.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{banner.description}</p>
                </div>

                {/* Banner Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Impressions</p>
                    <p className="text-sm font-bold text-slate-800">{banner.impressions.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Clicks</p>
                    <p className="text-sm font-bold text-slate-800">{banner.clicks.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">CTR</p>
                    <p className="text-sm font-bold text-slate-800">
                      {banner.impressions > 0 
                        ? ((banner.clicks / banner.impressions) * 100).toFixed(1)
                        : 0
                      }%
                    </p>
                  </div>
                </div>

                {/* Banner Meta Info */}
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{banner.id}</span>
                    <span>{banner.createdDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.BannerIcon className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Banners Yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first promotional banner to engage users and promote offers.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
            >
              <Icons.BannerIcon className="h-5 w-5" />
              Create Your First Banner
            </button>
          </div>
        </div>
      )}

      {/* Create Banner Modal */}
      {isCreateModalOpen && (
        <CreateBannerModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveBanner}
        />
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <EditBannerModal
          banner={editingBanner}
          onClose={() => setEditingBanner(null)}
          onSave={handleUpdateBanner}
        />
      )}
    </div>
  );
}

export default AdBannerManagementView;

