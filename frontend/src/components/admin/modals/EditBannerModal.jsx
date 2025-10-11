import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';

function EditBannerModal({ banner, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: banner.title,
    description: banner.description,
    image: null,
    order: banner.order
  });
  const [imagePreview, setImagePreview] = useState(banner.image);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please upload a valid image file' });
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setErrors({ ...errors, image: '' });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(banner.image);
    const fileInput = document.getElementById('edit-banner-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be 1 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedBanner = {
        ...banner,
        title: formData.title,
        description: formData.description,
        image: imagePreview,
        order: parseInt(formData.order)
      };
      
      onSave(updatedBanner);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-xl shadow-2xl transform transition-all max-w-xl w-full max-h-[85vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Edit Banner</h3>
                <p className="text-xs text-purple-100 mt-0.5">Update banner details</p>
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
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Banner Image
                </label>
                
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Banner Preview"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="edit-banner-image-upload"
                  />
                  <label
                    htmlFor="edit-banner-image-upload"
                    className="absolute bottom-2 right-2 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                  >
                    Change Image
                  </label>
                </div>
                {errors.image && (
                  <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                )}
              </div>

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
                  <Icons.CheckIcon className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBannerModal;




