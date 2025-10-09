import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Sparkles, Shield, Zap, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 1) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Mock signup - in real app, this would call an API
    const userData = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    signup(userData);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Hero Section with Gradient */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-black text-white mb-8">RentX</div>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
              Join<br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                RentX Community
              </span>
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed max-w-lg">
              Start your rental journey today! Rent out what you don't need, or find exactly what you're looking for.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 space-y-4">
            {[
              { icon: Check, text: 'List items in under 2 minutes' },
              { icon: Check, text: 'Reach 100K+ potential renters' },
              { icon: Check, text: 'Secure payments & transactions' },
              { icon: Check, text: 'Build your rental reputation' },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="text-lg font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-white text-lg italic mb-3">
              "RentX made it so easy to rent out my camera gear. I've already earned ₹50,000!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <div>
                <div className="text-white font-semibold">Rahul Sharma</div>
                <div className="text-purple-200 text-sm">Professional Photographer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="md:hidden inline-block mb-4">
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              RentX
            </div>
          </Link>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 border border-gray-100">
            <div className="mb-4 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2">
                Get Started Free
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Create your account to start renting today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl animate-slide-up">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <div className="relative group">
                  <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">
                  Password *
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-12 pr-14 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${
                      passwordStrength.strength === 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                      passwordStrength.strength === 3 ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">
                  Confirm Password *
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" size={16} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-12 pr-14 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <Check size={14} /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="pt-2">
                <label className="flex items-start cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition">
                    I agree to the <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-semibold">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all group">
                Create Account
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition">
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Benefits */}
          <div className="md:hidden mt-8 space-y-3">
            {[
              { icon: Sparkles, text: '50,000+ rental items' },
              { icon: Shield, text: 'Secure transactions' },
              { icon: Zap, text: 'Quick & easy listing' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-gray-600">
                  <Icon size={20} className="text-indigo-600" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

