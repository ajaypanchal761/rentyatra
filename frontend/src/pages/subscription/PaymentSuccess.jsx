import { CheckCircle, ArrowRight, Download, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mock order details (will come from URL params or state)
  const orderDetails = {
    orderId: `ORD-${Date.now()}`,
    plan: 'Premium Plan',
    amount: 1061,
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    email: 'user@example.com'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Confetti Effect (CSS-based) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][
                  Math.floor(Math.random() * 5)
                ],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Success Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slide-up">
        {/* Success Icon */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl animate-bounce">
              <CheckCircle size={56} className="text-green-500" strokeWidth={3} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Payment Successful!
            </h1>
            <p className="text-xl text-green-100">
              Your subscription is now active
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8 md:p-12">
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📄</span>
              Order Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono font-bold text-gray-900">
                  {orderDetails.orderId}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Plan</span>
                <span className="font-bold text-gray-900">{orderDetails.plan}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-2xl font-black text-green-600">
                  ₹{orderDetails.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold text-gray-900">{orderDetails.date}</span>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-sm text-blue-800">
              📧 Receipt sent to: <span className="font-bold">{orderDetails.email}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/post-ad')}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Add Your First Product</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </Button>

            <Button
              onClick={() => navigate('/my-subscription')}
              className="w-full py-4 bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>View Dashboard</span>
            </Button>

            <button
              onClick={() => alert('Download receipt feature coming soon!')}
              className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>Download Receipt</span>
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg font-semibold mb-2">
              🎉 Thank you for choosing RentYatra!
            </p>
            <p className="text-sm text-gray-500">
              Start listing your products and earn passive income today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

