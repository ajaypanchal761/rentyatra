// Plan management service for admin
class PlanService {
  constructor() {
    this.plans = [
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
    ];
  }

  // Get all plans
  getAllPlans() {
    return Promise.resolve([...this.plans]);
  }

  // Get plan by ID
  getPlanById(id) {
    return Promise.resolve(this.plans.find(plan => plan.id === id));
  }

  // Update plan
  updatePlan(planId, updatedPlan) {
    return new Promise((resolve, reject) => {
      try {
        const planIndex = this.plans.findIndex(plan => plan.id === planId);
        if (planIndex === -1) {
          reject(new Error('Plan not found'));
          return;
        }

        // Update the plan
        this.plans[planIndex] = { ...this.plans[planIndex], ...updatedPlan };
        
        // Store in localStorage for persistence
        localStorage.setItem('subscriptionPlans', JSON.stringify(this.plans));
        
        resolve(this.plans[planIndex]);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Create new plan
  createPlan(newPlan) {
    return new Promise((resolve, reject) => {
      try {
        const plan = {
          ...newPlan,
          id: newPlan.id || `plan-${Date.now()}`
        };
        
        this.plans.push(plan);
        localStorage.setItem('subscriptionPlans', JSON.stringify(this.plans));
        resolve(plan);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Delete plan
  deletePlan(planId) {
    return new Promise((resolve, reject) => {
      try {
        const planIndex = this.plans.findIndex(plan => plan.id === planId);
        if (planIndex === -1) {
          reject(new Error('Plan not found'));
          return;
        }

        this.plans.splice(planIndex, 1);
        localStorage.setItem('subscriptionPlans', JSON.stringify(this.plans));
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Load plans from localStorage
  loadPlans() {
    try {
      const storedPlans = localStorage.getItem('subscriptionPlans');
      if (storedPlans) {
        this.plans = JSON.parse(storedPlans);
      }
    } catch (error) {
      console.error('Error loading plans from localStorage:', error);
    }
  }

  // Initialize service
  init() {
    this.loadPlans();
  }
}

// Create singleton instance
const planService = new PlanService();
planService.init();

export default planService;
