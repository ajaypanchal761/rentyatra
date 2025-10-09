import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
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
import Button from '../../components/common/Button';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              My Subscription
            </h1>
            <p className="text-gray-600">
              Manage your subscription and view payment history
            </p>
          </div>
          {hasActiveSubscription() && (
            <Button
              onClick={() => navigate('/subscription')}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
            >
              <ArrowRight size={20} />
              <span>Upgrade Plan</span>
            </Button>
          )}
        </div>

        {/* Active Subscription Card */}
        {hasActiveSubscription() ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* Plan Header with Gradient */}
            <div className={`bg-gradient-to-br ${currentPlan?.gradient || 'from-blue-500 to-indigo-600'} p-8 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={32} strokeWidth={2.5} />
                    <span className="text-xl font-bold uppercase tracking-wide">
                      {userSubscription.planName} Plan Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span className="text-blue-100">Valid until:</span>
                      <span className="font-bold">
                        {formatDate(userSubscription.endDate)}
                      </span>
                    </div>
                    <div className="text-2xl font-black">
                      {getDaysRemaining()} days remaining
                    </div>
                  </div>
                </div>

                <Crown size={64} className="text-yellow-300 opacity-20" fill="currentColor" />
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-gray-50">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {stats.totalListings}/{currentPlan?.maxListings === -1 ? '∞' : currentPlan?.maxListings}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Listings</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                  <Eye className="text-purple-600" size={24} />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Views</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                  <Zap className="text-orange-600" size={24} />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {stats.activeBoosts}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Boosts</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Revenue</div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="p-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Plan Features:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPlan?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-8 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/subscription')}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl"
              >
                Upgrade Plan
              </Button>
              <Button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-3 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        ) : (
          /* No Subscription Card */
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8 text-center mb-8">
            <AlertCircle size={64} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              No Active Subscription
            </h2>
            <p className="text-gray-700 mb-6">
              You need a subscription to list products for rent
            </p>
            <Button
              onClick={() => navigate('/subscription')}
              className="inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg"
            >
              <span>Browse Subscription Plans</span>
              <ArrowRight size={20} />
            </Button>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <CreditCard className="text-gray-700" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{payment.plan}</div>
                    <div className="text-sm text-gray-600">{payment.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-gray-900">
                    ₹{payment.amount}
                  </div>
                  <div className="text-xs text-green-600 font-semibold">
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
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-900 text-center mb-2">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your listings will be hidden after cancellation. You can reactivate anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors duration-200 disabled:opacity-50"
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

