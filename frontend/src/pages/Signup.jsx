import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, Zap, Check, Send, Sparkles, Award, Users, TrendingUp, Upload, X } from 'lucide-react';
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

const Signup = () => {
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Aadhar card (front and back)
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharFrontPreview, setAadharFrontPreview] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [aadharBackPreview, setAadharBackPreview] = useState(null);
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  
  // UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleAadharFrontUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Aadhar card file size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for Aadhar card');
        return;
      }

      setAadharFront(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharFrontPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadharBackUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Aadhar card file size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for Aadhar card');
        return;
      }

      setAadharBack(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharBackPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAadharFront = () => {
    setAadharFront(null);
    setAadharFrontPreview(null);
  };

  const removeAadharBack = () => {
    setAadharBack(null);
    setAadharBackPreview(null);
  };

  // Validate form before sending OTP
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!aadharFront) {
      setError('Please upload Aadhar card front side (mandatory)');
      return false;
    }
    if (!aadharBack) {
      setError('Please upload Aadhar card back side (mandatory)');
      return false;
    }
    return true;
  };

  // Send OTP (Mock implementation)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsSendingOTP(true);

    // Mock API call - Replace with actual API call
    setTimeout(() => {
      // Simulate sending OTP
      console.log('📱 OTP sent to:', formData.phone);
      console.log('📧 OTP sent to:', formData.email);
      
      // In real implementation, backend will send OTP
      // For demo, we'll use 123456 as OTP
      console.log('🔑 Demo OTP: 123456');
      
      setOtpSent(true);
      setSuccess(`OTP sent successfully to ${formData.phone} and ${formData.email}`);
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

  // Verify OTP and create account
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
      // In real app, backend will verify the OTP
      if (otpValue === '123456') {
        // OTP verified successfully
        const userData = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          aadharCardFront: aadharFrontPreview,
          aadharCardBack: aadharBackPreview,
        };

        // In real app, backend will create the account
        // For now, we'll just store it temporarily
        localStorage.setItem('pendingUser', JSON.stringify(userData));
        
        setSuccess('Account created successfully! Please login to continue...');
        
        setTimeout(() => {
          navigate('/login');
        }, 1000);
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

  // Go back to form editing
  const handleEditDetails = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:bg-gradient-to-br md:from-slate-50 md:via-purple-50 md:to-pink-100">
      {/* Left Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">
          {/* Animated Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Grid Pattern */}
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
                  <Sparkles size={16} className="text-yellow-300" />
                  <span className="text-sm font-semibold">Join 50,000+ Happy Users</span>
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                Start Your
                <br />
                <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  Rental Journey
                </span>
              </h1>
              
              <p className="text-xl text-purple-100 leading-relaxed">
                Create your account in seconds. List items, earn money, and connect with thousands of renters!
              </p>
            </div>

            {/* Benefits with Icons */}
            <div className="mt-12 space-y-4">
              {[
                { icon: Zap, text: 'List items in under 2 minutes', gradient: 'from-yellow-400 to-orange-500' },
                { icon: Users, text: 'Reach 100K+ potential renters', gradient: 'from-blue-400 to-indigo-500' },
                { icon: Shield, text: 'Secure OTP verification', gradient: 'from-green-400 to-emerald-500' },
                { icon: Award, text: 'Build your rental reputation', gradient: 'from-pink-400 to-rose-500' },
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-lg font-semibold">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Users, value: '50K+', label: 'Users' },
              { icon: Award, value: '4.9★', label: 'Rating' },
              { icon: TrendingUp, value: '₹10Cr+', label: 'GMV' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <Icon className="mb-2 opacity-80" size={24} />
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs text-purple-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center md:p-12 relative min-h-screen md:min-h-0">
        {/* Mobile Full-Screen Background */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700">
          {/* Animated Orbs for Mobile */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="w-full md:max-w-md relative z-10 h-full md:h-auto flex items-center">
          {/* Form Container - Full Screen Mobile */}
          <div className="w-full bg-white md:rounded-3xl md:shadow-2xl p-6 md:p-10 md:border border-gray-100 relative overflow-hidden min-h-screen md:min-h-0 flex flex-col justify-center">
            {/* Decorative Gradients - Desktop Only */}
            <div className="hidden md:block absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 blur-3xl rounded-full"></div>
            <div className="hidden md:block absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500 to-rose-600 opacity-10 blur-3xl rounded-full"></div>
            
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
                      Verify <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">OTP</span>
                    </>
                  ) : (
                    <>
                      Create <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Account</span>
                    </>
                  )}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  {otpSent 
                    ? 'Almost there! Enter your verification code' 
                    : 'Join thousands of happy users today'
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
                /* Step 1: Registration Form */
                <form onSubmit={handleSendOTP} className="space-y-3 md:space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs md:text-sm font-bold text-gray-800">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-focus-within:scale-110 transition-transform">
                          <User className="text-white" size={14} />
                        </div>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 md:py-3.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs md:text-sm font-bold text-gray-800">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-focus-within:scale-110 transition-transform">
                          <Mail className="text-white" size={14} />
                        </div>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 md:py-3.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs md:text-sm font-bold text-gray-800">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-focus-within:scale-110 transition-transform">
                          <Phone className="text-white" size={14} />
                        </div>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3 md:py-3.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Aadhar Card Upload - Front & Back */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-800">
                      <Shield size={16} className="text-orange-600" />
                      Aadhar Card (Both Sides)
                      <span className="text-red-600 text-[10px] md:text-xs font-black px-2 py-0.5 bg-red-50 rounded-full">Required</span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Front Side */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-gray-700">Front Side</p>
                        {!aadharFrontPreview ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAadharFrontUpload}
                              className="hidden"
                              id="aadhar-front-upload"
                            />
                            <label
                              htmlFor="aadhar-front-upload"
                              className="flex flex-col items-center justify-center w-full p-3 md:p-4 border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl cursor-pointer hover:border-orange-500 hover:from-orange-100 hover:to-amber-100 transition-all group"
                            >
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-lg">
                                <Upload className="text-white" size={18} />
                              </div>
                              <p className="text-xs md:text-sm text-gray-700 font-bold">Upload Front</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">Max 5MB</p>
                            </label>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div className="relative rounded-xl overflow-hidden border-2 border-green-400 shadow-lg">
                              <img
                                src={aadharFrontPreview}
                                alt="Aadhar Front"
                                className="w-full h-24 md:h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={removeAadharFront}
                                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 flex items-center gap-1.5 shadow-xl text-xs"
                                >
                                  <X size={14} />
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 shadow-lg">
                              <Check size={10} />
                              ✓
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Back Side */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-gray-700">Back Side</p>
                        {!aadharBackPreview ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAadharBackUpload}
                              className="hidden"
                              id="aadhar-back-upload"
                            />
                            <label
                              htmlFor="aadhar-back-upload"
                              className="flex flex-col items-center justify-center w-full p-3 md:p-4 border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl cursor-pointer hover:border-orange-500 hover:from-orange-100 hover:to-amber-100 transition-all group"
                            >
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-lg">
                                <Upload className="text-white" size={18} />
                              </div>
                              <p className="text-xs md:text-sm text-gray-700 font-bold">Upload Back</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">Max 5MB</p>
                            </label>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div className="relative rounded-xl overflow-hidden border-2 border-green-400 shadow-lg">
                              <img
                                src={aadharBackPreview}
                                alt="Aadhar Back"
                                className="w-full h-24 md:h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={removeAadharBack}
                                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 flex items-center gap-1.5 shadow-xl text-xs"
                                >
                                  <X size={14} />
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 shadow-lg">
                              <Check size={10} />
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1.5 ml-1">
                      <Shield size={10} className="text-indigo-600" />
                      Securely encrypted • Used only for verification
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="pt-2">
                    <label className="flex items-start cursor-pointer group">
                      <input 
                        type="checkbox" 
                        required 
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
                      />
                      <span className="ml-2 text-xs md:text-sm text-gray-600 group-hover:text-gray-900 transition">
                        I agree to <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-bold underline">Terms</Link> & <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-bold underline">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSendingOTP}
                    className="w-full py-3.5 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-600/50 transition-all group rounded-xl md:rounded-2xl"
                  >
                    {isSendingOTP ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Send OTP</span>
                        <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={18} />
                      </div>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Shield size={14} className="text-green-600" />
                    <span className="text-xs text-gray-600 font-semibold">256-bit Secure Encryption</span>
                  </div>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleVerifyOTP} className="space-y-4 md:space-y-6">
                  {/* OTP Input with Decorative Box */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 md:p-6 border-2 border-purple-200 relative overflow-hidden">
                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 opacity-20 blur-2xl"></div>
                      
                      <div className="relative z-10">
                        <OTPInput
                          length={6}
                          value={otp}
                          onChange={handleOTPChange}
                          disabled={isVerifying}
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm md:text-base text-gray-700 font-semibold">
                        Enter your verification code
                      </p>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-300">
                        <Zap size={14} className="text-purple-600" />
                        <span className="text-xs text-purple-700 font-bold">Demo OTP:</span>
                        <span className="text-sm font-black text-purple-900 font-mono">123456</span>
                      </div>
                    </div>
                  </div>

                  {/* Resend Timer */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-3 border border-gray-200">
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
                    className="w-full py-3.5 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-600/50 transition-all rounded-xl md:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Check size={18} />
                        <span>Verify & Create Account</span>
                      </div>
                    )}
                  </Button>

                  {/* Edit Details */}
                  <button
                    type="button"
                    onClick={handleEditDetails}
                    className="w-full text-sm text-gray-600 hover:text-indigo-600 font-bold transition py-2 hover:bg-indigo-50 rounded-lg flex items-center justify-center gap-2 group"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Edit Details</span>
                  </button>
                </form>
              )}

              {/* Login Link */}
              <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
                <div className="text-center space-y-3">
                  <p className="text-gray-600 text-sm md:text-base font-medium">
                    Already have an account?
                  </p>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105 group"
                  >
                    <span>Login to Your Account</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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

export default Signup;
