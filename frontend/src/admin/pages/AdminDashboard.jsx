import { useState } from 'react';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminHeader from '../components/layout/AdminHeader';
import DashboardView from '../components/views/DashboardView';
import UserManagementView from '../components/views/UserManagementView';

// Simple placeholder component for other sections
function PlaceholderView({ title }) {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
                <p className="text-slate-600 mt-2">This section is coming soon...</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 text-center">
                <div className="text-6xl text-slate-300 mb-4">🚧</div>
                <h2 className="text-xl font-semibold text-slate-700 mb-2">Under Development</h2>
                <p className="text-slate-500">This feature is currently being developed and will be available soon.</p>
            </div>
        </div>
    );
}

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
                return <PlaceholderView title="Product Management" />;
            case 'Categories':
                return <PlaceholderView title="Category Management" />;
            case 'Subscriptions':
                return <PlaceholderView title="Subscription Management" />;
            case 'Boosts':
                return <PlaceholderView title="Boost Management" />;
            case 'Payments':
                return <PlaceholderView title="Payment Management" />;
            case 'Ad Banners':
                return <PlaceholderView title="Ad Banner Management" />;
            case 'Notifications':
                return <PlaceholderView title="Notification Management" />;
            case 'Referrals':
                return <PlaceholderView title="Referral Management" />;
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
