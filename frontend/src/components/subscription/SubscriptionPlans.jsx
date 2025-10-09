import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import PlanCard from './PlanCard';
import { Sparkles, TrendingUp } from 'lucide-react';

const SubscriptionPlans = ({ onSelectPlan }) => {
  const { subscriptionPlans, subscribeToPlan, loading } = useSubscription();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = async (planId) => {
    setSelectedPlan(planId);
    
    if (onSelectPlan) {
      // If callback provided, use it (for modal flow)
      onSelectPlan(planId);
    } else {
      // Otherwise, subscribe directly (for dedicated page)
      const result = await subscribeToPlan(planId);
      
      if (result.success) {
        navigate('/subscription/success');
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-6 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
            <TrendingUp size={14} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-bold">SUBSCRIPTION PLANS</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 md:mb-4 leading-tight px-2">
            Choose Your Perfect Plan
          </h1>
          
          <p className="text-sm md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Start renting out your items today and earn passive income. 
            <br className="hidden md:block" />
            Pick a plan that fits your needs perfectly.
          </p>
        </div>

        {/* Pricing Cards - Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="mb-8 md:mb-12">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-4 pb-4">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} style={{ width: '70vw', minWidth: '260px' }} className="flex-shrink-0">
                  <PlanCard
                    plan={plan}
                    onSelect={handleSelectPlan}
                    loading={loading && selectedPlan === plan.id}
                    isPopular={plan.popular}
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelectPlan}
                loading={loading && selectedPlan === plan.id}
                isPopular={plan.popular}
                isMobile={false}
              />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            <Sparkles className="text-yellow-500" size={20} fill="currentColor" />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900">
              Why Choose RentYatra?
            </h2>
            <Sparkles className="text-yellow-500" size={20} fill="currentColor" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl">🚀</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                Quick Setup
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                List your products in minutes and start earning right away
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl">🔒</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                100% secure transactions with instant payment processing
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl">💰</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                Earn More
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Reach thousands of customers and maximize your earnings
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-8 md:mt-12 text-center px-2">
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            All plans include secure payments, insurance coverage, and 24/7 customer support
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            Cancel anytime • No hidden fees • Money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

