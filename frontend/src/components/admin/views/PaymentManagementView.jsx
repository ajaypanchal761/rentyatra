import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import { MOCK_PAYMENTS } from '../../../utils/adminMockData';

function PaymentManagementView() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    const matchesType = typeFilter === 'All' || payment.type === typeFilter;
    const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const totalRevenue = payments.reduce((sum, payment) => {
    if (payment.status === 'Completed') {
      const amount = parseFloat(payment.amount.replace('$', '').replace(',', ''));
      return sum + amount;
    }
    return sum;
  }, 0);

  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;

  const statuses = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];
  const types = ['All', 'Subscription', 'Boost', 'Product', 'Other'];
  const methods = ['All', 'Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'];

  const handleRefund = (paymentId) => {
    if (window.confirm('Are you sure you want to process a refund for this payment?')) {
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, status: 'Refunded' } : p
      ));
    }
  };

  const handleExport = () => {
    alert('Exporting payment data to CSV...');
    // Implementation for export functionality
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <p className="text-sm text-slate-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-slate-800">{completedPayments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icons.CheckIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{pendingPayments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icons.ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Failed</p>
              <p className="text-2xl font-bold text-slate-800">{failedPayments}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Icons.CloseIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {methods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Icons.DownloadIcon className="h-4 w-4" />
            Export to CSV
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Transaction ID</th>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Method</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.id} className="bg-white border-b hover:bg-slate-50">
                  {/* Transaction ID */}
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-slate-600">{payment.id}</p>
                  </td>
                  
                  {/* User */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{payment.userName}</p>
                      <p className="text-xs text-slate-500">{payment.userId}</p>
                    </div>
                  </td>
                  
                  {/* Type */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      payment.type === 'Subscription' ? 'bg-purple-100 text-purple-800' :
                      payment.type === 'Boost' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  
                  {/* Amount */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{payment.amount}</p>
                  </td>
                  
                  {/* Method */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icons.PaymentIcon className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{payment.method}</span>
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{payment.date}</p>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                        View Details
                      </button>
                      {payment.status === 'Completed' && (
                        <button
                          onClick={() => handleRefund(payment.id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Refund
                        </button>
                      )}
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
              of {filteredPayments.length} transactions
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

      {/* Payment Method Breakdown */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {methods.filter(m => m !== 'All').map((method) => {
            const methodPayments = payments.filter(p => p.method === method);
            const methodRevenue = methodPayments.reduce((sum, p) => {
              if (p.status === 'Completed') {
                return sum + parseFloat(p.amount.replace('$', '').replace(',', ''));
              }
              return sum;
            }, 0);
            
            return (
              <div key={method} className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-600 mb-1">{method}</p>
                <p className="text-xl font-bold text-slate-900">${methodRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{methodPayments.length} transactions</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PaymentManagementView;

