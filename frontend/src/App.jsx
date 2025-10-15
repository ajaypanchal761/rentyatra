import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AppProvider } from './contexts/AppContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { CategoryProvider } from './contexts/CategoryContext';
import ScrollToTop from './components/common/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import SubscriptionNotifications from './components/subscription/SubscriptionNotifications';
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
import SubscriptionPage from './user/pages/subscription/SubscriptionPage';
import MySubscription from './user/pages/subscription/MySubscription';
import MyBoosts from './user/pages/subscription/MyBoosts';
import PaymentSuccess from './user/pages/subscription/PaymentSuccess';
import PaymentFailed from './user/pages/subscription/PaymentFailed';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/pages/AdminLogin';
import AdminSignup from './admin/pages/AdminSignup';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';


function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Admin pages - still need context but no navbar/footer
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
  
  const hideNavbar = location.pathname.startsWith('/category/');
  const hideFooter = location.pathname === '/' || location.pathname.startsWith('/category/');
  
  // Hide navbars on auth pages and dashboard
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname === '/favorites' || location.pathname === '/bookings' || location.pathname === '/messages';
  
  // Hide navbar and footer completely on auth pages
  const shouldHideNavbar = hideNavbar || isAuthPage;
  const shouldHideFooter = hideFooter || isAuthPage;
  
  // Bottom navigation should be visible on all user pages except auth pages
  const shouldShowBottomNav = !isAuthPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <div className={isDashboardPage ? 'hidden md:block' : ''}><Navbar /></div>}
      <SubscriptionNotifications />
      <main className={`flex-1 ${shouldShowBottomNav ? 'pb-20 md:pb-0' : 'pb-0'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/category/:categorySlug" element={<CategoryDetail />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Dashboard Routes */}
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:tab" element={<Dashboard />} />
          <Route path="/favorites" element={<Dashboard />} />
          <Route path="/bookings" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/post-ad" element={<PostAd />} />
          
          {/* Subscription Routes */}
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/my-subscription" element={<MySubscription />} />
          <Route path="/my-boosts" element={<MyBoosts />} />
          <Route path="/subscription/success" element={<PaymentSuccess />} />
          <Route path="/subscription/failed" element={<PaymentFailed />} />
          
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
              <SubscriptionProvider>
                <AppContent />
              </SubscriptionProvider>
            </AppProvider>
          </CategoryProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
