import { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === null) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  // Subscription Plans (Mock Data - will come from API later)
  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 199,
      duration: 30,
      features: [
        'Up to 3 Listings',
        'Basic Support',
        '3 Photos per listing',
        'Valid for 30 Days',
        'Email notifications'
      ],
      maxListings: 3,
      maxPhotos: 3,
      gradient: 'from-gray-400 to-gray-500',
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 499,
      duration: 60,
      features: [
        'Up to 10 Listings',
        'Priority Support',
        '5 Photos per listing',
        'Valid for 60 Days',
        'Analytics Dashboard',
        'Featured Badge'
      ],
      maxListings: 10,
      maxPhotos: 5,
      gradient: 'from-blue-500 to-indigo-600',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 899,
      duration: 90,
      features: [
        'Up to 30 Listings',
        'Priority Support 24/7',
        '10 Photos per listing',
        'Valid for 90 Days',
        'Advanced Analytics',
        'Featured Badge',
        '10% Boost Discount'
      ],
      maxListings: 30,
      maxPhotos: 10,
      gradient: 'from-purple-500 to-pink-600',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 1499,
      duration: 365,
      features: [
        'Unlimited Listings',
        'Premium Support 24/7',
        '15 Photos per listing',
        'Valid for 365 Days',
        'Advanced Analytics',
        'Priority Badge',
        '20% Boost Discount',
        'API Access'
      ],
      maxListings: -1, // -1 means unlimited
      maxPhotos: 15,
      gradient: 'from-yellow-500 to-orange-600',
      popular: false
    }
  ];

  // Boost Plans (Mock Data)
  const boostPlans = [
    {
      id: 'boost-15',
      name: '15-Day Boost',
      duration: 15,
      price: 99,
      description: 'Quick visibility boost',
      features: [
        'Top placement for 15 days',
        'Average 3x more views',
        'Priority badge on listing',
        'Featured in search'
      ],
      icon: '⚡',
      gradient: 'from-orange-500 to-red-600',
      recommended: false
    },
    {
      id: 'boost-30',
      name: '30-Day Boost',
      duration: 30,
      price: 149,
      description: 'Maximum exposure & best value',
      features: [
        'Top placement for 30 days',
        'Average 5x more views',
        'Priority badge on listing',
        'Featured in search',
        'Featured in category',
        'Save ₹49 vs 15-day'
      ],
      icon: '🚀',
      gradient: 'from-blue-500 to-purple-600',
      recommended: true
    }
  ];

  // User Subscription State (Mock - will come from API)
  const [userSubscription, setUserSubscription] = useState(null);
  
  // User Boosts State (Mock)
  const [userBoosts, setUserBoosts] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);

  // Check if user has active subscription
  const hasActiveSubscription = () => {
    if (!userSubscription) return false;
    if (userSubscription.status !== 'active') return false;
    
    const endDate = new Date(userSubscription.endDate);
    const now = new Date();
    return endDate > now;
  };

  // Check if user can add more products
  const canAddProduct = () => {
    if (!hasActiveSubscription()) return false;
    
    const plan = subscriptionPlans.find(p => p.id === userSubscription.planId);
    if (!plan) return false;
    
    // Unlimited listings
    if (plan.maxListings === -1) return true;
    
    // Check current listing count
    const currentListings = userSubscription.currentListings || 0;
    return currentListings < plan.maxListings;
  };

  // Get remaining listings
  const getRemainingListings = () => {
    if (!hasActiveSubscription()) return 0;
    
    const plan = subscriptionPlans.find(p => p.id === userSubscription.planId);
    if (!plan) return 0;
    if (plan.maxListings === -1) return Infinity;
    
    const currentListings = userSubscription.currentListings || 0;
    return Math.max(0, plan.maxListings - currentListings);
  };

  // Subscribe to a plan (Mock - will call API)
  const subscribeToPlan = async (planId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const plan = subscriptionPlans.find(p => p.id === planId);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);
      
      const newSubscription = {
        id: `sub-${Date.now()}`,
        userId: 'user-123',
        planId: planId,
        planName: plan.name,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        currentListings: 0,
        autoRenew: true,
        price: plan.price
      };
      
      setUserSubscription(newSubscription);
      return { success: true, subscription: newSubscription };
    } catch (error) {
      console.error('Subscribe error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserSubscription(prev => ({
        ...prev,
        status: 'cancelled',
        autoRenew: false
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Cancel error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Purchase boost for a product
  const purchaseBoost = async (productId, boostPlanId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const boostPlan = boostPlans.find(b => b.id === boostPlanId);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + boostPlan.duration);
      
      const newBoost = {
        id: `boost-${Date.now()}`,
        productId,
        productName: 'Sample Product', // Will come from actual product
        boostPlanId,
        planName: boostPlan.name,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        price: boostPlan.price,
        views: 0,
        inquiries: 0
      };
      
      setUserBoosts(prev => [...prev, newBoost]);
      return { success: true, boost: newBoost };
    } catch (error) {
      console.error('Boost purchase error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cancel boost
  const cancelBoost = async (boostId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserBoosts(prev =>
        prev.map(boost =>
          boost.id === boostId
            ? { ...boost, status: 'cancelled' }
            : boost
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Cancel boost error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get active boosts
  const getActiveBoosts = () => {
    return userBoosts.filter(boost => {
      if (boost.status !== 'active') return false;
      const endDate = new Date(boost.endDate);
      return endDate > new Date();
    });
  };

  // Check if product is boosted
  const isProductBoosted = (productId) => {
    return getActiveBoosts().some(boost => boost.productId === productId);
  };

  // Get boost for product
  const getProductBoost = (productId) => {
    return getActiveBoosts().find(boost => boost.productId === productId);
  };

  const value = {
    // Plans
    subscriptionPlans,
    boostPlans,
    
    // User State
    userSubscription,
    userBoosts,
    loading,
    
    // Subscription Methods
    hasActiveSubscription,
    canAddProduct,
    getRemainingListings,
    subscribeToPlan,
    cancelSubscription,
    
    // Boost Methods
    purchaseBoost,
    cancelBoost,
    getActiveBoosts,
    isProductBoosted,
    getProductBoost,
    
    // Setters (for testing/demo)
    setUserSubscription,
    setUserBoosts
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;

