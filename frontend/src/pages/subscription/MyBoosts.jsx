import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import {
  Zap,
  Eye,
  MessageCircle,
  Calendar,
  TrendingUp,
  Plus,
  AlertCircle,
  ArrowRight,
  X
} from 'lucide-react';
import Button from '../../components/common/Button';
import BoostBadge from '../../components/boost/BoostBadge';

const MyBoosts = () => {
  const navigate = useNavigate();
  const { userBoosts, getActiveBoosts, cancelBoost, loading } = useSubscription();
  const [cancelingBoostId, setCancelingBoostId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBoost, setSelectedBoost] = useState(null);

  const activeBoosts = getActiveBoosts();
  const expiredBoosts = userBoosts.filter(
    (boost) => boost.status !== 'active' || new Date(boost.endDate) <= new Date()
  );

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const getProgressPercentage = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.round((elapsed / total) * 100), 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancelBoost = async () => {
    if (!selectedBoost) return;
    
    setCancelingBoostId(selectedBoost.id);
    const result = await cancelBoost(selectedBoost.id);
    
    if (result.success) {
      alert('Boost cancelled successfully');
      setShowCancelModal(false);
      setSelectedBoost(null);
    } else {
      alert('Failed to cancel boost. Please try again.');
    }
    
    setCancelingBoostId(null);
  };

  const openCancelModal = (boost) => {
    setSelectedBoost(boost);
    setShowCancelModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20 py-4 md:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1 md:mb-2">
                My Boosts
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Manage your product boosts and track performance
              </p>
            </div>
            <Button
              onClick={() => navigate('/dashboard/my-ads')}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-orange-100 hover:to-red-100 text-white font-semibold text-2xl px-6 py-3 rounded-xl shadow-lg"
            >
              <Plus size={10} />
              <span>Boost Product</span>
            </Button>
          </div>

          {/* Mobile Boost Product Button */}
         
        </div>

        {/* Active Boosts */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-6">
            <Zap className="text-orange-500 w-5 h-5 md:w-7 md:h-7" />
            <h2 className="text-lg md:text-2xl font-black text-gray-900">
              Active Boosts ({activeBoosts.length})
            </h2>
          </div>

          {activeBoosts.length > 0 ? (
            <>
              {/* Mobile: Centered with Horizontal Scroll */}
              <div className="md:hidden">
                <div className="flex justify-center">
                  <div className="overflow-x-auto hide-scrollbar max-w-full">
                    <div className="flex gap-4 pb-4 px-4">
                      {activeBoosts.map((boost) => {
                        const { days, hours } = getDaysRemaining(boost.endDate);
                        const progress = getProgressPercentage(boost.startDate, boost.endDate);

                        return (
                          <div
                            key={boost.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 border-2 border-orange-200"
                            style={{ width: '75vw', maxWidth: '320px' }}
                          >
                        {/* Boost Header - Compact */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 text-white">
                          <div className="space-y-2">
                            {/* Title with Badge */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-1">
                                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                                    <Zap size={12} fill="white" className="text-white" />
                                    <span className="text-[10px] font-bold">Boosted</span>
                                  </div>
                                </div>
                                <h3 className="text-sm font-black leading-tight line-clamp-2">{boost.productName}</h3>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xl font-black leading-none">{progress}%</div>
                                <div className="text-[8px] text-orange-100 mt-0.5">Done</div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div>
                              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-white rounded-full h-1.5 transition-all duration-500 shadow-sm"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Time Remaining */}
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5">
                              <Calendar size={12} />
                              <span className="text-xs font-semibold">
                                {days}d, {hours}h left
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Performance Stats - Compact */}
                        <div className="p-3 bg-gradient-to-br from-gray-50 to-white">
                          <div className="flex items-center gap-1.5 mb-2">
                            <TrendingUp className="text-blue-600" size={14} />
                            <h4 className="text-xs font-black text-gray-900">Performance</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg p-2 shadow-md border border-purple-100">
                              <div className="flex items-center gap-1 mb-1">
                                <Eye className="text-purple-600" size={12} />
                                <span className="text-[10px] text-gray-600 font-bold">Views</span>
                              </div>
                              <div className="text-xl font-black text-gray-900">
                                {boost.views || 245}
                              </div>
                              <div className="text-[9px] text-green-600 font-bold mt-0.5">
                                +120%
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-2 shadow-md border border-blue-100">
                              <div className="flex items-center gap-1 mb-1">
                                <MessageCircle className="text-blue-600" size={12} />
                                <span className="text-[10px] text-gray-600 font-bold">Inquiries</span>
                              </div>
                              <div className="text-xl font-black text-gray-900">
                                {boost.inquiries || 12}
                              </div>
                              <div className="text-[9px] text-green-600 font-bold mt-0.5">
                                +85%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions - Compact */}
                        <div className="p-3 bg-white border-t border-gray-200">
                          <div className="space-y-1.5">
                            <Button
                              onClick={() => navigate(`/product/${boost.productId}`)}
                              className="w-full py-2 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md"
                            >
                              View Product
                            </Button>
                            <div className="grid grid-cols-2 gap-1.5">
                              <Button
                                onClick={() => alert('Extend boost feature coming soon!')}
                                className="py-1.5 text-[10px] bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-md shadow-md"
                              >
                                Extend
                              </Button>
                              <Button
                                onClick={() => openCancelModal(boost)}
                                className="py-1.5 text-[10px] bg-red text-black border-2 border-red-300 hover:border-red-400 hover:bg-red-50 text-red-600 font-bold rounded-md"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Vertical Stack */}
              <div className="hidden md:block space-y-6">
                {activeBoosts.map((boost) => {
                  const { days, hours } = getDaysRemaining(boost.endDate);
                  const progress = getProgressPercentage(boost.startDate, boost.endDate);

                  return (
                    <div
                      key={boost.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Boost Header */}
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <BoostBadge size="sm" className="bg-white text-orange-600" showPulse={false} />
                              <h3 className="text-2xl font-black">{boost.productName}</h3>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                  className="bg-white rounded-full h-2 transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-orange-100">
                              <Calendar size={16} />
                              <span className="text-sm">
                                Expires in: <span className="font-bold text-white">{days} days, {hours} hours</span>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-black">{progress}%</div>
                            <div className="text-xs text-orange-100">Complete</div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="text-blue-600" size={20} />
                          <h4 className="font-bold text-gray-900">Performance:</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="text-purple-600" size={18} />
                              <span className="text-sm text-gray-600 font-semibold">Views</span>
                            </div>
                            <div className="text-2xl font-black text-gray-900">
                              {boost.views || 245}
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              +120% vs regular
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageCircle className="text-blue-600" size={18} />
                              <span className="text-sm text-gray-600 font-semibold">Inquiries</span>
                            </div>
                            <div className="text-2xl font-black text-gray-900">
                              {boost.inquiries || 12}
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              +85% vs regular
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-6 flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={() => navigate(`/product/${boost.productId}`)}
                          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl"
                        >
                          View Product
                        </Button>
                        <Button
                          onClick={() => alert('Extend boost feature coming soon!')}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl"
                        >
                          Extend Boost
                        </Button>
                        <Button
                          onClick={() => openCancelModal(boost)}
                          className="flex-1 py-3 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl"
                        >
                          Cancel Boost
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap size={32} className="text-white md:w-12 md:h-12" fill="currentColor" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                No Active Boosts
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                Boost your products to get more visibility and faster rentals
              </p>
              {/* Only show button on desktop when in empty state, mobile has button at top */}
              <Button
                onClick={() => navigate('/dashboard/my-ads')}
                className="hidden md:inline-flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg"
              >
                <span>Boost a Product</span>
                <ArrowRight size={18} className="md:w-5 md:h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Expired Boosts */}
        {expiredBoosts.length > 0 && (
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-6">
              <AlertCircle className="text-gray-500 w-5 h-5 md:w-7 md:h-7" />
              <h2 className="text-lg md:text-2xl font-black text-gray-900">
                Expired Boosts ({expiredBoosts.length})
              </h2>
            </div>

            {/* Mobile: Centered with Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex justify-center">
                <div className="overflow-x-auto hide-scrollbar max-w-full">
                  <div className="flex gap-3 pb-4 px-4">
                    {expiredBoosts.map((boost) => (
                      <div
                        key={boost.id}
                        className="bg-white rounded-xl shadow-md p-4 flex-shrink-0 hover:shadow-lg transition-shadow duration-200"
                        style={{ width: '75vw', maxWidth: '320px' }}
                      >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap size={24} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                            {boost.productName}
                          </h3>
                          <div className="text-xs text-gray-600">
                            Expired: {formatDate(boost.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Views: {boost.views || 567} | Inquiries: {boost.inquiries || 34}
                      </div>
                      <Button
                        onClick={() => alert('Boost again feature coming soon!')}
                        className="w-full py-2 text-xs bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg"
                      >
                        Boost Again
                      </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

            {/* Desktop: Vertical List */}
            <div className="hidden md:block space-y-4">
              {expiredBoosts.map((boost) => (
                <div
                  key={boost.id}
                  className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Zap size={32} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {boost.productName}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Expired: {formatDate(boost.endDate)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total Views: {boost.views || 567} | Inquiries: {boost.inquiries || 34}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => alert('Boost again feature coming soon!')}
                    className="py-2 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg"
                  >
                    Boost Again
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBoost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <AlertCircle size={64} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-900 text-center mb-2">
              Cancel Boost?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your product "{selectedBoost.productName}" will lose its top placement immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
              >
                Keep Boost
              </button>
              <button
                onClick={handleCancelBoost}
                disabled={loading}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                {loading && cancelingBoostId === selectedBoost.id ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBoosts;

