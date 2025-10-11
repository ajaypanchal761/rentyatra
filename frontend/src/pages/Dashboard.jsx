import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, MessageCircle, User, Edit, Trash2, Calendar, Zap, CreditCard, Rocket, LogOut, MapPin, Eye, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ImageCarousel from '../components/common/ImageCarousel';
import BoostModal from '../components/boost/BoostModal';
import { useSubscription } from '../contexts/SubscriptionContext';

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items, favorites, deleteItem, bookings, cancelBooking } = useApp();
  const { isProductBoosted } = useSubscription();
  const [activeTab, setActiveTab] = useState('my-ads');
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your dashboard</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </Card>
      </div>
    );
  }

  const myAds = items.filter((item) => item.owner.name === user.name);
  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  const menuItems = [
    { id: 'my-ads', label: 'My Rentals', icon: Package, count: myAds.length },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, count: bookings.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favoriteItems.length },
    { id: 'messages', label: 'Messages', icon: MessageCircle, count: 0 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleDeleteAd = (itemId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      deleteItem(itemId);
    }
  };

  const handleBoostProduct = (item) => {
    setSelectedProduct(item);
    setBoostModalOpen(true);
  };

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        <div className="p-6">
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
              </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
                  return (
                    <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === item.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 transition-all group"
            >
              <Home size={20} className="text-green-600" />
              <span className="font-semibold">Home</span>
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-all group"
            >
              <CreditCard size={20} className="text-blue-600" />
              <span className="font-semibold">Pricing Plans</span>
            </button>
            <button
              onClick={() => navigate('/my-boosts')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-all group"
            >
              <Rocket size={20} className="text-orange-600" />
              <span className="font-semibold">Boost Plans</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all group"
            >
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <X size={20} />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                      </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          activeTab === item.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => { navigate('/'); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 transition-all"
                >
                  <Home size={20} className="text-green-600" />
                  <span className="font-semibold">Home</span>
                </button>
                <button
                  onClick={() => { navigate('/subscription'); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-all"
                >
                  <CreditCard size={20} className="text-blue-600" />
                  <span className="font-semibold">Pricing Plans</span>
                </button>
                <button
                  onClick={() => { navigate('/my-boosts'); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-all"
                >
                  <Rocket size={20} className="text-orange-600" />
                  <span className="font-semibold">Boost Plans</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </aside>
          </div>
      )}

          {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-black text-gray-900">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account and listings</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
            {activeTab === 'my-ads' && (
            <div className="space-y-4">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{myAds.length} rental{myAds.length !== 1 ? 's' : ''}</p>
                <Button
                  onClick={() => navigate('/post-ad')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  + Add Rental
                  </Button>
                </div>

                {myAds.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No rentals yet</h3>
                  <p className="text-gray-600 text-sm mb-6">Start listing your items to earn money</p>
                  <Button
                    onClick={() => navigate('/post-ad')}
                    className="bg-blue-600"
                  >
                    Post Your First Rental
                  </Button>
                </div>
              ) : (
                /* Rental List */
                <div className="space-y-3">
                    {myAds.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4">
                          {/* Image */}
                        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                          {isProductBoosted(item.id) && (
                            <div className="absolute top-1 right-1 z-10">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                                <Zap size={10} fill="currentColor" />
                                Boost
                              </div>
                            </div>
                          )}
                          <ImageCarousel 
                            images={item.images} 
                            video={item.video}
                            className="w-full h-full"
                          />
                        </div>

                        {/* Details */}
                          <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-blue-50 rounded-lg px-3 py-1">
                              <p className="text-blue-600 font-bold text-lg">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Eye size={14} className="text-gray-400" />
                                <span>1.2K</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart size={14} className="text-gray-400" />
                                <span>89</span>
                              </div>
                          </div>
                        </div>
                        
                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBoostProduct(item);
                              }}
                              className="text-xs bg-orange-500 text-white hover:bg-orange-600"
                            >
                              <Zap size={14} className="mr-1" />
                              Boost
                            </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAd(item.id);
                            }}
                              className="text-xs"
                          >
                              <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

                {bookings.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-purple-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 text-sm mb-6">Browse items and make your first booking</p>
                  <Button onClick={() => navigate('/')} className="bg-purple-600">
                    Browse Rentals
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex gap-4">
                        <img
                          src={booking.item.images[0]}
                          alt={booking.item.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{booking.item.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {booking.startDate} - {booking.endDate}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                                  </span>
                              <Button
                                size="sm"
                                variant="danger"
                              onClick={() => cancelBooking(booking.id)}
                              className="text-xs ml-auto"
                            >
                              Cancel
                              </Button>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{favoriteItems.length} favorite{favoriteItems.length !== 1 ? 's' : ''}</p>

                {favoriteItems.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-rose-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600 text-sm mb-6">Save items you love</p>
                  <Button onClick={() => navigate('/')} className="bg-rose-600">
                    Explore Items
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/item/${item.id}`)}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="h-40 bg-gray-100">
                        <ImageCarousel 
                          images={item.images} 
                          video={item.video}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-lg font-bold text-blue-600 mb-2">₹{item.price.toLocaleString()}<span className="text-xs text-gray-500 font-normal">/month</span></p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600 text-sm">Your conversations will appear here</p>
            </div>
          )}

            {activeTab === 'profile' && (
            <div className="max-w-2xl">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-2xl font-black border-2 border-white/40">
                      {user.name.charAt(0)}
                  </div>
                  <div>
                      <h3 className="text-xl font-black">{user.name}</h3>
                      <p className="text-blue-100 text-sm">Member since 2024</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <p className="text-gray-900 font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                    <p className="text-gray-900 font-semibold">{user.phone || '+91 98765 43210'}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Button className="w-full bg-blue-600 flex items-center justify-center gap-2">
                      <Edit size={18} />
                      Edit Profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="danger"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </Button>
          </div>
        </div>
      </div>
            </div>
          )}
        </div>
      </main>

      {/* Boost Modal */}
      {boostModalOpen && (
        <BoostModal
          isOpen={boostModalOpen}
          onClose={() => {
            setBoostModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Dashboard;
