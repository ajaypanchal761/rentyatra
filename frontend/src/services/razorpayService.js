// Razorpay service for RentYatra frontend
class RazorpayService {
  constructor() {
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_8sYbzHWidwe5Zw';
    
    if (!this.razorpayKey) {
      console.error('⚠️  RAZORPAY_KEY_ID not configured in environment variables');
    }
  }

  static getInstance() {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  /**
   * Load Razorpay script dynamically
   */
  async loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Create Razorpay order
   */
  async createOrder(amount, receipt, notes = {}) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt,
          notes
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Create subscription before payment
   */
  async createSubscription(subscriptionData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Process subscription payment
   */
  async processSubscriptionPayment(paymentData) {
    try {
      // Load Razorpay script
      await this.loadRazorpayScript();

      // Create subscription first
      const subscription = await this.createSubscription({
        userId: paymentData.userId,
        planId: paymentData.planId,
        planName: paymentData.planName,
        price: paymentData.amount,
        maxListings: paymentData.maxListings,
        maxBoosts: paymentData.maxBoosts,
        maxPhotos: paymentData.maxPhotos
      });

      // Create order
      const order = await this.createOrder(
        paymentData.amount,
        `subscription_${Date.now()}`,
        {
          description: 'Subscription payment',
          plan_id: paymentData.planId,
          user_id: paymentData.userId
        }
      );

      // Razorpay options
      const options = {
        key: this.razorpayKey,
        amount: order.amount, // Amount is already in paise from backend
        currency: order.currency,
        name: 'RentYatra',
        description: paymentData.description,
        order_id: order.id,
        prefill: {
          name: paymentData.name,
          email: paymentData.email,
          contact: paymentData.phone,
        },
        notes: {
          payment_type: 'subscription_payment',
          plan_id: paymentData.planId
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response) => {
          try {
            // Verify payment
            const verificationResult = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: subscription.subscriptionId,
              amount: paymentData.amount
            });

            paymentData.onSuccess(verificationResult);
          } catch (error) {
            console.error('Error verifying payment:', error);
            paymentData.onError(error);
          }
        },
        modal: {
          ondismiss: () => {
            paymentData.onError(new Error('PAYMENT_CANCELLED'));
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error processing payment:', error);
      paymentData.onError(error);
    }
  }

  /**
   * Verify payment signature
   */
  async verifyPayment(paymentData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return data.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to get payment details');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  }
}

// Create singleton instance
const razorpayService = RazorpayService.getInstance();

export default razorpayService;
