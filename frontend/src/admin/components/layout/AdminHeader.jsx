import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react';

function AdminHeader({ pageTitle, toggleSidebar }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, admin } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Clear any admin-specific data
      localStorage.removeItem('pendingAdmin');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if logout fails
      localStorage.removeItem('pendingAdmin');
      navigate('/admin/login');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 md:left-64 right-0 z-20">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="md:hidden mr-4 text-slate-600 hover:text-slate-800 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">{pageTitle}</h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!isDropdownOpen)} 
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
          >
            <img 
              className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200" 
              src="https://placehold.co/40x40/6366F1/FFFFFF?text=A" 
              alt="Admin Avatar" 
            />
            <span className="hidden md:inline font-medium text-slate-700">{admin?.name || 'Admin User'}</span>
            <ChevronDown 
              className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-2 border border-slate-200">
              <a href="#" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                <User className="h-4 w-4 mr-2" />
                Profile
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </a>
              <div className="border-t border-slate-100 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
