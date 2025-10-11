import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';

function ApproveRejectModal({ product, onClose, onApprove, onReject }) {
  const [action, setAction] = useState('approve'); // 'approve' or 'reject'
  const [message, setMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [errors, setErrors] = useState({});

  const commonRejectionReasons = [
    'Missing required documentation',
    'Poor quality images',
    'Inappropriate content',
    'Pricing violation',
    'Duplicate listing',
    'Incomplete information',
    'Terms of service violation'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (action === 'reject' && !rejectionReason.trim()) {
      setErrors({ rejectionReason: 'Please provide a reason for rejection' });
      return;
    }
    
    if (action === 'approve') {
      onApprove(product, message);
    } else {
      onReject(product, rejectionReason);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all max-w-2xl w-full">
          {/* Header */}
          <div className={`px-6 py-4 ${
            action === 'approve' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-red-500 to-pink-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {action === 'approve' ? 'Approve Product' : 'Reject Product'}
                </h3>
                <p className="text-sm text-white/90 mt-1">{product.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Icons.CloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              {/* Product Preview */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{product.title}</p>
                    <p className="text-sm text-slate-600">{product.category}</p>
                    <p className="text-sm text-slate-600">Owner: {product.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">${product.price}</p>
                    <p className="text-xs text-slate-500">{product.priceType}</p>
                  </div>
                </div>
              </div>

              {/* Action Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Action *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAction('approve')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      action === 'approve'
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`p-3 rounded-full mb-2 ${
                        action === 'approve' ? 'bg-green-500' : 'bg-slate-200'
                      }`}>
                        <Icons.CheckIcon className={`h-6 w-6 ${
                          action === 'approve' ? 'text-white' : 'text-slate-500'
                        }`} />
                      </div>
                      <span className={`font-semibold ${
                        action === 'approve' ? 'text-green-700' : 'text-slate-600'
                      }`}>
                        Approve
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        Make product live
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAction('reject')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      action === 'reject'
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`p-3 rounded-full mb-2 ${
                        action === 'reject' ? 'bg-red-500' : 'bg-slate-200'
                      }`}>
                        <Icons.CloseIcon className={`h-6 w-6 ${
                          action === 'reject' ? 'text-white' : 'text-slate-500'
                        }`} />
                      </div>
                      <span className={`font-semibold ${
                        action === 'reject' ? 'text-red-700' : 'text-slate-600'
                      }`}>
                        Reject
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        Decline product
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Approve Section */}
              {action === 'approve' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Approval Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a message to send to the product owner..."
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      This message will be sent via email to the owner
                    </p>
                  </div>
                </div>
              )}

              {/* Reject Section */}
              {action === 'reject' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quick Select Reason
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonRejectionReasons.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setRejectionReason(reason)}
                          className={`px-3 py-2 text-xs text-left rounded-lg border transition-colors ${
                            rejectionReason === reason
                              ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => {
                        setRejectionReason(e.target.value);
                        if (errors.rejectionReason) {
                          setErrors({});
                        }
                      }}
                      placeholder="Provide a detailed reason for rejection..."
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                        errors.rejectionReason ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {errors.rejectionReason && (
                      <p className="mt-1 text-sm text-red-600">{errors.rejectionReason}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      This reason will be sent to the product owner
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
              <p className="text-sm text-slate-500">
                {action === 'approve' 
                  ? 'Product will be marked as Active' 
                  : '* Reason is required for rejection'
                }
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
                    action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {action === 'approve' ? (
                    <>
                      <Icons.CheckIcon className="h-4 w-4" />
                      Approve Product
                    </>
                  ) : (
                    <>
                      <Icons.CloseIcon className="h-4 w-4" />
                      Reject Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApproveRejectModal;


