import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Shield, Zap, Check, Send, Sparkles, Award, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import OTPInput from '../components/auth/OTPInput';
import ResendTimer from '../components/auth/ResendTimer';

// Custom Arrow components
const ArrowRight = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeft = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const Login = () => {
  // Form data
  const [phone, setPhone] = useState('');
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  
  // UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check if user just signed up
  useEffect(() => {
    const pendingUser = localStorage.getItem('pendingUser');
    if (pendingUser) {
      setIsNewUser(true);
      setSuccess('🎉 Account created! Please login with your credentials.');
      // Clear the pending user after showing message
      setTimeout(() => {
        localStorage.removeItem('pendingUser');
        setIsNewUser(false);
      }, 5000);
    }
  }, []);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError('');
  };

  // Validate phone number
  const validatePhone = () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (!/^[\d\s\+\-\(\)]+$/.test(phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  // Send OTP (Mock implementation)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePhone()) return;

    setIsSendingOTP(true);

    // Mock API call - Replace with actual API call
    setTimeout(() => {
      // Simulate sending OTP
      console.log(`📱 OTP sent to: ${phone}`);
      
      // In real implementation, backend will send OTP
      // For demo, we'll use 123456 as OTP
      console.log('🔑 Demo OTP: 123456');
      
      // Mask phone number for display
      const maskedPhone = phone.replace(/(\d{2})(\d+)(\d{4})/, '$1*****$3');
      
      setOtpSent(true);
      setSuccess(`OTP sent successfully to ${maskedPhone}`);
      setIsSendingOTP(false);
    }, 400);
  };

  // Resend OTP
  const handleResendOTP = () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    
    // Mock API call
    console.log('🔄 Resending OTP...');
    setSuccess('OTP resent successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  // Verify OTP and login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);

    // Mock API call - Replace with actual API call
    setTimeout(() => {
      // Mock OTP verification
      // In real app, backend will verify the OTP and return user data
      if (otpValue === '123456') {
        // OTP verified successfully - Mock user data
        const userData = {
          id: Date.now(),
          name: 'Demo User',
          email: 'demo@example.com',
          phone: phone,
        };

        login(userData);
        setSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        setError('Invalid OTP. Please try again or resend OTP. (Demo OTP: 123456)');
        setIsVerifying(false);
      }
    }, 400);
  };

  // Auto-verify when all 6 digits are entered
  const handleOTPChange = (newOTP) => {
    setOtp(newOTP);
    setError('');
    
    // Auto-verify if all 6 digits are filled
    if (newOTP.every(digit => digit !== '') && !isVerifying) {
      setTimeout(() => {
        const otpValue = newOTP.join('');
        if (otpValue.length === 6) {
          handleVerifyOTP({ preventDefault: () => {} });
        }
      }, 200);
    }
  };

  // Go back to phone input
  const handleEditPhone = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:bg-gradient-to-br md:from-slate-50 md:via-blue-50 md:to-indigo-100">
      {/* Left Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900">
          {/* Animated Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo & Header */}
          <div>
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white" size={28} />
                </div>
                <span className="text-3xl font-black">RentX</span>
              </div>
            </Link>
            
            <div className="space-y-6 max-w-lg">
              <div className="inline-block">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Secure OTP Login</span>
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                Welcome
                <br />
                <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Back!
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Login instantly with OTP. No passwords to remember - just verify and you're in!
              </p>
            </div>

            {/* Feature Pills */}
            <div className="mt-12 flex flex-wrap gap-3">
              {[
                { icon: Shield, text: 'Secure' },
                { icon: Zap, text: 'Instant' },
                { icon: Award, text: 'Trusted' },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <Icon size={16} />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Users, value: '50K+', label: 'Active Users' },
              { icon: Award, value: '4.9★', label: 'Rating' },
              { icon: TrendingUp, value: '₹10Cr+', label: 'Transactions' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Icon className="mb-2 opacity-80" size={24} />
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center md:p-12 relative min-h-screen md:min-h-0">
        {/* Mobile Full-Screen Background */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
          {/* Animated Orbs for Mobile */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="w-full md:max-w-md relative z-10 h-full md:h-auto flex items-center">
          {/* Form Container - Full Screen Mobile */}
          <div className="w-full bg-white md:rounded-3xl md:shadow-2xl p-6 md:p-10 md:border border-gray-100 relative overflow-hidden min-h-screen md:min-h-0 flex flex-col justify-center">
            {/* Decorative Gradient - Desktop Only */}
            <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 blur-3xl rounded-full"></div>
            <div className="hidden md:block absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-pink-600 opacity-10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10">
              {/* Back Button - Mobile Only */}
              <Link 
                to="/" 
                className="md:hidden inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold mb-6 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Home</span>
              </Link>

              {/* Header */}
              <div className="mb-5 md:mb-8">
                <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-2 md:mb-3 leading-tight">
                  {otpSent ? (
                    <>
                      Verify <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">OTP</span>
                    </>
                  ) : (
                    <>
                      Welcome <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Back!</span>
                    </>
                  )}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  {otpSent 
                    ? 'Enter the code we sent to your phone' 
                    : 'Login securely with OTP verification'
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl animate-slide-up">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-700 text-xs md:text-sm font-medium flex-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-slide-up">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-white" />
                    </div>
                    <p className="text-green-700 text-xs md:text-sm font-medium flex-1">{success}</p>
                  </div>
                </div>
              )}

              {!otpSent ? (
                /* Step 1: Enter Phone Number */
                <form onSubmit={handleSendOTP} className="space-y-4 md:space-y-5">
                  {/* Phone Number Input */}
                  <div className="space-y-2">
                    <label className="block text-sm md:text-base font-bold text-gray-800">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-focus-within:scale-110 transition-transform">
                          <Phone className="text-white" size={16} />
                        </div>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-14 pr-4 py-3.5 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 ml-1">
                      <Shield size={12} className="text-blue-600" />
                      OTP will be sent via SMS
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSendingOTP}
                    className="w-full py-3.5 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-600/50 transition-all group rounded-xl md:rounded-2xl"
                  >
                    {isSendingOTP ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Send OTP</span>
                        <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={18} />
                      </div>
                    )}
                  </Button>

                  {/* Security Info */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Shield size={14} className="text-green-600" />
                    <span className="text-xs text-gray-600 font-medium">Protected by 256-bit encryption</span>
                  </div>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleVerifyOTP} className="space-y-4 md:space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border border-blue-200">
                      <OTPInput
                        length={6}
                        value={otp}
                        onChange={handleOTPChange}
                        disabled={isVerifying}
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm md:text-base text-gray-700 font-medium">
                        Enter the 6-digit verification code
                      </p>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full border border-indigo-200">
                        <span className="text-xs text-indigo-700 font-bold">Demo OTP:</span>
                        <span className="text-sm font-black text-indigo-900 font-mono">123456</span>
                      </div>
                    </div>
                  </div>

                  {/* Resend Timer */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <ResendTimer
                      initialTime={30}
                      onResend={handleResendOTP}
                      disabled={isVerifying}
                    />
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    disabled={isVerifying || otp.join('').length !== 6}
                    className="w-full py-3.5 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-600/50 transition-all rounded-xl md:rounded-2xl"
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Check size={18} />
                        <span>Verify & Login</span>
                      </div>
                    )}
                  </Button>

                  {/* Edit Phone */}
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 font-semibold transition py-2 hover:bg-gray-50 rounded-lg"
                  >
                    ← Change Phone Number
                  </button>
                </form>
              )}

              {/* Signup Link */}
              <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm md:text-base mb-3">
                    Don't have an account?
                  </p>
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105 group"
                  >
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    <span>Create Account</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
