import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import {
  Crown,
  Calendar,
  TrendingUp,
  Eye,
  Zap,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import Button from '../../../components/common/Button';

const MySubscription = () => {
  const navigate = useNavigate();
  const {
    userSubscription,
    subscriptionPlans,
    hasActiveSubscription,
    getRemainingListings,
    cancelSubscription,
    loading
  } = useSubscription();

  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock payment history (will come from API)
  const paymentHistory = [
    { id: 1, date: '2025-12-15', plan: 'Premium Plan', amount: 899, status: 'Paid' },
    { id: 2, date: '2025-11-15', plan: 'Premium Plan', amount: 899, status: 'Paid' },
    { id: 3, date: '2025-10-15', plan: 'Basic Plan', amount: 499, status: 'Paid' }
  ];

  // Mock stats (will come from API)
  const stats = {
    totalListings: 24,
    totalViews: 1245,
    activeBoosts: 3,
    totalRevenue: 4500
  };

  const handleCancel = async () => {
    const result = await cancelSubscription();
    if (result.success) {
      setShowCancelModal(false);
      alert('Subscription cancelled successfully');
    }
  };

  const getDaysRemaining = () => {
    if (!userSubscription) return 0;
    const endDate = new Date(userSubscription.endDate);
    const now = new Date();
    const diff = endDate - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentPlan = subscriptionPlans.find(
    p => p.id === userSubscription?.planId
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-1">
              My Subscription
            </h1>
            <p className="text-xs text-gray-600">
              Manage your subscription and view payment history
            </p>
          </div>
          {hasActiveSubscription() && (
            <Button
              onClick={() => navigate('/subscription')}
              className="hidden md:flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-3 py-1.5 text-xs rounded-lg shadow-lg"
            >
              <ArrowRight size={14} />
              <span>Upgrade Plan</span>
            </Button>
          )}
        </div>

        {/* Active Subscription Card */}
        {hasActiveSubscription() ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            {/* Plan Header with Gradient */}
            <div className={`bg-gradient-to-br ${currentPlan?.gradient || 'from-blue-500 to-indigo-600'} p-4 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} strokeWidth={2.5} />
                    <span className="text-sm font-bold uppercase tracking-wide">
                      {userSubscription.planName} Plan Active
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar size={12} />
                      <span className="text-blue-100">Valid until:</span>
                      <span className="font-bold">
                        {formatDate(userSubscription.endDate)}
                      </span>
                    </div>
                    <div className="text-base font-black">
                      {getDaysRemaining()} days remaining
                    </div>
                  </div>
                </div>

                <Crown size={32} className="text-yellow-300 opacity-20" fill="currentColor" />
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-white rounded-full h-1.5 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        ((currentPlan?.duration - getDaysRemaining()) /
                          currentPlan?.duration) *
                          100,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-50">
              <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                  <TrendingUp className="text-blue-600" size={14} />
                </div>
                <div className="text-sm font-black text-gray-900">
                  {stats.totalListings}/{currentPlan?.maxListings === -1 ? '∞' : currentPlan?.maxListings}
                </div>
                <div className="text-[10px] text-gray-600 font-semibold">Listings</div>
              </div>

              <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
                  <Eye className="text-purple-600" size={14} />
                </div>
                <div className="text-sm font-black text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-600 font-semibold">Views</div>
              </div>

              <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-1">
                  <Zap className="text-orange-600" size={14} />
                </div>
                <div className="text-sm font-black text-gray-900">
                  {stats.activeBoosts}
                </div>
                <div className="text-[10px] text-gray-600 font-semibold">Boosts</div>
              </div>

              <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
                  <DollarSign className="text-green-600" size={14} />
                </div>
                <div className="text-sm font-black text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-600 font-semibold">Revenue</div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="p-3 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 mb-2">
                Plan Features:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {currentPlan?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => navigate('/subscription')}
                className="flex-1 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-lg"
              >
                Upgrade Plan
              </Button>
              <Button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-1.5 text-xs bg-white border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-lg"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        ) : (
          /* No Subscription Card */
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-center mb-4">
            <AlertCircle size={32} className="text-orange-500 mx-auto mb-2" />
            <h2 className="text-base font-bold text-gray-900 mb-1">
              No Active Subscription
            </h2>
            <p className="text-xs text-gray-700 mb-3">
              You need a subscription to list products for rent
            </p>
            <Button
              onClick={() => navigate('/subscription')}
              className="inline-flex items-center gap-1 py-1.5 px-4 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md"
            >
              <span>Browse Subscription Plans</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CreditCard className="text-gray-700" size={16} />
              <h2 className="text-sm font-bold text-gray-900">Payment History</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={14} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs">{payment.plan}</div>
                    <div className="text-[10px] text-gray-600">{payment.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{payment.amount}
                  </div>
                  <div className="text-[10px] text-green-600 font-semibold">
                    ✓ {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full p-4">
            <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-black text-gray-900 text-center mb-1">
              Cancel Subscription?
            </h3>
            <p className="text-xs text-gray-600 text-center mb-3">
              Your listings will be hidden after cancellation. You can reactivate anytime.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-1.5 text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubscription;

