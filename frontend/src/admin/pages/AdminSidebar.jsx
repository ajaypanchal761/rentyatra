import * as Icons from '../icons/AdminIcons';

function AdminSidebar({ activePage, setActivePage }) {
  const navItems = [
    { name: 'Dashboard', icon: 'HomeIcon' },
    { name: 'Users', icon: 'UsersIcon' },
    { name: 'Products', icon: 'ProductsIcon' },
    { name: 'Categories', icon: 'CategoryIcon' },
    { name: 'Subscriptions', icon: 'SubscriptionIcon' },
    { name: 'Boosts', icon: 'BoostIcon' },
    { name: 'Payments', icon: 'PaymentIcon' },
    { name: 'Ad Banners', icon: 'BannerIcon' },
    { name: 'Notifications', icon: 'NotificationIcon' },
    { name: 'Referrals', icon: 'ReferralIcon' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-col fixed inset-y-0 left-0 z-30 hidden md:flex">
      <div className="flex items-center justify-center h-20 border-b border-slate-800">
        <Icons.ProductsIcon className="h-8 w-8 text-indigo-400" />
        <span className="text-2xl font-bold ml-2 text-white">RentYatra</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = activePage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-indigo-500 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;




