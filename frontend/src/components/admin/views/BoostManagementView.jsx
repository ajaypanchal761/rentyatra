import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import { MOCK_BOOSTS } from '../../../utils/adminMockData';

function BoostManagementView() {
  const [boosts, setBoosts] = useState(MOCK_BOOSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter boosts
  const filteredBoosts = boosts.filter(boost => {
    const matchesSearch = boost.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boost.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boost.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || boost.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBoosts.length / itemsPerPage);
  const paginatedBoosts = filteredBoosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const totalRevenue = boosts.reduce((sum, boost) => {
    const price = parseFloat(boost.price.replace('$', ''));
    return sum + price;
  }, 0);

  const activeBoosts = boosts.filter(b => b.status === 'Active').length;

  const statuses = ['All', 'Active', 'Expired', 'Scheduled'];

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Boosts</p>
              <p className="text-2xl font-bold text-slate-800">{activeBoosts}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Icons.BoostIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icons.RevenueIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg. CTR</p>
              <p className="text-2xl font-bold text-slate-800">3.8%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icons.ChartIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-slate-800">12.4%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icons.TrendIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Icons.SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search product, user, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Boosts Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Plan</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Start Date</th>
                <th scope="col" className="px-6 py-3">End Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBoosts.map((boost) => (
                <tr key={boost.id} className="bg-white border-b hover:bg-slate-50">
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{boost.productTitle}</p>
                      <p className="text-xs text-slate-500">{boost.productId}</p>
                    </div>
                  </td>
                  
                  {/* User */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{boost.userName}</p>
                      <p className="text-xs text-slate-500">{boost.userId}</p>
                    </div>
                  </td>
                  
                  {/* Plan */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                      {boost.plan}
                    </span>
                  </td>
                  
                  {/* Price */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{boost.price}</p>
                  </td>
                  
                  {/* Start Date */}
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{boost.startDate}</p>
                  </td>
                  
                  {/* End Date */}
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{boost.endDate}</p>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      boost.status === 'Active' ? 'bg-green-100 text-green-800' :
                      boost.status === 'Expired' ? 'bg-gray-100 text-gray-600' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {boost.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                      View Details
                    </button>
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
              of {filteredBoosts.length} boosts
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

export default BoostManagementView;


