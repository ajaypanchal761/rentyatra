import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import { MOCK_SUBSCRIPTIONS } from '../../../utils/adminMockData';

function SubscriptionManagementView() {
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesPlan = planFilter === 'All' || sub.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const totalRevenue = subscriptions.reduce((sum, sub) => {
    const price = parseFloat(sub.price.replace('$', ''));
    return sum + price;
  }, 0);

  const activeSubs = subscriptions.filter(s => s.status === 'Active').length;
  const expiringSubs = subscriptions.filter(s => s.status === 'Expiring Soon').length;

  const plans = ['All', 'Basic', 'Pro', 'Premium', 'Enterprise'];
  const statuses = ['All', 'Active', 'Expiring Soon', 'Expired', 'Cancelled'];

  const handleCancelSubscription = (subId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      setSubscriptions(subscriptions.map(s => 
        s.id === subId ? { ...s, status: 'Cancelled', autoRenew: false } : s
      ));
    }
  };

  const handleToggleAutoRenew = (subId) => {
    setSubscriptions(subscriptions.map(s => 
      s.id === subId ? { ...s, autoRenew: !s.autoRenew } : s
    ));
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Subscriptions</p>
              <p className="text-2xl font-bold text-slate-800">{activeSubs}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icons.SubscriptionIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Expiring Soon</p>
              <p className="text-2xl font-bold text-slate-800">{expiringSubs}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icons.ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icons.RevenueIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">{subscriptions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icons.UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Revenue Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Basic', 'Pro', 'Premium', 'Enterprise'].map((plan) => {
            const planSubs = subscriptions.filter(s => s.plan === plan);
            const planRevenue = planSubs.reduce((sum, sub) => {
              const price = parseFloat(sub.price.replace('$', ''));
              return sum + price;
            }, 0);
            const colors = {
              'Basic': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
              'Pro': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
              'Premium': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
              'Enterprise': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
            };
            
            return (
              <div key={plan} className={`${colors[plan].bg} ${colors[plan].border} border-2 rounded-lg p-4`}>
                <p className={`text-xs font-semibold ${colors[plan].text} mb-1`}>{plan}</p>
                <p className="text-2xl font-bold text-slate-900">${planRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-600 mt-1">{planSubs.length} subscribers</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Icons.SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {plans.map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Plan</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Start Date</th>
                <th scope="col" className="px-6 py-3">End Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Auto Renew</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubscriptions.map((sub) => (
                <tr key={sub.id} className="bg-white border-b hover:bg-slate-50">
                  {/* User */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{sub.userName}</p>
                      <p className="text-xs text-slate-500">{sub.userId}</p>
                    </div>
                  </td>
                  
                  {/* Plan */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      sub.plan === 'Basic' ? 'bg-blue-100 text-blue-800' :
                      sub.plan === 'Pro' ? 'bg-indigo-100 text-indigo-800' :
                      sub.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {sub.plan}
                    </span>
                  </td>
                  
                  {/* Price */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{sub.price}<span className="text-xs text-slate-500">/mo</span></p>
                  </td>
                  
                  {/* Start Date */}
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{sub.startDate}</p>
                  </td>
                  
                  {/* End Date */}
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{sub.endDate}</p>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                      sub.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                      sub.status === 'Expired' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  
                  {/* Auto Renew */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAutoRenew(sub.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        sub.autoRenew ? 'bg-green-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          sub.autoRenew ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCancelSubscription(sub.id)}
                        disabled={sub.status === 'Cancelled'}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-slate-700">
              of {filteredSubscriptions.length} subscriptions
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionManagementView;


