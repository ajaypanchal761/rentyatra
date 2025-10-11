import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';

function SendEmailModal({ user, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    // Add email sending logic here
    console.log('Sending email to:', user.email, formData);
    alert(`Email sent successfully to ${user.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all max-w-2xl w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Send Email</h3>
                <p className="text-sm text-indigo-100 mt-1">Compose and send email to user</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Icons.CloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSend}>
            <div className="px-6 py-6">
              {/* Recipient Info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sending to:
                </label>
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-indigo-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Image (Optional)
                </label>
                
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-slate-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Icons.CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter email title"
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter your message here..."
                  rows={8}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {formData.description.length} characters
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Icons.MailIcon className="h-4 w-4" />
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendEmailModal;
