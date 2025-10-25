import { useState } from 'react';
import { X, Check, CreditCard, Shield, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import razorpayService from '../../services/razorpayService';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

function PlanSummaryModal({ isOpen, onClose, plan }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { user } = useAuth();
  const { loadUserSubscription } = useSubscription();
  const navigate = useNavigate();

  if (!isOpen || !plan) return null;

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      // Debug: Log user data to help identify the issue
      console.log('User data for payment:', {
        user: user,
        name: user?.name,
        email: user?.email,
        phone: user?.phone
      });

      // Calculate total amount with GST
      const basePrice = parseInt(plan.price);
      const gstAmount = Math.round(basePrice * 0.18);
      const totalAmount = basePrice + gstAmount;

      // Process payment with Razorpay
      await razorpayService.processSubscriptionPayment({
        amount: totalAmount,
        planId: plan.id,
        planName: plan.name,
        userId: user?.id || user?._id || 'user-unknown',
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        phone: user?.phone || '9876543210',
        description: `${plan.name} Subscription`,
        maxListings: plan.maxListings,
        maxBoosts: plan.maxBoosts,
        maxPhotos: plan.maxPhotos,
        onSuccess: async (result) => {
          console.log('Payment successful:', result);
          // Reload user subscription after successful payment
          if (user?.id || user?._id) {
            await loadUserSubscription(user.id || user._id);
          }
          
          // Show thank you popup
          setShowThankYou(true);
          
          // Redirect to My Subscription after 2.5 seconds
          setTimeout(() => {
            navigate('/my-subscription');
            onClose();
          }, 2500);
        },
        onError: (error) => {
          console.error('Payment failed:', error);
          if (error.message !== 'PAYMENT_CANCELLED') {
            alert('Payment failed. Please try again.');
          }
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-0 md:p-4">
      {/* Thank You Popup */}
      {showThankYou && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-bounce">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Thank you for your subscription!
            </h3>
            <p className="text-gray-600">
              Redirecting to My Subscription...
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-white w-full h-full md:rounded-xl md:shadow-xl md:max-w-md md:max-h-[90vh] md:h-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Plan Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Plan Details */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Plan Header */}
          <div className={`bg-gradient-to-br ${plan.gradient} text-white p-6 rounded-xl`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-lg opacity-90">one-time</span>
                </div>
                <p className="text-sm opacity-90 mt-1">Valid for {plan.duration} days</p>
              </div>
              {plan.popular && (
                <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  POPULAR
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">What's included:</h4>
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Limits */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Plan Limits:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Max Listings:</span>
                <span className="font-medium">{plan.maxListings === -1 ? 'Unlimited' : plan.maxListings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Boosts:</span>
                <span className="font-medium">{plan.maxBoosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{plan.duration} days</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-gray-200 pt-4">
            {(() => {
              const basePrice = parseInt(plan.price);
              const gstAmount = Math.round(basePrice * 0.18);
              const totalAmount = basePrice + gstAmount;
              
              return (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Plan Price:</span>
                    <span className="font-medium">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">₹{gstAmount}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                      <span className="text-xl font-bold text-gray-900">₹{totalAmount}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 mb-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isProcessing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg hover:shadow-xl`
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CreditCard size={16} />
                  Pay Now
                </div>
              )}
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>Payment processed instantly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanSummaryModal;
