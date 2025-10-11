import { useState } from 'react';
import AdminSidebar from '../../components/admin/layout/AdminSidebar';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import DashboardView from '../../components/admin/views/DashboardView';
import UserManagementView from '../../components/admin/views/UserManagementView';
import ProductManagementView from '../../components/admin/views/ProductManagementView';
import SubscriptionManagementView from '../../components/admin/views/SubscriptionManagementView';
import BoostManagementView from '../../components/admin/views/BoostManagementView';
import PaymentManagementView from '../../components/admin/views/PaymentManagementView';
import NotificationManagementView from '../../components/admin/views/NotificationManagementView';
import ReferralManagementView from '../../components/admin/views/ReferralManagementView';
import AdBannerManagementView from '../../components/admin/views/AdBannerManagementView';
import PlaceholderView from '../../components/admin/views/PlaceholderView';

export default function AdminDashboard() {
    const [activePage, setActivePage] = useState('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardView />;
            case 'Users':
        return <UserManagementView />;
            case 'Products':
        return <ProductManagementView />;
            case 'Subscriptions':
        return <SubscriptionManagementView />;
            case 'Boosts':
        return <BoostManagementView />;
            case 'Payments':
        return <PaymentManagementView />;
            case 'Ad Banners':
        return <AdBannerManagementView />;
            case 'Notifications':
        return <NotificationManagementView />;
            case 'Referrals':
        return <ReferralManagementView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none opacity-0'
        }`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      
            {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar 
          activePage={activePage} 
          setActivePage={(page) => {
                    setActivePage(page);
                    setSidebarOpen(false);
          }} 
        />
            </div>

            {/* Desktop Sidebar */}
      <AdminSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <AdminHeader 
          pageTitle={activePage} 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
        />
                <main className="flex-1 p-4 md:p-8 mt-16">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
