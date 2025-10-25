import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { SocketProvider } from './contexts/SocketContext';
import ScrollToTop from './components/common/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import SubscriptionNotifications from './components/subscription/SubscriptionNotifications';

// Debug component to expose debug functions to window object
const DebugHelper = () => {
  const { debugFavorites, clearAllFavorites, cleanupFavorites, forceResetFavorites, nuclearResetFavorites, forceEmptyFavorites, forceClearAllFavorites, nuclearResetCount, forceResetToZero, completeNuclearReset, testFavoritesCount, checkAllFavoritesData } = useApp();
  
  // Expose debug functions to window object for console debugging
  React.useEffect(() => {
    window.debugFavorites = debugFavorites;
    window.clearAllFavorites = clearAllFavorites;
    window.cleanupFavorites = cleanupFavorites;
    window.forceResetFavorites = forceResetFavorites;
    window.nuclearResetFavorites = nuclearResetFavorites;
    window.forceEmptyFavorites = forceEmptyFavorites;
    window.forceClearAllFavorites = forceClearAllFavorites;
    window.nuclearResetCount = nuclearResetCount;
    window.forceResetToZero = forceResetToZero;
    window.completeNuclearReset = completeNuclearReset;
    window.testFavoritesCount = testFavoritesCount;
    window.checkAllFavoritesData = checkAllFavoritesData;
    
    return () => {
      delete window.debugFavorites;
      delete window.clearAllFavorites;
      delete window.cleanupFavorites;
      delete window.forceResetFavorites;
      delete window.nuclearResetFavorites;
      delete window.forceEmptyFavorites;
      delete window.forceClearAllFavorites;
      delete window.nuclearResetCount;
      delete window.forceResetToZero;
      delete window.completeNuclearReset;
      delete window.testFavoritesCount;
      delete window.checkAllFavoritesData;
    };
  }, [debugFavorites, clearAllFavorites, cleanupFavorites, forceResetFavorites, nuclearResetFavorites, forceEmptyFavorites, forceClearAllFavorites, nuclearResetCount, forceResetToZero, completeNuclearReset, testFavoritesCount, checkAllFavoritesData]);
  
  return null;
};
import Home from './user/pages/Home';
import Listings from './user/pages/Listings';
import ItemDetail from './user/pages/ItemDetail';
import CategoryDetail from './user/pages/CategoryDetail';
import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import PostAd from './user/pages/PostAd';
import Dashboard from './user/pages/Dashboard';
import Profile from './user/pages/Profile';
import Messages from './user/pages/Messages';
import Chat from './user/pages/Chat';
import Favorites from './user/pages/Favorites';
import SubscriptionPage from './user/pages/subscription/SubscriptionPage';
import MySubscription from './user/pages/subscription/MySubscription';
import MyBoosts from './user/pages/subscription/MyBoosts';
import PaymentFailed from './user/pages/subscription/PaymentFailed';
import FAQs from './user/pages/FAQs';
import SupportTicket from './user/pages/SupportTicket';
import PrivacyPolicy from './user/pages/PrivacyPolicy';
import TermsAndConditions from './user/pages/TermsAndConditions';
import AboutUs from './user/pages/AboutUs';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/pages/AdminLogin';
import AdminSignup from './admin/pages/AdminSignup';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';


function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const hideNavbar = location.pathname.startsWith('/category');
  const hideFooter = location.pathname === '/' || location.pathname.startsWith('/category');
  
  // Hide navbars on auth pages, dashboard, and chat pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname === '/favorites' || location.pathname === '/bookings' || location.pathname === '/messages';
  const isChatPage = location.pathname.startsWith('/chat');
  
  // Hide navbar and footer completely on auth pages and chat pages
  const shouldHideNavbar = hideNavbar || isAuthPage || isChatPage;
  const shouldHideFooter = hideFooter || isAuthPage || isChatPage;
  
  // Bottom navigation should be visible on all user pages except auth pages and chat pages
  const shouldShowBottomNav = !isAuthPage && !isChatPage;

  // Admin pages - no navbar/footer but still need context
  if (isAdminPage) {
    return (
      <main>
        <Routes>
          {/* Admin Authentication Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
        </Routes>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <div className={isDashboardPage ? 'hidden md:block' : ''}><Navbar /></div>}
      <SubscriptionNotifications />
      <main className={`flex-1 ${shouldShowBottomNav ? 'pb-20 md:pb-0' : 'pb-0'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/category" element={<CategoryDetail />} />
          <Route path="/category/:categorySlug" element={<CategoryDetail />} />
          <Route path="/category/:categorySlug/rentals" element={<CategoryDetail />} />
          <Route path="/rental/:id" element={<ItemDetail />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Dashboard Routes */}
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:tab" element={<Dashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/bookings" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/post-ad" element={<PostAd />} />
          
          {/* Subscription Routes */}
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/my-subscription" element={<MySubscription />} />
          <Route path="/my-boosts" element={<MyBoosts />} />
          <Route path="/subscription/failed" element={<PaymentFailed />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/support-ticket" element={<SupportTicket />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/about-us" element={<AboutUs />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl font-bold">Page Not Found</h1></div>} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
      {shouldShowBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <AdminAuthProvider>
          <CategoryProvider>
            <AppProvider>
              <DebugHelper />
              <SubscriptionProvider>
                <SocketProvider>
                  <AppContent />
                </SocketProvider>
              </SubscriptionProvider>
            </AppProvider>
          </CategoryProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
