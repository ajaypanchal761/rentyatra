import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, MessageCircle, User, Edit, Trash2, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { format } from 'date-fns';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, favorites, deleteItem, bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState('my-ads');
  const navigate = useNavigate();

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

  // Filter items by current user (in real app, items would have userId)
  const myAds = items.filter((item) => item.seller.name === user.name);
  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  const tabs = [
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                  {user.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="mr-3" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            activeTab === tab.id ? 'bg-blue-700' : 'bg-gray-200'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* My Rentals Tab */}
            {activeTab === 'my-ads' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">My Rentals</h2>
                  <Button onClick={() => navigate('/post-ad')} className="w-full sm:w-auto">
                    List New Item
                  </Button>
                </div>

                {myAds.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No rental listings yet</h3>
                    <p className="text-gray-600 mb-6">Start renting out items by listing your first item</p>
                    <Button onClick={() => navigate('/post-ad')}>List Your First Item</Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myAds.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Image */}
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg flex-shrink-0"
                          />
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{item.title}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-blue-600 font-bold text-lg sm:text-xl mb-2">
                              ${item.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Posted: {format(new Date(item.postedDate), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Buttons - Full width on mobile, side by side */}
                        <div className="flex gap-2 mt-4 sm:mt-0">
                          <Button size="sm" variant="outline" icon={Edit} className="flex-1 sm:flex-none">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            icon={Trash2}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAd(item.id);
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-6">My Bookings</h2>

                {bookings.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">Start renting items to see your bookings here</p>
                    <Button onClick={() => navigate('/listings')}>Browse Listings</Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'pending': return 'bg-yellow-100 text-yellow-800';
                          case 'confirmed': return 'bg-green-100 text-green-800';
                          case 'completed': return 'bg-blue-100 text-blue-800';
                          case 'cancelled': return 'bg-red-100 text-red-800';
                          default: return 'bg-gray-100 text-gray-800';
                        }
                      };

                      const getStatusIcon = (status) => {
                        switch (status) {
                          case 'pending': return Clock;
                          case 'confirmed': return CheckCircle;
                          case 'completed': return CheckCircle;
                          case 'cancelled': return XCircle;
                          default: return Clock;
                        }
                      };

                      const StatusIcon = getStatusIcon(booking.status);

                      return (
                        <Card key={booking.id} className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Image */}
                            <img
                              src={booking.itemImage}
                              alt={booking.itemTitle}
                              className="w-full md:w-32 h-48 md:h-32 object-cover rounded-lg flex-shrink-0"
                            />
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-base md:text-lg">{booking.itemTitle}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                  <StatusIcon size={14} />
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </div>

                              <div className="space-y-2 mb-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar size={14} className="mr-2" />
                                  <span>
                                    {format(new Date(booking.startDate), 'dd MMM yyyy')} - {format(new Date(booking.endDate), 'dd MMM yyyy')}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Duration: <span className="font-semibold">{booking.rentalPeriod}</span> ({booking.totalDays} days)
                                </div>
                                <div className="text-lg font-bold text-blue-600">
                                  Total: ${booking.totalPrice.toLocaleString()}
                                </div>
                              </div>

                              <div className="text-xs text-gray-500">
                                Booked on {format(new Date(booking.createdAt), 'dd MMM yyyy')}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          {booking.status === 'pending' && (
                            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this booking?')) {
                                    cancelBooking(booking.id);
                                  }
                                }}
                                className="flex-1 md:flex-none"
                              >
                                Cancel Booking
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/item/${booking.itemId}`)}
                                className="flex-1 md:flex-none"
                              >
                                View Item
                              </Button>
                            </div>
                          )}
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
                <h2 className="text-xl md:text-2xl font-bold mb-6">Favorite Items</h2>

                {favoriteItems.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-6">Save items you like to view them later</p>
                    <Button onClick={() => navigate('/listings')}>Browse Listings</Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="bg-white rounded-xl overflow-hidden cursor-pointer premium-card border border-gray-100 p-4 flex gap-4"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 text-sm md:text-base truncate">{item.title}</h3>
                          <p className="text-blue-600 font-bold text-base md:text-lg">${item.price.toLocaleString()}</p>
                          <p className="text-xs md:text-sm text-gray-600 truncate">{item.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <Card className="p-12 text-center">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No messages</h3>
                <p className="text-gray-600">Your conversations will appear here</p>
              </Card>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

