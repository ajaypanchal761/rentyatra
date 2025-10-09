import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ScrollToTop from './components/common/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import SubscriptionNotifications from './components/subscription/SubscriptionNotifications';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ItemDetail from './pages/ItemDetail';
import CategoryDetail from './pages/CategoryDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostAd from './pages/PostAd';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import MySubscription from './pages/subscription/MySubscription';
import MyBoosts from './pages/subscription/MyBoosts';
import PaymentSuccess from './pages/subscription/PaymentSuccess';
import PaymentFailed from './pages/subscription/PaymentFailed';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/category/');
  const hideFooter = location.pathname === '/' || location.pathname.startsWith('/category/');
  
  // Hide navbars on auth pages and dashboard for small screens
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname === '/favorites' || location.pathname === '/bookings' || location.pathname === '/messages';
  const hideNavbarMobile = hideNavbar || isAuthPage || isDashboardPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <div className={(isAuthPage || isDashboardPage) ? 'hidden md:block' : ''}><Navbar /></div>}
      <SubscriptionNotifications />
      <main className={`flex-1 ${!hideNavbarMobile ? 'pb-24 md:pb-0' : (isAuthPage || isDashboardPage) ? 'pb-0 md:pb-0' : 'pb-20 md:pb-4'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/category/:categorySlug" element={<CategoryDetail />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-ad" element={<PostAd />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:tab" element={<Dashboard />} />
          <Route path="/favorites" element={<Dashboard />} />
          <Route path="/bookings" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* Subscription Routes */}
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/my-subscription" element={<MySubscription />} />
          <Route path="/my-boosts" element={<MyBoosts />} />
          <Route path="/subscription/success" element={<PaymentSuccess />} />
          <Route path="/subscription/failed" element={<PaymentFailed />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <div className={(isAuthPage || isDashboardPage) ? 'hidden md:block' : ''}>
        <BottomNav />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <AppProvider>
          <SubscriptionProvider>
            <AppContent />
          </SubscriptionProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
