import StatCard from '../common/StatCard';
import { MOCK_STATS } from '../../../utils/adminMockData';
import RevenueChart from '../charts/RevenueChart';
import CategoryChart from '../charts/CategoryChart';
import UserGrowthChart from '../charts/UserGrowthChart';

function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Stats Grid - 6 key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_STATS.map(item => <StatCard key={item.id} item={item} />)}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart - Full Width on Mobile, Half on Desktop */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Category Chart */}
        <CategoryChart />

        {/* User Growth Chart */}
        <UserGrowthChart />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Add Product</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Add User</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Send Notification</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all group">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New user registered', user: 'John Doe', time: '2 minutes ago', type: 'user', color: 'blue' },
            { action: 'Product approved', user: 'Admin', time: '15 minutes ago', type: 'product', color: 'green' },
            { action: 'Payment received', user: 'Jane Smith', time: '1 hour ago', type: 'payment', color: 'purple' },
            { action: 'Product rejected', user: 'Admin', time: '2 hours ago', type: 'product', color: 'red' },
            { action: 'Subscription upgraded', user: 'Mike Johnson', time: '3 hours ago', type: 'subscription', color: 'indigo' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                <div className={`w-2 h-2 bg-${activity.color}-600 rounded-full`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                <p className="text-xs text-slate-500">{activity.user}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardView;

