import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';

function CreateBannerModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    order: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please upload a valid image file' });
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setErrors({ ...errors, image: '' });
      
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
    // Reset file input
    const fileInput = document.getElementById('banner-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Banner image is required';
    }
    
    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be 1 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const banner = {
        id: `BAN${Date.now()}`,
        title: formData.title,
        description: formData.description,
        image: imagePreview,
        order: parseInt(formData.order),
        status: 'Active',
        clicks: 0,
        impressions: 0,
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString()
      };
      
      onSave(banner);
      onClose();
    }
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
        <div className="relative bg-white rounded-xl shadow-2xl transform transition-all max-w-xl w-full max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Create New Banner</h3>
                <p className="text-xs text-purple-100 mt-0.5">Design promotional banner</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Icons.CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-4 py-4">
              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Banner Image *
                </label>
                
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="banner-image-upload"
                    />
                    <label
                      htmlFor="banner-image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                        errors.image ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center py-3">
                        <svg className="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-xs text-slate-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">PNG, JPG, GIF (Max 5MB)</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      className="w-full h-40 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Icons.CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {errors.image && (
                  <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Banner Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Summer Rental Specials 2024"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Display Order */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Display Order *
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="e.g., 1, 2, 3..."
                  min="1"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.order ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.order && (
                  <p className="mt-1 text-xs text-red-600">{errors.order}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Lower numbers appear first
                </p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Banner Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the banner campaign..."
                  rows={4}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-slate-500 text-right">
                  {formData.description.length} characters
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-200 sticky bottom-0">
              <p className="text-xs text-slate-500">* Required</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <Icons.BannerIcon className="h-3.5 w-3.5" />
                  Create Banner
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBannerModal;

