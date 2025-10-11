import * as Icons from '../icons/AdminIcons';

function ViewUserModal({ user, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Icons.CloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-20 w-20 rounded-full border-4 border-indigo-100"
              />
              <div>
                <h4 className="text-2xl font-bold text-slate-800">{user.name}</h4>
                <p className="text-slate-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'Banned' ? 'bg-red-100 text-red-800' : 
                    'bg-slate-100 text-slate-800'
                  }`}>
                    <span className={`h-2 w-2 mr-2 rounded-full ${
                      user.status === 'Active' ? 'bg-green-500' : 
                      user.status === 'Banned' ? 'bg-red-500' : 
                      'bg-slate-500'
                    }`}></span>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            {/* User Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">User ID</label>
                <p className="text-slate-800 font-mono font-semibold">#{user.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Subscription Plan</label>
                <p className="text-slate-800 font-semibold">{user.plan}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Join Date</label>
                <p className="text-slate-800">{user.joinedDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Account Status</label>
                <p className="text-slate-800">{user.status}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Total Products</label>
                <p className="text-slate-800 font-semibold">15</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Total Bookings</label>
                <p className="text-slate-800 font-semibold">23</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Revenue Generated</label>
                <p className="text-green-600 font-bold">$2,450</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Last Login</label>
                <p className="text-slate-800">2 hours ago</p>
              </div>
            </div>

            {/* Aadhar Card Verification */}
            {(user.aadharCardFront || user.aadharCardBack) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Aadhar Card Verification
                </h5>
                <div className="bg-slate-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Both Sides Verified
                    </span>
                  </div>

                  {/* Front and Back Side Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Front Side */}
                    {user.aadharCardFront && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-slate-700">Front Side</p>
                          <a 
                            href={user.aadharCardFront} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        </div>
                        <img 
                          src={user.aadharCardFront} 
                          alt="Aadhar Front" 
                          className="w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(user.aadharCardFront, '_blank')}
                        />
                      </div>
                    )}

                    {/* Back Side */}
                    {user.aadharCardBack && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-slate-700">Back Side</p>
                          <a 
                            href={user.aadharCardBack} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        </div>
                        <img 
                          src={user.aadharCardBack} 
                          alt="Aadhar Back" 
                          className="w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(user.aadharCardBack, '_blank')}
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    These documents are securely stored and encrypted
                  </p>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-slate-700 mb-3">Recent Activity</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Listed a new product</span>
                  <span className="text-xs text-slate-400">1 day ago</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Renewed subscription</span>
                  <span className="text-xs text-slate-400">3 days ago</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Completed a booking</span>
                  <span className="text-xs text-slate-400">5 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUserModal;




