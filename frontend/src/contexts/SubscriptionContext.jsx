import { createContext, useContext, useState, useEffect } from 'react';
import planService from '../services/planService';
import apiService from '../services/api';

const SubscriptionContext = createContext(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  // Subscription Plans - loaded from service (same as admin)
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  // Load plans on component mount
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plans = await planService.getAllPlans();
        setSubscriptionPlans(plans);
      } catch (error) {
        console.error('Error loading plans:', error);
        // Fallback to default plans if service fails
        setSubscriptionPlans([
          {
            id: 'basic',
            name: 'Basic Plan',
            price: 100,
            duration: 30,
            features: [
              '3 Post Ads',
              '5 Time Boost',
              'Basic Support',
              'Valid for 30 Days',
              'Email notifications'
            ],
            maxListings: 3,
            maxBoosts: 5,
            maxPhotos: 3,
            gradient: 'from-gray-400 to-gray-500',
            popular: false
          },
          {
            id: 'premium',
            name: 'Premium Plan',
            price: 200,
            duration: 30,
            features: [
              '5 Post Ads',
              '10 Time Boost',
              'Priority Support',
              'Valid for 30 Days',
              'Email notifications',
              'Featured Badge'
            ],
            maxListings: 5,
            maxBoosts: 10,
            maxPhotos: 5,
            gradient: 'from-blue-500 to-indigo-600',
            popular: true
          },
          {
            id: 'pro',
            name: 'Pro Plan',
            price: 300,
            duration: 30,
            features: [
              '15 Post Ads',
              '20 Time Boost',
              'Priority Support 24/7',
              'Valid for 30 Days',
              'Email notifications',
              'Featured Badge'
            ],
            maxListings: 15,
            maxBoosts: 20,
            maxPhotos: 10,
            gradient: 'from-purple-500 to-pink-600',
            popular: false
          }
        ]);
      }
    };
    loadPlans();
  }, []);

  // Listen for storage changes (when admin updates plans)
  useEffect(() => {
    const handleStorageChange = () => {
      const loadPlans = async () => {
        try {
          const plans = await planService.getAllPlans();
          setSubscriptionPlans(plans);
        } catch (error) {
          console.error('Error reloading plans:', error);
        }
      };
      loadPlans();
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('plansUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('plansUpdated', handleStorageChange);
    };
  }, []);

  // Boost Plans (Mock Data)
  const boostPlans = [
    {
      id: 'boost-15',
      name: '15-Day Boost',
      duration: 15,
      price: 499,
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
      price: 799,
      description: 'Maximum exposure & best value',
      features: [
        'Top placement for 30 days',
        'Average 5x more views',
        'Priority badge on listing',
        'Featured in search',
        'Featured in category',
        'Save ₹300 vs 15-day'
      ],
      icon: '🚀',
      gradient: 'from-blue-500 to-purple-600',
      recommended: true
    }
  ];

  // User Subscription State
  const [userSubscription, setUserSubscription] = useState(null);
  
  // User Boosts State (Mock)
  const [userBoosts, setUserBoosts] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);

  // Load user subscription from API
  const loadUserSubscription = async (userId) => {
    if (!userId) {
      console.log('No userId provided to loadUserSubscription');
      return;
    }
    
    // Use relative path to leverage Vite proxy
    const apiUrl = `/api/subscription/active/${userId}`;
    console.log('Loading subscription for user:', userId, 'from:', apiUrl);
    console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('Final API URL:', apiUrl);
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No active subscription found for user:', userId);
          setUserSubscription(null);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Subscription data received:', data);
      
      if (data.success && data.data) {
        setUserSubscription(data.data);
      } else {
        setUserSubscription(null);
      }
    } catch (error) {
      console.error('Error loading user subscription:', error);
      
      if (error.name === 'AbortError') {
        console.log('Request timed out - server may be down');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.log('Network error - server may be down or CORS issue');
        console.log('Please ensure the backend server is running on port 5000');
        
        // Try to use mock data as fallback for development
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock subscription data for development');
          setUserSubscription({
            _id: 'mock-subscription-id',
            userId: { _id: userId, name: 'Mock User', email: 'mock@example.com' },
            planId: 'basic',
            planName: 'Basic Plan',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            price: 944,
            paymentStatus: 'paid',
            currentListings: 0,
            currentBoosts: 0,
            maxListings: 5,
            maxBoosts: 6,
            maxPhotos: 3
          });
          return;
        }
      }
      
      console.log('Network error - keeping existing subscription state');
      // Don't set userSubscription to null on network errors to preserve existing state
    }
  };

  // Refresh user subscription data
  const refreshUserSubscription = async (userId) => {
    if (!userId) return;
    await loadUserSubscription(userId);
  };

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

  // Subscribe to a plan - this is now handled by payment flow
  const subscribeToPlan = async (planId) => {
    // This method is now handled by the payment flow
    // The subscription is created during payment process
    return { success: true };
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!userSubscription) {
      return { success: false, error: 'No active subscription found' };
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/subscription/cancel/${userSubscription._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUserSubscription(null);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
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
    loadUserSubscription,
    refreshUserSubscription,
    
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

