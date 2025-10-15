import { 
  Users, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Activity,
  Star
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '0',
      change: null,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Products',
      value: '0',
      change: null,
      icon: Package,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: '₹0',
      change: null,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Page Views',
      value: '0',
      change: null,
      icon: Eye,
      color: 'orange'
    },
    {
      title: 'Active Subscriptions',
      value: '0',
      change: null,
      icon: CreditCard,
      color: 'indigo'
    },
    {
      title: 'Conversion Rate',
      value: '0%',
      change: null,
      icon: TrendingUp,
      color: 'red'
    }
  ];

  // Recent activities will be fetched from API
  const recentActivities = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardView;