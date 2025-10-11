import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin, ChevronDown, Bell, Plus, Mic } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';
import LocationSearch from '../home/LocationSearch';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();
  const { searchQuery, setSearchQuery, location, favorites, items, toggleFavorite } = useApp();
  const navigate = useNavigate();

  const categoryNames = ['Cars', 'Bikes', 'Mobiles', 'Properties', 'Jobs', 'Furniture', 'Electronics', 'Fashion'];

  // Animate placeholder categories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % 8); // Fixed length
    }, 2000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/listings');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 md:px-3">
        {/* Mobile Layout - Two Rows */}
        <div className="md:hidden">
          {/* Top Row - Logo and Location */}
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="text-2xl font-black tracking-tight">
                <span className="text-[#002f34]">Rent Yatra</span>
              </div>
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-gray-100 rounded transition"
              >
                <MapPin size={18} className="text-gray-700 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-900 truncate max-w-[100px]">
                  {location || 'New Palasia, Indore'}
                </span>
                <ChevronDown size={16} className="text-gray-700 flex-shrink-0" />
              </button>
              {showLocationMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 py-3 animate-fade-in z-50">
                  <LocationSearch onClose={() => setShowLocationMenu(false)} />
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Row - Search Bar with Icons */}
          <div className="pb-3 px-0.5">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search "${categoryNames[currentCategoryIndex]}"`}
                    className="w-full px-4 py-2.5 pl-12 pr-12 border-2 border-gray-900 rounded focus:outline-none focus:border-[#23e5db] transition-all text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition"
                    title="Voice Search"
                  >
                    <Mic className="text-gray-600" size={20} />
                  </button>
                </div>
              </form>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowFavoritesDropdown(!showFavoritesDropdown)}
                  className="p-2 hover:bg-gray-100 rounded-full transition relative"
                  title="Favorites"
                >
                  <Heart className="text-gray-700" size={22} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </button>

                {/* Favorites Dropdown */}
                {showFavoritesDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowFavoritesDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden border border-gray-200">
                      <div className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-3 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Heart size={20} fill="currentColor" />
                          My Favorites ({favorites.length})
                        </h3>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {favorites.length === 0 ? (
                          <div className="p-8 text-center">
                            <Heart size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 mb-2">No favorites yet</p>
                            <p className="text-sm text-gray-400">Start adding items you love!</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {items.filter(item => favorites.includes(item.id)).map((item) => (
                              <div
                                key={item.id}
                                className="p-3 hover:bg-gray-50 transition cursor-pointer flex gap-3"
                                onClick={() => {
                                  navigate(`/item/${item.id}`);
                                  setShowFavoritesDropdown(false);
                                }}
                              >
                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-blue-600 font-bold text-sm">
                                    ₹{item.price.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin size={10} />
                                    {item.location}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(item.id);
                                  }}
                                  className="flex-shrink-0 p-1.5 hover:bg-red-50 rounded-full transition"
                                >
                                  <Heart size={16} className="fill-red-500 text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {favorites.length > 0 && (
                        <div className="border-t border-gray-200 p-3 bg-gray-50">
                          <button
                            onClick={() => {
                              navigate('/dashboard/favorites');
                              setShowFavoritesDropdown(false);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
                          >
                            View All Favorites
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-full transition relative"
                  title="Notifications"
                >
                  <Bell className="text-gray-700" size={22} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-600">Your ad received a message</p>
                        <span className="text-xs text-gray-400 mt-1">2 hours ago</span>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-600">New item in Electronics</p>
                        <span className="text-xs text-gray-400 mt-1">5 hours ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Single Row */}
        <div className="hidden md:flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="text-3xl font-black tracking-tight">
              <span className="text-[#002f34]">Rent Yatra</span>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded transition"
            >
              <MapPin size={18} className="text-gray-700 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                {location || 'New Palasia, Indore'}
              </span>
              <ChevronDown size={16} className="text-gray-700 flex-shrink-0" />
            </button>
            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 py-3 animate-fade-in z-50">
                <LocationSearch onClose={() => setShowLocationMenu(false)} />
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search "${categoryNames[currentCategoryIndex]}"`}
                className="w-full px-4 py-2.5 pl-12 pr-12 border-2 border-gray-900 rounded focus:outline-none focus:border-[#23e5db] transition-all text-base"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition"
                title="Voice Search"
              >
                <Mic className="text-gray-600" size={20} />
              </button>
            </div>
          </form>

          {/* Right Side - Login/User and Icons */}
          <div className="flex items-center gap-3">
            {/* Pricing Link */}
            <Link 
              to="/subscription" 
              className="px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition flex-shrink-0"
            >
              Plans
            </Link>
            
            {/* Heart Icon */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowFavoritesDropdown(!showFavoritesDropdown)}
                className="p-2 hover:bg-gray-100 rounded-full transition relative"
                title="Favorites"
              >
                <Heart className="text-gray-700" size={22} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Favorites Dropdown - Desktop */}
              {showFavoritesDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowFavoritesDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-3 text-white">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Heart size={20} fill="currentColor" />
                        My Favorites ({favorites.length})
                      </h3>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {favorites.length === 0 ? (
                        <div className="p-8 text-center">
                          <Heart size={48} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-500 mb-2">No favorites yet</p>
                          <p className="text-sm text-gray-400">Start adding items you love!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {items.filter(item => favorites.includes(item.id)).map((item) => (
                            <div
                              key={item.id}
                              className="p-3 hover:bg-gray-50 transition cursor-pointer flex gap-3"
                              onClick={() => {
                                navigate(`/item/${item.id}`);
                                setShowFavoritesDropdown(false);
                              }}
                            >
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
                                  {item.title}
                                </h4>
                                <p className="text-blue-600 font-bold text-sm">
                                  ₹{item.price.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} />
                                  {item.location}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(item.id);
                                }}
                                className="flex-shrink-0 p-1.5 hover:bg-red-50 rounded-full transition"
                              >
                                <Heart size={16} className="fill-red-500 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {favorites.length > 0 && (
                      <div className="border-t border-gray-200 p-3 bg-gray-50">
                        <button
                          onClick={() => {
                            navigate('/dashboard/favorites');
                            setShowFavoritesDropdown(false);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
                        >
                          View All Favorites
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Notification Icon */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-full transition relative"
                title="Notifications"
              >
                <Bell className="text-gray-700" size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-600">Your ad received a message</p>
                      <span className="text-xs text-gray-400 mt-1">2 hours ago</span>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-600">New item in Electronics</p>
                      <span className="text-xs text-gray-400 mt-1">5 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login/User Button */}
            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full transition">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {user?.name?.charAt(0)}
                    </div>
                    <ChevronDown size={16} className="text-gray-700" />
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                      My Dashboard
                    </Link>
                    <Link to="/dashboard/my-ads" className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                      My Ads
                    </Link>
                    <Link to="/messages" className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                      Messages
                    </Link>
                    <Link to="/dashboard/profile" className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                      Profile
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <Link to="/my-subscription" className="block px-4 py-2.5 hover:bg-blue-50 text-blue-600 text-sm font-semibold">
                      ⭐ My Subscription
                    </Link>
                    <Link to="/my-boosts" className="block px-4 py-2.5 hover:bg-orange-50 text-orange-600 text-sm font-semibold">
                      🚀 My Boosts
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <Button 
                  icon={Plus} 
                  onClick={() => navigate('/post-ad')} 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-md px-4 py-1.5 text-sm"
                >
                  RENT OUT
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-md px-4 py-1.5 text-sm"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

