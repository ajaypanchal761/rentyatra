import { X, Sparkles, TrendingUp, Star, Zap, Rocket } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import Button from '../common/Button';

const BoostModal = ({ isOpen, onClose, product }) => {
  const { boostPlans, purchaseBoost, loading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (!isOpen) return null;

  const handlePurchase = async (planId) => {
    setSelectedPlan(planId);
    const result = await purchaseBoost(product?.id || 'product-1', planId);
    
    if (result.success) {
      alert('Boost activated successfully! 🚀');
      onClose();
    } else {
      alert('Failed to activate boost. Please try again.');
    }
    
    setSelectedPlan(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative">
            <Sparkles size={48} className="text-yellow-300 mx-auto mb-4 animate-pulse" fill="currentColor" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              Boost Your Product to Top
            </h2>
            <p className="text-orange-100 text-lg">
              Get more visibility and faster rentals!
            </p>
          </div>
        </div>

        {/* Product Info */}
        {product && (
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                <TrendingUp size={32} className="text-gray-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {product.name || 'Canon EOS R5 Camera'}
                </div>
                <div className="text-sm text-gray-600">
                  Current Views: <span className="font-semibold">{product.views || 45}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boost Plans */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boostPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.recommended
                    ? 'border-blue-500 ring-4 ring-blue-100'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      <span>RECOMMENDED</span>
                    </div>
                  </div>
                )}

                {/* Plan Content */}
                <div className="p-6">
                  {/* Icon & Title */}
                  <div className="text-center mb-4">
                    <div className={`text-5xl mb-3 ${plan.recommended ? 'animate-bounce' : ''}`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-black text-gray-900">
                        ₹{plan.price}
                      </span>
                      {plan.recommended && (
                        <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                          Save ₹49!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="flex-shrink-0 mt-0.5">
                          {plan.recommended ? (
                            <Rocket size={16} className="text-blue-600" />
                          ) : (
                            <Zap size={16} className="text-orange-600" />
                          )}
                        </div>
                        <span className="text-gray-700 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading && selectedPlan === plan.id}
                    className={`w-full py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
                    } ${loading && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading && selectedPlan === plan.id
                      ? 'Processing...'
                      : `Select ₹${plan.price}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-blue-900 mb-1">💡 Pro Tip</div>
                <p className="text-sm text-blue-800">
                  30-day boost has <span className="font-bold">2.5x better ROI</span> and
                  reaches more potential renters. Most owners see bookings within 48 hours!
                </p>
              </div>
            </div>
          </div>

          {/* Trust Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure payment • Cancel anytime • Money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostModal;

