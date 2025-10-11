import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import { MOCK_NOTIFICATIONS } from '../../../utils/adminMockData';

function NotificationManagementView() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'System',
    recipients: 'All Users'
  });

  const handleSendNotification = (e) => {
    e.preventDefault();
    const newNotification = {
      id: `NOT${Date.now()}`,
      ...formData,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Sent'
    };
    setNotifications([newNotification, ...notifications]);
    setFormData({ title: '', message: '', type: 'System', recipients: 'All Users' });
    setShowCreateModal(false);
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Sent</p>
              <p className="text-2xl font-bold text-slate-800">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icons.MailIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">System</p>
              <p className="text-2xl font-bold text-slate-800">
                {notifications.filter(n => n.type === 'System').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icons.NotificationIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Alerts</p>
              <p className="text-2xl font-bold text-slate-800">
                {notifications.filter(n => n.type === 'Alert').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icons.ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Delivery Rate</p>
              <p className="text-2xl font-bold text-slate-800">98.5%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icons.TrendIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Notification Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Icons.NotificationIcon className="h-5 w-5" />
          Send New Notification
        </button>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Notification History</h3>
        </div>
        
        <div className="divide-y divide-slate-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-slate-900">{notification.title}</h4>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      notification.type === 'System' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'Alert' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {notification.type}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      {notification.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Icons.UsersIcon className="h-4 w-4" />
                      {notification.recipients}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icons.ClockIcon className="h-4 w-4" />
                      {notification.sentDate}
                    </span>
                    <span>ID: {notification.id}</span>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowCreateModal(false)}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all max-w-2xl w-full">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Send Notification</h3>
                    <p className="text-sm text-indigo-100 mt-1">Broadcast message to users</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <Icons.CloseIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendNotification}>
                <div className="px-6 py-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notification Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="System">System</option>
                        <option value="Alert">Alert</option>
                        <option value="Promo">Promo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Recipients *
                      </label>
                      <select
                        value={formData.recipients}
                        onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="All Users">All Users</option>
                        <option value="Active Subscribers">Active Subscribers</option>
                        <option value="Premium Users">Premium Users</option>
                        <option value="New Users">New Users</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Icons.MailIcon className="h-4 w-4" />
                    Send Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationManagementView;

