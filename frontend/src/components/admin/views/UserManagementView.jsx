import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import SendEmailModal from '../modals/SendEmailModal';
import ViewUserModal from '../modals/ViewUserModal';
import EditUserModal from '../modals/EditUserModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import { MOCK_ALL_USERS } from '../../../utils/adminMockData';

function UserManagementView() {
  const [users, setUsers] = useState(MOCK_ALL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  
  // Modal states
  const [emailingUser, setEmailingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    const matchesPlan = filterPlan === 'All' || user.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBlockUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u
    ));
    setOpenActionMenu(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleExport = () => {
    console.log('Exporting users...', filteredUsers);
    alert('User data exported successfully!');
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  return (
    <div>
      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header with Filters */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
              <p className="text-sm text-slate-500 mt-1">Manage and monitor all users</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Icons.DownloadIcon className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                <Icons.UserPlusIcon className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <input 
                type="text" 
                placeholder="Search by name, email or ID..." 
                className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                value={searchTerm} 
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Icons.SearchIcon className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Status Filter */}
            <select 
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Banned">Banned</option>
            </select>

            {/* Plan Filter */}
            <select 
              value={filterPlan}
              onChange={(e) => {
                setFilterPlan(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-sm font-medium text-indigo-900">
                {selectedUsers.length} user(s) selected
              </span>
              <button 
                onClick={handleBulkDelete}
                className="ml-auto text-sm font-medium text-red-600 hover:text-red-700"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Aadhar</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Send Email</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full border-2 border-slate-200" src={user.avatar} alt={user.name} />
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <p className="text-xs text-slate-400 font-mono">#{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'Banned' ? 'bg-red-100 text-red-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <span className={`h-2 w-2 mr-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500' : 
                        user.status === 'Banned' ? 'bg-red-500' : 
                        'bg-slate-500'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {(user.aadharCardFront && user.aadharCardBack) ? (
                        <button
                          onClick={() => setViewingUser(user)}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                          title="View Both Sides of Aadhar Card"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Both Verified
                        </button>
                      ) : (user.aadharCardFront || user.aadharCardBack) ? (
                        <button
                          onClick={() => setViewingUser(user)}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors cursor-pointer"
                          title="Only one side uploaded"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Partial
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800">
                          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Not Uploaded
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{user.joinedDate}</p>
                  </td>
                  
                  {/* Send Email Column */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => setEmailingUser(user)}
                        className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Icons.MailIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>

                  {/* Actions Dropdown Column */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenActionMenu(openActionMenu === user.id ? null : user.id)} 
                          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Icons.MoreVertIcon className="h-5 w-5" />
                        </button>
                        
                        {openActionMenu === user.id && (
                          <>
                            {/* Backdrop to close menu */}
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenActionMenu(null)}
                            ></div>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-2 border border-slate-200">
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <Icons.EditIcon className="h-4 w-4 text-green-600" />
                                <span>Edit User</span>
                              </button>
                              
                              <button
                                onClick={() => handleBlockUser(user.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                              >
                                <Icons.BlockIcon className={`h-4 w-4 ${user.status === 'Banned' ? 'text-green-600' : 'text-orange-600'}`} />
                                <span className={user.status === 'Banned' ? 'text-green-700' : 'text-orange-700'}>
                                  {user.status === 'Banned' ? 'Unblock User' : 'Block User'}
                                </span>
                              </button>
                              
                              <div className="border-t border-slate-100 my-1"></div>
                              
                              <button
                                onClick={() => {
                                  setDeletingUser(user);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Icons.TrashIcon className="h-4 w-4" />
                                <span>Delete User</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Icons.UsersIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No users found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> of{' '}
              <span className="font-semibold">{filteredUsers.length}</span> users
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icons.ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icons.ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {emailingUser && <SendEmailModal user={emailingUser} onClose={() => setEmailingUser(null)} />}
      {viewingUser && <ViewUserModal user={viewingUser} onClose={() => setViewingUser(null)} onEdit={setEditingUser} />}
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
      {deletingUser && <DeleteConfirmModal user={deletingUser} onClose={() => setDeletingUser(null)} onConfirm={handleDeleteUser} />}
    </div>
  );
}

export default UserManagementView;
