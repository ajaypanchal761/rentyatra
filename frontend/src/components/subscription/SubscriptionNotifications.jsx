import { AlertTriangle, X, ArrowRight, Zap } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionContext from '../../contexts/SubscriptionContext';

const SubscriptionNotifications = () => {
  const navigate = useNavigate();
  const context = useContext(SubscriptionContext);
  
  // If context is not available, don't render anything
  if (!context) {
    return null;
  }
  
  const { userSubscription, userBoosts, hasActiveSubscription } = context;
  const [dismissedNotifications, setDismissedNotifications] = useState([]);

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const dismissNotification = (id) => {
    setDismissedNotifications([...dismissedNotifications, id]);
  };

  // Check subscription expiry
  const subscriptionDays = hasActiveSubscription() 
    ? getDaysRemaining(userSubscription.endDate)
    : 0;
  
  const showSubscriptionWarning = 
    hasActiveSubscription() && 
    subscriptionDays > 0 && 
    subscriptionDays <= 7 &&
    !dismissedNotifications.includes('subscription-expiry');

  const subscriptionExpired = 
    userSubscription && 
    userSubscription.status === 'active' &&
    subscriptionDays <= 0 &&
    !dismissedNotifications.includes('subscription-expired');

  // Check boost expiry
  const expiringBoosts = userBoosts.filter(boost => {
    if (boost.status !== 'active') return false;
    const days = getDaysRemaining(boost.endDate);
    return days > 0 && days <= 3;
  });

  const showBoostWarning = 
    expiringBoosts.length > 0 &&
    !dismissedNotifications.includes('boost-expiry');

  // Don't render if no notifications
  if (!showSubscriptionWarning && !subscriptionExpired && !showBoostWarning) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 px-4 space-y-2 animate-slide-down">
      {/* Subscription Expiring Soon */}
      {showSubscriptionWarning && (
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-bold text-sm md:text-base">
                ⚠️ Your subscription expires in {subscriptionDays} {subscriptionDays === 1 ? 'day' : 'days'}
              </p>
              <p className="text-xs md:text-sm text-yellow-100">
                Renew now to keep your listings active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/my-subscription')}
              className="bg-white text-orange-600 hover:bg-yellow-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Renew Now</span>
              <span className="sm:hidden">Renew</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => dismissNotification('subscription-expiry')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Subscription Expired */}
      {subscriptionExpired && (
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="font-bold text-sm md:text-base">
                🔒 Your subscription has expired
              </p>
              <p className="text-xs md:text-sm text-red-100">
                Your listings are hidden. Renew to activate them
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/subscription')}
              className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Renew Subscription</span>
              <span className="sm:hidden">Renew</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => dismissNotification('subscription-expired')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Boost Expiring Soon */}
      {showBoostWarning && expiringBoosts[0] && (
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Zap size={24} className="flex-shrink-0" fill="currentColor" />
            <div>
              <p className="font-bold text-sm md:text-base">
                ⚡ Your boost for "{expiringBoosts[0].productName}" expires in{' '}
                {getDaysRemaining(expiringBoosts[0].endDate)}{' '}
                {getDaysRemaining(expiringBoosts[0].endDate) === 1 ? 'day' : 'days'}
              </p>
              <p className="text-xs md:text-sm text-orange-100">
                Extend to maintain top visibility
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/my-boosts')}
              className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Extend Boost</span>
              <span className="sm:hidden">Extend</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => dismissNotification('boost-expiry')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionNotifications;

