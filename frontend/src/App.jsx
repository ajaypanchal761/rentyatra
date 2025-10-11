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
import AdminDashboard from './pages/Admindashboard/AdminDashboard';


function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // If it's an admin page, render it directly without any of the other app layout
  if (isAdminPage) {
    return (
      <main>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
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

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <div className={isDashboardPage ? 'hidden md:block' : ''}><Navbar /></div>}
      <SubscriptionNotifications />
      <main className={`flex-1 ${!shouldHideNavbar && !isDashboardPage ? 'pb-24 md:pb-0' : isDashboardPage ? 'pb-0 md:pb-0' : 'pb-0'}`}>
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
      {!shouldHideFooter && <Footer />}
      <div className={(isAuthPage || isDashboardPage) ? 'hidden' : ''}>
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
