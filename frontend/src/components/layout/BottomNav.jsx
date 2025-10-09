import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Plus, Package, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    if ((path === '/post-ad' || path === '/dashboard' || path === '/messages') && !isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      path: '/messages',
    },
    {
      id: 'rent',
      label: 'Rent Out',
      icon: Plus,
      path: '/post-ad',
      isMain: true,
    },
    {
      id: 'my-ads',
      label: 'My Rentals',
      icon: Package,
      path: '/dashboard',
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      path: isAuthenticated ? '/dashboard' : '/login',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isMain) {
            // Plus button with three-color border
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className="relative flex flex-col items-center justify-center -mt-8 group"
              >
                {/* Main button with gradient border */}
                <div className="relative">
                  {/* Three-color gradient border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-[3px]">
                    <div className="h-full w-full bg-white rounded-full"></div>
                  </div>
                  
                  {/* Inner white circle with black plus icon */}
                  <div className="relative bg-white rounded-full p-4 shadow-lg group-active:scale-95 transition-transform m-[3px]">
                    <Icon size={26} className="text-[#002f34]" strokeWidth={2.5} />
                  </div>
                </div>
                
                {/* Label */}
                <span className="text-[9px] font-semibold text-gray-700 mt-1.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className="flex flex-col items-center justify-center gap-1 py-2 px-3 transition-all active:scale-95"
            >
              <Icon
                size={20}
                className={`transition-colors ${
                  active ? 'text-[#002f34]' : 'text-gray-500'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              
              <span
                className={`text-[9px] font-semibold transition-colors ${
                  active ? 'text-[#002f34]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

