import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, Heart, MessageCircle, User, Edit, Trash2, Calendar, Zap, 
  CreditCard, Rocket, LogOut, MapPin, Eye, Menu, X, Home, 
  Star, History, Briefcase, Globe, Bell, Share2, ThumbsUp, 
  Mail, Info, FileText, Lock, UserX, ChevronRight, Shield, BadgeCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ImageCarousel from '../components/common/ImageCarousel';
import BoostModal from '../components/boost/BoostModal';
import ShareModal from '../components/share/ShareModal';
import { useSubscription } from '../contexts/SubscriptionContext';

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items, favorites, deleteItem, bookings, cancelBooking } = useApp();
  const { isProductBoosted } = useSubscription();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile-menu');
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  // Handle navigation state (e.g., from booking confirmation)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Set default tab based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile && activeTab === 'profile-menu') {
        setActiveTab('my-ads');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [activeTab]);

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

  // Grouped menu items for better organization
  const menuSections = [
    {
      title: '',
      items: [
        { id: 'my-ads', label: 'My Rentals', icon: Package, count: myAds.length, color: 'blue' },
        { id: 'featured-ads', label: 'My Featured Ads', icon: Star, color: 'yellow' },
        { id: 'bookings', label: 'My Bookings', icon: Calendar, count: bookings.length, color: 'green' },
        { id: 'favorites', label: 'Favourites', icon: Heart, count: favoriteItems.length, color: 'red' },
        { id: 'messages', label: 'Messages', icon: MessageCircle, count: 0, color: 'purple' },
      ]
    },
    {
      title: 'Account & Services',
      items: [
        { id: 'subscription', label: 'Subscription', icon: Rocket, color: 'indigo' },
        { id: 'transaction-history', label: 'Transaction History', icon: History, color: 'teal' },
        { id: 'my-reviews', label: 'My Reviews', icon: ThumbsUp, color: 'pink' },
        { id: 'job-applications', label: 'My Job Applications', icon: Briefcase, color: 'orange' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'language', label: 'Language', icon: Globe, color: 'cyan' },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'amber' },
      ]
    },
    {
      title: 'Support & Info',
      items: [
        { id: 'faqs', label: 'FAQs', icon: Info, color: 'lime' },
        { id: 'share-app', label: 'Share the App', icon: Share2, color: 'emerald' },
        { id: 'rate-us', label: 'Rate Us', icon: Star, color: 'yellow' },
        { id: 'contact-us', label: 'Contact Us', icon: Mail, color: 'blue' },
        { id: 'about-us', label: 'About Us', icon: Info, color: 'slate' },
      ]
    },
    {
      title: 'Legal',
      items: [
        { id: 'terms', label: 'Terms & Conditions', icon: FileText, color: 'gray' },
        { id: 'privacy', label: 'Privacy Policy', icon: Lock, color: 'gray' },
      ]
    },
    {
      title: '',
      items: [
        { id: 'delete-account', label: 'Delete Account', icon: UserX, color: 'red' },
        { id: 'logout', label: 'Logout', icon: LogOut, color: 'red' },
      ]
    }
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
    if (tabId === 'logout') {
      handleLogout();
      return;
    }
    if (tabId === 'delete-account') {
      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Handle account deletion
        handleLogout();
      }
      return;
    }
    if (tabId === 'share-app') {
      setShareModalOpen(true);
      setSidebarOpen(false);
      return;
    }
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50',
      yellow: isActive ? 'bg-yellow-600 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      green: isActive ? 'bg-green-600 text-white' : 'text-green-600 hover:bg-green-50',
      red: isActive ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50',
      purple: isActive ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50',
      teal: isActive ? 'bg-teal-600 text-white' : 'text-teal-600 hover:bg-teal-50',
      pink: isActive ? 'bg-pink-600 text-white' : 'text-pink-600 hover:bg-pink-50',
      orange: isActive ? 'bg-orange-600 text-white' : 'text-orange-600 hover:bg-orange-50',
      cyan: isActive ? 'bg-cyan-600 text-white' : 'text-cyan-600 hover:bg-cyan-50',
      amber: isActive ? 'bg-amber-600 text-white' : 'text-amber-600 hover:bg-amber-50',
      lime: isActive ? 'bg-lime-600 text-white' : 'text-lime-600 hover:bg-lime-50',
      emerald: isActive ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-50',
      slate: isActive ? 'bg-slate-600 text-white' : 'text-slate-600 hover:bg-slate-50',
      gray: isActive ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-72 bg-white border-r border-gray-200 min-h-screen sticky top-0 overflow-y-auto">
        <div className="p-4">
          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 mb-4 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                  {user.name.charAt(0)}
                </div>
                {/* Verified badge option */}
                <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <BadgeCheck size={12} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate text-sm">{user.name}</h3>
                <p className="text-xs text-white/80 truncate">{user.email}</p>
              </div>
            </div>
            {/* Get Verified Button */}
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2">
              <Shield size={14} />
              <span>Get Verified Badge</span>
            </button>
          </div>

          {/* Menu Sections */}
          <div className="space-y-4">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    {section.title}
                  </h4>
                )}
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count !== undefined && item.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              isActive ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {item.count}
                            </span>
                          )}
                          <ChevronRight size={14} className={isActive ? 'opacity-100' : 'opacity-0'} />
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Sidebar Content */}
          <aside className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="p-3">
              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="mb-3 p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto block"
              >
                <X size={20} />
              </button>

              {/* User Profile Card - Mobile */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 mb-3 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white/30">
                      {user.name.charAt(0)}
                    </div>
                    <button className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <BadgeCheck size={10} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate text-xs">{user.name}</h3>
                    <p className="text-[10px] text-white/80 truncate">{user.email}</p>
                  </div>
                </div>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1.5">
                  <Shield size={12} />
                  <span>Get Verified Badge</span>
                </button>
              </div>

              {/* Menu Sections - Mobile */}
              <div className="space-y-3">
                {menuSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    {section.title && (
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
                        {section.title}
                      </h4>
                    )}
                    <nav className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all text-xs ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={16} />
                              <span className="font-semibold">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {item.count !== undefined && item.count > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isActive ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {item.count}
                                </span>
                              )}
                              <ChevronRight size={12} className={isActive ? 'opacity-100' : 'opacity-0'} />
                            </div>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {activeTab === 'profile-menu' 
              ? 'Account' 
              : menuSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Dashboard'
            }
          </h1>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home size={22} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* My Rentals Tab */}
          {activeTab === 'my-ads' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Rentals</h2>
                  <p className="text-sm text-gray-600">Manage your rental listings</p>
                </div>
                <Button onClick={() => navigate('/post-ad')} className="text-sm md:text-base py-2 md:py-3">
                  <Package size={18} className="mr-2" />
                  Add New
                </Button>
              </div>

              {myAds.length === 0 ? (
                <Card className="p-8 md:p-12 text-center">
                  <Package size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">No rentals yet</h3>
                  <p className="text-sm text-gray-600 mb-6">Start listing your items for rent</p>
                  <Button onClick={() => navigate('/post-ad')}>Create Your First Rental</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myAds.map((item) => {
                    const isBoosted = isProductBoosted(item.id);
                    return (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {isBoosted && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                            <Zap size={14} className="fill-current" />
                            BOOSTED
                          </div>
                        )}
                        <div className="relative">
                          <ImageCarousel images={item.images} />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-sm md:text-base">{item.title}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg md:text-xl font-bold text-blue-600">₹{item.price}/mo</span>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Eye size={14} />
                              <span className="text-xs">123 views</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1 text-xs md:text-sm py-2"
                              onClick={() => navigate(`/item/${item.id}`)}
                            >
                              <Eye size={14} className="mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-xs md:text-sm py-2"
                              onClick={() => handleBoostProduct(item)}
                            >
                              <Rocket size={14} className="mr-1" />
                              Boost
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50 text-xs md:text-sm py-2 px-3"
                              onClick={() => handleDeleteAd(item.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Bookings</h2>
                <p className="text-sm text-gray-600">View and manage your bookings</p>
              </div>

              {bookings.length === 0 ? (
                <Card className="p-8 md:p-12 text-center">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">No bookings yet</h3>
                  <p className="text-sm text-gray-600 mb-6">Browse items to make your first booking</p>
                  <Button onClick={() => navigate('/')}>Browse Items</Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    // Safety check for booking.item
                    if (!booking.item) return null;
                    
                    return (
                      <Card key={booking.id} className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img 
                            src={booking.item.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={booking.item.title || 'Product'}
                            className="w-full md:w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{booking.item.title || 'Untitled Product'}</h3>
                            <div className="space-y-1 text-xs md:text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin size={14} />
                                {booking.item.location || 'Location not specified'}
                              </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-base md:text-lg font-bold text-blue-600">₹{booking.totalPrice}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 text-xs md:text-sm"
                                onClick={() => cancelBooking(booking.id)}
                              >
                                Cancel Booking
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Favourites</h2>
                <p className="text-sm text-gray-600">Items you've saved</p>
              </div>

              {favoriteItems.length === 0 ? (
                <Card className="p-8 md:p-12 text-center">
                  <Heart size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">No favorites yet</h3>
                  <p className="text-sm text-gray-600 mb-6">Start adding items to your favorites</p>
                  <Button onClick={() => navigate('/')}>Browse Items</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/item/${item.id}`)}>
                      <div className="relative">
                        <ImageCarousel images={item.images} />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-sm md:text-base">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg md:text-xl font-bold text-blue-600">₹{item.price}/mo</span>
                          <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <MapPin size={12} />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Menu - Mobile View */}
          {activeTab === 'profile-menu' && (
            <div className="md:hidden">
              {/* User Profile Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 mb-4 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                      {user.name.charAt(0)}
                    </div>
                    {/* Verified badge option */}
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <BadgeCheck size={14} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate text-base">{user.name}</h3>
                    <p className="text-xs text-white/80 truncate">{user.email}</p>
                  </div>
                </div>
                {/* Get Verified Button */}
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2.5 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  <Shield size={16} />
                  <span>Get Verified Badge</span>
                </button>
              </div>

              {/* Menu Sections */}
              <div className="space-y-4">
                {menuSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    {section.title && (
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">
                        {section.title}
                      </h4>
                    )}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      {section.items.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 transition-all hover:bg-gray-50 ${
                              index !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                item.color === 'red' ? 'bg-red-50 text-red-600' :
                                item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                item.color === 'green' ? 'bg-green-50 text-green-600' :
                                item.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                                item.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                                item.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                                item.color === 'pink' ? 'bg-pink-50 text-pink-600' :
                                item.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                item.color === 'teal' ? 'bg-teal-50 text-teal-600' :
                                item.color === 'cyan' ? 'bg-cyan-50 text-cyan-600' :
                                item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                item.color === 'lime' ? 'bg-lime-50 text-lime-600' :
                                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                item.color === 'slate' ? 'bg-slate-50 text-slate-600' :
                                'bg-gray-50 text-gray-600'
                              }`}>
                                <Icon size={18} />
                              </div>
                              <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.count !== undefined && item.count > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                                  {item.count}
                                </span>
                              )}
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Tabs - Placeholder */}
          {!['my-ads', 'bookings', 'favorites', 'profile-menu'].includes(activeTab) && (
            <Card className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {menuSections.flatMap(s => s.items).find(i => i.id === activeTab)?.icon && 
                  (() => {
                    const Icon = menuSections.flatMap(s => s.items).find(i => i.id === activeTab)?.icon;
                    return <Icon size={32} className="text-gray-400" />;
                  })()
                }
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                {menuSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-gray-600">This feature is coming soon!</p>
            </Card>
          )}
        </div>
      </main>

      {/* Boost Modal */}
      {boostModalOpen && selectedProduct && (
        <BoostModal
          isOpen={boostModalOpen}
          onClose={() => {
            setBoostModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
